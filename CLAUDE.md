# Working on The Nahwi (repo: thenahwi)

The Nahwi (النَّحْوِيّ) teaches ṣarf and naḥw, Arabic morphology and syntax as the madrasa teaches them, at
thenahwi.com: a free knowledge base, a conjugation tool, and a study portal with three madrasa paths of books, lesson
by lesson, in English first and later in more languages. It is built from a copy of The Mantiqi (themantiqi.com, repo
themantiqi): what has not been set up yet for this site is listed in `docs/setup-new-site.md`. This file holds the
rules every change must follow; how things work is in `docs/`.

## Where to read

| Document | Covers |
| --- | --- |
| `docs/architecture.md` | the repository, build, check and deploy, page scripts, CSP, offline, SEO, monitoring |
| `docs/content.md` | the paths and their books, the prints, kinds of book, sources, reviews |
| `docs/study.md` | the study portal: addresses, the study rules, previews, tikrār, inside a lesson, texts, reader settings |
| `docs/knowledge-base.md` | the knowledge-base pages, search marks, the house style |
| `docs/i18n.md` | languages, where translations live, terminology, right to left |
| `docs/accounts-payments.md` | accounts, access, prices and Paddle, gifts, legal pages |
| `docs/news.md` | the weekly news round and the rule for sources |
| `docs/operations.md` | services, environment variables, what runs by itself, runbooks, handing over |
| `docs/decisions.md` | dated decisions and why |
| `docs/setup-new-site.md` | what still has to be set up for The Nahwi (domain, services, keys, teacher) |

Read the document for an area before changing it, and correct it in the same commit when a change makes it wrong.

## Before committing

- Run `npm run check` (tests, build, site check, Playwright; `docs/architecture.md`): it is the gate, since GitHub
  Actions runs it only on pull requests and by hand. A change to a learning rule or a tool gets a test there.
- Never push without the owner's approval: work in local commits, let him test and see the result, and push only
  when he says so. The repository is private, so Actions minutes count (`docs/operations.md`), and every push also
  builds a deployment on Vercel.
- Never run two processes that write `packages/content/generated/` at once; a build that fails that way is run again
  alone.

## Code

- npm workspaces (`apps/web` Astro static, `packages/content`, `packages/engine`), Node 22+.
- The taṣrīf engine (`packages/engine/src/tasrif.ts`: the conjugation of the sound triliteral verb, its bābs and
  augmented forms, and the exercises made from it) is checked by `packages/engine/test/tasrif.test.ts`: change a rule
  only together with a test, and only after a teacher has confirmed it. The study rules live only in `apps/web/src/lib/progress.js`: change one only there, with a test in
  `test/progress.test.js`.
- Content is JSON in `packages/content`, validated by `src/schema.ts`; the site imports the generated bundles, never
  the JSON files directly.
- Every URL starts with the locale. Never hard-code the domain: use `SITE_URL` via `apps/web/src/config/site.ts`.
  Indexing is controlled by `INDEXING`; never add `Disallow` rules to robots.txt.
- No inline scripts and no `on…=` attributes: a page script is a file in `src/scripts/`, loaded with
  `<script is:inline src={url}>` (`docs/architecture.md`). A new outside resource needs an entry in the CSP in
  `vercel.json`.
- Never write interface text into a page: use `t(locale)` and `fmt()`, with the English in `src/i18n/en.json`.
- Colours only as CSS tokens in `src/styles/global.css` (light and dark values). Orange under white text uses
  `--red-fill`/`--on-red` (the names are older than the colour); locked items are greyed with `--muted`, not opacity. Use logical CSS properties
  (`margin-inline-start`), not left and right.
- One `<h1>` per page; titles up to 65 characters, descriptions about 155; every page has an og:image
  (`components/Seo.astro`).
- A new study page type goes into `src/lib/routes.ts`, so it works offline. Never put the study data back into every
  page (it comes from `study-data.js`).
- A new search field uses `window.__hl`. Diagram labels stay at least 13px in a 360-wide viewBox.
- The iPhone app (`store/ios/`, Capacitor) opens the site itself: its native side is reached only through
  `lib/native.ts` and loaded only in the app (`data-app="ios"`); a plug-in the site calls must be pinned in
  `store/ios/package.json` (`test/app-ios.test.ts`). In the app nothing offers Paddle or a gift; full access is bought
  through Apple (`store/ios/README.md`).
- A new book gets an unused track number, its source in `lib/sources.ts` and its place in `curriculum.json`
  (`docs/content.md`).
- Keep the privacy page in step with what is measured or stored.
- Secret keys (Supabase service role, Paddle, Resend) live only in Vercel and GitHub secrets: never in the repository.

## Content

- English first: build and write everything in English; translations follow in a separate pass, using each language's
  `GLOSSARY.md` (`docs/i18n.md`).
- Arabic is always vocalised and shown with its transliteration.
- Never reproduce a modern edition under copyright, and never translate from one: show only public-domain prints,
  and say on the page which edition the lessons follow.
- Every explanation, test and translation is a draft until a qualified teacher has reviewed it. Say so once, on the About
  page, not on every page, lesson or term (a reviewed lesson shows "Reviewed by"). Only enter a review the teacher has
  actually given.
- News: only Sunni Islamic institutions, checked by institution, never by a person's name; work only from what the
  source says; nothing is published by itself (`docs/news.md`).
- Add an entry to `src/config/updates.ts` whenever something a reader would notice goes live.
- The Nahwi is for ṣarf and naḥw; balāgha may be added later only as their extension, as a bonus text
  (`docs/decisions.md`). Ṣarf comes before naḥw, as in the madrasa. URLs stay `/<locale>/terms/<slug>/`.
- Every example word or sentence in a lesson is fully vocalised, and every conjugated form shown comes from the
  engine or from a print, never typed by hand.

## House style ("Oranje en lichtblauw")

Orange and light blue on white (since 2026-11-26): orange for structure and accent (the knowledge base's header and
main panels, the main buttons, the current item, kickers), light blue for the soft surfaces (the bands, the masters on
the home page, the second menu row, the ground of the study portal), white grounds and a deep blue-black ink for reading
text; on an orange ground the accent turns white. True red only for wrong answers and errors (`--bad`). Arabic is set
in Baloo Bhaijaan 2, rounded and playful (Naskh and Amiri stay as choices in the settings). Tiles (rotated squares)
mark steps. The study portal is in "Clear glass" (a light glass header that stays at the top, frosted glass cards and
round buttons, the current level as an orange glass panel); the knowledge base and the other pages outside it keep the
classic look (an orange header, square panels, plain cards), set by `data-area` on `<html>`. Photos of Arabic
inscriptions in colour stand beside the panels, never behind text. Details in `docs/knowledge-base.md`.
