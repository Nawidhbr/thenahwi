#!/usr/bin/env node
/**
 * Checks the built site (apps/web/dist) before it goes live; run by CI on every push and by `npm run check`.
 * Fails on: a link to a page or file that does not exist, a page without title / description / canonical /
 * og:image, a page with no or more than one <h1>, JSON-LD that does not parse, two English pages with the same title,
 * and (in a build with indexing on) a page in the sitemap that is noindex or has its canonical elsewhere.
 * Only warns on titles over 65 and descriptions over 170 characters. No dependencies: plain Node.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, dirname, normalize } from "node:path";

const dist = process.argv[2] ?? "apps/web/dist";
const site = "https://thenahwi.com";
const pages = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith(".html")) pages.push(p);
  }
};
walk(dist);

const errors = [];
const warnings = [];
const titles = new Map();
/** Per page: whether it is noindex, and its canonical, to hold the sitemap against. */
const indexing = new Map();
const exists = (path) => {
  const fp = join(dist, decodeURIComponent(path));
  return existsSync(fp) && (statSync(fp).isFile() || existsSync(join(fp, "index.html")));
};
const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const unescape = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

for (const file of pages) {
  const url = "/" + relative(dist, file).replace(/index\.html$/, "");
  const html = readFileSync(file, "utf8");
  const head = html.slice(0, html.indexOf("</head>") + 7);
  const redirect = /http-equiv="refresh"/.test(head);
  const is404 = url === "/404.html";
  const err = (msg) => errors.push(`${url}: ${msg}`);

  if (!redirect) {
    const title = unescape(head.match(/<title>([^<]*)<\/title>/)?.[1] ?? "").trim();
    const meta = Object.fromEntries([...head.matchAll(/<meta\s[^>]*>/g)].map(([t]) => [attr(t, "name") ?? attr(t, "property"), unescape(attr(t, "content") ?? "")]));
    if (!title) err("no <title>");
    if (!meta.description) err("no meta description");
    indexing.set(url, { noindex: /noindex/.test(meta.robots ?? ""), canonical: attr(head.match(/<link rel="canonical"[^>]*>/)?.[0] ?? "", "href") });
    if (!is404 && !/<link rel="canonical"/.test(head)) err("no canonical");
    if (!is404 && !meta["og:image"]) err("no og:image");
    const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
    if (h1 !== 1) err(`${h1} <h1> elements (want 1)`);
    if (title.length > 65) warnings.push(`${url}: title ${title.length} chars`);
    if ((meta.description ?? "").length > 170) warnings.push(`${url}: description ${meta.description.length} chars`);
    if (url.startsWith("/en/") && !/noindex/.test(meta.robots ?? "")) {
      if (titles.has(title)) err(`same title as ${titles.get(title)}: "${title}"`);
      else titles.set(title, url);
    }
  }

  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(json);
    } catch (e) {
      err(`JSON-LD does not parse: ${e.message}`);
    }
  }

  // Internal links and assets: every href/src on this site must exist in the build.
  for (const [, raw] of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    let href = unescape(raw);
    if (href.startsWith(site)) href = href.slice(site.length) || "/";
    if (/^(https?:|mailto:|tel:|data:|javascript:|#)/.test(href) || href.startsWith("//")) continue;
    let path = href.split(/[?#]/)[0];
    if (!path) continue;
    if (!path.startsWith("/")) path = normalize(join(dirname(url.endsWith("/") ? url + "x" : url), path));
    // Generated at request time or by the host, not files in the build.
    if (/^\/(_vercel|sw\.js)/.test(path)) continue;
    if (!exists(path)) err(`broken link ${href}`);
  }
}

// The sitemap lists only pages search engines may index under their own address. In a build without indexing every
// page is noindex, so the check runs only when the English home page is indexable.
if (indexing.get("/en/") && !indexing.get("/en/").noindex) {
  for (const file of readdirSync(dist).filter((f) => /^sitemap-\d+\.xml$/.test(f))) {
    for (const [, loc] of readFileSync(join(dist, file), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const path = loc.slice(site.length);
      const page = indexing.get(path);
      if (!page) errors.push(`${file}: ${path} is not a page of the build`);
      else if (page.noindex) errors.push(`${file}: ${path} is noindex`);
      else if (page.canonical !== loc) errors.push(`${file}: ${path} has its canonical at ${page.canonical}`);
    }
  }
}

const unique = (list) => [...new Set(list)];
console.log(`Checked ${pages.length} pages: ${errors.length} errors, ${warnings.length} warnings.`);
for (const w of unique(warnings).slice(0, 10)) console.log(`  warning  ${w}`);
if (warnings.length > 10) console.log(`  … and ${warnings.length - 10} more warnings`);
for (const e of unique(errors).slice(0, 50)) console.log(`  error    ${e}`);
if (errors.length > 50) console.log(`  … and ${errors.length - 50} more errors`);
process.exit(errors.length ? 1 : 0);
