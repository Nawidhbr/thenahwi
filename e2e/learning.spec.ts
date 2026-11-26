import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";

// The study path as a learner meets it: terms open one at a time, a test with two stars opens the next,
// later levels and their lessons stay locked until what comes before is passed, previews can be read while locked.
// Scores live in localStorage; each test starts in a fresh browser context, so with nothing passed.

const bundle = JSON.parse(readFileSync(new URL("../packages/content/generated/terms.json", import.meta.url), "utf8"));
const terms: { slug: string }[] = Array.isArray(bundle) ? bundle : bundle.terms;
const [first, second, third] = terms.map((t) => t.slug);

/** Answer every question of the term test on this page: right (by data-answer) or wrong. */
async function answerQuiz(page: Page, right: boolean, result = true) {
  // The questions asked this time (the reserves stay hidden), in their shuffled order; an option is found by its
  // own index, since the answers are shuffled too.
  // The test starts with its own button (which takes a heart).
  const go = page.locator(".term-quiz [data-quiz-go]");
  if (await go.isVisible()) await go.click();
  const questions = page.locator(".term-quiz .question:not([hidden])");
  const n = await questions.count();
  expect(n).toBeGreaterThan(0);
  for (let k = 0; k < n; k++) {
    const q = questions.nth(k);
    const answer = Number(await q.getAttribute("data-answer"));
    const count = await q.locator(".option").count();
    const pick = right ? answer : (answer + 1) % count;
    await q.locator(`.option[data-index="${pick}"]`).click();
  }
  if (result) await expect(page.locator(".term-quiz .quiz-result")).toBeVisible();
}

/** Start with every term passed (three stars), as if the first reading were done. */
async function passAllTerms(page: Page) {
  const scores = Object.fromEntries(terms.map((t) => [t.slug, 10]));
  await page.addInitScript((s) => {
    if (!sessionStorage.getItem("seeded")) {
      localStorage.setItem("scores", JSON.stringify(s));
      sessionStorage.setItem("seeded", "1");
    }
  }, scores);
}

const html = (page: Page) => page.locator("html");

test("the first term is open, the second locked", async ({ page }) => {
  await page.goto(`/en/terms/${first}/`);
  await expect(html(page)).not.toHaveAttribute("data-locked", /.*/);
  await page.goto(`/en/terms/${second}/`);
  await expect(html(page)).toHaveAttribute("data-locked", "term");
});

test("passing a term's test opens the next one", async ({ page }) => {
  await page.goto(`/en/terms/${first}/`);
  await answerQuiz(page, true);
  await expect(page.locator(".quiz-result")).toHaveAttribute("data-state", "pass");
  await expect(html(page)).toHaveAttribute("data-passed", "");
  const scores = await page.evaluate(() => JSON.parse(localStorage.getItem("scores") || "{}"));
  expect(scores[first]).toBe(10);
  // The way on is offered right under the score.
  await expect(page.locator(".quiz-result [data-quiz-next]")).toBeVisible();
  await expect(page.locator(".quiz-result [data-quiz-next]")).toHaveAttribute("href", new RegExp(`/terms/${second}/`));
  // The card below the test goes; the way on under the score opens the next term, not a lock pop-up.
  await expect(page.locator(".next[data-gated]")).toBeHidden();
  await page.locator(".quiz-result [data-quiz-next]").click();
  await expect(page).toHaveURL(new RegExp(`/terms/${second}/$`));
  await page.goBack();

  await page.goto(`/en/terms/${second}/`);
  await expect(html(page)).not.toHaveAttribute("data-locked", /.*/);
  await page.goto(`/en/terms/${third}/`);
  await expect(html(page)).toHaveAttribute("data-locked", "term");
});

test("failing a term's test keeps the next one locked, and the lesson is read again before a new try", async ({ page }) => {
  await page.goto(`/en/terms/${first}/`);
  await answerQuiz(page, false);
  await expect(page.locator(".quiz-result")).toHaveAttribute("data-state", "fail");
  await expect(page.locator(".quiz-result [data-again]")).toBeHidden();
  // After reading again, also on a later visit, the box opens the test.
  await page.reload();
  const reread = page.locator(".term-quiz [data-reread]");
  await expect(reread).toBeVisible();
  await expect(page.locator(".term-quiz [data-questions]")).toBeHidden();
  await reread.locator("[data-reread-check]").check();
  await expect(reread).toBeHidden();
  await page.locator(".term-quiz [data-quiz-go]").click();
  await expect(page.locator(".term-quiz .question:not([hidden])").first()).toBeVisible();
  await page.goto(`/en/terms/${second}/`);
  await expect(html(page)).toHaveAttribute("data-locked", "term");
});

test("a test takes a heart; with none left the test waits", async ({ page }) => {
  await page.goto(`/en/terms/${first}/`);
  const hearts = page.locator(".term-quiz");
  // Every heart in place: the hearts show it, without a line of text under the start.
  await expect(page.locator(".term-quiz .heart[data-on='1']")).toHaveCount(5);
  await expect(page.locator(".term-quiz [data-hearts-text]")).toBeHidden();
  await answerQuiz(page, true);
  await expect(page.locator(".term-quiz .heart[data-on='1']")).toHaveCount(4);
  await page.locator(".quiz-result [data-again]").click();
  await expect(page.locator(".term-quiz [data-quiz-start]")).toContainText("4 of 5 hearts");
  await expect(page.locator(".term-quiz [data-quiz-start]")).toContainText(/next comes back in (1 hr, 59 min|2 hr|1:59|2:00)/);
  // No hearts: the questions wait, and say when the next heart comes.
  await page.evaluate(() => localStorage.setItem("nahwi-hearts", JSON.stringify({ n: 0, at: Date.now() - 30 * 60 * 1000, r: 0 })));
  await page.reload();
  await expect(page.locator(".term-quiz [data-hearts-empty]")).toBeVisible();
  await expect(page.locator(".term-quiz [data-hearts-empty]")).toContainText(/1 hr, 30 min|1:30/);
  await expect(page.locator(".term-quiz [data-questions]")).toBeHidden();
  // Two hours later a heart is back.
  await page.evaluate(() => localStorage.setItem("nahwi-hearts", JSON.stringify({ n: 0, at: Date.now() - 2 * 60 * 60 * 1000 - 1000, r: 0 })));
  await page.reload();
  await expect(hearts).toContainText("1 of 5 hearts");
  await expect(page.locator(".term-quiz [data-quiz-go]")).toBeVisible();
});

test("a locked term says which lesson to pass first and links to it", async ({ page }) => {
  await page.goto(`/en/terms/${third}/`);
  const go = page.locator("[data-lock-go]");
  await expect(go).toHaveAttribute("href", `/en/terms/${first}/`);
});

test("choosing a madrasa path is kept and shows that path's levels", async ({ page }) => {
  await page.goto("/en/study/");
  await page.locator('[data-pick="indian"]').first().click();
  await expect(html(page)).toHaveAttribute("data-madrasa", "indian");
  await expect(page.locator('[data-path="indian"]')).toBeVisible();
  await expect(page.locator('[data-path="ottoman"]')).toBeHidden();
  await page.reload();
  await expect(html(page)).toHaveAttribute("data-madrasa", "indian");
});

// The tests of level 2 and later (their locks, previews, and lessons of a book with a matn) wait for the first lesson
// book (docs/content.md, "Adding a book"): they are skipped until then, and their book and lesson numbers changed to it.
test.skip("level 2 stays locked until the first reading is passed", async ({ page }) => {
  await page.goto("/en/study/kati/2/");
  await expect(html(page)).toHaveAttribute("data-locked", "term");
  await page.goto("/en/study/kati/");
  await expect(html(page)).toHaveAttribute("data-level-locked", "");
});

test.skip("with every term passed, the first lesson of level 2 opens and the second stays locked", async ({ page }) => {
  await passAllTerms(page);
  // al-Kātī's lessons start at 2 (lesson group 1 is the matn's opening, with no lesson of its own).
  await page.goto("/en/study/kati/2/");
  await expect(html(page)).not.toHaveAttribute("data-locked", /.*/);
  await page.goto("/en/study/kati/3/");
  await expect(html(page)).toHaveAttribute("data-locked", "term");
});

// Every book offers three previews spread through it (config/previews.ts): for al-Kātī lessons 5, 10 and 15.
test.skip("a preview lesson can be read while its level is locked", async ({ page }) => {
  await page.goto("/en/study/kati/5/?preview");
  await expect(html(page)).toHaveAttribute("data-preview", "");
  await expect(html(page)).not.toHaveAttribute("data-locked", /.*/);
  await expect(page.locator(".term-quiz")).toBeHidden();
  await page.goto("/en/study/kati/6/?preview");
  await expect(html(page)).toHaveAttribute("data-locked", "term");
});

test.skip("a primer of a later level has previews too", async ({ page }) => {
  await page.goto("/en/study/bajuri/10/?preview");
  await expect(html(page)).toHaveAttribute("data-preview", "");
  await expect(page.locator("[data-preview-note]")).toBeVisible();
  await expect(page.locator(".term-quiz")).toBeHidden();
});

test("tikrār with nothing passed shows only the way to the study portal", async ({ page }) => {
  await page.goto("/en/practice/");
  await expect(page.locator("[data-empty]")).toBeVisible();
  await expect(page.locator("form.tikrar")).toBeHidden();
});

test("tikrār on a schedule: a passed lesson comes back the next day, and a review moves it on", async ({ page }) => {
  await page.goto(`/en/terms/${first}/`);
  await answerQuiz(page, true);
  // The reader's own calendar day, n days from now.
  const day = (n: number) => page.evaluate((n) => { const d = new Date(); d.setDate(d.getDate() + n); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }, n);
  const review = () => page.evaluate(() => JSON.parse(localStorage.getItem("nahwi-review") || "{}"));
  expect((await review())[first]).toEqual({ due: await day(1), n: 0 });
  // Not due yet: the card names the next day, without a button.
  await page.goto("/en/practice/");
  const due = page.locator("[data-due]");
  await expect(due).toBeVisible();
  await expect(due.locator("[data-due-text]")).toContainText("Nothing to review today");
  await expect(due.locator("[data-due-start]")).toBeHidden();
  // Due today: the card lists the lesson and starts a review of it.
  await page.evaluate(([slug, d]) => localStorage.setItem("nahwi-review", JSON.stringify({ [slug]: { due: d, n: 0 } })), [first, await day(-2)]);
  await page.reload();
  await expect(due.locator("[data-due-text]")).toContainText("To review today");
  await due.locator("[data-due-start]").click();
  const questions = page.locator(".tikrar-test .quiz > li");
  await expect(questions.first()).toBeVisible();
  const n = await questions.count();
  for (let k = 0; k < n; k++) await questions.nth(k).locator(".option").first().click();
  await expect(page.locator("[data-due-saved]")).toBeVisible();
  const after = (await review())[first];
  expect([await day(1), await day(3)]).toContain(after.due);
  expect(after.n === 1 ? await day(3) : await day(1)).toBe(after.due);
});

test("tikrār offers only passed lessons and builds a review test from them", async ({ page }) => {
  await page.goto(`/en/terms/${first}/`);
  await answerQuiz(page, true);
  await page.goto("/en/practice/");
  await expect(page.locator("[data-empty]")).toBeHidden();
  const box = page.locator(`[data-lesson="${first}"] input`);
  await expect(box).toBeEnabled();
  await expect(page.locator(`[data-lesson="${second}"] input`)).toBeDisabled();
  await box.check();
  await page.locator("[data-start]").click();
  await expect(page.locator(".tikrar-test .quiz > li").first()).toBeVisible();
});

test("a book's certificate shows only once every lesson is passed, with the reader's name not stored", async ({ page }) => {
  await page.goto("/en/study/mabadi/certificate/");
  await expect(page.locator("[data-cert-locked]")).toBeVisible();
  await expect(page.locator("[data-certificate]")).toBeHidden();
  await expect(page.locator("[data-cert-progress]")).toContainText("0 of");
  await passAllTerms(page);
  await page.goto("/en/study/mabadi/certificate/");
  // Every lesson passed: first the exam, 25 questions from the whole book, then the certificate.
  await expect(page.locator("[data-cert-exam]")).toBeVisible();
  await expect(page.locator("[data-certificate]")).toBeHidden();
  await page.locator(".term-quiz [data-quiz-go]").click();
  await expect(page.locator(".term-quiz .question:not([hidden])")).toHaveCount(25);
  await answerQuiz(page, true, false);
  await expect(page.locator("[data-certificate]")).toBeVisible();
  expect((await page.evaluate(() => JSON.parse(localStorage.getItem("scores") || "{}")))["exam-mabadi"]).toBe(10);
  await page.reload();
  await expect(page.locator("[data-certificate]")).toBeVisible();
  await expect(page.locator("[data-cert-locked]")).toBeHidden();
  await expect(page.locator("[data-cert-score]")).toContainText("10 of 10");
  await page.locator("#certificate-name").fill("Test Reader");
  expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain("Test Reader");
});

test("every lesson ends with a way to ask about it or report a mistake", async ({ page }) => {
  await page.goto(`/en/terms/${first}/`);
  const ask = page.locator(".lesson-help a").first();
  await expect(ask).toHaveAttribute("href", new RegExp(`/en/contact/#topic=question&page=.*${first}`));
  await ask.click();
  await expect(page.locator('select[name="topic"]')).toHaveValue("question");
  await expect(page.locator('[name="page"]')).toHaveValue(new RegExp(`/en/terms/${first}/$`));
});

test("the progress page counts today's tests against the daily goal; the study page stays free of it", async ({ page }) => {
  await page.goto("/en/study/progress/");
  await expect(page.locator("[data-today]")).toBeHidden();
  await page.goto(`/en/terms/${first}/`);
  await answerQuiz(page, true);
  await page.goto("/en/study/");
  await expect(page.locator("[data-today]")).toHaveCount(0);
  await page.goto("/en/study/progress/");
  const today = page.locator("[data-today]");
  await expect(today).toBeVisible();
  await expect(today.locator("[data-today-count]")).toContainText("1 of 1");
  await expect(today.locator("[data-today-count]")).toContainText("goal reached");
  await today.locator("[data-today-goal]").selectOption("2");
  await expect(today.locator("[data-today-count]")).toHaveText("Tests today: 1 of 2.");
  await page.reload();
  await expect(today.locator("[data-today-goal]")).toHaveValue("2");
  await expect(today.locator("[data-today-due]")).toBeHidden();
});

test("the progress page: empty before a pass, then the path book by book and the lessons to strengthen", async ({ page }) => {
  await page.goto("/en/study/progress/");
  await expect(page.locator("[data-empty]")).toBeVisible();
  await expect(page.locator("[data-progress]")).toBeHidden();
  // One term passed with two stars: it counts, and it is listed to strengthen.
  await page.evaluate((slug) => localStorage.setItem("scores", JSON.stringify({ [slug]: 6.7 })), first);
  await page.reload();
  await expect(page.locator("[data-progress]")).toBeVisible();
  const book = page.locator('.progress-books:not([hidden]) [data-book="mabadi"]');
  await expect(book).toHaveAttribute("data-state", "current");
  await expect(book.locator("[data-book-state]")).toContainText(`1 of ${terms.length} passed`);
  await expect(page.locator(`[data-weak] a[href="/en/terms/${first}/"]`)).toBeVisible();
  await expect(page.locator(".progress-activity .tile")).toHaveCount(30);
});

test("the progress page with the first reading done: its certificate, and nothing to strengthen", async ({ page }) => {
  await passAllTerms(page);
  await page.goto("/en/study/progress/");
  const book = page.locator('.progress-books:not([hidden]) [data-book="mabadi"]');
  await expect(book).toHaveAttribute("data-state", "done");
  await expect(book.locator("[data-book-cert]")).toBeVisible();
  await expect(page.locator("[data-weak-none]")).toBeVisible();
});

test.skip("a lesson with seven questions asks five, and a new try brings in the two kept in reserve", async ({ page }) => {
  await page.addInitScript(() => { if (!sessionStorage.getItem("m")) { localStorage.setItem("madrasa", "indian"); sessionStorage.setItem("m", "1"); } });
  await page.goto("/en/study/sughra/1/");
  const asked = page.locator(".term-quiz .question:not([hidden])");
  await expect(page.locator(".term-quiz .question")).toHaveCount(7);
  await page.locator(".term-quiz [data-quiz-go]").click();
  await expect(asked).toHaveCount(5);
  const first = await asked.evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.k));
  await answerQuiz(page, true);
  await page.locator(".quiz-result [data-again]").click();
  await page.locator(".term-quiz [data-quiz-go]").click();
  await expect(asked).toHaveCount(5);
  const second = await asked.evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.k));
  const reserves = ["0", "1", "2", "3", "4", "5", "6"].filter((k) => !first.includes(k));
  for (const k of reserves) expect(second).toContain(k);
});

test("the glossary is free to read and finds a concept by its Arabic, its transliteration or its topic", async ({ page }) => {
  await page.goto("/en/glossary/");
  const shown = page.locator(".kb-people li:not([hidden])");
  const total = await shown.count();
  await page.locator("[data-kb-filter]").fill("المصدر");
  await expect(shown.first()).toContainText("The verbal noun");
  await page.locator("[data-kb-filter]").fill("masdar");
  await expect(shown.first()).toContainText("The verbal noun");
  await page.locator("[data-kb-filter]").fill("");
  await page.locator('[data-facet="category"]').selectOption("sentence");
  expect(await shown.count()).toBeLessThan(total);
  await page.goto("/en/glossary/masdar/");
  await expect(page.locator("h1")).toHaveText("The verbal noun");
  await expect(page.locator(".kb-body")).toBeVisible();
  // A term lesson stays out of search and points to its free entry.
  await page.goto("/en/terms/masdar/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator(".term-glossary a")).toHaveAttribute("href", "/en/glossary/masdar/");
});

test.skip("passing a lesson's test opens the next lesson on the page, without a lock", async ({ page }) => {
  await page.addInitScript(() => { if (!sessionStorage.getItem("m")) { localStorage.setItem("madrasa", "indian"); sessionStorage.setItem("m", "1"); } });
  await page.goto("/en/study/sughra/1/");
  await answerQuiz(page, true);
  const go = page.locator(".quiz-result [data-quiz-next]");
  await expect(go).toHaveAttribute("href", /\/study\/sughra\/2\/$/);
  await expect(page.locator(".next[data-gated]")).toBeHidden();
  await go.click();
  await expect(page).toHaveURL(/\/study\/sughra\/2\/$/);
  await expect(page.locator("html")).not.toHaveAttribute("data-locked", /.*/);
});

test("every reader has a free refill; three stars on five lessons in a row earn another", async ({ page }) => {
  await page.goto(`/en/terms/${first}/`);
  // With every heart in place the refill is not mentioned; once a heart is spent it is.
  await expect(page.locator(".term-quiz .heart[data-on='1']")).toHaveCount(5);
  await expect(page.locator(".term-quiz [data-refills]")).toBeHidden();
  await page.evaluate(() => localStorage.setItem("nahwi-hearts", JSON.stringify({ n: 3, at: Date.now(), r: 0, f: 1, s: 0 })));
  await page.reload();
  await expect(page.locator(".term-quiz [data-refills]")).toHaveText("Free refills: 1");
  await page.evaluate(() => localStorage.setItem("nahwi-hearts", JSON.stringify({ n: 0, at: Date.now(), r: 0, f: 1, s: 0 })));
  await page.reload();
  const free = page.locator(".term-quiz [data-free-refill]");
  await expect(free).toHaveText("Use a free refill (1 left)");
  await free.click();
  await expect(page.locator(".term-quiz .heart[data-on='1']")).toHaveCount(5);
  await expect(page.locator(".term-quiz [data-refills]")).toBeHidden();
  await expect(page.locator(".term-quiz [data-quiz-go]")).toBeVisible();
  // Four three-star lessons already in the run: three stars on this one earn a refill.
  await page.evaluate(() => localStorage.setItem("nahwi-hearts", JSON.stringify({ n: 5, at: Date.now(), r: 0, f: 0, s: 4 })));
  await page.reload();
  await answerQuiz(page, true);
  await expect(page.locator(".quiz-result [data-earned]")).toBeVisible();
  await expect(page.locator(".term-quiz [data-refills]")).toHaveText("Free refills: 1");
});
