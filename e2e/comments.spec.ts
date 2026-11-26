import { expect, test, type Page, type Route } from "@playwright/test";
import { readFileSync } from "node:fs";
import { ACCOUNTS } from "./flags";

// Questions and remarks under a lesson (components/LessonComments.astro) and the moderation page. Supabase is not
// contacted: every request to it is answered here, like in account.spec.ts.

const SUPABASE = "https://replace-with-the-nahwi-project.supabase.co";
const bundle = JSON.parse(readFileSync(new URL("../packages/content/generated/terms.json", import.meta.url), "utf8"));
const terms: { slug: string }[] = Array.isArray(bundle) ? bundle : bundle.terms;
const first = terms[0].slug;

const user = { id: "11111111-1111-1111-1111-111111111111", aud: "authenticated", role: "authenticated", email: "learner@example.org", app_metadata: { provider: "google" }, user_metadata: { full_name: "Amina Yusuf" }, created_at: "2026-11-08T12:00:00Z" };
const session = () => ({ access_token: "test-access", refresh_token: "test-refresh", token_type: "bearer", expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, user });

const published = [
  { id: "c1", locale: "en", body: "Why is animal a genus and not a species?", display_name: "Yusuf", reply: "Because it is said of things that differ in kind.", replied_at: "2026-11-20T10:00:00Z", created_at: "2026-11-19T09:00:00Z" },
  { id: "c2", locale: "nl", body: "Dank, heel helder.\nNog een regel.", display_name: null, reply: null, replied_at: null, created_at: "2026-11-20T09:00:00Z" },
  { id: "c3", locale: "en", body: "<img src=x onerror=alert(1)> stays text", display_name: "<b>Bold</b>", reply: null, replied_at: null, created_at: "2026-11-20T11:00:00Z" },
];

type Call = { method: string; path: string; search: string; body: unknown };

async function fakeSupabase(page: Page, opts: { own?: unknown[]; moderator?: boolean; pending?: unknown[] } = {}) {
  const calls: Call[] = [];
  const own = [...(opts.own || [])];
  await page.route(`${SUPABASE}/**`, async (route: Route) => {
    const req = route.request();
    const url = new URL(req.url());
    let body: unknown = null;
    try { body = req.postDataJSON(); } catch {}
    calls.push({ method: req.method(), path: url.pathname, search: url.search, body });
    // Cross-origin answers need these, or the browser drops a DELETE after its preflight.
    const cors = { "access-control-allow-origin": "*", "access-control-allow-methods": "GET, POST, DELETE, PATCH, HEAD, OPTIONS", "access-control-allow-headers": "*", "access-control-expose-headers": "content-range" };
    if (req.method() === "OPTIONS") return route.fulfill({ status: 204, headers: cors });
    const json = (data: unknown, status = 200, headers: Record<string, string> = {}) => route.fulfill({ status, contentType: "application/json", headers: { ...cors, ...headers }, body: JSON.stringify(data) });
    switch (url.pathname) {
      case "/rest/v1/comments_public": return json(published);
      case "/rest/v1/comments": {
        if (req.method() === "POST") {
          const b = body as Record<string, unknown>;
          if (String(b.body).includes("flood")) return json({ code: "P0001", message: "too many messages", hint: "rate" }, 400);
          const row = { id: "new1", locale: b.locale, body: b.body, display_name: b.display_name, status: "pending", reply: null, created_at: new Date().toISOString() };
          own.push({ ...row, anonymous: b.anonymous });
          return json(row, 201);
        }
        if (req.method() === "DELETE") return json([], 200);
        if (req.method() === "HEAD") return route.fulfill({ status: 200, headers: { ...cors, "content-range": `0-0/${(opts.pending || []).length}` } });
        if (url.searchParams.get("status")) return json(opts.pending || []);
        return json(own);
      }
      case "/rest/v1/rpc/is_moderator": return json(!!opts.moderator);
      case "/rest/v1/rpc/moderate_comment": return json(null);
      case "/rest/v1/rpc/merge_scores": return json([]);
      case "/rest/v1/rpc/merge_visited": return json([]);
      case "/rest/v1/profiles": return json([{ madrasa: null }]);
      case "/rest/v1/licences": return json([]);
      default: return json({}, 404);
    }
  });
  return calls;
}

// Seeded once per tab, so that signing out is not undone by the next page load.
const signIn = (page: Page) => page.addInitScript((s) => {
  if (sessionStorage.getItem("seeded")) return;
  localStorage.setItem("nahwi-auth", JSON.stringify(s));
  sessionStorage.setItem("seeded", "1");
}, session());

test("readers without an account see the published messages and are asked to sign in to write", async ({ page }) => {
  const calls = await fakeSupabase(page);
  await page.goto(`/en/terms/${first}/`);
  const box = page.locator("[data-comments]");
  await expect(box).toHaveAttribute("data-page", `terms/${first}`);
  // Nothing is asked before the section comes near the screen.
  expect(calls.filter((c) => c.path === "/rest/v1/comments_public")).toHaveLength(0);
  await box.scrollIntoViewIfNeeded();
  const items = box.locator(".comment");
  await expect(items).toHaveCount(3);
  await expect(box.locator("[data-count]")).toContainText("3 messages");
  await expect(items.nth(0).locator(".comment-head strong")).toHaveText("Yusuf");
  await expect(items.nth(0).locator(".comment-reply")).toContainText("differ in kind");
  // Sent without a name: "A learner"; in another language: marked as such.
  await expect(items.nth(1).locator(".comment-head strong")).toHaveText("A learner");
  await expect(items.nth(1).locator(".comment-lang")).toHaveText("In Dutch");
  // Text stays text.
  await expect(items.nth(2).locator(".comment-body")).toHaveText("<img src=x onerror=alert(1)> stays text");
  await expect(items.nth(2).locator(".comment-head strong")).toHaveText("<b>Bold</b>");
  await expect(box.locator("img")).toHaveCount(0);
  await expect(box.locator(".comments-out")).toBeVisible();
  await expect(box.locator("[data-form]")).toBeHidden();
  const query = calls.find((c) => c.path === "/rest/v1/comments_public")!;
  expect(decodeURIComponent(query.search)).toContain(`page=eq.terms/${first}`);
  expect(calls.some((c) => c.path === "/rest/v1/comments")).toBe(false);
});

test("a signed-in reader writes a message that waits for review, with a name or without, and can delete it", async ({ page }) => {
  const calls = await fakeSupabase(page, { own: [{ id: "c9", locale: "en", body: "My earlier question", display_name: "Amina", anonymous: false, status: "pending", reply: null, created_at: "2026-11-20T12:00:00Z" }] });
  await signIn(page);
  await page.goto(`/en/terms/${first}/`);
  const box = page.locator("[data-comments]");
  await box.scrollIntoViewIfNeeded();
  await expect(box).toHaveAttribute("data-state", "in");
  await expect(box.locator(".comments-out")).toBeHidden();
  const form = box.locator("[data-form]");
  // The form waits behind one button.
  await expect(form).toBeHidden();
  await box.locator("[data-write]").click();
  await expect(form).toBeVisible();
  await expect(form.locator('[name="body"]')).toBeFocused();
  // The reader's own waiting message is shown to them, marked, after the published ones.
  await expect(box.locator(".comment")).toHaveCount(4);
  await expect(box.locator('.comment[data-status="pending"]')).toContainText("Waiting to be read");
  // The name comes from the account.
  await expect(form.locator('[name="name"]')).toHaveValue("Amina Yusuf");

  await form.locator('[name="body"]').fill(" ");
  await form.locator("[data-send]").click();
  await expect(form.locator("[data-form-status]")).toHaveText("Write a little more.");

  await form.locator('[name="name"]').fill("");
  await form.locator('[name="body"]').fill("What is the difference between a genus and a species?");
  await form.locator("[data-send]").click();
  await expect(form.locator("[data-form-status]")).toHaveText("Give a name, or post without your name.");

  await form.locator('[name="anonymous"]').check();
  await expect(form.locator('[name="name"]')).toBeDisabled();
  await form.locator("[data-send]").click();
  await expect(form.locator("[data-form-status]")).toContainText("appears here once it has been read");
  const sent = calls.find((c) => c.method === "POST" && c.path === "/rest/v1/comments")!.body as Record<string, unknown>;
  expect(sent).toMatchObject({ user_id: user.id, page: `terms/${first}`, locale: "en", anonymous: true, display_name: null });
  await expect(box.locator(".comment")).toHaveCount(5);
  const mine = box.locator(".comment").last();
  await expect(mine.locator(".comment-head strong")).toHaveText("A learner");
  await expect(mine).toHaveAttribute("data-status", "pending");
  await expect(form.locator('[name="body"]')).toHaveValue("");

  // Too many in a short time: said plainly.
  await form.locator('[name="body"]').fill("flood");
  await form.locator("[data-send]").click();
  await expect(form.locator("[data-form-status]")).toContainText("several messages in a short time");

  // Delete: the first click asks, the second deletes.
  const del = mine.locator(".comment-remove");
  await del.click();
  await expect(del).toHaveText("Delete for good?");
  await del.click();
  await expect(box.locator(".comment")).toHaveCount(4);
  expect(calls.some((c) => c.method === "DELETE" && c.path === "/rest/v1/comments")).toBe(true);
});

test("the moderation page lets a moderator publish and answer, and refuses others", async ({ page }) => {
  const pending = [{ id: "p1", page: `terms/${first}`, locale: "en", body: "A waiting question", display_name: "Amina", anonymous: false, status: "pending", reply: null, created_at: "2026-11-21T10:00:00Z" }];
  const calls = await fakeSupabase(page, { moderator: true, pending });
  await page.goto("/en/moderate/");
  const box = page.locator("[data-moderate]");
  await expect(box).toHaveAttribute("data-state", "out");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);

  await signIn(page);
  await page.goto("/en/moderate/");
  await expect(box).toHaveAttribute("data-state", "in");
  const item = box.locator(".moderate-item");
  await expect(item).toHaveCount(1);
  await expect(item.locator(".moderate-page")).toHaveAttribute("href", `/en/terms/${first}/`);
  await item.locator("textarea").fill("Look at the definition again: the genus is said of things that differ in kind.");
  await item.getByRole("button", { name: "Publish" }).click();
  await expect(box.locator(".moderate-item")).toHaveCount(0);
  const call = calls.find((c) => c.path === "/rest/v1/rpc/moderate_comment")!.body as Record<string, unknown>;
  expect(call).toMatchObject({ comment_id: "p1", new_status: "published" });
  expect(String(call.new_reply)).toContain("differ in kind");
});

test("a signed-in reader who is not a moderator is told so", async ({ page }) => {
  await fakeSupabase(page, { moderator: false });
  await signIn(page);
  await page.goto("/en/moderate/");
  await expect(page.locator("[data-moderate]")).toHaveAttribute("data-state", "no");
  await expect(page.locator(".moderate-item")).toHaveCount(0);
});

test("the initial in the header opens the account menu; a moderator also sees the moderation page", async ({ page }) => {
  test.skip(!ACCOUNTS, "accounts are off until the Supabase project exists (config/site.ts ACCOUNTS)");
  await fakeSupabase(page, { moderator: true });
  await signIn(page);
  await page.goto("/en/");
  await expect(page.locator(".nav-account-signin")).toBeHidden();
  const tile = page.locator(".nav-account-btn");
  await tile.click();
  const menu = page.locator("#account-menu");
  await expect(menu).toBeVisible();
  await expect(menu.locator("[data-menu-name]")).toHaveText("Amina Yusuf");
  await expect(menu.locator("[data-menu-email]")).toHaveText("learner@example.org");
  await expect(menu.getByRole("link", { name: "Your account" })).toHaveAttribute("href", "/en/account/");
  await expect(menu.getByRole("link", { name: "Your progress" })).toHaveAttribute("href", "/en/study/progress/");
  // The moderator flag arrives with the account sync; after that the link shows.
  await expect.poll(() => page.evaluate(() => localStorage.getItem("nahwi-moderator"))).toBe("1");
  await page.reload();
  await page.locator(".nav-account-btn").click();
  await expect(menu.getByRole("link", { name: "Moderation" })).toBeVisible();
  // Sign out: the page comes back signed out.
  await menu.locator("[data-menu-signout]").click();
  await expect(page.locator(".nav-account-signin")).toBeVisible();
  await expect(page.locator("html")).not.toHaveAttribute("data-signed-in", "");
});

test("readers who are not moderators do not see the moderation link", async ({ page }) => {
  test.skip(!ACCOUNTS, "accounts are off until the Supabase project exists (config/site.ts ACCOUNTS)");
  await fakeSupabase(page, { moderator: false });
  await signIn(page);
  await page.goto("/en/");
  await page.locator(".nav-account-btn").click();
  await expect(page.locator("#account-menu")).toBeVisible();
  await expect(page.locator("#account-menu").getByRole("link", { name: "Moderation" })).toBeHidden();
});

test("a moderator skips the study path: any term or lesson opens at once", async ({ page }) => {
  await fakeSupabase(page, { moderator: true });
  const later = terms[8].slug;
  // A reader on the path: a later term is still closed.
  await page.goto(`/en/terms/${later}/`);
  await expect(page.locator("html")).toHaveAttribute("data-locked", /term|access/);
  // The same browser, signed in as a moderator (the flag that the account sync keeps).
  await page.addInitScript(() => localStorage.setItem("nahwi-moderator", "1"));
  await signIn(page);
  await page.goto(`/en/terms/${later}/`);
  await expect(page.locator("html")).not.toHaveAttribute("data-locked", /.+/);
  await expect(page.locator("html")).toHaveAttribute("data-access", "paid");
  await expect(page.locator(".lockable")).toBeVisible();
});
