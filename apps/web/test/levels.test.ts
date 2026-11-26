import { describe, expect, it } from "vitest";
import { levelNumber, pathLevel, subOf } from "../src/lib/course";
import { t } from "../src/i18n";

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
