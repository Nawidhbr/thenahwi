import { CHAPTER_ORDER, getExerciseSets, getLocaleBundle, type Chapter, type Exercise } from "@nahwi/content";
import { chapterTitle } from "./localize";
import { amrExercises, babExercises, derivedExercises, personExercises } from "@nahwi/engine";

export interface PracticeSet {
  chapter: Chapter;
  title: { english: string; arabic: string };
  items: Exercise[];
}

/** Questions the taṣrīf engine writes and answers itself (packages/engine). */
const GENERATED: Partial<Record<Chapter, () => Exercise[]>> = {
  root: () => babExercises(),
  verb: () => [...personExercises(), ...amrExercises()],
  derived: () => derivedExercises(),
};

/** One practice set per chapter that has exercises, in the order of the book. */
export function practiceSets(locale = "en"): PracticeSet[] {
  const written = getExerciseSets();
  const bundle = getLocaleBundle(locale);
  return CHAPTER_ORDER.map((chapter) => {
    const items = [...(written.find((s) => s.chapter === chapter)?.items ?? []), ...(GENERATED[chapter]?.() ?? [])];
    const tr = bundle?.exercises[chapter] ?? {};
    return {
      chapter,
      title: chapterTitle(locale, chapter),
      // A translated question replaces the English one; an untranslated one stays in English.
      items: items.map((it) => (tr[it.id] && tr[it.id].options.length === it.options.length ? { ...it, ...tr[it.id] } : it)),
    };
  }).filter((s) => s.items.length > 0);
}
