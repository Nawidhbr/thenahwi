import { CHAPTER_ORDER, CHAPTER_PART, PART_ORDER, PART_TITLES, type Chapter, type Part, type Term } from "@nahwi/content";
import { t } from "../i18n";
import { chapterTitle } from "./localize";

export interface ChapterGroup {
  key: Chapter;
  number: number;
  title: { english: string; arabic: string };
  terms: Term[];
}

export interface PartGroup {
  key: Part;
  numeral: string | null;
  /** What the part's tile shows: its numeral, or 0 for the introduction. */
  tile: string;
  title: (typeof PART_TITLES)[Part];
  chapters: ChapterGroup[];
}

const NUMERALS: Record<Part, string | null> = { introduction: null, sarf: "I", nahw: "II" };

/** Terms grouped as al-Mabādiʾ is: introduction, then ṣarf, then naḥw. Empty chapters are left out. */
export function bookStructure(terms: Term[], locale = "en"): PartGroup[] {
  const ui = t(locale);
  const chapters: ChapterGroup[] = CHAPTER_ORDER.map((key, i) => ({
    key,
    number: i,
    title: chapterTitle(locale, key),
    terms: terms.filter((t) => t.chapter === key),
  })).filter((c) => c.terms.length > 0);
  return PART_ORDER.map((key) => ({
    key,
    numeral: NUMERALS[key],
    tile: NUMERALS[key] ?? "0",
    title: { ...PART_TITLES[key], english: ui.parts[key].title, summary: ui.parts[key].summary },
    chapters: chapters.filter((c) => CHAPTER_PART[c.key] === key),
  })).filter((p) => p.chapters.length > 0);
}
