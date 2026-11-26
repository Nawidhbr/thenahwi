// Buying full access in the iPhone app (components/AppStoreDialog.astro), through Apple's in-app purchase and
// RevenueCat (store/ios). The reader signs in first, so the purchase is linked to the account: RevenueCat knows the
// reader by the account's id, and its webhook (api/revenuecat.js) writes the same licence as a Paddle payment, which
// then opens everything on the website and the other devices too. Loaded on first use, by lib/app-ios.ts.
import { supabase } from "./supabase-client";
import { oauthSignIn, type Provider } from "./app-signin";
import { IOS_APP } from "../config/app";
import { call } from "./native";
import { cancelled, packageOf } from "./app-rules.js";

type Plan = "yearly" | "monthly";
type Texts = Record<string, string> & { errors: Record<string, string> };
type Offerings = { current?: { availablePackages?: { identifier: string; packageType: string; product: { identifier: string; priceString: string } }[] } | null };
type CustomerInfo = { entitlements?: { active?: Record<string, unknown> } };

const report = (e: unknown, where: string) => (window as unknown as { __report?: (e: unknown, w: string) => void }).__report?.(e, where);

/** RevenueCat, set up once per app start and told who the reader is (the account's id). */
async function identify(apiKey: string, userId: string) {
  const { isConfigured } = await call<{ isConfigured: boolean }>("Purchases", "isConfigured");
  if (!isConfigured) {
    await call("Purchases", "configure", { apiKey, appUserID: userId });
    return;
  }
  const { appUserID } = await call<{ appUserID: string }>("Purchases", "getAppUserID");
  if (appUserID !== userId) await call("Purchases", "logIn", { appUserID: userId });
}

let ready: ReturnType<typeof setup> | null = null;

export async function open(plan: Plan) {
  ready ??= setup();
  await (await ready)(plan);
}

async function setup() {
  const dialog = document.querySelector<HTMLDialogElement>("[data-store-dialog]")!;
  const V = JSON.parse(dialog.dataset.vars || "{}") as { key: string; texts: Texts };
  const T = V.texts;
  const locale = dialog.dataset.locale || "en";
  const $ = <K extends HTMLElement = HTMLElement>(sel: string) => dialog.querySelector<K>(sel)!;
  const status = $("[data-store-status]");
  const form = $<HTMLFormElement>('[data-store-step="plan"]');
  const buy = $<HTMLButtonElement>("[data-store-buy]");
  const restore = $<HTMLButtonElement>("[data-store-restore]");
  let offerings: Offerings | null = null;

  const say = (msg = "", kind: "error" | "ok" = "error") => { status.textContent = msg; status.dataset.kind = kind; status.hidden = !msg; };
  const step = (name: "plan" | "signin") => {
    for (const el of dialog.querySelectorAll<HTMLElement>("[data-store-step]")) el.hidden = el.dataset.storeStep !== name;
  };
  const chosen = (): Plan => ((form.elements.namedItem("plan") as RadioNodeList).value === "monthly" ? "monthly" : "yearly");
  const busy = (on: boolean) => { buy.disabled = on; restore.disabled = on; };
  // Done: the account page thanks and waits for the licence, as after a payment on the website.
  const done = () => { say(T.thanks, "ok"); setTimeout(() => location.assign(`/${locale}/account/?paid=1`), 800); };

  $("[data-store-close]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });

  for (const b of dialog.querySelectorAll<HTMLButtonElement>("[data-store-signin]")) {
    b.addEventListener("click", async () => {
      say();
      const back = `${location.origin}${location.pathname}?subscribe=${chosen()}`;
      const error = await oauthSignIn(supabase, b.dataset.storeSignin as Provider, back);
      if (error) { report(error, "app store sign-in"); say(T.errors.generic); }
    });
  }

  const loadPrices = async (userId: string) => {
    say(T.loading, "ok");
    try {
      await identify(V.key, userId);
      offerings = await call<Offerings>("Purchases", "getOfferings");
      for (const plan of ["yearly", "monthly"] as const) {
        const p = packageOf(offerings, plan);
        $(`[data-store-price="${plan}"]`).textContent = p?.product.priceString || "—";
        $<HTMLInputElement>(`input[value="${plan}"]`).disabled = !p;
      }
      say(packageOf(offerings, "yearly") || packageOf(offerings, "monthly") ? "" : T.unavailable);
    } catch (e) {
      report(e, "app store prices");
      say(navigator.onLine ? T.unavailable : T.offline);
    }
  };

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const p = packageOf(offerings, chosen());
    if (!p) { say(T.unavailable); return; }
    busy(true);
    say(T.buying, "ok");
    try {
      await call("Purchases", "purchasePackage", { aPackage: p });
      done();
    } catch (e) {
      if (cancelled(e)) say();
      else { report(e, "app store purchase"); say(T.error); }
    } finally { busy(false); }
  });

  restore.addEventListener("click", async () => {
    busy(true);
    say(T.restoring, "ok");
    try {
      const { customerInfo } = await call<{ customerInfo: CustomerInfo }>("Purchases", "restorePurchases");
      if (customerInfo?.entitlements?.active?.[IOS_APP.entitlement]) done();
      else say(T.nothing);
    } catch (e) {
      report(e, "app store restore");
      say(T.error);
    } finally { busy(false); }
  });

  return async (plan: Plan) => {
    say();
    (form.elements.namedItem("plan") as RadioNodeList).value = plan;
    if (!dialog.open) dialog.showModal();
    const { data } = await supabase.auth.getSession();
    if (!data.session) { step("signin"); return; }
    step("plan");
    if (!offerings) await loadPrices(data.session.user.id);
  };
}
