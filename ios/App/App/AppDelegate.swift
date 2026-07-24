import UIKit
import NetworkExtension
import WebKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        let window = UIWindow(frame: UIScreen.main.bounds)
        window.rootViewController = WebAppViewController()
        window.makeKeyAndVisible()
        self.window = window

        NETunnelProviderManager.loadAllFromPreferences { managers, error in
            print("Loaded WireGuard tunnel managers: \(managers?.count ?? 0)")
        }
        return true
    }
}

final class WebAppViewController: UIViewController {
    private let webView = WKWebView(frame: .zero)

    override func loadView() {
        view = webView
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        webView.scrollView.contentInsetAdjustmentBehavior = .never

        if let distURL = Bundle.main.url(forResource: "dist", withExtension: nil),
           let indexURL = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "dist") {
            webView.loadFileURL(indexURL, allowingReadAccessTo: distURL)
        } else {
            webView.loadHTMLString("<html><body><h1>Web assets are missing</h1></body></html>", baseURL: nil)
        }
    }
}
