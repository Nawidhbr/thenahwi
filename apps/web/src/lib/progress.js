// The rules of the study path, in one place: which terms and lessons are open, passed and next, and which books
// have opened. Plain JavaScript without the DOM, so the same code runs in the browser before paint (sent inside
// /<locale>/study-data.js, see lib/study-data.ts, and called by scripts/head-study.js) and in the tests
// (apps/web/test/progress.test.js). Change a rule only together with a test.
//
// data: { path, gates, tracks } from lib/study-data.ts — path: the terms in book order ({ s: slug, q: number of
// questions }); tracks: the books after the first reading ({ id, a: what must be passed first ("terms" or book ids),
// ap: the same per madrasa path for a book on several paths, l: lessons like path, d, v, t, nm }), in any order.
// madrasa: the reader's path ("indian", …), which decides `ap`. scores: { slug: score out of 10 }; visited: slugs seen (for steps without a test).
// opts.all: a moderator or teacher (staff) — every term, book and lesson is open at once; what is passed still
// follows their own scores.

/** Stars from a score out of 10: one from 3, two from 6, three from 8.5. */
export function stars(x) {
  return x >= 8.5 ? 3 : x >= 6 ? 2 : x >= 3 ? 1 : 0;
}

export function progress(data, scores, visited, madrasa, opts = {}) {
  const { path } = data;
  const all = !!(opts && opts.all);
  // What a book needs first: on the reader's madrasa path, if the book stands on several paths (`ap`), else `a`.
  const needs = (k) => (madrasa && k.ap && k.ap[madrasa]) || k.a;
  // Each book after the books it needs, whatever order they come in (a primer may need a book read lesson by lesson).
  const tracks = [];
  const placed = new Set(["terms"]);
  let rest = data.tracks.map((k) => ({ ...k, a: needs(k) }));
  while (rest.length) {
    const ready = rest.filter((k) => k.a.every((x) => placed.has(x) || !rest.some((r) => r.id === x)));
    const take = ready.length ? ready : rest.slice(0, 1);
    for (const k of take) { tracks.push(k); placed.add(k.id); }
    rest = rest.filter((k) => !take.includes(k));
  }
  // Passed: two stars on its test, or, for a step without a test, seen.
  const passed = (p) => (p.q ? stars(scores[p.s] ?? 0) >= 2 : visited.has(p.s));
  // The terms open one at a time: up to and including the first one not yet passed.
  let i = 0;
  while (i < path.length - 1 && passed(path[i])) i++;
  const open = new Set((all ? path : path.slice(0, i + 1)).map((p) => p.s));
  const done = new Set(path.filter((p, k) => k < i || (k === i && passed(p))).map((p) => p.s));
  const baseDone = path.length > 0 && done.has(path[path.length - 1].s);
  // A book opens once everything in its `a` is passed; inside a book the lessons open one by one.
  const tr = {};
  const levelDone = {};
  const bookDone = (id) => (id === "terms" ? baseDone : !!tr[id] && tr[id].opened && tr[id].lessons.every(passed));
  for (const k of tracks) {
    const opened = all || k.a.every(bookDone);
    let j = 0;
    while (opened && j < k.l.length - 1 && passed(k.l[j])) j++;
    tr[k.id] = {
      t: k.t,
      v: k.v,
      d: k.d,
      a: k.a,
      nm: k.nm,
      opened,
      lessons: k.l,
      open: new Set(all ? k.l.map((p) => p.s) : opened ? k.l.slice(0, j + 1).map((p) => p.s) : []),
      done: new Set(opened ? k.l.filter((p, m) => m < j || (m === j && passed(p))).map((p) => p.s) : []),
      next: k.l[j]?.s,
    };
    levelDone[k.v] = (levelDone[k.v] ?? true) && opened && k.l.every(passed);
  }
  // The first thing still to pass before a book opens: the first reading, or a book (with its id), followed down to
  // the first book that is open, so its next lesson can be offered.
  const blocker = (id, depth = 0) => {
    const x = tr[id];
    if (!x || depth > 9) return null;
    for (const dep of x.a) if (!bookDone(dep)) return dep === "terms" ? { terms: true } : blocker(dep, depth + 1) ?? { id: dep, ...tr[dep] };
    return null;
  };
  // A lesson (kati-2) or term: its book (if any), whether it is open, passed, next, and its step.
  const info = (slug) => {
    for (const id in tr) {
      const x = tr[id];
      const p = x.lessons.find((l) => l.s === slug);
      if (p) return { track: id, open: x.open.has(slug), done: x.done.has(slug), next: x.next === slug, step: p };
    }
    const p = path.find((l) => l.s === slug);
    return { track: null, open: open.has(slug), done: done.has(slug), next: path[i]?.s === slug, step: p };
  };
  return { i, open, done, next: path[i]?.s, tracks: tr, baseDone, levelDone, info, blocker, bookDone, passed };
}

/**
 * Access (config/pricing.ts), when payments are on: without an account ("anon") only the preview lessons, with a free
 * account ("free") also the whole free book (al-Mabādiʾ), with full access ("paid") everything.
 */
export function canRead(access, book, freeBook) {
  return access === "paid" || (access === "free" && book === freeBook);
}

/** The reader's access from what the browser keeps: a session (lib/account-sync.ts) and, if paid, until when. */
export function accessOf(signedIn, licence, now) {
  if (!signedIn) return "anon";
  if (licence && licence.paid && (licence.until == null || Date.parse(licence.until) > now)) return "paid";
  return "free";
}


// Tikrār on a schedule (spaced repetition). Each passed lesson has a review entry { due: "YYYY-MM-DD", n: good reviews
// in a row }, kept in the browser (localStorage "nahwi-review"). A lesson passed for the first time comes back the
// next day; every review with two stars moves it to the next interval, a review with fewer brings it back the next day.

/** Days until the next review, after 0, 1, 2, … good reviews in a row (the last one repeats). */
export const REVIEW_DAYS = [1, 3, 7, 14, 30, 60, 120];

/** The calendar day `n` days after `day` (both "YYYY-MM-DD"). */
export function addDays(day, n) {
  const d = new Date(`${day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** The reader's own calendar day of a moment (not UTC, so a review is due from local midnight). */
export function dayOf(now) {
  const d = new Date(now);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** The entry of a lesson just passed for the first time; an entry already there is kept. */
export function reviewFirst(entry, today) {
  return entry ?? { due: addDays(today, REVIEW_DAYS[0]), n: 0 };
}

/** The entry after a review of the lesson with a score out of 10. */
export function reviewAfter(entry, score, today) {
  const n = stars(score) >= 2 ? (entry?.n ?? 0) + 1 : 0;
  return { due: addDays(today, REVIEW_DAYS[Math.min(n, REVIEW_DAYS.length - 1)]), n };
}

/**
 * The lessons to review today, at most `limit`: first those due (the longest overdue first), then passed lessons that
 * have no entry yet (passed before the schedule existed), in the order given, so a long list never comes at once.
 * passed: the passed lessons in book order; review: { slug: entry }.
 */
export function reviewQueue(review, passed, today, limit = 5) {
  const due = passed.filter((s) => review[s] && review[s].due <= today).sort((a, b) => review[a].due.localeCompare(review[b].due));
  const fresh = passed.filter((s) => !review[s]);
  return [...due, ...fresh].slice(0, limit);
}

/** The next day a passed lesson is due, if none is due today; null if nothing is scheduled. */
export function nextReview(review, passed, today) {
  const days = passed.map((s) => review[s]?.due).filter((d) => d && d > today).sort();
  return days[0] ?? null;
}

// The daily goal: how many tests (a lesson's test or a review) the reader took on each day, kept in the browser
// (localStorage "nahwi-days", { "YYYY-MM-DD": n }), for the study page's "Today" card.

/** The days after one more test today; days older than `keep` days are dropped. */
export function logDay(days, today, keep = 120) {
  const from = addDays(today, -keep);
  const out = {};
  for (const [d, n] of Object.entries(days || {})) if (d > from && d <= today) out[d] = n;
  out[today] = (out[today] ?? 0) + 1;
  return out;
}

/** Days in a row with at least one test, up to today (or up to yesterday, while today has none yet). */
export function streak(days, today) {
  let d = days[today] ? today : addDays(today, -1);
  let n = 0;
  while (days[d] > 0) {
    n++;
    d = addDays(d, -1);
  }
  return n;
}

// The progress page (pages/[locale]/study/progress.astro): how the reader stands, from the same browser data.

/** The average score out of 10 of the lessons given that have one, to one decimal; null if none has. */
export function average(scores, slugs) {
  const xs = slugs.map((s) => scores[s]).filter((x) => typeof x === "number");
  return xs.length ? Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10 : null;
}

/** The passed lessons worth strengthening: below three stars, the lowest score first (book order on a tie), at most `limit`. */
export function weakest(scores, passed, limit = 5) {
  return passed
    .map((s, i) => ({ s, i, x: scores[s] }))
    .filter((p) => typeof p.x === "number" && stars(p.x) < 3)
    .sort((a, b) => a.x - b.x || a.i - b.i)
    .slice(0, limit)
    .map((p) => p.s);
}

/** The last `n` days up to today, oldest first, each with the number of tests taken that day. */
export function activity(days, today, n = 30) {
  return Array.from({ length: n }, (_, k) => {
    const day = addDays(today, k - n + 1);
    return { day, n: days?.[day] ?? 0 };
  });
}

// Hearts: a test takes one. A reader has at most five; one comes back every two hours, and a refill gives all five
// at once: a free one (every account starts with one, and earns another for three stars on five lessons in a row) or
// one bought with Paddle. They pace the study, so nobody races through the lessons. Kept as { n, at, r, f, s }: n
// hearts at the moment at (ms), r the moment of the last refill (ms, or 0), f the free refills in hand, s the run of
// three-star lessons towards the next one. Tikrār (the review tests) takes no heart.
export const HEARTS_MAX = 5;
export const HEART_MS = 2 * 60 * 60 * 1000;
/** Free refills a new reader has, and the run of three-star lessons that earns one more. */
export const FREE_REFILLS = 1;
export const RUN_FOR_REFILL = 5;

const extra = (state) => ({ f: typeof state?.f === "number" ? Math.max(0, Math.floor(state.f)) : FREE_REFILLS, s: typeof state?.s === "number" ? Math.max(0, Math.floor(state.s)) : 0 });

/** The hearts now, with the moment the next comes back (null when full). */
export function heartsNow(state, now) {
  const x = extra(state);
  if (!state || typeof state.n !== "number" || typeof state.at !== "number") return { n: HEARTS_MAX, at: now, r: state?.r || 0, ...x, next: null };
  const n0 = Math.max(0, Math.min(HEARTS_MAX, Math.floor(state.n)));
  if (n0 >= HEARTS_MAX || state.at > now) return { n: n0, at: Math.min(state.at, now), r: state.r || 0, ...x, next: n0 >= HEARTS_MAX ? null : Math.min(state.at, now) + HEART_MS };
  const k = Math.floor((now - state.at) / HEART_MS);
  const n = Math.min(HEARTS_MAX, n0 + k);
  const at = n >= HEARTS_MAX ? now : state.at + k * HEART_MS;
  return { n, at, r: state.r || 0, ...x, next: n >= HEARTS_MAX ? null : at + HEART_MS };
}

/** The moment all five hearts are back, with no test in between (null when they are already); the iPhone app's note. */
export function heartsFullAt(state, now) {
  const h = heartsNow(state, now);
  return h.n >= HEARTS_MAX ? null : h.at + (HEARTS_MAX - h.n) * HEART_MS;
}

const keep = (h) => ({ n: h.n, at: h.at, r: h.r || 0, f: h.f, s: h.s });

/** The hearts after starting a test, or null when there is none left. A full set starts its clock now. */
export function spendHeart(state, now) {
  const h = heartsNow(state, now);
  if (h.n < 1) return null;
  return keep({ ...h, n: h.n - 1, at: h.n >= HEARTS_MAX ? now : h.at });
}

/** All five hearts back, from a refill (bought, or written by the account) at the moment `at`. */
export function refillHearts(state, at) {
  return keep({ ...heartsNow(state, at), n: HEARTS_MAX, at, r: at });
}

/** All five hearts back from a free refill, or null when there is none in hand. */
export function useFreeRefill(state, now) {
  const h = heartsNow(state, now);
  if (h.f < 1) return null;
  return keep({ ...h, n: HEARTS_MAX, at: now, r: now, f: h.f - 1 });
}

/**
 * After a lesson test: a first three stars on a lesson (its best score was below 8.5) adds to the run, and five in
 * a row earn a free refill; a test under three stars ends the run. Three stars again on a lesson that had them
 * already neither adds nor ends it. Returns { state, earned }.
 */
export function countTest(state, now, before, score) {
  const h = heartsNow(state, now);
  const three = score >= 8.5;
  if (!three) return { state: keep({ ...h, s: 0 }), earned: false };
  if (typeof before === "number" && before >= 8.5) return { state: keep(h), earned: false };
  const run = h.s + 1;
  if (run >= RUN_FOR_REFILL) return { state: keep({ ...h, s: 0, f: h.f + 1 }), earned: true };
  return { state: keep({ ...h, s: run }), earned: false };
}

/**
 * Two copies of the hearts (this browser and the account): the one with the later refill, else the one with fewer
 * hearts now, so clearing a browser does not give the hearts back and a refill on one device reaches the others.
 * Free refills earned on either copy are kept, unless the later refill used one.
 */
export function mergeHearts(a, b, now) {
  if (!a) return b ? heartsNow(b, now) : null;
  if (!b) return heartsNow(a, now);
  const x = heartsNow(a, now);
  const y = heartsNow(b, now);
  // A copy written by the payment webhook carries no free refills: those of the other copy stay.
  const fx = typeof a.f === "number", fy = typeof b.f === "number";
  if ((x.r || 0) !== (y.r || 0)) {
    const [w, o, fw] = (x.r || 0) > (y.r || 0) ? [x, y, fx] : [y, x, fy];
    return fw ? w : { ...w, f: o.f, s: o.s };
  }
  const w = x.n <= y.n ? x : y;
  return { ...w, f: Math.max(x.f, y.f), s: Math.max(x.s, y.s) };
}

// One test asks a few of a lesson's questions: a lesson with seven or more keeps two in reserve, which rotate in on
// the next try; questions and their answers are shuffled each time. `rng` is Math.random in the browser.

/** How many questions one test asks from a pool of `pool` (or the lesson's own `ask`). */
export function askOf(pool, ask) {
  if (ask && ask > 0) return Math.min(ask, pool);
  return pool >= 7 ? pool - 2 : pool;
}

/** The order of 0…n-1 shuffled (Fisher–Yates). */
export function shuffled(n, rng) {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * The questions of one test: `ask` of the pool, in a random order. The questions left out last time (`last`, their
 * indices) come in first, so a retry brings in the reserves.
 */
export function pickQuestions(pool, ask, rng, last = []) {
  const order = shuffled(pool, rng);
  const before = new Set(last);
  const fresh = order.filter((i) => !before.has(i));
  const again = order.filter((i) => before.has(i));
  const pick = before.size ? [...fresh, ...again].slice(0, ask) : order.slice(0, ask);
  const out = shuffled(pick.length, rng).map((k) => pick[k]);
  return out;
}

// The certificate's exam: 25 questions drawn from all the book's lessons, with 20 right to pass. Its score (out of
// 10) is kept with the others under "exam-<book>".
export const EXAM_SIZE = 25;
export const EXAM_PASS = 20;
export const examKey = (book) => `exam-${book}`;
/** The exam's score out of 10 from the right answers. */
export function examScore(right, total = EXAM_SIZE) {
  return Math.round((right / total) * 100) / 10;
}
/** Whether the book's exam is passed (20 of 25, a score of 8). */
export function examPassed(scores, book) {
  return (scores?.[examKey(book)] ?? 0) >= examScore(EXAM_PASS);
}
