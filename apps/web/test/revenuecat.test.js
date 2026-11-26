import { describe, expect, it } from "vitest";
import { GRACE_DAYS } from "../../../api/_paddle.js";
import { APPLE_MANAGE_URL, licenceFromRevenueCat, readerOf, transferFromRevenueCat, verifyAuth } from "../../../api/_revenuecat.js";

// RevenueCat's webhooks (api/revenuecat.js): full access bought through Apple in the iPhone app becomes the same
// licence as a payment with Paddle.
const user = "11111111-1111-1111-1111-111111111111";
const other = "22222222-2222-2222-2222-222222222222";
const now = "2026-11-25T12:00:00.000Z";
const t = (s) => Date.parse(s);
const event = (over = {}) => ({
  api_version: "1.0",
  event: {
    type: "INITIAL_PURCHASE",
    store: "APP_STORE",
    environment: "PRODUCTION",
    app_user_id: user,
    original_app_user_id: user,
    aliases: [user],
    product_id: "com.thenahwi.full.monthly",
    period_type: "NORMAL",
    purchased_at_ms: t("2026-11-25T11:59:00Z"),
    expiration_at_ms: t("2026-12-25T11:59:00Z"),
    transaction_id: "2000000111",
    original_transaction_id: "2000000100",
    ...over,
  },
});

describe("the webhook's header", () => {
  it("must be the secret set in RevenueCat", () => {
    expect(verifyAuth("s3cret-value", "s3cret-value")).toBe(true);
    expect(verifyAuth("Bearer s3cret-value", "s3cret-value")).toBe(true);
    expect(verifyAuth("s3cret-valuf", "s3cret-value")).toBe(false);
    expect(verifyAuth("", "s3cret-value")).toBe(false);
    expect(verifyAuth("x", "")).toBe(false);
  });
});

describe("a monthly subscription", () => {
  it("is one licence for all its renewals, open until the period ends and a few days more", () => {
    const row = licenceFromRevenueCat(event(), now);
    expect(row).toMatchObject({ provider_id: "apple:2000000100", user_id: user, kind: "personal", status: "active", price_id: "com.thenahwi.full.monthly", manage_url: APPLE_MANAGE_URL });
    expect(row.ends_at).toBe(new Date(t("2026-12-25T11:59:00Z") + GRACE_DAYS * 86400000).toISOString());
    const renewed = licenceFromRevenueCat(event({ type: "RENEWAL", transaction_id: "2000000222", expiration_at_ms: t("2027-01-25T11:59:00Z") }), now);
    expect(renewed.provider_id).toBe("apple:2000000100");
    expect(renewed.ends_at > row.ends_at).toBe(true);
  });
  it("stays open to the end of the month paid for when cancelled, and closes when it expires", () => {
    expect(licenceFromRevenueCat(event({ type: "CANCELLATION", cancel_reason: "UNSUBSCRIBE" }), now)).toMatchObject({ status: "canceled", ends_at: "2026-12-25T11:59:00.000Z" });
    expect(licenceFromRevenueCat(event({ type: "EXPIRATION", expiration_reason: "UNSUBSCRIBE" }), now)).toMatchObject({ status: "expired", ends_at: "2026-12-25T11:59:00.000Z" });
  });
  it("keeps Apple's grace period through a billing problem", () => {
    const row = licenceFromRevenueCat(event({ type: "BILLING_ISSUE", grace_period_expiration_at_ms: t("2026-12-31T00:00:00Z") }), now);
    expect(row).toMatchObject({ status: "past_due", ends_at: "2026-12-31T00:00:00.000Z" });
  });
  it("ends at once when Apple refunds it", () => {
    expect(licenceFromRevenueCat(event({ type: "CANCELLATION", cancel_reason: "CUSTOMER_SUPPORT" }), now)).toMatchObject({ status: "refunded", ends_at: now });
  });
});

describe("lifetime access", () => {
  const life = (over = {}) => event({ type: "NON_RENEWING_PURCHASE", product_id: "com.thenahwi.full.lifetime", expiration_at_ms: null, transaction_id: "2000000300", original_transaction_id: "2000000300", ...over });
  it("is a licence without an end", () => {
    expect(licenceFromRevenueCat(life(), now)).toMatchObject({ provider_id: "apple:2000000300", status: "lifetime", ends_at: null, manage_url: null });
  });
  it("ends when it is refunded", () => {
    expect(licenceFromRevenueCat(life({ type: "CANCELLATION", cancel_reason: "CUSTOMER_SUPPORT" }), now)).toMatchObject({ provider_id: "apple:2000000300", status: "refunded", ends_at: now });
  });
});

describe("events that write nothing", () => {
  it("a test, another store, or no account", () => {
    expect(licenceFromRevenueCat(event({ type: "TEST" }), now)).toBeNull();
    expect(licenceFromRevenueCat(event({ store: "PLAY_STORE" }), now)).toBeNull();
    expect(licenceFromRevenueCat(event({ app_user_id: "$RCAnonymousID:abc", original_app_user_id: "$RCAnonymousID:abc", aliases: [] }), now)).toBeNull();
    expect(licenceFromRevenueCat({}, now)).toBeNull();
  });
  it("finds the account among the aliases", () => {
    expect(readerOf({ app_user_id: "$RCAnonymousID:abc", aliases: ["$RCAnonymousID:abc", user] })).toBe(user);
  });
});

describe("a transfer", () => {
  it("moves the purchases to the account that restored them", () => {
    expect(transferFromRevenueCat({ event: { type: "TRANSFER", transferred_from: [user, "$RCAnonymousID:x"], transferred_to: [other] } })).toEqual({ from: [user], to: other });
    expect(transferFromRevenueCat(event())).toBeNull();
    expect(licenceFromRevenueCat({ event: { type: "TRANSFER", transferred_from: [user], transferred_to: [other] } }, now)).toBeNull();
  });
});
