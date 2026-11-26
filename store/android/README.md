# The Android app (Google Play)

The app is the website itself, opened as a Trusted Web Activity: a small Android package that shows
thenahwi.com full screen, without a browser bar, with the site's own offline pages. Every change to the site is in
the app at once; a new package is needed only for a new icon, name or start address.

Everything here is ready except what needs the owner's Google Play account. Decisions and runbook:
`docs/operations.md` ("The Android app") and `docs/decisions.md`.

## What is in this folder

| Path | What |
| --- | --- |
| `listing/<code>.md` | the store listing in nine languages: title (max. 30), short description (max. 80), full description (max. 4,000), with their lengths |
| `screenshots/phone-*.png` | seven phone screenshots, 1080×1920 (9:16), for "Phone screenshots" |
| `screenshots/wide-*.png` | two 1280×720 shots, for "Chromebook" or tablet screenshots if wanted |
| `feature-graphic.png` | the feature graphic, 1024×500 |
| the app icon | `apps/web/public/icons/icon-512.png` (512×512) |

The screenshots are made from the built site with Playwright, as a reader some weeks in (the first reading passed);
make them again after a visible change.

## The steps (owner)

1. **Google Play developer account** (one-off $25) at play.google.com/console, as an organisation or a person. An
   account for an organisation needs a D-U-N-S number; a personal account opened after November 2023 must have the
   app tested by at least 12 testers for 14 days before it can go to production.
2. **Make the package** at pwabuilder.com: enter `https://thenahwi.com/en/`, choose Android → "Google Play", and set:
   - package ID `com.thenahwi.app`, app name `The Nahwi`, launcher name `The Nahwi`;
   - start URL `/en/?source=android` (the site then leaves out every payment, see below);
   - theme and navigation colour `#0a0a0a`, background `#ffffff`, display "standalone";
   - signing key: "Create new". Keep the downloaded `signing.keystore` and its passwords somewhere safe (a password
     manager), never in the repository: without it no update can be signed.
3. **Upload** the `.aab` from the download to a new app in the Play Console (internal testing first), with Play App
   Signing on.
4. **Digital Asset Links**: the Play Console shows the app signing key's SHA-256 fingerprint (Setup → App signing).
   Put it in a new file `apps/web/public/.well-known/assetlinks.json` (the download from PWABuilder has one too; add
   the Play fingerprint to it):

   ```json
   [{
     "relation": ["delegate_permission/common.handle_all_urls"],
     "target": {
       "namespace": "android_app",
       "package_name": "com.thenahwi.app",
       "sha256_cert_fingerprints": ["<SHA-256 from the Play Console>"]
     }
   }]
   ```

   Commit and push it; without it the app shows a browser bar at the top.
5. **The listing**: paste `listing/en.md` as the default (English) and add the other eight languages under "Store
   listings"; upload the screenshots and the feature graphic.
6. **App content** in the Play Console: privacy policy `https://thenahwi.com/en/privacy/`; ads: none; target
   audience 13 and over (not a children's app); content rating questionnaire: reference / education, no violence,
   no user-generated content shared with others; data safety: see below.
7. **Test** on a phone (internal testing), then send it for review.

## Payments in the app

Google Play allows an app to take payment for digital content only through Google Play's own billing; tax-exempt
donations are excepted, and pointing readers to another way of paying is not allowed. So when the site is opened
from the app (start URL with `?source=android`, or a first page whose referrer is `android-app://`), it notes this
for the session (`sessionStorage` "nahwi-app") and hides the support button and window, every subscribe button,
the prices block and the links to the prices and refunds pages (`data-app="android"` on `<html>`;
`scripts/head-settings.js`, `styles/global.css`; tested in `e2e/tools.spec.ts`). A reader who has access from the
website keeps it in the app by signing in. Selling inside the app later would need Google Play Billing (the Digital
Goods API in a Trusted Web Activity).

## Data safety (draft answers, from the privacy page)

Check them against `/en/privacy/` before submitting.

| Data | Collected | Why | Notes |
| --- | --- | --- | --- |
| Email address | yes, optional | account | only with an account; deletable on the account page |
| Name, profile picture address | yes, optional | account | only when signing in with Google |
| App activity (test scores, steps seen, madrasa path) | yes, optional | app functionality | only with an account; otherwise it stays on the device |
| Messages (contact form: name, email, subject, message) | yes, optional | customer support | sent by email; not stored on the site |
| Crash logs / diagnostics | yes | app functionality | script errors, nothing about the reader, short-lived server log |
| Page views | counted in aggregate | analytics | Vercel Web Analytics, no cookies, no IP address stored |

Data is encrypted in transit (HTTPS); it is not shared with third parties for their own use and not sold; a reader
can ask for deletion (the account page deletes the account at once).
