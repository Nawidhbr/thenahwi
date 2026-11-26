import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { GRACE_DAYS, licenceFromEvent, refilledHearts, refillFromEvent, refundFromEvent, verifySignature } from "../../../api/_paddle.js";

// Paddle's webhooks (api/paddle.js): only signed events count, and a subscription becomes a licence with the right end.

const secret = "pdl_ntfset_test_secret";
const sign = (body, ts) => `ts=${ts};h1=${createHmac("sha256", secret).update(`${ts}:${body}`).digest("hex")}`;
const user = "11111111-1111-1111-1111-111111111111";
const now = "2026-11-08T12:00:00.000Z";

describe("the signature", () => {
  const body = '{"event_type":"subscription.created"}';
  const ts = 1_800_000_000;
  it("accepts Paddle's signature", () => {
    expect(verifySignature(sign(body, ts), body, secret, ts + 10)).toBe(true);
  });
  it("refuses a changed body, a wrong secret, an old signature or none", () => {
    expect(verifySignature(sign(body, ts), body + " ", secret, ts)).toBe(false);
    expect(verifySignature(sign(body, ts), body, "other", ts)).toBe(false);
    expect(verifySignature(sign(body, ts), body, secret, ts + 3600)).toBe(false);
    expect(verifySignature(undefined, body, secret, ts)).toBe(false);
    expect(verifySignature("ts=1;h1=zz", body, secret, 1)).toBe(false);
  });
});

const sub = (over = {}) => ({
  event_type: "subscription.updated",
  data: {
    id: "sub_01",
    status: "active",
    custom_data: { user_id: user },
    started_at: "2026-11-01T10:00:00Z",
    current_billing_period: { starts_at: "2026-11-01T10:00:00Z", ends_at: "2026-12-01T10:00:00Z" },
    items: [{ price: { id: "pri_month" }, quantity: 1 }],
    management_urls: { cancel: "https://sandbox-buyer-portal.paddle.com/cancel", update_payment_method: "https://sandbox-buyer-portal.paddle.com/pay" },
    ...over,
  },
});

describe("the licence", () => {
  it("an active subscription runs to the end of its period, plus a few days' grace", () => {
    const row = licenceFromEvent(sub(), now);
    expect(row).toMatchObject({ provider_id: "sub_01", user_id: user, kind: "personal", status: "active", price_id: "pri_month", starts_at: "2026-11-01T10:00:00Z" });
    expect(Date.parse(row.ends_at) - Date.parse("2026-12-01T10:00:00Z")).toBe(GRACE_DAYS * 86400000);
    expect(row.manage_url).toMatch(/^https:/);
  });
  it("a cancellation at the period's end keeps access until then", () => {
    const row = licenceFromEvent(sub({ scheduled_change: { action: "cancel", effective_at: "2026-12-01T10:00:00Z" } }), now);
    expect(row.ends_at).toBe("2026-12-01T10:00:00Z");
  });
  it("a cancelled subscription ends when it was cancelled", () => {
    expect(licenceFromEvent(sub({ status: "canceled", canceled_at: "2026-11-05T00:00:00Z" }), now).ends_at).toBe("2026-11-05T00:00:00Z");
  });
  it("a class licence counts its seats", () => {
    const row = licenceFromEvent(sub({ custom_data: { user_id: user, kind: "class" }, items: [{ price: { id: "pri_class" }, quantity: 25 }] }), now);
    expect(row).toMatchObject({ kind: "class", seats: 25 });
  });
  it("keeps nothing without a learner, or for other events", () => {
    expect(licenceFromEvent(sub({ custom_data: {} }), now)).toBeNull();
    expect(licenceFromEvent(sub({ custom_data: { user_id: "1; drop table" } }), now)).toBeNull();
    expect(licenceFromEvent({ event_type: "transaction.completed", data: { id: "txn_1" } }, now)).toBeNull();
  });
  it("drops links that are not https", () => {
    expect(licenceFromEvent(sub({ management_urls: { cancel: "javascript:alert(1)" } }), now).manage_url).toBeNull();
  });
});

describe("lifetime access", () => {
  const user = "11111111-1111-1111-1111-111111111111";
  const now = "2026-11-18T20:00:00.000Z";
  it("a completed one-time payment of kind lifetime is full access for good, keyed by the transaction", () => {
    const row = licenceFromEvent({ event_type: "transaction.completed", data: { id: "txn_1", billed_at: now, custom_data: { user_id: user, kind: "lifetime" }, items: [{ price: { id: "pri_life" } }] } }, now);
    expect(row).toMatchObject({ provider_id: "txn_1", user_id: user, ends_at: null, status: "lifetime", price_id: "pri_life", kind: "personal" });
  });
  it("other completed payments are not a licence (subscriptions come as subscription events)", () => {
    expect(licenceFromEvent({ event_type: "transaction.completed", data: { id: "txn_2", custom_data: { user_id: user } } }, now)).toBeNull();
    expect(licenceFromEvent({ event_type: "transaction.completed", data: { id: "txn_3", custom_data: { user_id: "x", kind: "lifetime" } } }, now)).toBeNull();
  });
  it("an approved refund ends the purchase it names", () => {
    expect(refundFromEvent({ event_type: "adjustment.updated", data: { action: "refund", status: "approved", transaction_id: "txn_1" } }, now)).toEqual({ provider_id: "txn_1", ends_at: now });
    expect(refundFromEvent({ event_type: "adjustment.created", data: { action: "refund", status: "pending_approval", transaction_id: "txn_1" } }, now)).toBeNull();
    expect(refundFromEvent({ event_type: "adjustment.created", data: { action: "credit", status: "approved", transaction_id: "txn_1" } }, now)).toBeNull();
    expect(refundFromEvent({ event_type: "transaction.completed", data: {} }, now)).toBeNull();
  });
});

describe("a hearts refill", () => {
  const user = "11111111-1111-1111-1111-111111111111";
  it("is a completed transaction marked kind hearts, with the learner", () => {
    expect(refillFromEvent({ event_type: "transaction.completed", data: { custom_data: { user_id: user, kind: "hearts" } } })).toBe(user);
    expect(refillFromEvent({ event_type: "transaction.paid", data: { custom_data: { user_id: user, kind: "hearts" } } })).toBeNull();
    expect(refillFromEvent({ event_type: "transaction.completed", data: { custom_data: { user_id: user } } })).toBeNull();
    expect(refillFromEvent({ event_type: "transaction.completed", data: { custom_data: { user_id: "x", kind: "hearts" } } })).toBeNull();
    expect(refillFromEvent({ event_type: "subscription.created", data: {} })).toBeNull();
  });
  it("gives all five hearts, refilled now", () => {
    expect(refilledHearts(1000)).toEqual({ n: 5, at: 1000, r: 1000 });
  });
});

describe("the webhook handler (api/paddle.js)", () => {
  it("checks the signature over the raw body and answers like Paddle expects", async () => {
    process.env.PADDLE_WEBHOOK_SECRET = ` ${secret} `;
    process.env.SUPABASE_SERVICE_ROLE_KEY = "sb_secret_test";
    const { POST } = await import("../../../api/paddle.js");
    const body = JSON.stringify({ event_type: "subscription.created", data: { id: "sub_x", custom_data: null } }, null, 2);
    const ts = Math.floor(Date.now() / 1000);
    const ok = await POST(new Request("https://x/api/paddle/", { method: "POST", body, headers: { "paddle-signature": sign(body, ts) } }));
    expect(ok.status).toBe(200);
    expect(await ok.json()).toEqual({ ok: true, kept: false });
    const bad = await POST(new Request("https://x/api/paddle/", { method: "POST", body: body + " ", headers: { "paddle-signature": sign(body, ts) } }));
    expect(bad.status).toBe(401);
  });
});
