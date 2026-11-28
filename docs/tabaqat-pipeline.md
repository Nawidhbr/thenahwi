# The ṭabaqāt of the grammarians on the site (from 27 November 2026)

The owner's wish: take one classical ṭabaqāt work of the grammarians, put the whole book on the site, entry by entry,
on a page of its own, and make it the backbone of the encyclopedia — every entry tied to its scholar's page.

## The book

Ibn al-Anbārī (Abū al-Barakāt, d. 577/1181), **Nuzhat al-alibbāʾ fī ṭabaqāt al-udabāʾ**: the grammarians and
philologists from Abū al-Aswad al-Duʾalī to the author's own time, in chronological order, about 190 entries. It
follows al-Zubaydī and the older lists and is the shortest complete ṭabaqāt of the grammarians from the classical
period. The text follows a **public-domain print** (the Cairo print of 1294/1877, or another print before about 1930),
never a modern edition: a modern edition's text, vocalisation and notes may not be used (an OpenITI or Shamela text,
made from a modern edition, may serve only as a consonant draft to compare, never for vowels or notes).

## Who does what

- **The lead** (one worker): confirms the print and its scan, lists every entry with its pages in
  `packages/content/staging/nuzhat/PLAN.md` and divides them into four chunks of about equal length; builds the data
  format, its validation and the pages (see below); and at the end merges the chunks, ties each entry to its scholar
  (an existing page in `packages/content/background/people/`, or a new one it writes from the entry and a real
  source), and makes the book the backbone (the generations page and the scholar pages link to it).
- **Four chunk workers**, one per chunk of PLAN.md: transcribe their entries from the page images and translate each
  into English, writing `packages/content/staging/nuzhat/chunk-<k>.json` and the marker `READY-<k>` when done.

## The entry format (`chunk-<k>.json`)

```json
{ "chunk": 1, "entries": [
  { "n": 1, "id": "abu-al-aswad", "heading": "أَبُو الْأَسْوَدِ الدُّؤَلِيُّ", "name": "Abū al-Aswad al-Duʾalī",
    "died": "69/688", "pages": "4–9",
    "paragraphs": [ { "ar": "…fully vocalised Arabic of one paragraph…", "page": "4", "en": "…English…" } ],
    "person": "abu-al-aswad", "notes": "doubtful readings, if any" }
] }
```

- `n` is the entry's number in the book (in order through the whole book), `id` a slug of the name (as the people
  files name the scholar where one exists), `person` the slug of an existing scholar page if there is one (else
  leave it out: the lead adds it).
- The Arabic is transcribed from the print's page images, fully vocalised (the print's vowels where it has them,
  ours otherwise), in paragraphs as the print has them (split a long one at a sentence), each with its page; verse
  lines as "hemistich * hemistich". Isnāds and quoted verses are part of the entry.
- The English is our own translation: faithful, readable, the names in ALA-LC transliteration, verse translated as
  prose; no commentary. Where a reading is doubtful, say so in `notes`, never in the text.

## Rules

`CLAUDE.md` holds. Never run `npm run validate`, build or check except the lead, and the lead only wrapped in
`flock /tmp/nahwi-gen.lock …`. Never commit. Downloads go to `/tmp/books/nuzhat/` (never run anything from there).
Keep `packages/content/staging/nuzhat/STATUS.md` up to date (one line per chunk and per step); a worker whose context
runs low writes exact hand-over notes there (which entries are done) so the next one can continue.

# The second book: al-Suyūṭī's Bughyat al-wuʿāt (from 27 November 2026, 23:35)

The owner's choice after the Nuzha: Jalāl al-Dīn al-Suyūṭī (d. 911/1505), **Bughyat al-wuʿāt fī ṭabaqāt
al-lughawiyyīn wa-l-nuḥāt**, the fullest ṭabaqāt of the grammarians and philologists (about 2,200 entries, up to the
author's time; it takes over much of the Nuzha, al-Zubaydī, al-Qifṭī and Yāqūt). It becomes the full reference
beside the Nuzha, which stays the chronological story of the first centuries: every scholar page links to both.
The text follows a **public-domain print**, the Cairo print of 1326/1908 (Maṭbaʿat al-Saʿāda, ed. Muḥammad Amīn
al-Khānjī) or another print before about 1930; never a modern edition (Abū al-Faḍl Ibrāhīm's included). The rules
above hold, with these differences:

- **Folders:** `/tmp/books/bughya/` for downloads, `packages/content/staging/bughya/` for PLAN.md, STATUS.md,
  `chunk-<k>.json` and `READY-<k>`; the book goes to `packages/content/tabaqat/bughya.json` (same `TabaqatBook`
  schema; extend it only where the Bughya needs it, e.g. the alphabetical sections).
- **Chunks:** the book is long, so the lead divides it by pages into chunks of about **25 print pages** (the print
  is typeset, so a page holds much more than a page of the Nuzha), numbered in order, and the coordinator starts one
  worker per chunk as places free up. A worker whose context runs low writes in STATUS.md the last entry finished, and
  the next worker for that chunk goes on from there.
- **Order:** the book is alphabetical (those named Muḥammad first). Keep the book's order and numbering; the pages
  also offer the entries by century of death (from `died`).
- **Pages:** the site now has two ṭabaqāt works. `/<locale>/tabaqat/` becomes the overview of both; each book lives
  at `/<locale>/tabaqat/<book>/` with its entries at `/<locale>/tabaqat/<book>/<id>/` (the Nuzha moves to
  `/tabaqat/nuzhat/…`; add permanent redirects from the old Nuzha addresses in `vercel.json`). Because the Bughya is
  so large, **build its entry pages in English only** (other locales link to the English entry) until it is
  translated, and keep its search index to name, death year and id, so the build stays within the machine's memory.
- **Linking:** at the merge, tie each entry to an existing scholar page where there is one (the 142 people and any the
  Nuzha agents add); new scholar pages only for grammarians the site's books or curricula name, the rest later.
- **Done (lead, 27 November):** the print is confirmed (Cairo 1326/1908, Bibliotheca Alexandrina's copy on the
  Internet Archive, PDF page = print page + 4), the plan and the 19 chunks are in `staging/bughya/PLAN.md`, the pages
  are built (`docs/knowledge-base.md`, "The ṭabaqāt"). Chunk workers number their entries `<chunk>-<k>`; the lead
  merges with `staging/bughya/_merge.py` (renumbering, the Common Era years, stable ids in `ids.json`, scholar ties in
  `person.json`), which writes `tabaqat/bughya.json`. Chunk 18 holds the lists after the entries and chunk 19 the
  chapter of hadiths and the closing, both as `appendix` (schema `TabaqatAppendix`).
