import type { APIRoute } from "astro";
import { CHAPTER_PART, getBackground, getTerms, getLibrary } from "@nahwi/content";
import { articleHref, KB_BOOKS, kbBook, kbPath, shortName } from "../../lib/kb";
import { fmt, localePaths, t } from "../../i18n";
import { chapterTitle, localMatn, localTerms } from "../../lib/localize";
import { bookName, lessonTitle, pathLevel, primerLessonPath, primerLessons, primers, tracks } from "../../lib/course";

export const getStaticPaths = localePaths;

/** The search index of one language: every term, and every sentence of the matn. Normalising happens in the browser. */
export const GET: APIRoute = ({ params }) => {
  const locale = params.locale as string;
  const ui = t(locale);
  const where = (chapter: Parameters<typeof chapterTitle>[1]) => {
    const part = ui.parts[CHAPTER_PART[chapter]].title;
    const ch = chapterTitle(locale, chapter).english;
    return part === ch ? ch : fmt(ui.search.where, { part, chapter: ch });
  };
  // English names and aliases stay searchable in every language.
  const english = new Map(getTerms().map((term) => [term.slug, [term.english, ...term.alsoKnownAs]]));
  const terms = localTerms(locale).map((term) => ({
    k: "term",
    u: `/${locale}/terms/${term.slug}/`,
    t: term.english,
    tr: term.transliteration,
    ar: term.arabic,
    w: where(term.chapter),
    n: [term.english, term.transliteration, term.arabic, term.slug.replace(/-/g, " "), ...term.alsoKnownAs, ...(locale === "en" ? [] : english.get(term.slug) ?? [])],
    d: term.definition,
  }));
  const text = localMatn(locale).sections.flatMap((s) =>
    s.segments.map((seg) => ({
      k: "text",
      u: `/${locale}/text/mabadi/#s${seg.id}`,
      t: seg.english || seg.arabic,
      ar: seg.arabic,
      w: fmt(ui.search.textWhere, { chapter: chapterTitle(locale, s.chapter).english, n: seg.id }),
      n: [],
      d: `${seg.english} ${seg.arabic}`,
    })),
  );
  // The knowledge base: books, articles, scholars and the concepts of the glossary.
  const K = ui.kb;
  const bg = getBackground(locale);
  const books = KB_BOOKS.map((b) => ({ k: "kb", u: kbPath.book(locale, b.id), t: b.title, ar: b.arabic, w: `${K.nav.books} · ${b.author}`, n: [b.title, b.fullTitle, b.arabic, b.author, b.id.replace(/-/g, " ")], d: (K.books_meta as Record<string, string>)[b.id] ?? "" }));
  const section = (book: string) => (book === "nahw" ? K.nahw.title : book === "curricula" ? K.curricula.title : kbBook(book)?.title ?? book);
  const articles = bg.articles.map((a) => ({ k: "kb", u: articleHref(locale, a), t: a.title, w: section(a.book), n: [a.title], d: a.summary }));
  const library = getLibrary(locale).map((b) => ({ k: "kb", u: kbPath.book(locale, b.id), t: b.title, ar: b.arabic, w: `${K.library.title} · ${b.author}`, n: [b.title, b.fullTitle ?? "", b.arabic, b.author, b.id.replace(/-/g, " ")], d: b.summary.split(/\n\n/)[0] }));
  const G = K.glossary;
  const concepts = bg.concepts.map((c) => ({ k: "kb", u: kbPath.glossary(locale, c.slug), t: c.name, tr: c.transliteration, ar: c.arabic, w: `${G.title} · ${(G.categories as Record<string, string>)[c.category]}`, n: [c.name, c.transliteration, c.arabic, ...c.alsoKnownAs, c.slug.replace(/-/g, " ")], d: c.definition }));
  const people = bg.people.map((p) => ({ k: "kb", u: kbPath.scholar(locale, p.slug), t: shortName(p), ar: p.arabic, w: `${K.nav.scholars}${p.died ? ` · ${p.died.split(/ \(/)[0]}` : ""}`, n: [p.name, p.known ?? "", p.arabic ?? "", p.slug.replace(/-/g, " ")], d: p.summary }));
  // The lessons of the courses (the primers and the books read lesson by lesson), with the opening of each.
  const topics = ui.track.topics as Record<string, string>;
  const cut = (x: string) => (x.length > 300 ? `${x.slice(0, 300)}…` : x);
  const primerHits = primers().flatMap((p) =>
    primerLessons(p).map((l) => ({ k: "kb", u: primerLessonPath(locale, p.id, l.n), t: l.title, ar: l.arabic, w: `${pathLevel(ui, p.id)} · ${p.title} · ${l.n}`, n: [l.title, l.arabic, l.transliteration, p.title], d: cut(l.body.join(" ")) })),
  );
  const trackHits = tracks().flatMap((x) => {
    const name = bookName(x.book, locale).title;
    const tr = x.book.translations[locale] ?? x.book.translations.en ?? {};
    return x.lessons.map((l) => ({ k: "kb", u: `/${locale}/study/${x.book.id}/${l.n}/`, t: lessonTitle(l, locale, topics), w: `${pathLevel(ui, x.book.id)} · ${name} · ${l.index}`, n: [lessonTitle(l, locale, topics), name], d: cut(l.blocks.map((b) => tr[b] ?? "").join(" ")) }));
  });
  return new Response(JSON.stringify([...terms, ...concepts, ...books, ...library, ...people, ...articles, ...primerHits, ...trackHits, ...text]), { headers: { "Content-Type": "application/json; charset=utf-8" } });
};
