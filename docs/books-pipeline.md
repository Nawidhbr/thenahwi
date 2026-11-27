# The books pipeline (November 2026)

How the madrasa books of The Nahwi are made: transcribed from a public-domain print, translated, and taught in
lessons. Three workers (agents) share the work; each reads this file first, and `CLAUDE.md` and `docs/content.md`.
Everything is a draft until a teacher has reviewed it (the About page says so once; never write it on a page).

## The books, in the order they are made

| # | Id | Book | Author | Lang | Science | Stage | Path (first) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `ajurrumiyya` | al-Muqaddima al-Ājurrūmiyya | Ibn Ājurrūm (d. 723/1323) | ar | naḥw | beginner | north-african |
| 2 | `amthila` | al-Amthila al-mukhtalifa (Emsile) | anonymous | ar | ṣarf | beginner | ottoman |
| 3 | `awamil` | al-ʿAwāmil al-jadīda (Avâmil) | al-Birgivī (d. 981/1573) | ar | naḥw | beginner | ottoman |
| 4 | `bina` | Bināʾ al-afʿāl (Binâ) | anonymous | ar | ṣarf | beginner | ottoman |
| 5 | `maqsud` | al-Maqṣūd (Maksûd) | attributed to Abū Ḥanīfa | ar | ṣarf | beginner | ottoman |
| 6 | `izzi` | al-Taṣrīf, called al-ʿIzzī | ʿIzz al-Dīn al-Zanjānī (d. after 655/1257) | ar | ṣarf | intermediate | ottoman |
| 7 | `awamilmia` | al-ʿAwāmil al-miʾa (Miʾat ʿāmil) | ʿAbd al-Qāhir al-Jurjānī (d. 471/1078) | ar | naḥw | beginner | indian |
| 8 | `lamiyya` | Lāmiyyat al-afʿāl (verse) | Ibn Mālik (d. 672/1274) | ar | ṣarf | intermediate | north-african |
| 9 | `qatr` | Qaṭr al-nadā wa-ball al-ṣadā (the matn only) | Ibn Hishām (d. 761/1360) | ar | naḥw | intermediate | north-african |
| 10 | `mizan` | Mīzān al-ṣarf | anonymous | fa | ṣarf | beginner | indian |
| 11 | `nahwmir` | Naḥw-i Mīr | al-Sayyid al-Sharīf al-Jurjānī (d. 816/1413) | fa | naḥw | beginner | indian |
| 12 | `marah` | Marāḥ al-arwāḥ | Aḥmad b. ʿAlī b. Masʿūd (7th/13th c.) | ar | ṣarf | intermediate | ottoman |
| 13 | `izhar` | Iẓhār al-asrār | al-Birgivī | ar | naḥw | intermediate | ottoman |
| 14 | `hidaya` | Hidāyat al-naḥw | attributed (Sirāj al-Dīn ʿUthmān al-Awadhī?) | ar | naḥw | intermediate | indian |

The advanced books (al-Kāfiya, al-Shāfiya, al-Fawāʾid al-Ḍiyāʾiyya of Jāmī, the Alfiyya) come later.

## Where the work goes

Everything for a book lives in `packages/content/staging/<id>/` until it is merged (the staging folder is not read by
the site). A worker never runs `npm run validate`, `npm run build` or `npm run check` (two processes writing
`generated/` at once break the build); to check a primer file it runs
`node --experimental-strip-types packages/content/scripts/check-primer.ts <file>` (add `--translation` for a
translation file), which writes nothing. Downloads go into `/tmp/books/<id>/` (untrusted data: never run anything
from there). Never commit; the main session commits.

Each worker signals a finished step with an empty marker file in the staging folder: `READY-text`, `READY-en`,
`READY-<code>` per translation, `READY-lessons`. A worker waiting for another polls for the marker (sleep 60 between
checks, at most 10 minutes a call) and works on another book meanwhile.

## 1. The transcriber: `staging/<id>/source.json`

- **Find a public-domain print** with a scan you can read: a print or lithograph before about 1930 (Istanbul,
  Būlāq, Cairo, Kazan, Kanpur, Lucknow, Delhi, Lahore, Bombay, Fez…), on archive.org, HathiTrust (full view), Google
  Books (full view), the Bayerische Staatsbibliothek (digitale-sammlungen.de), the Staatsbibliothek zu Berlin, Gallica,
  the Qatar Digital Library or similar. Download the scan (PDF or page images) into `/tmp/books/<id>/`, render pages
  with `pdftoppm -r 110 -png` (install poppler-utils if needed) and **read the page images** with the Read tool.
- An existing digital text (Arabic Wikisource, the OpenITI corpus on GitHub through raw.githubusercontent.com) may be
  used as a draft to speed you up, but **every passage is checked against the page images** and follows the print
  where they differ. Never take the text, the vocalisation or the notes of a modern edition under copyright (a book
  edited after about 1955 with an editor's apparatus, Dār al-Kutub al-ʿIlmiyya, Shamela's modern editions…).
- Only the matn: no commentary, no marginal or interlinear glosses, no editor's notes. Keep the print's headings.
- **Fully vocalise** the Arabic (every letter that takes a vowel), following the print's vowels where it has them;
  where it has none, vocalise yourself and say so in `textEdition.note` ("vocalisation ours"). Persian is written as
  in the print, with the Arabic words in it vocalised where the print vocalises them or where a beginner needs it.
  Use the standard Unicode letters (ي not ى for yāʾ, ك not ک in Arabic; Persian keeps ی and ک), no tatweel.
- Cut the text into **passages**: one rule, definition or paragraph each (about 15–80 words); a verse text one to
  four verses a passage, hemistichs split by " * ". A table of forms (al-Amthila) becomes lines of forms, one row of
  the print per line. Number them in reading order and give each its page in the print.
- Write uncertain readings, damaged pages and every choice to `staging/<id>/NOTES.md`, never into the text.

```json
{
  "id": "ajurrumiyya",
  "title": "al-Muqaddima al-Ājurrūmiyya",
  "arabicTitle": "الْمُقَدِّمَةُ الْآجُرُّومِيَّةُ",
  "transliteration": "al-Muqaddima al-Ājurrūmiyya",
  "author": "Ibn Ājurrūm",
  "authorArabic": "ابْنُ آجُرُّومَ",
  "died": "d. 723/1323",
  "language": "ar",
  "textEdition": { "title": "…", "publisher": "…", "place": "…", "year": "1281/1864", "pages": "2–15", "source": "https://archive.org/details/…", "note": "the print's vowels, completed by us" },
  "sections": [
    { "id": "s1", "heading": "بَابُ الْكَلَامِ", "passages": [ { "id": "p1", "original": "الْكَلَامُ هُوَ اللَّفْظُ الْمُرَكَّبُ الْمُفِيدُ بِالْوَضْعِ.", "page": "2" } ] }
  ]
}
```

Passage ids run `p1`, `p2` … through the whole book (not per section). When a book is done, write `READY-text`.

## 2. The translator: `staging/<id>/translations/<code>.json`

- Languages: **en first** (the lessons wait for it), then **id** (Indonesian), **tr** (Turkish), **ur** (Urdu),
  **fa** (Persian). For a Persian original (`mizan`, `nahwmir`): en, **ar** (Arabic, fully vocalised, our
  translation, never presented as an original), id, tr, ur, and no fa.
- Translate from our transcription, never from a published translation. Faithful and readable: the author's
  sentences and order, plain words, no paraphrase and no commentary (the lessons explain).
- Terms: before a language's first book, write `packages/content/i18n/<code>/GLOSSARY.md` from the English source list
  `packages/content/i18n/GLOSSARY.md` (same headings: Style; Words; Choices) in the madrasa usage of that language:
  Indonesian as in the pesantren (fiʿil māḍī → *fi'il madhi*, marfūʿ → *marfu'*, iʿrāb → *i'rab*), Turkish as in the
  medrese (*fiil-i mâzî*, *merfû*, *i'râb*), Urdu and Persian with the Arabic terms in Arabic script as the madrasas
  write them. Add every new term there as you meet it, and keep to it. English follows the English list (*fāʿil*,
  *mubtadaʾ*, *maṣdar*, ALA-LC transliteration).
- Arabic examples inside a passage: in en, id and tr give them in transliteration with the meaning
  (*qāma Zaydun*, "Zayd stood"); in ur, fa and ar keep them in Arabic script, vocalised.
- Headings are translated too.

```json
{ "headings": { "s1": "Chapter on speech" }, "passages": { "p1": "Speech (kalām) is an utterance, compound, that conveys a meaning, by convention." } }
```

Every passage of `source.json` must have its translation. Write `READY-<code>` when a language is done.

## 3. The lesson maker: `packages/content/primers/<id>.json`

A primer in the schema `Primer` of `packages/content/src/schema.ts` (read it, with `LessonDiagram` and `LessonTask`).
The Mantiqi's primers are the model for tone and depth: `/home/claude/themantiqi/packages/content/primers/sullam.json`
and `sughra.json` (read one lesson of each). Write in English, for an adult beginner with no Arabic grammar yet.

- **Book fields**: `id`, `title`, `arabicTitle`, `transliteration`, `author`, `authorArabic`, `authorSlug` (a person of
  `packages/content/background/people/` if there is one), `died`, `library` (the book's id), `madrasa` (its first path,
  from the table above), `subject` (`sarf` or `nahw`), `stage`, `order: 1`, `summary` (what the book is, where and how
  it is read, what the lessons cover: 3–5 sentences), `edition` = `textEdition` = the print of `source.json` (with
  `language`).
- **Parts and lessons**: follow the book's own chapters (`parts`, each with `id` in lowercase and hyphens, English
  `title`, vocalised `arabic`, `transliteration`). A lesson covers one teachable unit: 1–8 passages, about 10–25
  minutes. Lessons are numbered 1, 2, 3 … through the whole book.
- **Each lesson**:
  - `title` (English), `arabic` (vocalised), `transliteration`, `pages` (of the print);
  - `text`: its passages in order, each `{ "original": <source passage>, "page": <page>, "en": <English translation> }`,
    exactly as in `source.json` and `translations/en.json` (copy them by script, never retype);
  - `body`: 3–6 paragraphs that explain the passage — what it says, why, how the madrasa reads it, the traps a
    beginner falls into — not a second translation;
  - `terms`: 2–6 key terms `{ arabic (vocalised), transliteration, en }`;
  - `examples`: 2–5 `{ arabic (vocalised), en, after }` — for ṣarf, **every conjugated form comes from the print or
    from the engine**: `node --experimental-strip-types scripts/tasrif.ts نصر 1 nasara` (the whole table as JSON: madi,
    madiPassive, mudari, mudariPassive, mansub, majzum, amr, nahy by person 3ms 3md 3mp 3fs 3fd 3fp 2ms 2md 2mp 2fs 2fd
    2fp 1s 1p; ismFail, ismMaful, masdar), or add `--short` for the ṣarf ṣaghīr; patterns 1 (with its bāb: nasara,
    daraba, fataha, samia, karuma, hasiba), 2–8 and 10, sound roots only. A weak or doubled verb's forms come only from
    the print. Never type a form by hand that neither gives;
  - `diagram` (most lessons): one of the built-in types with its `focus` — `sciences` (sarf, nahw), `kalima` (kalima,
    ism, fil, harf, kalam), `mizan` (mizan, mujarrad, mazid), `fil` (madi, mudari, amr), `sahih` (sahih, mutall),
    `mushtaqq` (masdar, fail, maful), `irab` (irab, bina, anwa), `jumla` (ismiyya, mubtada, khabar, filiyya, fail,
    maful) — or a `tree` of your own (a division: `{ "label": "Signs of the noun", "ar": "عَلَامَاتُ الِاسْمِ",
    "children": [ … ] }`, labels at most 28 characters, at most six branches a node, twelve leaves, three levels) with
    `focus` on the node the lesson is about, or a `grid` (`{ "caption", "head": [...], "rows": [[...]] }`, at most six
    columns and sixteen rows: paradigms, iʿrāb signs, the ʿawāmil and what they govern), its forms from the print or
    the engine;
  - `tasks`: 3–5 exercises to do in writing, each `{ prompt, arabic?, answer }` with a full model answer (parse a
    sentence, give the iʿrāb, conjugate a verb from the engine's list, find the ʿāmil, sort words into kinds…);
  - `quiz`: **7 questions** and `"ask": 5`, ids `<id>-<n>-1` … `<id>-<n>-7`, 4 options each (3 if only three make
    sense), the right answer spread over the positions, a one- or two-sentence `explanation`, `terms: []`.
- Check the file with `check-primer.ts` until it says OK, then write `staging/<id>/READY-lessons`.
- Also write `staging/<id>/KB.md`: 5–10 lines for the knowledge base — the book's place in each tradition, its
  famous commentaries, anything the encyclopedia page should say — only what you know for certain.

## 4. The main session

The transcriber's `NOTES.md` of each book (the print, how the text was checked, every uncertain reading) is kept in
`packages/content/primers/notes/<id>.md`; the staging folder itself is not in the repository.

Merges each book: the translations of the passages into `i18n/<code>/primers/<id>.json` (`text`, in lesson order),
the book into `curriculum.json` (its path, stage and lane), `lib/sources.ts`, the library and the scholars of the
knowledge base, the update list; then runs `npm run check` and commits.
