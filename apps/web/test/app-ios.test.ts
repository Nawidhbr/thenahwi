import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { IOS_APP } from "../src/config/app";
import { cancelled, packageOf } from "../src/lib/app-rules.js";
import { closedByReader, codeFromCallback, nonce, startAddress } from "../src/lib/app-signin";
import { SUPABASE_PUBLIC } from "../src/config/supabase-public";
import { APP_SCHEME, SUPABASE_URL, authorizeTarget } from "../../../api/_signin.js";
import { GET as signInStart } from "../../../api/sign-in.js";
import { rgbaOf } from "../src/lib/app-ios";

// The iPhone app (store/ios) and the site's side of it (src/lib/app-*.ts, native.ts).
const root = new URL("../../../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");

describe("the native plug-ins the site calls", () => {
  // Every plug-in name in call("…") and on("…"), and the npm package (pinned in store/ios) that brings it.
  const packages: Record<string, string> = {
    App: "@capacitor/app",
    Haptics: "@capacitor/haptics",
    LocalNotifications: "@capacitor/local-notifications",
    AppShortcuts: "@capawesome/capacitor-app-shortcuts",
    InAppReview: "@capacitor-community/in-app-review",
    SignInWithApple: "@capacitor-community/apple-sign-in",
    Purchases: "@revenuecat/purchases-capacitor",
    StatusBar: "@capacitor/status-bar",
  };
  const deps = JSON.parse(read("store/ios/package.json")).dependencies as Record<string, string>;
  const used = new Set<string>();
  for (const f of ["app-ios.ts", "app-store.ts", "app-signin.ts"]) {
    for (const m of read(`apps/web/src/lib/${f}`).matchAll(/\b(?:call|on|has)(?:<[^>]*>)?\("(\w+)"/g)) used.add(m[1]);
  }
  it("are all in the app", () => {
    expect(used.size).toBeGreaterThan(5);
    for (const name of used) {
      if (name === "WebAuth") continue;
      expect(packages[name], name).toBeDefined();
      expect(deps[packages[name]], packages[name]).toMatch(/^\d+\.\d+\.\d+$/);
    }
  });
  it("include the app's own sign-in window, registered in the app", () => {
    expect(used.has("WebAuth")).toBe(true);
    expect(read("store/ios/ios/App/App/WebAuthPlugin.swift")).toContain('jsName = "WebAuth"');
    expect(read("store/ios/ios/App/App/MainViewController.swift")).toContain("WebAuthPlugin()");
    expect(read("store/ios/ios/App/App/Info.plist")).toContain(`<string>${IOS_APP.callbackScheme}</string>`);
  });
});

describe("the app and the site agree", () => {
  const config = JSON.parse(read("store/ios/capacitor.config.json"));
  it("on the app's id, and on links that open it", () => {
    expect(config.appId).toBe(IOS_APP.bundleId);
    const aasa = JSON.parse(read("apps/web/public/.well-known/apple-app-site-association"));
    const id = `${IOS_APP.teamId}.${IOS_APP.bundleId}`;
    expect(aasa.applinks.details[0].appIDs).toEqual([id]);
    expect(aasa.webcredentials.apps).toEqual([id]);
    expect(read("store/ios/ios/App/App/App.entitlements")).toContain("applinks:thenahwi.com");
  });
  it("on its name, which the system shows (home screen, sign-in window, menu bar on a Mac)", () => {
    const plist = read("store/ios/ios/App/App/Info.plist");
    for (const key of ["CFBundleDisplayName", "CFBundleName"]) expect(plist).toMatch(new RegExp(`<key>${key}</key>\\s*<string>The Nahwi</string>`));
  });
  it("on the team that signs it", () => {
    const teams = [...read("store/ios/ios/App/App.xcodeproj/project.pbxproj").matchAll(/DEVELOPMENT_TEAM = (\w+);/g)].map((m) => m[1]);
    expect(teams).toEqual([IOS_APP.teamId, IOS_APP.teamId]);
  });
  it("on the start page, which the site turns into the reader's language", () => {
    expect(config.server.url).toMatch(/^https:\/\/thenahwi\.com\/en\/study\/\?app=start$/);
    expect(read("apps/web/src/scripts/head-settings.js")).toContain('get("app") === "start"');
    expect(config.server.allowNavigation).toContain("thenahwi.com");
  });
});

describe("signing in from the app", () => {
  it("reads the code Supabase came back with, or its error", () => {
    expect(codeFromCallback("thenahwi://auth?code=abc123")).toEqual({ code: "abc123", error: null });
    expect(codeFromCallback("thenahwi://auth#error=access_denied&error_description=Denied")).toEqual({ code: null, error: "Denied" });
  });
  it("takes a closed window for no error", () => {
    expect(closedByReader({ code: "CANCELED" })).toBe(true);
    expect(closedByReader(new Error("The operation couldn’t be completed. (com.apple.AuthenticationServices.AuthorizationError error 1001.)"))).toBe(true);
    expect(closedByReader({ code: "FAILED", message: "network" })).toBe(false);
  });
  describe("starts Google's window on thenahwi.com, so the window names the site", () => {
    const supabase = `${SUPABASE_PUBLIC.url}/auth/v1/authorize?provider=google&redirect_to=thenahwi%3A%2F%2Fauth&code_challenge=abc&code_challenge_method=s256`;
    it("on the same Supabase project and way back as the app", () => {
      expect(SUPABASE_URL).toBe(SUPABASE_PUBLIC.url);
      expect(APP_SCHEME).toBe(IOS_APP.callbackScheme);
    });
    it("hands the Supabase address to the site's start page", () => {
      const start = new URL(startAddress(supabase, "https://thenahwi.com"));
      expect(start.origin + start.pathname).toBe("https://thenahwi.com/api/sign-in/");
      expect(start.searchParams.get("to")).toBe(supabase);
    });
    it("which sends only Supabase's sign-in for the app on", () => {
      expect(authorizeTarget(supabase)).toBe(new URL(supabase).href);
      expect(authorizeTarget("https://evil.example/auth/v1/authorize?redirect_to=thenahwi%3A%2F%2Fauth")).toBeNull();
      expect(authorizeTarget(`${SUPABASE_PUBLIC.url}/auth/v1/token?redirect_to=thenahwi%3A%2F%2Fauth`)).toBeNull();
      expect(authorizeTarget(`${SUPABASE_PUBLIC.url}/auth/v1/authorize?provider=google&redirect_to=https%3A%2F%2Fevil.example`)).toBeNull();
      expect(authorizeTarget(`https://x@${new URL(SUPABASE_PUBLIC.url).host}/auth/v1/authorize?redirect_to=thenahwi%3A%2F%2Fauth`)).toBeNull();
      expect(authorizeTarget("not a url")).toBeNull();
      expect(authorizeTarget(null)).toBeNull();
    });
    it("with a redirect, or a refusal", () => {
      const ok = signInStart(new Request(startAddress(supabase, "https://thenahwi.com")));
      expect(ok.status).toBe(302);
      expect(ok.headers.get("location")).toBe(new URL(supabase).href);
      const bad = signInStart(new Request("https://thenahwi.com/api/sign-in/?to=https%3A%2F%2Fevil.example%2F"));
      expect(bad.status).toBe(400);
      expect(bad.headers.get("location")).toBeNull();
    });
  });
  it("gives Apple the SHA-256 of the nonce that Supabase checks", async () => {
    const n = await nonce();
    expect(n.raw).toMatch(/^[0-9a-f]{64}$/);
    const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(n.raw)));
    expect(n.hashed).toBe(Array.from(digest, (b) => b.toString(16).padStart(2, "0")).join(""));
  });
});

describe("buying through Apple", () => {
  const offerings = { current: { availablePackages: [
    { identifier: "$rc_monthly", packageType: "MONTHLY", product: { identifier: "com.thenahwi.full.monthly", priceString: "€23,99" } },
    { identifier: "custom", packageType: "ANNUAL", product: { identifier: "com.thenahwi.full.yearly", priceString: "€239,99" } },
  ] } };
  it("finds each plan's package", () => {
    expect(packageOf(offerings, "monthly")?.product.identifier).toBe("com.thenahwi.full.monthly");
    expect(packageOf(offerings, "yearly")?.product.identifier).toBe("com.thenahwi.full.yearly");
    expect(packageOf({ current: { availablePackages: [{ identifier: "$rc_annual", packageType: "CUSTOM", product: { identifier: "y", priceString: "" } }] } }, "yearly")?.identifier).toBe("$rc_annual");
    expect(packageOf({ current: null }, "yearly")).toBeNull();
  });
  it("takes a closed purchase sheet for no error", () => {
    expect(cancelled({ code: "1" })).toBe(true);
    expect(cancelled({ code: "2", data: { userCancelled: true } })).toBe(true);
    expect(cancelled({ code: "2" })).toBe(false);
  });
});

describe("the status bar", () => {
  it("reads the header's computed colour, with or without alpha", () => {
    expect(rgbaOf("rgb(10, 10, 10)")).toEqual([10, 10, 10, 1]);
    expect(rgbaOf("rgba(255, 255, 255, 0.72)")).toEqual([255, 255, 255, 0.72]);
    expect(rgbaOf("rgb(10 10 10 / 0.5)")).toEqual([10, 10, 10, 0.5]);
    expect(rgbaOf("transparent")).toBeNull();
  });
});
