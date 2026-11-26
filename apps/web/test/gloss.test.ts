import { describe, expect, it } from "vitest";
import { gloss } from "../src/lib/gloss";

// The word pop-ups (src/lib/gloss.ts): technical words are marked once per text; the phrases of a glossary's
// `ignore` list contain a pop-up form but are left unmarked.
describe("word pop-ups", () => {
  it("mark a technical word with its pop-up", () => {
    expect(gloss("The fāʿil is marfūʿ.", "en")).toContain('data-g="fail"');
  });
  it("leave a phrase of the ignore list unmarked", () => {
    // In “ism al-fāʿil” the word fāʿil names the participle, not the doer of the sentence.
    expect(gloss("The ism al-fāʿil of naṣara is nāṣir.", "en")).not.toContain('data-g="fail"');
  });
  it("mark a concept only once per text", () => {
    const html = gloss("The mubtadaʾ and again the mubtadaʾ.", "en");
    expect(html.match(/data-g="mubtada"/g)?.length).toBe(1);
  });
});
