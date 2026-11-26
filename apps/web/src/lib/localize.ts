import { CHAPTER_PART, getLocaleBundle, getMatn, getTerms, type Chapter, type Matn, type Term } from "@nahwi/content";
import { t } from "../i18n";

/** Terms in a site language: names, definitions, explanations and examples translated; Arabic, slugs and order unchanged. */
export function localTerms(locale: string): Term[] {
  const bundle = getLocaleBundle(locale);
  if (!bundle) return getTerms();
  return getTerms().map((term) => {
    const tr = bundle.terms[term.slug];
    if (!tr) return term;
    return {
      ...term,
      english: tr.name,
      // Only the translation's own alternative names are shown; the English ones stay findable through search.
      alsoKnownAs: tr.alsoKnownAs,
      definition: tr.definition,
      explanation: tr.explanation,
      examples: term.examples.map((ex, i) => ({ ...ex, english: tr.examples[i]?.text ?? ex.english, note: tr.examples[i]?.note ?? ex.note })),
    };
  });
}

/** The matn with each segment's translation in the site language (empty for Arabic: the matn speaks for itself). */
export function localMatn(locale: string): Matn {
  const matn = getMatn();
  if (locale === "en") return matn;
  const bundle = getLocaleBundle(locale);
  return {
    ...matn,
    sections: matn.sections.map((s) => ({ ...s, segments: s.segments.map((seg) => ({ ...seg, english: bundle?.matn[seg.id] ?? (locale === "ar" ? "" : seg.english) })) })),
  };
}

export const chapterTitle = (locale: string, c: Chapter) => ({ english: t(locale).chapters[c], arabic: CHAPTER_ARABIC[c] });
export const partTitle = (locale: string, p: keyof ReturnType<typeof t>["parts"]) => t(locale).parts[p];
export { CHAPTER_PART };

const CHAPTER_ARABIC: Record<Chapter, string> = {
  introduction: "المُقَدِّمَة",
  word: "أَقْسَامُ الكَلِمَة",
  root: "الأَصْلُ وَالمِيزَان",
  verb: "الفِعْلُ وَأَزْمِنَتُه",
  "sound-weak": "الصَّحِيحُ وَالمُعْتَلّ",
  derived: "المُشْتَقَّات",
  irab: "الإِعْرَابُ وَالبِنَاء",
  sentence: "الجُمْلَة",
};

/**
 * A date of death as the content writes it in English ("d. 816/1413", "d. ca. 760/1359", "d. 1243 or 1244/1828–29",
 * "(uncertain)"), or an author line that ends in one, in the reader's language: the abbreviations and the few words
 * from `book` in the UI dictionary. The dates themselves stay as they are (scripts/calendar.js shows them).
 */
export function diedIn(text: string, locale: string): string {
  if (locale === "en" || !text) return text;
  const B = t(locale).book;
  return text
    .replace(/(^|\()d\. /g, `$1${B.died} `)
    .replace(/\b(?:ca|c)\. (?=\d)/g, `${B.circa} `)
    .replace(/(\d) or (\d)/g, `$1 ${B.or} $2`)
    .replace(/\(or (\d)/g, `(${B.or} $1`)
    .replace(/\(uncertain\)/g, `(${B.uncertain})`);
}
