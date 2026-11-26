# Accounts, access and payments

Accounts are optional; the browser stays the first place for progress. Payments run through Paddle, the merchant of
record. Gifts go through a Stripe Payment Link. The secret keys are only in Vercel and GitHub, never in the repo.

**For The Nahwi all of this is still off.** It is The Mantiqi's system, copied whole and kept working in the tests;
the dates below ("on since …") are The Mantiqi's. Here accounts and Apple sign-in are off (`config/site.ts`), the
Supabase address is a placeholder, the Paddle ids and prices in `config/pricing.json` are The Mantiqi's as
placeholders, and no Stripe link is set. `docs/setup-new-site.md` says in which order to turn them on.

## Accounts (Supabase, EU, Frankfurt)

- The public URL and publishable key are in `apps/web/src/config/supabase-public.ts` (browser code imports it;
  `SUPABASE` in `config/site.ts` re-exports it). The schema is in `supabase/migrations/` (tested on plain Postgres,
  `supabase/README.md`); the first two migrations are applied, the access codes (`20261115120000_access_codes.sql`)
  not yet.
- `/<locale>/account/` (noindex, not in the sitemap; `scripts/account-page.ts`) signs in with a mail (a link and a
  6-digit code, so it works in the installed app too) or with Google (PKCE; both come back to the account page with
  `?code=`). It offers save now, a password to set, sign out (progress stays on the device), download my data and
  delete my account. It is laid out like the knowledge base: an orange panel (what an account gives, or the initial and address of who is
  signed in) beside the form or the progress as two figures, with square buttons.
- The session is in localStorage (`nahwi-auth`, no cookie). `components/AccountSync.astro` on every page loads
  `lib/account-sync.ts` only when that key exists, so other readers download nothing more. It merges scores, seen
  steps and the madrasa path with the account (`merge_scores`, `merge_visited`; the rules in `lib/sync-merge.js`,
  tested in `test/sync-merge.test.js`: the highest score wins, nothing is lost) on load and after every test
  (`nahwi:progress`, sent by `term-quiz.js`, the visited list and the madrasa choice). Locks still come from
  localStorage.
- `ACCOUNTS` in `config/site.ts` shows the account button at the end of the header ("Sign in", or the reader's
  initial on a white square, set before paint by `head-settings.js` from the stored session as `data-signed-in` and
  `--account-initial`) and the account part of the privacy page. On since 8 November 2026.
- Signed in, the initial opens the account menu (`components/AccountMenu.astro`, a popover like the settings): who is
  signed in (name and address from this browser's own session), "Your account", "Your progress", "Moderation" for
  moderators only (`data-moderator`, set before paint from `nahwi-moderator`) and "Sign out", which signs out here and
  reloads the page.
- Set up in Supabase: redirect URLs; Resend SMTP for the sign-in mails from login@thenahwi.com, with the 6-digit
  code in the template; the Google provider (Google's brand verification is asked for, so the consent screen may show
  the project's supabase.co address until then). The CSP's `connect-src` allows the Supabase URL.
- Email with a code or a password (`lib/email-signin.ts`, the same on the account page and in the subscribe window;
  since 24 November 2026): a switch "Code by email" / "Password" above the form, remembered in this browser
  (`nahwi-signin-mode`). With a password the reader signs in (`signInWithPassword`), or creates an account
  (`signUp`), which Supabase confirms with the same mail of a link and a code as a sign-in by code; an address that
  already has an account is told to sign in. There is no reset mail: "Forgot your password?" switches to the code,
  and a signed-in reader sets a new password on the account page (`updateUser`). Passwords are 8 to 72 bytes
  (`lib/password.ts`, tested in `test/password.test.ts`); Supabase keeps only a hash (`privacy.accountPassword`). In
  Supabase the Email provider needs no change; its "Confirm signup" template must hold the code (`{{ .Token }}`),
  like the "Magic link" one, and the minimum password length there may be set to 8 to match.
- Sign in with Apple (`APPLE_SIGN_IN` in `config/site.ts`, on since 24 November 2026): a "Continue with Apple" button
  stands under Google's on the account page and in the subscribe window (the same PKCE flow, coming back with
  `?code=`), the account page says "via Apple", and the privacy page adds what Apple passes on (`privacy.accountApple`:
  only the address, or an Apple relay address; on the web Apple gives no name, so the initial comes from the address).
  Setting it up, and the secret that must be renewed every six months: `docs/operations.md`, "Sign in with Apple".
- An account can also write questions and remarks under the lessons (`docs/study.md`, "Inside a lesson"): table
  `comments`, read by a moderator before they appear. They are in the data download (`export_my_data`), deleted with
  the account, and described on the privacy page (`privacy.comments`).
- `e2e/account.spec.ts` answers every Supabase request itself. The service-role key is only in Vercel
  (`SUPABASE_SERVICE_ROLE_KEY`), read by server functions.

## Access (`config/pricing.ts`, rules in `lib/progress.js`)

| Reader | Can read |
| --- | --- |
| No account | the encyclopedia, the glossary, the conjugation tool and three preview lessons in every book (al-Mabādiʾ's terms count as a book) |
| Free account | also the whole free book (`FREE_BOOK`, al-Mabādiʾ) |
| Full access (subscription) | everything |

The rules are `canRead` and `accessOf` in `lib/progress.js` (tested). The browser keeps `nahwi-access`
(`{ paid, until }`, from the account's licences, `licenceOf` in `lib/sync-merge.js`); `head-study.js` sets
`data-access` and, for a book the reader may not read and not a `?preview`, `data-locked="access"`, which shows
`components/AccessNote.astro` in place of the lesson (free book: create a free account; else: prices, sign in,
previews).

Two switches, off unless set to "on" (an env var at build time, or the default in `config/pricing.ts`):

- `PAYWALL` turns these locks on (off: nothing is locked by licence);
- `CHECKOUT` turns the subscribe buttons on (off: full access shows "opens soon").

On The Mantiqi both are on in production since 18 November 2026 (Vercel env); on The Nahwi both stay off until Paddle has approved thenahwi.com. `npm run check` builds with both off; `npm run check:payments` builds with both on and walks the
pricing page, the subscribe window up to Paddle's checkout, the locks, the previews, a licence and the app mode with
Paddle and Supabase faked (`scripts/check-payments.mjs`). Run it after a change to anything payments-on shows.
Decision (13 November 2026): every book except the free one goes behind the paywall, and the
paywall goes on together with the checkout, once Paddle has approved the site.

## Prices and Paddle

- Prices of full access, including VAT, a subscription by the month or by the year (two months free): €24 a month
  or €240 a year; in the UK £20 or £200, in pounds (the same value); €10 or €100 in the middle countries; €36 a year
  (yearly only on the site; €7 a month exists in Paddle as a fallback) in the low countries. Since 25 November 2026
  (`pricing.json`; `scripts/paddle-prices.mjs` writes the base price and the three country groups, each in its own
  currency). Before: €9.99 a month or €99.99 once for lifetime access (18–25 November 2026), and before that monthly
  and yearly (€6.99/€69.99). The monthly and yearly prices keep their Paddle ids (`paddle.monthly`, `paddle.yearly`):
  changing a price's amount does not change what an existing subscription pays, so earlier subscribers keep their
  price. Lifetime access bought before 25 November 2026 stays valid: it was a one-time price (now
  `paddle.lifetimeRetired`, archived) marked `custom_data.kind "lifetime"`, which the webhook still turns into a
  licence without an end (`provider_id` = the transaction, status "lifetime"), and an approved refund of it ends that
  licence (`refundFromEvent`). iDEAL | Wero, which Paddle offers for one-time items only, is therefore no longer
  offered.
- The checkout runs in the subscribe window (`components/SubscribeDialog.astro`, in BaseLayout, rendered only with
  CHECKOUT on; `scripts/subscribe.ts`, loaded on first use; Paddle.js through `lib/paddle-client.ts`). Any element with
  `data-subscribe="yearly|monthly"` opens it (the pricing page, the access note's "See prices", the account page's
  "See full access", the support window). The reader picks the plan at their country's price (PricePreview; the low
  countries see yearly only), signs in there if needed (Google, coming back with `?subscribe=<plan>`, or
  the mailed code) and goes on to Paddle's overlay (the window closes first, since the overlay sits under the top
  layer) with `custom_data.user_id`. After paying, Paddle returns to `/account/?paid=1`, which thanks and waits for the
  licence. The pricing page's own prices are localised by `scripts/checkout.ts`.
- Paddle.js loads from cdn.paddle.com, allowed in the CSP (script, style, img, frame buy.paddle.com, connect
  *.paddle.com; `payment` allowed for buy.paddle.com; the opener policy is same-origin-allow-popups for the payment
  pop-ups), with the public client-side token in `pricing.json`.
- Webhooks go to `api/paddle.js`. The destination in Paddle is `https://thenahwi.com/api/paddle/`, **with the
  slash** (without it the site answers with a redirect, which a webhook does not follow). Env:
  `PADDLE_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`. The logic (signature check, subscription → licence with three
  days' grace) is in `api/_paddle.js`, tested in `apps/web/test/paddle.test.js`. It upserts `licences` by
  `provider_id` (migration `20261108120000_licences_paddle.sql`). The account page shows the access and Paddle's links
  to cancel or change the payment method.

## The iPhone app: signing in and buying through Apple

The app (`store/ios/README.md`) is the site in Capacitor's web view; `data-app="ios"` is set before paint when its
bridge is on the page (or with `?source=ios` for the session, to try it in a browser).

- **Signing in** (`lib/app-signin.ts`, used by the account page and the subscribe window): a code or a password works as
  on the website. Google refuses its sign-in in a web view, so in the app it opens in the system's sign-in window
  (`WebAuthPlugin.swift`, ASWebAuthenticationSession, sharing Safari's sign-ins). The window starts at
  `/api/sign-in/?to=…` on this site, which passes only Supabase's sign-in address for the app on (`api/_signin.js`),
  because the system asks "The Nahwi wants to use <host> to sign in" with the host of the first address it opens:
  so it names thenahwi.com, not the Supabase project. Supabase sends the reader back to
  `thenahwi://auth?code=…`, which the page exchanges (PKCE). Apple signs in natively: the app gets Apple's identity
  token for the hashed nonce, and `signInWithIdToken` checks it; the name Apple gives the first time is kept as
  `full_name`. In Supabase: `thenahwi://auth` among the redirect URLs, and `com.thenahwi.app` among the Apple
  provider's Client IDs.
- **Buying** (`lib/app-store.ts`, `components/AppStoreDialog.astro`; on once RevenueCat's public key is set,
  `config/app-store.ts`): every `[data-subscribe]` opens the App Store window instead of Paddle's. The reader signs in
  first; RevenueCat is told the account's id (`appUserID`), shows Apple's price for the reader's country for the two
  plans (two auto-renewing subscriptions in the group "Full access", `com.thenahwi.full.yearly` and
  `com.thenahwi.full.monthly`, both unlocking the entitlement `full`, in the offering `default` as the packages
  Annual and Monthly), and Apple takes the payment. The window shows what Apple
  asks (price and period, the renewal, how to cancel, the terms, Apple's EULA, the privacy policy) and "Restore
  purchases". After a purchase the account page waits for the licence, as after Paddle.
- **The licence** comes from RevenueCat's webhook, `api/revenuecat.js` (logic in `api/_revenuecat.js`, tested in
  `test/revenuecat.test.js`): checked by its Authorization header (`REVENUECAT_WEBHOOK_AUTH`), it upserts `licences` by
  `provider_id` `apple:<original transaction>`: a subscription stays open to the end of the period paid for plus
  `GRACE_DAYS`, to its end once cancelled, through Apple's grace period on a billing problem, and ends at once on a
  refund. `manage_url` is Apple's subscriptions page, so the
  account page's "Manage your subscription" leads there. A transfer (purchases restored on another account) moves the
  Apple licences to that account. Events from the sandbox (TestFlight, App Review) write licences too.
- **Seats** (multiseat purchases, allowed on both subscriptions; the owner, 25 November 2026): a school or an
  organisation can buy seats in Apple School Manager or Apple Business and assign them to people, and later in the year
  a reader can buy a group in the App Store and invite people. The app itself buys one seat (RevenueCat's
  `purchasePackage` passes no seat count). Every person holding a seat gets their own Apple transaction ("assigned",
  with its own original transaction), so once they open the app signed in, RevenueCat sends an event for their account
  and the webhook writes them their own licence; the buyer's seats are not counted on the site. To be tested in the
  sandbox once purchases work (Apple's "Testing multiseat subscriptions"), including that RevenueCat passes the
  assigned transactions on.
- Without the key the app sells nothing: the subscribe buttons are hidden there, as in the Android app. With it, the
  privacy page adds what RevenueCat receives (`privacy.appStore`). `npm run check:payments` builds with a test key
  and walks the window with a stand-in for the native bridge.

## Codes for family and friends

Made by the owner; nothing on the site lists them.

- **Access codes** give full access without paying, for a set time. Our own table in Supabase (migration
  `20261115120000_access_codes.sql`, tested in `supabase/tests/20-access-codes.sql`): a code is kept only as the
  SHA-256 of its letters and digits (case, spaces and dashes do not count; at least 8), with a number of uses, the
  days of access it gives (or for good) and an optional last day to redeem it. A signed-in reader redeems it on the
  account page ("Have a code?"; `redeem_code`), once per account, at most 10 tries a day; it writes a licence
  (`provider_id` `code:<code id>:<user>`, status `code`), so access, the account page and `nahwi-access` work as for
  a subscription. A link `https://thenahwi.com/<locale>/account/?redeem=<code>` fills it in, also across the
  sign-in (session storage `nahwi-redeem`). In the SQL Editor:

  ```sql
  -- make one (keep the code: the table holds only its hash)
  select public.create_access_code('VRIENDEN-2026', days => 365, max_uses => 10, note => 'family and friends');
  -- see them
  select note, days, max_uses, uses, expires_at, active from public.access_codes order by created_at;
  -- stop one (access already given stays until its end; to end it too, set ends_at in licences)
  update public.access_codes set active = false where note = 'family and friends';
  ```

- **Staff access** (moderators and the teacher): a moderator's browser opens every lesson and book by itself
  (`docs/study.md`, "The rules"). So that the account page shows full access too, and access holds if the account
  stops being a moderator, the owner may also write a licence without an end in the SQL Editor (`provider_id`
  `staff:<user>`, status `staff`). For every moderator at once:

  ```sql
  insert into public.licences (user_id, kind, provider_id, status, starts_at, ends_at)
  select m.user_id, 'personal', 'staff:' || m.user_id, 'staff', now(), null from public.moderators m
  on conflict (provider_id) do nothing;
  ```

- **Discount codes** lower the price of a subscription. They are Paddle's own (Catalog → Discounts: percentage or
  amount, which prices, how many times, how many billing periods, with "Checkout discount code" on and the code
  filled in). The reader types one in Paddle's checkout, or a link `…?discount=<code>` on any page keeps it for the
  session (`head-settings.js`, session storage `nahwi-discount`) and `lib/paddle-client.ts` fills it in.

Both only matter once `PAYWALL` and `CHECKOUT` are on; until then everything is open anyway.

## Hearts refill

A refill of all five hearts (`docs/study.md`) is a one-time Paddle product, "Hearts refill", €0.99 (made by the owner
on 18 November 2026; its price id is `paddle.refill` in `config/pricing.json`; without one no refill is offered).
`paddle-prices.mjs` sets its quantity to one, and that of the two subscription prices, so the checkout shows no
quantity to change; its amount is set in Paddle.
The button in a test (`[data-refill]`, signed in, CHECKOUT on, not in the Android app) opens Paddle's overlay with
`custom_data { user_id, kind: "hearts" }` (`lib/paddle-client.ts` `checkoutRefill`) and comes back with `?refilled=1`.
The webhook turns a `transaction.completed` of kind "hearts" into `profiles.hearts = { n: 5, at, r }`
(`refillFromEvent` in `api/_paddle.js`, tested), and the page's account sync picks it up within seconds. The owner can
give a refill in the SQL Editor (the query is at the top of the migration).

## Support (gifts)

`components/SupportDialog.astro`, `SUPPORT.donateUrl` in `config/site.ts` (or env `DONATE_URL`): a heart button
"Support" in the header opens a window with a gift of any amount (a Stripe Payment Link with a free
amount, live since 10 November 2026, opened in a new tab; Paddle sells products only). "Sponsor a student" was taken
out on 18 November 2026. Without a donateUrl nothing is shown.

The window also opens by itself now and then (`scripts/support-nudge.ts`, the rule `nudgeDue` tested in
`test/support-nudge.test.js` and e2e): only after six pages read, on a quiet page (no test, lock, account, prices,
legal or contact page), after 45 seconds or most of the page read, never to a reader with full access, at most once a
month, then 60 days after "Not now" and 180 days after a gift. The count is kept in localStorage `nahwi-support`
(the privacy page says so).

## Legal pages

`/<locale>/pricing/` (under About), `/terms-of-service/` and `/refunds/` are drafts (text in `pricing` and `legal` of
the UI dictionaries): prices under About, the terms and refunds in the footer. Paddle is the merchant of record. There are no refunds of our own:
refunds follow Paddle's refund policy, which keeps the legal right of withdrawal (Paddle does not accept the words "no
refunds"). The privacy page (`privacy` in the UI dictionaries) must stay in step with what is measured or stored. With the
checkout on it says what Paddle handles and what the account keeps of a subscription (`privacy.payments`), and with a
gift link that gifts are paid on Stripe's page (`privacy.gifts`).
