import React, { useState, useEffect } from 'react';
import { Terminal, Cpu, Play, Square, RefreshCw, Activity, Wifi, Zap, Lock, Smartphone, ChevronDown, ChevronUp } from 'lucide-react';
import { NativeBridgeLog, WGNode } from '../types';

interface NativeBridgeConsoleProps {
  platform: 'ios' | 'android' | 'desktop';
  selectedNode: WGNode | null;
  isConnected: boolean;
  onToggleConnection: () => void;
  onOpenSplitTunneling: () => void;
  isLight?: boolean;
}

export const NativeBridgeConsole: React.FC<NativeBridgeConsoleProps> = ({
  platform,
  selectedNode,
  isConnected,
  onToggleConnection,
  onOpenSplitTunneling,
  isLight = false
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
    <div className={`w-full border rounded-2xl p-3 sm:p-4 space-y-3 shadow-sm transition-all ${
      isLight
        ? 'bg-white border-slate-200/80 text-slate-800'
        : 'bg-[#11243a]/90 border-slate-800 text-slate-200 shadow-xl'
    }`}>
      
      {/* Шапка консоли */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-500 shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              <span>Панель Нативного Туннеля ОС</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-300 border border-sky-500/20">
                Native System Tunnel
              </span>
            </h3>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {isConnected ? 'Системный VPN активен в фоновом режиме' : 'Готов к запуску нативного туннеля'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onToggleConnection}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              isConnected
                ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
            }`}
          >
            {isConnected ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isConnected ? 'Остановить' : 'Запустить'}</span>
          </button>

          <button
            onClick={onOpenSplitTunneling}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isLight
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/20'
            }`}
          >
            Split Tunneling
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1 cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
            title="Свернуть/Развернуть подробности"
          >
            <span>{isExpanded ? 'Скрыть логи' : 'Логи и метрики'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Сворачиваемая секция метрик и логов */}
      {isExpanded && (
        <div className={`pt-3 border-t space-y-4 animate-fadeIn ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
          {/* Индикаторы метрик нативной службы */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className={`p-3 rounded-xl border space-y-1 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="text-[10px] text-slate-500 font-sans uppercase tracking-wider flex items-center gap-1 font-bold">
                <Smartphone className="w-3 h-3 text-sky-500" />
                <span>Интерфейс ОС</span>
              </div>
              <div className="font-bold text-sky-500 text-sm">
                {isConnected ? (platform === 'ios' ? 'utun3 (Active)' : 'tun0 (Active)') : 'Inactive'}
              </div>
            </div>

            <div className={`p-3 rounded-xl border space-y-1 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="text-[10px] text-slate-500 font-sans uppercase tracking-wider flex items-center gap-1 font-bold">
                <Zap className="w-3 h-3 text-amber-500" />
                <span>Handshake</span>
              </div>
              <div className="font-bold text-amber-500 text-sm">
                {isConnected ? `${handshakeTimer} сек назад` : '—'}
              </div>
            </div>

            <div className={`p-3 rounded-xl border space-y-1 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="text-[10px] text-slate-500 font-sans uppercase tracking-wider flex items-center gap-1 font-bold">
                <Lock className="w-3 h-3 text-emerald-500" />
                <span>Шифрование</span>
              </div>
              <div className="font-bold text-emerald-500 text-sm">
                ChaCha20
              </div>
            </div>

            <div className={`p-3 rounded-xl border space-y-1 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="text-[10px] text-slate-500 font-sans uppercase tracking-wider flex items-center gap-1 font-bold">
                <Activity className="w-3 h-3 text-indigo-500" />
                <span>Фоновый PID</span>
              </div>
              <div className={`font-bold text-sm ${isLight ? 'text-indigo-600' : 'text-indigo-300'}`}>
                {isConnected ? 'PID: 14092' : 'Stopped'}
              </div>
            </div>
          </div>

          {/* Быстрые команды нативного моста */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleForceRekey}
              disabled={!isConnected}
              className={`px-2.5 py-1 rounded-lg border disabled:opacity-40 text-xs font-mono font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              }`}
            >
              <RefreshCw className="w-3 h-3 text-amber-500" />
              <span>Force Rekey</span>
            </button>

            <button
              onClick={handleFlushDns}
              className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              }`}
            >
              <Wifi className="w-3 h-3 text-sky-500" />
              <span>Flush DNS Cache</span>
            </button>
          </div>

          {/* Консоль логов системных событий */}
          <div className="space-y-1.5">
            <div className={`flex items-center justify-between text-[11px] font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <span className="flex items-center gap-1">
                <Terminal className="w-3 h-3 text-sky-500" />
                <span>Системные логи нативного туннеля (Native IPC Log)</span>
              </span>
              <span className="text-[10px] text-slate-400">{logs.length} событий</span>
            </div>

            <div className={`p-3 rounded-xl border font-mono text-xs space-y-2 max-h-36 overflow-y-auto custom-scrollbar ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-200'
            }`}>
              {logs.map(log => (
                <div key={log.id} className="flex items-start gap-2 text-[11px]">
                  <span className={`${isLight ? 'text-slate-400' : 'text-slate-600'} shrink-0`}>{log.timestamp}</span>
                  <span className={`px-1 rounded text-[9px] font-bold shrink-0 ${
                    log.level === 'INFO' ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20' :
                    log.level === 'WARN' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                    'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    [{log.tag}]
                  </span>
                  <span className={log.level === 'WARN' ? 'text-amber-600 dark:text-amber-300' : isLight ? 'text-slate-800' : 'text-slate-300'}>
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
