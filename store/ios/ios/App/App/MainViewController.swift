import UIKit
import Capacitor

/// The app's one screen: Capacitor's web view showing thenahwi.com (capacitor.config.json), with the app's own
/// plug-ins registered next to the ones from npm (those are found by themselves).
class MainViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(WebAuthPlugin())
    }
}
