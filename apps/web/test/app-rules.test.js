import { describe, expect, it } from "vitest";
import { HEARTS_ID, noteForReview, parseTime, REMIND_BASE, REMIND_DAYS, reminderPlan, REVIEW_AFTER, REVIEW_GAP_DAYS } from "../src/lib/app-rules.js";

// The iPhone app's reminders and rating request (src/lib/app-rules.js).
describe("the daily reminders", () => {
  // 25 November 2026, 13:00 local time.
  const now = new Date(2026, 10, 25, 13, 0).getTime();
  it("read a time of day", () => {
    expect(parseTime("20:00")).toEqual([20, 0]);
    expect(parseTime("7:05")).toEqual([7, 5]);
    expect(parseTime("24:00")).toBeNull();
    expect(parseTime("")).toBeNull();
  });
  it("come every day for two weeks at the chosen time, today too if it is still to come", () => {
    const plan = reminderPlan("20:00", now, () => 0);
    expect(plan).toHaveLength(REMIND_DAYS);
    expect(plan[0].day).toBe("2026-11-25");
    expect(new Date(plan[0].at).getHours()).toBe(20);
    expect(plan.at(-1).day).toBe("2026-12-08");
    expect(plan.map((p) => p.id)).toEqual(Array.from({ length: REMIND_DAYS }, (_, i) => REMIND_BASE + i));
    expect(plan.map((p) => p.id)).not.toContain(HEARTS_ID);
  });
  it("start tomorrow when today's time has passed", () => {
    const plan = reminderPlan("08:30", now, () => 0);
    expect(plan[0].day).toBe("2026-11-26");
    expect(plan).toHaveLength(REMIND_DAYS);
  });
  it("carry each day's number of lessons due", () => {
    const due = { "2026-11-25": 2, "2026-11-26": 5 };
    const plan = reminderPlan("20:00", now, (d) => due[d] ?? 0);
    expect(plan.slice(0, 3).map((p) => p.due)).toEqual([2, 5, 0]);
  });
  it("are none without a valid time", () => {
    expect(reminderPlan("later", now, () => 1)).toEqual([]);
  });
});

describe("asking for a rating", () => {
  const t0 = Date.UTC(2026, 10, 25);
  it("waits for five three-star results", () => {
    let s = null;
    for (let i = 1; i < REVIEW_AFTER; i++) {
      const r = noteForReview(s, t0 + i, "stars");
      expect(r.ask).toBe(false);
      s = r.state;
    }
    const r = noteForReview(s, t0 + 10, "stars");
    expect(r.ask).toBe(true);
    expect(r.state).toEqual({ n: 0, last: t0 + 10 });
  });
  it("asks after a finished part, once there was one good result", () => {
    expect(noteForReview(null, t0, "part").ask).toBe(false);
    expect(noteForReview({ n: 1, last: 0 }, t0, "part").ask).toBe(true);
  });
  it("then waits four months", () => {
    const asked = { n: REVIEW_AFTER, last: t0 };
    expect(noteForReview(asked, t0 + 30 * 86400000, "stars").ask).toBe(false);
    expect(noteForReview(asked, t0 + REVIEW_GAP_DAYS * 86400000, "stars").ask).toBe(true);
  });
});
