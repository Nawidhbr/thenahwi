// The study page's "Today" card (components/StudyToday.astro), from what the browser keeps: the tests of each day
// (nahwi-days), the daily goal (nahwi-goal, default 1) and the review schedule (nahwi-review). The rules
// (logDay, streak, reviewQueue) are in lib/progress.js.
(() => {
  const box = document.querySelector("[data-today]");
  const study = window.__study;
  const P = window.__progress;
  if (!box || !study || !P) return;
  const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k) || "null") ?? d; } catch { return d; } };
  // Every passed lesson with a test, in book order: the terms, then the books.
  const passed = [...study.path, ...Object.values(study.tracks).flatMap((x) => x.lessons)].filter((l) => l.q && study.info(l.s).done).map((l) => l.s);
  if (!passed.length) return;
  const ds = box.dataset;
  const today = P.dayOf(Date.now());
  const days = read("nahwi-days", {});
  const select = box.querySelector("[data-today-goal]");
  const fill = (s, v) => s.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? "");
  const show = () => {
    const goal = Number(read("nahwi-goal", 1)) || 1;
    const n = days[today] ?? 0;
    select.value = String(goal);
    const tiles = box.querySelector("[data-today-tiles]");
    tiles.replaceChildren(...Array.from({ length: goal }, (_, i) => {
      const t = document.createElement("span");
      t.className = i < n ? "tile tile-filled" : "tile";
      return t;
    }));
    box.querySelector("[data-today-count]").textContent = n >= goal ? `${fill(ds.tests, { n, goal })} ${ds.done}` : fill(ds.tests, { n, goal });
    const s = P.streak(days, today);
    const streakEl = box.querySelector("[data-today-streak]");
    streakEl.textContent = fill(ds.streak, { n: s });
    streakEl.hidden = s < 2;
    const due = P.reviewQueue(read("nahwi-review", {}), passed, today).length;
    const dueEl = box.querySelector("[data-today-due]");
    dueEl.querySelector("[data-today-due-text]").textContent = fill(ds.due, { n: due });
    dueEl.hidden = !due;
  };
  select.addEventListener("change", () => {
    try { localStorage.setItem("nahwi-goal", JSON.stringify(Number(select.value))); } catch {}
    show();
  });
  show();
  box.hidden = false;
})();
