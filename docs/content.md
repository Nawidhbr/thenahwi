# Content

What is taught, where each piece of content lives, and the rules for the texts. Everything is JSON in
`packages/content`, validated by `src/schema.ts` and bundled into `generated/` by `npm run validate -w
@nahwi/content`. The study rules that use this content are in `docs/study.md`; translations in `docs/i18n.md`.

## The paths and their books

The study portal offers three madrasa paths (`curriculum.json`, validated; `apps/web/src/config/madrasas.ts` reads
it). The reader chooses one at the start: first the path (the tradition), then within each level the science. Level 1
is al-Mabādiʾ, read for both sciences; every later level has **two lanes side by side, ṣarf and naḥw**
(`"sarf"`, `"nahw"`), each with its books in reading order, and a `stage` (beginner, intermediate, advanced). A lane may
name a book that is not a course yet: it shows as "in preparation" (its name in `madrasa.soonBooks` of the UI
dictionary, tested in `test/levels.test.ts`) and counts for nothing until `primers/<id>.json` exists; then it appears
by itself. A primer's `subject` must match its lane (checked by the validation).

| Path | 1 | 2 · beginner | 3 · intermediate | 4 · advanced |
| --- | --- | --- | --- | --- |
| Indian | `mabadi` | ṣarf: Mīzān al-ṣarf (`mizan`) · naḥw: Naḥw-i Mīr (`nahwmir`), al-ʿAwāmil al-miʾa (`awamilmia`) | naḥw: Hidāyat al-naḥw (`hidaya`) | ṣarf: al-Shāfiya · naḥw: al-Kāfiya, Sharḥ Jāmī |
| Ottoman | `mabadi` | ṣarf: al-Amthila (`amthila`), Bināʾ al-afʿāl (`bina`), al-Maqṣūd (`maqsud`) | ṣarf: al-ʿIzzī (`izzi`), Marāḥ al-arwāḥ (`marah`) · naḥw: Birgivī's al-ʿAwāmil (`awamil`), Iẓhār al-asrār (`izhar`) | naḥw: al-Kāfiya, Sharḥ Jāmī |
| North-African | `mabadi` | naḥw: al-Ājurrūmiyya (`ajurrumiyya`) | ṣarf: al-ʿIzzī, Lāmiyyat al-afʿāl (`lamiyya`) · naḥw: Qaṭr al-nadā (`qatr`) | naḥw: the Alfiyya |

The Ottoman path reads ṣarf first, as its madrasas did (the five books of the *ṣarf cümlesi* before naḥw: its naḥw
lane begins on level 3); the North-African path begins with naḥw (al-Ājurrūmiyya). A book may stand on several paths
(al-ʿIzzī); its prerequisites per path are in `ap`. The rule (`lib/course.ts` `needsOn`, tested in
`test/levels.test.ts` and `test/progress.test.js`): a book needs the book before it in its lane; the first book of a
lane needs every course of the level before (the first reading as "terms"), going back over levels that are still
only in preparation. Pages number the courses of a level across both lanes, ṣarf first (2a, 2b …, `pathLevel`).
Level texts are in `madrasa.levels` of the UI dictionary.

## The books

| Id | Book | Kind | Original text shown |
| --- | --- | --- | --- |
| `mabadi` | al-Mabādiʾ: the first terms of ṣarf and naḥw (27 terms, ṣarf first) | terms | none: our own text (`matn/mabadi.json`, `edition: null`) |

The madrasa books of levels 2 and 3 are made by the pipeline in `docs/books-pipeline.md` (transcription from a
public-domain print, translation, lessons), each a primer course (`primers/<id>.json`) with the whole original, its
translation into English and (`i18n/<code>/primers/<id>.json`, `text` only) Indonesian, Turkish, Urdu and Persian — or
Arabic instead of Persian for a Persian original — and per lesson an explanation, terms, examples, a diagram, written
exercises (`tasks`) and a test. Each book's print, and how its text was checked, is in `textEdition` and on its page.

| Id | Book | Science, stage | Print followed | Passages | Lessons |
| --- | --- | --- | --- | --- | --- |
| `ajurrumiyya` | al-Muqaddima al-Ājurrūmiyya | nahw, beginner | Cambridge 1852 (Arabic; [scan](https://archive.org/details/46-al-adjrumiieh)) | 70 | 35 |
| `amthila` | al-Amthila al-mukhtalifa | sarf, beginner | 1317/1899–1900 (Arabic; [scan](https://archive.org/details/mecmuatussarf)) | 37 | 20 |
| `awamil` | al-ʿAwāmil al-jadīda | nahw, beginner | Constantinople 1302/1885 (Arabic; [scan](https://archive.org/details/20260623_20260623_1051)) | 41 | 18 |
| `bina` | Bināʾ al-afʿāl | sarf, beginner | 1316/1898–99 (Arabic; [scan](https://archive.org/details/mecmuatussarf)) | 46 | 16 |
| `maqsud` | al-Maqṣūd | sarf, beginner | 1316/1898–99 (Arabic; [scan](https://archive.org/details/mecmuatussarf)) | 90 | 30 |
| `izzi` | al-ʿIzzī | sarf, intermediate | c. 1316/1898–99 (Arabic; [scan](https://archive.org/details/mecmuatussarf)) | 102 | 32 |
| `awamilmia` | al-ʿAwāmil al-miʾa | nahw, beginner | Calcutta 1814 (Arabic; [scan](https://archive.org/details/miutamilshurhoom00abdauoft)) | 21 | 15 |
| `lamiyya` | Lāmiyyat al-afʿāl | sarf, intermediate | Cairo 1896 (Arabic; [scan](https://archive.org/details/hdhkitbmajmminmu00jazauoft)) | 52 | 20 |
| `qatr` | Qaṭr al-nadā | nahw, intermediate | 1261/1845 (Arabic; [scan](https://archive.org/details/in.ernet.dli.2015.361062)) | 119 | 48 |
| `mizan` | Mīzān al-ṣarf | sarf, beginner | Kanpur 1905 (Persian; [scan](https://archive.org/details/in.ernet.dli.2015.433705)) | 79 | 21 |
| `nahwmir` | Naḥw-i Mīr | nahw, beginner | Lucknow 1884 (Persian; [scan](https://archive.org/details/in.ernet.dli.2015.434706)) | 121 | 39 |
| `marah` | Marāḥ al-arwāḥ | sarf, intermediate | c. 1316/1898–99 (Arabic; [scan](https://archive.org/details/mecmuatussarf)) | 191 | 62 |
| `izhar` | Iẓhār al-asrār | nahw, intermediate | Constantinople 1302/1885 (Arabic; [scan](https://archive.org/details/20260623_20260623_1051)) | 172 | 52 |
| `hidaya` | Hidāyat al-naḥw | nahw, intermediate | Kanpur 1300/1883 (Arabic; [scan](https://archive.org/details/AAlexandrina-092498)) | 287 | 72 |

How each text was transcribed and checked, and every doubtful reading for the teacher, is in
`packages/content/primers/notes/<id>.md`.

**Never reproduce a modern edition under copyright**, and never translate from one. Where only a modern edition
exists, the lessons follow its order and the page names it, but its text is not shown.

## Kinds of book

- **Terms** (`terms/<slug>.json`): each term of al-Mabādiʾ on its own page, in book order. Every term names its
  `subject` (`sarf` or `nahw`) and its `chapter` (foundations, the kinds of word, root and pattern, the verb, sound and
  weak, derived nouns, iʿrāb and bināʾ, the sentence); the bundle is sorted ṣarf first, then by chapter and `order`.
  Every term has a `level` (all are 1: the first reading) and a `source` (`matn`); a term may set
  `diagram: { type, focus? }` (`docs/study.md`). Each has a 3-question test, `quizzes/<slug>.json`. The engine
  generates more questions (`packages/engine/src/exercises.ts`: the person of a form, the imperative, the participles
  and maṣdar of the augmented forms, and the bāb of a verb), used by the practice page.
- **Texts read lesson by lesson** (`commentaries/<id>/`; none yet): `text.json` (the edition and `track`), the Arabic
  blocks, `<code>.json` per translation (`en.json` is the English), `lessons.json` and, for a standalone text,
  `outline.json` (parts holding runs of lessons, shown as the text's chapters). Tests: `quizzes/<n>.json`. Our
  explanation of each lesson: `explain/<n>.json` (schema `LessonExplain`: `body`, `examples` with `after`, an optional
  `diagram`, `terms`). No lesson should show only the book's text and its translation. A mixed commentary
  (`mixed: true`, sharḥ mamzūj, as most commentaries on the Ājurrūmiyya and the Alfiyya are) marks the matn's words
  with {…} in the Arabic and every translation; pages show them in orange bold.
- **Primers** (`primers/<id>.json`, schema `Primer`; none yet): a book taught in our own lessons in the order of an
  edition: body, terms with Arabic, examples (each with `after`, the paragraph it is shown under), an optional
  `diagram`, a test (quiz ids `<id>-<n>-<k>`). Where a public-domain print exists (`textEdition`), each lesson carries
  its passage of the original (`text`: original, page, English). The Persian primers of the Indian path (Mīzān al-ṣarf,
  Naḥw-i Mīr) are taught in English lessons with the Persian original; they are never put into Arabic by us. Verse (the
  Alfiyya, the Lāmiyya) is stored line by line, hemistichs split by " * ". A primer whose `textEdition.selection` is
  true is our lessons with quotations: `text` holds only the passages quoted.

Every Arabic example is fully vocalised. A conjugated form or a table in a lesson comes from the engine or from the
print, never typed by hand; where the engine does not yet cover a form (the weak verbs), the lesson quotes the print.

A new book: give it a track number not yet used (only an id), its title in `track.levels.<n>` of the UI dictionary,
its source in `lib/sources.ts`, a place in `curriculum.json` (replacing its `soon`), and translations later
(`docs/i18n.md`). Previews need nothing (`docs/study.md`).

## Sources

Every text and course says where it comes from in the same way (`lib/sources.ts`, `components/SourceNote.astro`):
the original and its print (with the scan), what the lessons follow, the translation and the review; a text not
shown says why. A card on book pages, a short line with an info tile on lesson and level pages, the popover behind
the info tile on text pages, a short line in the text library. A new book gets its source there, not hand-written
on its page.

## Reviews

All explanations, tests and translations are drafts until a qualified teacher has reviewed them, and the draft
marking stays visible. Reviews are content:

- a term's in its own file (`review`: status, by, date);
- a lesson's or a whole text's in `packages/content/reviews.json` (key `<book>-<n>` or `text:<book>`, reviewer id and
  date; validated: the key must exist);
- shown everywhere by `components/ReviewBadge.astro` ("Draft · awaiting review" or "Reviewed by … · date") and
  counted on book pages ("Reviewed by a teacher: n of m lessons").

Reviews are given verbally: the teacher goes through lessons with the site owner, who passes on what was reviewed and
when; it is entered by hand. **Only enter a review the teacher has actually given.** The Nahwi has no teacher yet
(`config/about.ts`: `TEACHER` is null, and the About page leaves the teacher's section out): finding one for ṣarf and
naḥw is the first point of `docs/setup-new-site.md`, before any lesson goes behind the paywall.
