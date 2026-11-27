import { describe, expect, it } from "vitest";
import { levelNumber, needsOn, pathLevel, subOf } from "../src/lib/course";
import { t } from "../src/i18n";
import { MADRASAS } from "../src/config/madrasas";

// A book's level as its madrasa path counts it (lib/course.ts pathLevel); a level that holds several books is shown as
// 1a, 1b (levelNumber). Al-Mabādiʾ opens all three paths.
describe("the level a page names", () => {
  it("names al-Mabādiʾ level 1 on every path", () => {
    const named = pathLevel(t("en"), "mabadi");
    expect(named).toContain("Indian path · level 1");
    expect(named).toContain("Ottoman path · level 1");
    expect(named).toContain("North-African path · level 1");
  });
  it("leaves a book alone on its level without a letter", () => {
    expect(subOf("mabadi", "indian")).toBeUndefined();
  });
  it("numbers the books of a level with several books 1a, 1b", () => {
    expect(levelNumber(t("en"), 1, 0)).toBe("1a");
    expect(levelNumber(t("en"), 1, 1)).toBe("1b");
    expect(levelNumber(t("en"), 2)).toBe("2");
  });
});

// The two lanes of a level (curriculum.json, lib/course.ts needsOn): ṣarf and naḥw are read side by side, each book
// after the one before it in its lane; the first book of a lane needs the whole level before; levels still only in
// preparation are skipped; a book in preparation counts for nothing.
describe("the lanes of a level", () => {
  const levels = [
    { n: 1, terms: true as const },
    { n: 2, lanes: [{ subject: "sarf" as const, items: [{ id: "s1", kind: "primer" as const }, { id: "s2", kind: "primer" as const }] }, { subject: "nahw" as const, items: [{ id: "soon1", kind: "soon" as const }, { id: "n1", kind: "primer" as const }] }] },
    { n: 3, lanes: [{ subject: "nahw" as const, items: [{ id: "soon2", kind: "soon" as const }] }] },
    { n: 4, lanes: [{ subject: "sarf" as const, items: [{ id: "s3", kind: "primer" as const }] }, { subject: "nahw" as const, items: [{ id: "n2", kind: "primer" as const }] }] },
  ];
  it("opens the first book of each lane after the level before", () => {
    expect(needsOn(levels, "s1")).toEqual({ d: 2, a: ["terms"] });
    expect(needsOn(levels, "n1")).toEqual({ d: 2, a: ["terms"] });
  });
  it("opens a later book of a lane after the one before it in the same lane", () => {
    expect(needsOn(levels, "s2")).toEqual({ d: 2, a: ["s1"] });
  });
  it("skips a level only in preparation and asks for every course of the last level that has some", () => {
    expect(needsOn(levels, "s3")).toEqual({ d: 4, a: ["s1", "s2", "n1"] });
    expect(needsOn(levels, "n2")).toEqual({ d: 4, a: ["s1", "s2", "n1"] });
  });
  it("leaves the first reading open and knows no book that is not on the path", () => {
    expect(needsOn(levels, "mabadi")).toEqual({ d: 1, a: [] });
    expect(needsOn(levels, "x")).toBeNull();
  });
});

// Every book a lane names that is not a course yet is shown "in preparation" by its name in madrasa.soonBooks.
describe("the books in preparation", () => {
  it("all have a name to show", () => {
    const names = t("en").madrasa.soonBooks as Record<string, { title: string }>;
    const soon = MADRASAS.flatMap((m) => m.levels.flatMap((l) => (l.lanes ?? []).flatMap((x) => x.items.filter((i) => i.kind === "soon").map((i) => i.id))));
    expect(soon.filter((id) => !names[id]?.title)).toEqual([]);
  });
});
