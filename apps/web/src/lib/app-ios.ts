// The iPhone app's extras, on every page of the app (components/AppIos.astro loads this only there): links that open
// the app, home-screen shortcuts, the daily reminder and the hearts note as notifications, a tap of the phone on a
// right or wrong answer, the system's rating window at a good moment, and buying full access through Apple
// (lib/app-store.ts). The native side is store/ios; the rules are in lib/app-rules.js and lib/progress.js.
import { HEARTS_ID, noteForReview, REMIND_BASE, REMIND_DAYS, reminderPlan } from "./app-rules.js";
import { call, has, on } from "./native";

type Texts = {
  reminderTitle: string; reminderBody: string; reminderDue: string; heartsTitle: string; heartsBody: string;
  shortcutContinue: string; shortcutTikrar: string; shortcutGlossary: string;
};
type Vars = { locale: string; texts: Texts };
type Progress = {
  dayOf(now: number): string;
  reviewQueue(review: object, passed: string[], day: string): string[];
  heartsFullAt(state: unknown, now: number): number | null;
};
type Study = { path: { s: string; q?: number }[]; tracks: Record<string, { lessons: { s: string; q?: number }[] }>; info(s: string): { done: boolean } };

const REMINDER = "nahwi-app-reminder";
const REVIEW = "nahwi-app-review";
const report = (e: unknown, where: string) => (window as unknown as { __report?: (e: unknown, w: string) => void }).__report?.(e, where);
const read = <T>(k: string, d: T): T => { try { return (JSON.parse(localStorage.getItem(k) || "null") as T) ?? d; } catch { return d; } };
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (m, k) => (k in v ? String(v[k]) : m));

/** Only addresses of this site open inside the app; anything else stays where it is. */
function go(address: string) {
  try {
    const u = new URL(address, location.href);
    if (u.origin === location.origin && u.href !== location.href) location.assign(u.href);
  } catch {}
}

export function start() {
  const el = document.querySelector<HTMLElement>("[data-app-ios]");
  if (!el) return;
  const vars = JSON.parse(el.dataset.vars || "{}") as Vars;
  const T = vars.texts;
  const L = vars.locale || "en";

  // The status bar: the strip behind it in the header's colour, its clock light or dark to match (global.css).
  statusBar();
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => statusBar());
  new MutationObserver(() => statusBar()).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  // A thenahwi.com link tapped in Mail, Telegram or Safari (Universal Links), or a sign-in mail's link.
  on<{ url: string }>("App", "appUrlOpen", (e) => { if (e?.url?.startsWith("https://")) go(e.url); });

  // A notification tapped: its page (the study portal, or the lesson whose test was waiting for hearts).
  on<{ notification?: { extra?: { url?: string } } }>("LocalNotifications", "localNotificationActionPerformed", (e) => {
    const url = e?.notification?.extra?.url;
    if (url) go(url);
  });

  // Home-screen shortcuts (a long press on the icon), in the reader's language.
  if (has("AppShortcuts")) {
    call("AppShortcuts", "set", {
      shortcuts: [
        { id: "continue", title: T.shortcutContinue, iosIcon: "book" },
        { id: "tikrar", title: T.shortcutTikrar, iosIcon: "arrow.triangle.2.circlepath" },
        { id: "glossary", title: T.shortcutGlossary, iosIcon: "character.book.closed" },
      ],
    }).catch((e) => report(e, "app shortcuts"));
    const target: Record<string, string> = { continue: `/${L}/study/`, tikrar: `/${L}/practice/`, glossary: `/${L}/glossary/` };
    on<{ shortcutId: string }>("AppShortcuts", "click", (e) => { const t = target[e?.shortcutId]; if (t) go(t); });
  }

  // A light tap of the phone on each answer: success or error.
  document.addEventListener("nahwi:answer", (e) => {
    const right = !!(e as CustomEvent<{ right: boolean }>).detail?.right;
    call("Haptics", "notification", { type: right ? "SUCCESS" : "ERROR" }).catch(() => {});
  });

  // After a test: the hearts note, and perhaps the rating window.
  document.addEventListener("nahwi:tested", (e) => {
    const d = (e as CustomEvent<{ stars: number }>).detail;
    heartsNote(T, L);
    if (d?.stars >= 3) askForReview("stars");
  });
  if (/^\/[a-z]{2}\/complete\//.test(location.pathname)) askForReview("part");

  wireReminder(T, L);
  planReminders(T, L);

  // Buying full access through Apple (once RevenueCat is set up, config/app-store.ts, the page has the App Store
  // window): every subscribe button opens it instead of Paddle's; without it they stay hidden, as in the Android app.
  if (has("Purchases") && document.querySelector("[data-store-dialog]")) {
    document.documentElement.dataset.appStore = "";
    const open = (plan: string | null) =>
      import("./app-store").then((m) => m.open(plan === "monthly" ? "monthly" : "yearly")).catch((e) => report(e, "app store load"));
    document.addEventListener("click", (e) => {
      const b = (e.target as Element | null)?.closest?.("[data-subscribe]");
      if (!b) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      open(b.getAttribute("data-subscribe"));
    }, true);
    const want = new URLSearchParams(location.search).get("subscribe");
    if (want) open(want);
  }
}

/** The red, green and blue of a computed colour, and its alpha; null when it cannot be read. */
export function rgbaOf(colour: string): [number, number, number, number] | null {
  const m = /rgba?\(([^)]+)\)/.exec(colour);
  if (!m) return null;
  const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
  return p.length >= 3 && p.slice(0, 3).every(Number.isFinite) ? [p[0], p[1], p[2], Number.isFinite(p[3]) ? p[3] : 1] : null;
}

/** The colour behind the status bar: the header's own, or the page's where the header is see-through glass. */
function statusBar() {
  const header = document.querySelector(".site-tabs") || document.querySelector(".site-header");
  const own = header ? rgbaOf(getComputedStyle(header).backgroundColor) : null;
  const colour = own && own[3] >= 0.5 ? own : rgbaOf(getComputedStyle(document.body).backgroundColor) || [255, 255, 255, 1];
  document.documentElement.style.setProperty("--app-status-bg", `rgb(${colour[0]} ${colour[1]} ${colour[2]})`);
  // Relative luminance: a dark strip gets the light clock (Capacitor's "DARK" style), a light one the dark clock.
  const lum = (0.2126 * colour[0] + 0.7152 * colour[1] + 0.0722 * colour[2]) / 255;
  call("StatusBar", "setStyle", { style: lum < 0.5 ? "DARK" : "LIGHT" }).catch(() => {});
}

/** The notifications the reader allowed (asks only when `ask`, from the reminder's own button). */
async function allowed(ask: boolean): Promise<boolean> {
  try {
    const now = await call<{ display: string }>("LocalNotifications", "checkPermissions");
    if (now.display === "granted") return true;
    if (!ask || now.display === "denied") return false;
    return (await call<{ display: string }>("LocalNotifications", "requestPermissions")).display === "granted";
  } catch { return false; }
}

const reminderIds = () => Array.from({ length: REMIND_DAYS }, (_, i) => ({ id: REMIND_BASE + i }));

/**
 * The daily reminders for the next two weeks, each with that day's lessons due (on study pages, which have the study
 * data); on other pages the ones already planned stay.
 */
async function planReminders(T: Texts, L: string) {
  const time = read<string | null>(REMINDER, null);
  const P = (window as unknown as { __progress?: Progress }).__progress;
  const S = (window as unknown as { __study?: Study }).__study;
  if (!time || !P || !S || !(await allowed(false))) return;
  const passed = [...S.path, ...Object.values(S.tracks).flatMap((x) => x.lessons)].filter((l) => l.q && S.info(l.s).done).map((l) => l.s);
  const review = read<object>("nahwi-review", {});
  const plan = reminderPlan(time, Date.now(), (day) => P.reviewQueue(review, passed, day).length);
  try {
    await call("LocalNotifications", "cancel", { notifications: reminderIds() });
    await call("LocalNotifications", "schedule", {
      notifications: plan.map((p) => ({
        id: p.id,
        title: T.reminderTitle,
        body: p.due ? fill(T.reminderDue, { n: p.due }) : T.reminderBody,
        schedule: { at: new Date(p.at), allowWhileIdle: true },
        extra: { url: `/${L}/${p.due ? "practice" : "study"}/` },
      })),
    });
  } catch (e) { report(e, "app reminders"); }
}

/** "Your hearts are full again", at the moment they are, while a test waits for them; cancelled when they are full. */
async function heartsNote(T: Texts, L: string) {
  const P = (window as unknown as { __progress?: Progress }).__progress;
  if (!P || !(await allowed(false))) return;
  const full = P.heartsFullAt(read("nahwi-hearts", null), Date.now());
  try {
    await call("LocalNotifications", "cancel", { notifications: [{ id: HEARTS_ID }] });
    if (full) {
      await call("LocalNotifications", "schedule", {
        notifications: [{ id: HEARTS_ID, title: T.heartsTitle, body: T.heartsBody, schedule: { at: new Date(full) }, extra: { url: location.pathname.startsWith(`/${L}/`) ? location.pathname : `/${L}/study/` } }],
      });
    }
  } catch (e) { report(e, "app hearts note"); }
}

/** The reminder card in the app (components/Reminder.astro, data-ios-only): on with a time, or off. */
function wireReminder(T: Texts, L: string) {
  const box = document.querySelector<HTMLElement>("[data-app-reminder]");
  if (!box) return;
  const input = box.querySelector<HTMLInputElement>('input[type="time"]')!;
  const onBtn = box.querySelector<HTMLButtonElement>("[data-app-reminder-on]")!;
  const offBtn = box.querySelector<HTMLButtonElement>("[data-app-reminder-off]")!;
  const status = box.querySelector<HTMLElement>("[data-app-reminder-status]")!;
  const show = (msg = "") => {
    const time = read<string | null>(REMINDER, null);
    if (time) input.value = time;
    offBtn.hidden = !time;
    status.textContent = msg || (time ? fill(box.dataset.set || "", { time }) : "");
    status.hidden = !status.textContent;
  };
  onBtn.addEventListener("click", async () => {
    if (!(await allowed(true))) { show(box.dataset.denied || ""); return; }
    write(REMINDER, input.value || "20:00");
    await planReminders(T, L);
    show();
  });
  offBtn.addEventListener("click", async () => {
    try { localStorage.removeItem(REMINDER); } catch {}
    await call("LocalNotifications", "cancel", { notifications: reminderIds() }).catch(() => {});
    show();
  });
  show();
}

function askForReview(what: "stars" | "part") {
  const r = noteForReview(read(REVIEW, null), Date.now(), what);
  write(REVIEW, r.state);
  // A moment later, so the score is seen first.
  if (r.ask) setTimeout(() => call("InAppReview", "requestReview").catch(() => {}), 1500);
}
