import { getBackground, getLibrary, hasBackgroundTranslation, hasLibraryTranslation } from "@nahwi/content";

/**
 * Whether a page exists in its own language, or still shows the English text (the knowledge base is translated later).
 * Untranslated pages stay readable, but point their canonical at the English page, carry no hreflang and stay out of the sitemap,
 * so that search engines do not see eight copies of the same text.
 * `path` is the path within the locale, e.g. "/scholars/abhari/".
 */
const KB = /^\/(nahw|curricula|books|scholars|news|updates|glossary)\//;
export function isTranslated(locale: string, path: string): boolean {
  if (locale === "en") return true;
  if (path !== "/" && !KB.test(path)) return true; // the study portal, about, privacy: translated with the interface
  const parts = path.split("/").filter(Boolean);
  if (parts[0] === "scholars" && parts.length === 2) return hasBackgroundTranslation(locale, "people", parts[1]);
  if (parts[0] === "glossary") {
    const concepts = getBackground("en").concepts;
    return parts.length === 2 ? hasBackgroundTranslation(locale, "concepts", parts[1]) : concepts.length > 0 && concepts.every((c) => hasBackgroundTranslation(locale, "concepts", c.slug));
  }
  const articleSlug = (parts[0] === "nahw" || parts[0] === "curricula") && parts.length === 2 ? parts[1] : parts[0] === "books" && parts.length === 3 && parts[2] !== "catalogue" ? parts[2] : undefined;
  if (articleSlug && getBackground("en").articles.some((a) => a.slug === articleSlug)) return hasBackgroundTranslation(locale, "articles", articleSlug);
  // A page that only gathers translated pages is translated too: the home page, the scholars, the sections and the handbooks.
  if (parts.length === 0) return groupTranslated(locale, () => true, () => true);
  if (parts[0] === "scholars" && parts.length === 1) return groupTranslated(locale, () => true, () => false);
  if ((parts[0] === "nahw" || parts[0] === "curricula") && parts.length === 1) return groupTranslated(locale, () => false, (a) => a.book === parts[0]);
  if (parts[0] === "books" && parts.length === 2 && handbooks().has(parts[1])) return groupTranslated(locale, (p) => p.books.includes(parts[1]), (a) => a.book === parts[1]);
  // A book of the library, once its summary is translated; the books page once every book on it is.
  if (parts[0] === "books" && parts.length === 2 && getLibrary().some((b) => b.id === parts[1])) return hasLibraryTranslation(locale, parts[1]);
  if (parts[0] === "books" && parts.length === 1) return getLibrary().every((b) => hasLibraryTranslation(locale, b.id)) && [...handbooks()].every((h) => isTranslated(locale, `/books/${h}/`));
  return false; // catalogues, the commentaries' editions pages and news: English
}

type En = ReturnType<typeof getBackground>;
/** The six handbooks: every `book` of an article except the two sections. */
const handbooks = () => new Set(getBackground("en").articles.map((a) => a.book).filter((b) => b !== "nahw" && b !== "curricula"));
/** Whether every scholar and article a page gathers (at least one) has its translation. */
function groupTranslated(locale: string, person: (p: En["people"][number]) => boolean, article: (a: En["articles"][number]) => boolean): boolean {
  const en = getBackground("en");
  const people = en.people.filter(person);
  const articles = en.articles.filter(article);
  if (!people.length && !articles.length) return false;
  return people.every((p) => hasBackgroundTranslation(locale, "people", p.slug)) && articles.every((a) => hasBackgroundTranslation(locale, "articles", a.slug));
}
