// Loaded by BookStructure.astro (moved out of the page so browsers cache it; see CLAUDE.md).
// Parts fold open and shut. Without a saved choice, only the part you are in is open.
(() => {
  const KEY = "parts-open";
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(KEY) || "null"); } catch {}
  let visited = [];
  try { visited = JSON.parse(localStorage.getItem("visited") || "[]"); } catch {}
  const done = new Set(Array.isArray(visited) ? visited : []);
  const parts = [...document.querySelectorAll("[data-part]")];
  if (parts.length < 2) return;

  // The part holding the next term to study (level 1, not yet read).
  let currentPart = parts[0].dataset.part;
  outer: for (const part of parts) {
    for (const a of part.querySelectorAll(".path a[data-slug]")) {
      if (!done.has(a.dataset.slug) && a.dataset.level !== "2") { currentPart = part.dataset.part; break outer; }
    }
  }

  const set = (part, open) => {
    part.dataset.open = String(open);
    part.querySelector(".part-toggle").setAttribute("aria-expanded", String(open));
    part.querySelector(".part-body").hidden = !open;
  };
  const store = () => {
    const state = {};
    parts.forEach((p) => { state[p.dataset.part] = p.dataset.open === "true"; });
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  };

  parts.forEach((part) => {
    const key = part.dataset.part;
    const open = saved && key in saved ? saved[key] : key === currentPart;
    set(part, open);

    const links = [...part.querySelectorAll(".path a[data-slug]")].filter((a) => a.dataset.level !== "2");
    const read = links.filter((a) => done.has(a.dataset.slug)).length;
    const label = part.querySelector("[data-part-progress]");
    if (done.size > 0) { label.textContent = `${read}/${links.length}`; label.hidden = false; }

    const toggle = () => { set(part, part.dataset.open !== "true"); store(); };
    part.querySelector(".part-toggle").addEventListener("click", toggle);
    part.querySelector(".part-head").addEventListener("click", (e) => {
      if (e.target.closest("button, a, [popover]")) return;
      toggle();
    });
  });

  // Chapters inside a part fold the same way; without a saved choice only the chapter you are in is open.
  const CKEY = "chapters-open";
  let savedCh = null;
  try { savedCh = JSON.parse(localStorage.getItem(CKEY) || "null"); } catch {}
  const chapters = [...document.querySelectorAll("[data-chapter]")];
  let currentChapter = null;
  outerCh: for (const ch of chapters) {
    for (const a of ch.querySelectorAll(".path a[data-slug]")) {
      if (!done.has(a.dataset.slug) && a.dataset.level !== "2") { currentChapter = ch.dataset.chapter; break outerCh; }
    }
  }
  const setCh = (ch, open) => {
    ch.dataset.open = String(open);
    ch.querySelector(".chapter-toggle").setAttribute("aria-expanded", String(open));
    ch.querySelector(".chapter-body").hidden = !open;
  };
  const storeCh = () => {
    const state = {};
    chapters.forEach((c) => { state[c.dataset.chapter] = c.dataset.open === "true"; });
    try { localStorage.setItem(CKEY, JSON.stringify(state)); } catch {}
  };
  chapters.forEach((ch) => {
    const key = ch.dataset.chapter;
    const open = savedCh && key in savedCh ? savedCh[key] : currentChapter ? key === currentChapter : true;
    setCh(ch, open);
    const links = [...ch.querySelectorAll(".path a[data-slug]")].filter((a) => a.dataset.level !== "2");
    const read = links.filter((a) => done.has(a.dataset.slug)).length;
    const label = ch.querySelector("[data-chapter-progress]");
    if (done.size > 0) { label.textContent = `${read}/${links.length}`; label.hidden = false; }
    const toggle = () => { setCh(ch, ch.dataset.open !== "true"); storeCh(); };
    ch.querySelector(".chapter-toggle").addEventListener("click", toggle);
    ch.querySelector(".chapter-head").addEventListener("click", (e) => {
      if (e.target.closest("button, a")) return;
      toggle();
    });
  });

  // The "open all / close all" button (FoldAll) sets every part and chapter at once.
  document.addEventListener("fold-all", (e) => {
    const open = e.detail.open;
    parts.forEach((p) => set(p, open));
    chapters.forEach((c) => setCh(c, open));
    store();
    storeCh();
    document.dispatchEvent(new Event("fold-changed"));
  });
  document.addEventListener("click", (e) => { if (e.target.closest(".part-head, .chapter-head")) setTimeout(() => document.dispatchEvent(new Event("fold-changed"))); });
  document.dispatchEvent(new Event("fold-changed"));

  // A link to a part (#part-…) opens it.
  const openFromHash = () => {
    const target = location.hash && document.querySelector(location.hash);
    if (target && target.dataset.part) set(target, true);
  };
  openFromHash();
  addEventListener("hashchange", openFromHash);
})();
