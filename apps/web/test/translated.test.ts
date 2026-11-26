import { describe, expect, it } from "vitest";
import { isTranslated } from "../src/lib/translated";

// Until a language's translation pass is done (docs/i18n.md), its knowledge-base pages fall back to English and
// point their canonical there; English and the study portal always count as their own.
describe("which pages count as translated", () => {
  it("no scholar, article or section before its translation exists", () => {
    expect(isTranslated("nl", "/scholars/ibn-malik/")).toBe(false);
    expect(isTranslated("ar", "/nahw/what-is-nahw/")).toBe(false);
    expect(isTranslated("tr", "/books/")).toBe(false);
  });
  it("not the catalogues, the news or the updates, which are in English", () => {
    for (const path of ["/books/kafiya/catalogue/", "/news/", "/updates/"]) {
      expect(isTranslated("nl", path), path).toBe(false);
    }
  });
  it("English and the study portal always", () => {
    expect(isTranslated("en", "/books/")).toBe(true);
    expect(isTranslated("en", "/scholars/ibn-ajurrum/")).toBe(true);
    expect(isTranslated("ru", "/study/")).toBe(true);
  });
});
