// Loaded by components/study/TrackLesson.astro and PrimerLesson.astro (moved out of the page so browsers cache it; see CLAUDE.md).
// A locked lesson: say why, and link to where the learner is.
(() => {
  const study = window.__study;
  if (!study || document.documentElement.dataset.locked !== "term") return;
  const m = location.pathname.match(/\/study\/([^/]+)\/(\d+)\/$/);
  const text = document.querySelector("[data-lock-text-base]");
  const go = document.querySelector("[data-lock-go]");
  const tr = study.tracks[m[1]];
  const b = study.blocker(m[1]);
  const lessonHref = (x) => `study/${x.id}/${x.next.split("-").pop()}/`;
  if (b && b.terms) {
    // Opens after the whole first reading (the terms of al-Mabādiʾ).
    const at = study.path.find((p) => p.s === study.next);
    text.textContent = text.dataset.lockTextBase.replace("{name}", at ? window.__q(at.n) : "");
    go.href = go.getAttribute("href").replace(/study\/.*$/, "terms/" + study.next + "/");
    go.textContent = go.dataset.label.replace("{name}", at ? at.n : "");
  } else if (b) {
    // Opens after another book of its madrasa path (config/madrasas.ts).
    const need = tr.a.find((dep) => !study.bookDone(dep));
    text.textContent = text.dataset.lockTextBook.replace("{book}", study.tracks[need]?.nm || need);
    go.href = go.getAttribute("href").replace(/study\/.*$/, lessonHref(b));
    go.textContent = go.dataset.label.replace("{name}", b.lessons.find((p) => p.s === b.next)?.n || "");
  } else {
    text.textContent = text.dataset.lockTextLesson;
    go.href = go.getAttribute("href").replace(/study\/.*$/, lessonHref({ ...tr, id: m[1] }));
    go.textContent = go.dataset.label.replace("{name}", tr.lessons.find((p) => p.s === tr.next)?.n || "");
  }
})();

