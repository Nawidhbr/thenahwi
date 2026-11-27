import { getBackground, getTabaqat, tabaqatEntriesOf, type BackgroundPerson, type TabaqatBook, type TabaqatEntry } from "@nahwi/content";
import { diedHijri, hijriCentury, kbPath, lastPlace } from "./kb";

/**
 * Ibn al-Anbārī's Nuzhat al-alibbāʾ on the site (packages/content/tabaqat/nuzhat.json; docs/tabaqat-pipeline.md): the
 * book at /<locale>/tabaqat/, each entry at /<locale>/tabaqat/<id>/, and the links from the scholars to their entries.
 */
export const NUZHAT_ID = "nuzhat";
export const nuzhat = (): TabaqatBook | undefined => getTabaqat().find((b) => b.id === NUZHAT_ID);

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

/** A scholar's entry in the Nuzhat (the first, should there be more), with its path. */
export function nuzhatEntryOf(slug: string, locale: string): { entry: TabaqatEntry; href: string } | undefined {
  const hit = tabaqatEntriesOf(slug).find((x) => x.book.id === NUZHAT_ID);
  return hit ? { entry: hit.entry, href: kbPath.tabaqat(locale, hit.entry.id) } : undefined;
}

/** The print's page as a page of the scan (PDF page = print page + offset), for a link straight to it. */
export const scanHref = (b: TabaqatBook, page: string | number) => `${b.edition.scan}#page=${Number(page) + b.edition.offset}`;

/** The first page of an entry. */
export const firstPage = (e: TabaqatEntry) => e.pages.split("–")[0];
