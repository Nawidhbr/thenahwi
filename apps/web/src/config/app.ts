/**
 * The iPhone app (store/ios: a Capacitor app that opens this site, store/ios/README.md). Everything
 * here is public: the ids are in every build of the app, and RevenueCat's Apple SDK key is meant for apps.
 */
export const IOS_APP = {
  bundleId: "com.thenahwi.app",
  /** The Apple Developer team (Certificates, IDs & Profiles), for the apple-app-site-association file. */
  teamId: "75M6B2GXZ2",
  /** Supabase sends the reader back to thenahwi://auth after Google (store/ios/ios/App/App/WebAuthPlugin.swift). */
  callbackScheme: "thenahwi",
  /**
   * RevenueCat's public Apple SDK key (appl_…), from RevenueCat → Project → API keys. Empty until RevenueCat and the
   * App Store products are set up; until then the app sells nothing and hides every subscribe button (lib/app-ios.ts).
   * REVENUECAT_IOS_KEY at build time sets it too (config/app-store.ts, which pages read; browser code never needs it).
   */
  revenueCatKey: "",
  /** The entitlement in RevenueCat that both subscriptions (monthly and yearly) unlock: full access. */
  entitlement: "full",
  /** The app's id in the App Store (the number in its apps.apple.com address), once it is there. */
  appStoreId: "",
};
