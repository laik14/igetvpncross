import React, { useState, useEffect } from 'react';
import { Terminal, Cpu, Play, Square, RefreshCw, Activity, ShieldCheck, Wifi, Zap, Lock, Smartphone, ChevronDown, ChevronUp } from 'lucide-react';
import { NativeTunnelStatus, NativeBridgeLog, WGNode } from '../types';

interface NativeBridgeConsoleProps {
  platform: 'ios' | 'android' | 'desktop';
  selectedNode: WGNode | null;
  isConnected: boolean;
  onToggleConnection: () => void;
  onOpenSplitTunneling: () => void;
}

export const NativeBridgeConsole: React.FC<NativeBridgeConsoleProps> = ({
  platform,
  selectedNode,
  isConnected,
  onToggleConnection,
  onOpenSplitTunneling
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [logs, setLogs] = useState<NativeBridgeLog[]>([
    {
      id: '1',
      timestamp: new Date().toLocaleTimeString(),
      level: 'INFO',
      tag: platform === 'ios' ? 'NETunnelProvider' : 'VpnService',
      message: `Нативный модуль WireGuard инициализирован для ${platform === 'ios' ? 'iOS (NetworkExtension)' : 'Android (VpnService)'}`
    },
    {
      id: '2',
      timestamp: new Date().toLocaleTimeString(),
      level: 'DEBUG',
      tag: 'WireGuardGo',
      message: 'Curve25519 & ChaCha20-Poly1305 библиотеки загружены в системный RAM'
    }
  ]);

  const [handshakeTimer, setHandshakeTimer] = useState(12);

  // Добавление логов при изменении подключения
  useEffect(() => {
    if (isConnected && selectedNode) {
      const newLog: NativeBridgeLog = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        level: 'INFO',
        tag: platform === 'ios' ? 'NETunnelProvider' : 'VpnService',
        message: `Установлен нативный TUN интерфейс (${platform === 'ios' ? 'utun3' : 'tun0'}) -> ${selectedNode.endpoint}`
      };
      setLogs(prev => [newLog, ...prev.slice(0, 19)]);
    } else if (!isConnected) {
      const newLog: NativeBridgeLog = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        level: 'WARN',
        tag: platform === 'ios' ? 'NETunnelProvider' : 'VpnService',
        message: 'Нативный системный туннель остановлен ОС'
      };
      setLogs(prev => [newLog, ...prev.slice(0, 19)]);
    }
  }, [isConnected, selectedNode, platform]);

  const handleForceRekey = () => {
    const newLog: NativeBridgeLog = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      level: 'INFO',
      tag: 'WireGuardGo',
      message: 'Принудительный обмен сессионными ключами Rekeying (Handshake refreshed)'
    };
    setLogs(prev => [newLog, ...prev]);
    setHandshakeTimer(1);
  };

  const handleFlushDns = () => {
    const newLog: NativeBridgeLog = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      level: 'DEBUG',
      tag: 'IPCBridge',
      message: 'Системный кэш DNS мобильного устройства очищен'
    };
    setLogs(prev => [newLog, ...prev]);
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl transition-all">
      
      {/* Шапка консоли - всегда видима */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Панель Нативного Туннеля ОС</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                {platform === 'ios' ? 'iOS NEVPNManager' : 'Android VpnService'}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isConnected ? 'Системный VPN активен в фоновом режиме' : 'Готов к запуску нативного туннеля'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onToggleConnection}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
              isConnected
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
            }`}
          >
            {isConnected ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isConnected ? 'Остановить' : 'Запустить'}</span>
          </button>

          <button
            onClick={onOpenSplitTunneling}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/20 transition-all cursor-pointer"
          >
            Split Tunneling
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
            title="Свернуть/Развернуть подробности"
          >
            <span>{isExpanded ? 'Скрыть логи' : 'Логи и метрики'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* Сворачиваемая секция метрик и логов */}
      {isExpanded && (
        <div className="pt-3 border-t border-slate-800 space-y-4 animate-fadeIn">
          {/* Индикаторы метрик нативной службы */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500 font-sans uppercase tracking-wider flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-sky-400" />
                <span>Интерфейс ОС</span>
              </div>
              <div className="font-bold text-sky-400 text-sm">
                {isConnected ? (platform === 'ios' ? 'utun3 (Active)' : 'tun0 (Active)') : 'Inactive'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500 font-sans uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Handshake</span>
              </div>
              <div className="font-bold text-amber-400 text-sm">
                {isConnected ? `${handshakeTimer} сек назад` : '—'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500 font-sans uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Шифрование</span>
              </div>
              <div className="font-bold text-emerald-400 text-sm">
                ChaCha20
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500 font-sans uppercase tracking-wider flex items-center gap-1">
                <Activity className="w-3 h-3 text-indigo-400" />
                <span>Фоновый PID</span>
              </div>
              <div className="font-bold text-indigo-300 text-sm">
                {isConnected ? 'PID: 14092' : 'Stopped'}
              </div>
            </div>
          </div>

          {/* Быстрые команды нативного моста */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleForceRekey}
              disabled={!isConnected}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3 h-3 text-amber-400" />
              <span>Force Rekey</span>
            </button>

            <button
              onClick={handleFlushDns}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Wifi className="w-3 h-3 text-sky-400" />
              <span>Flush DNS Cache</span>
            </button>
          </div>

          {/* Консоль логов системных событий */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Terminal className="w-3 h-3 text-sky-400" />
                <span>Системные логи нативного туннеля (Native IPC Log)</span>
              </span>
              <span className="text-[10px] text-slate-500">{logs.length} событий</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-2 max-h-36 overflow-y-auto custom-scrollbar">
              {logs.map(log => (
                <div key={log.id} className="flex items-start gap-2 text-[11px]">
                  <span className="text-slate-600 shrink-0">{log.timestamp}</span>
                  <span className={`px-1 rounded text-[9px] font-bold shrink-0 ${
                    log.level === 'INFO' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    log.level === 'WARN' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    [{log.tag}]
                  </span>
                  <span className={log.level === 'WARN' ? 'text-amber-300' : 'text-slate-300'}>
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

