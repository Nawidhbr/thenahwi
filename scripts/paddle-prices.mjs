// Writes the prices of full access into Paddle (Billing API): for each of the two subscription prices (monthly, yearly)
// in apps/web/src/config/pricing.json, the base amount in euro, one override for the UK in pounds and one each for the
// middle and the low countries, a quantity of one, and status active; the retired lifetime price is archived (its
// licences stay); for the hearts refill only the quantity of one.
// Run by GitHub Actions (paddle-prices.yml) with the secret PADDLE_API_KEY (Paddle → Developer tools →
// Authentication, a key that may write prices). Without the key it only prints what it would send.
// Changing a price's amount does not change what an existing subscription pays.
import { readFileSync } from "node:fs";

const cfg = JSON.parse(readFileSync(new URL("../apps/web/src/config/pricing.json", import.meta.url), "utf8"));
const key = process.env.PADDLE_API_KEY;
const api = process.env.PADDLE_API || "https://api.paddle.com";
const cents = (amount) => String(Math.round(amount * 100));
/** The country groups with their own price, each in its own currency (the euro unless it names one). */
const GROUPS = ["uk", "middle", "low"].filter((g) => cfg[g]);

async function patch(id, body) {
  const r = await fetch(`${api}/prices/${id}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { ok: r.ok, status: r.status, body: await r.json().catch(() => ({})) };
}

let failed = false;
for (const period of ["monthly", "yearly"]) {
  const id = cfg.paddle[period];
  if (!id) { console.log(`${period}: no price id yet, skipped`); continue; }
  const unit_price_overrides = GROUPS.map((g) => ({
    country_codes: cfg[g].countries,
    unit_price: { amount: cents(cfg[g][period]), currency_code: cfg[g].currency || cfg.currency },
  }));
  const unit_price = { amount: cents(cfg.base[period]), currency_code: cfg.currency };
  console.log(`${period} ${id}: base ${unit_price.amount} ${unit_price.currency_code}; ${unit_price_overrides.map((o) => `${o.country_codes.length} countries at ${o.unit_price.amount} ${o.unit_price.currency_code}`).join(", ")}`);
  if (!key) continue;
  // One of each: the checkout shows no quantity to change.
  const r = await patch(id, { unit_price, unit_price_overrides, quantity: { minimum: 1, maximum: 1 }, status: "active" });
  if (!r.ok) {
    failed = true;
    console.error(`  failed: ${r.status} ${JSON.stringify(r.body.error ?? r.body).slice(0, 1500)}`);
  } else {
    console.log(`  saved: base ${r.body.data?.unit_price?.amount} ${r.body.data?.unit_price?.currency_code}; ${(r.body.data?.unit_price_overrides ?? []).map((o) => `${o.country_codes.length} at ${o.unit_price.amount} ${o.unit_price.currency_code}`).join(", ")}`);
  }
}
// The lifetime price, sold until 25 November 2026: archived, so no checkout can use it again.
if (cfg.paddle.lifetimeRetired) {
  console.log(`lifetime ${cfg.paddle.lifetimeRetired}: archived`);
  if (key) {
    const r = await patch(cfg.paddle.lifetimeRetired, { status: "archived" });
    if (!r.ok) { failed = true; console.error(`  failed: ${r.status} ${JSON.stringify(r.body.error ?? r.body).slice(0, 1500)}`); }
    else console.log(`  saved: ${r.body.data?.status}`);
  }
}
// The hearts refill (a one-time price whose amount is set in Paddle): bought one at a time.
if (cfg.paddle.refill) {
  console.log(`refill ${cfg.paddle.refill}: quantity 1`);
  if (key) {
    const r = await patch(cfg.paddle.refill, { quantity: { minimum: 1, maximum: 1 } });
    if (!r.ok) { failed = true; console.error(`  failed: ${r.status} ${JSON.stringify(r.body.error ?? r.body).slice(0, 1500)}`); }
    else console.log(`  saved: quantity ${JSON.stringify(r.body.data?.quantity)}`);
  }
}
if (!key) console.log("No PADDLE_API_KEY: nothing sent.");
process.exit(failed ? 1 : 0);
