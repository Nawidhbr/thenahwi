import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config/site.ts";
import { isTranslated } from "./src/lib/translated.ts";
import { readFileSync } from "node:fs";

// The date of the newest news item: the home page (its news strip) and the news page change with it.
// Other pages carry no lastmod; a date that is not true is worse for search engines than none.
const newsDate = (() => {
  try {
    const items = JSON.parse(readFileSync(new URL("../../packages/content/background/news.json", import.meta.url), "utf8"));
    return (Array.isArray(items) ? items : items.items ?? []).map((n) => n.date).filter(Boolean).sort().at(-1);
  } catch {
    return undefined;
  }
})();

const site = (process.env.SITE_URL ?? "https://thenahwi.com").replace(/\/+$/, "");

export default defineConfig({
  site,
  trailingSlash: "always",
  build: { format: "directory" },
  // Scripts are never inlined into the page: a strict Content-Security-Policy (vercel.json) allows only files from this site.
  vite: { build: { assetsInlineLimit: 0 } },
  integrations: [
    sitemap({
      // The root only redirects to /en/; the offline page is a fallback; completion pages, certificates, the hidden tools (noindex), the progress page, the account page and the moderation page are personal; a term lesson (/terms/<slug>/) is noindex, its free glossary entry being the page for the word. None of them belongs in the sitemap.
      // Pages that still show the English text (see lib/translated.ts) are left out; their canonical is the English page.
      filter: (page) => {
        if (page === `${site}/` || page.endsWith("/offline/") || page.endsWith("/account/") || page.endsWith("/moderate/") || page.endsWith("/study/progress/") || page.includes("/complete/") || page.includes("/certificate/") || page.includes("/tools/") || /\/[a-z]{2}\/terms\/[^/]+\/$/.test(new URL(page).pathname)) return false;
        const m = new URL(page).pathname.match(/^\/([a-z]{2})(\/.*)$/);
        return !m || isTranslated(m[1], m[2]);
      },
      serialize: (item) => {
        const path = new URL(item.url).pathname;
        if (newsDate && /^\/[a-z]{2}\/(news\/)?$/.test(path)) item.lastmod = new Date(newsDate).toISOString();
        return item;
      },
      i18n: { defaultLocale: SITE.defaultLocale, locales: Object.fromEntries(SITE.languages.map((l) => [l.code, l.code])) },
    }),
  ],
});
