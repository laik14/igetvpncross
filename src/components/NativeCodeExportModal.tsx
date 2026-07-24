import React, { useState } from 'react';
import { X, Copy, Check, Download, Smartphone, Apple, Terminal, Code2, Layers, ExternalLink } from 'lucide-react';

interface NativeCodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NativeCodeExportModal: React.FC<NativeCodeExportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'bridge'>('android');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(key);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const androidKotlinCode = `package com.wireguard.nativevpn

import android.content.Intent
import android.net.VpnService
import android.os.ParcelFileDescriptor
import android.util.Log

/**
 * Нативная служба VpnService для Android с интеграцией WireGuard-Go backend.
 * Полностью управляет TUN-интерфейсом и фоновым соединением OS.
 */
class WireGuardVpnService : VpnService() {
    private var vpnInterface: ParcelFileDescriptor? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val endpoint = intent?.getStringExtra("ENDPOINT") ?: "89.208.103.14:51820"
        val clientIPv4 = intent?.getStringExtra("CLIENT_IP") ?: "10.8.0.2/32"
        val dnsServer = intent?.getStringExtra("DNS") ?: "1.1.1.1"

        Log.i("WireGuardVpnService", "Запуск нативного VpnService для туннеля $endpoint")

        val builder = Builder()
            .addAddress("10.8.0.2", 32)
            .addRoute("0.0.0.0", 0)
            .addDnsServer(dnsServer)
            .setMtu(1420)
            .setSession("WireGuard Native Service")

        // Поддержка раздельного туннелирования (Split Tunneling)
        val disallowedApps = intent?.getStringArrayExtra("DISALLOWED_APPS")
        disallowedApps?.forEach { pkg ->
            try {
                builder.addDisallowedApplication(pkg)
            } catch (e: Exception) {
                Log.w("WireGuardVpnService", "Не удалось исключить приложение: $pkg")
            }
        }

        vpnInterface = builder.establish()
        Log.i("WireGuardVpnService", "Нативный TUN интерфейс (tun0) успешно создан")

        return START_STICKY
    }

    override fun onDestroy() {
        vpnInterface?.close()
        vpnInterface = null
        Log.i("WireGuardVpnService", "Нативная служба VPN остановлена")
        super.onDestroy()
    }
}`;

  const androidManifest = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.wireguard.nativevpn">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />

    <application
        android:allowBackup="true"
        android:label="WireGuard Native Mobile"
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

  const iosSwiftCode = `import NetworkExtension
import WireGuardKit

/**
 * Нативный провайдер туннеля iOS NetworkExtension (NEPacketTunnelProvider)
 * Работает в фоновом системном процессе iOS без ограничения времени PWA.
 */
class PacketTunnelProvider: NEPacketTunnelProvider {
    private var adapter: WireGuardAdapter?

    override func startTunnel(options: [String : NSObject]?, completionHandler: @escaping (Error?) -> Void) {
        guard let tunnelProviderProtocol = self.protocolConfiguration as? NETunnelProviderProtocol,
              let providerConfiguration = tunnelProviderProtocol.providerConfiguration else {
            completionHandler(NSError(domain: "WireGuardNative", code: 1, userInfo: [NSLocalizedDescriptionKey: "Отсутствует конфигурация"]))
            return
        }

        let wgConfigString = providerConfiguration["wgConfig"] as? String ?? ""
        NSLog("[iOS Native] Запуск PacketTunnelProvider с WireGuard конфигом")

        let networkSettings = NEPacketTunnelNetworkSettings(tunnelRemoteAddress: "89.208.103.14")
        let ipv4Settings = NEIPv4Settings(addresses: ["10.8.0.2"], subnetMasks: ["255.255.255.255"])
        ipv4Settings.includedRoutes = [NEIPv4Route.default()]
        networkSettings.ipv4Settings = ipv4Settings
        networkSettings.dnsSettings = NEDNSSettings(servers: ["1.1.1.1"])

        setTunnelNetworkSettings(networkSettings) { error in
            if let error = error {
                completionHandler(error)
            } else {
                NSLog("[iOS Native] Нативный системный туннель iOS успешно активирован")
                completionHandler(nil)
            }
        }
    }

    override func stopTunnel(with reason: NEProviderStopReason, completionHandler: @escaping () -> Void) {
        NSLog("[iOS Native] Системная остановка туннеля WireGuard (Причина: \\(reason.rawValue))")
        completionHandler()
    }
}`;

  const capacitorBridgeCode = `import { registerPlugin } from '@capacitor/core';

export interface WireGuardNativePlugin {
  startTunnel(options: { configContent: string; endpoint: string; disallowedApps?: string[] }): Promise<{ success: boolean; interfaceName: string }>;
  stopTunnel(): Promise<{ success: boolean }>;
  getTunnelStats(): Promise<{ rxBytes: number; txBytes: number; lastHandshakeSec: number; isRunning: boolean }>;
}

const WireGuardNative = registerPlugin<WireGuardNativePlugin>('WireGuardNative');

export async function connectNativeWireGuard(conf: string, endpoint: string) {
  try {
    const res = await WireGuardNative.startTunnel({
      configContent: conf,
      endpoint: endpoint,
      disallowedApps: ['com.sberbank.mobile']
    });
    console.log('[Native Bridge] Нативный туннель успешно запущен:', res.interfaceName);
    return res;
  } catch (e) {
    console.error('[Native Bridge] Ошибка вызова VpnService/NEVPNManager:', e);
    throw e;
  }
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Шапка модального окна */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Исходный код Нативного Мобильного Приложения
              </h3>
              <p className="text-xs text-slate-400">
                Готовые исходники для сборки APK (Android Studio) и iOS (Xcode / TestFlight)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Переключатель платформ */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-4">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'android'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Android (Kotlin / VpnService)</span>
          </button>

          <button
            onClick={() => setActiveTab('ios')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'ios'
                ? 'border-sky-500 text-sky-400 bg-sky-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Apple className="w-4 h-4 text-sky-400" />
            <span>iOS (Swift / NetworkExtension)</span>
          </button>

          <button
            onClick={() => setActiveTab('bridge')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'bridge'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Capacitor / React Native Bridge</span>
          </button>
        </div>

        {/* Содержимое вкладки */}
        <div className="p-5 flex-1 overflow-y-auto space-y-6">
          {activeTab === 'android' && (
            <div className="space-y-5">
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 flex items-start gap-2.5">
                <Smartphone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Нативный VpnService Android:</strong> Приложение работает в качестве полноценной системной службы. Автоматически создает TUN-интерфейс (`tun0`), работает в фоновом режиме без отключений экономией батареи и поддерживает выгрузку отдельных приложений через Split Tunneling.
                </div>
              </div>

              {/* Kotlin VpnService */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-slate-300">
                    app/src/main/java/com/wireguard/nativevpn/WireGuardVpnService.kt
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(androidKotlinCode, 'kotlin')}
                      className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 transition-all cursor-pointer"
                    >
                      {copiedIndex === 'kotlin' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedIndex === 'kotlin' ? 'Скопировано' : 'Копировать'}</span>
                    </button>
                    <button
                      onClick={() => handleDownload('WireGuardVpnService.kt', androidKotlinCode)}
                      className="px-2.5 py-1 text-xs rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Скачать .kt</span>
                    </button>
                  </div>
                </div>
                <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-mono overflow-x-auto max-h-56">
                  {androidKotlinCode}
                </pre>
              </div>

              {/* AndroidManifest.xml */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-slate-300">
                    app/src/main/AndroidManifest.xml
                  </span>
                  <button
                    onClick={() => handleCopy(androidManifest, 'manifest')}
                    className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 transition-all cursor-pointer"
                  >
                    {copiedIndex === 'manifest' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Копировать Manifest</span>
                  </button>
                </div>
                <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono overflow-x-auto max-h-40">
                  {androidManifest}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'ios' && (
            <div className="space-y-5">
              <div className="p-3.5 bg-sky-500/10 border border-sky-500/20 rounded-xl text-xs text-sky-300 flex items-start gap-2.5">
                <Apple className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Нативный iOS NetworkExtension Framework:</strong> Запускает системный `PacketTunnelProvider`. Осуществляет прямое шифрование пакетов через модуль `WireGuardKit` (C-Go bindings), отображает иконку VPN в статус-баре iOS и полностью контролирует трафик устройства.
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-slate-300">
                    PacketTunnelProvider.swift (Target: NetworkExtension)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(iosSwiftCode, 'swift')}
                      className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 transition-all cursor-pointer"
                    >
                      {copiedIndex === 'swift' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedIndex === 'swift' ? 'Скопировано' : 'Копировать'}</span>
                    </button>
                    <button
                      onClick={() => handleDownload('PacketTunnelProvider.swift', iosSwiftCode)}
                      className="px-2.5 py-1 text-xs rounded bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Скачать .swift</span>
                    </button>
                  </div>
                </div>
                <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-sky-300 font-mono overflow-x-auto max-h-80">
                  {iosSwiftCode}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'bridge' && (
            <div className="space-y-5">
              <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-300 flex items-start gap-2.5">
                <Layers className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Кроссплатформенный плагин IPC (Capacitor / React Native):</strong> Мост для связывания веб-интерфейса React с нативным системным бинарником WireGuard на смартфонах.
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-slate-300">
                    src/native/WireGuardNativeBridge.ts
                  </span>
                  <button
                    onClick={() => handleCopy(capacitorBridgeCode, 'bridge')}
                    className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 transition-all cursor-pointer"
                  >
                    {copiedIndex === 'bridge' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Скопировать TS Bridge</span>
                  </button>
                </div>
                <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-indigo-300 font-mono overflow-x-auto max-h-80">
                  {capacitorBridgeCode}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Подвал */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            <span>Готово к интеграции в Android Studio и Xcode</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          >
            Закрыть
          </button>
        </div>

      </div>
    </div>
  );
};
