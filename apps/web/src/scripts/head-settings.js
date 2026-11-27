// Loaded by BaseLayout.astro (moved out of the page so browsers cache it; see CLAUDE.md).
// Apply a saved theme before first paint, so there is no flash.
try {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") document.documentElement.dataset.theme = saved;
  // Transliteration, like the Arabic typeface, is a study-portal setting.
  if (document.documentElement.dataset.area === "study" && localStorage.getItem("translit") === "off") document.documentElement.dataset.translit = "off";
  if (localStorage.getItem("tashkil") === "off") document.documentElement.dataset.tashkil = "off";
  // The language of the translations under the passages of a book (Translation.astro), if not English.
  const trlang = localStorage.getItem("trlang");
  if (["id", "tr", "ur", "fa", "ar"].includes(trlang)) document.documentElement.dataset.trlang = trlang;
  // Dates: Hijri first by default, Gregorian first if chosen (scripts/calendar.js).
  if (localStorage.getItem("cal") === "greg") document.documentElement.dataset.cal = "greg";
  // The Arabic typeface is a study-portal setting; the knowledge base keeps its own faces.
  const font = localStorage.getItem("font");
  if (document.documentElement.dataset.area === "study" && (font === "naskh" || font === "classic")) document.documentElement.dataset.font = font;
  // Opened from the Android app (a Trusted Web Activity: its start URL carries ?source=android, and the first page's
  // referrer is android-app://): kept for the session, so the pages leave out payments, which an app in Google Play
  // may only take through Google Play's own billing (docs/operations.md, "The Android app").
  if (new URLSearchParams(location.search).get("source") === "android" || document.referrer.startsWith("android-app://")) sessionStorage.setItem("nahwi-app", "android");
  // Opened in the iPhone app (store/ios, a Capacitor web view: its bridge is on the page before any script): the
  // pages leave out Paddle, the gift and the prices pages, and buying full access goes through Apple instead
  // (lib/app-ios.ts, store/ios/README.md). ?source=ios does the same for the session, to try it in a browser.
  const cap = window.Capacitor;
  // The app's web view fills the screen, under the status bar too; global.css keeps the header clear of it.
  if (cap && typeof cap.getPlatform === "function" && cap.getPlatform() === "ios") {
    const vp = document.querySelector('meta[name="viewport"]');
    if (vp && !vp.content.includes("viewport-fit")) vp.content += ", viewport-fit=cover";
  }
  if ((cap && typeof cap.getPlatform === "function" && cap.getPlatform() === "ios") || new URLSearchParams(location.search).get("source") === "ios") sessionStorage.setItem("nahwi-app", "ios");
  const app = sessionStorage.getItem("nahwi-app");
  if (app === "android" || app === "ios") document.documentElement.dataset.app = app;
  if (app === "ios") {
    // The app always starts at /en/study/?app=start; a reader who chose another language goes straight to the study
    // portal in it, before paint. Every other page remembers its language for the next start.
    const here = location.pathname.split("/")[1];
    const kept = localStorage.getItem("nahwi-app-locale");
    if (new URLSearchParams(location.search).get("app") === "start") {
      if (kept && kept !== here && /^[a-z]{2}$/.test(kept)) location.replace(`/${kept}/study/`);
      else history.replaceState(null, "", location.pathname + location.hash);
    } else if (/^[a-z]{2}$/.test(here) && here === document.documentElement.lang) localStorage.setItem("nahwi-app-locale", here);
  }
  // A discount code for the subscription from a link (?discount=<code>): kept for the session and filled in at
  // Paddle's checkout (lib/paddle-client.ts).
  const discount = new URLSearchParams(location.search).get("discount");
  if (discount) sessionStorage.setItem("nahwi-discount", discount.slice(0, 40));
  // Signed in (an account session from /<locale>/account/): the header shows the account tile with the reader's
  // initial instead of "Sign in", before paint. The session itself is read by lib/account-sync.ts.
  const auth = JSON.parse(localStorage.getItem("nahwi-auth") || "null");
  if (auth && auth.user) {
    const m = auth.user.user_metadata || {};
    const name = String(m.full_name || m.name || auth.user.email || "");
    const letter = ((name.match(/\p{L}|\p{N}/u) || ["·"])[0]).toLocaleUpperCase();
    document.documentElement.dataset.signedIn = "";
    document.documentElement.style.setProperty("--account-initial", JSON.stringify(letter));
    // A moderator's account menu also links to the moderation page (kept by lib/account-sync.ts).
    if (localStorage.getItem("nahwi-moderator") === "1") document.documentElement.dataset.moderator = "";
  }
} catch {}

