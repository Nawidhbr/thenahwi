// The iPhone app's own rules (lib/app-ios.ts, lib/app-store.ts): the daily reminders, when to ask for a rating, and
// how RevenueCat's answers are read. Kept apart from the native calls, so they are tested (test/app-rules.test.js).
// Study rules stay in lib/progress.js.

/** Notification ids: the daily reminders take REMIND_BASE … REMIND_BASE + REMIND_DAYS − 1, the hearts note one more. */
export const REMIND_BASE = 100;
export const REMIND_DAYS = 14;
export const HEARTS_ID = 90;

/** "HH:MM" → [hours, minutes], or null for anything else. */
export function parseTime(value) {
  const m = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(String(value || "").trim());
  return m ? [Number(m[1]), Number(m[2])] : null;
}

/**
 * The daily reminders from `now` (ms): one at the reader's time on each of the next REMIND_DAYS days (today too, if
 * that time is still to come), each with that day's number of lessons due for review, from `dueOn(day)` with the day
 * as "YYYY-MM-DD" in local time. Scheduled ahead, and again each time the app opens a study page, so the numbers
 * follow the reviews done meanwhile; a reader who stops opening the app stops getting them after two weeks.
 */
export function reminderPlan(time, now, dueOn) {
  const t = parseTime(time);
  if (!t) return [];
  const out = [];
  for (let k = 0; out.length < REMIND_DAYS && k <= REMIND_DAYS; k++) {
    const at = new Date(now);
    at.setDate(at.getDate() + k);
    at.setHours(t[0], t[1], 0, 0);
    if (at.getTime() <= now) continue;
    const day = `${at.getFullYear()}-${String(at.getMonth() + 1).padStart(2, "0")}-${String(at.getDate()).padStart(2, "0")}`;
    out.push({ id: REMIND_BASE + out.length, at: at.getTime(), day, due: Math.max(0, Number(dueOn(day)) || 0) });
  }
  return out;
}

/** Three-star results before the first request for a rating, and the days between two requests at most. */
export const REVIEW_AFTER = 5;
export const REVIEW_GAP_DAYS = 120;

/**
 * Whether to show the system's rating window now, after `what` happened: "stars" (a test with three stars) or "part"
 * (a part of the course finished). Only at such a good moment, never during a lesson: after REVIEW_AFTER three-star
 * results or a finished part, and then not again for REVIEW_GAP_DAYS (Apple shows it at most three times a year
 * anyway). state: { n: three-star results since the last request, last: ms of the last request or 0 }.
 * Returns { state, ask }.
 */
export function noteForReview(state, now, what) {
  const n = (Number(state?.n) || 0) + (what === "stars" ? 1 : 0);
  const last = Number(state?.last) || 0;
  const rested = !last || now - last >= REVIEW_GAP_DAYS * 86400000;
  const ask = rested && (n >= REVIEW_AFTER || (what === "part" && n > 0));
  return ask ? { state: { n: 0, last: now }, ask } : { state: { n, last }, ask };
}

/**
 * The package of a plan ("yearly" or "monthly") in RevenueCat's current offering: by its type, else by RevenueCat's
 * default identifiers "$rc_annual" and "$rc_monthly"; null when the offering has none.
 */
export function packageOf(offerings, plan) {
  const all = offerings?.current?.availablePackages || [];
  const [type, id] = plan === "monthly" ? ["MONTHLY", "$rc_monthly"] : ["ANNUAL", "$rc_annual"];
  return all.find((p) => p.packageType === type) || all.find((p) => p.identifier === id) || null;
}

/** RevenueCat's answer when the reader closed Apple's purchase sheet: error code 1, or userCancelled. */
export function cancelled(e) {
  return String(e?.code ?? "") === "1" || !!e?.userCancelled || !!e?.data?.userCancelled;
}
