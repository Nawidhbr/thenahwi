// The email part of signing in, on the account page (scripts/account-page.ts) and in the subscribe window
// (scripts/subscribe.ts): by a mailed code (a link and a 6-digit code, as before), or with a password: signing in with
// one, or creating an account with one, after which Supabase mails a code to confirm the address. Forgot the password?
// The reader signs in with a code and sets a new one on the account page, so no reset mail is needed. Which of the two
// (code or password) the reader chose is remembered in this browser.
//
// The markup (inside `root`): buttons [data-mode="code"|"password"], a form [data-signin-form] with inputs "email" and
// "password" and a submit button [data-signin-go], elements [data-only="…"] shown for those modes, and the buttons
// [data-to-create], [data-to-signin] and [data-forgot].
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase-client";
import { alreadyRegistered, passwordProblem, passwordTooWeak } from "./password";

export type Mode = "code" | "password" | "create";
const REMEMBER = "nahwi-signin-mode";

export interface SigninTexts {
  send: string; sending: string; signIn: string; signingIn: string; create: string; creating: string;
  forgotNote: string; unconfirmed: string; offline: string;
  errors: Record<string, string>;
}

export interface SigninHooks {
  texts: SigninTexts;
  /** Where a link in a mail comes back to. */
  redirect: () => string;
  say: (msg?: string, kind?: "error" | "ok") => void;
  /** Mail a link and a code (signInWithOtp), then ask for the code. */
  sendCode: (email: string) => Promise<void>;
  /** Supabase mailed a code to confirm this address (a new account, or one not yet confirmed): ask for it. */
  mailed: (email: string) => void;
  signedIn: (session: Session) => void | Promise<void>;
  /** The message for a failed code mail, as the page already words it. */
  explainSend: (e: unknown) => string;
  report: (e: unknown, where: string) => void;
}

export function emailSignin(root: HTMLElement, h: SigninHooks) {
  const T = h.texts;
  const E = T.errors;
  const form = root.querySelector<HTMLFormElement>("[data-signin-form]");
  if (!form) return;
  const email = form.elements.namedItem("email") as HTMLInputElement;
  const password = form.elements.namedItem("password") as HTMLInputElement;
  const go = form.querySelector<HTMLButtonElement>("[data-signin-go]")!;

  let mode: Mode = "code";
  try { if (localStorage.getItem(REMEMBER) === "password") mode = "password"; } catch {}
  const label = () => (mode === "code" ? T.send : mode === "password" ? T.signIn : T.create);
  const working = () => (mode === "code" ? T.sending : mode === "password" ? T.signingIn : T.creating);

  const set = (m: Mode, remember = true) => {
    mode = m;
    form.dataset.signinMode = m;
    const tab = m === "create" ? "password" : m;
    for (const b of root.querySelectorAll<HTMLButtonElement>("[data-mode]")) b.setAttribute("aria-pressed", String(b.dataset.mode === tab));
    for (const el of root.querySelectorAll<HTMLElement>("[data-only]")) el.hidden = !(el.dataset.only || "").split(" ").includes(m);
    // Password managers offer a saved password when signing in and a new one when creating an account.
    password.autocomplete = m === "create" ? "new-password" : "current-password";
    go.textContent = label();
    if (remember) try { localStorage.setItem(REMEMBER, tab); } catch {}
  };
  const focus = () => (mode !== "code" && email.value ? password : email).focus();
  set(mode, false);

  for (const b of root.querySelectorAll<HTMLButtonElement>("[data-mode]")) {
    b.addEventListener("click", () => { h.say(); set(b.dataset.mode === "password" ? "password" : "code"); focus(); });
  }
  root.querySelector("[data-to-create]")?.addEventListener("click", () => { h.say(); set("create"); focus(); });
  root.querySelector("[data-to-signin]")?.addEventListener("click", () => { h.say(); set("password"); focus(); });
  root.querySelector("[data-forgot]")?.addEventListener("click", () => { set("code"); h.say(T.forgotNote, "ok"); email.focus(); });

  const why = (e: unknown) => {
    if (!navigator.onLine) return T.offline;
    switch (passwordProblem(e)) {
      case "rate": return E.rate;
      case "wrong": return E.wrongPassword;
      case "weak": return E.weakPassword;
      case "exists": return E.exists;
      default: h.report(e, `sign-in ${mode}`); return E.generic;
    }
  };

  const confirmAgain = async (address: string) => {
    const { error } = await supabase.auth.resend({ type: "signup", email: address, options: { emailRedirectTo: h.redirect() } });
    if (error) throw error;
    h.mailed(address);
    h.say(T.unconfirmed, "ok");
  };

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    h.say();
    const address = email.value.trim();
    if (!address || !email.checkValidity()) { h.say(E.invalidEmail); email.focus(); return; }
    if (mode === "password" && !password.value) { h.say(E.wrongPassword); password.focus(); return; }
    if (mode === "create" && passwordTooWeak(password.value)) { h.say(E.weakPassword); password.focus(); return; }
    const now = mode;
    go.disabled = true;
    go.textContent = working();
    try {
      if (now === "code") {
        await h.sendCode(address);
      } else if (now === "password") {
        const { data, error } = await supabase.auth.signInWithPassword({ email: address, password: password.value });
        if (error && passwordProblem(error) === "unconfirmed") { await confirmAgain(address); return; }
        if (error) throw error;
        password.value = "";
        if (data.session) await h.signedIn(data.session);
      } else {
        const { data, error } = await supabase.auth.signUp({ email: address, password: password.value, options: { emailRedirectTo: h.redirect() } });
        if (error) throw error;
        if (alreadyRegistered(data.user)) { h.say(E.exists); return; }
        password.value = "";
        if (data.session) await h.signedIn(data.session);
        else h.mailed(address);
      }
    } catch (e) {
      h.say(now === "code" ? h.explainSend(e) : why(e));
    } finally {
      go.disabled = false;
      go.textContent = label();
    }
  });
}

/** Set or change the signed-in reader's password (the account page). Returns the message to show. */
export async function setPassword(value: string, texts: { saved: string; offline: string; errors: Record<string, string> }, report: (e: unknown, where: string) => void): Promise<{ ok: boolean; msg: string }> {
  const E = texts.errors;
  if (passwordTooWeak(value)) return { ok: false, msg: E.weakPassword };
  const { error } = await supabase.auth.updateUser({ password: value });
  if (!error) return { ok: true, msg: texts.saved };
  if (!navigator.onLine) return { ok: false, msg: texts.offline };
  switch (passwordProblem(error)) {
    case "same": return { ok: false, msg: E.samePassword };
    case "weak": return { ok: false, msg: E.weakPassword };
    case "reauth": return { ok: false, msg: E.reauth };
    case "rate": return { ok: false, msg: E.rate };
    default: report(error, "account password"); return { ok: false, msg: E.generic };
  }
}
