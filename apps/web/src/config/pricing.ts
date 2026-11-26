/**
 * Access and prices. Three levels: without an account (the encyclopedia and three preview lessons in every
 * book), a free account (also the whole al-Mabādiʾ course, the first reading of the Ottoman path), and full access
 * (every path, level and lesson; a subscription by the month or by the year). Payments run through Paddle, the merchant of record (it sells, charges and pays the
 * VAT of every country); a licence is written to Supabase by api/paddle.js. Prices are in euro (in pounds in the UK),
 * lower outside the West: the amounts and country lists are in pricing.json, which scripts/paddle-prices.mjs writes into
 * Paddle as country overrides (GitHub Actions, paddle-prices.yml, whenever the file changes).
 *
 * Two switches, each off until set to "on" (as an environment variable at build time, or by changing the default):
 * CHECKOUT: the pricing page offers the Paddle checkout (otherwise full access shows "opens soon");
 * PAYWALL: lessons are locked by access (previews / free book / full access); otherwise everything stays open.
 * Turn on CHECKOUT once Paddle has approved the site, PAYWALL when full access is launched.
 */
import pricing from "./pricing.json";

export const CHECKOUT = (process.env.CHECKOUT ?? "off") === "on";
export const PAYWALL = (process.env.PAYWALL ?? "off") === "on";

/** The book a free account opens in full (a book id of the study portal; "mabadi" is the terms of the first reading). */
export const FREE_BOOK = "mabadi";

export const PRICES = {
  currency: pricing.currency,
  /** The West (EU, UK, North America, the Gulf, …): the base price. */
  base: pricing.base,
  /** Less than half (Turkey, Malaysia, South Africa, …). */
  /** The UK, in pounds (the same value as the base price). */
  uk: pricing.uk,
  middle: { monthly: pricing.middle.monthly, yearly: pricing.middle.yearly },
  /** The lowest (India, Pakistan, Indonesia, Egypt, …); offered yearly only on the site, since most of a small monthly payment would go to fees (the monthly price exists in Paddle as a fallback). */
  low: { monthly: null, yearly: pricing.low.yearly },
} as const;

/**
 * Paddle (live): the two prices of the product "Full access" (monthly and yearly subscriptions; the retired lifetime
 * price is kept in pricing.json for the record), the price of a hearts refill (a one-time €1 product;
 * empty until made in Paddle, and then no refill is offered) and the client-side token; all public, the checkout names them.
 */
export const PADDLE = pricing.paddle;

/** Countries with the middle price (ISO codes). */
export const MIDDLE_COUNTRIES: string[] = pricing.middle.countries;

/** Countries with the lowest price. */
export const LOW_COUNTRIES: string[] = pricing.low.countries;
