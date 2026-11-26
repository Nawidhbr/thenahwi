import { describe, expect, it } from "vitest";
import { getLibrary } from "@nahwi/content";
import { KB_BOOKS } from "../src/lib/kb";

// The library (packages/content/background/library.json): every work has a summary and its sources, stands apart
// from the six handbooks, and a commentary names the work it is on. Translations follow in their own pass.
const en = getLibrary();

describe("the library", () => {
  it("has a summary and a source for every work", () => {
    for (const b of en) {
      expect(b.summary.length, b.id).toBeGreaterThan(40);
      expect(b.sources.length, b.id).toBeGreaterThan(0);
    }
  });
  it("keeps the handbooks apart", () => {
    const handbooks = new Set(KB_BOOKS.map((b) => b.id));
    expect(en.filter((b) => handbooks.has(b.id))).toEqual([]);
  });
  it("names the book a commentary is on", () => {
    for (const b of en.filter((x) => x.kind === "commentary")) expect(b.on, b.id).toBeTruthy();
  });
  it("shows English in a language without its translation yet", () => {
    expect(getLibrary("nl").map((b) => b.summary)).toEqual(en.map((b) => b.summary));
  });
});
