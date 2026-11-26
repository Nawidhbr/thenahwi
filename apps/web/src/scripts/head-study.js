// Loaded by BaseLayout.astro (moved out of the page so browsers cache it; see CLAUDE.md).
(() => {
  // Set by /<locale>/study-data.js, loaded just before this script (lib/study-data.ts).
  const { path, gates, tracks, previews } = window.__studyVars || { path: [], gates: {}, tracks: [], previews: [] };
  // The study path: a term opens when the one before it has at least two stars (6/10 on its test).
  // Scores live in this browser only. Sets data-locked on <html> when this page is a locked term or practice.
  try {
    const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k) || "") ?? d; } catch { return d; } };
    const scores = read("scores", {});
    const visited = new Set(read("visited", []));
    // The rules of the path (lib/progress.js, sent in study-data.js): open, passed and next terms and lessons.
    const { stars } = window.__progress;
    // The madrasa path chosen on the study page (config/madrasas.ts); before a choice, a learner who already
    // studies the terms keeps the path they started on. A book on several paths opens by the reader's own path.
    const madrasa = localStorage.getItem("madrasa") || (path.some((p) => scores[p.s] != null) ? "ottoman" : "");
    // Moderators and the teacher (staff: the account is in public.moderators, kept by lib/account-sync.ts) skip the
    // path: every lesson is open and every book readable. Only for the signed-in reader of this browser.
    const staff = !!localStorage.getItem("nahwi-auth") && localStorage.getItem("nahwi-moderator") === "1";
    const pr = window.__progress.progress({ path, tracks }, scores, visited, madrasa, { all: staff });
    const { open, done, baseDone, levelDone, info, blocker, bookDone } = pr;
    const tr = pr.tracks;
    const i = pr.i;
    const root = document.documentElement;
    if (madrasa) root.dataset.madrasa = madrasa;
    window.__study = { staff, path, gates, scores, stars, open, done, next: path[i].s, tracks: tr, baseDone, levelDone, info, blocker, bookDone, madrasa, examPassed: (b) => window.__progress.examPassed(scores, b) };
    // Quotation marks of the page's language.
    window.__q = (x) => (["ar", "fa", "ur", "ru"].includes(root.lang) ? `«${x}»` : `“${x}”`);
    const term = location.pathname.match(/\/terms\/([^/]+)\/$/);
    if (term && !open.has(term[1])) root.dataset.locked = "term";
    // Access (config/pricing.ts, once payments are on): a book the reader's access does not open shows the access
    // note instead of the lesson, unless it is one of the book's previews opened with ?preview.
    const { paywall, freeBook } = window.__studyVars || {};
    const access = staff ? "paid" : window.__progress.accessOf(!!localStorage.getItem("nahwi-auth"), read("nahwi-access", null), Date.now());
    root.dataset.access = access;
    const asPreview = (slug) => previews.includes(slug) && new URLSearchParams(location.search).has("preview");
    const readable = (book) => !paywall || window.__progress.canRead(access, book, freeBook);
    // Passed (or, without a test, opened): the way on to the next term is shown.
    if (term && (done.has(term[1]) || (open.has(term[1]) && path.find((p) => p.s === term[1])?.q === 0))) root.dataset.passed = "";
    const practice = location.pathname.match(/\/practice\/([^/]+)\/$/);
    if (practice && !staff && gates[practice[1]] && !done.has(gates[practice[1]])) root.dataset.locked = "practice";
    const lesson = location.pathname.match(/\/study\/([a-z-]+)\/(\d+)\/$/);
    if (term && !readable(freeBook)) {
      if (asPreview(term[1])) { delete root.dataset.locked; root.dataset.preview = ""; }
      else root.dataset.locked = "access";
    }
    if (lesson && !readable(lesson[1])) {
      if (asPreview(`${lesson[1]}-${lesson[2]}`)) root.dataset.preview = "";
      else root.dataset.locked = "access";
    } else if (lesson) {
      const slug = `${lesson[1]}-${lesson[2]}`;
      const x = info(slug);
      // A preview (config/previews.ts, opened with ?preview): readable while locked, without its test and the way on.
      if (!x.open && previews.includes(slug) && new URLSearchParams(location.search).has("preview")) root.dataset.preview = "";
      else if (!x.open) root.dataset.locked = "term";
      if (x.done || (x.open && x.step && x.step.q === 0)) root.dataset.passed = "";
    }
    // A level that has not opened yet keeps its lessons to itself: its page shows what the level is, not the list.
    const bookPage = location.pathname.match(/\/study\/([a-z-]+)\/$/);
    if (bookPage && tr[bookPage[1]] && !tr[bookPage[1]].opened) root.dataset.levelLocked = "";
  } catch (e) { window.__report?.(e, "head-study"); }

})();
