/**
 * Paddle Billing for The Nahwi: checking a webhook's signature and turning a subscription into a licence row.
 * Plain functions without I/O, used by api/paddle.js and tested in apps/web/test/paddle.test.js. Files in api/ whose
 * name starts with "_" are not deployed as functions of their own.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

/** Days of access kept after a billing period ends, so a renewal that is a little late does not lock anyone out. */
export const GRACE_DAYS = 3;

/**
 * Whether a webhook body really comes from Paddle: the Paddle-Signature header is "ts=<unix>;h1=<hex>", h1 being an
 * HMAC-SHA256 of "<ts>:<raw body>" with the notification's secret. Older than five minutes counts as false (replay).
 */
export function verifySignature(header, rawBody, secret, nowSeconds = Math.floor(Date.now() / 1000)) {
  if (!header || !secret || typeof rawBody !== "string") return false;
  const parts = Object.fromEntries(String(header).split(";").map((p) => p.split("=").map((x) => x.trim())));
  const ts = Number(parts.ts);
  if (!parts.h1 || !Number.isFinite(ts) || Math.abs(nowSeconds - ts) > 300) return false;
  const want = createHmac("sha256", secret).update(`${parts.ts}:${rawBody}`).digest("hex");
  const a = Buffer.from(want, "hex");
  const b = Buffer.from(String(parts.h1), "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const plusDays = (iso, days) => new Date(Date.parse(iso) + days * 86400000).toISOString();

/**
 * The licence row for a subscription event (subscription.created, .updated, .activated, .canceled, .past_due,
 * .paused, .resumed), or null when the event is not about a subscription or names no learner. The learner is
 * custom_data.user_id, which the checkout passes for a signed-in learner (the pricing page asks to sign in first).
 */
export function licenceFromEvent(event, now = new Date().toISOString()) {
  const type = String(event?.event_type || "");
  const d = event?.data;
  // Lifetime access: one completed payment (custom_data.kind "lifetime"), full access for good. Keyed by the
  // transaction, so a refund of it can end it (refundFromEvent).
  if (type === "transaction.completed" && d?.custom_data?.kind === "lifetime" && typeof d.id === "string") {
    const buyer = d.custom_data.user_id;
    if (!UUID.test(String(buyer || ""))) return null;
    return {
      provider_id: d.id,
      user_id: buyer,
      kind: "personal",
      seats: null,
      starts_at: d.billed_at || d.created_at || now,
      ends_at: null,
      status: "lifetime",
      price_id: d.items?.[0]?.price?.id ?? null,
      manage_url: null,
      update_url: null,
      updated_at: now,
    };
  }
  if (!type.startsWith("subscription.") || !d || typeof d.id !== "string") return null;
  const user = d.custom_data?.user_id;
  if (!UUID.test(String(user || ""))) return null;
  const period = d.current_billing_period || {};
  let ends;
  if (d.status === "canceled" || d.status === "paused") ends = d.canceled_at || d.paused_at || now;
  else if (d.scheduled_change?.action === "cancel" && d.scheduled_change.effective_at) ends = d.scheduled_change.effective_at;
  else if (period.ends_at) ends = plusDays(period.ends_at, GRACE_DAYS);
  else ends = plusDays(now, GRACE_DAYS);
  const url = (u) => (typeof u === "string" && u.startsWith("https://") ? u : null);
  return {
    provider_id: d.id,
    user_id: user,
    kind: d.custom_data?.kind === "class" ? "class" : "personal",
    seats: d.custom_data?.kind === "class" ? Math.max(1, Number(d.items?.[0]?.quantity) || 1) : null,
    starts_at: d.started_at || d.first_billed_at || period.starts_at || d.created_at || now,
    ends_at: ends,
    status: String(d.status || "").slice(0, 30) || null,
    price_id: d.items?.[0]?.price?.id ?? null,
    manage_url: url(d.management_urls?.cancel),
    update_url: url(d.management_urls?.update_payment_method),
    updated_at: now,
  };
}

/**
 * The learner whose hearts a completed transaction refills (a one-time "hearts refill", bought from a test with
 * custom_data { user_id, kind: "hearts" }; scripts/subscribe.ts), or null for any other event.
 */
export function refillFromEvent(event) {
  if (String(event?.event_type || "") !== "transaction.completed") return null;
  const d = event?.data;
  if (d?.custom_data?.kind !== "hearts") return null;
  const user = d.custom_data.user_id;
  return UUID.test(String(user || "")) ? String(user) : null;
}

/** The profile's hearts after a refill at `nowMs` (lib/progress.js refillHearts). */
export const refilledHearts = (nowMs = Date.now()) => ({ n: 5, at: nowMs, r: nowMs });

/**
 * A refund that ends a one-time purchase (lifetime access): an approved refund adjustment names the transaction,
 * which is the lifetime licence's provider_id. Returns { provider_id, ends_at } or null. (A subscription's refund
 * does not end it by itself: the subscription is cancelled in Paddle, docs/operations.md.)
 */
export function refundFromEvent(event, now = new Date().toISOString()) {
  const type = String(event?.event_type || "");
  const d = event?.data;
  if (type !== "adjustment.created" && type !== "adjustment.updated") return null;
  if (d?.action !== "refund" || d?.status !== "approved" || typeof d?.transaction_id !== "string") return null;
  return { provider_id: d.transaction_id, ends_at: now };
}
