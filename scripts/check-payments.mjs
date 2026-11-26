// The site with payments on (npm run check:payments: a build with CHECKOUT=on PAYWALL=on, then this script). The
// normal check builds with both off, so this walks what only payments-on shows, with Paddle.js and Supabase answered
// here: Paddle's prices on the pricing page, the subscribe window (plan, sign-in, checkout with the account, the price,
// a ?discount= code and the way back), the locks for no account, a free account and full access, the previews, the
// account page with a licence, and the Android app (nothing to buy). docs/accounts-payments.md.
import { chromium } from "@playwright/test";
import { readFileSync, readdirSync } from "node:fs";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
const ROOT = fileURLToPath(new URL("..", import.meta.url)).replace(/\/$/, "");
const PORT = 4399;
const BASE = `http://localhost:${PORT}`;
const server = spawn("node", [`${ROOT}/scripts/serve-dist.mjs`, `${ROOT}/apps/web/dist`, String(PORT)], { stdio: "ignore" });
await new Promise((r) => setTimeout(r, 800));
const pricing = JSON.parse(readFileSync(`${ROOT}/apps/web/src/config/pricing.json`, "utf8"));
const M = pricing.paddle.monthly, Y = pricing.paddle.yearly || "pri_yearly_test";
const bundle = JSON.parse(readFileSync(`${ROOT}/packages/content/generated/terms.json`, "utf8"));
const terms = (Array.isArray(bundle) ? bundle : bundle.terms).map((t) => t.slug);
const SUPA = "https://replace-with-the-nahwi-project.supabase.co";
const user = { id: "11111111-1111-1111-1111-111111111111", aud: "authenticated", role: "authenticated", email: "learner@example.org", app_metadata: { provider: "email" }, user_metadata: {}, created_at: "2026-11-08T12:00:00Z" };
const session = { access_token: "t", refresh_token: "r", token_type: "bearer", expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, user };
const fakePaddle = `window.Paddle={Initialize(o){window.__paddleInit=o},PricePreview(o){return Promise.resolve({data:{address:{countryCode:"NL"},details:{lineItems:o.items.map(i=>({price:{id:i.priceId},formattedTotals:{total:i.priceId==="${M}"?"€24":"€240"},totals:{total:i.priceId==="${M}"?"2400":"24000"}}))}}})},Checkout:{open(o){window.__checkout=o}}};`;

const results = [];
// The first lesson of al-Kātī, a book behind the paywall.
const KATI = readdirSync(`${ROOT}/apps/web/dist/en/study/kati`).filter((d) => /^\d+$/.test(d)).map(Number).sort((a, b) => a - b)[0];
const ok = (name, cond, extra = "") => results.push(`${cond ? "PASS" : "FAIL"}  ${name}${extra ? "  — " + extra : ""}`);

// A lesson behind the paywall says so to search engines (paywalled content), naming the hidden part, which it has.
{
  const html = readFileSync(`${ROOT}/apps/web/dist/en/study/kati/${KATI}/index.html`, "utf8");
  const lds = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => JSON.parse(m[1]));
  const page = lds.find((d) => d["@type"] === "WebPage");
  ok("paywalled lesson: WebPage with isAccessibleForFree false", page?.isAccessibleForFree === false && page?.hasPart?.isAccessibleForFree === false);
  ok("paywalled lesson: the hidden part (.lockable) is on the page", page?.hasPart?.cssSelector === ".lockable" && html.includes('class="lockable"'));
  const term = readFileSync(`${ROOT}/apps/web/dist/en/terms/${terms[0]}/index.html`, "utf8");
  const tl = [...term.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => JSON.parse(m[1]));
  ok("term (opens with a free account): marked as gated", tl.some((d) => d["@type"] === "WebPage" && d.isAccessibleForFree === false) && term.includes('class="lockable"'));
}

const browser = await chromium.launch();
// A stand-in for Capacitor's bridge in the iPhone app (store/ios): records every native call, answers RevenueCat.
const iosBridge = () => {
  const calls = (window.__native = []);
  const offerings = { current: { availablePackages: [
    { identifier: "$rc_annual", packageType: "ANNUAL", product: { identifier: "com.thenahwi.full.yearly", priceString: "€239,99" } },
    { identifier: "$rc_monthly", packageType: "MONTHLY", product: { identifier: "com.thenahwi.full.monthly", priceString: "€23,99" } },
  ] } };
  const answers = { "Purchases.isConfigured": { isConfigured: false }, "Purchases.getOfferings": offerings, "Purchases.purchasePackage": { customerInfo: { entitlements: { active: { full: {} } } } }, "LocalNotifications.checkPermissions": { display: "denied" } };
  window.Capacitor = {
    getPlatform: () => "ios",
    PluginHeaders: ["App", "Haptics", "LocalNotifications", "AppShortcuts", "InAppReview", "SignInWithApple", "Purchases", "WebAuth", "StatusBar"].map((name) => ({ name, methods: [] })),
    nativePromise: (plugin, method, options) => { calls.push({ plugin, method, options }); return Promise.resolve(answers[`${plugin}.${method}`] ?? {}); },
    addListener: (plugin, event) => { calls.push({ plugin, method: "addListener", options: event }); return { remove() {} }; },
  };
};
async function ctx({ signedIn = false, licence = null, scores = null, android = false, ios = false } = {}) {
  const c = await browser.newContext();
  const errors = [];
  await c.route("https://cdn.paddle.com/**", (r) => r.fulfill({ contentType: "application/javascript", body: fakePaddle }));
  await c.route(`${SUPA}/**`, (r) => {
    const p = new URL(r.request().url()).pathname;
    const j = (d) => r.fulfill({ contentType: "application/json", body: JSON.stringify(d) });
    if (p === "/auth/v1/user") return j(user);
    if (p === "/auth/v1/token") return j(session);
    if (p === "/rest/v1/rpc/merge_scores") return j([]);
    if (p === "/rest/v1/rpc/merge_visited") return j([]);
    if (p === "/rest/v1/profiles") return j([{ madrasa: null }]);
    if (p === "/rest/v1/licences") return j(licence ? [{ starts_at: "2026-01-01T00:00:00Z", ends_at: licence, manage_url: null, update_url: null }] : []);
    return j({});
  });
  await c.addInitScript(({ signedIn, session, licence, scores }) => {
    if (sessionStorage.getItem("seeded")) return;
    sessionStorage.setItem("seeded", "1");
    if (signedIn) localStorage.setItem("nahwi-auth", JSON.stringify(session));
    if (licence) localStorage.setItem("nahwi-access", JSON.stringify({ paid: true, until: licence }));
    if (scores) { localStorage.setItem("scores", JSON.stringify(scores)); localStorage.setItem("madrasa", "ottoman"); }
  }, { signedIn, session, licence, scores });
  if (ios) await c.addInitScript(iosBridge);
  const page = await c.newPage();
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("response", (r) => { if (r.status() >= 400) errors.push(`HTTP ${r.status()} ${r.url()}`); });
  if (android) await page.goto(`${BASE}/en/?source=android`);
  return { c, page, errors };
}
const lockOf = (page) => page.evaluate(() => document.documentElement.dataset.locked || "");
const vis = (page, sel) => page.locator(sel).first().isVisible();

// Previews of the Īsāghūjī and al-Kātī, from the built study data.
const sd = readFileSync(`${ROOT}/apps/web/dist/en/study-data.js`, "utf8");
const previews = JSON.parse(sd.match(/"previews":(\[[^\]]*\])/)[1]);
const termPreview = previews.find((p) => terms.includes(p));
const katiPreview = previews.find((p) => p.startsWith("kati-"));
results.push(`info  previews: ${previews.length}; term preview ${termPreview}; kati preview ${katiPreview}`);

// 1. Pricing page, not signed in.
{
  const { c, page, errors } = await ctx();
  await page.goto(`${BASE}/en/pricing/`);
  await page.waitForTimeout(800);
  const text = await page.locator("main").innerText();
  ok("pricing shows Paddle's prices, monthly and yearly", text.includes("€240") && text.includes("€24") && !/for life/i.test(text), text.replace(/\n+/g, " | ").slice(0, 200));
  ok("pricing has a subscribe button", await vis(page, "main [data-subscribe]"));
  await page.locator("main [data-subscribe]").first().click();
  await page.waitForTimeout(800);
  ok("subscribe window opens", await page.locator("[data-sub-dialog]").evaluate((d) => d.open));
  const st = await page.locator("[data-sub-dialog]").innerText();
  await page.locator('[data-sub-step="plan"] [type=submit]').first().click();
  await page.waitForTimeout(500);
  const st2 = await page.locator("[data-sub-dialog] [data-sub-step]:not([hidden])").innerText();
  ok("after the plan, the window asks to sign in", /google|email/i.test(st2), st2.replace(/\n+/g, " | ").slice(0, 160));
  ok("no script errors (pricing)", errors.length === 0, errors.join(" ; "));
  await c.close();
}
// 2. Signed in (free), with a discount link: the checkout opens with the account and the code.
{
  const { c, page, errors } = await ctx({ signedIn: true });
  await page.goto(`${BASE}/en/pricing/?discount=FAMILIE10`);
  await page.waitForTimeout(800);
  await page.locator("main [data-subscribe]").first().click();
  await page.waitForTimeout(800);
  const plan = page.locator('[data-sub-step="plan"] [type=submit]').first();
  if (await plan.isVisible()) await plan.click();
  await page.waitForTimeout(800);
    const pay = page.locator("[data-sub-pay]");
  if (await pay.isVisible()) await pay.click();
  await page.waitForTimeout(800);
  const co = await page.evaluate(() => window.__checkout || null);
  ok("checkout opened", !!co);
  if (co) {
    ok("checkout carries the account", co.customData?.user_id === user.id && co.customer?.email === user.email);
    ok("a subscription, with no kind of its own", !co.customData?.kind, JSON.stringify(co.customData));
    ok("checkout carries the yearly price (the preselected plan)", co.items?.[0]?.priceId === Y, co.items?.[0]?.priceId);
    ok("checkout carries the discount code", co.discountCode === "FAMILIE10", String(co.discountCode));
    ok("checkout returns to the account page", /\/en\/account\/\?paid=1$/.test(co.settings?.successUrl || ""), co.settings?.successUrl);
  }
  ok("no script errors (checkout)", errors.length === 0, errors.join(" ; "));
  await c.close();
}
// 3. Locks for a reader without an account.
{
  const { c, page, errors } = await ctx();
  await page.goto(`${BASE}/en/terms/${terms[0]}/`);
  ok("anon: first term locked by access", (await lockOf(page)) === "access");
  ok("anon: access note shown", await vis(page, ".access-note"));
  await page.goto(`${BASE}/en/terms/${termPreview}/?preview`);
  ok("anon: a term preview opens", (await lockOf(page)) === "" , await lockOf(page));
  await page.goto(`${BASE}/en/study/${katiPreview.replace("-", "/")}/?preview`);
  ok("anon: a kati preview opens", (await lockOf(page)) === "", await lockOf(page));
    await page.goto(`${BASE}/en/scholars/abhari/`);
  ok("anon: knowledge base stays open", (await lockOf(page)) === "");
  ok("no script errors (anon)", errors.length === 0, errors.join(" ; "));
  await c.close();
}
// 4. Free account: the Īsāghūjī opens, al-Kātī stays behind the paywall even when its level is open.
const all = Object.fromEntries(terms.map((s) => [s, 10]));
{
  const { c, page, errors } = await ctx({ signedIn: true, scores: all });
  await page.goto(`${BASE}/en/terms/${terms[0]}/`);
  ok("free: first term readable", (await lockOf(page)) === "", await lockOf(page));
  // No hearts left: the refill opens Paddle's checkout for the refill price, with the learner and kind "hearts".
  await page.evaluate(() => localStorage.setItem("nahwi-hearts", JSON.stringify({ n: 0, at: Date.now(), r: 0 })));
  await page.reload();
  ok("hearts: refill offered when none are left", await vis(page, ".term-quiz [data-refill]"));
  await page.locator(".term-quiz [data-refill]").click();
  await page.waitForTimeout(1200);
  const rc = await page.evaluate(() => window.__checkout || null);
  ok("hearts: refill checkout", !!rc && rc.items?.[0]?.priceId === pricing.paddle.refill && rc.customData?.kind === "hearts" && rc.customData?.user_id === user.id && /refilled=1/.test(rc.settings?.successUrl || ""), JSON.stringify(rc?.customData));
  await page.goto(`${BASE}/en/study/kati/${KATI}/`);
  ok("free: first kati lesson locked by access", (await lockOf(page)) === "access", await lockOf(page));
  ok("free: access note offers full access", await vis(page, ".access-note [data-subscribe]"));
  ok("no script errors (free)", errors.length === 0, errors.join(" ; "));
  await c.close();
}
// 5. Full access: al-Kātī opens; the account page shows the licence and hides the upgrade.
{
  const until = new Date(Date.now() + 200 * 86400e3).toISOString();
  const { c, page, errors } = await ctx({ signedIn: true, licence: until, scores: all });
  await page.goto(`${BASE}/en/study/kati/${KATI}/`);
  ok("paid: first kati lesson readable", (await lockOf(page)) === "", await lockOf(page));
  await page.goto(`${BASE}/en/account/`);
  await page.waitForTimeout(1500);
  ok("paid: account shows full access", /full access, until/i.test(await page.locator("[data-plan]").innerText()), await page.locator("[data-plan]").innerText());
  ok("paid: upgrade link hidden", !(await vis(page, "[data-plan-upgrade]")));
  ok("no script errors (paid)", errors.length === 0, errors.join(" ; "));
  await c.close();
}
// 6. Android app: nothing to buy, also on a locked lesson.
{
  const { c, page, errors } = await ctx({ signedIn: true, scores: all, android: true });
  await page.goto(`${BASE}/en/pricing/`);
  await page.waitForTimeout(500);
  ok("app: no subscribe button on pricing", !(await vis(page, "main [data-subscribe]")));
  await page.goto(`${BASE}/en/study/kati/${KATI}/`);
  ok("app: first kati lesson still locked", (await lockOf(page)) === "access");
  ok("app: no buy button in the access note", !(await vis(page, ".access-note [data-subscribe]")));
  await page.goto(`${BASE}/en/terms/${terms[0]}/`);
  await page.evaluate(() => localStorage.setItem("nahwi-hearts", JSON.stringify({ n: 0, at: Date.now(), r: 0 })));
  await page.reload();
  ok("app: no refill button", !(await vis(page, ".term-quiz [data-refill]")));
  results.push("info  app access note: " + ((await page.locator(".access-note").first().innerText({ timeout: 2000 }).catch(() => "(none)"))).replace(/\n+/g, " | "));
  ok("no script errors (app)", errors.length === 0, errors.join(" ; "));
  await c.close();
}
// 7. iPhone app: full access through Apple (RevenueCat), never Paddle.
{
  const { c, page, errors } = await ctx({ signedIn: true, scores: all, ios: true });
  const paddle = [];
  page.on("request", (r) => { if (r.url().includes("paddle.com")) paddle.push(r.url()); });
  await page.goto(`${BASE}/en/study/kati/${KATI}/`);
  ok("iPhone: first kati lesson still locked", (await lockOf(page)) === "access");
  await page.waitForFunction(() => "appStore" in document.documentElement.dataset, null, { timeout: 5000 }).catch(() => {});
  ok("iPhone: the access note offers full access", await vis(page, ".access-note [data-subscribe]"));
  ok("iPhone: no gift button", !(await vis(page, ".nav-support")));
  await page.locator(".access-note [data-subscribe]").first().click();
  await page.waitForTimeout(800);
  ok("iPhone: the App Store window opens, not Paddle's", await page.locator("[data-store-dialog]").evaluate((d) => d.open) && !(await page.locator("[data-sub-dialog]").evaluate((d) => d.open).catch(() => false)));
  const store = await page.locator("[data-store-dialog]").innerText();
  ok("iPhone: Apple's prices, the renewal terms and restore", store.includes("€239,99") && store.includes("€23,99") && /renews automatically/i.test(store) && /restore purchases/i.test(store), store.replace(/\n+/g, " | ").slice(0, 200));
  // The account page takes ?paid=1 out of the address once read, so the navigation itself is what counts.
  const went = [];
  page.on("framenavigated", (f) => { if (f === page.mainFrame()) went.push(f.url()); });
  await page.locator("[data-store-buy]").click();
  await page.waitForURL(/\/en\/account\//, { timeout: 5000 }).catch(() => {});
  const calls = await page.evaluate(() => window.__native || []).catch(() => []);
  ok("iPhone: after buying, the account page waits for the licence", went.some((u) => /\/en\/account\/\?paid=1$/.test(u)), went.join(" "));
  ok("iPhone: Paddle never loads", paddle.length === 0, paddle.join(" "));
  ok("no script errors (iPhone)", errors.length === 0, errors.join(" ; "));
  results.push("info  iPhone native calls on the last page: " + calls.map((x) => `${x.plugin}.${x.method}`).join(", "));
  await c.close();
}
// 8. The purchase itself: RevenueCat is told the account and gets the yearly package.
{
  const { c, page } = await ctx({ signedIn: true, scores: all, ios: true });
  await page.goto(`${BASE}/en/study/kati/${KATI}/`);
  await page.waitForFunction(() => "appStore" in document.documentElement.dataset, null, { timeout: 5000 }).catch(() => {});
  await page.locator(".access-note [data-subscribe]").first().click();
  await page.waitForTimeout(800);
  await page.evaluate(() => { window.__keep = window.__native; addEventListener("beforeunload", () => sessionStorage.setItem("native-calls", JSON.stringify(window.__native))); });
  await page.locator("[data-store-buy]").click();
  await page.waitForURL(/paid=1/, { timeout: 5000 }).catch(() => {});
  const calls = JSON.parse((await page.evaluate(() => sessionStorage.getItem("native-calls"))) || "[]");
  const conf = calls.find((x) => x.plugin === "Purchases" && x.method === "configure");
  const buy = calls.find((x) => x.plugin === "Purchases" && x.method === "purchasePackage");
  ok("iPhone: RevenueCat knows the reader by the account's id", conf?.options?.appUserID === user.id && /^appl_/.test(conf?.options?.apiKey || ""), JSON.stringify(conf?.options));
  ok("iPhone: the yearly package is bought", buy?.options?.aPackage?.packageType === "ANNUAL", JSON.stringify(buy?.options?.aPackage?.identifier));
  await c.close();
}
await browser.close();
server.kill();
console.log(results.join("\n"));
const failed = results.filter((r) => r.startsWith("FAIL")).length;
console.log(failed ? `\n${failed} failed.` : "\nPayments on: all passed.");
process.exit(failed ? 1 : 0);
