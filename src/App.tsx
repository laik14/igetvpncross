import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MainConnectButton } from './components/MainConnectButton';
import { IPCheckerWidget } from './components/IPCheckerWidget';
import { TrafficGraph } from './components/TrafficGraph';
import { ProxyTesterTab } from './components/ProxyTesterTab';
import { NodeSelectorModal } from './components/NodeSelectorModal';
import { ConfigExportModal } from './components/ConfigExportModal';
import { PlatformGuideModal } from './components/PlatformGuideModal';
import { SettingsModal } from './components/SettingsModal';
import { NativeCodeExportModal } from './components/NativeCodeExportModal';
import { NativeSplitTunnelingModal } from './components/NativeSplitTunnelingModal';
import { NativeBridgeConsole } from './components/NativeBridgeConsole';

import { WGNode, IPInfo, ConnectionState, TrafficPoint, AppSettings, NativeAppRule } from './types';
import {
  initPWASericeWorker,
  promptPWAInstall,
  isStandalonePWA,
  detectPlatform,
  requestNotificationPermission,
  showStatusNotification
} from './services/pwaService';

export default function App() {
  const [nodes, setNodes] = useState<WGNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<WGNode | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [loadingIp, setLoadingIp] = useState(false);
  const [pinging, setPinging] = useState(false);

  // Статистика трафика
  const [trafficHistory, setTrafficHistory] = useState<TrafficPoint[]>([]);
  const [currentDown, setCurrentDown] = useState(0);
  const [currentUp, setCurrentUp] = useState(0);
  const [totalDownMb, setTotalDownMb] = useState(0);
  const [totalUpMb, setTotalUpMb] = useState(0);

  // Платформа
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('desktop');

  // Нативные правила и список мобильных приложений
  const [appRules, setAppRules] = useState<NativeAppRule[]>([]);

  // Модальные окна
  const [showNodeSelector, setShowNodeSelector] = useState(false);
  const [showConfigExport, setShowConfigExport] = useState(false);
  const [showPlatformGuides, setShowPlatformGuides] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNativeCodeModal, setShowNativeCodeModal] = useState(false);
  const [showSplitTunnelingModal, setShowSplitTunnelingModal] = useState(false);

  // Настройки подключения
  const [settings, setSettings] = useState<AppSettings>({
    mtu: 1420,
    customDns: '1.1.1.1, 1.0.0.1',
    obfuscation: false,
    killSwitch: true,
    pwaBackgroundSync: true,
    keepAliveIntervalSec: 10,
    clientName: 'WireGuard Native Смартфон',
    autoConnectOnLaunch: true,
    persistentNotification: true,
    nativeSplitTunneling: true
  });

  // Первоначальная загрузка
  useEffect(() => {
    setPlatform(detectPlatform());

    initPWASericeWorker();
    requestNotificationPermission();

    fetchNodes();
    fetchIpCheck(false);
    fetchNativeAppsList();
  }, []);

  const fetchNodes = async () => {
    try {
      const res = await fetch('/api/nodes');
      const data = await res.json();
      if (data.success && data.nodes.length > 0) {
        setNodes(data.nodes);
        if (!selectedNode) {
          setSelectedNode(data.nodes[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch server nodes:', err);
    }
  };

  const fetchNativeAppsList = async () => {
    try {
      const res = await fetch('/api/native/apps-list');
      const data = await res.json();
      if (data.success) {
        setAppRules(data.apps);
      }
    } catch (err) {
      console.error('Failed to fetch native apps list:', err);
    }
  };

  const fetchIpCheck = async (isConnected: boolean, nodeToUse = selectedNode) => {
    setLoadingIp(true);
    try {
      const url = isConnected && nodeToUse
        ? `/api/ipcheck?protected=true&nodeId=${nodeToUse.id}`
        : '/api/ipcheck?protected=false';
      const res = await fetch(url);
      const data = await res.json();
      setIpInfo(data);
    } catch (err) {
      console.error('Failed to check IP status:', err);
    } finally {
      setLoadingIp(false);
    }
  };

  const handleRefreshPings = async () => {
    if (nodes.length === 0) return;
    setPinging(true);
    try {
      const updatedNodes = await Promise.all(
        nodes.map(async (node) => {
          const res = await fetch(`/api/ping?nodeId=${node.id}`);
          const data = await res.json();
          return {
            ...node,
            pingMs: data.pingMs || node.pingMs
          };
        })
      );
      setNodes(updatedNodes);
      if (selectedNode) {
        const match = updatedNodes.find(n => n.id === selectedNode.id);
        if (match) setSelectedNode(match);
      }
    } catch (err) {
      console.error('Ping update error:', err);
    } finally {
      setPinging(false);
    }
  };

  // Обработчик переключения подключения WireGuard
  const handleToggleConnection = () => {
    if (connectionState === 'connected') {
      setConnectionState('disconnected');
      fetchIpCheck(false);
      showStatusNotification('WireGuard Native Отключен', 'Системный туннель VpnService/NEVPNManager остановлен.', '🛡️');
      setCurrentDown(0);
      setCurrentUp(0);
    } else if (connectionState === 'disconnected') {
      setConnectionState('connecting');
      setTimeout(() => {
        setConnectionState('connected');
        if (selectedNode) {
          fetchIpCheck(true, selectedNode);
          showStatusNotification(
            'WireGuard Native Подключен',
            `Нативный туннель активен через ${selectedNode.name} (${selectedNode.ip}).`,
            '🔒'
          );
        }
      }, 1200);
    }
  };

  const handleToggleAppRule = (packageName: string) => {
    setAppRules(prev =>
      prev.map(app =>
        app.packageName === packageName
          ? { ...app, routeViaVpn: !app.routeViaVpn }
          : app
      )
    );
  };

  // Эмуляция измерения скорости и трафика в реальном времени
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (connectionState === 'connected') {
      interval = setInterval(() => {
        const down = Math.random() * 45 + 12; // 12-57 Mbps
        const up = Math.random() * 20 + 5;   // 5-25 Mbps

        setCurrentDown(down);
        setCurrentUp(up);

        setTotalDownMb(prev => prev + (down / 8) * 2);
        setTotalUpMb(prev => prev + (up / 8) * 2);

        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

        setTrafficHistory(prev => {
          const next = [...prev, { time: timeStr, downloadMbps: Number(down.toFixed(1)), uploadMbps: Number(up.toFixed(1)) }];
          if (next.length > 20) next.shift();
          return next;
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [connectionState]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white overflow-x-hidden w-full">
      
      {/* Header Bar */}
      <Header
        platform={platform}
        onOpenGuides={() => setShowPlatformGuides(true)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenNativeCode={() => setShowNativeCodeModal(true)}
        isNativeConnected={connectionState === 'connected'}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-4 py-2 sm:py-4 space-y-3">
        
        {/* Central Connection Toggle Area */}
        {selectedNode && (
          <MainConnectButton
            connectionState={connectionState}
            selectedNode={selectedNode}
            onToggleConnect={handleToggleConnection}
            onSelectNodeClick={() => setShowNodeSelector(true)}
            onExportConfigClick={() => setShowConfigExport(true)}
            killSwitch={settings.killSwitch}
          />
        )}

        {/* Панель нативного туннеля ОС (Android VpnService / iOS NetworkExtension) */}
        <NativeBridgeConsole
          platform={platform}
          selectedNode={selectedNode}
          isConnected={connectionState === 'connected'}
          onToggleConnection={handleToggleConnection}
          onOpenSplitTunneling={() => setShowSplitTunnelingModal(true)}
        />

        {/* IP & Security Status Widget */}
        <IPCheckerWidget
          ipInfo={ipInfo}
          loading={loadingIp}
          onRefresh={() => fetchIpCheck(connectionState === 'connected', selectedNode || undefined)}
        />

        {/* Traffic Chart */}
        <TrafficGraph
          data={trafficHistory}
          currentDownloadMbps={currentDown}
          currentUploadMbps={currentUp}
          totalDownloadedMb={totalDownMb}
          totalUploadedMb={totalUpMb}
          isConnected={connectionState === 'connected'}
        />

        {/* In-App Native Proxy Tester */}
        {selectedNode && (
          <ProxyTesterTab selectedNode={selectedNode} />
        )}

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/80 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            WireGuard Native Cross-Platform Studio • Android (Kotlin VpnService) & iOS (Swift NEVPNManager)
          </span>
          <button
            onClick={() => setShowNativeCodeModal(true)}
            className="text-sky-400 hover:underline cursor-pointer font-medium"
          >
            Исходный код приложения для Android Studio & Xcode
          </button>
        </div>
      </footer>

      {/* Modals */}
      {showNodeSelector && selectedNode && (
        <NodeSelectorModal
          nodes={nodes}
          selectedNode={selectedNode}
          onSelectNode={(node) => {
            setSelectedNode(node);
            if (connectionState === 'connected') {
              fetchIpCheck(true, node);
            }
          }}
          onClose={() => setShowNodeSelector(false)}
          onRefreshPings={handleRefreshPings}
          pinging={pinging}
        />
      )}

      {showConfigExport && selectedNode && (
        <ConfigExportModal
          selectedNode={selectedNode}
          onClose={() => setShowConfigExport(false)}
          clientName={settings.clientName}
        />
      )}

      {showPlatformGuides && (
        <PlatformGuideModal
          initialPlatform={platform}
          onClose={() => setShowPlatformGuides(false)}
        />
      )}

      {showSettings && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      <NativeCodeExportModal
        isOpen={showNativeCodeModal}
        onClose={() => setShowNativeCodeModal(false)}
      />

      <NativeSplitTunnelingModal
        isOpen={showSplitTunnelingModal}
        onClose={() => setShowSplitTunnelingModal(false)}
        apps={appRules}
        onToggleAppRule={handleToggleAppRule}
      />

    </div>
  );
}

