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
