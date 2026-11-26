// The subscribe window (components/SubscribeDialog.astro): choose a plan at the reader's own country's price, sign in
// if needed (Google, Apple, a mailed 6-digit code or a password, lib/email-signin.ts) and go on to Paddle's checkout,
// all without leaving the page. Loaded on
// first use. After a Google sign-in the page comes back with ?code=…&subscribe=<plan>; supabase-js exchanges the
// code when it loads here, and the window carries on to the payment.
import { supabase } from "../lib/supabase-client";
import { oauthSignIn } from "../lib/app-signin";
import { checkout, checkoutRefill, prices, type PaddleConfig, type Plan } from "../lib/paddle-client";
import { emailSignin } from "../lib/email-signin";
import type { Session } from "@supabase/supabase-js";

type Texts = Record<string, string> & { errors: Record<string, string> };
type AuthError = { status?: number; code?: string };

const fill = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
const report = (e: unknown, where: string) => (window as unknown as { __report?: (e: unknown, w: string) => void }).__report?.(e, where);

/** The header's account tile (head-settings.js sets it before paint on later pages). */
function identity(session: Session) {
  const meta = session.user.user_metadata || {};
  const name = String(meta.full_name || meta.name || session.user.email || "");
  const letter = (name.match(/\p{L}|\p{N}/u)?.[0] || "·").toLocaleUpperCase();
  document.documentElement.dataset.signedIn = "";
  document.documentElement.style.setProperty("--account-initial", JSON.stringify(letter));
  // From now on this page keeps the progress in step with the account, like any page of a signed-in reader.
  import("../lib/account-sync").then((m) => m.start()).catch((e) => report(e, "subscribe sync"));
}

/** A hearts refill from a test: straight to Paddle when signed in, else the account page to sign in first. */
export async function refill() {
  const dialog = document.querySelector<HTMLDialogElement>("[data-sub-dialog]")!;
  const vars = JSON.parse(dialog.dataset.vars || "{}") as { paddle: PaddleConfig };
  const locale = dialog.dataset.locale || "en";
  const { data } = await supabase.auth.getSession();
  if (!data.session) { location.href = `/${locale}/account/`; return; }
  await checkoutRefill(vars.paddle, { id: data.session.user.id, email: data.session.user.email }, locale);
}

let ready: ReturnType<typeof setup> | null = null;

export async function open(plan: Plan) {
  ready ??= setup();
  await (await ready)(plan);
}

async function setup() {
  const dialog = document.querySelector<HTMLDialogElement>("[data-sub-dialog]")!;
  const vars = JSON.parse(dialog.dataset.vars || "{}") as { paddle: PaddleConfig; texts: Texts };
  const T = vars.texts;
  const E = T.errors;
  const locale = dialog.dataset.locale || "en";
  const $ = <K extends HTMLElement = HTMLElement>(sel: string) => dialog.querySelector<K>(sel)!;
  const status = $("[data-sub-status]");
  const planForm = $<HTMLFormElement>('[data-sub-step="plan"]');
  const codeForm = $<HTMLFormElement>("[data-sub-code]");
  const codeInput = codeForm.elements.namedItem("code") as HTMLInputElement;
  let plan: Plan = "yearly";
  let email = "";

  const say = (msg = "", kind: "error" | "ok" = "error") => { status.textContent = msg; status.dataset.kind = kind; status.hidden = !msg; };
  const step = (name: string) => {
    for (const el of dialog.querySelectorAll<HTMLElement>("[data-sub-step]")) el.hidden = el.dataset.subStep !== name;
    const first = dialog.querySelector<HTMLElement>(`[data-sub-step="${name}"] input:not([type=radio]), [data-sub-step="${name}"] button.account-primary, [data-sub-step="${name}"] button.account-google`);
    first?.focus();
  };
  const busy = (b: HTMLButtonElement, on: boolean, label: string) => { b.disabled = on; b.textContent = label; };
  const explain = (e: unknown, where: "send" | "verify" | "other") => {
    const err = (e || {}) as AuthError;
    if (!navigator.onLine) return T.offline;
    if (err.status === 429 || /rate_limit/.test(err.code || "")) return E.rate;
    if (where === "verify" && (err.status === 403 || err.code === "otp_expired")) return E.invalidCode;
    if (where === "send" && (err.code === "email_address_invalid" || err.code === "validation_failed")) return E.invalidEmail;
    report(e, `subscribe ${where}`);
    return E.generic;
  };
  const back = (p: Plan) => `${location.origin}${location.pathname}?subscribe=${p}`;

  // The reader's own prices, once Paddle.js is there; the lowest group is offered yearly only.
  prices(vars.paddle)
    .then((p) => {
      if (p.yearly) $("[data-sub-price=yearly]").textContent = p.yearly;
      if (p.monthly) $("[data-sub-price=monthly]").textContent = p.monthly;
      if (p.yearly) $("[data-sub-local]").textContent = T.localNote;
      if (p.low) {
        $('[data-sub-plan="monthly"]').hidden = true;
        (planForm.elements.namedItem("plan") as RadioNodeList).value = "yearly";
      }
    })
    .catch((e) => report(e, "subscribe prices"));

  const pay = async (session: Session) => {
    say(T.opening);
    try {
      dialog.close(); // Paddle's overlay sits under the top layer, so the window makes way for it.
      await checkout(vars.paddle, plan, { id: session.user.id, email: session.user.email }, locale);
      say("");
    } catch (e) {
      dialog.showModal();
      say(T.error);
      report(e, "subscribe checkout");
    }
  };
  const signedIn = (session: Session, auto: boolean) => {
    identity(session);
    $("[data-sub-who]").textContent = fill(T.signedInAs, { email: session.user.email || "" });
    step("pay");
    if (auto) pay(session);
  };

  planForm.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    plan = ((planForm.elements.namedItem("plan") as RadioNodeList).value as Plan) || "yearly";
    say();
    const { data } = await supabase.auth.getSession();
    if (data.session) signedIn(data.session, true);
    else step("signin");
  });

  // Google, and Apple when APPLE_SIGN_IN puts its button in the window: both come back with ?code=…&subscribe=<plan>.
  for (const provider of ["google", "apple"] as const) {
    dialog.querySelector(`[data-sub-${provider}]`)?.addEventListener("click", async () => {
      say();
      const error = await oauthSignIn(supabase, provider, back(plan));
      if (error) say(explain(error, "other"));
    });
  }

  // The email form: a mailed code, or a password (signing in, or a new account confirmed by a mailed code).
  const askCode = (address: string) => {
    email = address;
    $("[data-sub-sent]").textContent = fill(T.sent, { email: address });
    step("code");
  };
  emailSignin($('[data-sub-step="signin"]'), {
    texts: { send: T.send, sending: T.sending, signIn: T.signIn, signingIn: T.signingIn, create: T.create, creating: T.creating, forgotNote: T.forgotNote, unconfirmed: T.unconfirmed, offline: T.offline, errors: E },
    redirect: () => back(plan),
    say,
    sendCode: async (address) => {
      const { error } = await supabase.auth.signInWithOtp({ email: address, options: { emailRedirectTo: back(plan), shouldCreateUser: true } });
      if (error) throw error;
      askCode(address);
    },
    mailed: askCode,
    signedIn: (session) => signedIn(session, true),
    explainSend: (e) => explain(e, "send"),
    report,
  });

  codeForm.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    say();
    const token = codeInput.value.replace(/\D/g, "");
    if (token.length < 6) { say(E.invalidCode); codeInput.focus(); return; }
    const btn = $<HTMLButtonElement>("[data-sub-verify]");
    busy(btn, true, T.verifying);
    try {
      const { data, error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
      if (error) throw error;
      if (data.session) signedIn(data.session, true);
    } catch (e) { say(explain(e, "verify")); }
    finally { busy(btn, false, T.verify); }
  });

  $("[data-sub-other]").addEventListener("click", () => { say(); step("signin"); });
  $("[data-sub-back]").addEventListener("click", () => { say(); step("plan"); });
  $("[data-sub-pay]").addEventListener("click", async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) pay(data.session);
    else step("signin");
  });
  $("[data-sub-close]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });

  // Back from a Google sign-in or a mailed link (?code=…&subscribe=<plan>): supabase-js exchanges the code on load.
  const arrived = new URL(location.href);
  let returning = arrived.searchParams.has("subscribe");
  const init = await supabase.auth.initialize();
  if (returning) {
    arrived.searchParams.delete("subscribe");
    arrived.searchParams.delete("code");
    history.replaceState(null, "", arrived.pathname + (arrived.search === "?" ? "" : arrived.search) + arrived.hash);
  }

  return async (wanted: Plan) => {
    plan = wanted;
    (planForm.elements.namedItem("plan") as RadioNodeList).value = wanted;
    say();
    if (!dialog.open) dialog.showModal();
    const { data } = await supabase.auth.getSession();
    const back = returning;
    returning = false;
    if (back && data.session) { signedIn(data.session, true); return; }
    if (back && init.error) say(E.link);
    step("plan");
  };
}
