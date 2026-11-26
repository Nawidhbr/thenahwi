// The account page (pages/[locale]/account.astro): sign in with a mail (link or 6-digit code), with a password, with
// Google or with Apple, and, once signed in, the progress saved, a password to set, sign out, download my data and
// delete my account. Bundled by Astro.
import { supabase } from "../lib/supabase-client";
import { oauthSignIn } from "../lib/app-signin";
import { forgetSync, sync } from "../lib/account-sync";
import { emailSignin, setPassword } from "../lib/email-signin";
import type { Session } from "@supabase/supabase-js";

// Read before supabase-js handles the address: a link or a Google sign-in comes back with ?code= (or an error).
const arrival = new URL(location.href);
const hash = new URLSearchParams(arrival.hash.slice(1));
const cameBack = arrival.searchParams.has("code");
const urlError = arrival.searchParams.get("error") || hash.get("error");
// Back from Paddle's checkout (successUrl): the licence arrives through the webhook within moments.
const paid = arrival.searchParams.has("paid");

const PENDING = "nahwi-auth-pending";
// An access code from a link (?redeem=<code>), kept for the session so it survives the sign-in.
const REDEEM = "nahwi-redeem";
const linkCode = arrival.searchParams.get("redeem");
if (linkCode) try { sessionStorage.setItem(REDEEM, linkCode.slice(0, 40)); } catch {}
const storedCode = () => { try { return sessionStorage.getItem(REDEEM) || ""; } catch { return ""; } };
const COOLDOWN = 60;

type Texts = Record<string, string> & { errors: Record<string, string>; redeemErrors: Record<string, string> };
type AuthError = { status?: number; code?: string; message?: string };

const fill = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
/** The first letter of a name or address, for the account tile in the header and on this page. */
const initialOf = (s: string) => (s.match(/\p{L}|\p{N}/u)?.[0] || "·").toLocaleUpperCase();
/** Show the header's account tile signed in (with this letter) or signed out; head-settings.js does the same before paint. */
const identity = (letter: string | null) => {
  const root = document.documentElement;
  if (letter) { root.dataset.signedIn = ""; root.style.setProperty("--account-initial", JSON.stringify(letter)); }
  else { delete root.dataset.signedIn; root.style.removeProperty("--account-initial"); }
};
const report = (e: unknown, where: string) => (window as unknown as { __report?: (e: unknown, w: string) => void }).__report?.(e, where);

export function start() {
  const box = document.querySelector<HTMLElement>("[data-account]");
  if (!box) return;
  const T = JSON.parse(box.dataset.texts || "{}") as Texts;
  const E = T.errors;
  const locale = box.dataset.locale || "en";
  const back = `${location.origin}/${locale}/account/`;
  const $ = <K extends HTMLElement = HTMLElement>(sel: string) => box.querySelector<K>(sel)!;
  const status = $("[data-status]");
  const emailForm = $<HTMLFormElement>("[data-email-form]");
  const codeForm = $<HTMLFormElement>("[data-code-form]");
  const emailInput = emailForm.elements.namedItem("email") as HTMLInputElement;
  const codeInput = codeForm.elements.namedItem("code") as HTMLInputElement;
  const verifyBtn = $<HTMLButtonElement>("[data-verify]");
  const resendBtn = $<HTMLButtonElement>("[data-resend]");
  const resendNote = $("[data-resend-note]");
  const saveBtn = $<HTMLButtonElement>("[data-save]");
  const confirmBox = $("[data-confirm]");

  const show = (state: string) => {
    box.dataset.state = state;
    for (const el of box.querySelectorAll<HTMLElement>("[data-show]")) el.hidden = !(el.dataset.show || "").split(" ").includes(state);
  };
  const tell = (el: HTMLElement) => (msg = "", kind: "error" | "ok" = "error") => {
    el.textContent = msg;
    el.dataset.kind = kind;
    el.hidden = !msg;
  };
  const say = tell(status);
  // The code form answers right under itself, where the reader is looking.
  const sayCode = tell($("[data-redeem-status]"));
  const busy = (b: HTMLButtonElement, on: boolean, label: string) => { b.disabled = on; b.textContent = label; };

  const explain = (e: unknown, where: "send" | "verify" | "other") => {
    const err = (e || {}) as AuthError;
    if (!navigator.onLine) return T.offline;
    if (err.status === 429 || /rate_limit/.test(err.code || "")) return E.rate;
    if (where === "verify" && (err.status === 403 || err.code === "otp_expired" || err.code === "invalid_credentials")) return E.invalidCode;
    if (where === "send" && (err.code === "email_address_invalid" || err.code === "validation_failed")) return E.invalidEmail;
    report(e, `account ${where}`);
    return E.generic;
  };

  // ——— Signed out: Google, or a mail with a link and a code ———
  const pending = (): { email: string; t: number } | null => {
    try {
      const p = JSON.parse(sessionStorage.getItem(PENDING) || "null");
      return p && typeof p.email === "string" && Date.now() - p.t < 60 * 60 * 1000 ? p : null;
    } catch { return null; }
  };
  let tick: ReturnType<typeof setInterval> | undefined;
  const cooldown = (since: number) => {
    clearInterval(tick);
    const step = () => {
      const left = COOLDOWN - Math.floor((Date.now() - since) / 1000);
      resendBtn.disabled = left > 0;
      resendNote.hidden = left <= 0;
      resendNote.textContent = fill(T.resendIn, { s: Math.max(0, left) });
      if (left <= 0) clearInterval(tick);
    };
    step();
    tick = setInterval(step, 1000);
  };
  const askCode = (p: { email: string; t: number }) => {
    $("[data-sent-text]").textContent = fill(T.sent, { email: p.email });
    show("code");
    cooldown(p.t);
    codeInput.focus();
  };
  const signedOut = () => {
    const p = pending();
    if (p) askCode(p);
    else show("out");
    // A code from a link waits for the sign-in.
    const code = storedCode();
    const note = $("[data-redeem-pending]");
    note.textContent = code ? fill(T.redeemSignIn, { code }) : "";
    note.hidden = !code;
  };

  const sendMail = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: back, shouldCreateUser: true } });
    if (error) throw error;
    const p = { email, t: Date.now() };
    try { sessionStorage.setItem(PENDING, JSON.stringify(p)); } catch {}
    return p;
  };

  // Google, and Apple when APPLE_SIGN_IN puts its button on the page: both come back here with ?code=.
  for (const provider of ["google", "apple"] as const) {
    box.querySelector(`[data-${provider}]`)?.addEventListener("click", async () => {
      say();
      const error = await oauthSignIn(supabase, provider, back);
      if (error) say(explain(error, "other"));
    });
  }

  // The email form: a mailed code, or a password (signing in, or a new account confirmed by a mailed code).
  emailSignin(box, {
    texts: { send: T.send, sending: T.sending, signIn: T.signIn, signingIn: T.signingIn, create: T.create, creating: T.creating, forgotNote: T.forgotNote, unconfirmed: T.unconfirmed, offline: T.offline, errors: E },
    redirect: () => back,
    say,
    sendCode: async (email) => askCode(await sendMail(email)),
    mailed: (email) => {
      const p = { email, t: Date.now() };
      try { sessionStorage.setItem(PENDING, JSON.stringify(p)); } catch {}
      askCode(p);
    },
    signedIn: (session) => signedIn(session, true),
    explainSend: (e) => explain(e, "send"),
    report,
  });

  codeForm.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    say();
    const p = pending();
    const token = codeInput.value.replace(/\D/g, "");
    if (!p) { show("out"); return; }
    if (token.length < 6) { say(E.invalidCode); codeInput.focus(); return; }
    busy(verifyBtn, true, T.verifying);
    try {
      const { data, error } = await supabase.auth.verifyOtp({ email: p.email, token, type: "email" });
      if (error) throw error;
      try { sessionStorage.removeItem(PENDING); } catch {}
      codeInput.value = "";
      if (data.session) await signedIn(data.session, true);
    } catch (e) { say(explain(e, "verify")); }
    finally { busy(verifyBtn, false, T.verify); }
  });

  resendBtn.addEventListener("click", async () => {
    const p = pending();
    if (!p) { show("out"); return; }
    say();
    try { cooldown((await sendMail(p.email)).t); }
    catch (e) { say(explain(e, "send")); }
  });

  $("[data-other]").addEventListener("click", () => {
    try { sessionStorage.removeItem(PENDING); } catch {}
    say();
    show("out");
    emailInput.focus();
  });

  // ——— Signed in ———
  let current: Session | null = null;
  const showProgress = (r: { scores: number; visited: number; at: number } | null) => {
    if (!r) return;
    const lang = document.documentElement.lang;
    $("[data-stat-tests]").textContent = r.scores.toLocaleString(lang);
    $("[data-stat-steps]").textContent = r.visited.toLocaleString(lang);
    const time = new Intl.DateTimeFormat(document.documentElement.lang, { dateStyle: "medium", timeStyle: "short" }).format(new Date(r.at));
    $("[data-saved-at]").textContent = fill(T.savedAt, { time });
    showPlan().catch((e) => report(e, "account plan"));
  };
  // Full access (config/pricing.ts): the newest licence, with Paddle's links to cancel or change the payment method.
  const showPlan = async () => {
    const { data, error } = await supabase.from("licences").select("starts_at, ends_at, manage_url, update_url").order("ends_at", { ascending: false, nullsFirst: true });
    if (error) return;
    const now = Date.now();
    const live = ((data as { starts_at: string; ends_at: string | null; manage_url: string | null; update_url: string | null }[]) || []).find((r) => Date.parse(r.starts_at) <= now && (r.ends_at == null || Date.parse(r.ends_at) > now));
    const plan = $("[data-plan]");
    const link = (sel: string, url: string | null) => { const a = $<HTMLAnchorElement>(sel); a.hidden = !url; if (url) a.href = url; };
    $("[data-plan-upgrade]").hidden = !!live;
    link("[data-plan-manage]", live?.manage_url ?? null);
    link("[data-plan-update]", live?.update_url ?? null);
    if (!live) { plan.textContent = T.planFree; return false; }
    const date = live.ends_at ? new Intl.DateTimeFormat(document.documentElement.lang, { dateStyle: "long" }).format(new Date(live.ends_at)) : "";
    plan.textContent = live.ends_at ? fill(T.planPaid, { date }) : T.planPaidOpen;
    return true;
  };
  // After paying: say thank you, and look for the licence every few seconds until the webhook has written it.
  const awaitLicence = async () => {
    const note = $("[data-welcome]");
    note.textContent = T.paidThanks;
    note.hidden = false;
    for (let k = 0; k < 24; k++) {
      if (await showPlan().catch(() => false)) {
        note.textContent = T.paidDone;
        await sync(true).catch(() => null);
        return;
      }
      await new Promise((r) => setTimeout(r, 5000));
    }
  };
  const save = async () => {
    busy(saveBtn, true, T.saving);
    try { showProgress(await sync(true)); }
    catch (e) { say(explain(e, "other")); }
    finally { busy(saveBtn, false, T.saveNow); }
  };
  async function signedIn(session: Session, welcome: boolean) {
    current = session;
    const provider = session.user.app_metadata?.provider;
    const how = provider === "google" ? T.viaGoogle : provider === "apple" ? T.viaApple : T.viaEmail;
    const meta = session.user.user_metadata || {};
    const letter = initialOf(meta.full_name || meta.name || session.user.email || "");
    identity(letter);
    $("[data-initial]").textContent = letter;
    $("[data-email]").textContent = session.user.email || "";
    $<HTMLInputElement>("[data-password-user]").value = session.user.email || "";
    $("[data-how]").textContent = how;
    $("[data-welcome]").hidden = !welcome;
    confirmBox.hidden = true;
    say();
    show("in");
    await save();
    if (paid) awaitLicence().catch((e) => report(e, "account licence"));
    const code = storedCode();
    if (code) { redeemInput.value = code; redeemInput.focus(); }
  }

  // An access code (supabase/migrations/…_access_codes.sql): redeem_code gives this account a licence from it.
  const redeemForm = $<HTMLFormElement>("[data-redeem-form]");
  const redeemInput = redeemForm.elements.namedItem("redeem") as HTMLInputElement;
  const redeemBtn = $<HTMLButtonElement>("[data-redeem]");
  redeemForm.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    sayCode();
    const code = redeemInput.value.trim();
    const R = T.redeemErrors;
    if (code.replace(/[^A-Za-z0-9]/g, "").length < 8) { sayCode(R.unknown); redeemInput.focus(); return; }
    busy(redeemBtn, true, T.redeeming);
    try {
      const { data, error } = await supabase.rpc("redeem_code", { code });
      if (error) throw error;
      const r = (data || {}) as { ok?: boolean; until?: string | null; reason?: string };
      if (!r.ok) { sayCode(R[r.reason || ""] || R.other); return; }
      try { sessionStorage.removeItem(REDEEM); } catch {}
      redeemInput.value = "";
      const date = r.until ? new Intl.DateTimeFormat(document.documentElement.lang, { dateStyle: "long" }).format(new Date(r.until)) : "";
      sayCode(r.until ? fill(T.redeemOk, { date }) : T.redeemOkOpen, "ok");
      await showPlan().catch(() => false);
      await sync(true).catch(() => null);
    } catch (e) {
      report(e, "account redeem");
      sayCode(R.other);
    } finally {
      busy(redeemBtn, false, T.redeem);
    }
  });

  saveBtn.addEventListener("click", save);

  // A password for next time (or a new one, after "Forgot your password?" and a sign-in with a code).
  const passwordForm = $<HTMLFormElement>("[data-password-form]");
  const passwordInput = passwordForm.elements.namedItem("new-password") as HTMLInputElement;
  const passwordBtn = $<HTMLButtonElement>("[data-password-save]");
  const sayPassword = tell($("[data-password-status]"));
  passwordForm.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    sayPassword();
    busy(passwordBtn, true, T.savingPassword);
    try {
      const r = await setPassword(passwordInput.value, { saved: T.passwordSaved, offline: T.offline, errors: E }, report);
      sayPassword(r.msg, r.ok ? "ok" : "error");
      if (r.ok) passwordInput.value = "";
      else passwordInput.focus();
    } finally { busy(passwordBtn, false, T.savePassword); }
  });

  const leave = async () => {
    await supabase.auth.signOut({ scope: "local" }).catch(() => {});
    forgetSync();
    current = null;
    identity(null);
  };
  $("[data-signout]").addEventListener("click", async () => {
    await leave();
    show("out");
  });

  $("[data-download]").addEventListener("click", async () => {
    say();
    const { data, error } = await supabase.rpc("export_my_data");
    if (error) { say(explain(error, "other")); return; }
    const u = current?.user;
    const doc = { site: location.origin, exported: new Date().toISOString(), account: u ? { email: u.email, created_at: u.created_at, provider: u.app_metadata?.provider, name: u.user_metadata?.full_name ?? u.user_metadata?.name ?? null } : null, ...(data as object) };
    const url = URL.createObjectURL(new Blob([JSON.stringify(doc, null, 2)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "the-nahwi-my-data.json";
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  });

  $("[data-delete]").addEventListener("click", () => { confirmBox.hidden = false; $<HTMLButtonElement>("[data-delete-no]").focus(); });
  $("[data-delete-no]").addEventListener("click", () => { confirmBox.hidden = true; });
  $("[data-delete-yes]").addEventListener("click", async () => {
    say();
    const { error } = await supabase.rpc("delete_my_account");
    if (error) { say(explain(error, "other")); return; }
    await leave();
    show("out");
    say(T.deleted, "ok");
  });

  supabase.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_OUT" && box.dataset.state === "in") { current = null; forgetSync(); show("out"); }
  });

  // ——— Start ———
  (async () => {
    if (!navigator.onLine) { show("offline"); return; }
    const init = await supabase.auth.initialize();
    if (cameBack || urlError || paid || linkCode) history.replaceState(null, "", location.pathname);
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      try { sessionStorage.removeItem(PENDING); } catch {}
      await signedIn(data.session, cameBack);
      return;
    }
    signedOut();
    if (urlError || (cameBack && init.error)) say(E.link);
  })().catch((e) => { say(explain(e, "other")); show("out"); });
}
