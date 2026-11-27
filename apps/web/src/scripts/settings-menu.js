// Loaded by BaseLayout.astro (moved out of the page so browsers cache it; see CLAUDE.md).
// The switches in the settings menu.
const themeButton = document.getElementById("theme-toggle");
const currentTheme = () => document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
const syncTheme = () => themeButton.setAttribute("aria-checked", String(currentTheme() === "dark"));
syncTheme();
themeButton.addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch {}
  syncTheme();
});

// Arabic typeface (study portal only): Kufi = modern (no attribute), naskh or classic (Amiri).
const fontButtons = document.querySelectorAll("[data-font-choice]");
const syncFont = () => fontButtons.forEach((b) => b.setAttribute("aria-checked", String((document.documentElement.dataset.font || "modern") === b.dataset.fontChoice)));
syncFont();
fontButtons.forEach((b) =>
  b.addEventListener("click", () => {
    const f = b.dataset.fontChoice;
    if (f === "modern") delete document.documentElement.dataset.font;
    else document.documentElement.dataset.font = f;
    try { localStorage.setItem("font", f); } catch {}
    syncFont();
  }),
);

// The language of the translations under a book's passages (Translation.astro): English, or one the reader chose here
// or beside a text (TextLanguage.astro); kept in this browser as "trlang".
(() => {
  const root = document.documentElement;
  const selects = document.querySelectorAll("[data-trlang-select]");
  const now = () => root.dataset.trlang || "en";
  const sync = () => selects.forEach((el) => {
    // A book that does not have the chosen language shows English: its own choice then reads English too.
    el.value = [...el.options].some((o) => o.value === now()) ? now() : "en";
  });
  sync();
  selects.forEach((el) =>
    el.addEventListener("change", () => {
      if (el.value === "en") delete root.dataset.trlang;
      else root.dataset.trlang = el.value;
      try { localStorage.setItem("trlang", el.value); } catch {}
      sync();
    }),
  );
})();

const translitButton = document.getElementById("translit-toggle");
const syncTranslit = () => translitButton?.setAttribute("aria-checked", String(document.documentElement.dataset.translit !== "off"));
syncTranslit();
translitButton?.addEventListener("click", () => {
  const root = document.documentElement;
  const off = root.dataset.translit !== "off";
  if (off) root.dataset.translit = "off";
  else delete root.dataset.translit;
  try { localStorage.setItem("translit", off ? "off" : "on"); } catch {}
  syncTranslit();
});

// Vowel marks (tashkīl) can be switched off: strip them from the Arabic on the page, and put them back.
(() => {
  const MARKS = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g;
  const saved = [];
  const strip = (root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.parentElement && n.parentElement.closest('[lang="ar"], .ar') && MARKS.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP),
    });
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      MARKS.lastIndex = 0;
      saved.push([n, n.nodeValue]);
      n.nodeValue = n.nodeValue.replace(MARKS, "");
    }
    MARKS.lastIndex = 0;
  };
  const restore = () => { for (const [n, v] of saved.splice(0)) n.nodeValue = v; };
  const root = document.documentElement;
  const button = document.getElementById("tashkil-toggle");
  const sync = () => button.setAttribute("aria-checked", String(root.dataset.tashkil !== "off"));
  // New Arabic on the page (search results) follows the setting too.
  const observer = new MutationObserver((list) => {
    if (root.dataset.tashkil !== "off") return;
    for (const m of list) m.addedNodes.forEach((n) => { if (n.nodeType === 1) strip(n); else if (n.nodeType === 3 && n.parentElement) strip(n.parentElement); });
  });
  observer.observe(document.body, { childList: true, subtree: true });
  if (root.dataset.tashkil === "off") strip(document.body);
  sync();
  button.addEventListener("click", () => {
    const off = root.dataset.tashkil !== "off";
    if (off) { root.dataset.tashkil = "off"; strip(document.body); }
    else { delete root.dataset.tashkil; restore(); }
    try { localStorage.setItem("tashkil", off ? "off" : "on"); } catch {}
    sync();
  });
})();

// Study progress, kept only in this browser: terms visited, and the next one to study.
(() => {
  let visited = [];
  try { visited = JSON.parse(localStorage.getItem("visited") || "[]"); } catch {}
  if (!Array.isArray(visited)) visited = [];
  const here = document.querySelector("[data-visit]");
  if (here) {
    const slug = here.getAttribute("data-visit");
    const locked = document.documentElement.dataset.locked;
    if (slug && !locked && !visited.includes(slug)) {
      visited.push(slug);
      try { localStorage.setItem("visited", JSON.stringify(visited)); } catch {}
      window.dispatchEvent(new Event("nahwi:progress"));
    }
  }
  // Mark every term in the lists: passed (with its stars), current, or locked.
  const study = window.__study;
  if (!study) return;
  for (const l of document.querySelectorAll('main a[href*="/terms/"], main a[href*="/practice/"], main a[href*="/study/"]')) {
    if (l.closest(".path")) continue;
    const u = new URL(l.href, location.href);
    // A preview link (config/previews.ts) opens its lesson even while the level is locked.
    if (u.searchParams.has("preview")) continue;
    const t = u.pathname.match(/\/terms\/([^/]+)\/$/);
    const pr = u.pathname.match(/\/practice\/([^/]+)\/$/);
    const le = u.pathname.match(/\/study\/([^/]+)\/(\d+)\/$/);
    if ((t && !study.open.has(t[1])) || (pr && study.gates[pr[1]] && !study.done.has(study.gates[pr[1]])) || (le && !study.info(`${le[1]}-${le[2]}`).open)) l.dataset.lock = "";
  }
  const links = Array.from(document.querySelectorAll(".path a[data-slug]"));
  for (const a of links) {
    const slug = a.dataset.slug;
    const score = study.scores[slug];
    const x = study.info(slug);
    if (x.done) a.dataset.state = "done";
    else if (x.next && x.open) a.dataset.state = "current";
    else if (!x.open) a.dataset.state = "locked";
    const starsEl = a.querySelector(".stars");
    if (starsEl && typeof score === "number") {
      const n = study.stars(score);
      starsEl.dataset.n = String(n);
      starsEl.textContent = "★".repeat(n) + "☆".repeat(3 - n);
      starsEl.title = starsEl.dataset.label.replace("{n}", n);
      starsEl.hidden = false;
    }
  }
  // The whole path passed: "continue" leads to level 2.
  const l2 = document.getElementById("continue-card");
  if (study.baseDone && l2 && l2.dataset.l2Href) {
    document.getElementById("continue-ar").textContent = l2.dataset.l2Ar || "";
    document.getElementById("continue-name").textContent = l2.dataset.l2Name || "";
    document.getElementById("continue-count").textContent = (l2.dataset.studied || "{n} of {total}").replace("{n}", study.done.size).replace("{total}", study.path.length);
    document.getElementById("continue-link").href = l2.dataset.l2Href;
    l2.hidden = false;
    const cta = document.querySelector("[data-continue]");
    if (cta) { cta.href = l2.dataset.l2Href; cta.textContent = (cta.dataset.label || "{name}").replace("{name}", l2.dataset.l2Name || ""); }
    return;
  }
  const next = links.find((a) => a.dataset.slug === study.next);
  if (!next || (study.done.size === 0 && Object.keys(study.scores).length === 0 && visited.length === 0)) return;
  const name = next.querySelector("strong")?.textContent || "";
  const ar = next.querySelector(".ar")?.textContent?.trim() || "";
  const card = document.getElementById("continue-card");
  if (card) {
    document.getElementById("continue-ar").textContent = ar;
    document.getElementById("continue-name").textContent = name;
    document.getElementById("continue-count").textContent = (card.dataset.studied || "{n} of {total}").replace("{n}", study.done.size).replace("{total}", study.path.length);
    document.getElementById("continue-link").href = next.href;
    card.hidden = false;
  }
  const cta = document.querySelector("[data-continue]");
  if (cta) { cta.href = next.href; cta.textContent = (cta.dataset.label || "{name}").replace("{name}", name); }
})();

