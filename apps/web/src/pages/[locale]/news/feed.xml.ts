import type { APIRoute } from "astro";
import { getNews } from "@nahwi/content";
import { localePaths, t } from "../../../i18n";
import { absoluteUrl } from "../../../config/site";

export const getStaticPaths = localePaths;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
/** An RFC 822 date for RSS; a month or year alone counts as its first day. */
const rfc822 = (d: string) => new Date(`${d.length === 4 ? `${d}-01-01` : d.length === 7 ? `${d}-01` : d}T12:00:00Z`).toUTCString();

/** The news as an RSS 2.0 feed, one per language (the items are in English for now). */
export const GET: APIRoute = ({ params }) => {
  const locale = params.locale as string;
  const N = t(locale).kb.news;
  const items = getNews()
    .map((n) => `    <item>
      <title>${esc(n.headline)}</title>
      <link>${esc(n.url)}</link>
      <guid isPermaLink="false">${esc(`news-${n.id}`)}</guid>
      <pubDate>${rfc822(n.date)}</pubDate>
      <category>${esc(n.field)}</category>
      <category>${esc(n.kind)}</category>
      <description>${esc(`${n.gist} — ${n.title}${n.who ? ` (${n.who})` : ""}. ${n.summary}`)}</description>
    </item>`)
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(N.feedTitle)}</title>
    <link>${absoluteUrl(`/${locale}/news/`)}</link>
    <atom:link href="${absoluteUrl(`/${locale}/news/feed.xml`)}" rel="self" type="application/rss+xml" />
    <description>${esc(N.feedDescription)}</description>
    <language>${locale}</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
};
