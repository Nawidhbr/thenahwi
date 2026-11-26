import { createHash } from "node:crypto";
import { primerIn } from "@nahwi/content";
import { practiceGates, primers, studyPath, trackSteps, tracks } from "./course";
import { localTerms } from "./localize";
import { previews } from "../config/previews";
import { FREE_BOOK, PAYWALL } from "../config/pricing";
import progressSource from "./progress.js?raw";

/**
 * The data the head script (scripts/head-study.js) needs to set locks and progress before paint: the study path with
 * the term names of the language, the practice gates, every book's lessons and the preview lessons. It is the same
 * on every page of a language, so it is a file of its own, /<locale>/study-data.js, cached for a year and versioned
 * by a hash of its content (?v=…), instead of 19 KB repeated in each of the site's 4,000 pages. It also carries the
 * rules of the path (lib/progress.js), so the head script and the tests run the same code.
 */
/** A book's name in the lock texts of a language: in Arabic its Arabic title, in Urdu and Persian the Arabic title
 * without vowel marks (or the title of the translated primer), elsewhere the translated primer's title or the book's own. */
function bookLabel(id: string, nm: string, locale: string): string {
  if (locale === "en") return nm;
  const p = primers().find((x) => x.id === id);
  const arabic = p?.arabicTitle ?? tracks().find((x) => x.book.id === id)?.book.arabicTitle;
  if (locale === "ar") return arabic ?? nm;
  const own = p ? primerIn(p, locale).title : undefined;
  if (own && own !== p?.title) return own;
  if ((locale === "ur" || locale === "fa") && arabic) return arabic.replace(/[\u064B-\u0652\u0670]/g, "");
  return nm;
}

const memo = new Map<string, { body: string; v: string }>();
export function studyData(locale: string): { body: string; v: string } {
  const hit = memo.get(locale);
  if (hit) return hit;
  const names = new Map(localTerms(locale).map((t) => [t.slug, t.english]));
  const data = {
    path: studyPath().map((p) => ({ ...p, n: names.get(p.s) ?? p.s })),
    gates: practiceGates(),
    tracks: trackSteps().map((k) => {
      const nm = bookLabel(k.id, k.nm, locale);
      return nm === k.nm ? k : { ...k, nm, l: k.l.map((x) => ({ ...x, n: x.n.startsWith(k.nm) ? nm + x.n.slice(k.nm.length) : x.n })) };
    }),
    previews: previews().map((x) => x.slug),
    // Access (config/pricing.ts): locks by licence only once the paywall is on.
    paywall: PAYWALL,
    freeBook: FREE_BOOK,
  };
  // The rules themselves travel with the data, from lib/progress.js (one source for the browser and the tests).
  const rules = progressSource.replace(/^export /gm, "");
  const body = `window.__studyVars=${JSON.stringify(data)};\nwindow.__progress=(()=>{${rules}\nreturn { progress, stars, canRead, accessOf, reviewFirst, reviewAfter, reviewQueue, nextReview, dayOf, REVIEW_DAYS, logDay, streak, average, weakest, activity, HEARTS_MAX, HEART_MS, FREE_REFILLS, RUN_FOR_REFILL, heartsNow, heartsFullAt, spendHeart, refillHearts, useFreeRefill, countTest, mergeHearts, askOf, shuffled, pickQuestions, EXAM_SIZE, EXAM_PASS, examKey, examScore, examPassed };})();\n`;
  const out = { body, v: createHash("sha256").update(body).digest("hex").slice(0, 10) };
  memo.set(locale, out);
  return out;
}
