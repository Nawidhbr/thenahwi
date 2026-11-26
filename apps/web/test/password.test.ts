import { describe, expect, it } from "vitest";
import { alreadyRegistered, passwordProblem, passwordTooWeak } from "../src/lib/password";

// Signing in with a password (lib/email-signin.ts): what a password must be, and how Supabase's answers are read.
describe("a password", () => {
  it("has 8 to 72 bytes", () => {
    expect(passwordTooWeak("short")).toBe(true);
    expect(passwordTooWeak("1234567")).toBe(true);
    expect(passwordTooWeak("12345678")).toBe(false);
    expect(passwordTooWeak("a".repeat(72))).toBe(false);
    expect(passwordTooWeak("a".repeat(73))).toBe(true);
    // Counted in bytes, as the Auth server does: 37 Arabic letters are 74 bytes.
    expect(passwordTooWeak("ب".repeat(36))).toBe(false);
    expect(passwordTooWeak("ب".repeat(37))).toBe(true);
  });
});

describe("an answer from the Auth server", () => {
  it("is read by its code", () => {
    expect(passwordProblem({ status: 400, code: "invalid_credentials" })).toBe("wrong");
    expect(passwordProblem({ status: 400, code: "email_not_confirmed" })).toBe("unconfirmed");
    expect(passwordProblem({ status: 422, code: "weak_password" })).toBe("weak");
    expect(passwordProblem({ status: 422, code: "user_already_exists" })).toBe("exists");
    expect(passwordProblem({ status: 422, code: "same_password" })).toBe("same");
    expect(passwordProblem({ status: 401, code: "reauthentication_needed" })).toBe("reauth");
    expect(passwordProblem({ status: 429, code: "over_request_rate_limit" })).toBe("rate");
    expect(passwordProblem({ status: 500, code: "unexpected_failure" })).toBe("other");
    expect(passwordProblem(null)).toBe("other");
  });
  it("is read by its message from an older server", () => {
    expect(passwordProblem({ status: 400, message: "Invalid login credentials" })).toBe("wrong");
    expect(passwordProblem({ status: 400, message: "Email not confirmed" })).toBe("unconfirmed");
    expect(passwordProblem({ status: 422, message: "Password should be at least 6 characters." })).toBe("weak");
    expect(passwordProblem({ status: 422, message: "New password should be different from the old password." })).toBe("same");
    expect(passwordProblem({ status: 422, code: "same_password", message: "New password should be different from the old password." })).toBe("same");
  });
  it("tells a sign-up for an address with an account apart from a new one", () => {
    expect(alreadyRegistered({ identities: [] })).toBe(true);
    expect(alreadyRegistered({ identities: [{ provider: "email" }] })).toBe(false);
    expect(alreadyRegistered({})).toBe(false);
    expect(alreadyRegistered(null)).toBe(false);
  });
});
