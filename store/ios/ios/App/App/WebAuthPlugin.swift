import AuthenticationServices
import Capacitor
import UIKit

/// Signing in with Google from the app (apps/web/src/lib/native.ts): Google refuses its sign-in inside a web view, so
/// the site opens it in the system's sign-in window (ASWebAuthenticationSession), which shares Safari's sign-ins and
/// hands back the address Supabase returns to (thenahwi://auth?code=…). The page then exchanges that code itself.
///
/// From the page: Capacitor.nativePromise("WebAuth", "start", { url, callbackScheme }) → { url }.
/// Rejects with code "CANCELED" when the reader closes the window.
@objc(WebAuthPlugin)
public class WebAuthPlugin: CAPPlugin, CAPBridgedPlugin, ASWebAuthenticationPresentationContextProviding {
    public let identifier = "WebAuthPlugin"
    public let jsName = "WebAuth"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "start", returnType: CAPPluginReturnPromise)
    ]

    /// Kept while the window is open: the session ends when nothing holds it.
    private var session: ASWebAuthenticationSession?

    @objc func start(_ call: CAPPluginCall) {
        guard let address = call.getString("url"), let url = URL(string: address),
              url.scheme == "https",
              let scheme = call.getString("callbackScheme"), !scheme.isEmpty else {
            call.reject("An https url and a callbackScheme are needed", "INVALID")
            return
        }
        DispatchQueue.main.async {
            let session = ASWebAuthenticationSession(url: url, callbackURLScheme: scheme) { [weak self] callbackURL, error in
                self?.session = nil
                if let callbackURL = callbackURL {
                    call.resolve(["url": callbackURL.absoluteString])
                } else if let error = error as? ASWebAuthenticationSessionError, error.code == .canceledLogin {
                    call.reject("The sign-in window was closed", "CANCELED")
                } else {
                    call.reject(error?.localizedDescription ?? "The sign-in failed", "FAILED")
                }
            }
            session.presentationContextProvider = self
            // Share Safari's sign-ins, so a reader already signed in to Google need not type a password again.
            session.prefersEphemeralWebBrowserSession = false
            self.session = session
            if !session.start() {
                self.session = nil
                call.reject("The sign-in window could not open", "FAILED")
            }
        }
    }

    public func presentationAnchor(for session: ASWebAuthenticationSession) -> ASPresentationAnchor {
        return bridge?.webView?.window ?? ASPresentationAnchor()
    }
}
