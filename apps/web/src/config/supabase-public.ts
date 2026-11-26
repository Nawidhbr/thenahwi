/**
 * The Supabase project's public address and publishable key (EU, Frankfurt). Both are public by design: row-level
 * security in the database guards every row (supabase/migrations/). Kept in a file of its own, without process.env,
 * so that browser code (lib/supabase-client.ts) can import it; config/site.ts re-exports it as SUPABASE.
 */
export const SUPABASE_PUBLIC = {
  // The Nahwi's own Supabase project is still to be made (docs/setup-new-site.md); these placeholders keep accounts off.
  url: "https://replace-with-the-nahwi-project.supabase.co",
  publishableKey: "sb_publishable_replace_me",
} as const;

/** Where supabase-js keeps the session in localStorage; a page loads the account code only when this key is there. */
export const AUTH_STORAGE_KEY = "nahwi-auth";
