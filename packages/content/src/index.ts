import type { Curriculum, Reviews, ReviewState, Primer, PrimerTranslation, LessonDiagram, FigureTree, LibraryBook, NewsItem, Background, BackgroundArticle, BackgroundConcept, BackgroundPerson, CatalogueEntry, Commentary, ExerciseSet, Glossary, LocaleBundle, Matn, Quiz, Term } from "./schema.ts";
import terms from "../generated/terms.json" with { type: "json" };
import matn from "../generated/matn.json" with { type: "json" };
import exercises from "../generated/exercises.json" with { type: "json" };
import i18n from "../generated/i18n.json" with { type: "json" };
import glossaries from "../generated/glossary.json" with { type: "json" };
import quizData from "../generated/quizzes.json" with { type: "json" };
import commentaryData from "../generated/commentaries.json" with { type: "json" };
import backgroundData from "../generated/background.json" with { type: "json" };
import catalogueData from "../generated/catalogue.json" with { type: "json" };
import primerData from "../generated/primers.json" with { type: "json" };
import primerI18n from "../generated/primer-i18n.json" with { type: "json" };
import newsData from "../generated/news.json" with { type: "json" };
import libraryData from "../generated/library.json" with { type: "json" };
import libraryI18n from "../generated/library-i18n.json" with { type: "json" };
import curriculumData from "../generated/curriculum.json" with { type: "json" };
import reviewData from "../generated/reviews.json" with { type: "json" };

export * from "./schema.ts";

/**
 * All terms, validated. The bundle is written by `npm run validate -w @nahwi/content`,
 * which fails on any content error, so the site never builds on broken content.
 */
export function getTerms(): Term[] {
  return terms as Term[];
}

/** The matn of the Īsāghūjī, validated against the terms. */
export function getMatn(): Matn {
  return matn as Matn;
}

/** The hand-written exercise sets, one per chapter. */
export function getExerciseSets(): ExerciseSet[] {
  return exercises as ExerciseSet[];
}

/** Languages besides English whose translation is complete. */
export function getReadyLocales(): string[] {
  return (i18n as { ready: string[] }).ready;
}

/** Everything translated into one language, or null for English or an unfinished language. */
export function getLocaleBundle(code: string): LocaleBundle | null {
  return ((i18n as { bundles: Record<string, LocaleBundle> }).bundles[code] ?? null);
}

/** The word explanations of one language (empty when it has none). */
export function getGlossary(code: string): Glossary {
  return (glossaries as Record<string, Glossary>)[code] ?? { entries: [] };
}

/**
 * The questions of a test in a language: in English all of them; elsewhere only the translated ones, so a test never
 * mixes languages (new questions are written in English first and join a language once translated). A test with
 * nothing translated yet stays in English.
 */
export function ownItems<T>(items: T[], translated: (item: T, i: number) => T | null, code: string): T[] {
  if (code === "en") return items;
  const own = items.flatMap((x, i) => {
    const t = translated(x, i);
    return t ? [t] : [];
  });
  return own.length ? own : items;
}

/** The test of one term in a language (see ownItems), or null if it has none yet. */
export function getQuiz(slug: string, code = "en"): Quiz | null {
  const data = quizData as { quizzes: Quiz[]; translations: Record<string, Record<string, { prompt: string; options: string[]; explanation: string }>> };
  const q = data.quizzes.find((x) => x.term === slug);
  if (!q) return null;
  const tr = code === "en" ? {} : data.translations[code] ?? {};
  return { ...q, items: ownItems(q.items, (i) => (tr[i.id] ? { ...i, ...tr[i.id] } : null), code) };
}

/** The books read lesson by lesson on the levels after the first reading (2, 3, …), in order. */
export function getTracks(): Commentary[] {
  return getCommentaries().filter((c) => c.track).sort((a, b) => (a.track ?? "").localeCompare(b.track ?? "", "en", { numeric: true }));
}

/** A lesson's test in one language (see ownItems). */
export function getLessonQuiz(book: Commentary, lessonId: string, code = "en") {
  const q = book.lessons.find((l) => l.id === lessonId)?.quiz;
  if (!q) return null;
  const tr = book.quizTranslations[code] ?? {};
  return { ...q, items: ownItems(q.items, (i) => (tr[i.id] ? { ...i, ...tr[i.id] } : null), code) };
}

/**
 * A lesson's explanation in one language: the translated paragraphs, examples and terms where they exist, else the
 * English (`lang` says which, so the page can mark the English and the word pop-ups follow it).
 */
export function getLessonExplain(book: Commentary, lessonId: string, code = "en") {
  const l = book.lessons.find((x) => x.id === lessonId);
  const e = l?.explain;
  if (!e) return null;
  const t = code === "en" ? undefined : l.explainTranslations?.[code];
  return {
    lang: t?.body ? code : "en",
    body: t?.body ?? e.body,
    examples: e.examples.map((x, i) => ({ ...x, en: t?.examples?.[i] ?? x.en })),
    diagram: e.diagram,
    terms: e.terms.map((x, i) => ({ ...x, en: t?.terms?.[i] ?? x.en })),
  };
}

/** The commentaries (sharḥ) on the Īsāghūjī, with their translations. */
export function getCommentaries(): Commentary[] {
  return commentaryData as unknown as Commentary[];
}

/** The background section in a language: people and articles, translated where available. */
export function getBackground(code = "en"): { people: BackgroundPerson[]; articles: BackgroundArticle[]; concepts: BackgroundConcept[] } {
  const data = backgroundData as unknown as Background;
  const t = code === "en" ? undefined : data.translations[code];
  return {
    people: data.people.map((p) => ({ ...p, ...(t?.people[p.slug] ?? {}), slug: p.slug, roles: p.roles, sources: p.sources, works: p.works.map((w, i) => ({ ...w, ...((t?.people[p.slug]?.works as typeof p.works | undefined)?.[i] ?? {}), kind: w.kind, on: w.on })) })),
    articles: data.articles.map((a) => ({ ...a, ...(t?.articles[a.slug] ?? {}), slug: a.slug, order: a.order, people: a.people, sources: a.sources })),
    concepts: (data.concepts ?? []).map((c) => ({ ...c, ...(t?.concepts?.[c.slug] ?? {}), slug: c.slug, arabic: c.arabic, category: c.category, related: c.related, term: c.term, books: c.books, examples: c.examples.map((x, i) => ({ ...x, text: (t?.concepts?.[c.slug]?.examples as typeof c.examples | undefined)?.[i]?.text ?? x.text })) })),
  };
}

/** Whether a scholar page or an article of the knowledge base has been translated into this language (English always has). */
export function hasBackgroundTranslation(code: string, kind: "people" | "articles" | "concepts", slug: string): boolean {
  if (code === "en") return true;
  const t = (backgroundData as unknown as Background).translations[code];
  return !!t?.[kind]?.[slug];
}

/** Every known work on the Īsāghūjī: commentaries, glosses, versifications, translations, editions. */
export function getCatalogue(book = "mabadi"): CatalogueEntry[] {
  return (catalogueData as unknown as Record<string, CatalogueEntry[]>)[book] ?? [];
}

/** The news of the knowledge base, newest first. */
export function getNews(): NewsItem[] {
  return newsData as NewsItem[];
}

/** The primer courses (al-Jurjānī's Ṣughrā and Kubrā, …), by madrasa and reading order. */
export function getPrimers(): Primer[] {
  return primerData as unknown as Primer[];
}

/**
 * A primer course in a language: our own texts (title, summary, part titles, lesson titles, explanations, the meanings
 * of terms and examples, the translations of the quoted passages, the tests) from i18n/<code>/primers/<id>.json laid
 * over the English; whatever is not translated stays in English. The originals, the Arabic and the answers stay as they are.
 */
export function primerIn(p: Primer, code = "en"): Primer {
  const t = (primerI18n as unknown as Record<string, Record<string, PrimerTranslation>>)[code]?.[p.id];
  if (!t) return p;
  return {
    ...p,
    title: t.title ?? p.title,
    summary: t.summary ?? p.summary,
    parts: p.parts.map((part) => ({
      ...part,
      title: t.parts[part.id] ?? part.title,
      lessons: part.lessons.map((l) => {
        const tl = t.lessons[String(l.n)];
        if (!tl) return l;
        return {
          ...l,
          title: tl.title ?? l.title,
          body: tl.body ?? l.body,
          terms: l.terms.map((x, i) => ({ ...x, en: tl.terms?.[i] ?? x.en })),
          examples: l.examples.map((x, i) => ({ ...x, en: tl.examples?.[i] ?? x.en })),
          text: l.text.map((x, i) => (tl.text?.[i] ? { ...x, en: tl.text[i], lang: code } : x)),
          tasks: l.tasks.map((x, i) => (tl.tasks?.[i] ? { ...x, ...tl.tasks[i] } : x)),
          diagram: l.diagram && tl.diagram ? figureIn(l.diagram, tl.diagram) : l.diagram,
          quiz: ownItems(l.quiz, (q, i) => (tl.quiz?.[i] ? { ...q, ...tl.quiz[i] } : null), code),
        };
      }),
    })),
  };
}

/** The languages a primer's passages are translated into (i18n/<code>/primers/<id>.json `text`), offered beside the page's own. */
export const TEXT_LANGUAGES = ["en", "id", "tr", "ur", "fa", "ar"] as const;

/**
 * The translations of one lesson's passages in the other languages of the texts: per language code, the translation of
 * each passage in order (a language whose file has no `text` for the lesson is left out).
 */
export function primerTextVariants(id: string, n: number): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const code of TEXT_LANGUAGES) {
    const t = (primerI18n as unknown as Record<string, Record<string, PrimerTranslation>>)[code]?.[id];
    const text = t?.lessons[String(n)]?.text;
    if (text?.length) out[code] = text;
  }
  return out;
}

/** A lesson's own diagram in a language: its caption, and its English labels replaced where the translation gives them. */
function figureIn(d: LessonDiagram, t: { caption?: string; labels: Record<string, string> }): LessonDiagram {
  const L = (s: string) => t.labels[s] ?? s;
  const tree = (n: FigureTree): FigureTree => ({ ...n, label: L(n.label), children: n.children?.map(tree) });
  return {
    ...d,
    caption: t.caption ?? (d.caption ? L(d.caption) : d.caption),
    focus: d.focus ? L(d.focus) : d.focus,
    tree: d.tree ? tree(d.tree) : d.tree,
    grid: d.grid ? { ...d.grid, caption: d.grid.caption ? t.caption ?? L(d.grid.caption) : d.grid.caption, head: d.grid.head.map(L), rows: d.grid.rows.map((r) => r.map(L)) } : d.grid,
  };
}

/** Languages that write the scholars' names as the English does (al-Fārābī, Ibn Sīnā): the library keeps its byline. */
const SOURCE_SPELLING = new Set(["nl", "fr", "id"]);

/**
 * The library: the works on logic beside the six handbooks, by century, in a language: the summary (and the title,
 * where the English has words of its own) from i18n/<code>/background/library.json, the author, in the languages
 * with names of their own (Turkish forms, Cyrillic, Arabic script), by the name their scholar page has in that
 * language. Untranslated books stay in English.
 */
export function getLibrary(code = "en"): LibraryBook[] {
  const books = libraryData as unknown as LibraryBook[];
  if (code === "en") return books;
  const t = (libraryI18n as unknown as Record<string, Record<string, { title?: string; fullTitle?: string; summary: string }>>)[code] ?? {};
  const people = (backgroundData as unknown as Background).translations[code]?.people ?? {};
  return books.map((b) => {
    const tb = t[b.id];
    if (!tb) return b;
    const known = b.authorSlug && !SOURCE_SPELLING.has(code) ? (people[b.authorSlug] as { known?: string; name?: string } | undefined) : undefined;
    const author = known ? (known.known ?? known.name ?? b.author).split(/\s*[;؛(,،]/)[0].trim() : b.author;
    return { ...b, title: tb.title ?? b.title, fullTitle: tb.fullTitle ?? b.fullTitle, summary: tb.summary, author };
  });
}

/** Whether a book of the library has been translated into this language (English always has). */
export function hasLibraryTranslation(code: string, id: string): boolean {
  if (code === "en") return true;
  return !!(libraryI18n as unknown as Record<string, Record<string, unknown>>)[code]?.[id];
}

/** The madrasa paths of the study portal: which books are read on which level (curriculum.json). */
export function getCurriculum(): Curriculum {
  return curriculumData as unknown as Curriculum;
}

/**
 * The review of a lesson (its score key, e.g. kati-5) or a text (text:<book>): reviewed by whom and when, or a draft.
 * Terms carry their own review (Term.review).
 */
export function getReview(key: string): ReviewState {
  const all = reviewData as unknown as Reviews;
  const r = all.reviewed.find((x) => x.key === key);
  return r ? { status: "reviewed", by: all.reviewers.find((p) => p.id === r.by)?.name ?? r.by, date: r.date } : { status: "draft" };
}
