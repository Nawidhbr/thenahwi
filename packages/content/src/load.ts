import { existsSync, readdirSync, readFileSync } from "node:fs";
import { z } from "zod";
import { BackgroundArticle, TABAQA_GENERATIONS, BackgroundConcept, BackgroundPerson, CatalogueEntry, Curriculum, Reviews, CHAPTER_ORDER, Commentary, ExerciseSet, ExerciseTranslation, Glossary, LessonExplain, LessonExplainTranslation, LessonGroup, LessonPlan, LessonQuiz, Matn, LibraryBook, NewsItem, Outline, Primer, PrimerTranslation, Quiz, type Lesson, Term, TermTranslation, type LocaleBundle, TabaqatBook } from "./schema.ts";

/** Node-only loader used by the content build script. The site imports the generated bundle instead. */

const TERMS_DIR = new URL("../terms/", import.meta.url);

export interface LoadResult {
  terms: Term[];
  errors: string[];
}

/** Load and check every term file. Errors are collected, not thrown. */
export function loadTerms(): LoadResult {
  const errors: string[] = [];
  const terms: Term[] = [];
  for (const file of readdirSync(TERMS_DIR).filter((f) => f.endsWith(".json")).sort()) {
    let raw: unknown;
    try {
      raw = JSON.parse(readFileSync(new URL(file, TERMS_DIR), "utf8"));
    } catch (e) {
      errors.push(`${file}: invalid JSON (${(e as Error).message})`);
      continue;
    }
    const parsed = Term.safeParse(raw);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) errors.push(`${file}: ${issue.path.join(".") || "(root)"}: ${issue.message}`);
      continue;
    }
    if (`${parsed.data.slug}.json` !== file) errors.push(`${file}: slug "${parsed.data.slug}" must match the file name`);
    terms.push(parsed.data);
  }
  const slugs = new Set(terms.map((t) => t.slug));
  for (const t of terms) {
    for (const r of t.related) if (!slugs.has(r)) errors.push(`${t.slug}.json: related term "${r}" does not exist`);
    if (terms.some((o) => o !== t && o.chapter === t.chapter && o.order === t.order))
      errors.push(`${t.slug}.json: order ${t.order} is used twice in chapter "${t.chapter}"`);
    if (t.related.includes(t.slug)) errors.push(`${t.slug}.json: a term cannot be related to itself`);
  }
  const chapterIndex = (c: Term["chapter"]) => CHAPTER_ORDER.indexOf(c);
  terms.sort((a, b) => chapterIndex(a.chapter) - chapterIndex(b.chapter) || a.order - b.order);
  return { terms, errors };
}


const MATN_FILE = new URL("../matn/mabadi.json", import.meta.url);

/** Load and check the matn against the terms. */
export function loadMatn(terms: Term[]): { matn: Matn | null; errors: string[] } {
  const errors: string[] = [];
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(MATN_FILE, "utf8"));
  } catch (e) {
    return { matn: null, errors: [`matn/mabadi.json: ${(e as Error).message}`] };
  }
  const parsed = Matn.safeParse(raw);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) errors.push(`matn/mabadi.json: ${issue.path.join(".") || "(root)"}: ${issue.message}`);
    return { matn: null, errors };
  }
  const matn = parsed.data;
  const slugs = new Set(terms.map((t) => t.slug));
  const ids = new Set<string>();
  let count = 0;
  for (const section of matn.sections) {
    for (const seg of section.segments) {
      count++;
      if (ids.has(seg.id)) errors.push(`matn/mabadi.json: segment id "${seg.id}" is used twice`);
      ids.add(seg.id);
      for (const t of seg.terms) if (!slugs.has(t)) errors.push(`matn/mabadi.json: segment ${seg.id} links to unknown term "${t}"`);
    }
  }
  if (count > 0 && !matn.edition) errors.push("matn/mabadi.json: name the edition the Arabic is taken from before adding segments");
  return { matn, errors };
}

const EXERCISES_DIR = new URL("../exercises/", import.meta.url);

/** Load and check the hand-written exercise sets, one file per chapter. */
export function loadExercises(terms: Term[]): { sets: ExerciseSet[]; errors: string[] } {
  const errors: string[] = [];
  const sets: ExerciseSet[] = [];
  const slugs = new Set(terms.map((t) => t.slug));
  // The folder may be empty, and git keeps no empty folders: a fresh clone has none.
  if (!existsSync(EXERCISES_DIR)) return { sets, errors };
  for (const file of readdirSync(EXERCISES_DIR).filter((f) => f.endsWith(".json")).sort()) {
    let raw: unknown;
    try {
      raw = JSON.parse(readFileSync(new URL(file, EXERCISES_DIR), "utf8"));
    } catch (e) {
      errors.push(`exercises/${file}: invalid JSON (${(e as Error).message})`);
      continue;
    }
    const parsed = ExerciseSet.safeParse(raw);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) errors.push(`exercises/${file}: ${issue.path.join(".") || "(root)"}: ${issue.message}`);
      continue;
    }
    const set = parsed.data;
    if (`${set.chapter}.json` !== file) errors.push(`exercises/${file}: chapter "${set.chapter}" must match the file name`);
    const ids = new Set<string>();
    for (const item of set.items) {
      if (ids.has(item.id)) errors.push(`exercises/${file}: id "${item.id}" is used twice`);
      ids.add(item.id);
      if (item.answer >= item.options.length) errors.push(`exercises/${file}: ${item.id}: answer ${item.answer} is not one of the options`);
      if (new Set(item.options).size !== item.options.length) errors.push(`exercises/${file}: ${item.id}: options repeat`);
      for (const t of item.terms) if (!slugs.has(t)) errors.push(`exercises/${file}: ${item.id}: unknown term "${t}"`);
    }
    sets.push(set);
  }
  return { sets, errors };
}

const I18N_DIR = new URL("../i18n/", import.meta.url);

/** Languages whose matn is the Arabic itself, so no translation of it is needed. */
const MATN_IS_SOURCE = new Set(["ar"]);

/**
 * Load the translations of one language. A language is `ready` only when every term, every
 * exercise and (except for Arabic) every matn segment is translated and matches the source's
 * shape; otherwise its problems are listed and the site keeps it "in preparation".
 */
export function loadLocale(code: string, terms: Term[], matn: Matn | null, sets: ExerciseSet[]): { bundle: LocaleBundle; problems: string[]; ready: boolean } {
  const problems: string[] = [];
  const bundle: LocaleBundle = { terms: {}, matn: {}, exercises: {} };
  const dir = new URL(`${code}/`, I18N_DIR);
  const read = (path: string): unknown => {
    try {
      return JSON.parse(readFileSync(new URL(path, dir), "utf8"));
    } catch (e) {
      problems.push(`${code}/${path}: ${(e as Error).code === "ENOENT" ? "missing" : (e as Error).message}`);
      return undefined;
    }
  };
  for (const t of terms) {
    const raw = read(`terms/${t.slug}.json`);
    if (raw === undefined) continue;
    const parsed = TermTranslation.safeParse(raw);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) problems.push(`${code}/terms/${t.slug}.json: ${issue.path.join(".")}: ${issue.message}`);
      continue;
    }
    const tr = parsed.data;
    if (tr.explanation.length !== t.explanation.length) problems.push(`${code}/terms/${t.slug}.json: ${tr.explanation.length} paragraphs, source has ${t.explanation.length}`);
    if (tr.examples.length !== t.examples.length) problems.push(`${code}/terms/${t.slug}.json: ${tr.examples.length} examples, source has ${t.examples.length}`);
    bundle.terms[t.slug] = tr;
  }
  if (!MATN_IS_SOURCE.has(code) && matn) {
    const raw = read("matn.json") as Record<string, unknown> | undefined;
    if (raw) {
      for (const seg of matn.sections.flatMap((s) => s.segments)) {
        const v = raw[seg.id];
        if (typeof v !== "string" || !v.trim()) problems.push(`${code}/matn.json: segment ${seg.id} missing`);
        else bundle.matn[seg.id] = v;
      }
    }
  }
  for (const set of sets) {
    const raw = read(`exercises/${set.chapter}.json`);
    if (raw === undefined) continue;
    const parsed = ExerciseTranslation.safeParse(raw);
    if (!parsed.success) {
      problems.push(`${code}/exercises/${set.chapter}.json: ${parsed.error.issues[0]?.message}`);
      continue;
    }
    for (const item of set.items) {
      const tr = parsed.data.items[item.id];
      if (!tr) problems.push(`${code}/exercises/${set.chapter}.json: ${item.id} missing`);
      else if (tr.options.length !== item.options.length) problems.push(`${code}/exercises/${set.chapter}.json: ${item.id} has ${tr.options.length} options, source has ${item.options.length}`);
    }
    bundle.exercises[set.chapter] = parsed.data.items;
  }
  // Questions the engine writes (propositions, syllogism): translated when present; the site falls back to English per question.
  for (const chapter of ["propositions", "syllogism"]) {
    try {
      const parsed = ExerciseTranslation.safeParse(JSON.parse(readFileSync(new URL(`exercises/${chapter}.json`, dir), "utf8")));
      if (parsed.success) bundle.exercises[chapter] = parsed.data.items;
    } catch {}
  }
  return { bundle, problems, ready: problems.length === 0 };
}

/** Site languages besides English, in menu order. */
export const TRANSLATION_LOCALES = ["nl", "ar", "ur", "fa", "tr", "id", "ru", "fr"] as const;

/**
 * The word explanations of one language. A missing file is an empty glossary.
 * Errors (bad shape, duplicate ids or forms, unknown term) fail the build;
 * forms that never occur in that language's text are only reported.
 */
export function loadGlossary(code: string, terms: Term[], texts: string[]): { glossary: Glossary; errors: string[]; unused: string[] } {
  const file = new URL(`../glossary/${code}.json`, import.meta.url);
  if (!existsSync(file)) return { glossary: { entries: [] }, errors: [], unused: [] };
  const errors: string[] = [];
  let parsed: Glossary;
  try {
    const result = Glossary.safeParse(JSON.parse(readFileSync(file, "utf8")));
    if (!result.success) return { glossary: { entries: [] }, errors: result.error.issues.map((i) => `glossary/${code}.json ${i.path.join(".")}: ${i.message}`), unused: [] };
    parsed = result.data;
  } catch (e) {
    return { glossary: { entries: [] }, errors: [`glossary/${code}.json: ${(e as Error).message}`], unused: [] };
  }
  const slugs = new Set(terms.map((t) => t.slug));
  const ids = new Set<string>();
  const forms = new Map<string, string>();
  const fold = (s: string) => s.normalize("NFC").toLocaleLowerCase(code).replace(/[\u064B-\u065F\u0670]/g, "");
  for (const e of parsed.entries) {
    if (ids.has(e.id)) errors.push(`glossary/${code}.json: duplicate id "${e.id}"`);
    ids.add(e.id);
    if (e.term && !slugs.has(e.term)) errors.push(`glossary/${code}.json ${e.id}: unknown term "${e.term}"`);
    for (const f of e.forms) {
      const k = fold(f);
      if (forms.has(k) && forms.get(k) !== e.id) errors.push(`glossary/${code}.json: form "${f}" is in both ${forms.get(k)} and ${e.id}`);
      forms.set(k, e.id);
    }
  }
  const haystack = fold(texts.join("\n"));
  const unused = parsed.entries.filter((e) => !e.forms.some((f) => haystack.includes(fold(f)))).map((e) => e.id);
  return { glossary: parsed, errors, unused };
}

/** The per-term tests. A term without a test is reported (missing), not an error, while tests are being written. */
export function loadQuizzes(terms: Term[]): { quizzes: Quiz[]; errors: string[]; missing: string[] } {
  const dir = new URL("../quizzes/", import.meta.url);
  const errors: string[] = [];
  const quizzes: Quiz[] = [];
  const slugs = new Set(terms.map((t) => t.slug));
  const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".json")) : [];
  const ids = new Set<string>();
  for (const f of files) {
    const name = `quizzes/${f}`;
    let raw: unknown;
    try { raw = JSON.parse(readFileSync(new URL(f, dir), "utf8")); } catch (e) { errors.push(`${name}: ${(e as Error).message}`); continue; }
    const r = Quiz.safeParse(raw);
    if (!r.success) { errors.push(...r.error.issues.map((i) => `${name} ${i.path.join(".")}: ${i.message}`)); continue; }
    const q = r.data;
    if (`${q.term}.json` !== f) errors.push(`${name}: term "${q.term}" does not match the file name`);
    if (!slugs.has(q.term)) errors.push(`${name}: unknown term "${q.term}"`);
    for (const it of q.items) {
      if (ids.has(it.id)) errors.push(`${name}: duplicate id "${it.id}"`);
      ids.add(it.id);
      if (it.answer >= it.options.length) errors.push(`${name} ${it.id}: answer ${it.answer} out of range`);
      if (new Set(it.options).size !== it.options.length) errors.push(`${name} ${it.id}: duplicate options`);
      for (const t of it.terms) if (!slugs.has(t)) errors.push(`${name} ${it.id}: unknown term "${t}"`);
    }
    quizzes.push(q);
  }
  const have = new Set(quizzes.map((q) => q.term));
  const order = new Map(terms.map((t, i) => [t.slug, i]));
  quizzes.sort((a, b) => (order.get(a.term) ?? 0) - (order.get(b.term) ?? 0));
  return { quizzes, errors, missing: terms.filter((t) => !have.has(t.slug)).map((t) => t.slug) };
}

/** Translated tests of one language: id → prompt/options/explanation. Missing items fall back to English (reported). */
export function loadQuizTranslations(code: string, quizzes: Quiz[]): { items: Record<string, { prompt: string; options: string[]; explanation: string }>; missing: number; errors: string[] } {
  const dir = new URL(`../i18n/${code}/quizzes/`, import.meta.url);
  const items: Record<string, { prompt: string; options: string[]; explanation: string }> = {};
  const errors: string[] = [];
  const source = new Map(quizzes.flatMap((q) => q.items.map((i) => [i.id, i] as const)));
  if (existsSync(dir)) {
    for (const f of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
      let raw: unknown;
      try { raw = JSON.parse(readFileSync(new URL(f, dir), "utf8")); } catch (e) { errors.push(`i18n/${code}/quizzes/${f}: ${(e as Error).message}`); continue; }
      const r = ExerciseTranslation.safeParse(raw);
      if (!r.success) { errors.push(`i18n/${code}/quizzes/${f}: ${r.error.issues[0]?.message}`); continue; }
      for (const [id, it] of Object.entries(r.data.items)) {
        const src = source.get(id);
        if (!src) { errors.push(`i18n/${code}/quizzes/${f}: unknown id "${id}"`); continue; }
        if (src.options.length !== it.options.length) { errors.push(`i18n/${code}/quizzes/${f} ${id}: ${it.options.length} options, source has ${src.options.length}`); continue; }
        items[id] = it;
      }
    }
  }
  return { items, missing: source.size - Object.keys(items).length, errors };
}

/** The commentaries (commentaries/<id>/text.json) with their translations (commentaries/<id>/<code>.json). */
export function loadCommentaries(matn: Matn | null): { commentaries: Commentary[]; errors: string[]; notes: string[] } {
  const root = new URL("../commentaries/", import.meta.url);
  const errors: string[] = [];
  const notes: string[] = [];
  const out: Commentary[] = [];
  if (!existsSync(root)) return { commentaries: out, errors, notes };
  const segIds = new Set(matn?.sections.flatMap((s) => s.segments.map((x) => x.id)) ?? []);
  for (const id of readdirSync(root)) {
    const dir = new URL(`${id}/`, root);
    const textFile = new URL("text.json", dir);
    if (!existsSync(textFile)) continue;
    let raw: unknown;
    try { raw = JSON.parse(readFileSync(textFile, "utf8")); } catch (e) { errors.push(`commentaries/${id}/text.json: ${(e as Error).message}`); continue; }
    const r = Commentary.safeParse(raw);
    if (!r.success) { errors.push(...r.error.issues.slice(0, 10).map((i) => `commentaries/${id}/text.json ${i.path.join(".")}: ${i.message}`)); continue; }
    const c = r.data;
    const ids = new Set<string>();
    for (const b of c.blocks) {
      if (ids.has(b.id)) errors.push(`commentaries/${id}: duplicate block id "${b.id}"`);
      ids.add(b.id);
      for (const m of b.matn) if (!segIds.has(m)) errors.push(`commentaries/${id} ${b.id}: unknown matn segment "${m}"`);
    }
    const translations: Record<string, Record<string, string>> = {};
    for (const f of readdirSync(dir).filter((f) => f.endsWith(".json") && f !== "text.json" && f !== "lessons.json" && f !== "outline.json")) {
      const code = f.replace(/\.json$/, "");
      try {
        const t = JSON.parse(readFileSync(new URL(f, dir), "utf8")) as Record<string, string>;
        for (const k of Object.keys(t)) if (!ids.has(k)) errors.push(`commentaries/${id}/${f}: unknown block "${k}"`);
        translations[code] = t;
        const missing = c.blocks.filter((b) => !t[b.id]).length;
        if (missing) notes.push(`commentary ${id} ${code}: ${missing} of ${c.blocks.length} blocks not translated yet`);
      } catch (e) { errors.push(`commentaries/${id}/${f}: ${(e as Error).message}`); }
    }
    // Level 2: the lessons of this commentary's track, following the shared lesson groups.
    const lessons: Lesson[] = [];
    const planFile = new URL("lessons.json", dir);
    if (c.track && existsSync(planFile)) {
      // A standalone text: its own lesson plan.
      const plan = LessonPlan.safeParse(JSON.parse(readFileSync(planFile, "utf8")));
      if (!plan.success) errors.push(...plan.error.issues.slice(0, 10).map((i) => `commentaries/${id}/lessons.json ${i.path.join(".")}: ${i.message}`));
      else {
        const seen = new Set<string>();
        for (const l of plan.data) {
          for (const b of l.blocks) {
            if (!ids.has(b)) errors.push(`commentaries/${id}/lessons.json lesson ${l.n}: unknown block "${b}"`);
            if (seen.has(b)) errors.push(`commentaries/${id}/lessons.json lesson ${l.n}: block "${b}" is in two lessons`);
            seen.add(b);
          }
          lessons.push({ id: `${c.id}-${l.n}`, n: l.n, matn: [], blocks: l.blocks, title: l.title });
        }
        const left = c.blocks.filter((b) => !seen.has(b.id)).length;
        if (left) notes.push(`commentaries/${id}: ${left} blocks are in no lesson`);
      }
    }
    if (c.track && !existsSync(planFile)) {
      const groupsFile = new URL("../lessons.json", import.meta.url);
      const groups = z.array(LessonGroup).parse(JSON.parse(readFileSync(groupsFile, "utf8")));
      const groupOf = new Map(groups.flatMap((g) => g.matn.map((m) => [m, g.n] as const)));
      let pending: string[] = [];
      for (const g of groups) {
        const blocks = c.blocks.filter((b) => b.matn.length > 0 && groupOf.get(b.matn[0]) === g.n).map((b) => b.id);
        if (!blocks.length) continue;
        lessons.push({ id: `${c.id}-${g.n}`, n: g.n, matn: g.matn, blocks: [...pending, ...blocks] });
        pending = [];
      }
      // Blocks before any matn (the commentator's own opening) go with the first lesson.
      const placed = new Set(lessons.flatMap((l) => l.blocks));
      const opening = c.blocks.filter((b) => b.matn.length === 0 && !placed.has(b.id)).map((b) => b.id);
      if (lessons[0]) lessons[0].blocks = [...opening, ...lessons[0].blocks];
    }
    if (c.track) {
      const qdir = new URL("quizzes/", dir);
      if (existsSync(qdir)) {
        for (const f of readdirSync(qdir).filter((f) => f.endsWith(".json"))) {
          const name = `commentaries/${id}/quizzes/${f}`;
          let qraw: unknown;
          try { qraw = JSON.parse(readFileSync(new URL(f, qdir), "utf8")); } catch (e) { errors.push(`${name}: ${(e as Error).message}`); continue; }
          const q = LessonQuiz.safeParse(qraw);
          if (!q.success) { errors.push(...q.error.issues.map((i) => `${name} ${i.path.join(".")}: ${i.message}`)); continue; }
          const lesson = lessons.find((l) => l.id === q.data.lesson);
          if (!lesson || `${lesson.n}.json` !== f) { errors.push(`${name}: lesson "${q.data.lesson}" does not match a lesson of this track or the file name`); continue; }
          for (const it of q.data.items) {
            if (it.answer >= it.options.length) errors.push(`${name} ${it.id}: answer out of range`);
            if (!it.id.startsWith(`${lesson.id}-`)) errors.push(`${name} ${it.id}: item ids start with "${lesson.id}-"`);
          }
          lesson.quiz = q.data;
        }
      }
      // Our explanation of each lesson (explain/<n>.json), with its translations (i18n/<code>/commentaries/<id>/explain/).
      const edir = new URL("explain/", dir);
      if (existsSync(edir)) {
        for (const f of readdirSync(edir).filter((f) => f.endsWith(".json"))) {
          const name = `commentaries/${id}/explain/${f}`;
          const lesson = lessons.find((l) => `${l.n}.json` === f);
          if (!lesson) { errors.push(`${name}: no lesson ${f.replace(".json", "")} in this track`); continue; }
          let eraw: unknown;
          try { eraw = JSON.parse(readFileSync(new URL(f, edir), "utf8")); } catch (e) { errors.push(`${name}: ${(e as Error).message}`); continue; }
          const r = LessonExplain.safeParse(eraw);
          if (!r.success) { errors.push(...r.error.issues.map((i) => `${name} ${i.path.join(".")}: ${i.message}`)); continue; }
          lesson.explain = r.data;
          lesson.explainTranslations = {};
          for (const code of TRANSLATION_LOCALES) {
            const tf = new URL(`../i18n/${code}/commentaries/${id}/explain/${f}`, import.meta.url);
            if (!existsSync(tf)) continue;
            const tname = `i18n/${code}/commentaries/${id}/explain/${f}`;
            let traw: unknown;
            try { traw = JSON.parse(readFileSync(tf, "utf8")); } catch (e) { errors.push(`${tname}: ${(e as Error).message}`); continue; }
            const t = LessonExplainTranslation.safeParse(traw);
            if (!t.success) { errors.push(`${tname}: ${t.error.issues[0]?.message}`); continue; }
            const bad = (k: "body" | "examples" | "terms") => t.data[k] && t.data[k]!.length !== r.data[k].length;
            if (bad("body") || bad("examples") || bad("terms")) { errors.push(`${tname}: lists must match the English in length`); continue; }
            lesson.explainTranslations[code] = t.data;
          }
        }
      }
      const noExplain = lessons.filter((l) => !l.explain).length;
      if (noExplain) notes.push(`track ${c.track} (${id}): ${noExplain} of ${lessons.length} lessons have no explanation yet`);
      const noTest = lessons.filter((l) => !l.quiz).length;
      if (noTest) notes.push(`track ${c.track} (${id}): ${noTest} of ${lessons.length} lessons have no test yet`);
    }
    // Translated lesson tests: i18n/<code>/commentaries/<id>/quizzes/<n>.json.
    const quizTranslations: Commentary["quizTranslations"] = {};
    const source = new Map(lessons.flatMap((l) => (l.quiz?.items ?? []).map((i) => [i.id, i] as const)));
    for (const code of TRANSLATION_LOCALES) {
      const tdir = new URL(`../i18n/${code}/commentaries/${id}/quizzes/`, import.meta.url);
      const items: Record<string, { prompt: string; options: string[]; explanation: string }> = {};
      if (existsSync(tdir)) {
        for (const f of readdirSync(tdir).filter((f) => f.endsWith(".json"))) {
          const name = `i18n/${code}/commentaries/${id}/quizzes/${f}`;
          let traw: unknown;
          try { traw = JSON.parse(readFileSync(new URL(f, tdir), "utf8")); } catch (e) { errors.push(`${name}: ${(e as Error).message}`); continue; }
          const r = ExerciseTranslation.safeParse(traw);
          if (!r.success) { errors.push(`${name}: ${r.error.issues[0]?.message}`); continue; }
          for (const [qid, it] of Object.entries(r.data.items)) {
            const src = source.get(qid);
            if (!src) { errors.push(`${name}: unknown id "${qid}"`); continue; }
            if (src.options.length !== it.options.length) { errors.push(`${name} ${qid}: ${it.options.length} options, source has ${src.options.length}`); continue; }
            items[qid] = it;
          }
        }
      }
      quizTranslations[code] = items;
      const missing = source.size - Object.keys(items).length;
      if (missing && source.size) notes.push(`track tests ${id} ${code}: ${missing} questions not translated yet`);
    }
    // A standalone text's own parts: every lesson in exactly one part, in book order.
    let outline: Outline | undefined;
    const outlineFile = new URL("outline.json", dir);
    if (existsSync(outlineFile)) {
      const o = Outline.safeParse(JSON.parse(readFileSync(outlineFile, "utf8")));
      if (!o.success) errors.push(...o.error.issues.slice(0, 10).map((i) => `commentaries/${id}/outline.json ${i.path.join(".")}: ${i.message}`));
      else {
        const order = o.data.flatMap((p) => p.lessons);
        const want = lessons.map((l) => l.n);
        if (order.join() !== want.join()) errors.push(`commentaries/${id}/outline.json: the parts must hold every lesson once, in order (${want.join(",")})`);
        for (const p of o.data) if (!p.title.en) errors.push(`commentaries/${id}/outline.json part ${p.tile}: no English title`);
        outline = o.data;
      }
    }
    out.push({ ...c, translations, lessons, quizTranslations, ...(outline ? { outline } : {}) });
  }
  return { commentaries: out, errors, notes };
}

/** The background section: people and articles (background/), with translations (i18n/<code>/background/{people,articles}/<slug>.json). */
export function loadBackground(codes: readonly string[]): { background: { people: BackgroundPerson[]; articles: BackgroundArticle[]; concepts: BackgroundConcept[]; translations: Record<string, { people: Record<string, unknown>; articles: Record<string, unknown>; concepts: Record<string, unknown> }> }; errors: string[]; notes: string[] } {
  const errors: string[] = [];
  const notes: string[] = [];
  const read = <T>(dir: URL, schema: { safeParse: (x: unknown) => { success: boolean; data?: T; error?: { issues: { path: (string | number)[]; message: string }[] } } }, label: string): T[] => {
    if (!existsSync(dir)) return [];
    const out: T[] = [];
    for (const f of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
      try {
        const r = schema.safeParse(JSON.parse(readFileSync(new URL(f, dir), "utf8")));
        if (!r.success) errors.push(...(r.error?.issues ?? []).slice(0, 5).map((i) => `${label}/${f} ${i.path.join(".")}: ${i.message}`));
        else out.push(r.data as T);
      } catch (e) { errors.push(`${label}/${f}: ${(e as Error).message}`); }
    }
    return out;
  };
  const people = read<BackgroundPerson>(new URL("../background/people/", import.meta.url), BackgroundPerson, "background/people");
  const articles = read<BackgroundArticle>(new URL("../background/articles/", import.meta.url), BackgroundArticle, "background/articles").sort((a, b) => a.order - b.order);
  const concepts = read<BackgroundConcept>(new URL("../background/concepts/", import.meta.url), BackgroundConcept, "background/concepts");
  const conceptSlugs = new Set(concepts.map((c) => c.slug));
  for (const c of concepts) for (const r of c.related) if (!conceptSlugs.has(r)) errors.push(`background/concepts/${c.slug}: related "${r}" has no page`);
  const slugs = new Set(people.map((p) => p.slug));
  // The backbone of the generations page: al-Zubaydī's generation must exist in its list, and the list fit the school;
  // the grammarians of Basra and Kufa are all in his book, so each of them has his place there.
  for (const p of people) {
    if (p.tabaqa) {
      const list = TABAQA_GENERATIONS[p.tabaqa.list];
      if (p.tabaqa.n > list.generations) errors.push(`background/people/${p.slug}: al-Zubaydī's list ${p.tabaqa.list} has ${list.generations} generations, not ${p.tabaqa.n}`);
      if (!p.school) errors.push(`background/people/${p.slug}: a scholar with a ṭabaqa needs a school`);
      else if (!list.schools.includes(p.school)) errors.push(`background/people/${p.slug}: the list ${p.tabaqa.list} does not fit the school ${p.school}`);
    }
    if ((p.school === "basra" || p.school === "kufa") && !p.tabaqa) errors.push(`background/people/${p.slug}: a scholar of ${p.school} needs his ṭabaqa in al-Zubaydī`);
    if (!p.school) notes.push(`background: ${p.slug} has no school, so the generations page lists him apart`);
  }
  for (const p of people) {
    for (const w of p.works) if (w.on && !["mabadi", "kafiya", "shafiya", "izzi", "alfiyya", "ajurrumiyya", "qatr", "nahw"].includes(w.on) && !slugs.has(w.on)) notes.push(`background: ${p.slug} has a work on "${w.on}", who has no page yet`);
  }
  for (const a of articles) for (const s of a.people) if (!slugs.has(s)) notes.push(`background: article ${a.slug} names "${s}", who has no page yet`);
  const translations: Record<string, { people: Record<string, unknown>; articles: Record<string, unknown>; concepts: Record<string, unknown> }> = {};
  for (const code of codes) {
    const t = { people: {} as Record<string, unknown>, articles: {} as Record<string, unknown>, concepts: {} as Record<string, unknown> };
    for (const kind of ["people", "articles", "concepts"] as const) {
      const dir = new URL(`../i18n/${code}/background/${kind}/`, import.meta.url);
      if (!existsSync(dir)) continue;
      for (const f of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
        try { t[kind][f.replace(/\.json$/, "")] = JSON.parse(readFileSync(new URL(f, dir), "utf8")); } catch (e) { errors.push(`i18n/${code}/background/${kind}/${f}: ${(e as Error).message}`); }
      }
    }
    translations[code] = t;
  }
  return { background: { people, articles, concepts: concepts.sort((a, b) => a.slug.localeCompare(b.slug)), translations }, errors, notes };
}

/** The catalogue of works on the Īsāghūjī (background/catalogue.json): ids unique, "on" pointing at the matn or another entry. */
export function loadCatalogue(peopleSlugs: Set<string>): { catalogue: Record<string, CatalogueEntry[]>; errors: string[]; notes: string[] } {
  // One file per book: catalogue.json for the Īsāghūjī, catalogue-<book>.json for the others.
  const dir = new URL("../background/", import.meta.url);
  const errors: string[] = [];
  const notes: string[] = [];
  const catalogue: Record<string, CatalogueEntry[]> = {};
  if (!existsSync(dir)) return { catalogue, errors, notes };
  for (const f of readdirSync(dir).filter((f) => /^catalogue(-[a-z0-9-]+)?\.json$/.test(f))) {
    const book = f === "catalogue.json" ? "mabadi" : f.slice("catalogue-".length, -".json".length);
    let raw: unknown;
    try { raw = JSON.parse(readFileSync(new URL(f, dir), "utf8")); } catch (e) { errors.push(`background/${f}: ${(e as Error).message}`); continue; }
    const r = z.array(CatalogueEntry).safeParse(raw);
    if (!r.success) { errors.push(...r.error.issues.slice(0, 10).map((i) => `background/${f} ${i.path.join(".")}: ${i.message}`)); continue; }
    const ids = new Set<string>();
    for (const e of r.data) {
      if (ids.has(e.id)) errors.push(`background/${f}: duplicate id "${e.id}"`);
      ids.add(e.id);
    }
    for (const e of r.data) {
      if (e.on !== book && e.on !== "unknown" && !ids.has(e.on)) notes.push(`catalogue ${book}: ${e.id} is on "${e.on}", which is not in the catalogue`);
      if (e.person && !peopleSlugs.has(e.person)) errors.push(`catalogue ${book}: ${e.id} names person "${e.person}", who has no page`);
    }
    catalogue[book] = r.data;
  }
  return { catalogue, errors, notes };
}

/** The library (background/library.json): ids unique and apart from the handbooks; an author page that does not exist is dropped with a note. Sorted by century, then author. */
export function loadLibrary(slugs: Set<string>, handbooks: readonly string[]): { library: LibraryBook[]; errors: string[]; notes: string[] } {
  const f = new URL("../background/library.json", import.meta.url);
  if (!existsSync(f)) return { library: [], errors: [], notes: [] };
  const r = z.array(LibraryBook).safeParse(JSON.parse(readFileSync(f, "utf8")));
  if (!r.success) return { library: [], errors: r.error.issues.slice(0, 10).map((i) => `background/library.json ${i.path.join(".")}: ${i.message}`), notes: [] };
  const errors: string[] = [];
  const notes: string[] = [];
  const ids = new Set<string>();
  for (const b of r.data) {
    if (ids.has(b.id)) errors.push(`background/library.json: duplicate id "${b.id}"`);
    if (handbooks.includes(b.id)) errors.push(`background/library.json: "${b.id}" is one of the handbooks`);
    ids.add(b.id);
    if (b.authorSlug && !slugs.has(b.authorSlug)) {
      notes.push(`library: ${b.id} names author page "${b.authorSlug}", which does not exist`);
      delete b.authorSlug;
    }
  }
  const library = [...r.data].sort((a, b) => a.century - b.century || a.author.localeCompare(b.author) || a.title.localeCompare(b.title));
  return { library, errors, notes };
}

/**
 * Translations of the library (i18n/<code>/background/library.json): per book id its summary and, where the English
 * has words of its own in it, its title (and full title). Ids must be books of the library; a language counts as
 * translated for a book only when that book has a summary here (lib/translated.ts on the site).
 */
export function loadLibraryTranslations(library: LibraryBook[], codes: readonly string[]): { translations: Record<string, Record<string, { title?: string; fullTitle?: string; summary: string }>>; errors: string[] } {
  const ids = new Set(library.map((b) => b.id));
  const Entry = z.object({ title: z.string().min(1).optional(), fullTitle: z.string().min(1).optional(), summary: z.string().min(1) }).strict();
  const translations: Record<string, Record<string, { title?: string; fullTitle?: string; summary: string }>> = {};
  const errors: string[] = [];
  for (const code of codes) {
    const f = new URL(`../i18n/${code}/background/library.json`, import.meta.url);
    if (!existsSync(f)) continue;
    let raw: unknown;
    try { raw = JSON.parse(readFileSync(f, "utf8")); } catch (e) { errors.push(`i18n/${code}/background/library.json: ${(e as Error).message}`); continue; }
    const r = z.record(z.string(), Entry).safeParse(raw);
    if (!r.success) { errors.push(...r.error.issues.slice(0, 10).map((i) => `i18n/${code}/background/library.json ${i.path.join(".")}: ${i.message}`)); continue; }
    for (const id of Object.keys(r.data)) if (!ids.has(id)) errors.push(`i18n/${code}/background/library.json: "${id}" is not a book of the library`);
    translations[code] = r.data;
  }
  return { translations, errors };
}

/** The news of the knowledge base (background/news.json), newest first; ids unique. */
export function loadNews(): { news: NewsItem[]; errors: string[] } {
  const f = new URL("../background/news.json", import.meta.url);
  if (!existsSync(f)) return { news: [], errors: [] };
  const raw = JSON.parse(readFileSync(f, "utf8"));
  // { items: [...] } (the shape Keystatic edits), or a bare list.
  const r = z.array(NewsItem).safeParse(Array.isArray(raw) ? raw : raw.items);
  if (!r.success) return { news: [], errors: r.error.issues.slice(0, 10).map((i) => `background/news.json ${i.path.join(".")}: ${i.message}`) };
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const n of r.data) {
    if (ids.has(n.id)) errors.push(`background/news.json: duplicate id "${n.id}"`);
    ids.add(n.id);
  }
  return { news: [...r.data].sort((a, b) => b.date.localeCompare(a.date)), errors };
}

/** The primer courses (primers/<id>.json), by madrasa and reading order; lesson numbers run on through a book and quiz ids match their lesson. */
export function loadPrimers(): { primers: Primer[]; errors: string[] } {
  const dir = new URL("../primers/", import.meta.url);
  if (!existsSync(dir)) return { primers: [], errors: [] };
  const primers: Primer[] = [];
  const errors: string[] = [];
  for (const f of readdirSync(dir).filter((x) => x.endsWith(".json")).sort()) {
    const r = Primer.safeParse(JSON.parse(readFileSync(new URL(f, dir), "utf8")));
    if (!r.success) { errors.push(...r.error.issues.slice(0, 10).map((i) => `primers/${f} ${i.path.join(".")}: ${i.message}`)); continue; }
    const p = r.data;
    if (`${p.id}.json` !== f) errors.push(`primers/${f}: id ${p.id} does not match the file name`);
    const lessons = p.parts.flatMap((x) => x.lessons);
    lessons.forEach((l, i) => {
      if (l.n !== i + 1) errors.push(`primers/${f}: lesson ${l.n} should be ${i + 1} (lessons are numbered through the book)`);
      l.quiz.forEach((q, k) => {
        if (q.id !== `${p.id}-${l.n}-${k + 1}`) errors.push(`primers/${f}: quiz id ${q.id} should be ${p.id}-${l.n}-${k + 1}`);
        if (q.answer >= q.options.length) errors.push(`primers/${f}: ${q.id} answer out of range`);
      });
    });
    primers.push(p);
  }
  primers.sort((a, b) => a.madrasa.localeCompare(b.madrasa) || a.order - b.order);
  return { primers, errors };
}

/** The primer courses in the other site languages (i18n/<code>/primers/<id>.json), checked against the English. */
export function loadPrimerTranslations(primers: Primer[]): { translations: Record<string, Record<string, PrimerTranslation>>; errors: string[]; notes: string[] } {
  const translations: Record<string, Record<string, PrimerTranslation>> = {};
  const errors: string[] = [];
  const notes: string[] = [];
  for (const code of TRANSLATION_LOCALES) {
    const dir = new URL(`../i18n/${code}/primers/`, import.meta.url);
    translations[code] = {};
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir).filter((x) => x.endsWith(".json")).sort()) {
      const name = `i18n/${code}/primers/${f}`;
      const p = primers.find((x) => `${x.id}.json` === f);
      if (!p) { errors.push(`${name}: no primer ${f.replace(/\.json$/, "")}`); continue; }
      let raw: unknown;
      try { raw = JSON.parse(readFileSync(new URL(f, dir), "utf8")); } catch (e) { errors.push(`${name}: ${(e as Error).message}`); continue; }
      const r = PrimerTranslation.safeParse(raw);
      if (!r.success) { errors.push(...r.error.issues.slice(0, 5).map((i) => `${name} ${i.path.join(".")}: ${i.message}`)); continue; }
      const t = r.data;
      for (const id of Object.keys(t.parts)) if (!p.parts.some((x) => x.id === id)) errors.push(`${name}: unknown part "${id}"`);
      const lessons = p.parts.flatMap((x) => x.lessons);
      let quizBehind = 0;
      for (const [n, tl] of Object.entries(t.lessons)) {
        const l = lessons.find((x) => String(x.n) === n);
        if (!l) { errors.push(`${name}: unknown lesson ${n}`); continue; }
        const same = (what: string, a?: unknown[], b?: unknown[]) => { if (a && b && a.length !== b.length) errors.push(`${name} lesson ${n}: ${a.length} ${what}, the English has ${b.length}`); };
        same("terms", tl.terms, l.terms);
        same("examples", tl.examples, l.examples);
        same("passage translations", tl.text, l.text);
        // Test questions are translated in order and may lag behind the English (new ones are written in English first;
        // a test outside English asks only the translated ones, ownItems in index.ts), but never run ahead of it.
        if (tl.quiz && tl.quiz.length > l.quiz.length) errors.push(`${name} lesson ${n}: ${tl.quiz.length} test questions, the English has ${l.quiz.length}`);
        else if (tl.quiz && tl.quiz.length < l.quiz.length) quizBehind++;
        tl.quiz?.forEach((q, k) => { if (l.quiz[k] && q.options.length !== l.quiz[k].options.length) errors.push(`${name} lesson ${n} question ${k + 1}: ${q.options.length} options, the English has ${l.quiz[k].options.length}`); });
      }
      const missing = lessons.filter((l) => !t.lessons[String(l.n)]).length;
      if (missing) notes.push(`${name}: ${missing} of ${lessons.length} lessons not translated yet (shown in English)`);
      if (quizBehind) notes.push(`${name}: ${quizBehind} lesson test${quizBehind === 1 ? "" : "s"} with new English questions not translated yet`);
      translations[code][p.id] = t;
    }
  }
  return { translations, errors, notes };
}

/** The madrasa paths (curriculum.json): every book named must exist, and every course must stand on some path. */
export function loadCurriculum(books: { id: string; kind: string; subject?: string }[]): { curriculum: Curriculum | null; errors: string[] } {
  const subjects = new Map(books.filter((b) => b.subject).map((b) => [b.id, b.subject!]));
  const errors: string[] = [];
  const raw = JSON.parse(readFileSync(new URL("../curriculum.json", import.meta.url), "utf8"));
  const parsed = Curriculum.safeParse(raw);
  if (!parsed.success) return { curriculum: null, errors: parsed.error.issues.map((i) => `curriculum.json ${i.path.join(".")}: ${i.message}`) };
  const known = new Set(books.map((b) => b.id));
  const named = new Set<string>();
  for (const p of parsed.data.paths) {
    p.levels.forEach((l, i) => {
      if (l.n !== i + 1) errors.push(`curriculum.json ${p.id}: levels must be numbered 1, 2, 3 … in order`);
      for (const b of l.books ?? []) {
        named.add(b);
        if (!known.has(b)) errors.push(`curriculum.json ${p.id} level ${l.n}: no book "${b}" (known: ${[...known].join(", ")})`);
      }
      // A lane may name a book still in preparation; what exists counts as placed.
      for (const b of [...(l.sarf ?? []), ...(l.nahw ?? [])]) named.add(b);
      // A book stands in the lane of its own science (a primer's `subject`).
      for (const lane of ["sarf", "nahw"] as const) for (const b of l[lane] ?? []) {
        const s = subjects.get(b);
        if (s && s !== lane) errors.push(`curriculum.json ${p.id} level ${l.n}: "${b}" is a book of ${s}, not ${lane}`);
      }
    });
  }
  for (const b of books) if (!named.has(b.id)) errors.push(`curriculum.json: the ${b.kind} "${b.id}" stands on no madrasa path`);
  return { curriculum: parsed.data, errors };
}

/** The reviews of lessons and texts: every key must name a lesson or text that exists, every reviewer must be listed. */
export function loadReviews(keys: Set<string>): { reviews: Reviews | null; errors: string[] } {
  const raw = JSON.parse(readFileSync(new URL("../reviews.json", import.meta.url), "utf8"));
  const parsed = Reviews.safeParse(raw);
  if (!parsed.success) return { reviews: null, errors: parsed.error.issues.map((i) => `reviews.json ${i.path.join(".")}: ${i.message}`) };
  const errors: string[] = [];
  const people = new Set(parsed.data.reviewers.map((r) => r.id));
  const seen = new Set<string>();
  for (const r of parsed.data.reviewed) {
    if (!keys.has(r.key)) errors.push(`reviews.json: no lesson or text "${r.key}"`);
    if (seen.has(r.key)) errors.push(`reviews.json: "${r.key}" is listed twice`);
    seen.add(r.key);
    if (!people.has(r.by)) errors.push(`reviews.json ${r.key}: unknown reviewer "${r.by}" (add it to reviewers)`);
  }
  return { reviews: parsed.data, errors };
}

/**
 * The ṭabaqāt works (tabaqat/<id>.json; docs/tabaqat-pipeline.md): each validated against TabaqatBook, with its entries
 * numbered 1, 2, 3 … in order, ids unique, every `person` and the author a scholar page, the library entry existing, and
 * every paragraph's page inside its entry's pages. The Arabic must be Arabic and vocalised (a paragraph with few vowel
 * marks is reported), the English free of Arabic script.
 */
export function loadTabaqat(peopleSlugs: Set<string>, libraryIds: Set<string>): { books: TabaqatBook[]; errors: string[]; notes: string[] } {
  const dir = new URL("../tabaqat/", import.meta.url);
  const errors: string[] = [];
  const notes: string[] = [];
  const books: TabaqatBook[] = [];
  if (!existsSync(dir)) return { books, errors, notes };
  const ARABIC = /[\u0621-\u064A]/g;
  const MARKS = /[\u064B-\u0652]/g;
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
    const label = `tabaqat/${f}`;
    let raw: unknown;
    try { raw = JSON.parse(readFileSync(new URL(f, dir), "utf8")); } catch (e) { errors.push(`${label}: ${(e as Error).message}`); continue; }
    const r = TabaqatBook.safeParse(raw);
    if (!r.success) { errors.push(...r.error.issues.slice(0, 10).map((i) => `${label} ${i.path.join(".")}: ${i.message}`)); continue; }
    const b = r.data;
    if (`${b.id}.json` !== f) errors.push(`${label}: id "${b.id}" does not match the file name`);
    if (!peopleSlugs.has(b.authorSlug)) errors.push(`${label}: author "${b.authorSlug}" has no scholar page`);
    if (!libraryIds.has(b.library)) errors.push(`${label}: library entry "${b.library}" does not exist`);
    const range = (pages: string) => { const [a, z2] = pages.split("–").map(Number); return [a, z2 ?? a] as const; };
    const checkParagraph = (where: string, p: { ar: string; page: string; en: string }, lo: number, hi: number) => {
      const page = Number(p.page);
      if (page < lo || page > hi) errors.push(`${label} ${where}: page ${p.page} is outside ${lo}–${hi}`);
      const letters = (p.ar.match(ARABIC) ?? []).length;
      if (letters === 0) errors.push(`${label} ${where}: the Arabic has no Arabic letters`);
      else if ((p.ar.match(MARKS) ?? []).length / letters < 0.35) notes.push(`${label} ${where}: the Arabic looks unvocalised`);
      if (/[\u0600-\u06FF]/.test(p.en)) notes.push(`${label} ${where}: the English has Arabic script in it`);
    };
    b.preface.forEach((p, i) => checkParagraph(`preface ${i + 1}`, p, 1, 9));
    const ids = new Set<string>();
    let lastPage = 0;
    b.entries.forEach((e, i) => {
      const where = `entry ${e.n} (${e.id})`;
      if (e.n !== i + 1) errors.push(`${label} ${where}: entry number ${e.n} where ${i + 1} was expected (entries are numbered 1, 2, 3 … in order)`);
      if (ids.has(e.id)) errors.push(`${label} ${where}: duplicate id "${e.id}"`);
      ids.add(e.id);
      if (e.person && !peopleSlugs.has(e.person)) errors.push(`${label} ${where}: person "${e.person}" has no scholar page`);
      if (e.died !== undefined && !/\d/.test(e.died)) errors.push(`${label} ${where}: died "${e.died}" has no year`);
      const [lo, hi] = range(e.pages);
      if (hi < lo) errors.push(`${label} ${where}: pages ${e.pages} run backwards`);
      if (lo < lastPage) errors.push(`${label} ${where}: begins on page ${lo}, before the entry before it (${lastPage})`);
      lastPage = lo;
      e.paragraphs.forEach((p, k) => checkParagraph(`${where} paragraph ${k + 1}`, p, lo, hi));
    });
    b.closing.forEach((p, i) => checkParagraph(`closing ${i + 1}`, p, lastPage, 999));
    const linked = b.entries.filter((e) => e.person).length;
    notes.push(`ṭabaqāt ${b.id}: ${b.entries.length} entries, ${linked} tied to a scholar page`);
    books.push(b);
  }
  return { books, errors, notes };
}
