// Описание серверного узла WireGuard
export interface WGNode {
  id: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  flag: string;
  endpoint: string;
  serverPublicKey: string;
  ip: string;
  dns: string;
  protocol: string;
  obfuscated: boolean;
  pingMs: number;
  loadPercent: number;
  supportsIPv6: boolean;
  allowedIPs: string;
  mtu: number;
}

// Ключи клиента WireGuard
export interface WGKeys {
  privateKey: string;
  publicKey: string;
  presharedKey: string;
  clientIPv4: string;
  clientIPv6: string;
}

// Конфигурационный пакет WireGuard
export interface WGConfig {
  node: WGNode;
  keys: WGKeys;
  confContent: string;
  filename: string;
  wireguardDeepLink: string;
}

// Информация о текущем IP и статусе защиты
export interface IPInfo {
  ip: string;
  country: string;
  city: string;
  countryCode: string;
  flag: string;
  isp: string;
  protected: boolean;
  protocol: string;
  latency: number;
}

// Состояние подключения
export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'rekeying' | 'error';

// Точка данных для графика скорости
export interface TrafficPoint {
  time: string;
  downloadMbps: number;
  uploadMbps: number;
}

// Настройки WireGuard приложения
export interface AppSettings {
  mtu: number;
  customDns: string;
  obfuscation: boolean;
  killSwitch: boolean;
  pwaBackgroundSync: boolean;
  keepAliveIntervalSec: number;
  clientName: string;
  autoConnectOnLaunch: boolean;
  persistentNotification: boolean;
  nativeSplitTunneling: boolean;
  theme: 'liquid-dark' | 'liquid-light' | 'dark';
}

// Статус нативного туннеля ОС (Android VpnService / iOS NetworkExtension)
export interface NativeTunnelStatus {
  framework: 'Android VpnService (WireGuard-Go)' | 'iOS NEVPNManager (NetworkExtension)' | 'Simulated Native IPC';
  isServiceRunning: boolean;
  servicePid: number | null;
  lastHandshakeSecondsAgo: number;
  tunnelInterface: string; // e.g. tun0 / utun2
  txBytes: number;
  rxBytes: number;
  keepAliveActive: boolean;
  splitTunnelActive: boolean;
  activeAppRulesCount: number;
}

// Правило раздельного туннелирования (Split Tunneling) для нативного мобильного приложения
export interface NativeAppRule {
  packageName: string; // e.g. com.google.android.youtube or com.apple.mobilesafari
  appName: string;
  icon: string;
  category: string;
  routeViaVpn: boolean;
}

// Лог события нативного моста (IPC Bridge Log)
export interface NativeBridgeLog {
  id: string;
  timestamp: string;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  tag: 'VpnService' | 'NETunnelProvider' | 'WireGuardGo' | 'IPCBridge';
  message: string;
}
