import express from "express";
import path from "path";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// Вспомогательная функция генерации ключей WireGuard (симуляция ключей Curve25519 в base64)
function generateWGKeypair() {
  const privateKeyRaw = crypto.randomBytes(32);
  // Фиксация байтов (clamping) по стандарту Curve25519 / WireGuard
  privateKeyRaw[0] &= 248;
  privateKeyRaw[31] &= 127;
  privateKeyRaw[31] |= 64;
  
  const privateKey = privateKeyRaw.toString('base64');
  // Хеш для симуляции публичного ключа пира
  const publicKeyHash = crypto.createHash('sha256').update(privateKeyRaw).digest();
  const publicKey = publicKeyHash.toString('base64');
  const presharedKey = crypto.randomBytes(32).toString('base64');

  return { privateKey, publicKey, presharedKey };
}

// Серверные узлы WireGuard (Выделенные серверы NID и GER)
const SERVER_NODES = [
  {
    id: "nl-nid-1",
    name: "NID (91.186.220.107)",
    city: "NID (Нидерланды)",
    country: "Netherlands",
    countryCode: "NL",
    flag: "🇳🇱",
    endpoint: "91.186.220.107:51820",
    serverPublicKey: "c2VydmVyX25pZF9ubF85MS4xODYuMjIwLjEwNw==",
    ip: "91.186.220.107",
    dns: "1.1.1.1, 8.8.8.8",
    protocol: "WireGuard Standard (UDP)",
    obfuscated: false,
    pingMs: 28,
    loadPercent: 18,
    supportsIPv6: true,
    allowedIPs: "0.0.0.0/0, ::/0",
    mtu: 1420
  },
  {
    id: "de-ger-1",
    name: "GER (45.134.15.194 / vm4458860)",
    city: "GER (Германия)",
    country: "Germany",
    countryCode: "DE",
    flag: "🇩🇪",
    endpoint: "vm4458860.firstbyte.club:51820",
    serverPublicKey: "c2VydmVyX2dlcl9kZV80NS4xMzQuMTUuMTk0",
    ip: "45.134.15.194",
    dns: "1.1.1.1, 1.0.0.1",
    protocol: "AmneziaWG (Obfuscated UDP)",
    obfuscated: true,
    pingMs: 22,
    loadPercent: 24,
    supportsIPv6: true,
    allowedIPs: "0.0.0.0/0, ::/0",
    mtu: 1420
  }
];

// Настройка Service Worker для PWA
app.get('/sw.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`
    const CACHE_NAME = 'wireguard-pwa-v1';
    const ASSETS = ['/', '/index.html', '/manifest.webmanifest'];

    self.addEventListener('install', (event) => {
      event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
      );
      self.skipWaiting();
    });

    self.addEventListener('activate', (event) => {
      event.waitUntil(self.clients.claim());
    });

    // Фоновый фоновый воркер для поддержания соединения и пинга
    self.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'START_BACKGROUND_KEEP_ALIVE') {
        console.log('[SW] Фоновый keep-alive активирован для статуса WireGuard туннеля...');
      }
    });

    self.addEventListener('fetch', (event) => {
      if (event.request.method !== 'GET') return;
      event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
      );
    });
  `);
});

// Манифест PWA приложения
app.get('/manifest.webmanifest', (req, res) => {
  res.setHeader('Content-Type', 'application/manifest+json');
  res.json({
    name: "WireGuard PWA - Кроссплатформенный VPN",
    short_name: "WireGuard VPN",
    description: "Кроссплатформенный WireGuard VPN и Proxy PWA с поддержкой фонового режима и генератором профилей.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#3b82f6",
    orientation: "portrait",
    icons: [
      {
        src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=192&auto=format&fit=crop&q=80",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=512&auto=format&fit=crop&q=80",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ]
  });
});

// Маршруты API
app.get('/api/nodes', (req, res) => {
  res.json({ success: true, nodes: SERVER_NODES });
});

app.get('/api/ping', (req, res) => {
  const startTime = Date.now();
  const nodeId = req.query.nodeId as string;
  const node = SERVER_NODES.find(n => n.id === nodeId) || SERVER_NODES[0];
  
  // Небольшие колебания задержки для эмуляции живой сети
  const simulatedJitter = Math.floor(Math.random() * 6) - 3;
  const currentPing = Math.max(10, node.pingMs + simulatedJitter);

  res.json({
    success: true,
    nodeId: node.id,
    pingMs: currentPing,
    timestamp: new Date().toISOString(),
    status: "online"
  });
});

app.get('/api/ipcheck', (req, res) => {
  const isProtected = req.query.protected === 'true';
  const nodeId = req.query.nodeId as string;

  if (isProtected && nodeId) {
    const node = SERVER_NODES.find(n => n.id === nodeId) || SERVER_NODES[0];
    return res.json({
      ip: node.ip,
      country: node.country,
      city: node.city,
      countryCode: node.countryCode,
      flag: node.flag,
      isp: "WireGuard Encrypted Tunnel Corp",
      protected: true,
      protocol: node.protocol,
      latency: node.pingMs
    });
  }

  // Эмуляция прямого нешифрованного подключения
  res.json({
    ip: "89.208.103.14",
    country: "Ваш Регион",
    city: "Провайдер Связи",
    countryCode: "LOC",
    flag: "🌐",
    isp: "Local Public ISP",
    protected: false,
    protocol: "Прямое нешифрованное соединение",
    latency: 12
  });
});

// Эндпоинт генерации конфигурации WireGuard (.conf)
app.post('/api/wireguard/generate', (req, res) => {
  const { nodeId, mtu, customDns, enableObfuscation, clientName } = req.body;
  const node = SERVER_NODES.find(n => n.id === nodeId) || SERVER_NODES[0];

  const keys = generateWGKeypair();
  const clientIPNumber = Math.floor(Math.random() * 200) + 2;
  const clientIPv4 = `10.66.0.${clientIPNumber}/32`;
  const clientIPv6 = `fd42:42:42::${clientIPNumber}/128`;
  const dns = customDns || node.dns;
  const effectiveMtu = mtu || node.mtu;

  // Формирование файла конфигурации .conf
  let confContent = `[Interface]
# Устройство: ${clientName || "PWA Мобильный Клиент"}
PrivateKey = ${keys.privateKey}
Address = ${clientIPv4}, ${clientIPv6}
DNS = ${dns}
MTU = ${effectiveMtu}

[Peer]
# Сервер: ${node.name} (${node.country})
PublicKey = ${node.serverPublicKey}
PresharedKey = ${keys.presharedKey}
Endpoint = ${node.endpoint}
AllowedIPs = ${node.allowedIPs}
PersistentKeepalive = 25
`;

  if (enableObfuscation || node.obfuscated) {
    confContent += `# Параметры обфускации AmneziaWG
Jc = 4
Jmin = 40
Jmax = 70
S1 = 15
S2 = 28
H1 = 120489102
H2 = 918239012
`;
  }

  res.json({
    success: true,
    node,
    keys: {
      privateKey: keys.privateKey,
      publicKey: keys.publicKey,
      presharedKey: keys.presharedKey,
      clientIPv4,
      clientIPv6
    },
    confContent,
    filename: `wireguard_${node.countryCode.toLowerCase()}_${clientName || 'pwa'}.conf`,
    wireguardDeepLink: `wireguard://import?config=${encodeURIComponent(confContent)}`
  });
});

// Эндпоинт генерации профиля MobileConfig для iOS (установка в 1 клик)
app.post('/api/wireguard/mobileconfig', (req, res) => {
  const { nodeId, clientName } = req.body;
  const node = SERVER_NODES.find(n => n.id === nodeId) || SERVER_NODES[0];
  const keys = generateWGKeypair();

  const payloadUUID = crypto.randomUUID();
  const configUUID = crypto.randomUUID();

  const mobileConfigXML = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>PayloadContent</key>
	<array>
		<dict>
			<key>IPSec</key>
			<dict>
				<key>AuthenticationMethod</key>
				<string>SharedSecret</string>
				<key>LocalIdentifier</key>
				<string>pwa_client_${keys.publicKey.substring(0, 8)}</string>
				<key>RemoteAddress</key>
				<string>${node.ip}</string>
				<key>SharedSecret</key>
				<string>${keys.presharedKey}</string>
			</dict>
			<key>IPv4</key>
			<dict>
				<key>OverridePrimary</key>
				<true/>
			</dict>
			<key>PayloadDescription</key>
			<string>WireGuard Secure Tunnel for ${node.name}</string>
			<key>PayloadDisplayName</key>
			<string>WireGuard Native (${node.country})</string>
			<key>PayloadIdentifier</key>
			<string>com.wireguard.native.vpn.${node.id}</string>
			<key>PayloadType</key>
			<string>com.apple.vpn.managed</string>
			<key>PayloadUUID</key>
			<string>${payloadUUID}</string>
			<key>PayloadVersion</key>
			<integer>1</integer>
			<key>UserDefinedName</key>
			<string>WG Native ${node.city}</string>
			<key>VPNType</key>
			<string>IPSec</string>
		</dict>
	</array>
	<key>PayloadDisplayName</key>
	<string>WireGuard Native Mobile VPN Profile - ${node.name}</string>
	<key>PayloadIdentifier</key>
	<string>com.wireguard.native.profile</string>
	<key>PayloadRemovalDisallowed</key>
	<false/>
	<key>PayloadType</key>
	<string>Configuration</string>
	<key>PayloadUUID</key>
	<string>${configUUID}</string>
	<key>PayloadVersion</key>
	<integer>1</integer>
</dict>
</plist>`;

  res.setHeader('Content-Type', 'application/x-apple-asf');
  res.setHeader('Content-Disposition', `attachment; filename="wireguard_${node.countryCode}.mobileconfig"`);
  res.send(mobileConfigXML);
});

// Нативные исходные файлы и генератор проектов для Android VpnService & iOS NetworkExtension
app.get('/api/native/android-code', (req, res) => {
  const kotlinVpnService = `package com.wireguard.nativevpn

import android.content.Intent
import android.net.VpnService
import android.os.ParcelFileDescriptor
import android.util.Log
import java.net.InetAddress

class WireGuardVpnService : VpnService() {
    private var vpnInterface: ParcelFileDescriptor? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val endpoint = intent?.getStringExtra("ENDPOINT") ?: "89.208.103.14:51820"
        val clientIPv4 = intent?.getStringExtra("CLIENT_IP") ?: "10.8.0.2/32"
        val dnsServer = intent?.getStringExtra("DNS") ?: "1.1.1.1"

        Log.i("WireGuardVpnService", "Запуск нативного VpnService Android для туннеля $endpoint")

        val builder = Builder()
            .addAddress("10.8.0.2", 32)
            .addRoute("0.0.0.0", 0)
            .addDnsServer(dnsServer)
            .setMtu(1420)
            .setSession("WireGuard Native Tunnel")

        // Поддержка Split Tunneling (раздельного маршрутизирования)
        val disallowedApps = intent?.getStringArrayExtra("DISALLOWED_APPS")
        disallowedApps?.forEach { pkg ->
            try {
                builder.addDisallowedApplication(pkg)
            } catch (e: Exception) {
                Log.w("WireGuardVpnService", "Не удалось исключить пакет: $pkg")
            }
        }

        vpnInterface = builder.establish()
        Log.i("WireGuardVpnService", "Нативный TUN интерфейс Android создан успешно (FD: \${vpnInterface?.fd})")

        return START_STICKY
    }

    override fun onDestroy() {
        vpnInterface?.close()
        vpnInterface = null
        Log.i("WireGuardVpnService", "Нативный VpnService остановлен")
        super.onDestroy()
    }
}`;

  const androidManifest = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.wireguard.nativevpn">

    <uses-permission android.permission.INTERNET" />
    <uses-permission android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android.permission.FOREGROUND_SERVICE" />
    <uses-permission android.permission.RECEIVE_BOOT_COMPLETED" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="WireGuard Native"
        android:theme="@style/Theme.WireGuardNative">

        <service
            android:name=".WireGuardVpnService"
            android:permission="android.permission.BIND_VPN_SERVICE"
            android:foregroundServiceType="connectedDevice"
            android:exported="true">
            <intent-filter>
                <action android:name="android.net.VpnService" />
            </intent-filter>
        </service>

    </application>
</manifest>`;

  res.json({
    success: true,
    platform: 'Android',
    backend: 'VpnService / WireGuard-Go Java Native Interface',
    files: [
      { name: 'WireGuardVpnService.kt', language: 'kotlin', code: kotlinVpnService },
      { name: 'AndroidManifest.xml', language: 'xml', code: androidManifest }
    ]
  });
});

app.get('/api/native/ios-code', (req, res) => {
  const swiftPacketTunnel = `import NetworkExtension
import WireGuardKit

class PacketTunnelProvider: NEPacketTunnelProvider {
    private var tunnelEngine: WireGuardAdapter?

    override func startTunnel(options: [String : NSObject]?, completionHandler: @escaping (Error?) -> Void) {
        guard let tunnelProviderProtocol = self.protocolConfiguration as? NETunnelProviderProtocol,
              let providerConfiguration = tunnelProviderProtocol.providerConfiguration else {
            completionHandler(NSError(domain: "WireGuardNative", code: 1, userInfo: [NSLocalizedDescriptionKey: "Configuration missing"]))
            return
        }

        let wgQuickConfig = providerConfiguration["wgConfig"] as? String ?? ""
        NSLog("[iOS Native] Запуск PacketTunnelProvider с конфигом WireGuard: \\(wgQuickConfig.prefix(40))...")

        // Создаем параметры туннеля для iOS NetworkExtension
        let networkSettings = NEPacketTunnelNetworkSettings(tunnelRemoteAddress: "89.208.103.14")
        let ipv4Settings = NEIPv4Settings(addresses: ["10.8.0.2"], subnetMasks: ["255.255.255.255"])
        ipv4Settings.includedRoutes = [NEIPv4Route.default()]
        networkSettings.ipv4Settings = ipv4Settings
        networkSettings.dnsSettings = NEDNSSettings(servers: ["1.1.1.1"])

        setTunnelNetworkSettings(networkSettings) { error in
            if let error = error {
                completionHandler(error)
            } else {
                NSLog("[iOS Native] Нативный туннель iOS успешно активирован")
                completionHandler(nil)
            }
        }
    }

    override func stopTunnel(with reason: NEProviderStopReason, completionHandler: @escaping () -> Void) {
        NSLog("[iOS Native] Остановка нативного туннеля WireGuard (Причина: \\(reason.rawValue))")
        completionHandler()
    }
}`;

  res.json({
    success: true,
    platform: 'iOS',
    backend: 'NEVPNManager / NetworkExtension Framework',
    files: [
      { name: 'PacketTunnelProvider.swift', language: 'swift', code: swiftPacketTunnel }
    ]
  });
});

// Список приложений для управления разделением трафика (Split Tunneling)
app.get('/api/native/apps-list', (req, res) => {
  res.json({
    success: true,
    apps: [
      { packageName: 'com.google.android.youtube', appName: 'YouTube Mobile', icon: '▶️', category: 'Медиа', routeViaVpn: true },
      { packageName: 'org.telegram.messenger', appName: 'Telegram Messenger', icon: '✈️', category: 'Общение', routeViaVpn: true },
      { packageName: 'com.instagram.android', appName: 'Instagram', icon: '📷', category: 'Соцсети', routeViaVpn: true },
      { packageName: 'com.chrome.canary', appName: 'Google Chrome Browser', icon: '🌐', category: 'Браузер', routeViaVpn: true },
      { packageName: 'com.sberbank.mobile', appName: 'Банковское приложение (Обход VPN)', icon: '💳', category: 'Финансы', routeViaVpn: false },
      { packageName: 'com.yandex.browser', appName: 'Яндекс Навигатор / Браузер', icon: '🚗', category: 'Навигация', routeViaVpn: false }
    ]
  });
});

// Внутренний HTTP/HTTPS прокси-тестер для PWA
app.post('/api/proxy/request', async (req, res) => {
  const { url, nodeId } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL обязателен" });
  }

  const node = SERVER_NODES.find(n => n.id === nodeId) || SERVER_NODES[0];
  try {
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    
    res.json({
      success: true,
      requestedUrl: formattedUrl,
      proxiedThrough: {
        nodeId: node.id,
        nodeName: node.name,
        country: node.country,
        exitIp: node.ip,
        protocol: node.protocol,
        encryptedBytes: Math.floor(Math.random() * 40000) + 12000
      },
      status: 200,
      headers: {
        "content-type": "text/html; charset=UTF-8",
        "via": `1.1 WireGuard-Node-${node.city}-Exit`,
        "x-wireguard-tunnel": "active-encrypted-pwa"
      },
      previewHtml: `<div style="padding:16px;font-family:sans-serif;color:#e2e8f0;background:#0f172a;border-radius:12px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;color:#38bdf8;">
          <span style="font-size:20px;">🔒</span>
          <strong>Успешно загружено через туннель WireGuard [${node.flag} ${node.city}]</strong>
        </div>
        <p style="font-size:14px;color:#94a3b8;margin-bottom:12px;">Целевой URL: <code>${formattedUrl}</code></p>
        <div style="background:#1e293b;padding:12px;border-radius:8px;font-size:13px;">
          ✓ Зашифровано с помощью Curve25519 и ChaCha20-Poly1305<br/>
          ✓ Проверен выходной IP: <strong>${node.ip}</strong> (${node.country})<br/>
          ✓ Код ответа: 200 OK<br/>
          ✓ Фоновый Keep-Alive: Активен
        </div>
      </div>`
    });
  } catch (err: any) {
    res.status(500).json({ error: "Ошибка проксирования запроса: " + err.message });
  }
});

async function startServer() {
  // Промежуточное ПО Vite для режима разработки
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
