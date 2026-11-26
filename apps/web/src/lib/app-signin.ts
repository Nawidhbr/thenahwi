// Signing in with Google or Apple. In a browser: Supabase's redirect (PKCE), coming back to `back` with ?code=. In the
// iPhone app: Google refuses its sign-in inside a web view, so it opens in the system's sign-in window
// (store/ios/ios/App/App/WebAuthPlugin.swift) and comes back to thenahwi://auth?code=…, which this page exchanges;
// Apple signs in natively (Face ID), and Supabase checks Apple's token (signInWithIdToken). Either way the page then
// goes to `back`, signed in. docs/accounts-payments.md, "The iPhone app: signing in and buying through Apple".
import type { SupabaseClient } from "@supabase/supabase-js";
import { IOS_APP } from "../config/app";
import { bridge, call, codeOf } from "./native";

export type Provider = "google" | "apple";

/** Starts a sign-in. Resolves with an error to show, or null (also when the reader closed the window). */
export async function oauthSignIn(supabase: SupabaseClient, provider: Provider, back: string): Promise<unknown> {
  if (!bridge()) {
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: back } });
    return error;
  }
  try {
    if (provider === "apple") await appleInApp(supabase);
    else await webAuthInApp(supabase, provider);
  } catch (e) {
    return closedByReader(e) ? null : e;
  }
  if (new URL(back, location.href).href === location.href) location.reload();
  else location.replace(back);
  return null;
}

/** A window the reader closed is no error: the system's sign-in window, or Apple's sheet (error 1001). */
export function closedByReader(e: unknown): boolean {
  const code = codeOf(e);
  const message = String((e as { message?: unknown })?.message ?? "");
  return code === "CANCELED" || code === "1001" || /error 1001|canceled|cancelled/i.test(message);
}

/** The ?code= (or the error) in the address Supabase came back to. */
export function codeFromCallback(address: string): { code: string | null; error: string | null } {
  const u = new URL(address);
  const params = new URLSearchParams(u.search);
  // Supabase puts an error in the query, or in the fragment for some flows.
  new URLSearchParams(u.hash.slice(1)).forEach((v, k) => { if (!params.has(k)) params.set(k, v); });
  return { code: params.get("code"), error: params.get("error_description") || params.get("error") };
}

/**
 * Where the system's sign-in window starts: on this site (api/sign-in.js), which sends it on to Supabase's address,
 * so that the window asks to use thenahwi.com, not the Supabase project's host, to sign in.
 */
export function startAddress(supabaseAddress: string, origin = location.origin): string {
  return `${origin}/api/sign-in/?to=${encodeURIComponent(supabaseAddress)}`;
}

async function webAuthInApp(supabase: SupabaseClient, provider: Provider) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${IOS_APP.callbackScheme}://auth`, skipBrowserRedirect: true },
  });
  if (error || !data?.url) throw error || new Error("No sign-in address");
  const { url } = await call<{ url: string }>("WebAuth", "start", { url: startAddress(data.url), callbackScheme: IOS_APP.callbackScheme });
  const back = codeFromCallback(url);
  if (!back.code) throw new Error(back.error || "No code in the answer");
  const { error: exchange } = await supabase.auth.exchangeCodeForSession(back.code);
  if (exchange) throw exchange;
}

/** A random string for Apple's nonce, and its SHA-256 in hex, which is what Apple puts in its token. */
export async function nonce(): Promise<{ raw: string; hashed: string }> {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const raw = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw)));
  return { raw, hashed: Array.from(digest, (b) => b.toString(16).padStart(2, "0")).join("") };
}

type AppleAnswer = { response: { identityToken: string; givenName: string | null; familyName: string | null } };

async function appleInApp(supabase: SupabaseClient) {
  const n = await nonce();
  const { response } = await call<AppleAnswer>("SignInWithApple", "authorize", {
    clientId: IOS_APP.bundleId,
    redirectURI: location.origin + "/",
    scopes: "email name",
    nonce: n.hashed,
  });
  const { error } = await supabase.auth.signInWithIdToken({ provider: "apple", token: response.identityToken, nonce: n.raw });
  if (error) throw error;
  // Apple gives the name only the first time, and only to the app: keep it, so the header's initial is the name's.
  const name = [response.givenName, response.familyName].filter(Boolean).join(" ").trim();
  if (name) await supabase.auth.updateUser({ data: { full_name: name } }).catch(() => {});
}
