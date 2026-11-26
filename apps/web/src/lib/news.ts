/** The language tag for dates: English days come first ("12 Nov 2026"), as elsewhere on the site. */
const dateLocale = (locale: string) => (locale === "en" ? "en-GB" : locale);

/** A news date for display: "Apr 2026", "12 Mar 2026" or "2026", in the reader's language (and its own calendar, or the one given). */
export function newsDate(d: string, locale: string, calendar?: "islamic-umalqura" | "gregory" | "persian"): string {
  const [y, m, day] = d.split("-").map(Number);
  if (!m) return String(y);
  const date = new Date(Date.UTC(y, m - 1, day || 1));
  const loc = calendar ? `${dateLocale(locale)}-u-ca-${calendar}` : dateLocale(locale);
  try {
    return new Intl.DateTimeFormat(loc, day ? { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" } : { month: "short", year: "numeric", timeZone: "UTC" }).format(date);
  } catch {
    return d;
  }
}

/**
 * A news (or update) date as HTML, in the calendar each language dates current events in: the solar Hijri year in
 * Persian (Iran and Afghanistan), the lunar Hijri date with the Gregorian one beside it in Arabic, the Gregorian date
 * everywhere else (Urdu included), each with its own month names; the other calendars in the tooltip. A month or a year
 * alone stays Gregorian, since it does not fall within one month of another calendar. The reader's calendar setting is
 * for the historical dates of the texts ("663/1265"), not for these.
 */
export function newsDateHTML(d: string, locale: string): string {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  const greg = newsDate(d, locale, "gregory");
  if (d.split("-").length < 3) return `<time datetime="${d}">${esc(greg)}</time>`;
  const hijri = newsDate(d, locale, "islamic-umalqura");
  if (locale === "fa") return `<time datetime="${d}" title="${esc(`${hijri} · ${greg}`)}">${esc(newsDate(d, locale, "persian"))}</time>`;
  if (locale === "ar") return `<time datetime="${d}">${esc(hijri)} <span class="news-date-alt">(${esc(greg)})</span></time>`;
  return `<time datetime="${d}" title="${esc(hijri)}">${esc(greg)}</time>`;
}

/**
 * The three sections of the news: academic work (studies, articles, theses, reviews), publications (editions,
 * translations, digitised texts and manuscripts) and talks and media (lectures, conferences, podcasts, videos).
 */
export type NewsSection = "academic" | "publications" | "talks";
export const NEWS_SECTIONS: NewsSection[] = ["academic", "publications", "talks"];
export const newsSection = (kind: string): NewsSection => (kind === "study" ? "academic" : kind === "event" || kind === "media" ? "talks" : "publications");

/** The site a news item links to, for "Read at …" (www. dropped). */
export const newsSource = (url: string) => new URL(url).hostname.replace(/^www\./, "");
