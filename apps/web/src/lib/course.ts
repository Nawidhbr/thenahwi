import { getLibrary, getPrimers, getQuiz, getTerms, getTracks, type Chapter, type Commentary, type Lesson, type Primer } from "@nahwi/content";
import { MADRASAS, levelCourses, type MadrasaLevel } from "../config/madrasas";

/**
 * The study path. Terms open one at a time: first every term of the first
 * reading (level 1) in book order, then the terms from the commentaries
 * (level 2). A term opens when the one before it is passed: at least two stars,
 * i.e. 6 out of 10 on its test (or, while a term has no test yet, a visit).
 */
export interface Step {
  /** Term slug. */
  s: string;
  /** 1 if the term has a test. */
  q: 0 | 1;
}

export function studyPath(): Step[] {
  const terms = getTerms();
  const ordered = [...terms.filter((t) => t.level === 1), ...terms.filter((t) => t.level === 2)];
  return ordered.map((t) => ({ s: t.slug, q: getQuiz(t.slug) ? 1 : 0 }));
}

/** Per chapter, the last first-reading term: its practice opens once that term is passed. */
export function practiceGates(): Partial<Record<Chapter, string>> {
  const gates: Partial<Record<Chapter, string>> = {};
  for (const t of getTerms()) if (t.level === 1) gates[t.chapter] = t.slug;
  return gates;
}

/** The step before a term on the path (the one to pass first), if any. */
export function previousStep(slug: string): string | undefined {
  const path = studyPath();
  const i = path.findIndex((p) => p.s === slug);
  return i > 0 ? path[i - 1].s : undefined;
}

/** The step after a term on the path, if any. */
export function nextStep(slug: string): string | undefined {
  const path = studyPath();
  const i = path.findIndex((p) => p.s === slug);
  return i >= 0 ? path[i + 1]?.s : undefined;
}

/** Stars for a score out of 10: 1 from 3, 2 from 6, 3 from 8.5. */
export const starsFor = (score: number) => (score >= 8.5 ? 3 : score >= 6 ? 2 : score >= 3 ? 1 : 0);

/**
 * The levels after the first reading: level 2 is al-Kātī's commentary, read lesson by lesson; later
 * levels add further books (on the Indian path: Mīzān al-ṣarf, Naḥw-i Mīr, al-Kāfiya). Level 2 opens once
 * the whole study path above (first reading and the terms from the commentaries) is passed; each
 * further level opens once every lesson of the level before it is passed. Lessons open one at a time,
 * like the terms. Lesson URLs: /<locale>/study/<book>/<n>/ (one address per book, whatever the path); n is the lesson group
 * (lessons.json for a commentary on al-Mabādiʾ).
 */
export interface TrackStep {
  /** Lesson id, e.g. kati-2 (also the key of its score). */
  s: string;
  /** 1 if the lesson has a test. */
  q: 0 | 1;
  /** Name used in lock messages, e.g. "2 · 3". */
  n: string;
}

export interface TrackInfo {
  book: Commentary;
  /** "2", or "2A" if a level offers a choice. */
  track: string;
  /** The level number (2, 3, …). */
  level: number;
  lessons: (Lesson & { index: number })[];
}

export function tracks(): TrackInfo[] {
  return getTracks().map((book) => ({ book, track: book.track!, level: parseInt(book.track!, 10), lessons: book.lessons.map((l, i) => ({ ...l, index: i + 1 })) }));
}

/** The levels that have books, in order. */
export const levels = () => [...new Set(tracks().map((x) => x.level))].sort((a, b) => a - b);

/** The primer courses that exist, in reading order (packages/content/primers/). */
export const primers = (): Primer[] => getPrimers();
export const primerLessons = (p: Primer) => p.parts.flatMap((part) => part.lessons.map((l) => ({ ...l, part })));
/** A book of the study portal: /<locale>/study/<book>/ (al-Mabādiʾ with its terms is "mabadi"). */
export const bookPath = (locale: string, id: string) => `/${locale}/study/${id}/`;
export const primerPath = bookPath;
/** A primer whose original is given in full (a text page of its own), not only quoted in its lessons (`textEdition.selection`). */
export const primerHasText = (p: Primer) => Boolean(p.textEdition && !p.textEdition.selection && p.parts.some((x) => x.lessons.some((l) => l.text.length > 0)));
export const primerLessonPath = (locale: string, id: string, n: number) => `/${locale}/study/${id}/${n}/`;

/** The primer's lessons with their part, and the madrasa level a book stands on (for the pages). */
export const placeOfBook = (id: string) => placeOf(id);
/** "Indian path · level 2": a book's level as its madrasa path counts it (each path it stands on, its own first). */
export function pathLevel(ui: LevelUi & { madrasa: { pathLevel: string; paths: Record<string, { short: string }> } }, id: string): string {
  return placesOf(id)
    .map((p) => ui.madrasa.pathLevel.replace("{path}", ui.madrasa.paths[p.m]?.short ?? p.m).replace("{n}", levelNumber(ui, p.d, subOf(id, p.m))))
    .join(" · ");
}

type LevelUi = { madrasa: { subLevel: string; subLetters: string } };
/** A level's number as the pages show it: "2", or "1a", "1b" for each book of a level that holds several. */
export function levelNumber(ui: LevelUi, d: number, sub?: number): string {
  if (sub === undefined) return String(d);
  const letters = ui.madrasa.subLetters.split(" ");
  return ui.madrasa.subLevel.replace("{n}", String(d)).replace("{k}", letters[sub] ?? String(sub + 1));
}

/** A book's place inside a level of its path that holds several courses (the ṣarf lane first, then the naḥw lane), from 0; none for a book alone on its level. */
export function subOf(id: string, m: string): number | undefined {
  const lv = MADRASAS.find((x) => x.id === m)?.levels.find((l) => levelCourses(l).some((c) => c.id === id));
  if (!lv) return undefined;
  const items = levelCourses(lv).map((c) => c.id);
  return items.length > 1 ? items.indexOf(id) : undefined;
}

/** Where a book (a primer or a book read lesson by lesson) stands in its madrasa path: the level shown, and what must be passed first; for a book on several paths, the path it belongs to (a primer's `madrasa`) or the first. */
function placeOf(id: string): { d: number; a: string[]; m: string; ap?: Record<string, string[]> } {
  const all = placesOf(id);
  if (!all.length) return { d: 1, a: ["terms"], m: "ottoman" };
  const home = primers().find((p) => p.id === id)?.madrasa;
  const own = all.find((p) => p.m === home) ?? all[0];
  return all.length > 1 ? { ...own, ap: Object.fromEntries(all.map((p) => [p.m, p.a])) } : own;
}

/**
 * What a book needs first on one path (the rule of curriculum.json): the book before it in its lane of the same
 * level; for the first book of a lane, every course of the level before (the first reading as "terms"), going back
 * over levels that are still only in preparation; nothing on the path's first level. Exported for the tests.
 */
export function needsOn(levels: MadrasaLevel[], id: string): { d: number; a: string[] } | null {
  const k = levels.findIndex((lv) => (id === "mabadi" && lv.terms) || levelCourses(lv).some((c) => c.id === id));
  if (k === -1) return null;
  const lv = levels[k];
  if (id !== "mabadi") {
    const courses = levelCourses(lv);
    const subject = courses.find((c) => c.id === id)?.subject;
    const lane = courses.filter((c) => c.subject === subject);
    const at = lane.findIndex((c) => c.id === id);
    if (at > 0) return { d: lv.n, a: [lane[at - 1].id] };
  }
  for (let j = k - 1; j >= 0; j--) {
    const a = [...(levels[j].terms ? ["terms"] : []), ...levelCourses(levels[j]).map((c) => c.id)];
    if (a.length) return { d: lv.n, a };
  }
  return { d: lv.n, a: [] };
}

/** Every place of a book in the madrasa paths (a book may stand on several, at different levels). */
function placesOf(id: string): { d: number; a: string[]; m: string }[] {
  const home = primers().find((p) => p.id === id)?.madrasa;
  const out: { d: number; a: string[]; m: string }[] = [];
  for (const m of MADRASAS) {
    const place = needsOn(m.levels, id);
    if (place) out.push({ ...place, m: m.id });
  }
  return out.sort((x, y) => (x.m === home ? -1 : y.m === home ? 1 : 0));
}

/**
 * The books for the head script: { id, t: track, v: level in the URL, d: level shown in its madrasa path,
 * a: what must be passed first ("terms" for the first reading, or book ids; `ap` per path for a book on several paths),
 * l: steps }. Primers come first; lib/progress.js puts each book after the ones it needs.
 */
export function trackSteps(): { id: string; t: string; v: number; d: number; a: string[]; ap?: Record<string, string[]>; nm: string; l: TrackStep[] }[] {
  return [
    ...primers().map((p) => ({ id: p.id, t: "1", v: 1, nm: p.title, ...placeOf(p.id), l: primerLessons(p).map((l) => ({ s: `${p.id}-${l.n}`, q: 1 as const, n: `${p.title} · ${l.n}` })) })),
    ...tracks().map((x) => ({ id: x.book.id, t: x.track, v: x.level, nm: x.book.title, ...placeOf(x.book.id), l: x.lessons.map((l) => ({ s: l.id, q: (l.quiz ? 1 : 0) as 0 | 1, n: `${x.track} · ${l.index}` })) })),
  ];
}

/**
 * The courses of the study portal on a work of the knowledge base: the work itself as a course (a primer or a book
 * read lesson by lesson whose `library` is it, or al-Mabādiʾ's terms) and, for a handbook, the courses on the works
 * that comment on it (their library entry's `on`). For the handbook and library pages.
 */
export function coursesOn(id: string, withCommentaries = true): { id: string; title: string; lessons: number; commentary: boolean }[] {
  const lib = getLibrary();
  const own = (x: string | undefined) => x === id;
  const onIt = (x: string | undefined) => withCommentaries && !!x && lib.find((b) => b.id === x)?.on === id;
  const out: { id: string; title: string; lessons: number; commentary: boolean }[] = [];
  if (id === "mabadi") out.push({ id: "mabadi", title: "al-Mabādiʾ", lessons: studyPath().length, commentary: false });
  for (const p of primers()) if (own(p.library) || onIt(p.library)) out.push({ id: p.id, title: p.title, lessons: primerLessons(p).length, commentary: !own(p.library) });
  for (const x of tracks()) {
    const l = x.book.library ?? x.book.id;
    if (own(l) || onIt(l)) out.push({ id: x.book.id, title: x.book.title, lessons: x.lessons.length, commentary: !own(l) });
  }
  // The work itself first, then the commentaries in the order of their levels.
  return out.sort((a, b) => Number(a.commentary) - Number(b.commentary) || placeOf(a.id).d - placeOf(b.id).d);
}

/** The books of a madrasa path, level by level, with their titles (for links from the knowledge base). */
export function pathBooks(m: string): { id: string; title: string; level: number }[] {
  const path = MADRASAS.find((x) => x.id === m);
  if (!path) return [];
  const title = (id: string) => (id === "mabadi" ? "al-Mabādiʾ" : primers().find((p) => p.id === id)?.title ?? tracks().find((x) => x.book.id === id)?.book.title ?? id);
  return path.levels.flatMap((l) => [...(l.terms ? ["mabadi"] : []), ...levelCourses(l).map((c) => c.id)].map((id) => ({ id, title: title(id), level: l.n })));
}

/** The page of a level: level 1 is al-Mabādiʾ's terms; a later level is the page of its book. */
export const levelPath = (locale: string, level: number) => bookPath(locale, level === 1 ? "mabadi" : tracks().find((x) => x.level === level)?.book.id ?? "mabadi");
export const lessonPath = (locale: string, lesson: Lesson, book: string, _level?: number) => `/${locale}/study/${book}/${lesson.n}/`;

/** A lesson's title in a language: its own (a standalone text's lesson plan), else the shared topic of its group. */
export const lessonTitle = (lesson: Pick<Lesson, "n" | "title">, locale: string, topics: Record<string, string>) =>
  lesson.title?.[locale] ?? lesson.title?.en ?? topics[String(lesson.n)] ?? "";

/** A book's title and author in the reader's language: in Arabic the Arabic ones, so nothing Latin stands in an Arabic page. */
export const bookName = (book: Pick<Commentary, "title" | "author" | "arabicTitle" | "authorArabic">, locale: string) =>
  locale === "ar" ? { title: book.arabicTitle, author: book.authorArabic } : { title: book.title, author: book.author };
