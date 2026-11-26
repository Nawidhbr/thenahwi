// Loaded by pages/[locale]/terms/[slug].astro (moved out of the page so browsers cache it; see CLAUDE.md).
// A locked term: say where the learner is on the path, and link there.
(() => {
  const study = window.__study;
  if (!study || document.documentElement.dataset.locked !== "term") return;
  const at = study.path.find((p) => p.s === study.next);
  const text = document.querySelector("[data-lock-text]");
  text.textContent = text.dataset.lockText.replace("{name}", at ? window.__q(at.n) : "");
  const go = document.querySelector("[data-lock-go]");
  go.href = go.getAttribute("href").replace(/\/$/, "") + "/terms/" + study.next + "/";
  go.textContent = go.dataset.label.replace("{name}", at ? at.n : "");
})();

