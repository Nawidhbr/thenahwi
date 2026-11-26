import { getLibrary, type BackgroundArticle, type BackgroundConcept, type BackgroundPerson, type LibraryBook, type Term } from "@nahwi/content";
import { kbBook } from "./kb";
import { isTranslated } from "./translated";
import { diedYear, shortName } from "./background";
import { SITE, SITE_URL, absoluteUrl } from "../config/site";
import { t } from "../i18n";
import { FREE_BOOK, PAYWALL, PRICES } from "../config/pricing";
import { OWNER } from "../config/about";

// The names people may type for the site: Google uses them to show "The Nahwi" as the site's name and to match brand searches.
const ALTERNATE_NAMES = ["Nahwi", "TheNahwi", "thenahwi.com", SITE.arabicName];

export function organization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE.name,
    alternateName: ALTERNATE_NAMES,
    url: `${SITE_URL}/`,
    logo: absoluteUrl("/icons/icon-512.png"),
    description: "A knowledge base and study portal for ṣarf and naḥw, Arabic morphology and syntax in the Islamic scholarly tradition.",
    email: SITE.email,
    sameAs: SITE.social.map((x) => x.url),
    founder: { "@type": "Person", name: OWNER.name },
  };
}

export function website(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE.name,
    alternateName: ALTERNATE_NAMES,
    // The home page of the domain (thenahwi.com/ leads to the reader's language).
    url: `${SITE_URL}/`,
    inLanguage: locale,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function breadcrumbs(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function glossary(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": absoluteUrl(`/${locale}/#glossary`),
    name: t(locale).meta.glossaryName,
    url: absoluteUrl(`/${locale}/`),
    inLanguage: locale,
  };
}

export function definedTerm(term: Term, locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "@id": absoluteUrl(`/${locale}/terms/${term.slug}/#term`),
    inLanguage: locale,
    name: term.english,
    alternateName: [term.transliteration, term.arabic, ...term.alsoKnownAs],
    description: term.definition,
    url: absoluteUrl(`/${locale}/terms/${term.slug}/`),
    inDefinedTermSet: { "@id": absoluteUrl(`/${locale}/#glossary`) },
  };
}

// ---------------------------------------------------------------------------
// The knowledge base: scholars (Person), books (Book) and articles (Article).
// Ids and urls name the page Google is told to index (the canonical: the English page while a
// language has no translation of it), so the same scholar or book is one entity in every language.


const canonical = (locale: string, path: string) => {
  const inner = path.replace(/^\/[a-z]{2}(?=\/)/, "");
  return absoluteUrl(`/${isTranslated(locale, inner) ? locale : SITE.defaultLocale}${inner}`);
};
const languageOf = (locale: string, path: string) => (isTranslated(locale, path.replace(/^\/[a-z]{2}(?=\/)/, "")) ? locale : SITE.defaultLocale);
const scholarId = (locale: string, slug: string) => `${canonical(locale, `/${locale}/scholars/${slug}/`)}#person`;
const bookId = (locale: string, id: string) => `${canonical(locale, `/${locale}/books/${id}/`)}#book`;
const shareImage = (photo?: string) => absoluteUrl(`/og/${photo ?? "default"}.jpg`);
// Reference works about the same person: these count as the same entity (sameAs); other sources are cited only.
const SAME_AS = /(wikipedia\.org|wikidata\.org|islamansiklopedisi\.org\.tr|iranicaonline\.org|plato\.stanford\.edu)/;
const SUBJECT = [{ "@type": "Thing", name: "Arabic grammar (naḥw)" }, { "@type": "Thing", name: "Arabic morphology (ṣarf)" }];
const BOOK_LANG: Record<string, string> = { ar: "ar", fa: "fa", ot: "ota", ur: "ur" };

/** A scholar's page: the person, with the Arabic name, the death year (CE) and encyclopedia entries about them. */
export function person(p: BackgroundPerson, locale: string) {
  const path = `/${locale}/scholars/${p.slug}/`;
  const year = diedYear(p);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": scholarId(locale, p.slug),
    name: shortName(p),
    alternateName: [p.name, p.known, p.arabic].filter((x): x is string => !!x && x !== shortName(p)),
    description: p.summary,
    ...(year > 0 && year < 2100 && p.died ? { deathDate: String(year) } : {}),
    knowsAbout: SUBJECT,
    url: canonical(locale, path),
    sameAs: [...new Set(p.sources.map((s) => s.url).filter((u) => SAME_AS.test(u)))],
    mainEntityOfPage: canonical(locale, path),
  };
}

/** A book page (a handbook or a work of the library): the work, its author and what it comments on. */
export function book(
  b: { id: string; title: string; fullTitle?: string; arabic: string; author: string; authorSlug?: string; on?: string; language?: string; summary?: string },
  locale: string,
  opts: { photo?: string; onIsBook?: boolean } = {},
) {
  const path = `/${locale}/books/${b.id}/`;
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    "@id": bookId(locale, b.id),
    name: b.title,
    alternateName: [b.fullTitle, b.arabic].filter((x): x is string => !!x && x !== b.title),
    author: b.authorSlug ? { "@type": "Person", "@id": scholarId(locale, b.authorSlug), name: b.author } : { "@type": "Person", name: b.author },
    inLanguage: BOOK_LANG[b.language ?? "ar"] ?? "ar",
    about: SUBJECT,
    ...(b.summary ? { description: b.summary.split(/\n\n+/)[0] } : {}),
    ...(b.on && opts.onIsBook ? { isBasedOn: { "@id": bookId(locale, b.on) } } : {}),
    image: shareImage(opts.photo),
    url: canonical(locale, path),
    mainEntityOfPage: canonical(locale, path),
  };
}
export const libraryBook = (b: LibraryBook, locale: string, photo: string, onIsBook: boolean) => book(b, locale, { photo, onIsBook });

/**
 * A text of the library (/<locale>/text/<id>/): the original, transcribed from a public-domain print, with The
 * Nahwi's translation, free to read. Linked to the work's page in the knowledge base (`exampleOfWork`) and to its
 * author's page, so search engines see one work, its author, and this edition of it with a translation.
 * `work` is the id of the work's page (/books/<work>/), if there is one.
 */
export function textEdition(
  locale: string,
  t: { id: string; title: string; arabicTitle?: string; author: string; language?: string; work?: string; description?: string },
) {
  const url = canonical(locale, `/${locale}/text/${t.id}/`);
  const work = t.work ? (kbBook(t.work) ?? getLibrary().find((b) => b.id === t.work)) : undefined;
  const authorSlug = work && "authorSlug" in work ? work.authorSlug : undefined;
  const original = BOOK_LANG[t.language ?? "ar"] ?? "ar";
  const translation = languageOf(locale, `/${locale}/text/${t.id}/`);
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    "@id": `${url}#text`,
    name: t.title,
    ...(t.arabicTitle ? { alternateName: t.arabicTitle } : {}),
    author: authorSlug ? { "@type": "Person", "@id": scholarId(locale, authorSlug), name: t.author } : { "@type": "Person", name: t.author },
    inLanguage: [...new Set([original, translation])],
    translator: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    isAccessibleForFree: true,
    about: SUBJECT,
    ...(t.description ? { description: t.description } : {}),
    ...(work ? { exampleOfWork: { "@id": bookId(locale, work.id) } } : {}),
    url,
    mainEntityOfPage: url,
  };
}

/** An article of the knowledge base, written and published by the site, about the scholars it names. */
export function article(a: BackgroundArticle, locale: string, path: string, photo: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${canonical(locale, path)}#article`,
    headline: a.title.length > 110 ? `${a.title.slice(0, 107)}…` : a.title,
    description: a.summary,
    inLanguage: languageOf(locale, path),
    image: shareImage(photo),
    author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE.name, url: `${SITE_URL}/` },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE.name, url: `${SITE_URL}/`, logo: absoluteUrl("/icons/icon-512.png") },
    about: [...SUBJECT, ...a.people.map((slug) => ({ "@id": scholarId(locale, slug) }))],
    citation: a.sources.map((s) => s.url),
    mainEntityOfPage: canonical(locale, path),
  };
}

// ---------------------------------------------------------------------------
// The study portal as courses: one Course per level or book (online, taught by the site), and on the study page the
// levels as a list of courses, so search engines can show them as a course and match "nahw course". With the
// paywall on, only the free book (FREE_BOOK) is free; every other book is partly free (three preview lessons) and
// opens with full access, which the offer names (the base monthly price).

const PROVIDER = { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE.name, url: `${SITE_URL}/` };

export { PAYWALL };

/** Is this course (its address /<locale>/study/<book>/) free to study? */
export function courseIsFree(path: string) {
  const book = path.match(/\/study\/([^/]+)\//)?.[1];
  return !PAYWALL || book === FREE_BOOK;
}

/** About twenty minutes a lesson: reading the text and the explanation, and the test. */
const workload = (lessons: number) => {
  const m = lessons * 20;
  return `PT${Math.floor(m / 60) ? `${Math.floor(m / 60)}H` : ""}${m % 60 ? `${m % 60}M` : ""}`;
};

export function course(locale: string, level: number, name: string, description: string, path: string, lessons?: number) {
  const free = courseIsFree(path);
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${canonical(locale, path)}#course`,
    name,
    description,
    url: canonical(locale, path),
    provider: PROVIDER,
    inLanguage: languageOf(locale, path),
    about: SUBJECT,
    isAccessibleForFree: free,
    offers: [
      free
        ? { "@type": "Offer", category: "Free", price: 0, priceCurrency: PRICES.currency }
        : { "@type": "Offer", category: "Partially Free", price: PRICES.base.monthly, priceCurrency: PRICES.currency },
    ],
    ...(lessons ? { hasCourseInstance: [{ "@type": "CourseInstance", courseMode: "Online", courseWorkload: workload(lessons) }] } : {}),
    educationalLevel: level === 1 ? "Beginner" : level === 2 ? "Intermediate" : "Advanced",
    ...(level > 1 ? { coursePrerequisites: `Level ${level - 1} of The Nahwi` } : {}),
  };
}

/**
 * A lesson of a book behind the paywall: its text is in the page (for search engines and for readers with access)
 * but hidden by the page script from readers without access. Google asks such pages to say so, or it may take the
 * difference for cloaking: the page is not free, and the hidden part is `.lockable` (the lesson itself).
 * Returns nothing for a free lesson. A term of the free book is gated too while the paywall is on (it opens with a
 * free account), so its page passes `gated: PAYWALL`.
 */
export function paywalledLesson(locale: string, path: string, name: string, gated = !courseIsFree(path)) {
  if (!gated) return [];
  const course = path.match(/^\/study\/[^/]+\//)?.[0];
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name,
      url: canonical(locale, path),
      inLanguage: languageOf(locale, path),
      isAccessibleForFree: false,
      ...(course ? { isPartOf: { "@id": `${canonical(locale, course)}#course` } } : {}),
      hasPart: { "@type": "WebPageElement", isAccessibleForFree: false, cssSelector: ".lockable" },
    },
  ];
}

export function courseList(items: Array<ReturnType<typeof course>>) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((c, i) => ({ "@type": "ListItem", position: i + 1, item: { ...c, "@context": undefined } })),
  };
}

/** The glossary of the knowledge base (/glossary/): one DefinedTermSet per language, and a DefinedTerm per concept. */
export function conceptSet(locale: string) {
  const path = `/${locale}/glossary/`;
  return { "@context": "https://schema.org", "@type": "DefinedTermSet", "@id": `${canonical(locale, path)}#set`, name: t(locale).kb.glossary.title, description: t(locale).kb.glossary.lead, url: canonical(locale, path), inLanguage: languageOf(locale, path), about: SUBJECT, isAccessibleForFree: true };
}
export function concept(c: BackgroundConcept, locale: string) {
  const path = `/${locale}/glossary/${c.slug}/`;
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "@id": `${canonical(locale, path)}#term`,
    name: c.name,
    alternateName: [c.transliteration, c.arabic, ...c.alsoKnownAs].filter((x) => x && x !== c.name),
    description: c.definition,
    termCode: c.arabic,
    url: canonical(locale, path),
    inLanguage: languageOf(locale, path),
    inDefinedTermSet: { "@id": `${canonical(locale, `/${locale}/glossary/`)}#set` },
  };
}
