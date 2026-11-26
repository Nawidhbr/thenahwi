import { getCurriculum, getPrimers } from "@nahwi/content";

/**
 * The three madrasa paths of the study portal, chosen at the start: each with four levels, following the madrasa
 * curricula described in the knowledge base (/curricula/). The paths are content (packages/content/curriculum.json,
 * validated): this module only sorts each level's books into the first reading of al-Mabādiʾ (`terms`), primer
 * courses (`primers`, packages/content/primers/) and books read lesson by lesson (`books`, commentaries/), or a book
 * still in preparation (`soon`, its name in `madrasa.soon` of the UI dictionaries). A level opens when every item of
 * the level before it in the same path is passed; a book shared by two paths counts in both.
 */
export type MadrasaId = "indian" | "ottoman" | "north-african";

export interface MadrasaLevel {
  n: number;
  terms?: true;
  primers?: string[];
  books?: string[];
  soon?: string;
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

export const MADRASAS: Madrasa[] = getCurriculum().paths.map((p) => ({
  id: p.id,
  traditions: p.traditions,
  photo: p.photo,
  levels: p.levels.map((l) => {
    const books = l.books ?? [];
    const level: MadrasaLevel = { n: l.n };
    if (books.includes("mabadi")) level.terms = true;
    const primers = books.filter((b) => primerIds.has(b));
    const read = books.filter((b) => b !== "mabadi" && !primerIds.has(b));
    if (primers.length) level.primers = primers;
    if (read.length) level.books = read;
    if (l.soon && !books.length) level.soon = l.soon;
    return level;
  }),
}));
