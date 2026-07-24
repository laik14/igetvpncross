import NetworkExtension
import WireGuardKit

class PacketTunnelProvider: NEPacketTunnelProvider {

    private var adapter: WireGuardAdapter?

    override func startTunnel(options: [String : NSObject]?, completionHandler: @escaping (Error?) -> Void) {
        let wgConfig = """
        [Interface]
        PrivateKey = c2VydmVyX25pZF9ubF85MS4xODYuMjIwLjEwNw==
        Address = 10.8.0.2/32
        DNS = 1.1.1.1

        [Peer]
        PublicKey = c2VydmVyX25pZF9ubF85MS4xODYuMjIwLjEwNw==
        Endpoint = 91.186.220.107:51820
        AllowedIPs = 0.0.0.0/0
        """

        let tunnelSettings = NEPacketTunnelNetworkSettings(tunnelRemoteAddress: "91.186.220.107")
        tunnelSettings.ipv4Settings = NEIPv4Settings(addresses: ["10.8.0.2"], subnetMasks: ["255.255.255.255"])
        tunnelSettings.ipv4Settings?.includedRoutes = [NEIPv4Route.default()]
        tunnelSettings.dnsSettings = NEDNSSettings(servers: ["1.1.1.1"])

        setTunnelNetworkSettings(tunnelSettings) { error in
            if let error = error {
                completionHandler(error)
            } else {
                completionHandler(nil)
            }
        }
    }

    override func stopTunnel(with reason: NEProviderStopReason, completionHandler: @escaping () -> Void) {
        completionHandler()
    }
}
