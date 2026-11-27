/**
 * The owner's rule (decisions 2026-11-27): on the site, Latin letters carry no marks that do not belong to the language
 * of the page. The content keeps its scholarly transliteration (ALA-LC: ṣarf, naḥw, iʿrāb, al-Ājurrūmiyya), and what is
 * served shows it plain (sarf, nahw, i'rab, al-Ajurrumiyya): src/middleware.ts passes every page and data file through
 * `plainLatin`, and scripts that write text of their own (parent-news.js, make-og.cjs) do the same. ʿayn and hamza
 * become an apostrophe; a letter with a mark the page's language has (Turkish ş, French é) keeps it. Arabic script is
 * never touched.
 */

/** The marked Latin letters each language keeps (all others lose their marks). */
const KEEP: Record<string, string> = {
  tr: "çÇşŞğĞıİöÖüÜ",
  fr: "éÉèÈêÊëËàÀâÂîÎïÏôÔùÙûÛüÜçÇÿŸ",
  nl: "éÉèÈëËïÏöÖüÜ",
};

const LETTER = /[À-ɏḀ-ỿ]/;
const MARKED = /[À-ɏḀ-ỿ]|[A-Za-z][̀-ͯ]+|[ʻʼʾʿ]/g;

export function plainLatin(text: string, locale = "en"): string {
  const keep = KEEP[locale] ?? "";
  return text.replace(MARKED, (m) => {
    if (m.length === 1 && "ʻʼʾʿ".includes(m)) return "'";
    if (keep.includes(m)) return m;
    if (m === "ı") return "i";
    if (LETTER.test(m[0]) && m.length === 1) {
      const base = m.normalize("NFD").replace(/[̀-ͯ]/g, "");
      return /^[A-Za-z]$/.test(base) ? base : m; // æ, ø, ß and the like have no plain base: left as they are
    }
    return m[0]; // a letter followed by combining marks
  });
}
