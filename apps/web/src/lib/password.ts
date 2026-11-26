// Signing in with a password (lib/email-signin.ts): what a password must be, and what an answer from Supabase's Auth
// server means for the reader. Kept apart from the browser code so the rules are tested (test/password.test.ts).

/** Supabase checks at least 6; we ask for 8. bcrypt reads at most 72 bytes, and the Auth server refuses longer. */
export const MIN_PASSWORD = 8;
export const MAX_PASSWORD_BYTES = 72;

export function passwordTooWeak(password: string): boolean {
  return password.length < MIN_PASSWORD || new TextEncoder().encode(password).length > MAX_PASSWORD_BYTES;
}

export type PasswordProblem = "wrong" | "unconfirmed" | "weak" | "exists" | "same" | "reauth" | "rate" | "other";

/** What went wrong, from an error of supabase-js (its `code`, or for older servers its message). */
export function passwordProblem(e: unknown): PasswordProblem {
  const err = (e || {}) as { status?: number; code?: string; message?: string };
  const code = err.code || "";
  const msg = err.message || "";
  if (err.status === 429 || /rate_limit/.test(code)) return "rate";
  // The code first: "New password should be different…" (same_password) reads like a weak-password message.
  const byCode: Record<string, PasswordProblem> = {
    invalid_credentials: "wrong", email_not_confirmed: "unconfirmed", weak_password: "weak", user_already_exists: "exists",
    email_exists: "exists", same_password: "same", reauthentication_needed: "reauth", reauthentication_not_valid: "reauth",
  };
  if (byCode[code]) return byCode[code];
  if (/invalid login credentials/i.test(msg)) return "wrong";
  if (/email not confirmed/i.test(msg)) return "unconfirmed";
  if (/should be different/i.test(msg)) return "same";
  if (/password should be|password cannot be longer/i.test(msg)) return "weak";
  if (/already registered/i.test(msg)) return "exists";
  return "other";
}

/**
 * A sign-up for an address that already has a confirmed account: Supabase answers as if it worked (so nobody can find
 * out which addresses have an account) but with no identities and no mail. The reader is told to sign in instead.
 */
export function alreadyRegistered(user: { identities?: unknown[] | null } | null | undefined): boolean {
  return !!user && Array.isArray(user.identities) && user.identities.length === 0;
}
