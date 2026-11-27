# The knowledge base and the house style

The knowledge base is the site itself, free to everyone; the study portal is the course (`docs/study.md`). The news
pipeline is in `docs/news.md`.

## Pages

- **Home** `/<locale>/`: the carved stucco medallion of Arabic script beside a turquoise panel with the title and the search (`KbHero`), then the
  six handbooks (al-Kāfiya, al-Shāfiya, al-ʿIzzī, the Alfiyya, al-Ājurrūmiyya, Qaṭr al-nadā; turquoise panel, with
  their photos) beside the masters (a line of the main scholars), then the news in
  its three sections side by side, the curricula and the study portal.
- **Articles**: `/nahw/` (About naḥw and ṣarf: what each is, why ṣarf comes first, the stories of the grammarians,
  the ṭabaqāt of the grammarians, Basra and Kufa) and `/curricula/` (articles
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
- **Generations of the grammarians** `/scholars/generations/` (`pages/[locale]/scholars/generations.astro`, text in
  `kb.generations`, styles `.gen-…`): the backbone of the scholars, after the idea of Hanafiatlas's scholars by century
  and region. An introduction on the ṭabaqāt works (with links to them in the library, kind `biography`); then
  al-Zubaydī's lists (Ṭabaqāt al-naḥwiyyīn wa-l-lughawiyyīn: the grammarians and lexicographers of Basra and Kufa, the
  Egyptians, the men of Qayrawān, the Andalusians), each generation a copper tile with its scholars in the order of his
  entries; then the later grammarians by `school`; then everyone by the hijri century of his death. Beside each name the
  hijri year of death (`diedHijri` in `lib/kb.ts`), his city (the last of his `places`: list a scholar's places in the
  order of his life, the place of death last) and his books with a page. Each person has `school` (`SCHOOLS` in the
  schema: basra, kufa, baghdad, egypt-sham, andalus, maghrib, hijaz-yemen, persia-central-asia, ottoman, india) and,
  where al-Zubaydī lists him, `tabaqa` `{ list, n, entry }`; `loadBackground` checks that the generation exists in the
  list, that the list fits the school, and that every Basran and Kufan has his place (`TABAQA_GENERATIONS`). Linked
  from the scholars page, the home page (under the masters) and each scholar's aside (his school and generation). A
  person's `name` is his full name and `known` the short one the lists show (`shortName`).
- **Glossary** `/glossary/` and `/glossary/<slug>/` (`background/concepts/`, schema `BackgroundConcept`): every concept
  of ṣarf and naḥw, free to read without an account, as the knowledge base's way into search: one page per concept with its
  vocalised Arabic and transliteration, a one-sentence definition, an explanation, examples, related concepts, the
  handbooks that treat it and, through `term`, the lesson of the study path that teaches it (which may ask for an
  account). The A–Z list has a search field and a topic dropdown (`category`, through `scripts/scholars-filter.js`); the
  category `jargon` holds the words of the commentaries and of the Baṣran–Kūfan debate (samāʿ, qiyās, ʿilla, taqdīr,
  maḥall, wa-fīhi naẓar, fa-in qīla … qultu …). A verb form in an example comes from the engine
  (`scripts/tasrif.ts`) or is found in a transcribed print (`primers/`), never typed by hand.
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
  `api/contact.js`, which mails it through Resend to `SITE.email` (info@themantiqi.com, The Mantiqi's address) with the writer as Reply-To
  (env `RESEND_API_KEY`, optional `CONTACT_FROM`, `CONTACT_TO`). Without a key, or on an error, the reader's own mail
  program opens with the message filled in. A hidden field and a minimum time keep robots out; nothing is stored,
  and the privacy page says so.

Interface text of the knowledge base is in the `kb` dictionary.

## Search marks

Every search (the site search with its result list and the page opened from it via `?hl=`, the glossary A–Z, the
scholars list, the book catalogues) finds and marks words the same way, through `window.__hl`
(`components/HighlightLib.astro`, in `<head>`): folded like the search, all words must occur, hits wrapped in
`mark.search-hl` (copper). Results whose match is not in the title show the piece of text where it occurs. A new search
field uses the same helper.

## House style: "Turkoois en koper"

- Deep turquoise, copper orange and pale turquoise on white (decisions 2026-11-26), after the turquoise tilework of Iran
  and Central Asia. Deep turquoise (`#0e4f55`, `--header`, `--panel`) for the structure: the knowledge base's header and
  tab row, its hero, the handbooks on the home page, the account and price panels, the madrasa cards and the current
  level. Copper for the accent (`--red`, `--red-fill`: the old names are kept): the main buttons (`#c2410c` under white
  text, 5.2:1), the current item and the kickers; on turquoise, text and marks take a lighter copper (`#ffb27a`,
  5.3:1) while buttons keep the copper fill (the last block of `global.css`). Pale turquoise for the soft surfaces: the
  bands of the knowledge base (`.kb-band`, `.kb-cta`), the masters beside the handbooks, the second menu row, chosen
  chips and the faint ground of the study portal (`--sky`, `--sky-soft`, `--primary-soft`); there the text is ink and
  the accent the darker copper (`#a8380a`). Reading text is a deep green-black ink (`--ink`), secondary text `--muted`.
  Dark mode is a deep green-black (`#0b1819`) with a turquoise header and the same copper. True red is kept for wrong
  answers and errors only (`--bad`, `--bad-soft`). Locked items are greyed with `--muted`, not with opacity. Tiles
  (rotated squares) mark steps.
- Arabic is set in Noto Kufi Arabic (`--font-arabic`, and `--font-kufi` for the titles), as on The Mantiqi (since
  27 November 2026, the owner's choice; before it Baloo Bhaijaan 2); the settings menu of the study portal still
  offers Naskh and Amiri.
- Colours are CSS tokens in `apps/web/src/styles/global.css`, with light and dark values; never hard-code a colour.
- Two looks, by area (`data-area` on `<html>`, set in `BaseLayout`): the study portal (`study`: `/study/`,
  `/complete/`, `/terms/`, `/text/`, `/practice/`) is in "Clear glass"; everything else (`kb`: the knowledge base,
  the account, prices, contact, about) keeps the classic look (decisions 2026-11-23).
- "Clear glass" (study portal, 2026-11-21): a warm white ground with a faint orange glow (`--bg`, `--bg-glow`), cards of
  frosted glass (`--glass`, `--glass-edge`, `--glass-shadow`, a backdrop blur), round buttons (pills) with a soft orange
  glow under the main action, and turquoise glass panels (`--panel…`) for the one thing that matters now, such as the
  level the reader is on or the access note. Dark mode has its own values for every glass token. Keep the blur on
  surfaces that sit over something (header, bars, cards); never put glass behind long reading text without a solid
  enough `--glass`. The header there is one row of light glass that stays at the top while scrolling (`.site-tabs`,
  `--glass-header…`), with a copper logo tile and a white nūn (`--mark-bg`, `--mark-ink`, `--mark-dot`).
- The classic look (outside the study portal): a plain white ground (a deep green-black in dark mode) without the glow,
  the header one turquoise row that scrolls away with the copper logo tile, square turquoise and pale-turquoise panels the full width of the page (the
  knowledge-base heroes and bands, the handbooks on the home page, the account and price panels), plain cards with a
  hairline, buttons, chips, search bars and fields with square or slightly rounded corners, a solid tab bar. The
  `kb-…`, `home-…`, `account…` and `price-…` rules are written in this look; the shared rules (header, cards,
  buttons) are set back to it under `:root[data-area="kb"]` in the last block of `global.css`, and its tokens right
  after the dark-mode tokens.
- The header holds the logo, the menu (News, Encyclopedia, Glossary, About and the Study portal as a copper button) and the
  tools. Encyclopedia (books, scholars, curricula) and About show their pages in a second row under it, like the
  study portal; on phones that row scrolls sideways.
- The knowledge base uses the "Split" design: `components/KbHero.astro` (a photo beside a turquoise panel) and
  `KbBand.astro`. Reading text in Literata; Arabic titles always in the site's Arabic face (`.kufi`, `--font-kufi`),
  whatever the typeface setting.
- Photos: seventeen photos of Arabic inscriptions, chosen by the owner (tile, stucco, paint, wood and stone; Unsplash,
  `public/photos/`, listed with alt text and, for the record, the photographer and Unsplash page in
  `src/config/photos.ts`). The files are in colour; the site shows them in black and white with a little more contrast
  (`picture img` in `global.css`, and the share images in `make-og.cjs`), so the turquoise and copper are the only colours
  on the page. None says where it was taken, so none has a `place` and no caption is shown. The home page has Sultan Ali's
  painted arch with Allāh kāfī (`painted-arch-allah-kafi`, since 27 November 2026, the owner's choice), also the
  Indian path's; the glossary has the tiled portal with its verse (`tiled-portal-verse`); the carved stucco
  medallion (`stucco-medallion-blue`) is kept for articles and scholars without a photo of their own. Each section, handbook and madrasa path has its own (`KB_SECTIONS` in `lib/kb.ts`, `config/kb-books.json`, `curriculum.json`), and articles and
  scholars without one get one of the seventeen by `photoFor`. They stand beside the panels, never as a background behind text. After
  adding a photo, put its 1600-wide WebP in `public/photos/`, run `apps/web/scripts/make-photos.cjs` (the smaller
  sizes) and `apps/web/scripts/make-og.cjs` (the share images).
- The logo is a square-Kufic nūn (ن), its dot a square: white on a copper tile (`public/favicon.svg`, the PNGs in
  `public/icons/`, the app icons, the brand mark in `BaseLayout`). The site's Arabic name is النَّحْوِيّ.
- The eight-pointed-star pattern (`.tegels`, `public/patterns/khatam.svg`) is not in use.
- Right-to-left languages use logical CSS properties (`docs/i18n.md`).
