import { describe, expect, it } from "vitest";
import { newsDateHTML } from "../src/lib/news";

describe("news dates follow each language's calendar", () => {
  it("is Gregorian in English (day first) and the other European languages, the Hijri date in the tooltip", () => {
    expect(newsDateHTML("2026-11-12", "en")).toMatch(/title="2 Jum. II 1448 AH">12 Nov 2026</);
    expect(newsDateHTML("2026-11-12", "nl")).toContain(">12 nov 2026<");
  });
  it("is the solar Hijri date in Persian", () => {
    expect(newsDateHTML("2026-11-12", "fa")).toContain(">۲۱ آبان ۱۴۰۵<");
  });
  it("is the lunar Hijri date with the Gregorian beside it in Arabic", () => {
    const h = newsDateHTML("2026-11-12", "ar");
    expect(h).toContain("جمادى الآخرة 1448");
    expect(h).toContain("(12 نوفمبر 2026)");
  });
  it("keeps a month or a year alone Gregorian", () => {
    expect(newsDateHTML("2026-04", "fa")).toContain("۲۰۲۶");
    expect(newsDateHTML("2026", "ar")).toBe('<time datetime="2026">2026</time>');
  });
});
