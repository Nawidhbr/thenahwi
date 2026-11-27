import { expect, test } from "@playwright/test";

// The main pages on desktop and phone: no page scrolls sideways, no script error, every photo loads.

const pages = ["/en/", "/en/study/", "/en/study/mabadi/", "/en/study/mabadi/certificate/", "/en/text/mabadi/", "/en/curricula/", "/en/curricula/ottoman-path/", "/en/terms/fail/", "/en/practice/", "/en/tools/tasrif/", "/en/books/", "/en/books/kafiya/", "/en/books/izzi/", "/en/books/sharh-ibn-aqil/", "/en/books/marah/", "/en/study/ajurrumiyya/", "/en/study/ajurrumiyya/9/", "/en/text/ajurrumiyya/", "/en/scholars/ibn-ajurrum/", "/en/glossary/hal/", "/en/scholars/", "/en/scholars/ibn-malik/", "/en/nahw/", "/en/nahw/what-is-sarf/", "/en/glossary/", "/en/glossary/fail/", "/en/news/", "/en/updates/", "/en/about/", "/en/contact/", "/en/account/", "/en/pricing/", "/en/terms-of-service/"];

for (const path of pages) {
  test(`${path} fits the screen and runs without errors`, async ({ page }) => {
    const errors: string[] = [];
    // The parent site's news feed allows only thenahwi.com: answered here with an empty feed (e2e/tools.spec.ts tests it).
    await page.route("https://themantiqi.com/**", (r) => r.fulfill({ status: 200, contentType: "application/rss+xml", headers: { "Access-Control-Allow-Origin": "*" }, body: '<?xml version="1.0"?><rss version="2.0"><channel></channel></rss>' }));
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
    const res = await page.goto(path);
    expect(res?.status(), "page exists").toBe(200);
    await page.waitForLoadState("load");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, "page scrolls sideways").toBeLessThanOrEqual(1);
    const broken = await page.evaluate(() => [...document.images].filter((i) => i.loading !== "lazy" && i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src));
    expect(broken, "broken images").toEqual([]);
    expect(errors, "script errors").toEqual([]);
  });
}
