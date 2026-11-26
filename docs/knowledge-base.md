# The knowledge base and the house style

The knowledge base is the site itself, free to everyone; the study portal is the course (`docs/study.md`). The news
pipeline is in `docs/news.md`.

## Pages

- **Home** `/<locale>/`: the Isfahan muqarnas beside a black panel with the title and the search (`KbHero`), then the
  six handbooks (al-Kāfiya, al-Shāfiya, al-ʿIzzī, the Alfiyya, al-Ājurrūmiyya, Qaṭr al-nadā; black panel, with
  their photos) beside the masters (a line of the main scholars), then the news in
  its three sections side by side, the curricula and the study portal.
- **Articles**: `/nahw/` (About naḥw and ṣarf: what each is, why ṣarf comes first) and `/curricula/` (articles
  with `book: "nahw"` or `"curricula"`). A curriculum article
  with `madrasa` ends with the books of that study path (`pathBooks` in `lib/course.ts`).
- **Library** `/books/`: the six handbooks of `lib/kb.ts` `KB_BOOKS` and the works of `background/library.json` in one
  list by century, the handbooks standing out, with a search field and dropdowns for period, kind, language and
  handbook (through `scripts/scholars-filter.js`). A handbook has its page `/books/<id>/`
  (`components/HandbookPage.astro`) with articles (`/books/<id>/<article>/`) and a catalogue of commentaries
  (`/books/<id>/catalogue/`); a library work has a short page at the same `/books/<id>/`
  (`components/LibraryBookPage.astro`), linked from its author's scholar page. The summaries are translated in
  `i18n/<code>/background/library.json` (`getLibrary(locale)`; `docs/i18n.md`).
- **Scholars** `/scholars/` and `/scholars/<slug>/` (`background/people/`): a search field and three dropdowns, kept
  in the hash (`#period=pre&role=translator`): period (before Islam, died before 632; early, to 1200; post-classical,
  1200–1500; later madrasa, 1500–1900; modern), six broad role groups, and handbook.
- **Glossary** `/glossary/` and `/glossary/<slug>/` (`background/concepts/`, schema `BackgroundConcept`): every concept
  of ṣarf and naḥw, free to read without an account, as the knowledge base's way into search: one page per concept with its
  vocalised Arabic and transliteration, a one-sentence definition, an explanation, examples, related concepts, the
  handbooks that treat it and, through `term`, the lesson of the study path that teaches it (which may ask for an
  account). The A–Z list has a search field and a topic dropdown (`category`, through `scripts/scholars-filter.js`).
  Each term lesson links to its free entry. The header has Glossary as a main item; on a phone it takes the place of
  the Home tab (the logo leads home). It is the site's only A–Z list: `/terms/` redirects here, the term lessons are
  `noindex`, and the word pop-ups link here.
- **News** `/news/` (+ `feed.xml`, from `background/news.json`): three sections from each item's `kind`
  (`newsSection` in `lib/news.ts`): Academic (`study`), Publications (`edition`, `translation`, `digital`), Talks &
  media (`event`, `media`), as tabs on the news page (`#section=academic&field=sarf`) and columns on the home page;
  filterable by `field`. The cards show the `headline`, the `gist` and "Read at <site> ↗"; the original `title` and
  our `summary` sit behind "More". `newsSeen` in localStorage (set on a first visit and on every visit to the news
  page) puts a "new" tile on later items and a red dot on News in the menu.
- **About**: naḥw and ṣarf, the site (`/about/` names the reviewing teacher, once there is one, and the site owner, `src/config/about.ts`, text
  in `about` of the UI dictionaries), updates (`/updates/`, from `config/updates.ts`), contact and privacy; prices
  and the legal pages are in `docs/accounts-payments.md`.
- **Updates** `/updates/`: a log of what was added (texts, courses, languages, encyclopedia, site), newest first, by
  month. Add an entry to `config/updates.ts` whenever something a reader would notice goes live.
- **Contact** `/contact/`: a form (name, email, subject, page, message; `#topic=` and `page=` fill it in, as a fragment or a query) posted to
  `api/contact.js`, which mails it through Resend to `SITE.email` (info@thenahwi.com) with the writer as Reply-To
  (env `RESEND_API_KEY`, optional `CONTACT_FROM`, `CONTACT_TO`). Without a key, or on an error, the reader's own mail
  program opens with the message filled in. A hidden field and a minimum time keep robots out; nothing is stored,
  and the privacy page says so.

Interface text of the knowledge base is in the `kb` dictionary.

## Search marks

Every search (the site search with its result list and the page opened from it via `?hl=`, the glossary A–Z, the
scholars list, the book catalogues) finds and marks words the same way, through `window.__hl`
(`components/HighlightLib.astro`, in `<head>`): folded like the search, all words must occur, hits wrapped in
`mark.search-hl` (red). Results whose match is not in the title show the piece of text where it occurs. A new search
field uses the same helper.

## House style: "Zwart-wit met rood"

- Ink for structure (black in light, near-white in dark: `--primary`, with `--on-primary` for text on it); one red
  only for the current item, the main action, kickers and the accent in the hero. Red under white text (buttons, the
  current tile) uses `--red-fill`/`--on-red`, the same in dark mode so the contrast holds. Locked items are greyed
  with `--muted`, not with opacity. Tiles (rotated squares) mark steps.
- Colours are CSS tokens in `apps/web/src/styles/global.css`, with light and dark values; never hard-code a colour.
- Two looks, by area (`data-area` on `<html>`, set in `BaseLayout`): the study portal (`study`: `/study/`,
  `/complete/`, `/terms/`, `/text/`, `/practice/`) is in "Clear glass"; everything else (`kb`: the knowledge base,
  the account, prices, contact, about) keeps the classic look (decisions 2026-11-23).
- "Clear glass" (study portal, 2026-11-21): a light ground with a faint red glow (`--bg`, `--bg-glow`), cards of
  frosted glass (`--glass`, `--glass-edge`, `--glass-shadow`, a backdrop blur), round buttons (pills) with a soft red
  glow under the main action, and dark glass panels (`--panel…`) for the one thing that matters now, such as the
  level the reader is on or the access note. Dark mode has its own values for every glass token. Keep the blur on
  surfaces that sit over something (header, bars, cards); never put glass behind long reading text without a solid
  enough `--glass`. The header there is one row of light glass that stays at the top while scrolling (`.site-tabs`,
  `--glass-header…`), with a black logo mark (`--mark-bg`).
- The classic look (outside the study portal): a plain white ground (black in dark mode) without the glow, the header
  one black row that scrolls away with a white logo mark, square black panels the full width of the page (the
  knowledge-base heroes and bands, the handbooks on the home page, the account and price panels), plain cards with a
  hairline, buttons, chips, search bars and fields with square or slightly rounded corners, a solid tab bar. The
  `kb-…`, `home-…`, `account…` and `price-…` rules are written in this look; the shared rules (header, cards,
  buttons) are set back to it under `:root[data-area="kb"]` in the last block of `global.css`, and its tokens right
  after the dark-mode tokens.
- The header holds the logo, the menu (News, Encyclopedia, Glossary, About and the Study portal in red) and the
  tools. Encyclopedia (books, scholars, curricula) and About show their pages in a second row under it, like the
  study portal; on phones that row scrolls sideways.
- The knowledge base uses the "Split" design: `components/KbHero.astro` (a photo beside a black panel) and
  `KbBand.astro`. Reading text in Literata; Arabic titles always in Kufi (`.kufi`, `--font-kufi`), whatever the
  typeface setting.
- Photos: black-and-white architecture photos (Unsplash, `public/photos/`, listed with alt text, place and, for the
  record, credit in `src/config/photos.ts`; captions show only the place). They stand beside black panels in the
  knowledge base, never as a background behind text. The only place in the study portal is the madrasa cards of the
  study page (`photo` in `config/madrasas.ts`). After adding photos, run `apps/web/scripts/make-og.cjs`.
- The logo is a square-Kufic mīm (م) with a red square in its loop: `public/favicon.svg`, the PNGs in
  `public/icons/` and the brand mark in `BaseLayout`. The site's Arabic name is النَّحْوِيّ.
- The eight-pointed-star pattern (`.tegels`, `public/patterns/khatam.svg`) is not in use.
- Right-to-left languages use logical CSS properties (`docs/i18n.md`).
