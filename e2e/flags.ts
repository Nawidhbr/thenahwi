import { existsSync, readFileSync } from "node:fs";

// What this build offers, read from the site's own config and output, so that a test of a part that is still off
// (accounts until the Supabase project exists, the gift window until there is a donate link, a language before its
// translation) is skipped rather than failed (docs/setup-new-site.md).
const site = readFileSync(new URL("../apps/web/src/config/site.ts", import.meta.url), "utf8");
const home = readFileSync(new URL("../apps/web/dist/en/index.html", import.meta.url), "utf8");

export const ACCOUNTS = /export const ACCOUNTS = true/.test(site);
export const SUPPORT = home.includes("data-support-dialog");
export const live = (locale: string) => existsSync(new URL(`../apps/web/dist/${locale}/index.html`, import.meta.url));
