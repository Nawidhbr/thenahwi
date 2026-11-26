import { describe, expect, it } from "vitest";
import { accessOf, activity, addDays, askOf, countTest, FREE_REFILLS, RUN_FOR_REFILL, useFreeRefill, average, canRead, dayOf, EXAM_SIZE, examKey, examPassed, examScore, HEART_MS, HEARTS_MAX, heartsFullAt, heartsNow, logDay, mergeHearts, nextReview, pickQuestions, progress, refillHearts, REVIEW_DAYS, reviewAfter, reviewFirst, reviewQueue, shuffled, spendHeart, stars, streak, weakest } from "../src/lib/progress.js";

// The rules of the study path (src/lib/progress.js), on a small made-up course: three terms (the second without a
// test), a book A that opens after the terms, and a book B that opens after A.
const data = {
  path: [{ s: "t1", q: 3 }, { s: "t2", q: 0 }, { s: "t3", q: 3 }],
  tracks: [
    { id: "a", a: ["terms"], v: 2, d: 2, l: [{ s: "a-1", q: 3 }, { s: "a-2", q: 3 }] },
    { id: "b", a: ["a"], v: 3, d: 3, l: [{ s: "b-1", q: 3 }, { s: "b-2", q: 3 }] },
  ],
};
const run = (scores = {}, visited = []) => progress(data, scores, new Set(visited));
const allTerms = { t1: 10, t3: 10 };

describe("staff (moderators and the teacher)", () => {
  const staff = (scores = {}, visited = []) => progress(data, scores, new Set(visited), undefined, { all: true });
  it("open every term, book and lesson at once", () => {
    const p = staff();
    expect([...p.open]).toEqual(["t1", "t2", "t3"]);
    expect(p.tracks.a.opened && p.tracks.b.opened).toBe(true);
    expect([...p.tracks.b.open]).toEqual(["b-1", "b-2"]);
    expect(p.info("b-2").open).toBe(true);
  });
  it("still count as passed only what their own scores pass", () => {
    const p = staff({ t1: 10, "b-1": 2 });
    expect([...p.done]).toEqual(["t1"]);
    expect(p.tracks.b.done.size).toBe(0);
    expect(p.baseDone).toBe(false);
    expect(p.levelDone[3]).toBe(false);
  });
  it("leave everyone else on the path", () => {
    expect([...run().open]).toEqual(["t1"]);
    expect(run().tracks.a.opened).toBe(false);
  });
});

describe("stars", () => {
  it("gives one star from 3, two from 6, three from 8.5", () => {
    expect([0, 2.9, 3, 5.9, 6, 8.4, 8.5, 10].map(stars)).toEqual([0, 0, 1, 1, 2, 2, 3, 3]);
  });
});

describe("the terms", () => {
  it("open one at a time: with nothing passed only the first", () => {
    const p = run();
    expect([...p.open]).toEqual(["t1"]);
    expect(p.done.size).toBe(0);
    expect(p.next).toBe("t1");
  });
  it("need two stars (6 of 10) to open the next", () => {
    expect(run({ t1: 5.9 }).open.has("t2")).toBe(false);
    expect(run({ t1: 6 }).open.has("t2")).toBe(true);
  });
  it("a step without a test counts as passed once seen", () => {
    expect(run({ t1: 10 }).open.has("t3")).toBe(false);
    expect(run({ t1: 10 }, ["t2"]).open.has("t3")).toBe(true);
  });
  it("a passed term stays passed; the last one passed means the first reading is done", () => {
    const p = run(allTerms, ["t2"]);
    expect([...p.done]).toEqual(["t1", "t2", "t3"]);
    expect(p.baseDone).toBe(true);
    expect(run({ t1: 10, t3: 4 }, ["t2"]).baseDone).toBe(false);
  });
});

describe("the books after the first reading", () => {
  it("stay closed until what comes before is passed, and say what that is", () => {
    const p = run({ t1: 10 });
    expect(p.tracks.a.opened).toBe(false);
    expect(p.tracks.a.open.size).toBe(0);
    expect(p.blocker("a")).toEqual({ terms: true });
    expect(p.blocker("b")).toEqual({ terms: true });
  });
  it("open their lessons one by one once open", () => {
    const p = run(allTerms, ["t2"]);
    expect(p.tracks.a.opened).toBe(true);
    expect([...p.tracks.a.open]).toEqual(["a-1"]);
    expect(p.tracks.a.next).toBe("a-1");
    const q = run({ ...allTerms, "a-1": 7 }, ["t2"]);
    expect([...q.tracks.a.open]).toEqual(["a-1", "a-2"]);
  });
  it("a book opens only when every lesson of the book before it is passed", () => {
    const half = run({ ...allTerms, "a-1": 10 }, ["t2"]);
    expect(half.tracks.b.opened).toBe(false);
    expect(half.blocker("b")).toMatchObject({ id: "a", next: "a-2" });
    const whole = run({ ...allTerms, "a-1": 10, "a-2": 6 }, ["t2"]);
    expect(whole.tracks.b.opened).toBe(true);
    expect(whole.blocker("b")).toBe(null);
    expect(whole.levelDone[2]).toBe(true);
    expect(whole.levelDone[3]).toBe(false);
  });
  it("scores of a closed book do not open its lessons", () => {
    const p = run({ "a-1": 10, "a-2": 10 });
    expect(p.tracks.a.opened).toBe(false);
    expect(p.tracks.a.done.size).toBe(0);
  });
});

describe("info", () => {
  it("tells for a term or lesson whether it is open, passed and next", () => {
    const p = run({ ...allTerms, "a-1": 10 }, ["t2"]);
    expect(p.info("t1")).toMatchObject({ track: null, open: true, done: true });
    expect(p.info("a-1")).toMatchObject({ track: "a", open: true, done: true, next: false });
    expect(p.info("a-2")).toMatchObject({ track: "a", open: true, done: false, next: true });
    expect(p.info("b-1")).toMatchObject({ track: "b", open: false });
  });
});

describe("access (when payments are on)", () => {
  it("without an account, no book is readable beyond its previews", () => {
    expect(canRead("anon", "isaghuji", "isaghuji")).toBe(false);
    expect(canRead("anon", "kati", "isaghuji")).toBe(false);
  });
  it("a free account opens the free book only", () => {
    expect(canRead("free", "isaghuji", "isaghuji")).toBe(true);
    expect(canRead("free", "sughra", "isaghuji")).toBe(false);
  });
  it("full access opens everything", () => {
    expect(canRead("paid", "tahdhib", "isaghuji")).toBe(true);
  });
  it("reads the access from the session and the licence", () => {
    const now = Date.parse("2026-11-08T12:00:00Z");
    expect(accessOf(false, { paid: true, until: null }, now)).toBe("anon");
    expect(accessOf(true, null, now)).toBe("free");
    expect(accessOf(true, { paid: true, until: null }, now)).toBe("paid");
    expect(accessOf(true, { paid: true, until: "2026-12-08T00:00:00Z" }, now)).toBe("paid");
    expect(accessOf(true, { paid: true, until: "2026-11-01T00:00:00Z" }, now)).toBe("free");
    expect(accessOf(true, { paid: false }, now)).toBe("free");
  });
});

describe("books in any order, and books on several paths", () => {
  // A primer (p) comes first in the list but needs book b, which comes after it; book q stands on two paths and needs
  // a on the "ottoman" path but b on the "indian" one.
  const mixed = {
    path: data.path,
    tracks: [
      { id: "p", a: ["b"], v: 1, d: 4, l: [{ s: "p-1", q: 3 }] },
      { id: "q", a: ["a"], ap: { ottoman: ["a"], indian: ["b"] }, v: 1, d: 4, l: [{ s: "q-1", q: 3 }] },
      ...data.tracks,
    ],
  };
  const doneA = { ...allTerms, "a-1": 10, "a-2": 10 };
  const doneB = { ...doneA, "b-1": 10, "b-2": 10 };
  it("a book listed before the book it needs opens once that book is passed", () => {
    expect(progress(mixed, doneA, new Set(["t2"])).tracks.p.opened).toBe(false);
    expect(progress(mixed, doneB, new Set(["t2"])).tracks.p.opened).toBe(true);
  });
  it("a book on several paths opens by what the reader's own path needs", () => {
    expect(progress(mixed, doneA, new Set(["t2"]), "ottoman").tracks.q.opened).toBe(true);
    expect(progress(mixed, doneA, new Set(["t2"]), "indian").tracks.q.opened).toBe(false);
    expect(progress(mixed, doneB, new Set(["t2"]), "indian").tracks.q.opened).toBe(true);
    // Without a chosen path, its first place counts.
    expect(progress(mixed, doneA, new Set(["t2"])).tracks.q.opened).toBe(true);
  });
});

describe("tikrār on a schedule", () => {
  const today = "2026-11-14";
  it("counts calendar days, across months and years", () => {
    expect(addDays("2026-11-14", 1)).toBe("2026-11-15");
    expect(addDays("2026-11-30", 3)).toBe("2026-12-03");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(dayOf(new Date(2026, 10, 14, 23, 59).getTime())).toBe("2026-11-14");
  });
  it("a lesson passed for the first time comes back the next day; an entry already there is kept", () => {
    expect(reviewFirst(undefined, today)).toEqual({ due: "2026-11-15", n: 0 });
    const kept = { due: "2026-12-01", n: 3 };
    expect(reviewFirst(kept, today)).toBe(kept);
  });
  it("each review with two stars moves the lesson to the next interval", () => {
    let e = reviewFirst(undefined, today);
    const dues = [];
    for (let k = 0; k < REVIEW_DAYS.length; k++) {
      e = reviewAfter(e, 10, today);
      dues.push(e.due);
    }
    expect(dues).toEqual(["2026-11-17", "2026-11-21", "2026-11-28", "2026-12-14", "2027-01-13", "2027-03-14", "2027-03-14"]);
    expect(reviewAfter({ due: today, n: 0 }, 6, today)).toEqual({ due: "2026-11-17", n: 1 });
  });
  it("a review with fewer than two stars brings the lesson back the next day and starts the count again", () => {
    expect(reviewAfter({ due: today, n: 4 }, 5.9, today)).toEqual({ due: "2026-11-15", n: 0 });
  });
  it("today's queue: the longest overdue first, then lessons never scheduled, at most the limit", () => {
    const review = { a: { due: "2026-11-14", n: 1 }, b: { due: "2026-11-10", n: 2 }, c: { due: "2026-11-20", n: 1 } };
    expect(reviewQueue(review, ["a", "b", "c", "d", "e"], today)).toEqual(["b", "a", "d", "e"]);
    expect(reviewQueue(review, ["a", "b", "c", "d", "e"], today, 2)).toEqual(["b", "a"]);
    expect(reviewQueue({}, [], today)).toEqual([]);
  });
  it("lessons not passed are never queued, and the next review is the nearest future day", () => {
    const review = { a: { due: "2026-11-01", n: 1 }, c: { due: "2026-11-20", n: 1 }, d: { due: "2026-11-16", n: 0 } };
    expect(reviewQueue(review, ["c", "d"], today)).toEqual([]);
    expect(nextReview(review, ["c", "d"], today)).toBe("2026-11-16");
    expect(nextReview({}, ["c"], today)).toBe(null);
  });
});

describe("the daily goal", () => {
  const today = "2026-11-14";
  it("counts the tests of each day and drops days older than the window", () => {
    let days = logDay({}, today);
    days = logDay(days, today);
    expect(days).toEqual({ "2026-11-14": 2 });
    expect(logDay({ "2026-06-01": 3, "2026-11-13": 1 }, today)).toEqual({ "2026-11-13": 1, "2026-11-14": 1 });
  });
  it("counts the days in a row up to today, or up to yesterday while today has none yet", () => {
    const days = { "2026-11-11": 1, "2026-11-12": 2, "2026-11-13": 1 };
    expect(streak(days, today)).toBe(3);
    expect(streak({ ...days, "2026-11-14": 1 }, today)).toBe(4);
    expect(streak({ "2026-11-12": 1 }, today)).toBe(0);
    expect(streak({}, today)).toBe(0);
  });
});

describe("the progress page", () => {
  it("averages the scores the lessons have, to one decimal", () => {
    expect(average({ a: 10, b: 7, c: 6 }, ["a", "b", "c"])).toBe(7.7);
    expect(average({ a: 10 }, ["a", "missing"])).toBe(10);
    expect(average({}, ["a"])).toBeNull();
  });
  it("lists the passed lessons below three stars, the lowest first, book order on a tie", () => {
    const scores = { t1: 10, t3: 6, "a-1": 7, "a-2": 6, "b-1": 9 };
    expect(weakest(scores, ["t1", "t3", "a-1", "a-2", "b-1"])).toEqual(["t3", "a-2", "a-1"]);
    expect(weakest(scores, ["t1", "t3", "a-1", "a-2"], 2)).toEqual(["t3", "a-2"]);
    expect(weakest({ t1: 10 }, ["t1"])).toEqual([]);
  });
  it("gives the last days up to today, oldest first, with the tests of each", () => {
    const a = activity({ "2026-11-14": 2, "2026-11-01": 5 }, "2026-11-15", 3);
    expect(a).toEqual([{ day: "2026-11-13", n: 0 }, { day: "2026-11-14", n: 2 }, { day: "2026-11-15", n: 0 }]);
    expect(activity({}, "2026-03-01", 30)).toHaveLength(30);
    expect(activity({}, "2026-03-01", 30)[0].day).toBe("2026-01-31");
  });
});

describe("hearts", () => {
  const t0 = Date.UTC(2026, 10, 18, 12);
  it("start full, and a test takes one", () => {
    expect(heartsNow(null, t0)).toMatchObject({ n: HEARTS_MAX, next: null });
    const s = spendHeart(null, t0);
    expect(s).toEqual({ n: 4, at: t0, r: 0, f: FREE_REFILLS, s: 0 });
    expect(heartsNow(s, t0).next).toBe(t0 + HEART_MS);
  });
  it("come back one every two hours, never above five", () => {
    let s = null;
    for (let k = 0; k < 5; k++) s = spendHeart(s, t0);
    expect(heartsNow(s, t0).n).toBe(0);
    expect(spendHeart(s, t0)).toBeNull();
    expect(heartsNow(s, t0 + HEART_MS - 1).n).toBe(0);
    expect(heartsNow(s, t0 + HEART_MS).n).toBe(1);
    expect(heartsNow(s, t0 + 3.5 * HEART_MS)).toMatchObject({ n: 3, next: t0 + 4 * HEART_MS });
    expect(heartsNow(s, t0 + 50 * HEART_MS)).toMatchObject({ n: 5, next: null });
  });
  it("a heart spent while some are back keeps the clock running", () => {
    let s = spendHeart(spendHeart(null, t0), t0); // 3 left at t0
    s = spendHeart(s, t0 + 1.5 * HEART_MS); // one heart came back at t0 + H; spent again: 3 left, counting on from t0 + H
    expect(s).toMatchObject({ n: 3, at: t0 + HEART_MS, r: 0 });
    expect(heartsNow(s, t0 + 2 * HEART_MS).n).toBe(4);
  });
  it("a refill gives all five", () => {
    let s = null;
    for (let k = 0; k < 5; k++) s = spendHeart(s, t0);
    expect(heartsNow(refillHearts(s, t0 + 10), t0 + 10)).toMatchObject({ n: 5, r: t0 + 10 });
  });
  it("merging two copies: the later refill wins, else the fewer hearts", () => {
    const few = { n: 1, at: t0, r: 0 };
    const many = { n: 4, at: t0, r: 0 };
    expect(mergeHearts(few, many, t0).n).toBe(1);
    expect(mergeHearts(many, few, t0).n).toBe(1);
    const refilled = { n: 5, at: t0 + 5, r: t0 + 5 };
    expect(mergeHearts(few, refilled, t0 + 6).n).toBe(5);
    expect(mergeHearts(null, few, t0).n).toBe(1);
    expect(mergeHearts(few, null, t0).n).toBe(1);
  });
});

describe("questions of one test", () => {
  const rng = (() => { let x = 7; return () => ((x = (x * 9301 + 49297) % 233280) / 233280); })();
  it("ask all of a small pool, keep two in reserve from seven", () => {
    expect(askOf(3)).toBe(3);
    expect(askOf(5)).toBe(5);
    expect(askOf(7)).toBe(5);
    expect(askOf(9)).toBe(7);
    expect(askOf(9, 6)).toBe(6);
    expect(askOf(4, 6)).toBe(4);
  });
  it("shuffle keeps every index once", () => {
    expect([...shuffled(9, rng)].sort()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });
  it("a retry brings in the questions left out", () => {
    const first = pickQuestions(7, 5, rng);
    expect(new Set(first).size).toBe(5);
    const left = [0, 1, 2, 3, 4, 5, 6].filter((i) => !first.includes(i));
    const second = pickQuestions(7, 5, rng, first);
    for (const i of left) expect(second).toContain(i);
    expect(new Set(second).size).toBe(5);
  });
});

describe("the certificate exam", () => {
  it("25 questions, 20 right to pass", () => {
    expect(EXAM_SIZE).toBe(25);
    expect(examScore(20)).toBe(8);
    expect(examPassed({ [examKey("sughra")]: 8 }, "sughra")).toBe(true);
    expect(examPassed({ [examKey("sughra")]: 7.6 }, "sughra")).toBe(false);
    expect(examPassed({}, "sughra")).toBe(false);
  });
});

describe("free refills", () => {
  const t0 = Date.UTC(2026, 10, 18, 22);
  const empty = { n: 0, at: t0, r: 0 };
  it("every reader starts with one, and using it gives all five hearts", () => {
    expect(heartsNow(null, t0).f).toBe(1);
    const s = useFreeRefill(empty, t0 + 5);
    expect(s).toMatchObject({ n: 5, r: t0 + 5, f: 0 });
    expect(useFreeRefill(s, t0 + 6)).toBeNull();
  });
  it("three stars on five lessons in a row earn one; under three stars ends the run", () => {
    let st = { n: 5, at: t0, r: 0, f: 0, s: 0 };
    for (let k = 0; k < RUN_FOR_REFILL - 1; k++) st = countTest(st, t0, undefined, 10).state;
    expect(st.s).toBe(4);
    const r = countTest(st, t0, 6, 9);
    expect(r.earned).toBe(true);
    expect(r.state).toMatchObject({ f: 1, s: 0 });
    expect(countTest({ ...st, s: 3 }, t0, undefined, 8).state.s).toBe(0);
  });
  it("three stars again on a lesson that had them neither counts nor ends the run", () => {
    const st = { n: 5, at: t0, r: 0, f: 0, s: 2 };
    const r = countTest(st, t0, 9, 10);
    expect(r).toMatchObject({ earned: false, state: { s: 2 } });
  });
  it("merging keeps free refills: the webhook's refill carries none, and earned ones stay", () => {
    const local = { n: 0, at: t0, r: 0, f: 2, s: 3 };
    const bought = { n: 5, at: t0 + 10, r: t0 + 10 };
    expect(mergeHearts(local, bought, t0 + 11)).toMatchObject({ n: 5, f: 2, s: 3 });
    const used = { n: 5, at: t0 + 20, r: t0 + 20, f: 1, s: 0 };
    expect(mergeHearts(local, used, t0 + 21)).toMatchObject({ n: 5, f: 1 });
    expect(mergeHearts({ n: 3, at: t0, r: 0, f: 1, s: 0 }, { n: 2, at: t0, r: 0, f: 2, s: 4 }, t0)).toMatchObject({ n: 2, f: 2, s: 4 });
  });
});

describe("when the hearts are full again (the iPhone app's note)", () => {
  const t0 = Date.UTC(2026, 10, 18, 12);
  it("is never while they are full", () => {
    expect(heartsFullAt(null, t0)).toBeNull();
    expect(heartsFullAt({ n: 5, at: t0, r: 0 }, t0)).toBeNull();
  });
  it("is two hours for every heart missing, from the last one that came back", () => {
    const one = spendHeart(null, t0);
    expect(heartsFullAt(one, t0)).toBe(t0 + HEART_MS);
    const three = { n: 2, at: t0, r: 0 };
    expect(heartsFullAt(three, t0 + 10)).toBe(t0 + 3 * HEART_MS);
    // An hour and a half later one heart is back: still the same moment.
    expect(heartsFullAt(three, t0 + HEART_MS + 30 * 60 * 1000)).toBe(t0 + 3 * HEART_MS);
    expect(heartsFullAt(three, t0 + 3 * HEART_MS)).toBeNull();
  });
});
