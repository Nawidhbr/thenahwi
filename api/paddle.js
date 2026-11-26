/**
 * Paddle's webhooks (Paddle is the merchant of record for full access, config/pricing.ts): every change to a
 * subscription is written to the learner's licence in Supabase, which the site reads (lib/account-sync.ts).
 * The logic is in api/_paddle.js (tested in apps/web/test/paddle.test.js); this file only checks, reads and writes.
 *
 * Written as a web handler (export POST(request)), so the body arrives exactly as Paddle sent it: the signature is
 * over the raw text, and a body that the platform has already parsed and turned back into text would not match.
 * The destination in Paddle is https://thenahwi.com/api/paddle/ (with the slash; without it the site redirects).
 *
 * Vercel environment variables:
 *   PADDLE_WEBHOOK_SECRET      the secret of the notification destination (Paddle → Events → Notifications)
 *   SUPABASE_SERVICE_ROLE_KEY  the Supabase secret key, which may write licences (row-level security does not apply to it)
 * The Supabase address is the public one (apps/web/src/config/supabase-public.ts).
 *
 * Answers 200 once the licence is written (or the event is not one we keep), 401 for a bad signature, 500 when the
 * database refuses, so that Paddle tries again later.
 */
import { licenceFromEvent, refilledHearts, refillFromEvent, refundFromEvent, verifySignature } from "./_paddle.js";

const SUPABASE_URL = "https://replace-with-the-nahwi-project.supabase.co";
const json = (data, status = 200) => Response.json(data, { status });

export async function POST(request) {
  const secret = (process.env.PADDLE_WEBHOOK_SECRET || "").trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  if (!secret || !key) return json({ ok: false, error: "unconfigured" }, 503);

  const body = await request.text();
  const signature = request.headers.get("paddle-signature");
  if (!verifySignature(signature, body, secret)) {
    // Nothing secret in the log: whether a signature came, its timestamp and the body's length, to see what went wrong.
    const ts = /ts=(\d+)/.exec(signature || "")?.[1];
    // Also in the answer, which Paddle shows under Response: why, without anything secret (the secret's form only).
    const why = {
      reason: !signature ? "no signature" : "signature does not match",
      age: ts ? Math.floor(Date.now() / 1000) - Number(ts) : null,
      length: body.length,
      secretForm: secret.startsWith("pdl_ntfset_") ? "ok" : "not a Paddle notification secret",
    };
    console.warn("paddle signature refused", why);
    return json({ ok: false, ...why }, 401);
  }

  let event;
  try { event = JSON.parse(body); } catch { return json({ ok: false }, 400); }
  const headers = { apikey: key, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" };
  // A legacy service-role key is a JWT and also goes in Authorization; the newer secret keys (sb_secret_…) go in apikey only.
  if (key.startsWith("eyJ")) headers.Authorization = `Bearer ${key}`;

  // A hearts refill: all five back, on the learner's profile (the browser picks it up when it syncs).
  const refill = refillFromEvent(event);
  if (refill) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${refill}`, { method: "PATCH", headers: { ...headers, Prefer: "return=minimal" }, body: JSON.stringify({ hearts: refilledHearts() }) });
    if (!r.ok) {
      console.error("paddle", event.event_type, "hearts", refill, "supabase", r.status, (await r.text()).slice(0, 300));
      return json({ ok: false }, 500);
    }
    console.log("paddle", event.event_type, "hearts refilled", refill);
    return json({ ok: true, kept: true, hearts: true });
  }

  // A refund of a lifetime purchase: its licence ends now (a refund of anything else matches no licence).
  const refund = refundFromEvent(event);
  if (refund) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/licences?provider_id=eq.${encodeURIComponent(refund.provider_id)}`, { method: "PATCH", headers: { ...headers, Prefer: "return=minimal" }, body: JSON.stringify({ ends_at: refund.ends_at, status: "refunded", updated_at: refund.ends_at }) });
    if (!r.ok) {
      console.error("paddle", event.event_type, "refund", refund.provider_id, "supabase", r.status, (await r.text()).slice(0, 300));
      return json({ ok: false }, 500);
    }
    console.log("paddle", event.event_type, "refund ends", refund.provider_id);
    return json({ ok: true, kept: true, refund: true });
  }

  const row = licenceFromEvent(event);
  if (!row) {
    console.log("paddle", event?.event_type, "not kept", event?.data?.id ?? "");
    return json({ ok: true, kept: false });
  }

  const r = await fetch(`${SUPABASE_URL}/rest/v1/licences?on_conflict=provider_id`, { method: "POST", headers, body: JSON.stringify(row) });
  if (!r.ok) {
    console.error("paddle", event.event_type, row.provider_id, "supabase", r.status, (await r.text()).slice(0, 300));
    return json({ ok: false }, 500);
  }
  console.log("paddle", event.event_type, row.provider_id, row.status, "until", row.ends_at);
  return json({ ok: true, kept: true });
}
