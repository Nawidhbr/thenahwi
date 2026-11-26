// The browser's Supabase client, for accounts and progress on every device. Loaded only on the account page and,
// through lib/account-sync.ts, on pages of a reader who is signed in, so other readers never download it.
import { createClient } from "@supabase/supabase-js";
import { AUTH_STORAGE_KEY, SUPABASE_PUBLIC } from "../config/supabase-public";

export const supabase = createClient(SUPABASE_PUBLIC.url, SUPABASE_PUBLIC.publishableKey, {
  auth: {
    // PKCE: a link or a Google sign-in comes back with ?code=, which only this browser can exchange for a session.
    flowType: "pkce",
    storageKey: AUTH_STORAGE_KEY,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
