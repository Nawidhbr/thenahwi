import { primers, primerLessons, studyPath, tracks } from "../lib/course";

/**
 * Lessons anyone may open as a preview (`?preview` on the lesson's address), to see what a book is like before it
 * opens. In a preview the text can be read, but the test and the way on stay closed. Every book of the study portal
 * offers three, spread through the book (near its beginning, middle and end), so a new book needs nothing here.
 * The study page's "Preview a lesson" picks one at random; a locked book's page offers its own.
 */
export interface Preview {
  slug: string;
  book: string;
  /** The level in the book's old URL scheme (`v`), for the level pages. */
  level: number;
  /** The lesson's number in its book (1, 2, …), for the note. */
  index: number;
  href: (locale: string) => string;
}

/** Three lessons spread through a list: at about a fifth, the half and four fifths. */
const spread = <T,>(xs: T[]): T[] => (xs.length <= 3 ? xs : [...new Set([0.2, 0.5, 0.8].map((f) => Math.min(xs.length - 1, Math.round(f * (xs.length - 1)))))].map((i) => xs[i]));

export function previews(): Preview[] {
  const books = [
    ...primers().map((p) => ({ book: p.id, level: 1, lessons: primerLessons(p).map((l, i) => ({ slug: `${p.id}-${l.n}`, n: l.n, index: i + 1 })) })),
    ...tracks().map((x) => ({ book: x.book.id, level: x.level, lessons: x.lessons.filter((l) => l.quiz).map((l) => ({ slug: l.id, n: l.n, index: l.index })) })),
  ];
  const lessons = books.flatMap((b) => spread(b.lessons).map((l) => ({ slug: l.slug, book: b.book, level: b.level, index: l.index, href: (locale: string) => `/${locale}/study/${b.book}/${l.n}/?preview` })));
  // Al-Mabādiʾ's terms (the first reading of the Ottoman path) are a book too: three terms with a test, spread.
  const terms = studyPath().filter((p) => p.q).map((p, i) => ({ slug: p.s, index: i + 1 }));
  const termPreviews = spread(terms).map((t) => ({ slug: t.slug, book: "mabadi", level: 1, index: t.index, href: (locale: string) => `/${locale}/terms/${t.slug}/?preview` }));
  return [...termPreviews, ...lessons];
}
export const previewsOf = (level: number) => previews().filter((p) => p.level === level && p.level > 1);
export const previewsOfBook = (book: string) => previews().filter((p) => p.book === book);
