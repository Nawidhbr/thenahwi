# Operations

What runs the site, where every setting is, and what to do when something goes wrong. No secret values belong in this
file or anywhere in the repository: only their names.

**The Nahwi is a copy of The Mantiqi.** This file describes how the services are meant to run, as they do for The
Mantiqi; for The Nahwi none of them is set up yet except what the owner already shares between his sites (the Apple
Developer Program, the GitHub account). `docs/setup-new-site.md` is the checklist, in order; tick it off there and
correct this file as each service comes in. Until then the code points at placeholders
(`https://replace-with-the-nahwi-project.supabase.co`, Paddle ids in `config/pricing.json`), accounts and Apple
sign-in are off in `config/site.ts`, and the scheduled workflows are commented out.

## Services

| Service | What it does | Where its settings are |
| --- | --- | --- |
| GitHub (`Nawidhbr/thenahwi`, private) | the code and content; Actions run the checks, the news finder, uptime, IndexNow and the Paddle prices | repository settings → Secrets: `PADDLE_API_KEY`, `OPENALEX_KEY` (to request) |
| Vercel | builds and serves the site and the functions in `api/` (contact, error, paddle, revenuecat) | project settings → Environment variables (names below) |
| Domain registrar Yourname | thenahwi.com; DNS | keep the Google Search Console TXT record and the Resend records |
| Google Search Console | indexing reports, the sitemap | verified by the TXT record |
| IndexNow | tells Bing and others about new pages | key file `apps/web/public/<key>.txt`, `indexnow.yml` daily |
| Supabase (EU, Frankfurt) | accounts, progress, licences | dashboard: auth providers, redirect URLs, SMTP, mail templates |
| Resend | contact-form mail to info@thenahwi.com and the sign-in mails from login@thenahwi.com | the domain's DNS records; the API key in Vercel and in Supabase's SMTP |
| Google Cloud | the OAuth client for "Sign in with Google" (brand verification asked for) | its client id and secret are in Supabase's Google provider |
| Apple Developer Program (the owner's, taken 24 November 2026 for The Mantiqi; one membership covers every site and app) | "Sign in with Apple" (`APPLE_SIGN_IN` in `config/site.ts`) and the iPhone app (`store/ios/`); one membership covers every site and app of the owner | Certificates, IDs & Profiles: the App ID, the Services ID, the key; the client secret in Supabase's Apple provider; App Store Connect: the app, its two in-app products, the Paid Apps agreement |
| RevenueCat (to open) | the iPhone app's purchases through Apple: checks Apple's receipts and tells the site by webhook | project "The Nahwi": the App Store app with its In-App Purchase key, the entitlement `full`, the offering `default`, the webhook `https://thenahwi.com/api/revenuecat/` |
| Paddle | subscriptions (merchant of record) | products and prices (written by `paddle-prices.yml`), the webhook destination `https://thenahwi.com/api/paddle/` |
| Stripe | the gift Payment Link | the link is `SUPPORT.donateUrl` in `config/site.ts` |
| Vercel Web Analytics | cookieless page counts, production only | Vercel project → Analytics |
| Unsplash | the tile photos, chosen by the owner (credit kept in `config/photos.ts`) | nothing to set |
| Google Play (not yet opened) | the Android app, a Trusted Web Activity of the site (`com.thenahwi.app`) | Play Console; the package and listing in `store/android/` |
| Claude scheduled task (to be made, `docs/news.md`) | Saturday morning: reads the news issue, opens a pull request | Claude → scheduled tasks |

## Environment variables (names only)

Set in Vercel unless noted. Build-time switches take effect on the next deploy.

| Name | Effect |
| --- | --- |
| `SITE_URL` | the canonical origin (default `https://thenahwi.com`); never hard-code the domain |
| `INDEXING` | `on` in production: no `noindex`, the sitemap in robots.txt. Previews are never indexed |
| `ANALYTICS` | `off` turns Vercel Web Analytics off (on by default in production) |
| `PAYWALL`, `CHECKOUT` | `on` turns the access locks and the subscribe buttons on (off until Paddle has approved thenahwi.com; `docs/accounts-payments.md`) |
| `DONATE_URL` | overrides the gift link |
| `RESEND_API_KEY`, `CONTACT_FROM`, `CONTACT_TO` | the contact form's mail |
| `SUPABASE_SERVICE_ROLE_KEY` | server functions only (the Paddle and RevenueCat webhooks) |
| `PADDLE_WEBHOOK_SECRET` | the signature check of Paddle's webhooks |
| `REVENUECAT_WEBHOOK_AUTH` | the Authorization header value of RevenueCat's webhook (`api/revenuecat.js`) |
| `REVENUECAT_IOS_KEY` | build time: turns buying through Apple on in the iPhone app with this public key, instead of `revenueCatKey` in `config/app.ts` (`npm run check:payments` sets a test one) |
| `PADDLE_API_KEY`, `PADDLE_API` | GitHub secret for `paddle-prices.mjs`; `PADDLE_API` points it at another API address (the sandbox) for a test |
| `OPENALEX_KEY` | GitHub secret for the news finder (OpenAlex refuses without one) |

## What runs by itself

- **On pull requests and by hand**: `check.yml` runs `npm run check` (not on pushes to main: run it locally first).
  Vercel deploys main to production and other branches as previews.
- **Every three hours**: `uptime.yml` checks the main pages and Supabase's auth health; it opens an
  issue labelled `uptime` when one is down or slow and closes it when it is back.
- **Tuesday and Saturday**: `indexnow.yml` sends the sitemap to IndexNow.
- **Every Saturday**: the news finder and the news task (`docs/news.md`).
- **When `config/pricing.json` changes**: `paddle-prices.yml` writes the prices into Paddle.

## Actions minutes

The repository is private, so GitHub Actions counts minutes (GitHub Pro: 3,000 a month; every job at least one).
Roughly: the uptime watch about 240 a month (every three hours), IndexNow about 9 (twice a week), the news finder
about 8, a check run 6–10 minutes (only on pull requests and by hand). Pushing to main costs no minutes; run
`npm run check` locally before pushing, and push in batches.

## Monitoring

Script errors in readers' browsers go to `api/error.js` (`scripts/error-report.js`, loaded first in `<head>`; live
site only, five per page, nothing about the reader) and show in the Vercel function log as `client-error`. A script
that catches its own error passes it to `window.__report(e, where)`. The privacy page says what an error report holds.

## Runbooks

- **The site is down or slow** (an `uptime` issue): Vercel → Deployments. If the last deploy broke it, promote the
  deployment before it to production, then fix and push.
- **Every workflow fails within seconds** ("recent account payments have failed or your spending limit needs to be
  increased"): the private repository has used its free Actions minutes for the month. GitHub → Settings → Billing:
  set a spending limit, take GitHub Pro (3,000 minutes a month, taken on 14 November 2026) or wait for the monthly
  reset. Until then nothing runs: no checks, no uptime watch, no news
  finder (the Saturday task then finds no issue), no IndexNow, no Paddle prices. Run `npm run check` locally meanwhile.
- **A check fails on GitHub**: the Actions log names the failing step; run `npm run check` locally to see it again.
  Two processes writing `packages/content/generated/` at once can break a build; run it again alone.
- **Contact messages do not arrive**: check `RESEND_API_KEY` in Vercel and the domain in Resend. Readers still have
  the fallback (their own mail program opens).
- **Sign-in mails do not arrive**: Supabase → Authentication → SMTP (Resend) and the mail templates (the 6-digit code
  must stay in them).
- **Supabase is paused or down** (an `uptime` issue for the accounts service): restore the project in the dashboard.
  Readers keep their progress in the browser meanwhile.
- **Turning payments on** (done for The Mantiqi on 18 November 2026, after Paddle approved its domain for checkout and Apple
  Pay; the webhook answered a simulated `subscription.created` with 200; kept for a move or a new Paddle account): in Paddle
  set the default payment link (Checkout → Checkout settings: `https://thenahwi.com/en/pricing/`) and the webhook
  destination (with the slash, the `subscription.*` events); check `PADDLE_WEBHOOK_SECRET` and
  `SUPABASE_SERVICE_ROLE_KEY` in Vercel; run `npm run check:payments` locally; set `CHECKOUT=on` and `PAYWALL=on`,
  redeploy, and make one real test payment and one cancellation (a refund in Paddle → Transactions). Vercel's Hobby
  plan is for non-commercial use, so move the project to Pro before selling.
- **A refund**: Paddle → Transactions → the payment → Refund. A refund does not by itself end the subscription or the
  access (the webhook keeps only subscription events): also cancel the subscription in Paddle → Subscriptions, at once
  (access ends) or at the end of the period (access runs until then). The first refund, the owner's test payment, was
  made on 18 November 2026 (with the payment, the refund and the cancellation all delivered, the licence kept).
- **Changing prices**: edit `config/pricing.json` and push; the workflow writes them into Paddle.
- **A teacher's review**: enter it in `reviews.json` or the term's file (`docs/content.md`), only as given.
- **A news item by hand**: add it to `background/news.json` under the source rule (`docs/news.md`).
- **Something a reader would notice went live**: add an entry to `config/updates.ts`.
- **Sign in with Apple** (set up for The Mantiqi on 24 November 2026 under the owner's Team ID `75M6B2GXZ2`; for The
  Nahwi it needs its own App ID, Services ID and client secret, made anew every six months). In the Apple Developer account,
  Certificates, IDs & Profiles:
  1. Identifiers → App IDs: an App ID `com.thenahwi.app` (the Android package's name, for one name everywhere)
     with Sign in with Apple ticked, "Enable as a primary App ID". Leave the server-to-server notification endpoint
     empty (Supabase does not use it).
  2. Identifiers → Services IDs: `com.thenahwi.web`, description "The Nahwi" (the name readers see on Apple's
     screen), Sign in with Apple configured with the primary App ID from step 1, the domain
     `replace-with-the-nahwi-project.supabase.co` and the return URL `https://replace-with-the-nahwi-project.supabase.co/auth/v1/callback`.
  3. Keys: a key with Sign in with Apple, configured with that App ID; download the `.p8` file once and keep it with
     the owner (never in the repository), with the Key ID and the Team ID (top right in the account).
  4. Services → Sign in with Apple for Email Communication: register the domain `thenahwi.com` and the address
     `login@thenahwi.com` (and `info@thenahwi.com`), so mails reach readers who hide their address behind Apple's
     relay. Resend's SPF record already covers the domain; check it shows as passing.
  5. Supabase → Authentication → Sign In / Providers → Apple: on; Client IDs `com.thenahwi.web` (the Services ID
     first); the secret made from the `.p8` file with the tool on that page (Team ID, Key ID, Services ID).
  6. Set `APPLE_SIGN_IN = true` in `config/site.ts`, widen "with your email or with Google" in `account.description`
     and `access.freeBody` of the UI dictionaries, run the check, push, and sign in once with an Apple ID (also with
     "Hide My Email"). Add an entry to `config/updates.ts`.
  Every six months (the date in the owner's calendar, a reminder a week before): make a new secret from the same
  `.p8` file in Supabase's Apple provider and save it. A missed renewal makes every Apple sign-in fail with
  `invalid_client` until the new secret is saved; the other ways to sign in keep working.
- **The iPhone app** (`store/ios/README.md` has every step): a Capacitor app that opens the site, built in Xcode on the
  owner's Mac (Xcode 26 or later) and sent to TestFlight and the App Store from there. Before the first build, in
  Supabase: the redirect URL `thenahwi://auth` and the Client ID `com.thenahwi.app` beside `com.thenahwi.web` in
  the Apple provider. Buying full access goes through Apple and RevenueCat: the products in App Store Connect, the
  entitlement `full` and offering `default` in RevenueCat, its public key in `config/app.ts`, the webhook secret in
  Vercel. A change to the site needs no new build; a new build is needed for a new plug-in, icon or start address, and
  once a year for Apple's newest SDK. A purchase whose licence did not arrive: look up the reader in RevenueCat
  (Customers, by the account's id), resend the event from there, and check the function's log in Vercel.
- **The Android app** (`store/android/README.md` has every step): a Play developer account, the package from
  PWABuilder (start URL `/en/?source=android`), `apps/web/public/.well-known/assetlinks.json` with the app signing
  key's fingerprint, the listing in nine languages and the screenshots from `store/android/`. The signing key stays
  with the owner, never in the repository. In the app the site shows no payments (Google Play allows payment for
  digital content only through its own billing): `data-app="android"`, set for the session by
  `scripts/head-settings.js`. Make the screenshots again after a visible change.

## Costs to check once a year

The plans of Vercel, Supabase, Resend and the domain; the Apple Developer Program (renews each November); Paddle's and Stripe's fees per payment; the Claude plan that
runs the scheduled task. The free plans have limits (Supabase may pause an idle free project; Resend limits mails per
day), so look again before the number of readers grows.

## Handing over

Someone taking over needs access to: the GitHub repository, the Vercel project, the domain at Yourname, Google Search
Console, Supabase, Resend, the Google Cloud project, Paddle, Stripe, the mailbox info@thenahwi.com (Zoho Mail; the
site's social accounts are registered on it: the Telegram channel t.me/thenahwi and Instagram @the_nahwi, listed in
`SITE.social` in `apps/web/src/config/site.ts`, which the footer, the contact page and the Organization's `sameAs`
show), and a Claude account for the news task (or the news can be reviewed by hand from the Saturday issue). With these, `README.md`,
`CLAUDE.md` and this folder are enough to run the site.
