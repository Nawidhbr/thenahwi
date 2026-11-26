import { expect, test } from "@playwright/test";
import { SUPPORT, live } from "./flags";

// The reader's tools: the calendar setting, the site search, the contact form's fallback, right-to-left pages.

test("dates are Hijri first, and the setting turns them round", async ({ page }) => {
  await page.goto("/en/");
  const list = page.locator(".home-book-list");
  await expect(list).toContainText("646 AH (1249)");
  await page.locator(".settings-toggle").click();
  await page.locator("#cal-toggle").click();
  await expect(list).toContainText("1249 (646 AH)");
  await page.reload();
  await expect(list).toContainText("1249 (646 AH)");
});

test("the site search finds a term and marks the words", async ({ page }) => {
  await page.goto("/en/");
  await page.locator("#search-open").click();
  await page.locator("#search-input").fill("predicate");
  const first = page.locator("#search-results li").first();
  await expect(first).toBeVisible();
  await expect(page.locator("#search-results mark.search-hl").first()).toBeVisible();
});

test("the contact form checks its fields and, without a mail service, says it will open the mail program", async ({ page }) => {
  await page.goto("/en/contact/#topic=correction&page=/en/terms/fail/");
  const form = page.locator("[data-contact]");
  await expect(form.locator('[name="page"]')).toHaveValue("/en/terms/fail/");
  await form.locator("[data-send]").click();
  await expect(form.locator(".contact-status")).toBeVisible();
  await expect(form.locator('[name="name"]')).toBeFocused();

  await page.route("**/api/contact/", (r) => r.fulfill({ status: 503, body: "{}" }));
  await form.locator('[name="name"]').fill("Test");
  await form.locator('[name="email"]').fill("test@example.org");
  await form.locator('[name="message"]').fill("A test message from the end-to-end tests.");
  const mail = page.waitForEvent("request", { predicate: (r) => r.url().startsWith("mailto:"), timeout: 3000 }).catch(() => null);
  await form.locator("[data-send]").click();
  await expect(form.locator(".contact-status")).toContainText(/could not be sent/i);
  await mail;
});

test("Arabic pages run right to left", async ({ page }) => {
  test.skip(!live("ar"), "Arabic has no pages until its translation is done");
  await page.goto("/ar/");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
});

test("the support window opens by itself only now and then, and 'Not now' puts it off", async ({ page }) => {
  test.skip(!SUPPORT, "no donate link yet (config/site.ts SUPPORT)");
  // As if five pages had been read already: the next quiet page asks once the reader has read most of it.
  await page.addInitScript(() => { if (!sessionStorage.getItem("seeded")) { localStorage.setItem("nahwi-support", JSON.stringify({ n: 5, next: 0 })); sessionStorage.setItem("seeded", "1"); } });
  await page.goto("/en/scholars/");
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  const dialog = page.locator("[data-support-dialog]");
  await expect(dialog).toHaveAttribute("open", "");
  await dialog.locator("[data-support-later]").click();
  await expect(dialog).not.toHaveAttribute("open", /.*/);
  const state = await page.evaluate(() => JSON.parse(localStorage.getItem("nahwi-support") || "{}"));
  expect(state.next).toBeGreaterThan(Date.now() + 50 * 86400000);
  // The next page does not ask again.
  await page.goto("/en/books/");
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(300);
  await expect(dialog).not.toHaveAttribute("open", /.*/);
});

test("the support window never opens by itself on the prices page", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("nahwi-support", JSON.stringify({ n: 50, next: 0 })));
  await page.goto("/en/pricing/");
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(300);
  await expect(page.locator("[data-support-dialog][open]")).toHaveCount(0);
});

test("in the Android app no payment is offered: no gift button, no prices link, no support window", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("nahwi-support", JSON.stringify({ n: 50, next: 0 })));
  await page.goto("/en/?source=android");
  await expect(page.locator("html")).toHaveAttribute("data-app", "android");
  // Kept for the session: a later page without the parameter is still the app.
  await page.goto("/en/scholars/");
  await expect(page.locator("html")).toHaveAttribute("data-app", "android");
  await expect(page.locator(".nav-support")).toBeHidden();
  await expect(page.locator('a[href="/en/pricing/"]').first()).toBeHidden();
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(1500);
  await expect(page.locator("[data-support-dialog][open]")).toHaveCount(0);
});

test("a discount code from a link is kept for the session, for Paddle's checkout", async ({ page }) => {
  await page.goto("/en/?discount=FAMILY-10");
  await page.goto("/en/scholars/");
  expect(await page.evaluate(() => sessionStorage.getItem("nahwi-discount"))).toBe("FAMILY-10");
});
