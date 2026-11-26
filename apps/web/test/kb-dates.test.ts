import { describe, expect, it } from "vitest";
import { shortDied } from "../src/lib/kb";

// Short dates of death (src/lib/kb.ts): English as written, Hijri/Gregorian pairs kept for scripts/calendar.js. The
// other languages get their own form once their interface dictionary exists (docs/i18n.md); until then, English.
describe("short dates of death", () => {
  it("keep the English as it is", () => {
    expect(shortDied("16 Dhū l-Qaʿda 766/4 August 1365 (TDV)")).toBe("766/1365");
    expect(shortDied("ca. 180/796")).toBe("ca. 180/796");
    expect(shortDied("ca. 686/1287")).toBe("ca. 686/1287");
  });
  it("fall back to English in a language without a dictionary yet", () => {
    expect(shortDied("672/1274", "nl")).toBe("672/1274");
  });
});
