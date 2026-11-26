// Loaded by TermQuiz.astro (moved out of the page so browsers cache it; see CLAUDE.md). The rules (hearts, which
// questions a test asks, the exam's pass mark) are those of lib/progress.js, sent as window.__progress.
(() => {
  const box = document.querySelector(".term-quiz");
  if (!box) return;
  const ds = box.dataset;
  const slug = ds.slug;
  const T = JSON.parse(ds.texts || "{}");
  const P = window.__progress;
  const exam = "exam" in ds;
  const pass = Number(ds.pass || 6);
  const lang = document.documentElement.lang;
  const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k) || "") ?? d; } catch { return d; } };
  const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  const stars = (x) => (x >= 8.5 ? 3 : x >= 6 ? 2 : x >= 3 ? 1 : 0);
  const starText = (n) => "★".repeat(n) + "☆".repeat(3 - n);
  const list = box.querySelector("[data-questions]");
  const all = [...list.querySelectorAll(".question")];
  const result = box.querySelector(".quiz-result");
  const best = box.querySelector(".quiz-best");
  const heartsBox = box.querySelector("[data-hearts]");
  const empty = box.querySelector("[data-hearts-empty]");
  const reread = box.querySelector("[data-reread]");
  const ask = Math.min(Number(ds.ask) || all.length, all.length);
  const letters = "ABCDEFG";
  const start = box.querySelector("[data-quiz-start]");
  let qs = [];
  let answers = {};
  // "start": the start card; "test": the questions are being answered; "done": the result is shown.
  let phase = "start";
  // Back from buying a refill: the hearts arrive from the account in a moment (lib/account-sync.ts).
  let refilling = new URLSearchParams(location.search).has("refilled");

  // ——— Hearts ———
  const HEARTS = "nahwi-hearts";
  const now = () => Date.now();
  const hearts = () => (P ? P.heartsNow(read(HEARTS, null), now()) : { n: 5, next: null });
  // "1 hr, 20 min" in the page's language where the browser can say it, else "1:20".
  const clock = (ms) => {
    const m = Math.max(1, Math.ceil(ms / 60000));
    const h = Math.floor(m / 60);
    try {
      if (Intl.DurationFormat) return new Intl.DurationFormat(lang, { style: "short" }).format(h ? { hours: h, minutes: m % 60 } : { minutes: m });
    } catch {}
    return `${h}:${String(m % 60).padStart(2, "0")}`;
  };

  // ——— Re-reading after a failed test (not for the exam) ———
  const REREAD = "nahwi-reread";
  const mustReread = () => !exam && !!read(REREAD, {})[slug];

  /** Shows what fits the phase: the start card, no hearts, the lesson to read again, the questions, the result. */
  const render = () => {
    const h = hearts();
    const again = mustReread();
    if (P) {
      heartsBox.hidden = false;
      heartsBox.querySelectorAll(".heart").forEach((el, i) => { el.dataset.on = i < h.n ? "1" : "0"; });
      heartsBox.querySelector("[data-hearts-count]").textContent = T.hearts.replace("{n}", h.n);
      const badge = heartsBox.querySelector("[data-refills]");
      // With every heart in place, the hearts speak for themselves (the info tile explains them): no line under the
      // start and no refill badge, which only matter once a heart has been spent.
      badge.hidden = !h.f || !h.next;
      badge.textContent = T.refills.replace("{n}", h.f);
      const cost = start.querySelector("[data-hearts-text]");
      cost.textContent = refilling
        ? T.refilling
        : h.next ? T.hearts.replace("{n}", h.n) + " " + T.heartsNext.replace("{time}", clock(h.next - now())) : "";
      cost.hidden = !cost.textContent;
    }
    const out = h.n < 1;
    start.hidden = phase !== "start" || again || out;
    empty.hidden = !(phase === "start" && !again && out);
    if (!empty.hidden) {
      empty.querySelector("[data-hearts-empty-text]").textContent = T.heartsEmpty.replace("{time}", clock((h.next ?? now()) - now()));
      const free = empty.querySelector("[data-free-refill]");
      free.hidden = !h.f;
      free.textContent = T.freeRefill.replace("{n}", h.f);
    }
    reread.hidden = !(phase !== "test" && again);
    if (!reread.hidden) reread.querySelector("[data-reread-check]").checked = false;
    list.hidden = phase === "start";
  };

  reread.querySelector("[data-reread-check]").addEventListener("change", (e) => {
    if (!e.target.checked) return;
    const r = read(REREAD, {});
    delete r[slug];
    write(REREAD, r);
    fresh();
    phase = "start";
    render();
    start.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  // A free refill: all five hearts back, one refill fewer (lib/progress.js useFreeRefill).
  box.querySelector("[data-free-refill]").addEventListener("click", () => {
    const next = P && P.useFreeRefill(read(HEARTS, null), now());
    if (!next) return;
    write(HEARTS, next);
    window.dispatchEvent(new Event("nahwi:progress"));
    render();
    start.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  // The start button takes a heart and opens the questions.
  box.querySelector("[data-quiz-go]").addEventListener("click", () => {
    if (P) {
      const next = P.spendHeart(read(HEARTS, null), now());
      if (!next) { render(); return; }
      write(HEARTS, next);
      window.dispatchEvent(new Event("nahwi:progress"));
    }
    phase = "test";
    render();
    qs[0]?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // ——— Which questions, in which order ———
  const ASKED = "nahwi-asked";
  const fresh = () => {
    const asked = read(ASKED, {});
    const pick = P ? P.pickQuestions(all.length, ask, Math.random, asked[slug] || []) : all.map((_, i) => i);
    asked[slug] = pick;
    write(ASKED, asked);
    qs = pick.map((i) => all[i]);
    all.forEach((q) => { q.hidden = true; });
    qs.forEach((q, n) => {
      list.append(q);
      q.hidden = false;
      q.querySelector(".q-number").textContent = T.question.replace("{n}", n + 1);
      delete q.dataset.state;
      q.querySelector(".feedback").hidden = true;
      const opts = [...q.querySelectorAll(".option")];
      const order = P ? P.shuffled(opts.length, Math.random) : opts.map((_, i) => i);
      const wrap = q.querySelector(".options");
      order.forEach((k, pos) => {
        const o = opts[k];
        o.disabled = false;
        delete o.dataset.state;
        o.querySelector(".option-key span").textContent = letters[pos];
        wrap.append(o);
      });
    });
    answers = {};
    result.hidden = true;
  };

  const showBest = () => {
    const b = read("scores", {})[slug];
    if (typeof b !== "number") return;
    best.textContent = (exam ? "" : starText(stars(b)) + "  ") + T.best.replace("{score}", b.toLocaleString(lang));
    best.hidden = false;
  };

  const finish = () => {
    const right = Object.values(answers).filter(Boolean).length;
    const score = Math.round((right / qs.length) * 100) / 10;
    const scores = read("scores", {});
    const before = scores[slug];
    if (typeof scores[slug] !== "number" || score > scores[slug]) scores[slug] = score;
    // Three stars on five lessons in a row earn a free refill (lib/progress.js countTest); not the exam.
    const earnedBox = result.querySelector("[data-earned]");
    earnedBox.hidden = true;
    if (P && !exam) {
      const c = P.countTest(read(HEARTS, null), now(), before, score);
      write(HEARTS, c.state);
      if (c.earned) { earnedBox.textContent = T.earned; earnedBox.hidden = false; }
    }
    write("scores", scores);
    // The daily goal (lib/progress.js logDay): one more test today.
    if (P) try { write("nahwi-days", P.logDay(read("nahwi-days", {}) || {}, P.dayOf(now()))); } catch {}
    // A signed-in reader's progress is saved to the account (lib/account-sync.ts).
    window.dispatchEvent(new Event("nahwi:progress"));
    const ok = scores[slug] >= pass;
    const passedNow = score >= pass;
    // The iPhone app plans its hearts note and may ask for a rating after three stars (lib/app-ios.ts).
    document.dispatchEvent(new CustomEvent("nahwi:tested", { detail: { stars: exam ? 0 : stars(score), passed: passedNow } }));
    result.querySelector(".quiz-stars").textContent = exam ? "" : starText(stars(score));
    result.querySelector(".quiz-score").textContent = exam ? `${right} / ${qs.length}` : T.score.replace("{score}", score.toLocaleString(lang));
    result.querySelector(".quiz-verdict").textContent = ok ? T.passed : T.failed;
    result.dataset.state = passedNow ? "pass" : "fail";
    result.hidden = false;
    phase = "done";
    // Not passed: read the lesson again before the next try.
    if (!passedNow && !exam) {
      const r = read(REREAD, {});
      r[slug] = true;
      write(REREAD, r);
    }
    result.querySelector("[data-again]").hidden = !passedNow && !exam;
    // Passed: the way on (the page's "next" card) is offered right here, under the score.
    const go = document.querySelector(".next[data-gated] a.btn-red");
    const nx = result.querySelector("[data-quiz-next]");
    nx.hidden = !(ok && go);
    if (ok && go) { nx.href = go.href; nx.textContent = go.textContent; }
    result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    if (ok) {
      document.documentElement.dataset.passed = "";
      // The study path again with this score, so the next lesson counts as open on this page too (links, pop-ups).
      const S = window.__study;
      const V = window.__studyVars;
      if (S && V && P) {
        try {
          const pr = P.progress({ path: V.path, tracks: V.tracks }, scores, new Set(read("visited", [])), S.madrasa, { all: !!S.staff });
          Object.assign(S, { scores, open: pr.open, done: pr.done, baseDone: pr.baseDone, levelDone: pr.levelDone, info: pr.info, blocker: pr.blocker, bookDone: pr.bookDone, tracks: pr.tracks, next: V.path[pr.i]?.s });
        } catch {}
      }
      if (S) {
        S.done.add(slug);
        // Links marked locked when the page loaded (scripts/settings-menu.js) lose the lock once they are open.
        for (const l of document.querySelectorAll("main a[data-lock]")) {
          const u = new URL(l.href, location.href);
          const t = u.pathname.match(/\/terms\/([^/]+)\/$/);
          const le = u.pathname.match(/\/study\/([^/]+)\/(\d+)\/$/);
          if ((t && S.open.has(t[1])) || (le && S.info(`${le[1]}-${le[2]}`).open)) delete l.dataset.lock;
        }
      }
      // The way on is under the score now; the card below the test is for a later visit.
      const card = document.querySelector(".next[data-gated]");
      if (card) card.hidden = true;
      document.dispatchEvent(new Event("nahwi:passed"));
      // Tikrār on a schedule (lib/progress.js): a lesson passed for the first time comes back the next day.
      if (P && !exam) {
        const review = read("nahwi-review", {}) || {};
        if (!review[slug]) {
          review[slug] = P.reviewFirst(review[slug], P.dayOf(now()));
          write("nahwi-review", review);
        }
      }
    }
    showBest();
    render();
  };

  all.forEach((q) => {
    q.querySelectorAll(".option").forEach((b) => {
      b.addEventListener("click", () => {
        const k = qs.indexOf(q);
        if (phase !== "test" || k < 0 || k in answers) return;
        const chosen = Number(b.dataset.index);
        const answer = Number(q.dataset.answer);
        q.querySelectorAll(".option").forEach((o) => {
          o.disabled = true;
          const i = Number(o.dataset.index);
          if (i === answer) o.dataset.state = "right";
          else if (i === chosen) o.dataset.state = "wrong";
        });
        q.dataset.state = chosen === answer ? "right" : "wrong";
        q.querySelector(".verdict").textContent = chosen === answer ? T.right : T.wrong;
        q.querySelector(".feedback").hidden = false;
        answers[k] = chosen === answer;
        // The iPhone app taps the phone (lib/app-ios.ts).
        document.dispatchEvent(new CustomEvent("nahwi:answer", { detail: { right: chosen === answer } }));
        if (Object.keys(answers).length === qs.length) finish();
      });
    });
  });

  box.querySelector("[data-again]").addEventListener("click", () => {
    fresh();
    phase = "start";
    render();
    start.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  // Hearts changed elsewhere: another tab, or a refill the account brought here (lib/account-sync.ts).
  window.addEventListener("storage", (e) => { if (e.key === HEARTS) render(); });
  window.addEventListener("nahwi:hearts", () => { refilling = false; render(); });
  setInterval(render, 30000);

  fresh();
  showBest();
  render();
})();
