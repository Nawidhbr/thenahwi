import { expect, test, type Page, type Route } from "@playwright/test";
import { readFileSync } from "node:fs";

// Accounts (phase 3): signing in with a mailed code or a password, Google's way out and back, and progress kept in
// step with the account, the highest score winning. Supabase is not contacted: every request to it is answered here.

const SUPABASE = "https://replace-with-the-nahwi-project.supabase.co";
const bundle = JSON.parse(readFileSync(new URL("../packages/content/generated/terms.json", import.meta.url), "utf8"));
const terms: { slug: string }[] = Array.isArray(bundle) ? bundle : bundle.terms;
const [first, second] = terms.map((t) => t.slug);

const user = { id: "11111111-1111-1111-1111-111111111111", aud: "authenticated", role: "authenticated", email: "learner@example.org", app_metadata: { provider: "email" }, user_metadata: {}, created_at: "2026-11-08T12:00:00Z" };
const session = () => ({ access_token: "test-access", refresh_token: "test-refresh", token_type: "bearer", expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, user });

type Calls = { path: string; body: unknown }[];

/** Answer Supabase: the account already holds `remote` scores (and `seen` steps); records what the page sends. */
async function fakeSupabase(page: Page, remote: Record<string, number> = {}, seen: string[] = []) {
  const calls: Calls = [];
  // The account's licences; the access code FRIENDS2026 (any case, spaces or dashes) adds one for 30 days.
  const licences: { starts_at: string; ends_at: string | null; manage_url: null; update_url: null }[] = [];
  await page.route(`${SUPABASE}/**`, async (route: Route) => {
    const req = route.request();
    const url = new URL(req.url());
    let body: unknown = null;
    try { body = req.postDataJSON(); } catch {}
    calls.push({ path: url.pathname, body });
    const json = (data: unknown, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(data) });
    switch (url.pathname) {
      case "/auth/v1/otp": return json({});
      case "/auth/v1/resend": return json({});
      // A password: "right password 1" is learner@example.org's.
      case "/auth/v1/token": {
        const b = (body || {}) as { email?: string; password?: string };
        if (url.searchParams.get("grant_type") === "password" && b.email === user.email && b.password === "right password 1") return json(session());
        return json({ error_code: "invalid_credentials", msg: "Invalid login credentials" }, 400);
      }
      // A new account with a password: Supabase mails a code; for an address with an account it answers with no identities.
      case "/auth/v1/signup": {
        const b = (body || {}) as { email?: string };
        return json({ ...user, id: "22222222-2222-2222-2222-222222222222", email: b.email, identities: b.email === user.email ? [] : [{ provider: "email" }] });
      }
      case "/auth/v1/user": {
        if (req.method() !== "PUT") return json(user);
        if ((body as { password?: string })?.password === "right password 1") return json({ error_code: "same_password", msg: "New password should be different from the old password." }, 422);
        return json(user);
      }
      case "/auth/v1/verify": return (body as { token?: string })?.token === "123456" ? json(session()) : json({ code: "otp_expired", msg: "Token has expired or is invalid" }, 403);
      case "/rest/v1/rpc/merge_scores": {
        const incoming = ((body as { incoming?: Record<string, number> })?.incoming) || {};
        const all = { ...remote };
        for (const [k, v] of Object.entries(incoming)) all[k] = Math.max(all[k] ?? 0, v);
        return json(Object.entries(all).map(([key, score]) => ({ key, score })));
      }
      case "/rest/v1/rpc/merge_visited": return json([...new Set([...seen, ...(((body as { incoming?: string[] })?.incoming) || [])])]);
      case "/rest/v1/profiles": return json(req.method() === "GET" ? [{ madrasa: null }] : []);
      case "/rest/v1/licences": return json(licences);
      case "/rest/v1/rpc/redeem_code": {
        const code = String((body as { code?: string })?.code || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
        if (code !== "FRIENDS2026") return json({ ok: false, reason: "unknown" });
        const until = new Date(Date.now() + 30 * 86400e3).toISOString();
        licences.push({ starts_at: new Date(Date.now() - 1000).toISOString(), ends_at: until, manage_url: null, update_url: null });
        return json({ ok: true, until });
      }
      case "/auth/v1/authorize": return route.fulfill({ status: 200, contentType: "text/html", body: "<title>Google</title>" });
      default: return json({}, 404);
    }
  });
  return calls;
}

const scoresOf = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem("scores") || "{}"));

test("signing in with the code from the mail saves the progress to the account", async ({ page }) => {
  const calls = await fakeSupabase(page, { [second]: 8 });
  await page.addInitScript((s) => { if (!sessionStorage.getItem("seeded")) { localStorage.setItem("scores", JSON.stringify(s)); sessionStorage.setItem("seeded", "1"); } }, { [first]: 10 });
  await page.goto("/en/account/");
  const box = page.locator("[data-account]");
  await expect(box).toHaveAttribute("data-state", "out");

  await box.locator('[name="email"]').fill("not an address");
  await box.locator("[data-send]").click();
  await expect(box.locator("[data-status]")).toContainText(/valid email/i);

  await box.locator('[name="email"]').fill("learner@example.org");
  await box.locator("[data-send]").click();
  await expect(box).toHaveAttribute("data-state", "code");
  await expect(box.locator("[data-sent-text]")).toContainText("learner@example.org");
  expect(calls.some((c) => c.path === "/auth/v1/otp" && (c.body as { email?: string })?.email === "learner@example.org")).toBe(true);

  await box.locator('[name="code"]').fill("000000");
  await box.locator("[data-verify]").click();
  await expect(box.locator("[data-status]")).toContainText(/not right or has expired/i);

  await box.locator('[name="code"]').fill("123 456");
  await box.locator("[data-verify]").click();
  await expect(box).toHaveAttribute("data-state", "in");
  await expect(box.locator("[data-email]")).toHaveText("learner@example.org");
  await expect(page.locator("html")).toHaveAttribute("data-signed-in", "");
  await expect(box.locator("[data-stat-tests]")).toHaveText("2");
  // The browser sent its score and took the account's: both lessons are now passed here.
  const sent = calls.find((c) => c.path === "/rest/v1/rpc/merge_scores")?.body as { incoming: Record<string, number> };
  expect(sent.incoming[first]).toBe(10);
  expect(await scoresOf(page)).toMatchObject({ [first]: 10, [second]: 8 });

  // Signing out keeps the progress on this device.
  await box.locator("[data-signout]").click();
  await expect(box).toHaveAttribute("data-state", "out");
  await expect(page.locator("html")).not.toHaveAttribute("data-signed-in", /.*/);
  expect(await scoresOf(page)).toMatchObject({ [first]: 10, [second]: 8 });
});

test("signing in with a password, creating an account with one, and setting one when signed in", async ({ page }) => {
  const calls = await fakeSupabase(page);
  await page.goto("/en/account/");
  const box = page.locator("[data-account]");
  await expect(box).toHaveAttribute("data-state", "out");
  // A code by email is the default; the other half of the switch asks for a password.
  await expect(box.locator('[name="password"]')).toBeHidden();
  await box.locator('[data-mode="password"]').click();
  await expect(box.locator('[data-mode="password"]')).toHaveAttribute("aria-pressed", "true");
  await box.locator('[name="email"]').fill("learner@example.org");
  await box.locator('[name="password"]').fill("not the password");
  await box.locator("[data-signin-go]").click();
  await expect(box.locator("[data-status]")).toContainText(/do not match/i);
  await box.locator('[name="password"]').fill("right password 1");
  await box.locator("[data-signin-go]").click();
  await expect(box).toHaveAttribute("data-state", "in");
  expect(calls.some((c) => c.path === "/auth/v1/token")).toBe(true);
  await expect(box.locator('[name="username"]')).toHaveValue("learner@example.org");

  // Signed in, a new password can be set.
  const next = box.locator('[name="new-password"]');
  await next.fill("short");
  await box.locator("[data-password-save]").click();
  await expect(box.locator("[data-password-status]")).toContainText(/8 to 72/);
  await next.fill("right password 1");
  await box.locator("[data-password-save]").click();
  await expect(box.locator("[data-password-status]")).toContainText(/already your password/i);
  await next.fill("a new password 2");
  await box.locator("[data-password-save]").click();
  await expect(box.locator("[data-password-status]")).toContainText(/is saved/i);
  await expect(next).toHaveValue("");

  // Signed out, the choice of a password stays; forgetting it leads to a code.
  await box.locator("[data-signout]").click();
  await expect(box).toHaveAttribute("data-state", "out");
  await expect(box.locator('[name="password"]')).toBeVisible();
  await box.locator("[data-forgot]").click();
  await expect(box.locator('[name="password"]')).toBeHidden();
  await expect(box.locator("[data-status]")).toContainText(/sign in with a code/i);

  // A new account with a password is confirmed with the code from the mail.
  await box.locator('[data-mode="password"]').click();
  await box.locator("[data-to-create]").click();
  await expect(box.locator("[data-signin-go]")).toHaveText(/create account/i);
  await box.locator('[name="email"]').fill("learner@example.org");
  await box.locator('[name="password"]').fill("a fine password");
  await box.locator("[data-signin-go]").click();
  await expect(box.locator("[data-status]")).toContainText(/already has an account/i);
  await box.locator('[name="email"]').fill("new@example.org");
  await box.locator('[name="password"]').fill("short");
  await box.locator("[data-signin-go]").click();
  await expect(box.locator("[data-status]")).toContainText(/8 to 72/);
  await box.locator('[name="password"]').fill("a fine password");
  await box.locator("[data-signin-go]").click();
  await expect(box).toHaveAttribute("data-state", "code");
  await expect(box.locator("[data-sent-text]")).toContainText("new@example.org");
  await box.locator('[name="code"]').fill("123456");
  await box.locator("[data-verify]").click();
  await expect(box).toHaveAttribute("data-state", "in");
});

test("the subscribe window signs in with a password too", async ({ page }) => {
  await fakeSupabase(page);
  await page.route(/paddle\.com/, (r) => r.abort());
  await page.goto("/en/pricing/");
  const opener = page.locator("[data-subscribe]").first();
  test.skip(!(await opener.count()), "checkout is off in this build");
  await opener.click();
  const dialog = page.locator("[data-sub-dialog]");
  await expect(dialog).toBeVisible();
  await dialog.locator('[data-sub-step="plan"] button[type="submit"]').click();
  const signin = dialog.locator('[data-sub-step="signin"]');
  await expect(signin).toBeVisible();
  await signin.locator('[data-mode="password"]').click();
  await signin.locator('[name="email"]').fill("learner@example.org");
  await signin.locator('[name="password"]').fill("not the password");
  await signin.locator("[data-signin-go]").click();
  await expect(dialog.locator("[data-sub-status]")).toContainText(/do not match/i);
});

test("an access code from a link waits for the sign-in and then gives full access", async ({ page }) => {
  const calls = await fakeSupabase(page);
  await page.goto("/en/account/?redeem=friends-2026");
  const box = page.locator("[data-account]");
  await expect(box).toHaveAttribute("data-state", "out");
  await expect(box.locator("[data-redeem-pending]")).toContainText("friends-2026");
  // The code is kept for the session, not in the address.
  expect(new URL(page.url()).search).toBe("");

  await box.locator('[name="email"]').fill("learner@example.org");
  await box.locator("[data-send]").click();
  await box.locator('[name="code"]').fill("123456");
  await box.locator("[data-verify]").click();
  await expect(box).toHaveAttribute("data-state", "in");
  await expect(box.locator("[data-plan]")).toContainText(/free account/i);
  const input = box.locator('[name="redeem"]');
  await expect(input).toHaveValue("friends-2026");

  await input.fill("NOT-A-CODE-9");
  await box.locator("[data-redeem]").click();
  await expect(box.locator("[data-redeem-status]")).toContainText(/not known/i);
  await input.fill("short");
  await box.locator("[data-redeem]").click();
  await expect(box.locator("[data-redeem-status]")).toContainText(/not known/i);
  expect(calls.filter((c) => c.path === "/rest/v1/rpc/redeem_code")).toHaveLength(1);

  await input.fill("friends-2026");
  await box.locator("[data-redeem]").click();
  await expect(box.locator("[data-redeem-status]")).toContainText(/full access until/i);
  await expect(box.locator("[data-plan]")).toContainText(/full access, until/i);
  await expect(input).toHaveValue("");
  expect(await page.evaluate(() => sessionStorage.getItem("nahwi-redeem"))).toBeNull();
});

test("Google sign-in leaves for Supabase and asks to come back to the account page", async ({ page }) => {
  await fakeSupabase(page);
  await page.goto("/en/account/");
  const go = page.waitForRequest((r) => r.url().startsWith(`${SUPABASE}/auth/v1/authorize`));
  await page.locator("[data-google]").click();
  const url = new URL((await go).url());
  expect(url.searchParams.get("provider")).toBe("google");
  expect(url.searchParams.get("redirect_to")).toMatch(/\/en\/account\/$/);
});

test("a link that cannot be used here says so and offers the form", async ({ page }) => {
  await fakeSupabase(page);
  await page.goto("/en/account/?error=access_denied&error_description=expired");
  await expect(page.locator("[data-account]")).toHaveAttribute("data-state", "out");
  await expect(page.locator("[data-status]")).toContainText(/could not be used here/i);
  await expect(page).toHaveURL(/\/en\/account\/$/);
});

test("on any page, a signed-in reader's progress is merged with the account's", async ({ page }) => {
  const calls = await fakeSupabase(page, { [second]: 9 }, ["seen-elsewhere"]);
  await page.addInitScript((s) => {
    if (sessionStorage.getItem("seeded")) return;
    localStorage.setItem("nahwi-auth", JSON.stringify(s));
    localStorage.setItem("scores", JSON.stringify({}));
    sessionStorage.setItem("seeded", "1");
  }, session());
  await page.goto(`/en/terms/${first}/`);
  await expect(page.locator("html")).toHaveAttribute("data-signed-in", "");
  await expect.poll(() => scoresOf(page)).toMatchObject({ [second]: 9 });
  const visited = await page.evaluate(() => JSON.parse(localStorage.getItem("visited") || "[]"));
  expect(visited).toContain("seen-elsewhere");

  // A finished test is saved straight away (the merge on loading the page may still be on its way, so look for the
  // call that carries the new score rather than counting calls).
  await page.locator(".term-quiz [data-quiz-go]").click();
  const questions = page.locator(".term-quiz .question:not([hidden])");
  for (let k = 0; k < (await questions.count()); k++) {
    const q = questions.nth(k);
    await q.locator(`.option[data-index="${await q.getAttribute("data-answer")}"]`).click();
  }
  await expect.poll(() => calls.filter((c) => c.path === "/rest/v1/rpc/merge_scores")
    .map((c) => (c.body as { incoming: Record<string, number> }).incoming[first]).at(-1)).toBe(10);
});

test("readers without an account do not load the account code", async ({ page }) => {
  const calls = await fakeSupabase(page);
  const scripts: string[] = [];
  page.on("request", (r) => { if (r.resourceType() === "script") scripts.push(r.url()); });
  await page.goto(`/en/terms/${first}/`);
  await page.waitForLoadState("networkidle");
  expect(scripts.some((u) => /account-sync/.test(u))).toBe(false);
  expect(calls).toEqual([]);
});
