/**
 * Makes the share images (og:image, 1200×630 JPEG) in public/og/: for every photo in public/photos/
 * the "Split" design — the photo beside a black panel with the logo, the name and the tagline —
 * and default.jpg (the home photo). Run after adding photos:
 *   NODE_PATH=$(npm root -g) node apps/web/scripts/make-og.cjs
 * (needs Playwright; not part of the build, the images are committed).
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const web = path.join(__dirname, "..");
const root = path.join(web, "..", "..");
const photos = path.join(web, "public", "photos");
const out = path.join(web, "public", "og");
fs.mkdirSync(out, { recursive: true });
const font = (pkg, file) => "file://" + path.join(root, "node_modules", "@fontsource", pkg, "files", file);
const en = JSON.parse(fs.readFileSync(path.join(web, "src", "i18n", "en.json"), "utf8"));
// "Ṣarf and naḥw: Arabic grammar as the madrasa teaches it" → the part after the colon, under the name.
const tagline = en.meta.tagline.replace(/^[^:]*:\s*/, "");

const page = (photo) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Literata; font-weight: 700; src: url(${font("literata", "literata-latin-ext-700-normal.woff2")}); }
@font-face { font-family: Literata; font-weight: 700; src: url(${font("literata", "literata-latin-700-normal.woff2")}); unicode-range: U+0000-00FF; }
@font-face { font-family: Literata; font-weight: 400; src: url(${font("literata", "literata-latin-ext-400-normal.woff2")}); }
@font-face { font-family: Literata; font-weight: 400; src: url(${font("literata", "literata-latin-400-normal.woff2")}); unicode-range: U+0000-00FF; }
@font-face { font-family: Kufi; font-weight: 700; src: url(${font("noto-kufi-arabic", "noto-kufi-arabic-arabic-700-normal.woff2")}); }
html, body { margin: 0; width: 1200px; height: 630px; background: #cc4a0a; overflow: hidden; }
.wrap { display: grid; grid-template-columns: 560px 640px; height: 630px; }
.photo { background: url("file://${path.join(photos, photo + "-1600.webp")}") center / cover; }
.panel { color: #fff; padding: 64px 64px 56px; display: flex; flex-direction: column; font-family: Literata, serif; }
.mark { width: 84px; height: 84px; }
.ar { font-family: Kufi, sans-serif; font-weight: 700; font-size: 40px; margin: 34px 0 0; direction: rtl; text-align: left; }
h1 { font-size: 76px; line-height: 1; margin: 14px 0 0; letter-spacing: -0.01em; }
.rule { width: 72px; height: 6px; background: #fff; margin: 34px 0 26px; }
p { font-size: 31px; line-height: 1.3; margin: 0; color: #fff; font-weight: 400; }
.url { margin-top: auto; font-size: 24px; color: #fff; letter-spacing: 0.04em; font-weight: 700; }
</style></head><body><div class="wrap"><div class="photo"></div><div class="panel">
<svg class="mark" viewBox="0 0 512 512"><rect width="512" height="512" rx="112" fill="#fff"/><g transform="translate(0 10)"><path d="M150 200H194V328H318V200H362V372H150Z" fill="#cc4a0a" fill-rule="evenodd"/><rect x="232" y="120" width="48" height="48" fill="#cc4a0a"/></g></svg>
<div class="ar">النَّحْوِيّ</div>
<h1>The Nahwi</h1>
<div class="rule"></div>
<p>${tagline.charAt(0).toUpperCase() + tagline.slice(1)}</p>
<div class="url">thenahwi.com</div>
</div></div></body></html>`;

(async () => {
  const names = fs.readdirSync(photos).filter((f) => f.endsWith("-1600.webp")).map((f) => f.replace(/-1600\.webp$/, ""));
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  const tmp = path.join(out, ".tmp.html");
  for (const [name, photo] of [...names.map((n) => [n, n]), ["default", "tiles-orange-patchwork"]]) {
    fs.writeFileSync(tmp, page(photo));
    await p.goto("file://" + tmp);
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(50);
    await p.screenshot({ path: path.join(out, `${name}.jpg`), type: "jpeg", quality: 82 });
  }
  fs.unlinkSync(tmp);
  await b.close();
  console.log(`${names.length + 1} share images in ${out}`);
})();
