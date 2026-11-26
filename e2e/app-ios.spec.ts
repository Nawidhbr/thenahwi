import { expect, test, type Page, type Route } from "@playwright/test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { live } from "./flags";

// The iPhone app (store/ios): the site in Capacitor's web view. A stand-in for Capacitor's bridge records every native
// call and answers some; Supabase is answered here too. Buying through Apple is walked by npm run check:payments.

const SUPABASE = "https://replace-with-the-nahwi-project.supabase.co";
const user = { id: "11111111-1111-1111-1111-111111111111", aud: "authenticated", role: "authenticated", email: "learner@example.org", app_metadata: { provider: "google" }, user_metadata: {}, created_at: "2026-11-25T12:00:00Z" };
const session = () => ({ access_token: "test-access", refresh_token: "test-refresh", token_type: "bearer", expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, user });
type Call = { plugin: string; method: string; options: Record<string, unknown> };
const bundle = JSON.parse(readFileSync(new URL("../packages/content/generated/terms.json", import.meta.url), "utf8"));
const firstTerm: string = (Array.isArray(bundle) ? bundle : bundle.terms)[0].slug;

/** The bridge, with answers by "Plugin.method" ({ reject } rejects). Calls survive page loads (sessionStorage). */
async function bridge(page: Page, answers: Record<string, unknown> = {}) {
  await page.addInitScript((answers) => {
    const keep = (c: unknown) => { try { const all = JSON.parse(sessionStorage.getItem("native") || "[]"); all.push(c); sessionStorage.setItem("native", JSON.stringify(all)); } catch {} };
    (window as unknown as { Capacitor: unknown }).Capacitor = {
      getPlatform: () => "ios",
      PluginHeaders: ["App", "Haptics", "LocalNotifications", "AppShortcuts", "InAppReview", "SignInWithApple", "Purchases", "WebAuth", "StatusBar"].map((name) => ({ name, methods: [] })),
      nativePromise: (plugin: string, method: string, options: Record<string, unknown>) => {
        keep({ plugin, method, options: JSON.parse(JSON.stringify(options ?? {})) });
        const a = (answers as Record<string, { reject?: unknown }>)[`${plugin}.${method}`];
        return a && a.reject ? Promise.reject(a.reject) : Promise.resolve(a ?? {});
      },
      addListener: (plugin: string, event: string) => { keep({ plugin, method: "addListener", options: { event } }); return { remove() {} }; },
    };
  }, answers);
}
const calls = async (page: Page): Promise<Call[]> => JSON.parse((await page.evaluate(() => sessionStorage.getItem("native"))) || "[]");

/** Supabase: a code or Apple's token makes a session; every other request gets an empty answer. */
async function fakeSupabase(page: Page) {
  const seen: { path: string; query: string; body: unknown }[] = [];
  await page.route(`${SUPABASE}/**`, async (route: Route) => {
    const req = route.request();
    const url = new URL(req.url());
    let body: unknown = null;
    try { body = req.postDataJSON(); } catch {}
    seen.push({ path: url.pathname, query: url.search, body });
    const json = (data: unknown, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(data) });
    if (url.pathname === "/auth/v1/token") return json(session());
    if (url.pathname === "/auth/v1/user") return json(user);
    if (url.pathname === "/rest/v1/profiles") return json([{ madrasa: null }]);
    if (url.pathname.startsWith("/rest/v1/rpc/merge_")) return json([]);
    return json([]);
  });
  return seen;
}

test("in the iPhone app the site leaves out the gift and Paddle, and sets its own shortcuts", async ({ page }) => {
  await bridge(page);
  await page.goto("/en/");
  await expect(page.locator("html")).toHaveAttribute("data-app", "ios");
  await expect(page.locator(".nav-support")).toBeHidden();
  await expect(page.locator('a[href="/en/pricing/"]').first()).toBeHidden();
  // Not yet selling through Apple (no RevenueCat key in this build): no subscribe button at all.
  await page.goto("/en/pricing/");
  for (const b of await page.locator("[data-subscribe]").all()) await expect(b).toBeHidden();
  await expect.poll(async () => (await calls(page)).find((c) => c.plugin === "AppShortcuts" && c.method === "set")?.options.shortcuts).toHaveLength(3);
  expect((await calls(page)).some((c) => c.plugin === "App" && c.method === "addListener")).toBe(true);
  // Under the status bar: the page reaches up behind it, and the clock is light over the black header.
  expect(await page.locator('meta[name="viewport"]').getAttribute("content")).toContain("viewport-fit=cover");
  await page.goto("/en/scholars/");
  await expect.poll(async () => (await calls(page)).filter((c) => c.plugin === "StatusBar").at(-1)?.options.style).toBe("DARK");
});

test("the app starts in the study portal, in the language the reader chose", async ({ page }) => {
  test.skip(!live("nl"), "only English has pages until a translation is done");
  await bridge(page);
  await page.goto("/en/study/?app=start");
  await expect(page).toHaveURL(/\/en\/study\/$/);
  await page.goto("/nl/");
  expect(await page.evaluate(() => localStorage.getItem("nahwi-app-locale"))).toBe("nl");
  await page.goto("/en/study/?app=start");
  await expect(page).toHaveURL(/\/nl\/study\/$/);
});

test("the reminder in the app is a notification, with the day's lessons due", async ({ page }) => {
  await bridge(page, { "LocalNotifications.checkPermissions": { display: "granted" } });
  await page.goto("/en/practice/");
  await expect(page.locator("[data-reminder]")).toBeHidden();
  const box = page.locator("[data-app-reminder]");
  await expect(box).toBeVisible();
  await box.locator("summary").click();
  await box.locator('input[type="time"]').fill("07:30");
  await box.locator("[data-app-reminder-on]").click();
  await expect(box.locator("[data-app-reminder-status]")).toHaveText(/07:30/);
  await expect(box.locator("[data-app-reminder-off]")).toBeVisible();
  const scheduled = (await calls(page)).filter((c) => c.plugin === "LocalNotifications" && c.method === "schedule").at(-1);
  const list = scheduled?.options.notifications as { id: number; body: string; schedule: { at: string } }[];
  expect(list).toHaveLength(14);
  expect(new Date(list[0].schedule.at).getMinutes()).toBe(30);
  // Off: the fourteen are cancelled and the time forgotten.
  await box.locator("[data-app-reminder-off]").click();
  expect(await page.evaluate(() => localStorage.getItem("nahwi-app-reminder"))).toBeNull();
  expect((await calls(page)).filter((c) => c.method === "cancel").at(-1)?.options.notifications).toHaveLength(14);
});

test("in the app, Google opens in the system's sign-in window and comes back signed in", async ({ page }) => {
  const seen = await fakeSupabase(page);
  await bridge(page, { "WebAuth.start": { url: "thenahwi://auth?code=good-code" } });
  await page.goto("/en/account/");
  await page.locator("[data-google]").click();
  await expect(page.locator("html")).toHaveAttribute("data-signed-in", "", { timeout: 10000 });
  const start = (await calls(page)).find((c) => c.plugin === "WebAuth" && c.method === "start");
  // The window starts on the site itself (api/sign-in.js), which sends it on to Supabase's sign-in.
  const opened = new URL(String(start?.options.url));
  expect(opened.origin + opened.pathname).toBe(new URL("/api/sign-in/", page.url()).href);
  const to = String(opened.searchParams.get("to"));
  expect(to).toContain("/auth/v1/authorize?provider=google");
  expect(decodeURIComponent(to)).toContain("redirect_to=thenahwi://auth");
  expect(start?.options.callbackScheme).toBe("thenahwi");
  const exchange = seen.find((s) => s.path === "/auth/v1/token");
  expect(exchange?.query).toContain("grant_type=pkce");
  expect((exchange?.body as { auth_code?: string })?.auth_code).toBe("good-code");
});

test("closing the sign-in window is no error", async ({ page }) => {
  await fakeSupabase(page);
  await bridge(page, { "WebAuth.start": { reject: { code: "CANCELED", message: "The sign-in window was closed" } } });
  await page.goto("/en/account/");
  await page.locator("[data-google]").click();
  await expect.poll(async () => (await calls(page)).some((c) => c.plugin === "WebAuth")).toBe(true);
  await page.waitForTimeout(300);
  await expect(page.locator("[data-status]")).toBeHidden();
});

test("in the app, Apple signs in natively and Supabase checks Apple's token with the nonce", async ({ page }) => {
  test.skip(!/export const APPLE_SIGN_IN = true/.test(readFileSync(new URL("../apps/web/src/config/site.ts", import.meta.url), "utf8")), "Sign in with Apple is not set up yet (config/site.ts)");
  const seen = await fakeSupabase(page);
  await bridge(page, { "SignInWithApple.authorize": { response: { identityToken: "header.payload.signature", givenName: "Amina", familyName: "K.", email: null, user: "001", authorizationCode: "c" } } });
  await page.goto("/en/account/");
  await page.locator("[data-apple]").click();
  await expect(page.locator("html")).toHaveAttribute("data-signed-in", "", { timeout: 10000 });
  const ask = (await calls(page)).find((c) => c.plugin === "SignInWithApple");
  expect(ask?.options.clientId).toBe("com.thenahwi.app");
  const token = seen.find((s) => s.path === "/auth/v1/token" && s.query.includes("grant_type=id_token"));
  const body = token?.body as { provider: string; id_token: string; nonce: string };
  expect(body).toMatchObject({ provider: "apple", id_token: "header.payload.signature" });
  expect(createHash("sha256").update(body.nonce).digest("hex")).toBe(ask?.options.nonce);
  // Apple's name, given only this once, is kept on the account.
  const named = seen.find((s) => s.path === "/auth/v1/user" && (s.body as { data?: { full_name?: string } })?.data?.full_name);
  expect((named?.body as { data: { full_name: string } }).data.full_name).toBe("Amina K.");
});

test("in the app each answer taps the phone, and a test plans the hearts note", async ({ page }) => {
  await bridge(page, { "LocalNotifications.checkPermissions": { display: "granted" } });
  await page.goto(`/en/terms/${firstTerm}/`);
  await page.locator("[data-quiz-go]").click();
  const questions = page.locator("[data-questions] .question:not([hidden])");
  const n = await questions.count();
  for (let i = 0; i < n; i++) await questions.nth(i).locator(".option").first().click();
  await expect.poll(async () => (await calls(page)).filter((c) => c.plugin === "Haptics").length).toBe(n);
  expect((await calls(page)).find((c) => c.plugin === "Haptics")?.options.type).toMatch(/^(SUCCESS|ERROR)$/);
  // One heart spent: the note comes when all five are back.
  const note = (await calls(page)).filter((c) => c.plugin === "LocalNotifications" && c.method === "schedule").at(-1);
  const at = Date.parse(String((note?.options.notifications as { schedule: { at: string } }[])[0].schedule.at));
  expect(at - Date.now()).toBeGreaterThan(110 * 60 * 1000);
});
