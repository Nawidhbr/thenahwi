import { describe, expect, it } from "vitest";
import { NUDGE, nudgeDue } from "../src/scripts/support-nudge.ts";

// When the support window may open by itself (src/scripts/support-nudge.ts): now and then, never often, never in the way.

const page = { path: "/en/scholars/abhari/", quiet: true, paid: false };
const now = Date.parse("2026-11-10T12:00:00Z");

describe("the support window opening by itself", () => {
  it("waits until a reader has read several pages", () => {
    expect(nudgeDue({ n: NUDGE.pages - 1, next: 0 }, now, page)).toBe(false);
    expect(nudgeDue({ n: NUDGE.pages, next: 0 }, now, page)).toBe(true);
  });
  it("waits until the time since the last ask is over", () => {
    expect(nudgeDue({ n: 20, next: now + 1000 }, now, page)).toBe(false);
    expect(nudgeDue({ n: 20, next: now - 1000 }, now, page)).toBe(true);
  });
  it("never asks a reader with full access, on a busy page, or on the account, prices and legal pages", () => {
    const s = { n: 20, next: 0 };
    expect(nudgeDue(s, now, { ...page, paid: true })).toBe(false);
    expect(nudgeDue(s, now, { ...page, quiet: false })).toBe(false);
    for (const p of ["/en/account/", "/nl/pricing/", "/en/terms-of-service/", "/en/refunds/", "/en/privacy/", "/en/contact/"]) {
      expect(nudgeDue(s, now, { ...page, path: p })).toBe(false);
    }
  });
  it("waits longer after 'Not now' and much longer after a gift", () => {
    expect(NUDGE.later).toBeGreaterThan(NUDGE.shown);
    expect(NUDGE.gave).toBeGreaterThan(NUDGE.later);
  });
});
