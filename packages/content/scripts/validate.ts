import { mkdirSync, writeFileSync } from "node:fs";
import { TRANSLATION_LOCALES, loadExercises, loadGlossary, loadLocale, loadMatn, loadQuizTranslations, loadQuizzes, loadTerms, loadCommentaries, loadBackground, loadCatalogue, loadNews, loadLibrary, loadLibraryTranslations, loadPrimers, loadPrimerTranslations, loadCurriculum, loadReviews, loadTabaqat } from "../src/load.ts";

const { terms, errors: termErrors } = loadTerms();
const { matn, errors: matnErrors } = loadMatn(terms);
const { sets, errors: exerciseErrors } = loadExercises(terms);
const { quizzes, errors: quizErrors, missing: quizMissing } = loadQuizzes(terms);
const { commentaries, errors: commentaryErrors, notes: commentaryNotes } = loadCommentaries(matn);
const { background, errors: backgroundErrors, notes: backgroundNotes } = loadBackground(TRANSLATION_LOCALES);
// The glossary: a concept's lesson must be a term of the study path.
{
  const termSlugs = new Set(terms.map((t: { slug: string }) => t.slug));
  for (const c of background.concepts) if (c.term && !termSlugs.has(c.term)) backgroundErrors.push(`background/concepts/${c.slug}: term "${c.term}" is not a term of the study path`);
}
const { catalogue, errors: catalogueErrors, notes: catalogueNotes } = loadCatalogue(new Set(background.people.map((p) => p.slug)));
const { news, errors: newsErrors } = loadNews();
const { library, errors: libraryErrors, notes: libraryNotes } = loadLibrary(new Set(background.people.map((p) => p.slug)), ["kafiya", "shafiya", "izzi", "alfiyya", "ajurrumiyya", "qatr"]);
const { translations: libraryTranslations, errors: libraryTrErrors } = loadLibraryTranslations(library, TRANSLATION_LOCALES);
const { books: tabaqat, errors: tabaqatErrors, notes: tabaqatNotes } = loadTabaqat(new Set(background.people.map((p) => p.slug)), new Set(library.map((b) => b.id)));
const { primers, errors: primerErrors } = loadPrimers();
const { translations: primerTranslations, errors: primerTrErrors, notes: primerTrNotes } = loadPrimerTranslations(primers);
const { curriculum, errors: curriculumErrors } = loadCurriculum([{ id: "mabadi", kind: "first reading" }, ...primers.map((p) => ({ id: p.id, kind: "primer", subject: p.subject })), ...commentaries.filter((c) => c.track).map((c) => ({ id: c.id, kind: "book" }))]);
const reviewKeys = new Set<string>([
  ...primers.flatMap((p) => p.parts.flatMap((part) => part.lessons.map((l) => `${p.id}-${l.n}`))),
  ...commentaries.filter((c) => c.track).flatMap((c) => c.lessons.map((l) => l.id)),
  ...["mabadi", ...primers.map((p) => p.id), ...commentaries.map((c) => c.id)].map((id) => `text:${id}`),
]);
const { reviews, errors: reviewErrors } = loadReviews(reviewKeys);
const errors = [...tabaqatErrors, ...reviewErrors, ...curriculumErrors, ...primerErrors, ...primerTrErrors, ...libraryErrors, ...libraryTrErrors, ...newsErrors, ...termErrors, ...matnErrors, ...exerciseErrors, ...quizErrors, ...commentaryErrors, ...backgroundErrors, ...catalogueErrors];

if (errors.length > 0) {
  console.error(`Content check failed with ${errors.length} error(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

const out = new URL("../generated/", import.meta.url);
mkdirSync(out, { recursive: true });
writeFileSync(new URL("terms.json", out), `${JSON.stringify(terms, null, 2)}\n`);
writeFileSync(new URL("matn.json", out), `${JSON.stringify(matn, null, 2)}\n`);
writeFileSync(new URL("exercises.json", out), `${JSON.stringify(sets, null, 2)}\n`);
writeFileSync(new URL("commentaries.json", out), `${JSON.stringify(commentaries)}\n`);
for (const n of commentaryNotes) console.log(`  ${n}`);
writeFileSync(new URL("background.json", out), `${JSON.stringify(background)}\n`);
for (const n of backgroundNotes) console.log(`  ${n}`);
writeFileSync(new URL("catalogue.json", out), `${JSON.stringify(catalogue)}\n`);
writeFileSync(new URL("news.json", out), `${JSON.stringify(news)}\n`);
writeFileSync(new URL("library.json", out), `${JSON.stringify(library)}\n`);
writeFileSync(new URL("library-i18n.json", out), `${JSON.stringify(libraryTranslations)}\n`);
writeFileSync(new URL("primers.json", out), `${JSON.stringify(primers)}\n`);
writeFileSync(new URL("primer-i18n.json", out), `${JSON.stringify(primerTranslations)}\n`);
for (const n of primerTrNotes) console.log(`  ${n}`);
writeFileSync(new URL("curriculum.json", out), `${JSON.stringify(curriculum)}\n`);
writeFileSync(new URL("reviews.json", out), `${JSON.stringify(reviews)}\n`);
writeFileSync(new URL("tabaqat.json", out), `${JSON.stringify(tabaqat)}\n`);
for (const n of tabaqatNotes) console.log(`  ${n}`);
for (const n of libraryNotes) console.log(`  ${n}`);
for (const n of catalogueNotes) console.log(`  ${n}`);
if (quizMissing.length) console.log(`  tests: ${quizMissing.length} term${quizMissing.length === 1 ? "" : "s"} without a test yet (${quizMissing.slice(0, 5).join(", ")}${quizMissing.length > 5 ? ", …" : ""})`);
const quizTranslations: Record<string, unknown> = {};
for (const code of TRANSLATION_LOCALES) {
  const { items, missing, errors: qe } = loadQuizTranslations(code, quizzes);
  if (qe.length) { console.error(`Test translation check failed:`); for (const e of qe) console.error(`  - ${e}`); process.exit(1); }
  if (missing && quizzes.length) console.log(`  tests ${code}: ${missing} question${missing === 1 ? "" : "s"} not translated yet (shown in English)`);
  quizTranslations[code] = items;
}
writeFileSync(new URL("quizzes.json", out), `${JSON.stringify({ quizzes, translations: quizTranslations })}\n`);

// Translations: only complete languages go live; the rest are reported and stay "in preparation".
const ready: string[] = [];
const bundles: Record<string, unknown> = {};
for (const code of TRANSLATION_LOCALES) {
  const { bundle, problems, ready: ok } = loadLocale(code, terms, matn, sets);
  if (ok) {
    ready.push(code);
    bundles[code] = bundle;
  } else {
    const done = Object.keys(bundle.terms).length;
    console.log(`  ${code}: in preparation (${done}/${terms.length} terms; ${problems.length} open item${problems.length === 1 ? "" : "s"}, first: ${problems[0]})`);
  }
}
writeFileSync(new URL("i18n.json", out), `${JSON.stringify({ ready, bundles })}\n`);

// Word explanations (pop-ups), per language. Checked against that language's own text.
const glossaries: Record<string, unknown> = {};
const glossaryErrors: string[] = [];
for (const code of ["en", ...TRANSLATION_LOCALES]) {
  const texts: string[] = [];
  if (code === "en") {
    for (const t of terms) texts.push(t.definition, ...t.explanation, ...t.examples.map((x) => `${x.english} ${x.note ?? ""}`));
    for (const s of matn?.sections ?? []) for (const seg of s.segments) texts.push(seg.english);
    for (const set of sets) for (const i of set.items) texts.push(i.prompt, i.explanation, ...i.options);
  } else {
    const b = bundles[code] as { terms: Record<string, { definition: string; explanation: string[]; examples: { text: string; note?: string }[] }>; matn: Record<string, string>; exercises: Record<string, Record<string, { prompt: string; explanation: string; options: string[] }>> } | undefined;
    if (!b) continue;
    for (const t of Object.values(b.terms)) texts.push(t.definition, ...t.explanation, ...t.examples.map((x) => `${x.text} ${x.note ?? ""}`));
    texts.push(...Object.values(b.matn));
    if (code === "ar") for (const s of matn?.sections ?? []) for (const seg of s.segments) texts.push(seg.arabic);
    for (const items of Object.values(b.exercises)) for (const i of Object.values(items)) texts.push(i.prompt, i.explanation, ...i.options);
  }
  const { glossary, errors: gErrors, unused } = loadGlossary(code, terms, texts);
  glossaryErrors.push(...gErrors);
  if (glossary.entries.length) glossaries[code] = glossary;
  if (unused.length) console.log(`  glossary ${code}: ${unused.length} entr${unused.length === 1 ? "y" : "ies"} not found in the text (${unused.slice(0, 6).join(", ")}${unused.length > 6 ? ", …" : ""})`);
}
if (glossaryErrors.length > 0) {
  console.error(`Glossary check failed with ${glossaryErrors.length} error(s):`);
  for (const e of glossaryErrors) console.error(`  - ${e}`);
  process.exit(1);
}
writeFileSync(new URL("glossary.json", out), `${JSON.stringify(glossaries)}\n`);

const drafts = terms.filter((t) => t.review.status === "draft").length;
const segments = matn?.sections.reduce((n, s) => n + s.segments.length, 0) ?? 0;
console.log(`Content OK: ${terms.length} terms (${drafts} still in draft, awaiting review), ${segments} matn segments, ${sets.reduce((n, s) => n + s.items.length, 0)} exercises; translations ready: ${ready.join(", ") || "none"}. Wrote generated/.`);
