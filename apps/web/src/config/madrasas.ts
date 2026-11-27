import { getCurriculum, getPrimers, getTracks } from "@nahwi/content";

/**
 * The three madrasa paths of the study portal, chosen at the start, following the madrasa curricula described in the
 * knowledge base (/curricula/). The paths are content (packages/content/curriculum.json, validated): this module sorts
 * each level into the first reading of al-Mabādiʾ (`terms`) or two lanes side by side, ṣarf and naḥw (`lanes`), each
 * with its books in reading order: a primer course (packages/content/primers/), a book read lesson by lesson
 * (commentaries/), or a book still in preparation (its name in `madrasa.soonBooks` of the UI dictionaries). `primers`
 * and `books` list the courses of the level that exist, lane by lane. A level opens when every course of the level
 * before it in the same path is passed; inside a level each lane is read in order (lib/course.ts placesOf); a book
 * shared by two paths counts in both.
 */
export type MadrasaId = "indian" | "ottoman" | "north-african";
export type Subject = "sarf" | "nahw";
export type Stage = "foundations" | "beginner" | "intermediate" | "advanced";

export interface LaneItem {
  id: string;
  /** "primer", "book" (read lesson by lesson) or "soon" (in preparation). */
  kind: "primer" | "book" | "soon";
}
export interface Lane {
  subject: Subject;
  items: LaneItem[];
}

export interface MadrasaLevel {
  n: number;
  stage?: Stage;
  terms?: true;
  primers?: string[];
  books?: string[];
  /** The older form: a level only in preparation, by the name of its book. */
  soon?: string;
  /** Ṣarf first, as in the madrasa, then naḥw; a lane without books is left out. */
  lanes?: Lane[];
}

export interface Madrasa {
  id: MadrasaId;
  /** The traditions the path stands for (names in `madrasa.traditions` of the UI dictionaries). */
  traditions: string[];
  /** The photo of its card (config/photos.ts), from the region of the path. */
  photo: string;
  levels: MadrasaLevel[];
}

const primerIds = new Set(getPrimers().map((p) => p.id));
const bookIds = new Set(getTracks().map((b) => b.id));
const kindOf = (id: string): LaneItem["kind"] => (primerIds.has(id) ? "primer" : bookIds.has(id) ? "book" : "soon");

export const MADRASAS: Madrasa[] = getCurriculum().paths.map((p) => ({
  id: p.id,
  traditions: p.traditions,
  photo: p.photo,
  levels: p.levels.map((l) => {
    const level: MadrasaLevel = { n: l.n };
    if (l.stage) level.stage = l.stage;
    const books = l.books ?? [];
    if (books.includes("mabadi")) level.terms = true;
    const lanes: Lane[] = (["sarf", "nahw"] as const)
      .map((subject) => ({ subject, items: (l[subject] ?? []).map((id) => ({ id, kind: kindOf(id) })) }))
      .filter((x) => x.items.length > 0);
    if (lanes.length) level.lanes = lanes;
    const ready = [...books.filter((b) => b !== "mabadi"), ...lanes.flatMap((x) => x.items.filter((i) => i.kind !== "soon").map((i) => i.id))];
    const primers = ready.filter((b) => primerIds.has(b));
    const read = ready.filter((b) => !primerIds.has(b));
    if (primers.length) level.primers = primers;
    if (read.length) level.books = read;
    if (l.soon && !books.length && !lanes.length) level.soon = l.soon;
    return level;
  }),
}));

/** The courses of a level that exist, in the order the pages number them (ṣarf lane, then naḥw), with their lane. */
export const levelCourses = (lv: MadrasaLevel): { id: string; subject?: Subject }[] => {
  const laned = (lv.lanes ?? []).flatMap((x) => x.items.filter((i) => i.kind !== "soon").map((i) => ({ id: i.id, subject: x.subject })));
  const inLanes = new Set(laned.map((x) => x.id));
  const loose = [...(lv.primers ?? []), ...(lv.books ?? [])].filter((id) => !inLanes.has(id)).map((id) => ({ id }));
  return [...loose, ...laned];
};
