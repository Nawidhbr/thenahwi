import { getBackground, getCatalogue, type BackgroundArticle, type BackgroundPerson } from "@nahwi/content";
import { PHOTOS } from "../config/photos";
import kbBooks from "../config/kb-books.json";
import { diedYear, shortName } from "./background";
import { fmt, t } from "../i18n";

/**
 * The knowledge base: its books, sections, photos and paths.
 * Names and titles here are data (transliterations, Arabic); interface text lives in the `kb` dictionary.
 */
export interface KbBook {
  id: string;
  title: string;
  fullTitle: string;
  arabic: string;
  author: string;
  authorSlug: string;
  died: string;
  photo: string;
}

/** The handbooks, in the order they were written (config/kb-books.json, so the content check can read the same list). */
export const KB_BOOKS: KbBook[] = kbBooks;
export const kbBook = (id: string) => KB_BOOKS.find((b) => b.id === id);
export const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

/** The sections besides the books, with their Arabic heading (always set in Kufi) and their photo. */
export const KB_SECTIONS = {
  nahw: { arabic: "عَنِ النَّحْوِ وَالصَّرْف", photo: "blue-mosaic-inscription" },
  curricula: { arabic: "المَناهِج", photo: "shahada-over-door" },
  books: { arabic: "المَكْتَبَة", photo: "painted-arch-panel" },
  scholars: { arabic: "الأَعْلام", photo: "stone-inscription" },
  news: { arabic: "الجَدِيد", photo: "gilded-wall-inscriptions" },
  glossary: { arabic: "مُعْجَمُ النَّحْوِ وَالصَّرْف", photo: "tiled-portal-verse" },
  study: { arabic: "ادْرُسْ دَرْسًا دَرْسًا", photo: "tile-niche-inscription" },
} as const;
export type KbSection = keyof typeof KB_SECTIONS;

/** A photo for an item that has none of its own: the same item always gets the same photo. */
export function photoFor(key: string, avoid: string[] = []): string {
  const pool = PHOTOS.map((p) => p.slug).filter((s) => !avoid.includes(s));
  let h = 0;
  for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return pool[h % pool.length];
}
export const photoInfo = (slug: string) => PHOTOS.find((p) => p.slug === slug);

/** Paths of the knowledge base. */
export const kbPath = {
  home: (l: string) => `/${l}/`,
  nahw: (l: string, slug?: string) => `/${l}/nahw/${slug ? `${slug}/` : ""}`,
  curricula: (l: string, slug?: string) => `/${l}/curricula/${slug ? `${slug}/` : ""}`,
  books: (l: string) => `/${l}/books/`,
  book: (l: string, id: string) => `/${l}/books/${id}/`,
  bookArticle: (l: string, id: string, slug: string) => `/${l}/books/${id}/${slug}/`,
  catalogue: (l: string, id: string) => `/${l}/books/${id}/catalogue/`,
  scholars: (l: string) => `/${l}/scholars/`,
  scholar: (l: string, slug: string) => `/${l}/scholars/${slug}/`,
  news: (l: string) => `/${l}/news/`,
  glossary: (l: string, slug?: string) => `/${l}/glossary/${slug ? `${slug}/` : ""}`,
  study: (l: string) => `/${l}/study/`,
};

/** Where an article lives: its section page and its own URL. */
export function articleHref(l: string, a: Pick<BackgroundArticle, "book" | "slug">) {
  if (a.book === "nahw") return kbPath.nahw(l, a.slug);
  if (a.book === "curricula") return kbPath.curricula(l, a.slug);
  return kbPath.bookArticle(l, a.book, a.slug);
}

/** The articles of one section or book, in reading order. */
export const articlesOf = (l: string, section: string) => getBackground(l).articles.filter((a) => a.book === section).sort((a, b) => a.order - b.order);

/** The photo of an article: its book's, or one of its own for the general sections. */
export function articlePhoto(a: Pick<BackgroundArticle, "book" | "slug">) {
  const book = kbBook(a.book);
  return book ? book.photo : photoFor(a.slug, [KB_SECTIONS.nahw.photo, KB_SECTIONS.curricula.photo]);
}

/** A scholar's photo: the photo of the first book they belong to, else one of their own. */
export function scholarPhoto(p: Pick<BackgroundPerson, "books" | "slug">) {
  const b = p.books.map(kbBook).find(Boolean);
  return b ? b.photo : photoFor(p.slug);
}

/** Catalogue counts of a book by kind. */
export function catalogueCounts(id: string) {
  const all = getCatalogue(id);
  const by = (k: string[]) => all.filter((e) => k.includes(e.kind)).length;
  return { all: all.length, sharh: by(["sharh"]), hashiya: by(["hashiya"]), other: by(["taliq", "nazm", "edition", "other", "mukhtasar", "iraab"]), translation: by(["translation"]), modern: by(["modern"]) };
}

/** The century (CE) a person died in, for grouping; null when unknown. */
export function century(p: BackgroundPerson): number | null {
  const y = diedYear(p);
  if (y === 99999) return null;
  return y < 0 ? -Math.ceil(-y / 100) : Math.floor(y / 100) + 1;
}

export { shortName, diedYear };

/** A short death date for labels: "766/1365" out of "Ramaḍān 766/1365 (other sources: …)"; otherwise the text before any note. */
export function shortDied(d?: string, locale = "en"): string {
  if (!d) return "";
  // "16 Dhū l-Qaʿda 766/4 August 1365" → "766/1365"; "909/1503–4" stays.
  // Also "Rabīʿ I or II 298/November–December 910" → "298/910".
  const m = d.match(/(ca\. )?(\d{1,4})\s*\/\s*(?:\d{1,2}\s+)?(?:[^\d/]+?\s)?(\d{3,4}(?:[–-]\d{1,4})?)/);
  const s = m ? `${m[1] ?? ""}${m[2]}/${m[3]}` : d.split(/ \(|;|,/)[0];
  return locale === "en" ? s : diedLocal(s, locale);
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/**
 * A short date of death in the reader's language: a full Gregorian date ("19 December 1893") in its own form, any other
 * date with an English month name as its year, "ca." and the eras (BCE, CE) from `book` in the UI dictionary. Hijri/
 * Gregorian pairs stay as they are (scripts/calendar.js shows them); a century in words stays in English for now.
 */
function diedLocal(s: string, locale: string): string {
  const B = t(locale).book;
  const full = s.match(new RegExp(`^(\\d{1,2}) (${MONTHS.join("|")}) (\\d{4})$`));
  if (full) {
    try {
      return new Intl.DateTimeFormat(`${locale}-u-ca-gregory`, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(Date.UTC(Number(full[3]), MONTHS.indexOf(full[2]), Number(full[1])));
    } catch {
      return s;
    }
  }
  let core = s;
  if (new RegExp(`\\b(${MONTHS.join("|")})\\b`).test(core)) core = core.match(/(\d{4})(?!.*\d{4})/)?.[1] ?? core;
  const circa = /^ca\. /.test(core);
  core = core.replace(/^ca\. /, "");
  const era = core.match(/^([\d–-]+) (BCE|CE)$/);
  if (era) core = fmt(era[2] === "BCE" ? B.bce : B.ceYear, { y: era[1] });
  return circa ? `${B.circa} ${core}` : core;
}
