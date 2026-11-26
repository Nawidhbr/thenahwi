// When the support window (components/SupportDialog.astro) opens by itself: now and then, and never often.
// The rule is in nudgeDue (tested in test/support-nudge.test.js); this file counts pages, waits for a quiet moment
// and remembers the answer. All of it stays in the browser (nahwi-support; the privacy page says so).

const KEY = "nahwi-support";
const DAY = 86400000;
/** Pages read before the first ask, the gap after an ask, after "Not now" and after a gift. */
export const NUDGE = { pages: 6, shown: 30 * DAY, later: 60 * DAY, gave: 180 * DAY };

export type NudgeState = { n: number; next: number };

/** Whether to ask now: enough pages read, the waiting time over, and a page where asking does not get in the way. */
export function nudgeDue(s: NudgeState, now: number, page: { path: string; quiet: boolean; paid: boolean }) {
  if (page.paid || !page.quiet) return false;
  if (/\/(account|pricing|terms-of-service|refunds|privacy|contact)\//.test(page.path)) return false;
  return s.n >= NUDGE.pages && now >= s.next;
}

const read = (): NudgeState => {
  try { const s = JSON.parse(localStorage.getItem(KEY) || "null"); if (s && typeof s.n === "number") return { n: s.n, next: Number(s.next) || 0 }; } catch {}
  return { n: 0, next: 0 };
};
const write = (s: NudgeState) => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} };

export function nudge(dialog: HTMLDialogElement) {
  const s = read();
  s.n += 1;
  write(s);
  const root = document.documentElement;
  let paid = false;
  try { paid = !!JSON.parse(localStorage.getItem("nahwi-access") || "null")?.paid; } catch {}
  const quiet = !root.hasAttribute("data-locked") && !document.querySelector(".term-quiz, .tikrar-test, form.tikrar");
  if (!nudgeDue(s, Date.now(), { path: location.pathname, quiet, paid })) return;

  // A quiet moment: after reading for a while, or once most of the page has been read; not while another window is open.
  let done = false;
  const ask = () => {
    if (done || document.hidden || document.querySelector("dialog[open]")) return;
    done = true;
    cleanup();
    write({ n: s.n, next: Date.now() + NUDGE.shown });
    dialog.dataset.nudged = "";
    dialog.showModal();
  };
  const onScroll = () => {
    const seen = (window.scrollY + window.innerHeight) / Math.max(1, document.documentElement.scrollHeight);
    if (seen > 0.7) ask();
  };
  const timer = setTimeout(ask, 45000);
  const cleanup = () => { clearTimeout(timer); window.removeEventListener("scroll", onScroll); };
  window.addEventListener("scroll", onScroll, { passive: true });

  dialog.querySelector("[data-support-later]")?.addEventListener("click", () => {
    write({ n: s.n, next: Date.now() + NUDGE.later });
    dialog.close();
  });
  dialog.querySelector(".account-primary")?.addEventListener("click", () => write({ n: s.n, next: Date.now() + NUDGE.gave }));
}
