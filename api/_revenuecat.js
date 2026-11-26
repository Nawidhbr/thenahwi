/**
 * RevenueCat's webhooks for full access bought in the iPhone app through Apple (apps/web/src/lib/app-store.ts): the
 * same licence rows as a Paddle payment (api/_paddle.js), so access, the account page and every device work alike.
 * Plain functions without I/O, used by api/revenuecat.js and tested in apps/web/test/revenuecat.test.js.
 *
 * The app tells RevenueCat who the reader is by the account's id (app_user_id). A subscription is one licence for
 * all its renewals, keyed by Apple's original transaction ("apple:<id>"). The app sells a monthly and a yearly
 * subscription; a one-time purchase would be a licence without an end (none is sold since 25 November 2026).
 */
import { timingSafeEqual } from "node:crypto";
import { GRACE_DAYS } from "./_paddle.js";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const iso = (ms) => (Number.isFinite(Number(ms)) && Number(ms) > 0 ? new Date(Number(ms)).toISOString() : null);
const plusDays = (isoDate, days) => new Date(Date.parse(isoDate) + days * 86400000).toISOString();
/** Where a reader manages (cancels) an App Store subscription. */
export const APPLE_MANAGE_URL = "https://apps.apple.com/account/subscriptions";

/** Whether the Authorization header is the one set for the webhook in RevenueCat (compared in constant time). */
export function verifyAuth(header, secret) {
  if (!header || !secret) return false;
  const given = String(header).replace(/^Bearer\s+/i, "").trim();
  const want = String(secret).replace(/^Bearer\s+/i, "").trim();
  const a = Buffer.from(given);
  const b = Buffer.from(want);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** The reader an event is about: the app user id if it is an account's id, else the first alias that is. */
export function readerOf(e) {
  const ids = [e?.app_user_id, e?.original_app_user_id, ...(Array.isArray(e?.aliases) ? e.aliases : [])];
  return ids.find((x) => UUID.test(String(x || ""))) ?? null;
}

/** A one-time purchase (lifetime access) rather than a subscription. */
const isLifetime = (e) => e?.type === "NON_RENEWING_PURCHASE" || (!e?.expiration_at_ms && e?.period_type !== "TRIAL" && /lifetime/i.test(String(e?.product_id || "")));

/**
 * The licence row for a RevenueCat event, or null when the event writes none (a test, a transfer, another store, an
 * event that names no account). `now` is an ISO time.
 */
export function licenceFromRevenueCat(body, now = new Date().toISOString()) {
  const e = body?.event;
  const type = String(e?.type || "");
  if (!e || type === "TEST" || type === "TRANSFER") return null;
  if (e.store && e.store !== "APP_STORE" && e.store !== "MAC_APP_STORE") return null;
  const user = readerOf(e);
  const txn = e.original_transaction_id || e.transaction_id;
  if (!user || !txn) return null;
  const base = {
    provider_id: `apple:${txn}`,
    user_id: user,
    kind: "personal",
    seats: null,
    starts_at: iso(e.purchased_at_ms) || now,
    price_id: e.product_id ? String(e.product_id).slice(0, 80) : null,
    update_url: null,
    updated_at: now,
  };
  // A refund (Apple's customer support) ends the access now, whatever was bought.
  const refunded = type === "CANCELLATION" && e.cancel_reason === "CUSTOMER_SUPPORT";
  if (isLifetime(e)) {
    if (type === "CANCELLATION" && !refunded) return null;
    return { ...base, ends_at: refunded ? now : null, status: refunded ? "refunded" : "lifetime", manage_url: null };
  }
  const expires = iso(e.expiration_at_ms);
  let ends;
  let status;
  if (refunded) { ends = now; status = "refunded"; }
  else if (type === "EXPIRATION") { ends = expires || now; status = "expired"; }
  else if (type === "CANCELLATION") { ends = expires || now; status = "canceled"; }
  else if (type === "BILLING_ISSUE") { ends = iso(e.grace_period_expiration_at_ms) || expires || now; status = "past_due"; }
  else if (["INITIAL_PURCHASE", "RENEWAL", "UNCANCELLATION", "PRODUCT_CHANGE", "SUBSCRIPTION_EXTENDED", "TEMPORARY_ENTITLEMENT_GRANT", "REFUND_REVERSED"].includes(type)) {
    if (!expires) return null;
    ends = plusDays(expires, GRACE_DAYS);
    status = "active";
  } else return null;
  return { ...base, ends_at: ends, status, manage_url: APPLE_MANAGE_URL };
}

/**
 * A transfer of purchases from one account to another (a reader restored them while signed in to another account):
 * { from: [account ids], to: account id }, or null.
 */
export function transferFromRevenueCat(body) {
  const e = body?.event;
  if (e?.type !== "TRANSFER") return null;
  const from = (Array.isArray(e.transferred_from) ? e.transferred_from : []).filter((x) => UUID.test(String(x)));
  const to = (Array.isArray(e.transferred_to) ? e.transferred_to : []).find((x) => UUID.test(String(x)));
  return from.length && to ? { from, to } : null;
}
