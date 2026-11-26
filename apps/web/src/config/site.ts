/**
 * Single source of truth for the site's address and indexing state.
 *
 * - SITE_URL: the canonical origin. Changing the domain is this one value
 *   (https://thenahwi.com; www.thenahwi.com redirects there, set in the Vercel domain settings).
 * - INDEXING: "on" allows search engines to index the site. Anything else
 *   (including unset) puts noindex on every page.
 *
 * Preview deployments on Vercel are never indexed, whatever INDEXING says.
 */

import { SUPABASE_PUBLIC } from "./supabase-public";

const env = process.env;

export const SITE_URL = (env.SITE_URL ?? "https://thenahwi.com").replace(/\/+$/, "");

const isPreview = env.VERCEL_ENV !== undefined && env.VERCEL_ENV !== "production";

export const INDEXING = env.INDEXING === "on" && !isPreview;

/** Cookieless page counts (Vercel Web Analytics), only on the production deployment. */
export const ANALYTICS = env.VERCEL_ENV === "production" && env.ANALYTICS !== "off";

/**
 * Supabase (project in the EU, Frankfurt), for optional accounts and progress on every device (phase 3), later licences.
 * The URL and the publishable key are public by design (row-level security guards the data) and live in
 * config/supabase-public.ts, which browser code can import; the secret service-role key lives only in Vercel as
 * SUPABASE_SERVICE_ROLE_KEY and is read by server functions, never by a page.
 */
export const SUPABASE = SUPABASE_PUBLIC;

/**
 * Accounts (sign in with email or Google, /<locale>/account/). Off until The Nahwi's own Supabase project exists
 * (docs/setup-new-site.md): while false the page works for whoever opens it, but nothing links to it: no account
 * button in the header, and the privacy page does not mention accounts yet. Turn on once supabase/README.md is done.
 */
export const ACCOUNTS = false;

/**
 * Sign in with Apple (a "Continue with Apple" button under Google's, on the account page and in the subscribe window,
 * and Apple's paragraph on the privacy page). Off until it is set up for The Nahwi: the App ID com.thenahwi.app, the
 * Services ID com.thenahwi.web with Supabase's callback, a key and its client secret in Supabase's Apple provider, and
 * thenahwi.com, login@ and info@ registered for Apple's private relay (docs/setup-new-site.md, docs/operations.md).
 * The secret must be made anew every six months; false hides the button again if Apple sign-in ever fails.
 */
export const APPLE_SIGN_IN = false;

/**
 * Support (components/SupportDialog.astro): the "Support" button in the header and the footer opens a window with
 * a gift of any amount at donateUrl (a Stripe Payment Link, a
 * PayPal donate link or a LaunchGood page; Paddle sells products only, so gifts go elsewhere). Without donateUrl the
 * button stays hidden. (DONATE_URL at build time sets it too, to try it.)
 */
export const SUPPORT = { donateUrl: env.DONATE_URL || "" };

export const SITE = {
  name: "The Nahwi",
  /** The contact address (Zoho Mail on the own domain). */
  email: "info@thenahwi.com",
  /** The site's own accounts, in the footer and on the contact page, and as sameAs of the Organization. */
  // The site's own accounts, in the order of the row under every page (components/SocialLinks.astro); also the
  // Organization's sameAs (lib/structured-data.ts).
  // None yet: add the accounts once they exist (the row hides itself when the list is empty).
  social: [] as { name: string; kind: string; handle: string; url: string }[],
  arabicName: "النَّحْوِيّ",
  /** The wordmark in the header: unvocalised, as a logo, by choice. */
  arabicWordmark: "النحوي",
  tagline: "Ṣarf and naḥw: Arabic grammar as the madrasa teaches it",
  defaultLocale: "en",
  /**
   * Languages offered in the language menu. A language gets pages once its
   * translation is complete (packages/content/i18n/<code>/) and it has an
   * interface dictionary (src/i18n/<code>.json); see LIVE_LOCALES.
   */
  languages: [
    { code: "en", name: "English", english: "English", dir: "ltr" },
    { code: "nl", name: "Nederlands", english: "Dutch", dir: "ltr" },
    { code: "ar", name: "العربية", english: "Arabic", dir: "rtl" },
    { code: "ur", name: "اردو", english: "Urdu", dir: "rtl" },
    { code: "fa", name: "فارسی", english: "Persian", dir: "rtl" },
    { code: "tr", name: "Türkçe", english: "Turkish", dir: "ltr" },
    { code: "id", name: "Bahasa Indonesia", english: "Indonesian", dir: "ltr" },
    { code: "ru", name: "Русский", english: "Russian", dir: "ltr" },
    // In preparation: French, for the North-African madrasa path (the Maghrib).
    { code: "fr", name: "Français", english: "French", dir: "ltr" },
  ] as const,
};


export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
