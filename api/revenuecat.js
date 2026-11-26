/**
 * RevenueCat's webhooks: full access bought in the iPhone app through Apple becomes a licence in Supabase, like a
 * Paddle payment (api/paddle.js). The logic is in api/_revenuecat.js (tested in apps/web/test/revenuecat.test.js).
 *
 * In RevenueCat → Project → Integrations → Webhooks: the URL https://thenahwi.com/api/revenuecat/ (with the slash;
 * without it the site redirects) and an Authorization header value, which is the secret below.
 *
 * Vercel environment variables:
 *   REVENUECAT_WEBHOOK_AUTH    the Authorization header value set in RevenueCat (a long random string)
 *   SUPABASE_SERVICE_ROLE_KEY  the Supabase secret key, which may write licences
 *
 * Answers 200 once the licence is written (or the event is not one we keep), 401 for a wrong header, 500 when the
 * database refuses, so that RevenueCat tries again later.
 */
import { licenceFromRevenueCat, transferFromRevenueCat, verifyAuth } from "./_revenuecat.js";

const SUPABASE_URL = "https://replace-with-the-nahwi-project.supabase.co";
const json = (data, status = 200) => Response.json(data, { status });

export async function POST(request) {
  const secret = (process.env.REVENUECAT_WEBHOOK_AUTH || "").trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  if (!secret || !key) return json({ ok: false, error: "unconfigured" }, 503);
  if (!verifyAuth(request.headers.get("authorization"), secret)) {
    console.warn("revenuecat authorization refused", { given: !!request.headers.get("authorization") });
    return json({ ok: false, reason: "authorization" }, 401);
  }

  let body;
  try { body = JSON.parse(await request.text()); } catch { return json({ ok: false }, 400); }
  const type = body?.event?.type;
  const headers = { apikey: key, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" };
  if (key.startsWith("eyJ")) headers.Authorization = `Bearer ${key}`;

  // Purchases restored on another account: the Apple licences move with them.
  const transfer = transferFromRevenueCat(body);
  if (transfer) {
    const users = transfer.from.map(encodeURIComponent).join(",");
    const r = await fetch(`${SUPABASE_URL}/rest/v1/licences?user_id=in.(${users})&provider_id=like.apple:*`, {
      method: "PATCH",
      headers: { ...headers, Prefer: "return=minimal" },
      body: JSON.stringify({ user_id: transfer.to, updated_at: new Date().toISOString() }),
    });
    if (!r.ok) {
      console.error("revenuecat TRANSFER supabase", r.status, (await r.text()).slice(0, 300));
      return json({ ok: false }, 500);
    }
    console.log("revenuecat TRANSFER", transfer.from.length, "→", transfer.to);
    return json({ ok: true, kept: true, transfer: true });
  }

  const row = licenceFromRevenueCat(body);
  if (!row) {
    console.log("revenuecat", type, "not kept", body?.event?.environment ?? "");
    return json({ ok: true, kept: false });
  }
  const r = await fetch(`${SUPABASE_URL}/rest/v1/licences?on_conflict=provider_id`, { method: "POST", headers, body: JSON.stringify(row) });
  if (!r.ok) {
    console.error("revenuecat", type, row.provider_id, "supabase", r.status, (await r.text()).slice(0, 300));
    return json({ ok: false }, 500);
  }
  console.log("revenuecat", type, body?.event?.environment ?? "", row.provider_id, row.status, "until", row.ends_at);
  return json({ ok: true, kept: true });
}
