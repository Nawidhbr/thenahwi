/**
 * Exercises written by the taṣrīf engine, so every answer comes from the same rules as the tables. They join the
 * practice pool of the chapters of al-Mabādiʾ (apps/web/src/lib/practice.ts) and are answered in English.
 */

import { type Bab, type Pattern, type Person, type Verb, PERSONS, amr, ismFail, ismMaful, madi, masdar, mudari, rootOf } from "./tasrif";

export interface GeneratedExercise {
  id: string;
  prompt: string;
  arabic?: string;
  options: string[];
  answer: number;
  explanation: string;
  terms: string[];
}

/** Sound verbs of the bare form with their bāb and meaning, used for the drills. */
export const SAMPLE_VERBS: { key: string; root: string; bab: Bab; english: string }[] = [
  { key: "nasara", root: "نصر", bab: "nasara", english: "to help" },
  { key: "kataba", root: "كتب", bab: "nasara", english: "to write" },
  { key: "daraba", root: "ضرب", bab: "daraba", english: "to strike" },
  { key: "jalasa", root: "جلس", bab: "daraba", english: "to sit" },
  { key: "fataha", root: "فتح", bab: "fataha", english: "to open" },
  { key: "samia", root: "سمع", bab: "samia", english: "to hear" },
  { key: "alima", root: "علم", bab: "samia", english: "to know" },
];

/** Augmented verbs used for the maṣdar and participle drills. */
export const SAMPLE_AUGMENTED: { key: string; root: string; pattern: Pattern; english: string }[] = [
  { key: "allama", root: "علم", pattern: 2, english: "to teach" },
  { key: "qatala", root: "قتل", pattern: 3, english: "to fight" },
  { key: "akrama", root: "كرم", pattern: 4, english: "to honour" },
  { key: "taallama", root: "علم", pattern: 5, english: "to learn" },
  { key: "taqabala", root: "قبل", pattern: 6, english: "to meet one another" },
  { key: "inkasara", root: "كسر", pattern: 7, english: "to break (intransitive)" },
  { key: "ijtamaa", root: "جمع", pattern: 8, english: "to gather" },
  { key: "istaghfara", root: "غفر", pattern: 10, english: "to ask forgiveness" },
];

const label = (p: Person) => PERSONS.find((x) => x.id === p)!.english;

/** Persons whose form is unique in a tense, and three others whose forms differ from it, chosen without chance. */
function distractors(forms: Record<Person, string>, asked: Person, offset: number): Person[] {
  const others = PERSONS.map((p) => p.id).filter((p) => p !== asked && forms[p] !== forms[asked]);
  const seen = new Set<string>();
  const out: Person[] = [];
  for (let i = 0; out.length < 3 && i < others.length; i++) {
    const p = others[(i * 5 + offset) % others.length]!;
    if (seen.has(forms[p])) continue;
    seen.add(forms[p]);
    out.push(p);
  }
  return out;
}
const unique = (forms: Record<Person, string>, p: Person) => PERSONS.filter((x) => forms[x.id] === forms[p]).length === 1;
const table = (v: Verb, f: (p: Person) => string) => Object.fromEntries(PERSONS.map((p) => [p.id, f(p.id)])) as Record<Person, string>;

/** “Which person is this form?” for the past and the present of each sample verb. */
export function personExercises(): GeneratedExercise[] {
  const out: GeneratedExercise[] = [];
  const asked: Person[] = ["3mp", "3fp", "2fs", "1p", "2mp", "1s", "3fd"];
  SAMPLE_VERBS.forEach((s, i) => {
    const v: Verb = { root: rootOf(s.root), pattern: 1, bab: s.bab };
    for (const tense of ["madi", "mudari"] as const) {
      const forms = table(v, (p) => (tense === "madi" ? madi(v, p) : mudari(v, p)));
      const p = asked[(i + (tense === "mudari" ? 3 : 0)) % asked.length]!;
      if (!unique(forms, p)) continue;
      const options = [label(p), ...distractors(forms, p, i).map(label)];
      out.push({
        id: `tasrif-${tense}-${s.key}-${p}`,
        prompt: `Which person is this ${tense === "madi" ? "past" : "present"}-tense form of the verb ${s.english}?`,
        arabic: forms[p],
        options,
        answer: 0,
        explanation: `${forms[p]} is the ${tense === "madi" ? "past" : "present"} tense for “${label(p)}”.`,
        terms: [tense === "madi" ? "madi" : "mudari"],
      });
    }
  });
  return out;
}

/** “What is the imperative?” for each sample verb, with the other forms of the verb as choices. */
export function amrExercises(): GeneratedExercise[] {
  return SAMPLE_VERBS.map((s) => {
    const v: Verb = { root: rootOf(s.root), pattern: 1, bab: s.bab };
    const right = amr(v, "2ms");
    const options = [right, mudari(v, "2ms", { mood: "majzum" }), madi(v, "3ms"), mudari(v, "1s")];
    return {
      id: `tasrif-amr-${s.key}`,
      prompt: `What is the imperative, for one man, of the verb ${s.english}?`,
      arabic: `${madi(v, "3ms")} ${mudari(v, "3ms")}`,
      options,
      answer: 0,
      explanation: `From the jussive ${mudari(v, "2ms", { mood: "majzum" })} the tāʾ is dropped; the hamza in front takes ${right.startsWith("اُ") ? "a ḍamma, as the ʿayn has one" : "a kasra"}: ${right}.`,
      terms: ["amr"],
    };
  });
}

/** “What is the maṣdar / active participle / passive participle?” for the augmented sample verbs. */
export function derivedExercises(): GeneratedExercise[] {
  const out: GeneratedExercise[] = [];
  for (const s of SAMPLE_AUGMENTED) {
    const v: Verb = { root: rootOf(s.root), pattern: s.pattern };
    const m = masdar(v)!;
    const f = ismFail(v);
    const mf = ismMaful(v);
    const base = madi(v, "3ms");
    const present = mudari(v, "3ms");
    out.push({ id: `tasrif-masdar-${s.key}`, prompt: `What is the maṣdar of this verb (${s.english})?`, arabic: base, options: [m, f, mf, present], answer: 0, explanation: `Pattern ${s.pattern} has its maṣdar on a fixed pattern: ${m}.`, terms: ["masdar"] });
    out.push({ id: `tasrif-fail-${s.key}`, prompt: `What is the active participle of this verb (${s.english})?`, arabic: base, options: [f, mf, m, present], answer: 0, explanation: `A mīm with ḍamma in place of the prefix, and a kasra before the last letter: ${f}.`, terms: ["ism-fail"] });
    if (s.pattern !== 7) out.push({ id: `tasrif-maful-${s.key}`, prompt: `What is the passive participle of this verb (${s.english})?`, arabic: base, options: [mf, f, m, present], answer: 0, explanation: `Like the active participle, but with a fatḥa before the last letter: ${mf}.`, terms: ["ism-maful"] });
  }
  return out;
}

/** “Which is the present tense of this past?” across the six bāb of the bare verb. */
export function babExercises(): GeneratedExercise[] {
  return SAMPLE_VERBS.map((s) => {
    const v: Verb = { root: rootOf(s.root), pattern: 1, bab: s.bab };
    const right = mudari(v, "3ms");
    const alts = (["nasara", "daraba", "fataha"] as Bab[]).filter((b) => b !== s.bab && mudari({ ...v, bab: b }, "3ms") !== right);
    const options = [...new Set([right, ...alts.map((b) => mudari({ ...v, bab: b }, "3ms")), mudari({ ...v, bab: "karuma" }, "3ms")])].slice(0, 4);
    return {
      id: `tasrif-bab-${s.key}`,
      prompt: `Which is the present tense of this verb (${s.english}), as the Arabs use it?`,
      arabic: madi(v, "3ms"),
      options,
      answer: 0,
      explanation: `The bāb of a bare verb is learnt by hearing: ${madi(v, "3ms")} ${right}.`,
      terms: ["mujarrad"],
    };
  });
}
