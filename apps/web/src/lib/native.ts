// The iPhone app's native side, from the page (store/ios). Capacitor puts its bridge on every page of the app before
// any script runs (window.Capacitor); the site calls the native plug-ins through it by name, so it needs no Capacitor
// package of its own and downloads nothing for readers in a browser. Plug-in names and methods are those of the
// versions pinned in store/ios/package.json (test/app-ios.test.ts checks the names against it).

type Listener = { remove: () => Promise<void> | void };
interface Bridge {
  getPlatform(): string;
  nativePromise<T>(plugin: string, method: string, options?: object): Promise<T>;
  addListener(plugin: string, event: string, callback: (data: never) => void): Listener;
  PluginHeaders?: { name: string }[];
}

/** The bridge, only inside the iPhone app. */
export function bridge(): Bridge | null {
  const c = (window as unknown as { Capacitor?: Partial<Bridge> }).Capacitor;
  return c && typeof c.nativePromise === "function" && typeof c.getPlatform === "function" && c.getPlatform() === "ios" ? (c as Bridge) : null;
}

/** Whether a native plug-in is in this build of the app (an older build may lack a newer one). */
export function has(plugin: string): boolean {
  return !!bridge()?.PluginHeaders?.some((h) => h.name === plugin);
}

/** Calls a native method; rejects outside the app or when the plug-in is missing. */
export function call<T = unknown>(plugin: string, method: string, options: object = {}): Promise<T> {
  const b = bridge();
  if (!b || !has(plugin)) return Promise.reject(Object.assign(new Error(`${plugin} is not in this app`), { code: "UNAVAILABLE" }));
  return b.nativePromise<T>(plugin, method, options);
}

/** Listens to a native event (a link that opened the app, a tapped notification, a home-screen shortcut). */
export function on<T>(plugin: string, event: string, callback: (data: T) => void): Listener | null {
  const b = bridge();
  return b && has(plugin) ? b.addListener(plugin, event, callback as (data: never) => void) : null;
}

/** The error code of a rejected native call ("CANCELED", RevenueCat's "1", …). */
export const codeOf = (e: unknown) => String((e as { code?: unknown })?.code ?? "");
