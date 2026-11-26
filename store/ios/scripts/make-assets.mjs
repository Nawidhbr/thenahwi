// Makes the iPhone app's own files from the site (run from the repository root: node store/ios/scripts/make-assets.mjs):
//  - www/offline.html: the page the app shows when it cannot reach the site and has no copy yet (capacitor.config.json
//    "errorPath"), in every live language, with the interface text of apps/web/src/i18n (app.offline…, app.retry);
//  - the app icon (1024×1024, no transparency, as the App Store wants) and the launch image (2732×2732), drawn from
//    the logo in apps/web/public/favicon.svg.
// Then `npx cap sync ios` in store/ios copies www into the Xcode project.
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { chromium } from "playwright";

const root = new URL("../../../", import.meta.url);
const here = new URL("../", import.meta.url);
const i18n = new URL("apps/web/src/i18n/", root);
const en = JSON.parse(readFileSync(new URL("en.json", i18n), "utf8"));
const RTL = new Set(["ar", "ur", "fa"]);

// The text of each language, English where a translation is not there yet.
const texts = {};
for (const f of readdirSync(i18n).filter((f) => f.endsWith(".json"))) {
  const code = f.slice(0, -5);
  const d = JSON.parse(readFileSync(new URL(f, i18n), "utf8"));
  texts[code] = { title: d.app?.offlineTitle ?? en.app.offlineTitle, body: d.app?.offlineBody ?? en.app.offlineBody, retry: d.app?.retry ?? en.app.retry, dir: RTL.has(code) ? "rtl" : "ltr" };
}

const config = JSON.parse(readFileSync(new URL("capacitor.config.json", here), "utf8"));
const start = config.server.url;
const mark = `<svg aria-hidden="true" width="56" height="56" viewBox="0 0 512 512"><rect width="512" height="512" fill="currentColor"/><g transform="translate(0 10)"><path d="M150 200H194V328H318V200H362V372H150Z" class="ink" fill-rule="evenodd"/><rect x="232" y="120" width="48" height="48" fill="#d42a1f"/></g></svg>`;

const offline = `<!doctype html>
<html lang="en" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>The Nahwi</title>
<style>
  :root { color-scheme: light dark; --bg: #ffffff; --ink: #0a0a0a; --muted: #5c5c5c; --red: #d42a1f; }
  @media (prefers-color-scheme: dark) { :root { --bg: #0a0a0a; --ink: #f5f5f5; --muted: #a3a3a3; } }
  html, body { margin: 0; height: 100%; background: var(--bg); color: var(--ink); }
  body { font: 17px/1.5 -apple-system, system-ui, sans-serif; display: grid; place-items: center; padding: max(24px, env(safe-area-inset-top)) 24px max(24px, env(safe-area-inset-bottom)); box-sizing: border-box; }
  main { max-width: 26rem; }
  svg { color: var(--ink); display: block; margin-bottom: 28px; }
  svg .ink { fill: var(--bg); }
  h1 { font-size: 1.6rem; line-height: 1.2; margin: 0 0 12px; }
  p { margin: 0 0 28px; color: var(--muted); }
  a { display: inline-block; background: var(--red); color: #ffffff; text-decoration: none; font-weight: 700; padding: 14px 22px; }
</style>
</head>
<body>
<main>
  ${mark}
  <h1 id="title"></h1>
  <p id="body"></p>
  <a id="retry" href="${start}"></a>
</main>
<script>
  const T = ${JSON.stringify(texts)};
  const want = (navigator.languages || [navigator.language || "en"]).map((l) => String(l).slice(0, 2).toLowerCase());
  const code = want.find((l) => T[l]) || "en";
  const t = T[code];
  document.documentElement.lang = code;
  document.documentElement.dir = t.dir;
  document.getElementById("title").textContent = t.title;
  document.getElementById("body").textContent = t.body;
  document.getElementById("retry").textContent = t.retry;
</script>
</body>
</html>
`;
mkdirSync(new URL("www/", here), { recursive: true });
writeFileSync(new URL("www/offline.html", here), offline);
writeFileSync(new URL("www/index.html", here), `<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=${start}"><title>The Nahwi</title>\n`);

// The icon and the launch image, drawn by the browser from the logo.
const logo = (size, scale, bg) => `<!doctype html><html><body style="margin:0;background:${bg}"><svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512"><rect width="512" height="512" fill="${bg}"/><g transform="translate(256 256) scale(${scale}) translate(-256 -256) translate(0 10)"><path d="M150 200H194V328H318V200H362V372H150Z" fill="#ffffff" fill-rule="evenodd"/><rect x="232" y="120" width="48" height="48" fill="#d42a1f"/></g></svg></body></html>`;
const assets = new URL("ios/App/App/Assets.xcassets/", here);
const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
const shoot = async (size, scale, file) => {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(logo(size, scale, "#0a0a0a"));
  await page.screenshot({ path: new URL(file, assets).pathname, omitBackground: false });
};
await shoot(1024, 1, "AppIcon.appiconset/AppIcon-512@2x.png");
// The launch image is cropped to the screen (aspect fill), so the logo stays small in the middle.
for (const f of ["splash-2732x2732.png", "splash-2732x2732-1.png", "splash-2732x2732-2.png"]) await shoot(2732, 0.22, `Splash.imageset/${f}`);
await browser.close();
console.log("www/offline.html, the icon and the launch image written");
