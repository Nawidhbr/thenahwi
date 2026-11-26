/**
 * The start of Google's sign-in in the iPhone app (api/sign-in.js): the system's sign-in window names the host of the
 * address it opens first ("The Nahwi wants to use … to sign in"), so the app opens thenahwi.com, which sends the
 * reader on to Supabase's own sign-in address. Only that address is let through, and only for the app's way back
 * (thenahwi://), so this is no open redirect. Tested in apps/web/test/app-ios.test.ts.
 */
export const SUPABASE_URL = "https://replace-with-the-nahwi-project.supabase.co";
export const APP_SCHEME = "thenahwi";

/** The Supabase sign-in address to send the reader to, or null when `to` is not one. */
export function authorizeTarget(to, supabaseUrl = SUPABASE_URL) {
  let u;
  try {
    u = new URL(String(to ?? ""));
  } catch {
    return null;
  }
  if (u.origin !== new URL(supabaseUrl).origin || u.pathname !== "/auth/v1/authorize" || u.username || u.password) return null;
  const back = u.searchParams.get("redirect_to") || "";
  if (!back.startsWith(`${APP_SCHEME}://`)) return null;
  return u.href;
}
