import { getMatn } from "@nahwi/content";
import { t } from "../i18n";
import { bookStructure } from "./structure";
import { localTerms, chapterTitle, diedIn } from "./localize";
import { tracks, lessonTitle, bookName, primers, pathLevel, placeOfBook, primerPath, levelPath } from "./course";

/**
 * The books of the study portal with their lessons, grouped as a learner meets them: al-Mabādiʾ's terms by chapter,
 * a primer by part, a book of a later level as one list of its lessons with a test. Used by tikrār
 * (pages/[locale]/practice/) and the progress page (pages/[locale]/study/progress.astro).
 */
export interface StudyGroup { key: string; title: string; arabic?: string; lessons: { slug: string; name: string; arabic?: string }[] }
export interface StudyBook { id: string; madrasa: string; label: string; title: string; arabic: string; author?: string; href: string; groups: StudyGroup[] }

export function studyBooks(locale: string): StudyBook[] {
  const ui = t(locale);
  const terms = localTerms(locale);
  const topics = ui.track.topics as Record<string, string>;
  const matn = getMatn();
  const chapterOf = new Map(matn.sections.flatMap((s) => s.segments.map((g) => [g.id, s.chapter] as const)));

  // Al-Mabādiʾ terms, by chapter.
  const mabadi: StudyBook = {
    id: "mabadi",
    madrasa: "ottoman",
    label: pathLevel(ui, "mabadi"),
    title: matn.title,
    arabic: matn.arabicTitle,
    author: locale === "ar" ? "أَثِيرُ الدِّينِ الأَبْهَرِيّ" : diedIn(matn.author, locale),
    href: `/${locale}/study/mabadi/`,
    groups: bookStructure(terms, locale)
      .flatMap((part) => part.chapters)
      .filter((c) => c.terms.length > 0)
      .map((c) => ({ key: c.key, title: c.title.english, arabic: c.title.arabic, lessons: c.terms.map((x) => ({ slug: x.slug, name: x.english, arabic: x.arabic })) })),
  };
  // The primers, by part.
  const primerBooks: StudyBook[] = primers().map((p) => ({
    id: p.id,
    madrasa: p.madrasa,
    label: pathLevel(ui, p.id),
    title: p.title,
    arabic: p.arabicTitle,
    author: p.author,
    href: primerPath(locale, p.id),
    groups: p.parts.map((part) => ({
      key: `primer-${p.id}-${part.id}`,
      title: part.title,
      arabic: part.arabic,
      lessons: part.lessons.map((l) => ({ slug: `${p.id}-${l.n}`, name: `${l.n}. ${l.title}`, arabic: l.arabic })),
    })),
  }));
  // The books of the later levels: their lessons with a test, in one list.
  const trackBooks: StudyBook[] = tracks()
    .map((x) => ({ x, lessons: x.lessons.filter((l) => l.quiz) }))
    .filter((s) => s.lessons.length > 0)
    .map(({ x, lessons }) => ({
      id: x.book.id,
      madrasa: placeOfBook(x.book.id).m,
      label: pathLevel(ui, x.book.id),
      title: bookName(x.book, locale).title,
      arabic: x.book.arabicTitle,
      author: x.book.author,
      href: levelPath(locale, x.level),
      groups: [
        {
          key: `track-${x.book.id}`,
          title: bookName(x.book, locale).title,
          lessons: lessons.map((l) => ({
            slug: l.id,
            name: `${l.index}. ${lessonTitle(l, locale, topics)}`,
            arabic: chapterTitle(locale, chapterOf.get(l.matn[0]) ?? x.book.blocks.find((b) => b.id === l.blocks[0])?.chapter ?? "introduction").arabic,
          })),
        },
      ],
    }));
  return [mabadi, ...primerBooks, ...trackBooks];
}

/** A book's level on its own path (1 for al-Mabādiʾ). */
export const levelOfBook = (id: string) => (id === "mabadi" ? 1 : placeOfBook(id).d);
