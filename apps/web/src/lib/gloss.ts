import { getGlossary, type GlossaryEntry } from "@nahwi/content";

/**
 * Word explanations. Technical words in a text become small buttons; tapping
 * one opens a pop-up with a plain word or synonym (see BaseLayout). The data
 * for the pop-ups is served per language at /<locale>/glossary.json.
 */

const ARABIC_SCRIPT = new Set(["ar", "ur", "fa"]);
const MARKS = "[\\u0610-\\u061A\\u064B-\\u065F\\u0670\\u06D6-\\u06ED]";
const MARK_RE = new RegExp(MARKS, "g");

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

interface Matcher {
  re: RegExp;
  lookup: Map<string, GlossaryEntry>;
  fold: (s: string) => string;
  arabicScript: boolean;
}

const cache = new Map<string, Matcher | null>();
/** Where a text is shown: the study portal, or the knowledge base (scholars and articles), where entries with `kb: false` stay unmarked. */
export type GlossArea = "study" | "kb";
// A phrase of the glossary's `ignore` list: matched like a form (so the longer phrase wins) but never marked.
const IGNORE: GlossaryEntry = { id: "", forms: ["--"], plain: "-" };

function matcher(locale: string, area: GlossArea): Matcher | null {
  const ck = `${locale}:${area}`;
  if (cache.has(ck)) return cache.get(ck)!;
  const { entries, ignore = [] } = getGlossary(locale);
  if (entries.length === 0) {
    cache.set(ck, null);
    return null;
  }
  const arabicScript = ARABIC_SCRIPT.has(locale);
  const fold = (s: string) => s.normalize("NFC").replace(MARK_RE, "").toLocaleLowerCase(locale);
  const lookup = new Map<string, GlossaryEntry>();
  const forms: string[] = [];
  for (const e of entries) {
    for (const f of e.forms) {
      const k = fold(f);
      if (!lookup.has(k)) {
        lookup.set(k, area === "kb" && e.kb === false ? IGNORE : e);
        forms.push(k);
      }
    }
  }
  for (const f of ignore) {
    const k = fold(f);
    if (!lookup.has(k)) {
      lookup.set(k, IGNORE);
      forms.push(k);
    }
  }
  forms.sort((a, b) => b.length - a.length);
  // In Arabic script, vowel marks may sit between any two letters, and one particle (و ف ب ل ك) may be attached in front.
  const pattern = forms.map((f) => (arabicScript ? [...f].map((ch) => escapeRe(ch) + MARKS + "*").join("") : escapeRe(f))).join("|");
  const prefix = arabicScript ? `(?:[وفبلك]${MARKS}*)?` : "";
  const re = new RegExp(`(?<![\\p{L}\\p{M}\\p{N}])${prefix}(?:${pattern})(?![\\p{L}\\p{M}\\p{N}])`, "giu");
  const m = { re, lookup, fold, arabicScript };
  cache.set(ck, m);
  return m;
}

/**
 * Text → HTML with the technical words wrapped. Each concept is marked once
 * per text block (its first occurrence), so a paragraph is not a sea of
 * underlines. Pass `skip` to leave a concept unmarked (e.g. the term of the
 * page in its own definition), and `area: "kb"` on the knowledge-base pages.
 */
export function gloss(text: string, locale: string, skip?: string, area: GlossArea = "study"): string {
  const m = matcher(locale, area);
  if (!m || !text) return escapeHtml(text ?? "");
  const seen = new Set<string>(skip ? [skip] : []);
  let out = "";
  let last = 0;
  m.re.lastIndex = 0;
  for (let hit = m.re.exec(text); hit; hit = m.re.exec(text)) {
    const word = hit[0];
    let key = m.fold(word);
    let entry = m.lookup.get(key);
    if (!entry && m.arabicScript) entry = m.lookup.get((key = key.slice(1)));
    if (!entry || entry === IGNORE || seen.has(entry.id)) continue;
    seen.add(entry.id);
    out += escapeHtml(text.slice(last, hit.index));
    out += `<button type="button" class="gloss" data-g="${entry.id}" aria-haspopup="dialog">${escapeHtml(word)}</button>`;
    last = hit.index + word.length;
  }
  return out + escapeHtml(text.slice(last));
}

/** Glossary id for a term slug in this language, if the glossary has one (used to skip the page's own term). */
export const glossIdForTerm = (locale: string, slug: string) => getGlossary(locale).entries.find((e) => e.term === slug)?.id;
