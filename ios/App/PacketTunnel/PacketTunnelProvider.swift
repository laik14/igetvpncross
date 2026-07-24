import NetworkExtension

class PacketTunnelProvider: NEPacketTunnelProvider {

    override func startTunnel(options: [String : NSObject]?, completionHandler: @escaping (Error?) -> Void) {
        let wgConfig = options?["wireGuardConfig"] as? String ?? ""

        let tunnelSettings = NEPacketTunnelNetworkSettings(tunnelRemoteAddress: "127.0.0.1")
        tunnelSettings.ipv4Settings = NEIPv4Settings(addresses: ["10.8.0.2"], subnetMasks: ["255.255.255.255"])
        tunnelSettings.ipv4Settings?.includedRoutes = [NEIPv4Route.default()]
        tunnelSettings.dnsSettings = NEDNSSettings(servers: ["1.1.1.1"])

        setTunnelNetworkSettings(tunnelSettings) { error in
            if let error = error {
                completionHandler(error)
            } else {
                // TODO: Connect these settings to the real WireGuard backend before production release.
                _ = wgConfig
                completionHandler(nil)
            }
        }
    }

    override func stopTunnel(with reason: NEProviderStopReason, completionHandler: @escaping () -> Void) {
        completionHandler()
    }
}
