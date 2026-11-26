// Loaded by pages/[locale]/study/progress.astro: the reader's progress, worked out from what this browser keeps
// (scores, nahwi-review, nahwi-days) with the rules of lib/progress.js (window.__progress) and the head script's
// window.__study. Nothing is stored or sent.
(() => {
  const page = document.querySelector("[data-progress]");
  const empty = document.querySelector("[data-empty]");
  const s = window.__study;
  const P = window.__progress;
  if (!page || !empty || !s || !P) return;
  const v = JSON.parse(document.currentScript.dataset.vars);
  const root = document.documentElement;
  const lang = root.lang;
  const locale = location.pathname.split("/")[1];
  const fill = (t, x) => t.replace(/\{(\w+)\}/g, (_, k) => x[k] ?? "");
  const num = (x) => Number(x).toLocaleString(lang);
  const starText = (n) => "★".repeat(n) + "☆".repeat(3 - n);
  const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k) || "null") ?? d; } catch { return d; } };

  // A book's steps and state: al-Mabādiʾ's terms, or a book after the first reading.
  const bookOf = (id) => {
    if (id === "mabadi") return { lessons: s.path, done: s.done, opened: true, finished: s.baseDone, next: s.next ? `/${locale}/terms/${s.next}/` : null };
    const x = s.tracks[id];
    if (!x) return null;
    return { lessons: x.lessons, done: x.done, opened: x.opened, finished: s.bookDone(id), next: x.next ? `/${locale}/study/${id}/${x.next.split("-").pop()}/` : null };
  };
  const isTerm = new Set(s.path.map((p) => p.s));
  const hrefOf = (slug) => {
    if (isTerm.has(slug)) return `/${locale}/terms/${slug}/`;
    const i = slug.lastIndexOf("-");
    return `/${locale}/study/${slug.slice(0, i)}/${slug.slice(i + 1)}/`;
  };

  // Every passed step with a test, in book order: the terms, then the books.
  const all = [...s.path, ...Object.values(s.tracks).flatMap((x) => x.lessons)];
  const passed = all.filter((l) => l.q && s.info(l.s).done).map((l) => l.s);
  if (!passed.length) { empty.hidden = false; return; }

  const today = P.dayOf(Date.now());
  const days = read("nahwi-days", {});
  const list = s.madrasa ? document.querySelector(`.progress-books[data-path="${s.madrasa}"]`) : null;

  // The path's books, one card each: how many steps are passed, the average stars, and the way on.
  let total = 0, done = 0, current = false, lastLock = "";
  if (list) {
    list.hidden = false;
    page.querySelector("[data-path-note]").textContent = fill(v.pathNote, { path: v.paths[s.madrasa] ?? s.madrasa });
    for (const li of list.querySelectorAll("[data-book]")) {
      const id = li.dataset.book;
      const b = bookOf(id);
      if (!b) { li.hidden = true; continue; }
      const n = b.lessons.filter((l) => b.done.has(l.s)).length;
      const m = b.lessons.length;
      total += m;
      done += n;
      li.querySelector("[data-bar]").style.inlineSize = `${m ? Math.round((n / m) * 100) : 0}%`;
      const state = li.querySelector("[data-book-state]");
      const tile = li.querySelector(".tile");
      if (!b.opened) {
        const blk = s.blocker(id);
        const book = blk?.terms ? v.titles.mabadi : v.titles[blk?.id] ?? blk?.nm ?? "";
        // The same reason under every closed book says nothing new: it is given once, under the first.
        const why = fill(v.lockBook, { book });
        state.textContent = why === lastLock ? "" : why;
        lastLock = why;
        li.dataset.state = "locked";
        continue;
      }
      const avg = P.average(s.scores, b.lessons.filter((l) => l.q && b.done.has(l.s)).map((l) => l.s));
      state.textContent = fill(v.passedOf, { n: num(n), total: num(m) }) + (avg != null ? ` · ${starText(s.stars(avg))} ${num(avg)}` : "");
      if (b.finished) {
        li.dataset.state = "done";
        tile.classList.add("tile-filled");
        li.querySelector("[data-book-cert]").hidden = false;
      } else if (b.next) {
        const next = li.querySelector("[data-book-next]");
        next.href = b.next;
        next.hidden = false;
        if (!current) { current = true; li.dataset.state = "current"; }
      }
    }
  } else {
    page.querySelector("[data-no-path]").hidden = false;
    page.querySelector("[data-books-section]").hidden = true;
  }

  // The figures at the top.
  page.querySelector("[data-stat-passed]").textContent = list ? fill(v.of, { n: num(done), total: num(total) }) : num(passed.length);
  const avg = P.average(s.scores, passed);
  page.querySelector("[data-stat-average]").textContent = avg == null ? "–" : `${starText(s.stars(avg))} ${num(avg)}`;
  const month = P.activity(days, today, 30);
  page.querySelector("[data-stat-days]").textContent = num(month.filter((d) => d.n > 0).length);
  page.querySelector("[data-stat-due]").textContent = num(P.reviewQueue(read("nahwi-review", {}), passed, today).length);

  // The last 30 days as tiles: filled on a day with a test, the date and count in the tooltip.
  const strip = page.querySelector("[data-activity]");
  strip.replaceChildren(...month.map((d) => {
    const el = document.createElement("span");
    el.className = d.n > 0 ? "tile tile-filled" : "tile";
    const date = new Date(`${d.day}T12:00:00`).toLocaleDateString(lang, { day: "numeric", month: "short" });
    el.title = fill(v.activityDay, { date, n: num(d.n) });
    return el;
  }));
  strip.setAttribute("aria-label", month.filter((d) => d.n > 0).map((d) => fill(v.activityDay, { date: new Date(`${d.day}T12:00:00`).toLocaleDateString(lang, { day: "numeric", month: "short" }), n: num(d.n) })).join("; ") || "–");

  // The passed lessons below three stars, the lowest first, each with the way to its test.
  const weak = P.weakest(s.scores, passed);
  const ul = page.querySelector("[data-weak]");
  ul.replaceChildren(...weak.map((slug) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = hrefOf(slug);
    a.textContent = v.names[slug] ?? slug;
    const st = document.createElement("span");
    st.className = "muted";
    const x = s.scores[slug];
    st.textContent = ` · ${starText(s.stars(x))} ${num(x)}`;
    st.title = fill(v.starsLabel, { n: num(s.stars(x)) });
    li.append(a, st);
    return li;
  }));
  page.querySelector("[data-weak-none]").hidden = weak.length > 0;
  page.hidden = false;
})();
