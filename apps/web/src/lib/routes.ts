import { getCatalogue, getMatn, getTerms } from "@nahwi/content";
import { bookStructure } from "./structure";
import { levels, primerHasText, primerLessons, primers, tracks } from "./course";
import { KB_BOOKS, kbPath } from "./kb";

/**
 * Pages saved for offline use when the app is installed, in one language: the whole course, the texts and
 * the practice, and the main pages of the knowledge base. Other knowledge-base pages (scholars, library books,
 * articles) are saved once they have been read, so a new version does not download hundreds of pages each time.
 */
export function offlinePages(locale = "en"): string[] {
  const hasText = getMatn().sections.some((s) => s.segments.length > 0);
  return [
    `/${locale}/`,
    `/${locale}/study/mabadi/`,
    `/${locale}/glossary/`,
    `/${locale}/about/`,
    ...getTerms().map((t) => `/${locale}/terms/${t.slug}/`),
    `/${locale}/practice/`,
    ...(hasText ? [`/${locale}/text/`, `/${locale}/text/mabadi/`] : []),
    ...tracks().map((x) => `/${locale}/text/${x.book.id}/`),
    ...tracks().map((x) => `/${locale}/study/${x.book.id}/`),
    ...primers().flatMap((p) => [`/${locale}/study/${p.id}/`, ...(primerHasText(p) ? [`/${locale}/text/${p.id}/`] : []), ...primerLessons(p).map((l) => `/${locale}/study/${p.id}/${l.n}/`)]),
    ...tracks().flatMap((x) => x.lessons.map((l) => `/${locale}/study/${x.book.id}/${l.n}/`)),
    ...bookStructure(getTerms()).map((p) => `/${locale}/complete/${p.key}/`),
    // The certificate of every book (pages/[locale]/study/[book]/certificate.astro).
    ...["mabadi", ...primers().map((p) => p.id), ...tracks().map((x) => x.book.id)].map((id) => `/${locale}/study/${id}/certificate/`),
    `/${locale}/study/`,
    // The reader's progress (pages/[locale]/study/progress.astro).
    `/${locale}/study/progress/`,
    `/${locale}/nahw/`,
    `/${locale}/curricula/`,
    `/${locale}/books/`,
    `/${locale}/scholars/`,
    `/${locale}/news/`,
    ...KB_BOOKS.map((b) => kbPath.book(locale, b.id)),
    ...KB_BOOKS.filter((b) => getCatalogue(b.id).length > 0).map((b) => kbPath.catalogue(locale, b.id)),
    `/${locale}/updates/`,
    `/${locale}/privacy/`,
    `/${locale}/offline/`,
  ];
}
