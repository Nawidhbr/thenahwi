import type { APIRoute } from "astro";
import { getLessonQuiz, getQuiz, getTerms, primerIn } from "@nahwi/content";
import { localePaths } from "../../../i18n";
import { practiceGates, primers, primerLessons, tracks } from "../../../lib/course";
import { practiceSets } from "../../../lib/practice";

export const getStaticPaths = localePaths;

/**
 * Every question of one language for tikrār (review): the tests of the terms
 * the chapter exercises and the lessons of levels 2, 3, …. Each question names the lessons (terms) it
 * belongs to; the page only offers it once all of those are passed.
 */
export const GET: APIRoute = ({ params }) => {
  const locale = params.locale as string;
  const gates = practiceGates();
  const out: Record<string, { p: string; a?: string; o: string[]; k: number; e: string; t: string[] }> = {};
  // Every question id must be unique across all sources, or one question would silently replace another; the build
  // fails instead (a term's test, a chapter exercise and a generated exercise once shared ids like shakl-1).
  const seen = new Set<string>();
  const put = (id: string, q: (typeof out)[string]) => {
    if (seen.has(id)) throw new Error(`practice/questions.json (${locale}): question id "${id}" is used twice`);
    seen.add(id);
    out[id] = q;
  };
  for (const term of getTerms()) {
    for (const i of getQuiz(term.slug, locale)?.items ?? []) {
      put(i.id, { p: i.prompt, ...(i.arabic ? { a: i.arabic } : {}), o: i.options, k: i.answer, e: i.explanation, t: [term.slug] });
    }
  }
  for (const set of practiceSets(locale)) {
    for (const i of set.items) {
      const t = i.terms.length ? i.terms : [gates[set.chapter]].filter((x): x is string => Boolean(x));
      put(i.id, { p: i.prompt, ...(i.arabic ? { a: i.arabic } : {}), o: i.options, k: i.answer, e: i.explanation, t });
    }
  }
  for (const x of tracks()) {
    for (const lesson of x.lessons) {
      for (const i of getLessonQuiz(x.book, lesson.id, locale)?.items ?? []) {
        put(i.id, { p: i.prompt, ...(i.arabic ? { a: i.arabic } : {}), o: i.options, k: i.answer, e: i.explanation, t: [lesson.id] });
      }
    }
  }
  // The primer courses (study/<book>/): each lesson's test, offered once that lesson is passed.
  for (const p of primers().map((x) => primerIn(x, locale))) {
    for (const l of primerLessons(p)) {
      for (const i of l.quiz) put(i.id, { p: i.prompt, ...(i.arabic ? { a: i.arabic } : {}), o: i.options, k: i.answer, e: i.explanation, t: [`${p.id}-${l.n}`] });
    }
  }
  return new Response(JSON.stringify(out), { headers: { "Content-Type": "application/json; charset=utf-8" } });
};
