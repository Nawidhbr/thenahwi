// Checks one language's translations without writing anything (so it can run while others work):
//   node --experimental-strip-types scripts/check-locale.ts <code>
// the interface (apps/web/src/i18n/<code>.json against en.json: keys, {placeholders}), the terms and their tests, the
// encyclopedia, the library, and the lessons of the books (i18n/<code>/primers). Prints what is missing or wrong, and
// how far the language is; exits 1 on an error (missing translations are counted, not errors).
import { existsSync, readFileSync } from "node:fs";
import { loadBackground, loadCatalogue, loadExercises, loadLibrary, loadLibraryTranslations, loadLocale, loadMatn, loadPrimerTranslations, loadPrimers, loadQuizTranslations, loadQuizzes, loadTerms } from "../src/load.ts";

const code = process.argv[2];
if (!code) { console.error("usage: check-locale.ts <code>"); process.exit(2); }
const errors: string[] = [];
const todo: string[] = [];

// Interface
const uiPath = new URL(`../../../apps/web/src/i18n/${code}.json`, import.meta.url);
const en = JSON.parse(readFileSync(new URL("../../../apps/web/src/i18n/en.json", import.meta.url), "utf8"));
if (!existsSync(uiPath)) todo.push(`interface: apps/web/src/i18n/${code}.json missing`);
else {
  let ui: unknown;
  try { ui = JSON.parse(readFileSync(uiPath, "utf8")); } catch (e) { errors.push(`interface: ${(e as Error).message}`); }
  const holes = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");
  let missing = 0;
  const walk = (a: any, b: any, path: string) => {
    if (typeof a === "string") {
      if (typeof b !== "string") { missing++; if (missing <= 15) todo.push(`interface: ${path} missing`); return; }
      if (holes(a) !== holes(b)) errors.push(`interface: ${path} has {${holes(b)}}, English has {${holes(a)}}`);
      return;
    }
    if (Array.isArray(a)) {
      if (!Array.isArray(b)) { missing++; if (missing <= 15) todo.push(`interface: ${path} missing`); return; }
      if (a.length !== b.length) errors.push(`interface: ${path} has ${b.length} items, English has ${a.length}`);
      a.forEach((x, i) => walk(x, b[i], `${path}[${i}]`));
      return;
    }
    if (a && typeof a === "object") {
      if (!b || typeof b !== "object") { missing++; if (missing <= 15) todo.push(`interface: ${path} missing`); return; }
      for (const k of Object.keys(a)) walk(a[k], b[k], path ? `${path}.${k}` : k);
      for (const k of Object.keys(b)) if (!(k in a)) errors.push(`interface: ${path ? `${path}.` : ""}${k} is not in en.json`);
    }
  };
  if (ui) walk(en, ui, "");
  if (missing > 15) todo.push(`interface: … ${missing} keys missing in all`);
}

// Terms, tests, encyclopedia, library, books
const { terms } = loadTerms();
const { matn } = loadMatn(terms);
const { sets } = loadExercises(terms);
const { problems } = loadLocale(code, terms, matn, sets);
todo.push(...problems.filter((p) => p.endsWith("missing")));
errors.push(...problems.filter((p) => !p.endsWith("missing")));
const { quizzes } = loadQuizzes(terms);
const q = loadQuizTranslations(code, quizzes);
errors.push(...q.errors);
if (q.missing) todo.push(`tests: ${q.missing} questions not translated`);
const { background, errors: bgErrors, notes: bgNotes } = loadBackground([code] as never);
errors.push(...bgErrors.filter((e) => e.includes(`/${code}/`) || e.startsWith(`${code}/`) || e.includes(` ${code} `)));
todo.push(...bgNotes.filter((n) => n.includes(code)));
const { library } = loadLibrary(new Set(background.people.map((p) => p.slug)), ["kafiya", "shafiya", "izzi", "alfiyya", "ajurrumiyya", "qatr"]);
const lib = loadLibraryTranslations(library, [code] as never);
errors.push(...lib.errors);
const { primers } = loadPrimers();
const pt = loadPrimerTranslations(primers);
errors.push(...pt.errors.filter((e) => e.startsWith(`i18n/${code}/`)));
todo.push(...pt.notes.filter((n) => n.startsWith(`i18n/${code}/`)));
const ownLessons = primers.map((p) => {
  const t = pt.translations[code]?.[p.id];
  const all = p.parts.flatMap((x) => x.lessons).length;
  const done = t ? Object.values(t.lessons).filter((l) => (l as { body?: unknown }).body).length : 0;
  return `${p.id} ${done}/${all}`;
});
void loadCatalogue;

for (const e of errors) console.error(`ERROR ${e}`);
for (const t of todo.slice(0, 60)) console.log(`todo  ${t}`);
if (todo.length > 60) console.log(`todo  … ${todo.length - 60} more`);
console.log(`lessons explained in ${code}: ${ownLessons.join(", ")}`);
console.log(errors.length ? `${errors.length} error(s)` : "no errors");
process.exit(errors.length ? 1 : 0);
