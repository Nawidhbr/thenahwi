/**
 * Taṣrīf: the conjugation of the sound three-letter verb (al-ṣaḥīḥ al-sālim) in the bare form and the augmented
 * patterns II–X (except IX), with its derived nouns. Every form is built from the root letters by the rules of the
 * ṣarf books, fully vowelled, so the tables and the generated exercises never disagree.
 *
 * Out of scope, refused with a reason: weak roots (wāw, yāʾ, alif), roots with a hamza, doubled roots (second and
 * third letter the same), pattern IX, and the few pattern-VIII roots whose assimilation has several accepted forms.
 * Writing: shadda is written before the short vowel on the same letter; hamzat al-waṣl as a bare alif with its vowel.
 */

export const FATHA = "َ";
export const DAMMA = "ُ";
export const KASRA = "ِ";
export const SUKUN = "ْ";
export const SHADDA = "ّ";
export const DAMMATAN = "ٌ";

const F = FATHA, D = DAMMA, K = KASRA, S = SUKUN, SH = SHADDA, TN = DAMMATAN;

/** The fourteen forms (ṣiyagh) of a conjugated verb, in the order of the ṣarf books. */
export const PERSONS = [
  { id: "3ms", pronoun: "هُوَ", english: "he" },
  { id: "3md", pronoun: "هُمَا", english: "they two (m.)" },
  { id: "3mp", pronoun: "هُمْ", english: "they (m.)" },
  { id: "3fs", pronoun: "هِيَ", english: "she" },
  { id: "3fd", pronoun: "هُمَا", english: "they two (f.)" },
  { id: "3fp", pronoun: "هُنَّ", english: "they (f.)" },
  { id: "2ms", pronoun: "أَنْتَ", english: "you (one man)" },
  { id: "2md", pronoun: "أَنْتُمَا", english: "you two (m.)" },
  { id: "2mp", pronoun: "أَنْتُمْ", english: "you (men)" },
  { id: "2fs", pronoun: "أَنْتِ", english: "you (one woman)" },
  { id: "2fd", pronoun: "أَنْتُمَا", english: "you two (f.)" },
  { id: "2fp", pronoun: "أَنْتُنَّ", english: "you (women)" },
  { id: "1s", pronoun: "أَنَا", english: "I" },
  { id: "1p", pronoun: "نَحْنُ", english: "we" },
] as const;
export type Person = (typeof PERSONS)[number]["id"];
export const SECOND_PERSONS: Person[] = ["2ms", "2md", "2mp", "2fs", "2fd", "2fp"];

/** The six patterns (abwāb) of the bare three-letter verb, named by their model verb. */
export const BABS = {
  nasara: { past: F, present: D, model: "نَصَرَ يَنْصُرُ", english: "naṣara yanṣuru (a–u)" },
  daraba: { past: F, present: K, model: "ضَرَبَ يَضْرِبُ", english: "ḍaraba yaḍribu (a–i)" },
  fataha: { past: F, present: F, model: "فَتَحَ يَفْتَحُ", english: "fataḥa yaftaḥu (a–a)" },
  samia: { past: K, present: F, model: "سَمِعَ يَسْمَعُ", english: "samiʿa yasmaʿu (i–a)" },
  karuma: { past: D, present: D, model: "كَرُمَ يَكْرُمُ", english: "karuma yakrumu (u–u)" },
  hasiba: { past: K, present: K, model: "حَسِبَ يَحْسِبُ", english: "ḥasiba yaḥsibu (i–i)" },
} as const;
export type Bab = keyof typeof BABS;

/** The patterns: 1 is the bare verb (with its bāb); 2–10 the augmented patterns, by their usual numbers. */
export type Pattern = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 10;
export const PATTERNS: { n: Pattern; madi: string; mudari: string; masdar: string; bab: string }[] = [
  { n: 1, madi: "فَعَلَ", mudari: "يَفْعُلُ", masdar: "—", bab: "al-thulāthī al-mujarrad" },
  { n: 2, madi: "فَعَّلَ", mudari: "يُفَعِّلُ", masdar: "تَفْعِيلٌ", bab: "bāb al-tafʿīl" },
  { n: 3, madi: "فَاعَلَ", mudari: "يُفَاعِلُ", masdar: "مُفَاعَلَةٌ", bab: "bāb al-mufāʿala" },
  { n: 4, madi: "أَفْعَلَ", mudari: "يُفْعِلُ", masdar: "إِفْعَالٌ", bab: "bāb al-ifʿāl" },
  { n: 5, madi: "تَفَعَّلَ", mudari: "يَتَفَعَّلُ", masdar: "تَفَعُّلٌ", bab: "bāb al-tafaʿʿul" },
  { n: 6, madi: "تَفَاعَلَ", mudari: "يَتَفَاعَلُ", masdar: "تَفَاعُلٌ", bab: "bāb al-tafāʿul" },
  { n: 7, madi: "اِنْفَعَلَ", mudari: "يَنْفَعِلُ", masdar: "اِنْفِعَالٌ", bab: "bāb al-infiʿāl" },
  { n: 8, madi: "اِفْتَعَلَ", mudari: "يَفْتَعِلُ", masdar: "اِفْتِعَالٌ", bab: "bāb al-iftiʿāl" },
  { n: 10, madi: "اِسْتَفْعَلَ", mudari: "يَسْتَفْعِلُ", masdar: "اِسْتِفْعَالٌ", bab: "bāb al-istifʿāl" },
];

export class TasrifError extends Error {}

const WEAK = new Set(["و", "ي", "ا", "ى"]);
const HAMZA = new Set(["ء", "أ", "إ", "آ", "ؤ", "ئ"]);
const LETTERS = /^[ب-غف-ية]$/;

/** The three root letters of a word typed with or without vowels and spaces ("ن ص ر", "نَصَرَ"), checked for the sound verb. */
export function rootOf(input: string): [string, string, string] {
  const letters = [...input.normalize("NFC").replace(/[ً-ْٰـ\s\-–،,]/g, "")];
  if (letters.length !== 3) throw new TasrifError("Give three root letters, such as ن ص ر.");
  for (const l of letters) {
    if (HAMZA.has(l)) throw new TasrifError("A root with a hamza (mahmūz) has rules of its own; give a sound root.");
    if (WEAK.has(l)) throw new TasrifError("A root with wāw, yāʾ or alif is weak (muʿtall); its letters change, and it is not yet covered.");
    if (!LETTERS.test(l)) throw new TasrifError(`“${l}” is not an Arabic letter.`);
  }
  if (letters[1] === letters[2]) throw new TasrifError("A root whose second and third letters are the same is doubled (muḍāʿaf); it is not yet covered.");
  return letters as [string, string, string];
}

/** Pattern VIII: the first root letter with the infixed tāʾ, after the rules of assimilation (ibdāl). */
function eightHead(r1: string): string {
  if (r1 === "ص" || r1 === "ض") return r1 + S + "ط";
  if (r1 === "ط") return "ط" + SH;
  if (r1 === "ز") return "ز" + S + "د";
  if (r1 === "د") return "د" + SH;
  if (r1 === "ت") return "ت" + SH;
  if (r1 === "ث" || r1 === "ذ" || r1 === "ظ") throw new TasrifError("With this first letter, pattern VIII has several accepted forms (as in iddakara and idhdhakara); it is not generated.");
  return r1 + S + "ت";
}
/** In pattern VIII the head carries the vowel after the infix: with shadda the vowel sits on the merged letter. */
const eight = (r1: string, v: string) => eightHead(r1) + v;

export interface Verb {
  root: [string, string, string];
  pattern: Pattern;
  /** For the bare verb (pattern 1) only. */
  bab?: Bab;
}

function check(v: Verb) {
  if (v.pattern === 1 && !v.bab) throw new TasrifError("The bare verb needs its bāb (naṣara, ḍaraba, fataḥa, samiʿa, karuma or ḥasiba).");
  if (v.pattern === 7 && v.root[0] === "ن") throw new TasrifError("Pattern VII is not formed from a root that begins with nūn.");
  if (v.pattern === 8) eightHead(v.root[0]);
}

/** The past-tense stem up to the third root letter, which still needs its vowel or sukūn. */
function madiStem(v: Verb, passive: boolean): string {
  const [a, b, c] = v.root;
  switch (v.pattern) {
    case 1: return passive ? a + D + b + K + c : a + F + b + BABS[v.bab!].past + c;
    case 2: return passive ? a + D + b + SH + K + c : a + F + b + SH + F + c;
    case 3: return passive ? a + D + "و" + b + K + c : a + F + "ا" + b + F + c;
    case 4: return passive ? "أ" + D + a + S + b + K + c : "أ" + F + a + S + b + F + c;
    case 5: return passive ? "ت" + D + a + D + b + SH + K + c : "ت" + F + a + F + b + SH + F + c;
    case 6: return passive ? "ت" + D + a + D + "و" + b + K + c : "ت" + F + a + F + "ا" + b + F + c;
    case 7: return "ا" + K + "ن" + S + a + F + b + F + c;
    case 8: return passive ? "ا" + D + eight(a, D) + b + K + c : "ا" + K + eight(a, F) + b + F + c;
    case 10: return passive ? "ا" + D + "س" + S + "ت" + D + a + S + b + K + c : "ا" + K + "س" + S + "ت" + F + a + S + b + F + c;
  }
}

/** The present-tense stem after the prefix, with `v` as the vowel before the third root letter. */
function mudariStem(vb: Verb, v: string): string {
  const [a, b, c] = vb.root;
  switch (vb.pattern) {
    case 1: return a + S + b + v + c;
    case 2: return a + F + b + SH + v + c;
    case 3: return a + F + "ا" + b + v + c;
    case 4: return a + S + b + v + c;
    case 5: return "ت" + F + a + F + b + SH + v + c;
    case 6: return "ت" + F + a + F + "ا" + b + v + c;
    case 7: return "ن" + S + a + F + b + v + c;
    case 8: return eight(a, F) + b + v + c;
    case 10: return "س" + S + "ت" + F + a + S + b + v + c;
  }
}

/** The vowel before the last root letter in the active present: the bāb's, kasra, or fatḥa in V and VI. */
function activeVowel(v: Verb): string {
  if (v.pattern === 1) return BABS[v.bab!].present;
  return v.pattern === 5 || v.pattern === 6 ? F : K;
}

/** Whether the passive is given: not for pattern VII, nor for the bāb of karuma, whose verbs are intransitive. */
export const hasPassive = (v: Verb) => v.pattern !== 7 && !(v.pattern === 1 && v.bab === "karuma");

const MADI_END: Record<Person, string> = {
  "3ms": F, "3md": F + "ا", "3mp": D + "وا", "3fs": F + "ت" + S, "3fd": F + "ت" + F + "ا", "3fp": S + "ن" + F,
  "2ms": S + "ت" + F, "2md": S + "ت" + D + "م" + F + "ا", "2mp": S + "ت" + D + "م" + S, "2fs": S + "ت" + K, "2fd": S + "ت" + D + "م" + F + "ا", "2fp": S + "ت" + D + "ن" + SH + F,
  "1s": S + "ت" + D, "1p": S + "ن" + F + "ا",
};

/** The past tense (al-māḍī) of one person. */
export function madi(v: Verb, person: Person, passive = false): string {
  check(v);
  if (passive && !hasPassive(v)) throw new TasrifError("This verb has no passive.");
  return madiStem(v, passive) + MADI_END[person];
}

const PREFIX: Record<Person, string> = {
  "3ms": "ي", "3md": "ي", "3mp": "ي", "3fs": "ت", "3fd": "ت", "3fp": "ي", "2ms": "ت", "2md": "ت", "2mp": "ت", "2fs": "ت", "2fd": "ت", "2fp": "ت", "1s": "أ", "1p": "ن",
};
export type Mood = "marfu" | "mansub" | "majzum";
type Shape = "single" | "dual" | "plural" | "fem" | "nun";
const SHAPE: Record<Person, Shape> = {
  "3ms": "single", "3md": "dual", "3mp": "plural", "3fs": "single", "3fd": "dual", "3fp": "nun", "2ms": "single", "2md": "dual", "2mp": "plural", "2fs": "fem", "2fd": "dual", "2fp": "nun", "1s": "single", "1p": "single",
};
const MUDARI_END: Record<Mood, Record<Shape, string>> = {
  marfu: { single: D, dual: F + "ان" + K, plural: D + "ون" + F, fem: K + "ين" + F, nun: S + "ن" + F },
  mansub: { single: F, dual: F + "ا", plural: D + "وا", fem: K + "ي", nun: S + "ن" + F },
  majzum: { single: S, dual: F + "ا", plural: D + "وا", fem: K + "ي", nun: S + "ن" + F },
};

/** The present tense (al-muḍāriʿ) of one person, in rafʿ (the default), naṣb (after lan) or jazm (after lam). */
export function mudari(v: Verb, person: Person, opts: { passive?: boolean; mood?: Mood } = {}): string {
  check(v);
  const passive = Boolean(opts.passive);
  if (passive && !hasPassive(v)) throw new TasrifError("This verb has no passive.");
  const prefixVowel = passive || v.pattern === 2 || v.pattern === 3 || v.pattern === 4 ? D : F;
  const stem = passive ? mudariStem(v, F) : mudariStem(v, activeVowel(v));
  return PREFIX[person] + prefixVowel + stem + MUDARI_END[opts.mood ?? "marfu"][SHAPE[person]];
}

/** The imperative (al-amr) of a second person: the jussive without its prefix, with a hamza where the word would begin with sukūn. */
export function amr(v: Verb, person: Person): string {
  if (!SECOND_PERSONS.includes(person)) throw new TasrifError("The imperative has only the six forms of the person addressed.");
  check(v);
  const body = mudariStem(v, activeVowel(v)) + MUDARI_END.majzum[SHAPE[person]];
  if (v.pattern === 4) return "أ" + F + body;
  if (v.pattern === 1) return "ا" + (BABS[v.bab!].present === D ? D : K) + body;
  if (v.pattern === 7 || v.pattern === 8 || v.pattern === 10) return "ا" + K + body;
  return body;
}

/** The prohibition (al-nahy): lā with the jussive of a second person. */
export const nahy = (v: Verb, person: Person) => {
  if (!SECOND_PERSONS.includes(person)) throw new TasrifError("The prohibition has only the six forms of the person addressed.");
  return "ل" + F + "ا " + mudari(v, person, { mood: "majzum" });
};

/** The active participle (ism al-fāʿil), in the nominative with tanwīn. */
export function ismFail(v: Verb): string {
  check(v);
  const [a, b, c] = v.root;
  if (v.pattern === 1) return a + F + "ا" + b + K + c + TN;
  return "م" + D + mudariStem(v, K) + TN;
}

/** The passive participle (ism al-mafʿūl), in the nominative with tanwīn. */
export function ismMaful(v: Verb): string {
  check(v);
  const [a, b, c] = v.root;
  if (v.pattern === 1) return "م" + F + a + S + b + D + "و" + c + TN;
  return "م" + D + mudariStem(v, F) + TN;
}

/** The verbal noun (al-maṣdar) of an augmented pattern; the bare verb's is learnt by hearing (null). Pattern III also has fiʿāl. */
export function masdar(v: Verb): string | null {
  check(v);
  const [a, b, c] = v.root;
  switch (v.pattern) {
    case 1: return null;
    case 2: return "ت" + F + a + S + b + K + "ي" + c + TN;
    case 3: return "م" + D + a + F + "ا" + b + F + c + F + "ة" + TN;
    case 4: return "إ" + K + a + S + b + F + "ا" + c + TN;
    case 5: return "ت" + F + a + F + b + SH + D + c + TN;
    case 6: return "ت" + F + a + F + "ا" + b + D + c + TN;
    case 7: return "ا" + K + "ن" + S + a + K + b + F + "ا" + c + TN;
    case 8: return "ا" + K + eight(a, K) + b + F + "ا" + c + TN;
    case 10: return "ا" + K + "س" + S + "ت" + K + a + S + b + F + "ا" + c + TN;
  }
}

export interface Table {
  verb: Verb;
  madi: Record<Person, string>;
  madiPassive: Record<Person, string> | null;
  mudari: Record<Person, string>;
  mudariPassive: Record<Person, string> | null;
  mansub: Record<Person, string>;
  majzum: Record<Person, string>;
  amr: Partial<Record<Person, string>>;
  nahy: Partial<Record<Person, string>>;
  ismFail: string;
  ismMaful: string;
  masdar: string | null;
}

const each = (f: (p: Person) => string) => Object.fromEntries(PERSONS.map((p) => [p.id, f(p.id)])) as Record<Person, string>;

/** The whole conjugation of one verb (al-ṣarf al-kabīr), as the books set it out. */
export function conjugate(v: Verb): Table {
  check(v);
  const passive = hasPassive(v);
  return {
    verb: v,
    madi: each((p) => madi(v, p)),
    madiPassive: passive ? each((p) => madi(v, p, true)) : null,
    mudari: each((p) => mudari(v, p)),
    mudariPassive: passive ? each((p) => mudari(v, p, { passive: true })) : null,
    mansub: each((p) => mudari(v, p, { mood: "mansub" })),
    majzum: each((p) => mudari(v, p, { mood: "majzum" })),
    amr: Object.fromEntries(SECOND_PERSONS.map((p) => [p, amr(v, p)])),
    nahy: Object.fromEntries(SECOND_PERSONS.map((p) => [p, nahy(v, p)])),
    ismFail: ismFail(v),
    ismMaful: ismMaful(v),
    masdar: masdar(v),
  };
}

/** The short conjugation (al-ṣarf al-ṣaghīr) a student recites: past, present, maṣdar, participles, imperative, prohibition. */
export function short(v: Verb, masdarOfBare?: string) {
  const t = conjugate(v);
  return { madi: t.madi["3ms"], mudari: t.mudari["3ms"], masdar: t.masdar ?? masdarOfBare ?? null, ismFail: t.ismFail, ismMaful: t.ismMaful, amr: t.amr["2ms"]!, nahy: t.nahy["2ms"]! };
}
