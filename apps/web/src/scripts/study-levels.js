// Loaded by pages/[locale]/study/index.astro (moved out of the page so browsers cache it; see CLAUDE.md).
(() => {
  const { progress, lockedText, dialogLocked, dialogSoon } = JSON.parse(document.currentScript.dataset.vars);
  const s = window.__study;
  if (!s) return;
  const root = document.documentElement;
  const locale = location.pathname.split("/")[1];
  const lessonHref = (id) => { const x = s.tracks[id]; return `/${locale}/study/${id}/${x.next.split("-").pop()}/`; };
  const started = s.done.size > 0 || Object.keys(s.scores).length > 0;

  // The madrasa path: chosen with one of the three cards, kept in this browser ("madrasa"); the head script has
  // already set data-madrasa on <html> before paint, so only the chosen path's levels are shown.
  // Once a path is chosen the three cards fold away behind "Change path".
  const chooser = document.getElementById("madrasa");
  const change = document.querySelector("[data-change-path]");
  const fold = (open) => {
    if (open) chooser.dataset.open = ""; else delete chooser.dataset.open;
    change?.setAttribute("aria-expanded", String(open));
  };
  change?.addEventListener("click", () => fold(!("open" in chooser.dataset)));
  // The preview button is for those who have not started; a reader on the path has the Continue button.
  if (started) document.querySelector(".study-head [data-previews]")?.setAttribute("hidden", "");
  for (const b of document.querySelectorAll("[data-pick]")) {
    b.setAttribute("aria-pressed", String(root.dataset.madrasa === b.dataset.pick));
    b.addEventListener("click", () => {
      const id = b.dataset.pick;
      try { localStorage.setItem("madrasa", id); } catch {}
      window.dispatchEvent(new Event("nahwi:progress"));
      root.dataset.madrasa = id;
      s.madrasa = id;
      for (const x of document.querySelectorAll("[data-pick]")) x.setAttribute("aria-pressed", String(x === b));
      render();
      fold(false);
      document.getElementById("madrasa-title")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // Each level's progress and state from this browser's scores; the main button leads to where you are.
  function render() {
    const btn = document.getElementById("home-continue");
    const list = document.querySelector(`[data-path="${s.madrasa}"]`);
    if (!list) return;
    let current = null;
    for (const c of list.querySelectorAll("[data-level-card]")) {
      const state = c.querySelector("[data-level-state]");
      delete c.dataset.state;
      if (c.hasAttribute("data-soon")) continue;
      let opened, done, total, next;
      if (c.dataset.kind === "terms") {
        opened = true; done = s.done.size; total = s.path.length;
        next = `/${locale}/terms/${s.next}/`;
      } else {
        const books = c.dataset.books.split(",").map((id) => s.tracks[id]).filter(Boolean);
        opened = books.some((x) => x.opened);
        done = books.reduce((k, x) => k + x.done.size, 0);
        total = books.reduce((k, x) => k + x.lessons.length, 0);
        const at = c.dataset.books.split(",").find((id) => s.tracks[id]?.opened && !s.bookDone(id));
        next = at ? lessonHref(at) : null;
      }
      c.dataset.next = next || "";
      if (!opened) {
        c.dataset.state = "locked";
        state.textContent = " · " + lockedText.replace("{prev}", c.dataset.prev || "");
        state.hidden = false;
        continue;
      }
      state.textContent = " · " + progress.replace("{n}", done).replace("{total}", total);
      state.hidden = !(done > 0);
      if (done >= total) c.dataset.state = "done";
      else if (!current) { current = c; c.dataset.state = "current"; }
    }
    // The main button: the next term or lesson of the level you are in; before you start, the path's first level.
    if (!btn) return;
    const name = (current || list.querySelector("[data-level-card]"))?.querySelector(".level-card-title")?.textContent || "";
    if (current) {
      btn.href = (started && current.dataset.next) || current.getAttribute("href");
      btn.textContent = ((started ? btn.dataset.label : btn.dataset.startLabel) || "{name}").replace("{name}", name);
      btn.hidden = false;
    }
  }
  render();

  // A level that has not opened (or is in preparation) opens a small window instead of its page:
  // what the level is and when it opens, and a preview lesson where there is one.
  const dialog = document.getElementById("level-dialog");
  const pick = (el) => { const list = JSON.parse(el.dataset.previews || "[]"); return list[Math.floor(Math.random() * list.length)]; };
  const openDialog = (c) => {
    const soon = c.hasAttribute("data-soon");
    const q = (sel) => dialog.querySelector(sel);
    // The card before it names what to pass first: "level 1a", or "level 1b" for level 2 (data-prev).
    q("[data-d-state]").textContent = soon ? dialogSoon : dialogLocked.replace("{prev}", c.dataset.prev || "");
    q("[data-d-title]").textContent = c.querySelector(".level-card-title")?.textContent || "";
    q("[data-d-ar]").textContent = c.querySelector(".level-card-ar")?.textContent || "";
    q("[data-d-lead]").textContent = c.querySelector(".level-card-lead")?.textContent || "";
    q("[data-d-meta]").textContent = soon ? "" : (c.querySelector(".level-card-meta")?.firstChild?.textContent || "").trim();
    const href = pick(c);
    const pv = q("[data-d-preview]");
    pv.hidden = !href;
    if (href) pv.href = href;
    dialog.showModal();
  };
  if (dialog) {
    dialog.querySelector("[data-d-close]").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
    for (const c of document.querySelectorAll("[data-level-card]")) {
      const closed = () => c.hasAttribute("data-soon") || c.dataset.state === "locked";
      c.addEventListener("click", (e) => { if (closed()) { e.preventDefault(); openDialog(c); } });
      c.addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && c.hasAttribute("data-soon")) { e.preventDefault(); openDialog(c); } });
    }
  }
  // The hero's preview button: one of the preview lessons at random.
  const heroPreview = document.querySelector(".study-head [data-previews]");
  if (heroPreview) heroPreview.href = pick(heroPreview);
})();
