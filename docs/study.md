# The study portal

How a learner moves through the course. The content behind it is in `docs/content.md`; access and prices in
`docs/accounts-payments.md`.

## Addresses

- The portal is `/<locale>/study/`: first the choice of madrasa path, then that path's levels as cards (progress and
  lock from the head script's `__study`). A locked level's card shows only its name and when it opens, and opens a
  small window (what it is, when it opens, a preview) instead of its page. Once a path is chosen the page is calm:
  the path's name is the title, the three madrasa cards fold away behind "Change path", the "Preview a lesson" button
  goes once the reader has started; the level the reader is on is one wide dark panel, the levels to come short
  glass cards below it. A level that holds several books (the Indian path's level 1: al-Jurjānī's Ṣughrā, then his
  Kubrā) is one card per book, numbered 1a and 1b (`levelNumber` in `lib/course.ts`; the letter per language in
  `madrasa.subLetters`), and a locked card names the card before it ("Opens after level 1a"). Every page that names a
  book's level says 1a or 1b too (`pathLevel`), so a book's own page shows only its own level, not the other book. The Today card is not here but on the progress page, so the study page and the lessons stay
  free of goals and counts.
- Every book has one address whatever the path, `/<locale>/study/<book>/` (`bookPath`; `mabadi` for the
  terms of al-Mabādiʾ), and every lesson `/<locale>/study/<book>/<n>/` (score key `<book>-<n>`). The routes
  `pages/[locale]/study/[book]/index.astro` and `[lesson].astro` dispatch to `components/study/` (TermsBook,
  PrimerBook, PrimerLesson, TrackLevel, TrackLesson). The terms keep `/<locale>/terms/<slug>/`.
- The old `/level-…` and `/book/…` addresses redirect in `vercel.json`.
- The study portal has no A–Z list of its own: `/<locale>/terms/` redirects to the glossary of the knowledge base
  (`/<locale>/glossary/`, `docs/knowledge-base.md`). A term lesson `/terms/<slug>/` is `noindex` and out of the
  sitemap, and links to its free glossary entry, which is the page search engines show for the word; the word pop-ups
  link to the glossary too. The texts are at `/<locale>/text/` (see "Texts"
  below).
- The header shows a second "study" row in the portal, and the phone tab bar switches to the study tabs.

## The rules (`apps/web/src/lib/progress.js`)

The rules — what is open, passed, next, which books have opened, what blocks a book, who may read what — live only
in `progress.js`, plain JS sent inside `study-data.js` to the head script and tested by `apps/web/test/progress.test.js`
(part of `npm test`). Change a rule only there and only with a test.

- Lessons open one at a time, in book order. Each has a test; the next lesson opens with at least two stars.
- **Staff** (moderators and the teacher: accounts in `public.moderators`) skip the path: `progress(…, { all: true })`
  opens every term, book and lesson at once, while what is passed still follows their own scores. The head script
  does this, and treats them as full access, when the browser is signed in and holds `nahwi-moderator` = "1" (set by
  `lib/account-sync.ts` from `is_moderator()`, which also shows the moderation link in the account menu). It is a
  convenience in the browser, like every lock of the path.
- Stars from a score out of 10: 1 star from 3, 2 from 6, 3 from 8.5.
- A book opens when everything in its `a` is passed (for the first book after the terms: every term). Each next level
  opens once every lesson of the level before it is passed. Lock texts name the book to pass first (`track.lockBook`).
- "Up next" skips level-2 terms, if any are ever added.
- Scores stay in the browser (`scores` in localStorage). The head script in `BaseLayout` sets `data-locked` and
  `data-passed` on `<html>` before paint. Locked terms, related-term links and pop-up links show a lock and name the
  lesson to pass first. An account copies the scores to the server, but locks still come from the browser.
- The madrasa choice is `madrasa` in localStorage (`data-madrasa` on `<html>`); a learner with term scores and no
  choice keeps the Ottoman path. Only the chosen path's levels show.
- **A test** (`components/TermQuiz.astro`, `scripts/term-quiz.js`) starts with its own card: what the test asks, the
  hearts (red; spent ones as outlines; an info tile explains them) and "Start the test −1 ♥", which takes the heart and
  opens the questions. Every question of the lesson is in the page; one
  test asks `askOf` of them (a lesson's own `ask`, else all of a pool under seven and two kept in reserve from seven
  on), picked and ordered at random with their answers shuffled (`pickQuestions`, `shuffled`); a retry brings in the
  questions left out last time (`nahwi-asked`). After passing, "Continue" stands right under the score.
- **Re-reading**: a failed test marks the lesson (`nahwi-reread`); its test opens again only after the reader ticks
  "I have read the whole lesson again" above it. Not for the exam.
- **Hearts** (since 18 November 2026, for everyone, subscribers too): five; a lesson test or an exam takes one (on the
  start), one comes back every two hours (`heartsNow`, `spendHeart`); tikrār takes none. Kept as
  `nahwi-hearts` `{ n, at, r, f, s }` (f free refills, s the run of three-star lessons); with an account also on the profile (`profiles.hearts`, migration
  `20261118120000_hearts.sql`), merged by `mergeHearts` (the later refill, else the fewer hearts). With no heart left
  the test waits and says when the next comes. A refill of all five is free (`useFreeRefill`: every reader starts with one, `FREE_REFILLS`, and earns another for a first three stars on five lessons in a row, `countTest`, `RUN_FOR_REFILL`; shown beside the hearts) or costs €0.99 through Paddle
  (`docs/accounts-payments.md`), not in the Android app.

## Previews

Every book offers three preview lessons spread through it (about a fifth, the half and four fifths, computed in
`src/config/previews.ts`, so a new book needs nothing). They open with `?preview` even while the book is locked
(`data-preview` on `<html>`): the text can be read, the test and the way on are hidden, a note says what it is. The
study page has a "Preview a lesson" button (one at random). A locked book's page hides its list of lessons
(`data-level-locked`). Links with `?preview` get no lock mark.

## Practice (tikrār)

`/<locale>/practice/` groups the passed lessons by madrasa path (the reader's own first, the others under "Other
paths"); each book is a fold (`.tikrar-book`, "n of m passed", open when it has passed lessons) with its chapters or
parts. Only passed lessons are listed; the rest are counted on one line per chapter. With nothing passed the page
shows only a note and the way to the study portal. The learner picks passed lessons (by chapter, book or all),
shuffles questions and answers, and takes a review test. The pool is `/<locale>/practice/questions.json`: the term
tests, the lesson tests of passed lessons, the chapter exercises and the engine's generated questions.

**On a schedule** (spaced repetition; the rules `reviewFirst`, `reviewAfter`, `reviewQueue`, `nextReview` in
`progress.js`, tested): every passed lesson has an entry `{ due, n }` in localStorage `nahwi-review` (not synced to
an account; the privacy page says so). A lesson passed for the first time (`term-quiz.js`) is due the next day; each
review with two stars moves it on (`REVIEW_DAYS`: 1, 3, 7, 14, 30, 60, then every 120 days), a review with fewer
brings it back the next day. The card "Due for review" at the top of the practice page lists at most five lessons a
day, the longest overdue first, then lessons passed before the schedule existed, the reader's own path first; "Review
now" starts a test of just those. Every review test, however its lessons were chosen, moves each lesson by its own
score.

## Inside a lesson

- **Word pop-ups**: `packages/content/glossary/<code>.json` lists technical words (forms as they occur) with a plain
  word or synonym and a note; `lib/gloss.ts` marks them in definitions, explanations, the matn translation, primer
  lessons and test feedback, and in the scholar pages and articles of the knowledge base, in the language the text is
  in. The text keeps the technical words (for nl and ru: the "in de tekst"/"в тексте" column of `GLOSSARY.md`); the
  plain words live in the pop-ups. A glossary's `ignore` list holds everyday phrases and names that contain a pop-up
  form but do not mean it (Russian «в виду», Turkish «aksi hâlde», «lâzım gelir», Urdu «طالب علم»): they are matched
  first and left unmarked. An entry with `kb: false` is not marked on the knowledge-base pages (`gloss(…, "kb")`),
  where its form mostly has another sense: "rhetoric" (en, nl, fr, ru) there usually means balāgha, not khaṭāba, and
  in Urdu and Persian «مشہور»/«مشهور» means famous and «مسلم» Muslim (the widely-accepted and conceded premises).
  Both are tested in `test/gloss.test.ts`.
- **The layout of a lesson** (primers `components/study/PrimerLesson.astro`, commentaries `TrackLesson.astro`): first
  the text itself (Arabic, Persian, …) with a "Copy text" button; the translation (the reader's language, else
  English) sits under it behind a fold that starts closed, with "Copy translation". Then the explanation, a card that
  folds and starts open, with each example right under the paragraph it belongs to (`after`) and the lesson's
  diagram, then the key terms. In the commentaries and the later texts the explanation comes from
  `commentaries/<id>/explain/<n>.json` (`docs/content.md`), shown after the book's text. No links to machine translation. Every translation (lessons and the library's texts) is
  `components/Translation.astro`: folded. That it was made with the help of AI and that the original is what counts
  is said once, in the "Translation" row of the source note (`lib/sources.ts`), not under every passage.
- **Diagrams**: every term, primer lesson and commentary lesson's explanation sets `diagram: { type, focus?, after? }`;
  the SVGs live in `components/Diagram.astro`, drawn with the colour tokens in the "Clear glass" look (a tinted pane,
  frosted shapes, the focus orange with an orange glow; `global.css`, "Diagrams"). They are division trees drawn from one
  data table (`trees`: `sciences` ṣarf and naḥw, `kalima` the three kinds of word, `mizan` the root and the pattern
  فَعَلَ, `fil` the past, present and imperative, `sahih` sound and weak, `mushtaqq` the derived nouns, `irab` the four
  states and bināʾ, `jumla` the nominal and verbal sentence); the conjugation tables are not diagrams but come from
  the engine (`/tools/tasrif/`). Every type and focus used has its own caption in `diagram.cap` of the UI dictionaries, and every
  explanation has a diagram: both are tested in `test/diagrams.test.ts`. In Arabic the extra Arabic names in a
  figure are left out, since the labels are the Arabic terms. Keep labels at least 13px in a 360-wide viewBox so they
  stay legible on phones; examples and key terms are glass tiles (`.primer-example`, `.primer-terms`, `.examples`).
- Arabic is always vocalised and shown with its transliteration. In Arabic the term name is the Arabic term itself,
  so it is shown once.
- The last term of each part leads to `/en/complete/<part>/` (noindex, not in the sitemap): progress for the first
  reading and the choice to continue, practise or go home.
- **Questions and remarks** (`components/LessonComments.astro`, `scripts/lesson-comments.ts`): every lesson and term
  ends with a conversation, one per lesson across all languages (keyed by the address without the locale:
  `terms/jins`, `level-2/kati/3`). Anyone reads the published messages (the view `comments_public`, fetched with a
  plain request only when the section comes near the screen; a message in another language is marked "In Urdu");
  only a signed-in reader writes, with a name (from the account, kept in localStorage `nahwi-comment-name`) or
  without one ("a learner"). A new message waits until a moderator publishes it; the writer sees it marked as
  waiting and can delete it (two clicks, no confirm window). At most 5 an hour and 20 a day per account. Everything
  is text, never HTML. The database: `supabase/migrations/20261121120000_comments.sql`; tested in
  `supabase/tests/30-comments.sql` and `e2e/comments.spec.ts`.
- **Moderation** (`/en/moderate/`, English only, noindex, linked from nowhere; `scripts/moderate.ts`): a moderator
  (a row in `public.moderators`, added in the SQL Editor with the query at the top of the migration) sees what waits,
  publishes, hides or puts back, and writes an answer, shown under the message. Row-level security and
  `moderate_comment()` refuse everyone else, so the page itself guards nothing.
- Under it, `components/LessonHelp.astro` ("Rather write privately?"): "Ask a question" and "Report a mistake", links
  to the contact form with `#topic=question|correction&page=<the page's URL>` (a fragment, so search engines see one
  contact page, not one per lesson).

## Certificates

Every book has `/<locale>/study/<book>/certificate/` (noindex, not in the sitemap; `scripts/certificate.js`). Once
every lesson of the book is passed (`bookDone`, or `baseDone` for al-Mabādiʾ) it shows the exam: 25 questions drawn
from all the book's lessons, answers shuffled, 20 right to pass (`EXAM_SIZE`, `EXAM_PASS`; the score is kept as
`exam-<book>` with the others, so it reaches the account). With the exam passed (`examPassed`) it shows the book, the path and level,
the average score with its stars and today's date, with a field for the reader's name (not stored) and "Print or save
as PDF" (print styles show only the certificate). Before that it shows how many lessons are passed. It says that it is
a record of the reader's own study, not an ijāza, and how many lessons a teacher has reviewed. Book pages link to it,
and so do the last lesson's card and al-Mabādiʾ's last "complete" page.

## Daily goal

`components/StudyToday.astro` at the top of the progress page (`scripts/study-today.js`; the account menu's "Your
progress" leads there), shown once a lesson is passed, as a slim glass bar: the tests
taken today (a lesson's test or a review) against the reader's goal (1, 2, 3 or 5; `nahwi-goal`), the days in a row
and the lessons due for review, with a link to tikrār. Every finished test adds one to the day in `nahwi-days`
(`logDay`, `streak` in `progress.js`, tested; days older than 120 are dropped). Nothing leaves the browser.

## Progress

`/<locale>/study/progress/` (`pages/[locale]/study/progress.astro`, `scripts/study-progress.js`; noindex, not in the
sitemap, saved for offline use) shows the reader's madrasa path book by book: the steps passed with a bar, the
average stars, the way on (the current book's tile and bar in orange), the certificate once a book is done, and for a
book not yet open what must be passed first. Above it: lessons passed on the path, the average score, the days with
a test in the last 30 (a strip of 30 tiles) and the lessons due for review; below it, up to five passed lessons with
fewer than three stars, the lowest first, each linking to its test (the best score is kept). The rules (`average`,
`weakest`, `activity`) are in `progress.js`, tested; the page reads only what the browser already keeps and stores
nothing. The "Today" card stands at the top of it. The book list behind it and tikrār comes from `lib/study-books.ts`.

## Daily reminder

`components/Reminder.astro` (on the practice page; `scripts/reminder.js`) builds an `.ics` file in the browser: one
event repeating daily at the time the reader picks, with an alert and a link to the study portal. Nothing is sent or
stored.

In the iPhone app the same card (its `data-ios-only` half) sets notifications instead: one at the chosen time on each
of the next fourteen days, each with that day's number of lessons due for review (`reviewQueue`), planned again on
every study page the app opens, so the numbers follow the reviews done (`reminderPlan` in `lib/app-rules.js`; the time
in localStorage `nahwi-app-reminder`). After a test the app also plans "your hearts are full again" for the moment
they are (`heartsFullAt` in `lib/progress.js`), if notifications are allowed; it never asks for them by itself.

## Texts

`/<locale>/text/` is a library. Al-Mabādiʾ is at `/text/mabadi/`: our own text, with no print behind it, so its page
lists the terms in book order (ṣarf first) rather than segments of a matn. A book with a matn (none yet) is grouped
by part and chapter in `<details>` that start folded (a `#s<n>` link opens them), with the edition behind an info
tile. The primers with a transcribed original are texts too, at `/text/<id>/` (`components/PrimerText.astro`;
`text/[book].astro` dispatches to it or to `CommentaryText.astro`): the whole original by part and lesson in folds,
under each passage "Copy text" (`scripts/copy-text.js`) and our translation as a fold-out with "Copy translation". Lists that
fold carry one "open all / close all" button (`components/FoldAll.astro`).

## Reader settings

One gear menu in the header, all stored in localStorage:

- transliteration (`data-translit`) and the Arabic typeface (`data-font`: modern = Baloo Bhaijaan 2, `naskh` = Noto
  Naskh Arabic, `classic` = Amiri; the Latin letters do not change; the Arabic faces scaled in
  `styles/fonts-alt.css`): shown and applied in the study portal only (`data-area="study"` on `<html>`); the
  knowledge base keeps its own faces;
- vowel marks (`data-tashkil="off"` strips tashkīl from every `[lang="ar"]`/`.ar` text node and restores it);
- the calendar (`cal`, `data-cal="greg"`; Hijri first by default): `scripts/calendar.js` rewrites every "663/1265" and
  "8th/14th century" in the text, only pairs whose years fit each other, as "663 AH (1265)" or "1265 (663 AH)", so
  content keeps writing dates as Hijri/Gregorian. News and update dates are rendered by `newsDateHTML` in each
  language's own convention (solar Hijri in Persian, lunar Hijri with the Gregorian beside it in Arabic, Gregorian
  elsewhere, the others in the tooltip), whatever this setting;
- dark theme, install as app, and the language list (`docs/i18n.md`).
