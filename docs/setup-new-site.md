# Setting up The Nahwi

The Nahwi was made on 26 November 2026 from a copy of The Mantiqi (repo `themantiqi`, commit `4c71e0d`). The code,
the study rules, the tests and the house style came over whole; the content is new (al-Mabādiʾ, the knowledge base of
ṣarf and naḥw, the taṣrīf engine). Nothing of The Mantiqi's services came over: every account, key and id below has
to be made for The Nahwi. Until then the site builds and passes `npm run check` with these parts off.

Work through the list in order: each step names what it unlocks and where the code waits for it. Tick a step off here
and correct `docs/operations.md` when it is done.

## What is off now, and where

| Part | Off by | Turned on by |
| --- | --- | --- |
| Accounts (header button, sign-in, progress on every device, comments) | `ACCOUNTS = false` in `apps/web/src/config/site.ts` | step 6 |
| Sign in with Apple | `APPLE_SIGN_IN = false` in `config/site.ts` | step 11 |
| The Supabase project | placeholder `https://replace-with-the-nahwi-project.supabase.co` and `sb_publishable_replace_me` | step 6 |
| Paywall and checkout | `PAYWALL`, `CHECKOUT` not set in Vercel; the Paddle ids in `config/pricing.json` are placeholders (`pri_replace_…`), the amounts The Mantiqi's | step 9 |
| The gift window | `SUPPORT.donateUrl` empty | step 10 |
| The iPhone app's purchases | `revenueCatKey` and `appStoreId` empty in `config/app.ts` | step 11 |
| Indexing | `INDEXING` not set: every page is `noindex` | step 5 |
| Scheduled workflows (uptime, IndexNow, news finder) | their `schedule:` lines commented out in `.github/workflows/` | steps 5, 14, 15 |
| The teacher on the About page, reviews | `TEACHER = null` in `config/about.ts`; `reviews.json` empty | step 1 |
| Social links | `SITE.social` empty in `config/site.ts` | step 13 |
| Languages other than English | no `src/i18n/<code>.json`, no `packages/content/i18n/<code>/` | step 16 |

The e2e tests of these parts are skipped while they are off (`e2e/flags.ts`), not deleted: they run again by
themselves once a part is on.

## The steps

1. **A teacher of ṣarf and naḥw.** Everything is a draft until a qualified teacher has reviewed it, and the About page
   names the teacher. Ask the teacher to read al-Mabādiʾ (27 terms and their tests) and the taṣrīf engine's tables
   (`/en/tools/tasrif/`) first. Then fill `TEACHER` in `apps/web/src/config/about.ts` (name, title, photo if wanted)
   and enter only the reviews actually given (`docs/content.md`, "Reviews").
2. **The repository.** Make an empty private repository `Nawidhbr/thenahwi` on GitHub (no README, no licence), then
   push the local `main` there, once the owner says so. Add the repository secrets later as the steps need them
   (`PADDLE_API_KEY` at step 9, `OPENALEX_KEY` at step 14).
3. **Domain and mail.** Register `thenahwi.com` (and, if wanted, `thesarfi.com`, only to redirect to
   `https://thenahwi.com/en/`: a redirect at the registrar or a second domain in Vercel). Mail on the domain (Zoho Mail,
   as for The Mantiqi): `info@thenahwi.com` (contact, `SITE.email`) and `login@thenahwi.com` (the sign-in mails).
4. **Vercel.** A new project from the repository, the root as it is (`vercel.json` sets the build). Add the domain,
   with `www` redirecting to the bare domain. Set `SITE_URL=https://thenahwi.com`; the other variables come with their
   steps (`docs/operations.md`, "Environment variables").
5. **Search engines.** When the site is ready to be found: `INDEXING=on` in Vercel (production only), Google Search
   Console (domain property, TXT record at the registrar; submit `https://thenahwi.com/sitemap-index.xml`), and Bing
   Webmaster Tools (import from Search Console). IndexNow is ready: the key file is
   `apps/web/public/e598c0cec03fc5f8efc54e143bec02c0.txt` and `scripts/indexnow.mjs` uses it; remove the # before the
   schedule in `.github/workflows/indexnow.yml`.
6. **Supabase (accounts).** A new project in the EU (Frankfurt), named The Nahwi. In its SQL Editor run every file of
   `supabase/migrations/` in order (`supabase/README.md`), and make the owner a moderator (the query at the top of
   the comments migration). Then put the project's address and publishable key in
   `apps/web/src/config/supabase-public.ts`, and the same address everywhere the placeholder stands:
   `api/_signin.js`, `api/paddle.js`, `api/revenuecat.js`, `scripts/check-payments.mjs`, the three e2e specs that
   fake Supabase (`account`, `app-ios`, `comments`) and `connect-src` of the CSP in `vercel.json`
   (`grep -rn replace-with-the-nahwi-project` finds them all). Set `SUPABASE_SERVICE_ROLE_KEY` in Vercel. In
   Authentication: the site URL `https://thenahwi.com`, the redirect URLs `https://thenahwi.com/**` and
   `thenahwi://auth`, the mail templates (copy The Mantiqi's and change the name), SMTP through Resend (step 7). Then
   `ACCOUNTS = true` in `config/site.ts`, and the privacy page shows the account part by itself.
7. **Resend.** Add `thenahwi.com` as a domain, put its DNS records at the registrar, make an API key: in Vercel as
   `RESEND_API_KEY` (with `CONTACT_FROM`, `CONTACT_TO`) for the contact form, and in Supabase's SMTP settings for the
   sign-in mails from `login@thenahwi.com`.
8. **Sign in with Google.** In Google Cloud an OAuth client (web) with Supabase's callback as redirect URI, the app
   name The Nahwi and its logo (`apps/web/public/icons/icon-512.png`); its id and secret go into Supabase's Google
   provider. Ask for brand verification.
9. **Paddle (subscriptions).** Have thenahwi.com approved for checkout (a new website in the existing Paddle account,
   or a new account; Paddle checks the site, its prices page, terms, refund and privacy pages, which are all there).
   Decide the prices and plans (`config/pricing.json` now holds The Mantiqi's €24 a month or €240 a year as
   placeholders; also the question whether one subscription covers both sites), set `PADDLE_API_KEY` as a repository
   secret and run `paddle-prices.yml` by hand to make the products and prices, then copy their ids into
   `config/pricing.json`. The webhook destination `https://thenahwi.com/api/paddle/` with its secret as
   `PADDLE_WEBHOOK_SECRET` in Vercel. Test with `npm run check:payments`, then set `PAYWALL=on` and `CHECKOUT=on` in
   Vercel (`docs/accounts-payments.md`).
10. **Gifts.** A Stripe Payment Link with a free amount for The Nahwi; its address in `SUPPORT.donateUrl` of
    `config/site.ts` (or `DONATE_URL` in Vercel). The gift button and the window then show themselves.
11. **Apple.** The owner's Apple Developer Program covers this site too (team `75M6B2GXZ2`, already in
    `config/app.ts` and `public/.well-known/apple-app-site-association`). Make the App ID `com.thenahwi.app` (Sign in
    with Apple, Associated Domains, Push), the Services ID `com.thenahwi.web` with Supabase's callback, a Sign in with
    Apple key and from it the client secret for Supabase's Apple provider (anew every six months); register
    thenahwi.com, login@ and info@ for Apple's private relay. Then `APPLE_SIGN_IN = true`. For the iPhone app:
    `store/ios/README.md` step by step (App Store Connect app, the two subscriptions, RevenueCat project "The Nahwi"
    with its webhook `https://thenahwi.com/api/revenuecat/`, `revenueCatKey` in `config/app.ts`), and the app's own
    files with `node store/ios/scripts/make-assets.mjs`.
12. **Google Play.** `store/android/README.md`: the package `com.thenahwi.app` from PWABuilder, the signing key's
    fingerprint in `apps/web/public/.well-known/assetlinks.json` (not there yet: make it from the README), the English
    listing in `store/android/listing/en.md`. The screenshots in `store/android/screenshots/` and
    `apps/web/public/screenshots/` are The Nahwi's first pages; make them again once there is more to show.
13. **Social accounts.** Make the ones wanted (YouTube, Instagram, X, …) with the name The Nahwi and the logo; add each
    to `SITE.social` in `config/site.ts` (the footer row and the Organization's `sameAs` follow).
14. **News.** `docs/news.md`, "Not running yet": try the finder by hand, add the language-science journals, make the
    Saturday Claude task, then remove the # before the schedule in `.github/workflows/news-finder.yml`.
15. **Uptime.** Once the domain answers: remove the # before the schedule in `.github/workflows/uptime.yml`.
16. **More content.** The first lesson book of level 2 (`docs/content.md`, "The books": a public-domain print first),
    then the skipped e2e tests of level 2 in `e2e/learning.spec.ts` get its book and lesson numbers and run again.
    Translations follow in their own pass (`docs/i18n.md`), each language from its `GLOSSARY.md`.

## Shared with The Mantiqi

- The owner's GitHub account, Apple Developer team and (if chosen) Paddle account.
- The house style, the study rules and the code. A fix to shared code made in one repository is not in the other:
  carry it over by hand.
