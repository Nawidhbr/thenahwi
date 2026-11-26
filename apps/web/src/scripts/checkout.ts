// The pricing page with CHECKOUT on (config/pricing.ts): shows the reader's own country's prices in the full-access
// column (Paddle.js, lib/paddle-client.ts); its buttons carry data-subscribe and open the subscribe window
// (components/SubscribeDialog.astro), which signs in and pays.
import { prices, type PaddleConfig } from "../lib/paddle-client";

const report = (e: unknown, where: string) => (window as unknown as { __report?: (e: unknown, w: string) => void }).__report?.(e, where);

export function start() {
  const box = document.querySelector<HTMLElement>("[data-checkout]");
  if (!box) return;
  const c = JSON.parse(box.dataset.vars || "{}") as PaddleConfig & { perYear: string };
  prices(c)
    .then((p) => {
      if (p.low) box.dataset.low = "";
      const num = document.querySelector<HTMLElement>('[data-price="monthly"]');
      const unit = num?.nextElementSibling as HTMLElement | null;
      const line = document.querySelector<HTMLElement>("[data-price-line]");
      // The lowest group is offered yearly only: the yearly price takes the big line.
      if (p.low && p.yearly && num && line) { num.textContent = p.yearly; if (unit) unit.textContent = c.perYear; line.textContent = ""; }
      else {
        if (p.monthly && num) num.textContent = p.monthly;
        if (p.yearly && line) line.textContent = (line.dataset.priceLine || "").replace("{price}", p.yearly);
      }
    })
    .catch((e) => report(e, "pricing prices"));
}
