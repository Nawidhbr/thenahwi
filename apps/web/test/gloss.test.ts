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

// The owner's rule on Latin letters (lib/plain-latin.ts): no marks that the page's language does not have.
import { plainLatin } from "../src/lib/plain-latin";
describe("plain Latin letters", () => {
  it("takes the transliteration marks away and makes ʿayn and hamza an apostrophe", () => {
    expect(plainLatin("ṣarf, naḥw, iʿrāb, al-Ājurrūmiyya, Qurʾān, Ḥidāya, Molla Câmî, İzzî")).toBe("sarf, nahw, i'rab, al-Ajurrumiyya, Qur'an, Hidaya, Molla Cami, Izzi");
  });
  it("keeps the letters of the page's own language and never touches Arabic", () => {
    expect(plainLatin("şart, iʿrâb", "tr")).toBe("şart, i'rab");
    expect(plainLatin("élève, ṣarf", "fr")).toBe("élève, sarf");
    expect(plainLatin("الْكَلَامُ أَوْ إِلَى ṣarf")).toBe("الْكَلَامُ أَوْ إِلَى sarf");
  });
});
