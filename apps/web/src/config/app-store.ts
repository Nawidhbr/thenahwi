/**
 * Buying through Apple in the iPhone app is on once RevenueCat's public key is set: in config/app.ts, or at build
 * time as REVENUECAT_IOS_KEY (npm run check:payments sets a test key, to walk the App Store window). Read at build
 * time only (pages and components), never by browser code: the window carries the key in its data-vars.
 */
import { IOS_APP } from "./app";

export const APP_STORE_KEY = (process.env.REVENUECAT_IOS_KEY || IOS_APP.revenueCatKey || "").trim();
