# The iPhone app (App Store)

The app is the website in a native frame: a Capacitor 8 app (`com.thenahwi.app`) that opens thenahwi.com in a web
view, so every change to the site is in the app at once. A new build is needed only for a change on the native side
(a plug-in, the icon, the start address). Apple does not accept a bare website, so the app adds what a website cannot
do; all of it lives in the site's code (`apps/web/src/lib/app-ios.ts` and friends) and runs only in the app.

| In the app | How |
| --- | --- |
| Starts in the study portal, in the reader's language | start address `/en/study/?app=start`; `scripts/head-settings.js` goes on to the language last used |
| No Paddle, no gift, no prices pages | `data-app="ios"` on `<html>`, set before paint (`global.css`) |
| Google sign-in in the system's window | `ios/App/App/WebAuthPlugin.swift` (ASWebAuthenticationSession) → `thenahwi://auth?code=…`; `lib/app-signin.ts` |
| Sign in with Apple, natively (Face ID) | `@capacitor-community/apple-sign-in` → `signInWithIdToken`; `lib/app-signin.ts` |
| Full access bought through Apple | RevenueCat (`@revenuecat/purchases-capacitor`), `lib/app-store.ts`, `components/AppStoreDialog.astro`; webhook `api/revenuecat.js` writes the licence |
| The daily reminder as a notification, with the lessons due that day | `@capacitor/local-notifications`, planned two weeks ahead (`lib/app-rules.js`) |
| "Your hearts are full again" | the same, at the moment from `heartsFullAt` (`lib/progress.js`) |
| A tap of the phone on a right or wrong answer | `@capacitor/haptics` |
| The rating window at a good moment | `@capacitor-community/in-app-review` (`noteForReview` in `lib/app-rules.js`) |
| Shortcuts on the icon: continue, tikrār, glossary | `@capawesome/capacitor-app-shortcuts` (and `SceneDelegate.swift`) |
| The page under the status bar, the clock light or dark to match the header | `viewport-fit=cover` in the app (`head-settings.js`), `global.css`, `@capacitor/status-bar` |
| thenahwi.com links open the app | Universal Links: `apps/web/public/.well-known/apple-app-site-association`, `App.entitlements` |
| Offline | the site's service worker (allowed in the web view by `WKAppBoundDomains`); `www/offline.html` when there is no copy yet |

Tests: `apps/web/test/app-ios.test.ts`, `app-rules.test.js`, `revenuecat.test.js`, `e2e/app-ios.spec.ts` (a stand-in for
the native bridge) and part 7 and 8 of `npm run check:payments` (buying through Apple).

## What is in this folder

| Path | What |
| --- | --- |
| `package.json` | Capacitor and the plug-ins, at exact versions (the site calls them by name: keep the versions when updating, or check their methods) |
| `capacitor.config.json` | the start address, the hosts allowed in the web view, the user agent, the launch screen |
| `ios/App/` | the Xcode project (Swift Package Manager, no CocoaPods): `App.xcodeproj`, `App/` with the Swift files, `Info.plist`, `App.entitlements` and the icon |
| `www/` | `offline.html` and a fallback `index.html`; made by `scripts/make-assets.mjs` |
| `scripts/make-assets.mjs` | writes `www/` and the icon (1024×1024) and launch image from the logo; run it from the repository root after a change to the logo or the offline text |

`ios/App/App/public` and `ios/App/App/capacitor.config.json` are made by `npx cap sync ios` and are not in git.

## The steps (owner)

What only the owner can do (accounts, keys, the Mac, paying) is marked; the rest is in the repository.

1. **The Mac.** Capacitor 8 needs Xcode 26 or later: on macOS Sequoia 15.6 or later, Xcode 26.3 from
   developer.apple.com/download/all; on macOS Tahoe 26.6 or later, the newest Xcode from the App Store. Node 22 or later.
2. **Apple Developer → Certificates, IDs & Profiles → Identifiers → `com.thenahwi.app`** (owner): tick **Associated
   Domains** (Sign in with Apple is on already; In-App Purchase is on by default). With automatic signing Xcode does this
   too.
3. **Supabase → Authentication** (owner):
   - URL Configuration → Redirect URLs: add `thenahwi://auth` (without it Google's sign-in in the app never returns);
   - Sign In / Providers → Apple → Client IDs: `com.thenahwi.web,com.thenahwi.app` (the website's first; the second
     lets Supabase accept Apple's token from the app).
4. **App Store Connect** (owner): Apps → New App: iOS, name "The Nahwi", primary language English, bundle ID
   `com.thenahwi.app`, SKU `thenahwi-ios`. Then:
   - Business → Agreements: the Paid Apps agreement, with the bank account and the tax forms;
   - the App Store Small Business Program (15% instead of 30%);
   - Monetization → Subscriptions: the group "Full access" with two **auto-renewable** subscriptions, "Yearly"
     (`com.thenahwi.full.yearly`, one year) and "Monthly" (`com.thenahwi.full.monthly`, one month), made on
     25 November 2026 with their English names and prices: £199.99 and £19.99 as the base in the UK (Apple has no
     £200.00 or £20.00 price point; the site's prices are £200 and £20 there, €240 and €24 in the euro), the other
     countries as Apple converts them (€229.99 and €22.99 in the euro). Multiseat purchases stay allowed, sold in the
     App Store, Apple Business and Apple School Manager (`docs/accounts-payments.md`, "Seats"). Still to set: the
     availability, and a review screenshot each;
   - Users and Access → Integrations → In-App Purchase: generate a key (.p8) for RevenueCat. It stays with the owner.
5. **RevenueCat** (owner; free up to $2,500 of revenue a month): a project "The Nahwi" with an App Store app
   (bundle ID, the In-App Purchase key with its Key ID and Issuer ID); import the two products; an entitlement **`full`**
   attached to both; the offering **`default`** with the packages Annual and Monthly. Then:
   - API keys → the Apple public key (`appl_…`): this one is public; it goes in `apps/web/src/config/app.ts`
     (`revenueCatKey`), which turns buying in the app on;
   - Integrations → Webhooks: URL `https://thenahwi.com/api/revenuecat/` (with the slash), and an Authorization header
     value: a long random string, which also goes in Vercel as `REVENUECAT_WEBHOOK_AUTH` (owner; never in the
     repository or a chat). Send a test event: the function answers 200 with `kept: false`.
6. **Build and run** (owner, on the Mac):

   ```sh
   cd store/ios
   npm install
   npx cap sync ios
   npx cap open ios
   ```

   In Xcode: the App target → Signing & Capabilities → Team: the owner's team, "Automatically manage signing". Run it on
   an iPhone (cable) or a simulator. To send a build to TestFlight: Product → Archive → Distribute App → App Store
   Connect. Raise the build number (General → Build) for every upload.
7. **Test on a phone** (TestFlight): the start in the reader's language; signing in with a code, a password, Google and
   Apple (also "Hide My Email"); the reminder and the hearts note; a purchase and "Restore purchases" with a sandbox
   account (TestFlight purchases are free), and a seat assigned in the sandbox (Apple's "Testing multiseat
  subscriptions") giving that person access; a thenahwi.com link from Notes opening the app; flight mode after the first
   start (the course opens offline).
8. **The listing** (to come, as for Android in `store/android/`): name, subtitle, description and keywords in nine
   languages, screenshots for a 6.9" iPhone (1320×2868) and a 13" iPad (2064×2752), the App Privacy answers (from the
   privacy page, with RevenueCat for purchases), age rating, and for App Review a test account and a note on where full
   access is bought.

## Before sending it for review

- Comments under lessons are content from users: Apple (1.2) asks for a way to report a comment and to block abuse; a
  "report this" button is still to be built.
- Deleting an account that signed in with Apple should also revoke Apple's token (5.1.1(v)); the account page deletes
  the account but does not yet tell Apple.
- The app's texts (`app` in `apps/web/src/i18n/en.json`) are in English only until the translation pass.
