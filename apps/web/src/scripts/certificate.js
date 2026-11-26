// Loaded by pages/[locale]/study/[book]/certificate.astro: shows the certificate once every lesson of the book is
// passed and its exam too (the rules in lib/progress.js, through the head script's window.__study), with the average
// score and today's date; with the lessons passed but not the exam, the exam; before that, how many lessons are
// passed. The name typed in is not stored.
(() => {
  const cert = document.querySelector("[data-certificate]");
  const locked = document.querySelector("[data-cert-locked]");
  const study = window.__study;
  if (!cert || !locked || !study) return;
  const id = cert.dataset.book;
  const lessons = id === "mabadi" ? study.path : study.tracks[id]?.lessons ?? [];
  const done = id === "mabadi" ? study.baseDone : study.bookDone(id);
  const tested = lessons.filter((l) => l.q);
  const lang = document.documentElement.lang;
  if (!done) {
    const passed = lessons.filter((l) => study.info(l.s).done).length;
    locked.querySelector("[data-cert-progress]").textContent = locked.dataset.of.replace("{n}", passed).replace("{m}", lessons.length);
    return;
  }
  // Every lesson passed: the exam comes first (lib/progress.js examPassed), then the certificate.
  const exam = document.querySelector("[data-cert-exam]");
  if (exam && !study.examPassed(id)) {
    locked.hidden = true;
    exam.hidden = false;
    document.addEventListener("nahwi:passed", () => { exam.hidden = true; show(); }, { once: true });
    return;
  }
  show();
  function show() {
  const avg = tested.length ? Math.round((tested.reduce((n, l) => n + (study.scores[l.s] ?? 0), 0) / tested.length) * 10) / 10 : 10;
  const n = study.stars(avg);
  cert.querySelector("[data-cert-score]").textContent = cert.dataset.score.replace("{stars}", "★".repeat(n) + "☆".repeat(3 - n)).replace("{score}", avg.toLocaleString(lang));
  cert.querySelector("[data-cert-date]").textContent = new Date().toLocaleDateString(lang, { day: "numeric", month: "long", year: "numeric" });
  locked.hidden = true;
  cert.hidden = false;
  cert.querySelector("[data-cert-print]").addEventListener("click", () => window.print());
  }
})();
