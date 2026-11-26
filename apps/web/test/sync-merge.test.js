import { describe, expect, it } from "vitest";
import { cleanScores, cleanVisited, licenceOf, mergeMadrasa, mergeScores, mergeVisited } from "../src/lib/sync-merge.js";

// Merging the browser's progress with the account's copy (src/lib/sync-merge.js): nothing is ever lost.

describe("cleaning what is sent", () => {
  it("keeps valid keys with numbers, capped between 0 and 10", () => {
    expect(cleanScores({ jins: 7, "kati-2": 12, fasl: -1, "BAD KEY": 5, nau: "6", x: NaN })).toEqual({ jins: 7, "kati-2": 10, fasl: 0 });
  });
  it("sends nothing for broken storage", () => {
    expect(cleanScores(null)).toEqual({});
    expect(cleanScores([1, 2])).toEqual({});
    expect(cleanVisited("jins")).toEqual([]);
  });
  it("sends each seen step once", () => {
    expect(cleanVisited(["jins", "jins", "BAD", 3, "fasl"])).toEqual(["jins", "fasl"]);
  });
});

describe("merging what comes back", () => {
  it("takes the higher score for every key and adds the account's other keys", () => {
    const local = { jins: 7, fasl: 4 };
    const rows = [{ key: "jins", score: 5 }, { key: "fasl", score: "9.50" }, { key: "nau", score: 10 }];
    expect(mergeScores(local, rows)).toEqual({ jins: 7, fasl: 9.5, nau: 10 });
  });
  it("leaves keys the database refused as they were", () => {
    expect(mergeScores({ "OLD KEY": 6 }, [])).toEqual({ "OLD KEY": 6 });
  });
  it("ignores broken rows", () => {
    expect(mergeScores({}, [null, { key: "a" }, { score: 3 }, { key: "b", score: "x" }])).toEqual({});
  });
  it("joins the seen steps, the browser's first", () => {
    expect(mergeVisited(["a", "b"], ["b", "c"])).toEqual(["a", "b", "c"]);
    expect(mergeVisited(null, ["c"])).toEqual(["c"]);
  });
});

describe("the madrasa path", () => {
  it("keeps the browser's choice and saves it when the account differs", () => {
    expect(mergeMadrasa("indian", "ottoman")).toEqual({ local: "indian", save: true });
    expect(mergeMadrasa("indian", "indian")).toEqual({ local: "indian", save: false });
  });
  it("takes the account's choice on a new device", () => {
    expect(mergeMadrasa(null, "north-african")).toEqual({ local: "north-african", save: false });
  });
  it("ignores unknown paths", () => {
    expect(mergeMadrasa("x", "y")).toEqual({ local: null, save: false });
  });
});

describe("licences", () => {
  const now = Date.parse("2026-11-08T12:00:00Z");
  it("no licence: not paid", () => {
    expect(licenceOf([], now)).toEqual({ paid: false, until: null });
  });
  it("a running subscription: paid until its end", () => {
    expect(licenceOf([{ starts_at: "2026-11-01T00:00:00Z", ends_at: "2026-12-01T00:00:00Z" }], now)).toEqual({ paid: true, until: "2026-12-01T00:00:00Z" });
  });
  it("an ended or future licence does not count", () => {
    expect(licenceOf([{ starts_at: "2026-09-01T00:00:00Z", ends_at: "2026-10-01T00:00:00Z" }, { starts_at: "2027-01-01T00:00:00Z", ends_at: null }], now)).toEqual({ paid: false, until: null });
  });
  it("a licence without an end wins", () => {
    expect(licenceOf([{ starts_at: "2026-11-01T00:00:00Z", ends_at: "2026-12-01T00:00:00Z" }, { starts_at: "2026-11-02T00:00:00Z", ends_at: null }], now)).toEqual({ paid: true, until: null });
  });
});
