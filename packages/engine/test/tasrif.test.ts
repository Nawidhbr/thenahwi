import { describe, expect, it } from "vitest";
import { PERSONS, TasrifError, amr, conjugate, ismFail, ismMaful, madi, masdar, mudari, nahy, rootOf, type Verb } from "../src/index";
import { amrExercises, babExercises, derivedExercises, personExercises } from "../src/exercises";

// Compare in one Unicode form: shadda and vowel may be typed in either order.
const n = (s: string) => s.normalize("NFC");
const eq = (a: string | null, b: string) => expect(n(a ?? "")).toBe(n(b));
const v = (root: string, pattern: Verb["pattern"], bab?: Verb["bab"]): Verb => ({ root: rootOf(root), pattern, bab });

const nasara = v("نصر", 1, "nasara");

describe("the bare verb: naṣara yanṣuru, as in al-Amthila", () => {
  it("conjugates the past in the fourteen persons", () => {
    const want = ["نَصَرَ", "نَصَرَا", "نَصَرُوا", "نَصَرَتْ", "نَصَرَتَا", "نَصَرْنَ", "نَصَرْتَ", "نَصَرْتُمَا", "نَصَرْتُمْ", "نَصَرْتِ", "نَصَرْتُمَا", "نَصَرْتُنَّ", "نَصَرْتُ", "نَصَرْنَا"];
    PERSONS.forEach((p, i) => eq(madi(nasara, p.id), want[i]!));
  });
  it("conjugates the present in the fourteen persons", () => {
    const want = ["يَنْصُرُ", "يَنْصُرَانِ", "يَنْصُرُونَ", "تَنْصُرُ", "تَنْصُرَانِ", "يَنْصُرْنَ", "تَنْصُرُ", "تَنْصُرَانِ", "تَنْصُرُونَ", "تَنْصُرِينَ", "تَنْصُرَانِ", "تَنْصُرْنَ", "أَنْصُرُ", "نَنْصُرُ"];
    PERSONS.forEach((p, i) => eq(mudari(nasara, p.id), want[i]!));
  });
  it("gives the passive", () => {
    eq(madi(nasara, "3ms", true), "نُصِرَ");
    eq(madi(nasara, "1s", true), "نُصِرْتُ");
    eq(mudari(nasara, "3ms", { passive: true }), "يُنْصَرُ");
    eq(mudari(nasara, "3mp", { passive: true }), "يُنْصَرُونَ");
  });
  it("puts the present into naṣb after lan and jazm after lam", () => {
    eq(mudari(nasara, "3ms", { mood: "mansub" }), "يَنْصُرَ");
    eq(mudari(nasara, "3ms", { mood: "majzum" }), "يَنْصُرْ");
    eq(mudari(nasara, "3mp", { mood: "majzum" }), "يَنْصُرُوا");
    eq(mudari(nasara, "2fs", { mood: "mansub" }), "تَنْصُرِي");
    eq(mudari(nasara, "3md", { mood: "majzum" }), "يَنْصُرَا");
    eq(mudari(nasara, "3fp", { mood: "majzum" }), "يَنْصُرْنَ");
  });
  it("makes the imperative with the hamza vowelled after the ʿayn", () => {
    const want = ["اُنْصُرْ", "اُنْصُرَا", "اُنْصُرُوا", "اُنْصُرِي", "اُنْصُرَا", "اُنْصُرْنَ"];
    (["2ms", "2md", "2mp", "2fs", "2fd", "2fp"] as const).forEach((p, i) => eq(amr(nasara, p), want[i]!));
    eq(amr(v("ضرب", 1, "daraba"), "2ms"), "اِضْرِبْ");
    eq(amr(v("فتح", 1, "fataha"), "2ms"), "اِفْتَحْ");
    eq(amr(v("سمع", 1, "samia"), "2fs"), "اِسْمَعِي");
    eq(nahy(nasara, "2ms"), "لَا تَنْصُرْ");
  });
  it("derives the participles", () => {
    eq(ismFail(nasara), "نَاصِرٌ");
    eq(ismMaful(nasara), "مَنْصُورٌ");
    expect(masdar(nasara)).toBeNull();
  });
  it("follows each bāb", () => {
    eq(madi(v("سمع", 1, "samia"), "3ms"), "سَمِعَ");
    eq(mudari(v("سمع", 1, "samia"), "3ms"), "يَسْمَعُ");
    eq(madi(v("كرم", 1, "karuma"), "3ms"), "كَرُمَ");
    eq(mudari(v("كرم", 1, "karuma"), "3ms"), "يَكْرُمُ");
    eq(mudari(v("حسب", 1, "hasiba"), "3ms"), "يَحْسِبُ");
    expect(conjugate(v("كرم", 1, "karuma")).madiPassive).toBeNull();
  });
});

describe("the augmented patterns", () => {
  const cases: [string, Verb["pattern"], string, string, string, string, string, string][] = [
    // root, pattern, past, present, maṣdar, active participle, passive participle, imperative
    ["علم", 2, "عَلَّمَ", "يُعَلِّمُ", "تَعْلِيمٌ", "مُعَلِّمٌ", "مُعَلَّمٌ", "عَلِّمْ"],
    ["قتل", 3, "قَاتَلَ", "يُقَاتِلُ", "مُقَاتَلَةٌ", "مُقَاتِلٌ", "مُقَاتَلٌ", "قَاتِلْ"],
    ["كرم", 4, "أَكْرَمَ", "يُكْرِمُ", "إِكْرَامٌ", "مُكْرِمٌ", "مُكْرَمٌ", "أَكْرِمْ"],
    ["علم", 5, "تَعَلَّمَ", "يَتَعَلَّمُ", "تَعَلُّمٌ", "مُتَعَلِّمٌ", "مُتَعَلَّمٌ", "تَعَلَّمْ"],
    ["قبل", 6, "تَقَابَلَ", "يَتَقَابَلُ", "تَقَابُلٌ", "مُتَقَابِلٌ", "مُتَقَابَلٌ", "تَقَابَلْ"],
    ["كسر", 7, "اِنْكَسَرَ", "يَنْكَسِرُ", "اِنْكِسَارٌ", "مُنْكَسِرٌ", "مُنْكَسَرٌ", "اِنْكَسِرْ"],
    ["جمع", 8, "اِجْتَمَعَ", "يَجْتَمِعُ", "اِجْتِمَاعٌ", "مُجْتَمِعٌ", "مُجْتَمَعٌ", "اِجْتَمِعْ"],
    ["غفر", 10, "اِسْتَغْفَرَ", "يَسْتَغْفِرُ", "اِسْتِغْفَارٌ", "مُسْتَغْفِرٌ", "مُسْتَغْفَرٌ", "اِسْتَغْفِرْ"],
  ];
  for (const [root, pattern, past, present, msd, fail, maful, imp] of cases) {
    it(`pattern ${pattern}: ${past}`, () => {
      const verb = v(root, pattern);
      eq(madi(verb, "3ms"), past);
      eq(mudari(verb, "3ms"), present);
      eq(masdar(verb), msd);
      eq(ismFail(verb), fail);
      eq(ismMaful(verb), maful);
      eq(amr(verb, "2ms"), imp);
    });
  }
  it("gives the passive of the augmented patterns", () => {
    eq(madi(v("كرم", 4), "3ms", true), "أُكْرِمَ");
    eq(mudari(v("كرم", 4), "3ms", { passive: true }), "يُكْرَمُ");
    eq(madi(v("قتل", 3), "3ms", true), "قُوتِلَ");
    eq(mudari(v("قتل", 3), "3ms", { passive: true }), "يُقَاتَلُ");
    eq(madi(v("غفر", 10), "3ms", true), "اُسْتُغْفِرَ");
    eq(mudari(v("غفر", 10), "3ms", { passive: true }), "يُسْتَغْفَرُ");
    eq(madi(v("علم", 2), "3ms", true), "عُلِّمَ");
    eq(madi(v("جمع", 8), "3ms", true), "اُجْتُمِعَ");
    expect(conjugate(v("كسر", 7)).madiPassive).toBeNull();
  });
  it("conjugates the augmented past and present through the persons", () => {
    eq(madi(v("علم", 2), "1p"), "عَلَّمْنَا");
    eq(mudari(v("علم", 2), "2fs"), "تُعَلِّمِينَ");
    eq(madi(v("كرم", 4), "2fp"), "أَكْرَمْتُنَّ");
    eq(mudari(v("غفر", 10), "3mp"), "يَسْتَغْفِرُونَ");
    eq(amr(v("علم", 5), "2mp"), "تَعَلَّمُوا");
  });
  it("assimilates the tāʾ of pattern VIII", () => {
    eq(madi(v("صبر", 8), "3ms"), "اِصْطَبَرَ");
    eq(madi(v("ضرب", 8), "3ms"), "اِضْطَرَبَ");
    eq(madi(v("طلع", 8), "3ms"), "اِطَّلَعَ");
    eq(mudari(v("طلع", 8), "3ms"), "يَطَّلِعُ");
    eq(masdar(v("طلع", 8)), "اِطِّلَاعٌ");
    eq(madi(v("زحم", 8), "3ms"), "اِزْدَحَمَ");
    eq(madi(v("دخر", 8), "3ms"), "اِدَّخَرَ");
    eq(madi(v("تبع", 8), "3ms"), "اِتَّبَعَ");
    eq(masdar(v("تبع", 8)), "اِتِّبَاعٌ");
    expect(() => madi(v("ذكر", 8), "3ms")).toThrow(TasrifError);
  });
});

describe("roots outside the sound verb", () => {
  it("refuses weak, hamzated and doubled roots", () => {
    expect(() => rootOf("قول")).toThrow(/weak/);
    expect(() => rootOf("رمي")).toThrow(/weak/);
    expect(() => rootOf("أكل")).toThrow(/hamza/);
    expect(() => rootOf("مدد")).toThrow(/doubled/);
    expect(() => rootOf("نص")).toThrow(/three/);
  });
  it("reads a root typed with vowels or spaces", () => {
    expect(rootOf("ن ص ر")).toEqual(["ن", "ص", "ر"]);
    expect(rootOf("نَصَرَ")).toEqual(["ن", "ص", "ر"]);
  });
});

describe("the generated exercises", () => {
  const all = [...personExercises(), ...amrExercises(), ...derivedExercises(), ...babExercises()];
  it("have unique ids in the content's id form", () => {
    expect(new Set(all.map((e) => e.id)).size).toBe(all.length);
    for (const e of all) expect(e.id).toMatch(/^[a-z0-9-]+$/);
  });
  it("offer distinct options with the answer among them", () => {
    for (const e of all) {
      expect(new Set(e.options).size, e.id).toBe(e.options.length);
      expect(e.options.length, e.id).toBeGreaterThanOrEqual(2);
      expect(e.answer).toBeLessThan(e.options.length);
    }
  });
  it("ask about persons only where the form is unique", () => {
    for (const e of personExercises()) expect(e.options.length).toBe(4);
  });
});
