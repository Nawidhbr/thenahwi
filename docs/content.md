# Content

What is taught, where each piece of content lives, and the rules for the texts. Everything is JSON in
`packages/content`, validated by `src/schema.ts` and bundled into `generated/` by `npm run validate -w
@nahwi/content`. The study rules that use this content are in `docs/study.md`; translations in `docs/i18n.md`.

## The paths and their books

The study portal offers three madrasa paths (`curriculum.json`, validated: every book named must exist and every
course must stand on a path; `apps/web/src/config/madrasas.ts` only reads it). The reader chooses one at the start.
Every path opens with al-Mabādiʾ; the later levels are still books in preparation (`soon`, their names in
`madrasa.soon` of the UI dictionary), shown as one quiet line each.

| Path | Level 1 | 2 | 3 | 4 | 5 | 6 |
| --- | --- | --- | --- | --- | --- | --- |
| Indian (Farangī Maḥall, Deoband, Barelī, Khayrābād) | `mabadi` | Mīzān al-ṣarf (`mizan`) | Naḥw-i Mīr (`nahw-mir`) | Hidāyat al-naḥw (`hidaya`) | al-Fawāʾid al-Ḍiyāʾiyya (`jami`) | al-Shāfiya (`shafiya`) |
| Ottoman | `mabadi` | al-Amthila (`amthila`) | al-ʿIzzī (`izzi`) | Marāḥ al-arwāḥ (`marah`) | al-ʿAwāmil (`awamil`) | Molla Câmî (`molla-cami`) |
| North-African | `mabadi` | al-Ājurrūmiyya (`ajurrumiyya`) | al-ʿIzzī and the Lāmiyya (`izzi-lamiyya`) | Qaṭr al-nadā (`qatr`) | the Alfiyya (`alfiyya`) | |

Ṣarf comes before naḥw on every path, as in the madrasa. A book may stand on several paths; its prerequisites per
path are in `ap`. In `lib/course.ts` (`trackSteps()`), `a` lists what must be passed first ("terms" for the first
reading, or book ids from the level before it), `d` is the book's level in its path and `v` the old URL level, now
only an id. Pages name a book's level as its path counts it (`pathLevel`), with a letter for each book of a level that
holds several (1a, 1b); the rules still treat them as one level. Level texts are in `madrasa` of the UI dictionary.

## The books

| Id | Book | Kind | Original text shown |
| --- | --- | --- | --- |
| `mabadi` | al-Mabādiʾ: the first terms of ṣarf and naḥw (27 terms, ṣarf first) | terms | none: our own text (`matn/mabadi.json`, `edition: null`) |

The books of levels 2 and up are still to be made. Each needs a public-domain print (a lithograph or an early printed
edition, with a scan that can be linked) before its text is shown; until one is found, the lessons follow the book's
order and say which edition, without its text. The order in which they are made is the owner's choice; the market
analysis suggests al-Amthila or Mīzān al-ṣarf first (the first ṣarf book on two paths), then al-Ājurrūmiyya.

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
  with {…} in the Arabic and every translation; pages show them in red bold.
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
