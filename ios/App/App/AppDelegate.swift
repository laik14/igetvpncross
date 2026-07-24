import UIKit
import NetworkExtension

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        NETunnelProviderManager.loadAllFromPreferences { managers, error in
            print("Loaded WireGuard tunnel managers: \(managers?.count ?? 0)")
        }
        return true
    }
}
