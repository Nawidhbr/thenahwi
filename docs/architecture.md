# Architecture

How The Nahwi is built and where each part lives. The rules every change must follow are in `CLAUDE.md`.

## The repository

An npm-workspaces monorepo, Node 22+:

| Path | What it is |
| --- | --- |
| `apps/web` | The website: Astro, fully static output (135 pages in English now; each language adds its own). |
| `packages/content` | All content as JSON (terms, texts, lessons, tests, translations, the encyclopedia, news), its schema (`src/schema.ts`) and the validation that writes the bundles in `generated/`. |
| `packages/engine` | The taṣrīf engine (`src/tasrif.ts`): the sound triliteral verb in the six bābs of form I and forms II–VIII and X (with the assimilation of form VIII), past and present in all fourteen persons, active and passive, the moods, imperative and prohibition, the participles and the maṣdar; checked by `test/tasrif.test.ts`. It also generates exercise questions (`src/exercises.ts`). |
| `api/` | Vercel server functions: `contact.js`, `error.js`, `paddle.js` and `revenuecat.js` (their logic in `_paddle.js` and `_revenuecat.js`). |
| `scripts/` | Build and maintenance scripts: the site check, the local server for the tests, IndexNow, the Paddle prices, the news finder. |
| `e2e/` | Playwright tests against the built site. |
| `supabase/` | The database schema for accounts (migrations) and its tests on plain Postgres. |
| `store/` | The apps: `android/` (the Play listing for a Trusted Web Activity of the site) and `ios/` (the Capacitor project of the iPhone app; `store/ios/README.md`). Not workspaces: Vercel never installs them. |
| `archive/` | Kept for later, not built: the Keystatic editing screen (`archive/README.md`). |
| `docs/` | These documents. |

The site never reads the content JSON files directly: `npm run validate -w @nahwi/content` checks them and writes
`packages/content/generated/*.json`, and the site imports those bundles.

## Build, check and deploy

- `npm run build` validates the content, builds `apps/web` and copies `apps/web/dist` to `dist/`, which Vercel serves
  (`vercel.json`: install and build commands, output directory, redirects, headers).
- `npm run check` runs everything a change must pass: the engine tests, the web unit tests (vitest), the content
  validation, the build, `scripts/check-site.mjs` (broken links, a missing title, description, canonical or
  og:image, a page without exactly one `<h1>`, bad JSON-LD, two English pages with one title) and the Playwright
  tests in `e2e/` (served by `scripts/serve-dist.mjs`): the study path's locks and stars, the madrasa choice,
  previews, tikrār, the calendar, search, the contact fallback, accounts (Supabase answered by the test), and the
  main pages on desktop, phone and a 360-pixel phone without sideways scrolling or script errors. It builds with
  payments off; `npm run check:payments` builds with `CHECKOUT` and `PAYWALL` on and walks what only that shows
  (`scripts/check-payments.mjs`, `docs/accounts-payments.md`).
- GitHub Actions `check.yml` runs the same on pull requests (the weekly news) and by hand, not on pushes to `main`:
  those have passed `npm run check` locally, and the private repository's Actions minutes count. A newer run cancels
  one still going; a change to Markdown alone is skipped. Vercel deploys `main` to
  production; other branches get preview deployments, which are never indexed.

## Pages and scripts

- Pages live under `apps/web/src/pages/[locale]/`; every URL starts with the locale. `/en/tools/` is English only
  (`ENGLISH_ONLY`).
- No inline scripts (the CSP forbids them) and no `on…=` attributes. A page script is a file in
  `apps/web/src/scripts/<name>.js`, imported with `?url` (hashed, cached a year) and loaded with
  `<script is:inline src={url}>` where it used to stand, so it runs at the same moment; head scripts still run before
  paint. Data from the page goes in `data-vars={JSON.stringify({...})}` on that tag and is read with
  `JSON.parse(document.currentScript.dataset.vars)`. TypeScript modules (`<script>` without `is:inline`) are
  bundled by Astro, never inlined (`assetsInlineLimit: 0`).
- The study portal's progress data comes from one cached file per language, `/<locale>/study-data.js`
  (`lib/study-data.ts`, versioned by `?v=<hash>`), loaded just before the head script; never put that data back into
  every page.
- Interface text is never written into a page: `t(locale)` and `fmt()` read `apps/web/src/i18n/<code>.json`.
- The first fonts of each area are preloaded in `BaseLayout`, so text does not shift as they load: Atkinson and
  Bricolage in the study portal, Literata in the knowledge base.
- Photos (`components/Photo.astro`) are offered in five widths as AVIF and WebP. The hero photo of a knowledge-base
  page loads first (`loading="eager"`, `fetchpriority="high"`); other photos load lazily.

## Security and caching

`vercel.json` holds the security headers (CSP and others) and the cache headers. The CSP allows only this site, plus
vercel.live for the preview toolbar, the Supabase URL in `connect-src`, and Paddle (script, style and img from
cdn.paddle.com, frame buy.paddle.com, connect *.paddle.com; `payment` allowed for buy.paddle.com; the opener policy
is `same-origin-allow-popups` for Paddle's pop-ups). `style-src-attr 'unsafe-inline'` lets Paddle.js size its checkout
window with a style attribute (without it the window stayed 300×150 pixels, found on 18 November 2026; a fallback rule
for `.paddle-frame-overlay` is in `global.css`); style elements and scripts stay strict. A new outside resource (font, script, embed) needs an entry
there. Hashed assets are cached for a year.

## Offline (PWA)

`apps/web/src/pages/sw.js.ts` is the service worker. It precaches the pages listed in `src/lib/routes.ts` (the
course, the texts, practice and the main knowledge-base pages; add a new study page type there so it works
offline), keeps other pages once read (`nahwi-visited`, the newest 200) and hashed assets (`nahwi-assets`), both
across versions, and saves only the reader's own language (`/sw.js?lang=<code>`). The site can be installed as an
app from the gear menu. In the iPhone app the same service worker runs, because `thenahwi.com` is one of the app's
"app-bound domains" (`WKAppBoundDomains` in `store/ios/ios/App/App/Info.plist`); before the first visit online, the app
shows its own `offline.html`.

The pages that only the iPhone app needs (`components/AppIos.astro`, `AppStoreDialog.astro`) load their code
(`lib/app-ios.ts`) only when `data-app="ios"` is set, so readers in a browser download nothing more.
`apps/web/public/.well-known/apple-app-site-association` (served as JSON, `vercel.json`) lets thenahwi.com links open
the app; Vercel's trailing-slash redirect leaves `/.well-known/` alone.

## SEO and sharing

- `components/Seo.astro`: one `<h1>` per page (the lock note uses `role="heading"`); titles up to 65 characters,
  descriptions about 155 (cut at a sentence or word); every page has an og:image: `public/og/<photo>.jpg` for a page
  with a photo (pass `image={photo}` to `BaseLayout`), `og/default.jpg` otherwise. The share images are made by
  `apps/web/scripts/make-og.cjs`; run it after adding photos.
- The main pages have search titles and descriptions of their own (`seo` in the UI dictionaries, by path, read with
  `seoFor`; only a language's own dictionary counts), written for what people type: "nahw" and "sarf" without the
  dots, "Arabic grammar", "course".
- Structured data (`lib/structured-data.ts`): Person on scholar pages, Book on handbook and library pages (author and
  the work it comments on linked by `@id`), Article on articles, Course for the study portal's levels (`course`,
  `courseList`), and Book on the library's text pages (`textEdition`: the original and our translation, free, linked
  to the work's page by `exampleOfWork` and to its author). Ids use the canonical URL, so one scholar is one entity in
  every language. Text pages are titled for what people search: "<title>: Arabic text and translation"
  (`text.pageTitle`).
- Gated pages say so (`paywalledLesson`): with the paywall on, a lesson of a paid book, and every term of the free
  book (it opens with a free account), carry a WebPage with `isAccessibleForFree: false` and the hidden part
  (`.lockable`), Google's markup for paywalled content. The text is in the page for search engines; without the
  markup the difference with what a reader without access sees could be taken for cloaking.
  `npm run check:payments` tests it.
- The sitemap leaves out every page that is noindex or personal (the root redirect, offline, account, moderation, progress, completion and certificate pages, the term lessons and the hidden `/en/tools/`), and `scripts/check-site.mjs` fails a build with indexing on that lists a noindex page or one whose canonical is elsewhere.
- Search titles: a scholar page adds the year of death in the reader's language ("al-Abharī (d. 663/1265)") when it fits, so that the Latin name alone is not the same title in every language; a lesson's description starts with the lesson's title, then the book, then the first sentence of the explanation, so that no two lessons share one. The glossary titles in Arabic, Urdu and Persian carry no Latin transliteration and follow what people type ("کلی کا معنی").
- The sitemap gives a lastmod only where it is known (home and news: the newest news date). Untranslated pages put
  their canonical on the English page and stay out of the sitemap (`docs/i18n.md`).
- Indexing is on in production (`INDEXING=on` in Vercel). Never add `Disallow` rules to robots.txt; search engines
  must be able to see a `noindex`. The domain is verified in Google Search Console by a TXT record at Yourname: keep
  that record.
- Twice a week (Tuesday and Saturday), GitHub Actions `indexnow.yml` (`scripts/indexnow.mjs`) sends the sitemap to
  IndexNow; the key file is `public/<key>.txt`. Each engine is asked on its own (api.indexnow.org and Yandex): Bing has refused the key
  (UserForbiddedToAccessSite) while Yandex accepts it; verifying the site in Bing Webmaster Tools should end that.
- Never hard-code the domain: use `SITE_URL` via `apps/web/src/config/site.ts`. The site lives at thenahwi.com
  only; www.thenahwi.com redirects there through the Vercel domain settings (not `vercel.json`, which would loop
  against them).

## Monitoring

- Script errors in readers' browsers go to `api/error.js` (`scripts/error-report.js`, loaded first in `<head>`; live
  site only, at most five per page, nothing about the reader) and show in the Vercel function log as `client-error`.
  A script that catches its own error passes it to `window.__report(e, where)`.
- `.github/workflows/uptime.yml` checks the main pages and the accounts service (Supabase's auth health, with the
  publishable key read from `config/supabase-public.ts`, so a paused project is noticed) every three hours, and opens an
  issue labelled `uptime` when one is down or slow; it closes the issue again when all is well. GitHub mails the
  owner about a new issue.
- Analytics: Vercel Web Analytics (cookieless), production only. The privacy page says what is measured and stored
  (`privacy` in the UI dictionaries); keep it in step.
