import { getCommentaries, getMatn, getPrimers, primerTextVariants, type Commentary, type Primer } from "@nahwi/content";
import { TEACHER } from "../config/about";
import { fmt, t } from "../i18n";
import { diedIn } from "./localize";

/**
 * Where each text and course on the site comes from, told the same way everywhere (components/SourceNote.astro):
 * the original and the print it is taken from (with the scan, where there is one), what the lessons follow, who
 * translated it, and its review. A text that is not shown says why (a modern edition under copyright, or a
 * transcription in preparation), so a reader always knows what they are reading.
 */
export interface SourceRow {
  label: string;
  value: string;
  href?: string;
  linkText?: string;
}
export interface SourceInfo {
  title: string;
  arabic: string;
  author: string;
  rows: SourceRow[];
  /** One short line for lesson pages and lists. */
  short: string;
}

type Edition = { title: string; editor?: string; publisher?: string; place?: string; year?: string; pages?: string; source?: string };
const editionText = (e: Edition) => [`<em>${esc(e.title)}</em>`, e.editor, e.publisher, [e.place, e.year].filter(Boolean).join(" ")].filter(Boolean).map((x) => (x!.startsWith("<em>") ? x : esc(x!))).join(", ");
const shortEdition = (e: { place?: string; year?: string }) => [e.place?.replace(/:.*$/, ""), e.year].filter(Boolean).join(" ");
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function common(locale: string): SourceRow[] {
  const S = t(locale).source;
  // Said once here, in the source note of every text and lesson: the translation is ours, made with AI's help and unchecked.
  return [
    { label: S.translation, value: `${esc(S.translationOwn)} ${esc(t(locale).primer.aiNote)}` },
  ];
}

/** The first book: al-Mabādiʾ is The Nahwi's own course, with no original text; a matn with an edition names its print. */
export function matnSource(locale: string): SourceInfo {
  const S = t(locale).source;
  const m = getMatn();
  const e = m.edition;
  if (!e) return { title: m.title, arabic: m.arabicTitle, author: m.author, rows: [{ label: S.text, value: esc(S.ownCourse) }, ...common(locale)], short: S.ownCourse };
  return {
    title: m.title,
    arabic: m.arabicTitle,
    author: diedIn(m.author, locale),
    rows: [{ label: S.text, value: `${esc(S.languages.ar)}, ${esc(S.vocalised)}: ${editionText(e)}` }, ...common(locale)],
    short: fmt(S.shortLine, { language: S.languages.ar, edition: shortEdition(e) }),
  };
}

/** A commentary or later text read lesson by lesson (al-Kātī, al-Mirqāt). */
export function bookSource(book: Commentary, locale: string): SourceInfo {
  const S = t(locale).source;
  const e = book.edition;
  return {
    title: book.title,
    arabic: book.arabicTitle,
    author: diedIn(book.died ? `${locale === "ar" ? book.authorArabic : book.author} (${book.died})` : locale === "ar" ? book.authorArabic : book.author, locale),
    rows: [
      { label: S.text, value: `${esc(S.languages.ar)}: ${editionText(e)}`, ...(e.source ? { href: e.source, linkText: S.scan } : {}) },
      ...common(locale),
    ],
    short: fmt(S.shortLine, { language: S.languages.ar, edition: shortEdition(e) || e.publisher || e.title }),
  };
}

/**
 * A primer course: our own lessons in the order of a modern edition (whose text is not reproduced), with the
 * original from a public-domain print where it has been transcribed.
 */
export function primerSource(p: Primer, locale: string): SourceInfo {
  const S = t(locale).source;
  const te = p.textEdition;
  const hasText = p.parts.some((part) => part.lessons.some((l) => l.text.length > 0));
  const lang = te ? S.languages[te.language] : S.languages.fa;
  // The languages its passages are translated into (English, and those of i18n/<code>/primers/<id>.json).
  const names = t(locale).header.trLangs as Record<string, string>;
  const first = p.parts.flatMap((part) => part.lessons).find((l) => l.text.length > 0);
  const langs = first ? ["en", ...Object.keys(primerTextVariants(p.id, first.n))].filter((x, i, a) => a.indexOf(x) === i) : [];
  const list = (codes: string[]) => { const n = codes.map((c) => names[c] ?? c); return n.length > 1 ? `${n.slice(0, -1).join(", ")} ${S.and} ${n[n.length - 1]}` : n[0]; };
  const textRow: SourceRow = te
    ? te.selection && hasText
      ? { label: S.text, value: `${esc(lang)}: ${esc(S.quoted)}: ${editionText(te)}${te.pages ? `, ${esc(te.pages)}` : ""}`, href: te.source, linkText: S.scan }
      : hasText
      ? { label: S.text, value: `${esc(lang)}, ${esc(te.language === "fa" ? S.transcribedLitho : S.transcribed)}: ${editionText(te)}${te.pages ? `, ${esc(te.pages)}` : ""}`, href: te.source, linkText: S.scan }
      : { label: S.text, value: `${esc(fmt(S.inPreparation, { language: lang }))}: ${editionText(te)}`, href: te.source, linkText: S.scan }
    : { label: S.text, value: esc(S.notShown) };
  return {
    title: p.title,
    arabic: p.arabicTitle,
    author: diedIn(p.died ? `${locale === "ar" ? p.authorArabic ?? p.author : p.author} (${p.died})` : locale === "ar" ? p.authorArabic ?? p.author : p.author, locale),
    rows: [
      textRow,
      { label: S.lessonsFollow, value: te?.selection ? esc(fmt(S.lessonsAfter, { author: p.author })) : te && te.source === p.edition.source ? esc(S.lessonsOwnText) : `${editionText(p.edition)}${p.edition.pages ? `, ${esc(fmt(S.pages, { pages: p.edition.pages }))}` : ""}. ${esc(S.lessonsOwn)}` },
      ...(langs.length > 1
        ? [{ label: S.translation, value: `${esc(fmt(S.translationLanguages, { language: lang, languages: list(langs) }))} ${esc(t(locale).primer.aiNote)}` }]
        : p.parts.some((part) => part.lessons.some((l) => l.text.some((x) => (x as { ar?: string }).ar)))
        ? [{ label: S.translation, value: `${esc(S.translationOwnAr)} ${esc(t(locale).primer.aiNote)}` }, common(locale)[1]].filter(Boolean)
        : common(locale)),
    ],
    short: te?.selection && hasText ? fmt(S.shortQuoted, { edition: shortEdition(te) }) : te && hasText ? fmt(S.shortLine, { language: lang, edition: shortEdition(te) }) : fmt(S.shortLessons, { edition: shortEdition(p.edition) }),
  };
}

/** The source of any book by id: "mabadi", a commentary or a primer. */
export function sourceOf(id: string, locale: string): SourceInfo | undefined {
  if (id === "mabadi") return matnSource(locale);
  const c = getCommentaries().find((x) => x.id === id);
  if (c) return bookSource(c, locale);
  const p = getPrimers().find((x) => x.id === id);
  return p ? primerSource(p, locale) : undefined;
}
