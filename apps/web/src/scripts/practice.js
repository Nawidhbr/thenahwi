// Loaded by pages/[locale]/practice/index.astro (moved out of the page so browsers cache it; see CLAUDE.md).
(() => {
  const form = document.querySelector(".tikrar");
  const ds = form.dataset;
  const study = window.__study;
  const scores = study ? study.scores : {};
  const passed = (slug) => { if (!study) return false; const x = study.info(slug); return x.done && x.step?.q; };
  const lessons = [...form.querySelectorAll("[data-lesson]")];
  let data = null;
  const load = () => (data ??= fetch(ds.src).then((r) => r.json()));

  const fill = (text, v) => text.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? "");

  // Tikrār on a schedule (the rules in lib/progress.js, sent inside study-data.js): each passed lesson has a day on
  // which it is due again, kept in this browser ("nahwi-review").
  const P = window.__progress;
  const KEY = "nahwi-review";
  const readReview = () => { try { return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch { return {}; } };
  const saveReview = (r) => { try { localStorage.setItem(KEY, JSON.stringify(r)); } catch {} };
  const today = () => P.dayOf(Date.now());
  const dayText = (day) => new Date(`${day}T12:00:00`).toLocaleDateString(document.documentElement.lang, { weekday: "long", day: "numeric", month: "long" });

  // Passed lessons can be chosen, with their stars; the others are not listed one by one but counted per chapter.
  let passedAll = 0;
  for (const l of lessons) {
    const slug = l.dataset.lesson;
    const box = l.querySelector("input");
    if (passed(slug)) {
      passedAll++;
      const n = study.stars(scores[slug] ?? 0);
      const s = l.querySelector(".stars");
      s.textContent = "★".repeat(n) + "☆".repeat(3 - n);
      s.title = s.dataset.label.replace("{n}", n);
      s.hidden = false;
    } else {
      box.disabled = true;
      l.dataset.state = "locked";
      l.closest("li").hidden = true;
    }
  }
  for (const f of form.querySelectorAll(".tikrar-chapter")) {
    const boxes = [...f.querySelectorAll('input[name="lesson"]')];
    const open = boxes.filter((b) => !b.disabled).length;
    const rest = boxes.length - open;
    const head = f.querySelector("[data-chapter-all]");
    if (head && !open) { head.disabled = true; head.closest(".check").dataset.state = "locked"; }
    if (rest) {
      const p = f.querySelector(".tikrar-rest");
      p.querySelector("[data-rest-text]").textContent = fill(ds.rest, { n: rest });
      p.hidden = false;
    }
    if (!open) f.querySelector(".tikrar-lessons").hidden = true;
  }
  for (const b of form.querySelectorAll(".tikrar-book")) {
    const boxes = [...b.querySelectorAll('input[name="lesson"]')];
    const open = boxes.filter((x) => !x.disabled).length;
    const c = b.querySelector("[data-book-count]");
    c.textContent = fill(ds.of, { n: open, m: boxes.length });
    b.dataset.open = open ? "1" : "0";
    if (!open) { const all = b.querySelector("[data-book-all]"); all.disabled = true; all.closest(".check").hidden = true; }
  }

  // The reader's own madrasa path first; the other paths after it, under their own heading.
  const mine = study?.madrasa || document.documentElement.dataset.madrasa || "";
  const wrap = form.querySelector(".tikrar-paths");
  const own = mine && wrap.querySelector(`[data-tikrar-path="${CSS.escape(mine)}"]`);
  const others = wrap.querySelector(".tikrar-others-head");
  if (own) {
    wrap.prepend(own);
    own.querySelector(".tikrar-path-mine").hidden = false;
    // The other paths fold away under their heading; they start open only when the reader's own path has nothing
    // passed yet and another path has.
    const rest = [...wrap.querySelectorAll("[data-tikrar-path]")].filter((x) => x !== own);
    if (rest.length) {
      const fold = document.createElement("details");
      fold.className = "tikrar-others";
      const sum = document.createElement("summary");
      sum.className = "tikrar-others-head";
      sum.textContent = others.textContent;
      fold.append(sum, ...rest);
      fold.open = !own.querySelector('.tikrar-book[data-open="1"]') && rest.some((x) => x.querySelector('.tikrar-book[data-open="1"]'));
      own.after(fold);
    }
    others.remove();
  }
  // Open the books with passed lessons; fold the rest.
  for (const b of form.querySelectorAll(".tikrar-book")) b.open = b.dataset.open === "1" && (!own || own.contains(b) || !own.querySelector('.tikrar-book[data-open="1"]'));

  // Due for review: at most a few lessons a day, the longest overdue first; the reader's own path comes first.
  const due = document.querySelector("[data-due]");
  let queue = [];
  const showDue = () => {
    if (!P || !due || !passedAll) return;
    const order = [...new Set([...form.querySelectorAll('input[name="lesson"]:not(:disabled)')].map((b) => b.value))];
    const review = readReview();
    queue = P.reviewQueue(review, order, today());
    const name = (slug) => form.querySelector(`[data-lesson="${CSS.escape(slug)}"] .tikrar-name`)?.textContent.trim() ?? slug;
    const text = due.querySelector("[data-due-text]");
    const start = due.querySelector("[data-due-start]");
    if (queue.length) {
      text.textContent = fill(due.dataset.today, { list: queue.map(name).join(" · ") });
      start.hidden = false;
    } else {
      const next = P.nextReview(review, order, today());
      text.textContent = next ? fill(due.dataset.next, { date: dayText(next) }) : "";
      start.hidden = true;
    }
    due.hidden = !queue.length && !text.textContent;
  };

  // Nothing passed yet: say so, and show the way to the first lesson instead of an empty form.
  if (!passedAll) {
    document.querySelector("[data-empty]").hidden = false;
    form.hidden = true;
    document.querySelector(".tikrar-steps").hidden = true;
  }

  // Preselect a chapter from ?c=<chapter> (or a book from ?c=<book>).
  const pre = new URLSearchParams(location.search).get("c");
  if (pre) {
    const box = form.querySelector(`[data-chapter="${CSS.escape(pre)}"], [data-book="${CSS.escape(pre)}"]`);
    if (box) {
      box.querySelectorAll('input[name="lesson"]:not(:disabled)').forEach((b) => (b.checked = true));
      const book = box.closest(".tikrar-book");
      if (book) book.open = true;
    }
  }

  const chosen = () => [...form.querySelectorAll('input[name="lesson"]:checked')].map((b) => b.value);
  const pool = async () => {
    const all = await load();
    const set = new Set(chosen());
    return Object.entries(all).filter(([, q]) => q.t.some((t) => set.has(t)) && q.t.every((t) => passed(t)));
  };
  const tick = (head, boxes) => {
    if (!head) return;
    head.checked = boxes.length > 0 && boxes.every((b) => b.checked);
    head.indeterminate = !head.checked && boxes.some((b) => b.checked);
  };
  const sync = async () => {
    const sel = chosen();
    for (const f of form.querySelectorAll(".tikrar-chapter")) tick(f.querySelector("[data-chapter-all]"), [...f.querySelectorAll('input[name="lesson"]:not(:disabled)')]);
    for (const b of form.querySelectorAll(".tikrar-book")) tick(b.querySelector("[data-book-all]"), [...b.querySelectorAll('input[name="lesson"]:not(:disabled)')]);
    const open = [...form.querySelectorAll('input[name="lesson"]:not(:disabled)')];
    const all = form.querySelector("[data-all]");
    all.disabled = open.length === 0;
    tick(all, open);
    const n = sel.length ? (await pool()).length : 0;
    form.querySelector(".tikrar-count").textContent = n ? `${fill(ds.chosenText, { n: sel.length })} · ${ds.count.replace("{n}", n)}` : ds.none;
    form.querySelector("[data-start]").disabled = n === 0;
  };
  form.addEventListener("change", (e) => {
    const el = e.target;
    const set = (root) => root.querySelectorAll('input[name="lesson"]:not(:disabled)').forEach((b) => (b.checked = el.checked));
    if (el.matches("[data-all]")) set(form);
    if (el.matches("[data-book-all]")) set(el.closest(".tikrar-book"));
    if (el.matches("[data-chapter-all]")) set(el.closest(".tikrar-chapter"));
    sync();
  });

  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const test = document.querySelector(".tikrar-test");
  const list = test.querySelector(".quiz");
  const result = test.querySelector(".quiz-result");
  let answered = 0, right = 0, total = 0;
  // Per lesson of this test: right answers and questions, for the schedule.
  let byLesson = {};

  const run = async () => {
    let qs = await pool();
    if (form.elements.shuffleQ.checked) shuffle(qs);
    const shuffleA = form.elements.shuffleA.checked;
    list.replaceChildren();
    answered = 0; right = 0; total = qs.length;
    const set = new Set(chosen());
    byLesson = {};
    result.hidden = true;
    qs.forEach(([id, q], n) => {
      const order = q.o.map((_, i) => i);
      if (shuffleA) shuffle(order);
      const li = document.createElement("li");
      li.className = "card question";
      const head = document.createElement("p"); head.className = "q-number eyebrow"; head.textContent = `${n + 1} / ${qs.length}`;
      const p = document.createElement("p"); p.className = "q-prompt"; p.textContent = q.p;
      li.append(head, p);
      if (q.a) { const ar = document.createElement("p"); ar.className = "ar q-ar"; ar.lang = "ar"; ar.textContent = q.a; li.append(ar); }
      const opts = document.createElement("div"); opts.className = "options";
      const fb = document.createElement("div"); fb.className = "feedback"; fb.hidden = true;
      const verdict = document.createElement("p"); verdict.className = "verdict";
      const expl = document.createElement("p"); expl.textContent = q.e;
      fb.append(verdict, expl);
      order.forEach((orig, i) => {
        const b = document.createElement("button");
        b.type = "button"; b.className = "option";
        const key = document.createElement("span"); key.className = "option-key"; key.setAttribute("aria-hidden", "true");
        const ks = document.createElement("span"); ks.textContent = ds.letters[i]; key.append(ks);
        const txt = document.createElement("span"); txt.textContent = q.o[orig];
        b.append(key, txt);
        b.addEventListener("click", () => {
          const ok = orig === q.k;
          opts.querySelectorAll(".option").forEach((o, j) => {
            o.disabled = true;
            if (order[j] === q.k) o.dataset.state = "right";
            else if (o === b) o.dataset.state = "wrong";
          });
          li.dataset.state = ok ? "right" : "wrong";
          verdict.textContent = ok ? ds.rightText : ds.wrongText;
          fb.hidden = false;
          answered++; if (ok) right++;
          // The iPhone app taps the phone (lib/app-ios.ts).
          document.dispatchEvent(new CustomEvent("nahwi:answer", { detail: { right: ok } }));
          for (const t of q.t) if (set.has(t)) { const x = (byLesson[t] ??= { r: 0, n: 0 }); x.n++; if (ok) x.r++; }
          if (answered === total) finish();
        });
        opts.append(b);
      });
      li.append(opts, fb);
      list.append(li);
    });
    form.hidden = true;
    if (due) due.hidden = true;
    test.hidden = false;
    scrollTo({ top: 0 });
  };
  const finish = () => {
    const score = Math.round((right / total) * 100) / 10;
    const n = study ? study.stars(score) : 0;
    result.querySelector(".quiz-stars").textContent = "★".repeat(n) + "☆".repeat(3 - n);
    result.querySelector(".quiz-score").textContent = ds.scoreText.replace("{score}", score.toLocaleString(document.documentElement.lang));
    // Each lesson of the test moves on in the schedule by its own score.
    const saved = result.querySelector("[data-due-saved]");
    saved.hidden = true;
    if (P) {
      const review = readReview();
      const day = today();
      for (const [t, x] of Object.entries(byLesson)) review[t] = P.reviewAfter(review[t], Math.round((x.r / x.n) * 100) / 10, day);
      saveReview(review);
      try { localStorage.setItem("nahwi-days", JSON.stringify(P.logDay(JSON.parse(localStorage.getItem("nahwi-days") || "{}") || {}, day))); } catch {}
      const first = Object.keys(byLesson).map((t) => review[t].due).sort()[0];
      if (first) { saved.textContent = fill(saved.dataset.text, { date: dayText(first) }); saved.hidden = false; }
    }
    result.hidden = false;
    result.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  form.addEventListener("submit", (e) => { e.preventDefault(); run(); });
  test.querySelector("[data-reshuffle]").addEventListener("click", run);
  test.querySelector("[data-choose]").addEventListener("click", () => { test.hidden = true; form.hidden = false; showDue(); scrollTo({ top: 0 }); });
  due?.querySelector("[data-due-start]").addEventListener("click", () => {
    form.querySelectorAll('input[name="lesson"]').forEach((b) => (b.checked = queue.includes(b.value) && !b.disabled));
    sync();
    due.hidden = true;
    run();
  });
  showDue();
  sync();
})();

