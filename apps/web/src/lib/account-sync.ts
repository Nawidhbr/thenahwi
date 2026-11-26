// Keeps the browser's progress and the account's copy in step (phase 3). The browser stays the first place: pages
// read their locks from localStorage as before; this only merges, the highest score winning (lib/sync-merge.js, the
// same rule as merge_scores in the database), so nothing is ever lost. Started by BaseLayout when a session is stored.
import { supabase } from "./supabase-client";
import { cleanScores, cleanVisited, licenceOf, mergeMadrasa, mergeScores, mergeVisited } from "./sync-merge.js";
import { mergeHearts } from "./progress.js";

/** The hearts (lib/progress.js), kept with the profile so a cleared browser does not refill them. */
const HEARTS = "nahwi-hearts";
type Hearts = { n: number; at: number; r: number; f?: number; s?: number };

const LAST = "nahwi-sync";
/** { paid, until } of the reader's licences, read by head-study.js (accessOf in lib/progress.js). */
const ACCESS = "nahwi-access";
/** "1" when the account is a moderator (the account menu then links to /en/moderate/; head-settings.js sets data-moderator). */
const MODERATOR = "nahwi-moderator";
/** Without a change in this browser, look for progress from other devices at most this often. */
const PULL_EVERY = 10 * 60 * 1000;

const read = <T>(k: string, d: T): T => { try { return JSON.parse(localStorage.getItem(k) || "") ?? d; } catch { return d; } };
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, typeof v === "string" ? v : JSON.stringify(v)); } catch {} };

export type SyncResult = { scores: number; visited: number; at: number };

let running: Promise<SyncResult | null> | null = null;

/** Merge now (force) or only when this browser changed or the last merge is old. Null without a session. */
export function sync(force = false): Promise<SyncResult | null> {
  if (running) return running;
  running = run(force).finally(() => { running = null; });
  return running;
}

async function run(force: boolean): Promise<SyncResult | null> {
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  if (!session) return null;
  const user = session.user.id;
  const scores = cleanScores(read("scores", {}));
  const visited = cleanVisited(read("visited", []));
  const madrasa = localStorage.getItem("madrasa");
  const print = JSON.stringify([scores, visited, madrasa, localStorage.getItem(HEARTS)]);
  const last = read<{ u?: string; f?: string; t?: number; n?: number; v?: number }>(LAST, {});
  if (!force && last.u === user && last.f === print && Date.now() - (last.t || 0) < PULL_EVERY) {
    return { scores: last.n || 0, visited: last.v || 0, at: last.t || 0 };
  }

  const [s, v, p0, l, mod] = await Promise.all([
    supabase.rpc("merge_scores", { incoming: scores }),
    supabase.rpc("merge_visited", { incoming: visited }),
    supabase.from("profiles").select("madrasa, hearts").eq("id", user).maybeSingle(),
    supabase.from("licences").select("starts_at, ends_at"),
    supabase.rpc("is_moderator"),
  ]);
  if (!mod.error) {
    try { if (mod.data === true) localStorage.setItem(MODERATOR, "1"); else localStorage.removeItem(MODERATOR); } catch {}
    if (mod.data === true) document.documentElement.dataset.moderator = ""; else delete document.documentElement.dataset.moderator;
  }
  // Before the hearts migration is applied the column is missing: the madrasa path is still kept in step.
  const withHearts = !p0.error;
  const p = withHearts ? p0 : await supabase.from("profiles").select("madrasa").eq("id", user).maybeSingle();
  // Full access (config/pricing.ts): kept in the browser so the head script can set locks before paint.
  if (!l.error) write(ACCESS, licenceOf((l.data as { starts_at: string; ends_at: string | null }[]) || [], Date.now()));
  if (s.error) throw s.error;
  if (v.error) throw v.error;

  // Read again: a test may have been finished while the request was on its way.
  const newScores = mergeScores(read("scores", {}), (s.data as { key: string; score: number }[]) || []);
  const newVisited = mergeVisited(read("visited", []), (v.data as string[]) || []);
  write("scores", newScores);
  write("visited", newVisited);
  if (!p.error) {
    const m = mergeMadrasa(madrasa, p.data?.madrasa ?? null);
    if (m.local && m.local !== madrasa) write("madrasa", m.local);
    if (m.save) await supabase.from("profiles").update({ madrasa: m.local, locale: document.documentElement.lang.slice(0, 2) }).eq("id", user);
    // Hearts: the later refill, else the fewer (mergeHearts); a refill bought with Paddle arrives this way.
    const local = read<Hearts | null>(HEARTS, null);
    const remote = ((p.data as { hearts?: Hearts | null } | null)?.hearts) ?? null;
    const h = withHearts ? mergeHearts(local, remote, Date.now()) : null;
    if (h) {
      const keep = { n: h.n, at: h.at, r: h.r || 0, f: h.f, s: h.s };
      const same = (x: Hearts | null) => !!x && x.n === keep.n && x.at === keep.at && (x.r || 0) === keep.r && x.f === keep.f && x.s === keep.s;
      if (!same(local)) { write(HEARTS, keep); window.dispatchEvent(new Event("nahwi:hearts")); }
      if (!same(remote)) await supabase.from("profiles").update({ hearts: keep }).eq("id", user);
    }
  }
  const result = { scores: Object.keys(cleanScores(newScores)).length, visited: newVisited.length, at: Date.now() };
  write(LAST, { u: user, f: JSON.stringify([cleanScores(newScores), cleanVisited(newVisited), localStorage.getItem("madrasa"), localStorage.getItem(HEARTS)]), t: result.at, n: result.scores, v: result.visited });
  return result;
}

const report = (e: unknown) => {
  if (navigator.onLine) (window as unknown as { __report?: (e: unknown, where: string) => void }).__report?.(e, "account-sync");
};

let started = false;

/** On every page of a signed-in reader: merge once, then again after every test (term-quiz.js sends nahwi:progress). */
export function start() {
  if (started) return;
  started = true;
  sync().catch(report);
  let timer: ReturnType<typeof setTimeout> | undefined;
  const soon = () => { clearTimeout(timer); timer = setTimeout(() => sync(true).catch(report), 800); };
  window.addEventListener("nahwi:progress", soon);
  window.addEventListener("online", soon);
  // Back from buying a refill (?refilled=1, scripts/subscribe.ts): look for it every few seconds until the webhook
  // has written it to the profile (a later refill time).
  const url = new URL(location.href);
  if (url.searchParams.has("refilled")) {
    url.searchParams.delete("refilled");
    history.replaceState(null, "", url.pathname + url.search + url.hash);
    const before = read<Hearts | null>(HEARTS, null)?.r || 0;
    let k = 0;
    const look = () => sync(true).catch(report).finally(() => {
      if ((read<Hearts | null>(HEARTS, null)?.r || 0) > before || ++k >= 24) { window.dispatchEvent(new Event("nahwi:hearts")); return; }
      setTimeout(look, 5000);
    });
    look();
  }
}

/** Forget when this browser last merged (after signing out, so the next account starts fresh). */
export function forgetSync() {
  try { localStorage.removeItem(LAST); localStorage.removeItem(ACCESS); localStorage.removeItem(MODERATOR); } catch {}
}
