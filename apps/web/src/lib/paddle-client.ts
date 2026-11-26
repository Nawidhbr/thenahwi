// Paddle.js for the checkout (config/pricing.ts, CHECKOUT on): loaded from Paddle's CDN only when a reader is about to
// see a price or pay (the CSP allows cdn.paddle.com and buy.paddle.com). Used by the subscribe window
// (scripts/subscribe.ts) and the pricing page (scripts/checkout.ts).

export type Plan = "monthly" | "yearly";
type LineItem = { price: { id: string }; formattedTotals: { total: string }; totals: { total: string } };
type PaddleJs = {
  Initialize(o: { token: string; eventCallback?: (e: { name?: string }) => void }): void;
  PricePreview(o: { items: { priceId: string; quantity: number }[] }): Promise<{ data: { address?: { countryCode?: string }; details: { lineItems: LineItem[] } } }>;
  Checkout: { open(o: unknown): void };
};

export type PaddleConfig = { token: string; monthly: string; yearly: string; refill?: string; low: string[] };
export type Prices = { monthly?: string; yearly?: string; low: boolean };

const PADDLE_JS = "https://cdn.paddle.com/paddle/v2/paddle.js";
/** The languages Paddle's checkout speaks, of ours; the others get English. */
const PADDLE_LOCALES = ["en", "nl", "ar", "tr", "id", "ru"];

let loading: Promise<PaddleJs> | null = null;
export function paddle(token: string): Promise<PaddleJs> {
  loading ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = PADDLE_JS;
    s.onload = () => {
      const P = (window as unknown as { Paddle?: PaddleJs }).Paddle;
      if (!P) return reject(new Error("Paddle.js did not load"));
      P.Initialize({ token });
      resolve(P);
    };
    s.onerror = () => { loading = null; reject(new Error("Paddle.js could not be loaded")); };
    document.head.append(s);
  });
  return loading;
}

let previewing: Promise<Prices> | null = null;
/** The reader's own prices (Paddle knows the country from the address); the lowest group is offered yearly only. */
export function prices(c: PaddleConfig): Promise<Prices> {
  const items = [c.monthly, c.yearly].filter(Boolean).map((priceId) => ({ priceId, quantity: 1 }));
  previewing ??= paddle(c.token)
    .then((P) => P.PricePreview({ items }))
    .then(({ data }) => {
      const line = (id: string) => data.details.lineItems.find((l) => l.price.id === id);
      return { monthly: line(c.monthly)?.formattedTotals.total, yearly: line(c.yearly)?.formattedTotals.total, low: c.low.includes(data.address?.countryCode || "") };
    })
    .catch((e) => { previewing = null; throw e; });
  return previewing;
}

/** A discount code from a link (?discount=<code>, kept for the session by scripts/head-settings.js), if any. */
const discountCode = () => { try { return sessionStorage.getItem("nahwi-discount") || undefined; } catch { return undefined; } };

/**
 * Paddle's overlay checkout for this plan, carrying the learner's account (api/paddle.js writes the licence). A
 * discount code from a link is filled in; any other Paddle discount code can be typed in Paddle's checkout itself.
 */
export async function checkout(c: PaddleConfig, plan: Plan, user: { id: string; email?: string }, locale: string) {
  const P = await paddle(c.token);
  P.Checkout.open({
    items: [{ priceId: plan === "yearly" ? c.yearly : c.monthly, quantity: 1 }],
    discountCode: discountCode(),
    customer: user.email ? { email: user.email } : undefined,
    customData: { user_id: user.id },
    settings: { displayMode: "overlay", theme: "light", locale: PADDLE_LOCALES.includes(locale) ? locale : "en", allowLogout: false, successUrl: `${location.origin}/${locale}/account/?paid=1` },
  });
}

/**
 * Paddle's overlay checkout for a hearts refill (a one-time price): carries the learner and kind "hearts", which
 * api/paddle.js turns into five hearts on the profile; back to the same page with ?refilled=1.
 */
export async function checkoutRefill(c: PaddleConfig, user: { id: string; email?: string }, locale: string) {
  if (!c.refill) throw new Error("no refill price");
  const P = await paddle(c.token);
  const back = new URL(location.href);
  back.searchParams.set("refilled", "1");
  back.hash = "test";
  P.Checkout.open({
    items: [{ priceId: c.refill, quantity: 1 }],
    customer: user.email ? { email: user.email } : undefined,
    customData: { user_id: user.id, kind: "hearts" },
    settings: { displayMode: "overlay", theme: "light", locale: PADDLE_LOCALES.includes(locale) ? locale : "en", allowLogout: false, successUrl: back.toString() },
  });
}
