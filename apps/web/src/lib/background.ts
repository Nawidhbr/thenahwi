import type { BackgroundPerson } from "@nahwi/content";

/** The Common-Era year a person died, for ordering (from "663/1265", "ca. 760/1359", "d. 1520"…); people without a date go last. */
export function diedYear(p: BackgroundPerson): number {
  const d = p.died ?? "";
  // "663/1265", "11 Ramaḍān 328/20 June 940", "Rabīʿ I or II 298/November–December 910": the CE year after the slash.
  const ce = d.match(/\d\s*\/\s*(?:\d{1,2}\s+)?(?:[^\d/]+?\s)?(-?\d{3,4})/) ?? d.match(/(\d{3,4})\s*(?:CE|AD|M)\b/i) ?? d.match(/(\d{3,4})/);
  if (!ce) return 99999;
  const n = Number(ce[1]);
  return /BCE|BC/i.test(d) ? -n : n;
}

/** The order in which roles are shown, from the sources of the book to modern scholarship. */
export const ROLE_ORDER = ["forerunner", "translator", "author", "commentator", "glossator", "versifier", "teacher", "editor", "voice", "modern-scholar"] as const;

/** A person's main role: the first of theirs in ROLE_ORDER. */
export const mainRole = (p: BackgroundPerson) => ROLE_ORDER.find((r) => p.roles.includes(r)) ?? p.roles[0];

/**
 * The family of texts around al-Mabādiʾ: the matn, the commentaries on it,
 * and the glosses on each commentary (from the works' "on" field).
 */
export function textTree(people: BackgroundPerson[], root = "mabadi") {
  const works = people.flatMap((p) => p.works.map((w) => ({ ...w, by: p })));
  const commentaries = works.filter((w) => w.on === root && (w.kind === "sharh" || w.kind === "nazm"));
  return commentaries
    .sort((a, b) => diedYear(a.by) - diedYear(b.by))
    .map((c) => ({ ...c, glosses: works.filter((w) => w.on === c.by.slug && (w.kind === "hashiya" || w.kind === "taliq" || w.kind === "sharh")).sort((a, b) => diedYear(a.by) - diedYear(b.by)) }));
}

/** A short name for lists: the "known as" form without its notes in brackets or after a semicolon. */
export const shortName = (p: BackgroundPerson) => (p.known ?? p.name).split(/\s*[;(]/)[0].trim();

/** The books of "The book" section: al-Mabādiʾ at /book/, the others at /book/<id>/. */
export const BOOKS: Record<string, { title: string; arabic: string; author: string }> = {
  mabadi: { title: "al-Mabādiʾ", arabic: "المَبَادِئ", author: "The Nahwi" },
};
export const bookBase = (locale: string, book: string) => (book === "mabadi" ? `/${locale}/book/` : `/${locale}/book/${book}/`);
