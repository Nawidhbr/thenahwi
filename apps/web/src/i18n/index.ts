import { getLocaleBundle, getReadyLocales } from "@nahwi/content";
import en from "./en.json";

/** The interface text of one language, with English filling any key the translation lacks. */
export type UI = typeof en;

const dictionaries = import.meta.glob<{ default: unknown }>("./*.json", { eager: true });
const byCode: Record<string, unknown> = {};
for (const [path, mod] of Object.entries(dictionaries)) byCode[path.replace(/^\.\/(.*)\.json$/, "$1")] = mod.default;

const merge = (base: any, over: any): any => {
  if (typeof base !== "object" || base === null) return typeof over === typeof base ? over : base;
  const out: any = Array.isArray(base) ? [...base] : { ...base };
  for (const k of Object.keys(base)) if (over && k in over) out[k] = merge(base[k], over[k]);
  return out;
};

const cache = new Map<string, UI>();
export function t(locale: string): UI {
  if (!cache.has(locale)) cache.set(locale, locale === "en" ? en : merge(en, byCode[locale] ?? {}));
  return cache.get(locale)!;
}

/**
 * Search titles and descriptions of the main pages (`seo` in a dictionary, by path), written for what people type
 * ("nahw" and "sarf" without the dots, "Arabic grammar", "course"). Only a language's own dictionary counts: an English
 * search title on a Dutch page would be worse than the page's own title.
 */
export function seoFor(locale: string, path: string): { title?: string; description?: string } | undefined {
  return (byCode[locale] as any)?.seo?.[path];
}

/** Fill {placeholders}. */
export function fmt(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

export const RTL = new Set(["ar", "ur", "fa"]);
export const dirOf = (locale: string) => (RTL.has(locale) ? "rtl" : "ltr");

/** Languages with pages: English, and each translation that is complete in content and interface. */
export const LIVE_LOCALES: string[] = ["en", ...getReadyLocales().filter((c) => c in byCode)];

export const localePaths = () => LIVE_LOCALES.map((locale) => ({ params: { locale } }));

export { getLocaleBundle };

/** Paths that exist in English only (the syllogism tool). Other languages link to their home page instead. */
export const ENGLISH_ONLY = (path: string) => path.startsWith("/tools/") || path === "/moderate/";
/** The locales a page exists in. */
export const localesFor = (path: string) => (ENGLISH_ONLY(path) ? ["en"] : LIVE_LOCALES);
