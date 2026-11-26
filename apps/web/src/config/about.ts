/**
 * The people behind The Nahwi (about page). The reviewing teacher of naḥw and ṣarf is still to be found: until then the
 * about page names no teacher (TEACHER is null) and says that everything is a draft.
 */
export const TEACHER: { name: string; source: string; teachers: { name: string; texts: string }[] } | null = null;

/** The owner, as he asked to be named (22 November 2026); also the operator named in the terms and the refund policy. */
export const OWNER = { name: "Mustafa Nawid Hbrahimgel" };

/** When the terms of service and the refund policy (legal in the UI dictionaries) last changed. */
export const LEGAL_UPDATED = "2026-11-22";
