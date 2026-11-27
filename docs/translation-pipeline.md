# The translation round (from 27 November 2026)

The whole site is being translated into its eight other languages (nl, ar, ur, fa, tr, id, ru, fr), one translator
(agent) per language, working in rounds: when a translator's context runs out, the next one for that language picks up
from its status file. A ninth worker expands the encyclopedia in English at the same time (new scholars, books,
glossary entries and the generations of the grammarians); its new entries are translated in a later round. Read
`CLAUDE.md`, `docs/i18n.md` (where everything lives) and this file first.

## The rules

- Translate from the English (the source), never from a published translation. Faithful and natural, in the madrasa
  usage of the language: the terms of `packages/content/i18n/<code>/GLOSSARY.md` (write it first if it does not exist,
  in the layout of the English `i18n/GLOSSARY.md`; add every new term as you meet it, and keep to it).
- Arabic stays Arabic: every Arabic word, example and conjugated form is copied exactly, vocalised, never retyped.
- Names of people and books as in the English, in the language's own script and spelling where it has one (Urdu,
  Persian and Arabic write them in Arabic script; Russian in Cyrillic, as Russian Islamic studies write them).
- Latin letters only with the marks the language has: no ā, ṣ, ḥ, ʿ and the like in nl, tr, id, fr or ru text
  (Turkish keeps ç ş ğ ı ö ü, French its accents, Dutch ë ï; ʿayn and hamza as an apostrophe). The site removes
  stray marks when serving, but write them right.
- Interface text: every key of `apps/web/src/i18n/en.json`, the same structure and the same `{placeholders}`; keep
  HTML-free strings plain; dates, numbers and plurals as the language writes them.
- Never touch English files, another language's files, or `packages/content/generated/`. Never run `npm run validate`,
  build or check (the main session does); never commit.

## What, in this order

1. **The core**, so the language can go live:
   - `apps/web/src/i18n/<code>.json`: the whole interface;
   - `packages/content/i18n/<code>/terms/<slug>.json` for the 27 terms of al-Mabādiʾ (schema `TermTranslation`: the
     same number of explanation paragraphs and examples as the English), `quizzes/<slug>.json` for their tests (read
     `loadQuizTranslations` in `src/load.ts` for the format), and `matn.json` as `{}` (except in ar).
2. **The books' lessons**, `packages/content/i18n/<code>/primers/<id>.json` (schema `PrimerTranslation`, merged over
   the English by `primerIn` in `src/index.ts`): the book's `title` and `summary`, the `parts` titles, and per lesson
   (`"<n>"`) its `title`, `body` (same number of paragraphs), `terms` (the English meanings, in order), `examples`
   (meanings, in order), `tasks` ({prompt, answer}, in order), `quiz` ({prompt, options, explanation}, in order, same
   number of options; the answer index stays the English one, so keep the options in the same order) and `diagram`
   ({caption, labels: {"<English label>": "<translation>"}} for the lesson's own tree or table: every English tree label,
   table head and non-Arabic cell, and the caption). **Some of these files already exist with each lesson's `text`
   (the passages, made by the books pipeline): keep every `text` exactly as it is and add the other fields beside it.**
   Order: the beginner books first — ajurrumiyya, amthila, bina, maqsud, awamil, awamilmia, mizan, nahwmir — then
   izzi, qatr, lamiyya, izhar, marah, hidaya.
3. **The encyclopedia** (when the English expansion is done; `packages/content/staging/STATUS-encyclopedia.md` says
   so): `i18n/<code>/background/people/<slug>.json`, `articles/<slug>.json`, `concepts/<slug>.json` and
   `library.json` (read `loadBackground` and `loadLibraryTranslations` in `src/load.ts` for the formats).

Check your work with `node --experimental-strip-types packages/content/scripts/check-locale.ts <code>` (from the
repository root; it writes nothing): it lists errors, what is still missing, and how many lessons of each book are
explained in the language. A single primer file: `node --experimental-strip-types packages/content/scripts/check-primer.ts
packages/content/i18n/<code>/primers/<id>.json --translation`. Write large files in parts (one book or one part of the
interface at a time), check each, and keep `packages/content/staging/STATUS-i18n-<code>.md` up to date: what is done,
what is next, the choices you made — the next translator for your language starts from it.
