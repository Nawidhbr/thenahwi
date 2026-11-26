/**
 * /api/sign-in/?to=<Supabase sign-in address>: where the iPhone app's sign-in window starts for Google, so that the
 * window names thenahwi.com rather than the Supabase project's host. It sends the reader straight on to Supabase
 * (302); anything else answers 400. The check is in api/_signin.js; the app's side in apps/web/src/lib/app-signin.ts.
 */
import { authorizeTarget } from "./_signin.js";

export function GET(request) {
  const target = authorizeTarget(new URL(request.url).searchParams.get("to"));
  if (!target) return new Response("Not a sign-in address", { status: 400, headers: { "Cache-Control": "no-store" } });
  return new Response(null, {
    status: 302,
    headers: { Location: target, "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" },
  });
}
