import { getBackground, getTabaqat, tabaqatEntriesOf, type BackgroundPerson, type TabaqatBook, type TabaqatEntry } from "@nahwi/content";
import { t } from "../i18n";
import { diedHijri, hijriCentury, kbPath, lastPlace } from "./kb";

/**
 * The ṭabaqāt works on the site whole (packages/content/tabaqat/<id>.json; docs/tabaqat-pipeline.md): Ibn al-Anbārī's
 * Nuzhat al-alibbāʾ and al-Suyūṭī's Bughyat al-wuʿāt. The overview at /<locale>/tabaqat/, each book at
 * /<locale>/tabaqat/<book>/, each entry at /<locale>/tabaqat/<book>/<id>/ (the Bughya's in English only until it is
 * translated: `entryLanguages`), and the links from the scholars to their entries.
 */
export const NUZHAT_ID = "nuzhat";
export const BUGHYA_ID = "bughya";
/** The books in the order the site shows them: the story of the first centuries, then the full reference. */
export const tabaqatBooks = (): TabaqatBook[] => [NUZHAT_ID, BUGHYA_ID].map((id) => getTabaqat().find((b) => b.id === id)).filter((b): b is TabaqatBook => !!b);
export const tabaqatBook = (id: string): TabaqatBook | undefined => getTabaqat().find((b) => b.id === id);
export const nuzhat = (): TabaqatBook | undefined => tabaqatBook(NUZHAT_ID);

/** The photo of a book's pages (each book its own, from config/photos.ts). */
export const BOOK_PHOTO: Record<string, string> = { [NUZHAT_ID]: "zellij-glazed-inscription", [BUGHYA_ID]: "stucco-script-interlace" };
/** About how many entries a book has in all, while it is being merged (the Bughya: the 2,209 of the lists). */
export const BOOK_SIZE: Record<string, number> = { [NUZHAT_ID]: 181, [BUGHYA_ID]: 2200 };

/** The book's own texts of the interface: the Nuzha's at the top of kb.tabaqat (the first book), the Bughya's under `bughya`. */
export function bookText(locale: string, b: TabaqatBook) {
  const T = t(locale).kb.tabaqat;
  const B = b.id === NUZHAT_ID ? T : T.bughya;
  return {
    title: B.title,
    description: B.description,
    lead: B.lead,
    summary: b.id === NUZHAT_ID ? T.overview.nuzhatSummary : T.bughya.summary,
    introTitle: B.introTitle,
    entriesTitle: B.entriesTitle,
    entriesLead: B.entriesLead,
    entryTitle: B.entryTitle,
    entryDescription: B.entryDescription,
    closing: B.closing,
    readBookLead: B.readBookLead,
  };
}

/** The language an entry's page is in: the reader's, or English for a book whose entries are not yet built in his. */
export const entryLocale = (b: TabaqatBook, locale: string) => (b.entryLanguages === "en" ? "en" : locale);
/** The address of an entry's page. */
export const entryHref = (b: TabaqatBook, e: Pick<TabaqatEntry, "id">, locale: string) => kbPath.tabaqat(entryLocale(b, locale), b.id, e.id);

/** The scholar page an entry is tied to, in the reader's language. */
export function entryPerson(e: TabaqatEntry, locale: string): BackgroundPerson | undefined {
  return e.person ? getBackground(locale).people.find((p) => p.slug === e.person) : undefined;
}

/** The death date of an entry's man: as the entry gives it, else as his page has it. */
export function entryDied(e: TabaqatEntry, person?: BackgroundPerson): string {
  return e.died ?? person?.died?.split(/ \(|;/)[0] ?? "";
}
/** The hijri year of that death, and its century (null when unknown). */
export const entryHijri = (e: TabaqatEntry, person?: BackgroundPerson) => diedHijri({ died: entryDied(e, person) });
export const entryCentury = (e: TabaqatEntry, person?: BackgroundPerson) => hijriCentury({ died: entryDied(e, person) });
/** His city: as the entry gives it, else the last place on his page. */
export const entryPlace = (e: TabaqatEntry, person?: BackgroundPerson) => e.place ?? (person ? lastPlace(person) : "");

/** A scholar's entries in the ṭabaqāt works, one per book (the first, should a book have more), in the site's order of the books. */
export function tabaqatEntriesFor(slug: string, locale: string): { book: TabaqatBook; entry: TabaqatEntry; href: string }[] {
  const hits = tabaqatEntriesOf(slug);
  return tabaqatBooks().flatMap((book) => {
    const hit = hits.find((x) => x.book.id === book.id);
    return hit ? [{ book, entry: hit.entry, href: entryHref(book, hit.entry, locale) }] : [];
  });
}
/** A scholar's entry in the Nuzhat, with its path. */
export function nuzhatEntryOf(slug: string, locale: string): { entry: TabaqatEntry; href: string } | undefined {
  return tabaqatEntriesFor(slug, locale).find((x) => x.book.id === NUZHAT_ID);
}
/** A scholar's entry in the Bughya, with its path (in English until the entries are translated). */
export function bughyaEntryOf(slug: string, locale: string): { entry: TabaqatEntry; href: string } | undefined {
  return tabaqatEntriesFor(slug, locale).find((x) => x.book.id === BUGHYA_ID);
}

/**
 * The print's page in the scan: the scan's page viewer where it has one (`edition.pageUrl`, "{leaf}" counted from 0),
 * else the PDF opened at that page (PDF page = print page + offset).
 */
export const scanHref = (b: TabaqatBook, page: string | number) => {
  const pdf = Number(page) + b.edition.offset;
  return b.edition.pageUrl ? b.edition.pageUrl.replace("{leaf}", String(pdf - 1)) : `${b.edition.scan}#page=${pdf}`;
};

/** The first page of an entry. */
export const firstPage = (e: TabaqatEntry) => e.pages.split("–")[0];
