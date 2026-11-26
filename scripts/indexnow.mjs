#!/usr/bin/env node
/**
 * Tells Bing, Yandex and the other IndexNow engines which pages the live site has (https://www.indexnow.org).
 * Run by GitHub Actions after a production deploy (.github/workflows/indexnow.yml), at most once a day.
 * The key is public by design: the engines check that https://thenahwi.com/<key>.txt holds it.
 */
const SITE = process.env.SITE_URL || "https://thenahwi.com";
const KEY = "e598c0cec03fc5f8efc54e143bec02c0";

const text = async (url) => {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url}: ${r.status}`);
  return r.text();
};
const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const index = await text(`${SITE}/sitemap-index.xml`);
const urls = (await Promise.all(locs(index).map(async (s) => locs(await text(s))))).flat();
const host = new URL(SITE).host;
// IndexNow engines share what they receive, but each checks the key itself. api.indexnow.org (Bing) has refused the key
// with UserForbiddedToAccessSite since the start while Yandex accepts it, so each engine is asked on its own and a
// refusal from one does not stop the others. Bing will take the key once the site is verified in Bing Webmaster Tools.
const ENGINES = ["https://api.indexnow.org/indexnow", "https://yandex.com/indexnow"];
// Batches of 100: until an engine has checked the key, larger batches are refused (UserForbiddedToAccessSite).
const BATCH = 100;
let failed = false;
for (const engine of ENGINES) {
  for (let i = 0; i < urls.length; i += BATCH) {
    const r = await fetch(engine, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urls.slice(i, i + BATCH) }),
    });
    console.log(`IndexNow ${new URL(engine).host}: URLs ${i + 1}–${Math.min(urls.length, i + BATCH)}, answer ${r.status}`);
    // 403: this engine has not accepted the key (yet); the next engine is still asked.
    if (r.status === 403) { console.log(`IndexNow ${new URL(engine).host}: key not accepted, skipped this run`); break; }
    if (r.status >= 400 && r.status !== 429) { failed = true; break; }
    await new Promise((ok) => setTimeout(ok, 500));
  }
}
if (failed) process.exit(1);
