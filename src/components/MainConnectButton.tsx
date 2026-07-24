import React, { useEffect, useState } from 'react';
import { Power, Globe, Shield, RefreshCw, Lock, Sparkles, AlertCircle, ArrowUpRight } from 'lucide-react';
import { ConnectionState, WGNode } from '../types';

interface MainConnectButtonProps {
  connectionState: ConnectionState;
  selectedNode: WGNode;
  onToggleConnect: () => void;
  onSelectNodeClick: () => void;
  onExportConfigClick: () => void;
  killSwitch: boolean;
}

export const MainConnectButton: React.FC<MainConnectButtonProps> = ({
  connectionState,
  selectedNode,
  onToggleConnect,
  onSelectNodeClick,
  onExportConfigClick,
  killSwitch
}) => {
  const [uptimeSeconds, setUptimeSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (connectionState === 'connected') {
      interval = setInterval(() => {
        setUptimeSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setUptimeSeconds(0);
    }
    return () => clearInterval(interval);
  }, [connectionState]);

  const formatUptime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs > 0 ? hrs.toString().padStart(2, '0') + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isConnected = connectionState === 'connected';
  const isConnecting = connectionState === 'connecting' || connectionState === 'rekeying';

  return (
    <div className="flex flex-col items-center justify-center py-2 px-3">
      
      {/* Node Location Badge & Switcher */}
      <div 
        onClick={onSelectNodeClick}
        className="group relative flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 transition-all cursor-pointer shadow-md mb-3"
      >
        <span className="text-xl leading-none">{selectedNode.flag}</span>
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
              {selectedNode.city}, {selectedNode.country}
            </span>
            <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400">
              {selectedNode.countryCode}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {selectedNode.pingMs} ms
            </span>
            <span>•</span>
            <span>{selectedNode.protocol}</span>
          </div>
        </div>
        <div className="ml-1 pl-2 border-l border-slate-800 text-[11px] font-medium text-sky-400 group-hover:translate-x-0.5 transition-transform">
          Сменить
        </div>
      </div>

      {/* Main Connection Toggle Button */}
      <div className="relative flex items-center justify-center my-1">
        {/* Glowing Background Pulse Rings */}
        {isConnected && (
          <>
            <div className="absolute w-44 h-44 rounded-full bg-emerald-500/10 animate-ping opacity-30"></div>
            <div className="absolute w-36 h-36 rounded-full bg-emerald-500/20 animate-pulse"></div>
          </>
        )}
        {isConnecting && (
          <div className="absolute w-40 h-40 rounded-full bg-amber-500/20 animate-spin border-2 border-dashed border-amber-400/60"></div>
        )}

        <button
          onClick={onToggleConnect}
          className={`relative w-36 h-36 rounded-full flex flex-col items-center justify-center p-3 transition-all duration-300 transform active:scale-95 cursor-pointer shadow-xl ${
            isConnected
              ? 'bg-gradient-to-b from-emerald-500 via-teal-600 to-emerald-700 text-white shadow-emerald-500/30 ring-4 ring-emerald-500/20'
              : isConnecting
              ? 'bg-gradient-to-b from-amber-500 via-amber-600 to-amber-700 text-white shadow-amber-500/20 ring-4 ring-amber-500/20'
              : 'bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 text-slate-300 border border-slate-700/80 shadow-black/80 hover:border-sky-500/50 hover:text-white'
          }`}
        >
          {isConnecting ? (
            <RefreshCw className="w-9 h-9 animate-spin text-white mb-1.5" />
          ) : (
            <Power className={`w-9 h-9 mb-1.5 transition-transform duration-300 ${isConnected ? 'scale-110 text-white' : 'text-slate-400 group-hover:text-white'}`} />
          )}

          <span className="text-[11px] font-bold uppercase tracking-wider text-center leading-tight">
            {isConnected ? 'Отключить' : isConnecting ? 'Подключение...' : 'Подключить'}
          </span>

          <span className="text-[10px] opacity-80 mt-0.5 font-mono">
            {isConnected ? formatUptime(uptimeSeconds) : 'WireGuard UDP'}
          </span>
        </button>
      </div>

      {/* Статус подключения и дополнительные действия */}
      <div className="mt-3 flex flex-col items-center gap-1.5 text-center">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-emerald-400 animate-pulse' : isConnecting ? 'bg-amber-400 animate-bounce' : 'bg-slate-600'
          }`}></span>
          <span className="text-xs font-semibold text-white">
            {isConnected
              ? `Защищено через WireGuard (${selectedNode.city})`
              : isConnecting
              ? 'Установка защищенного туннеля...'
              : 'Соединение неактивно'}
          </span>
        </div>

        {/* Быстрая ссылка на генерацию конфигурации WireGuard */}
        <button
          onClick={onExportConfigClick}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-[11px] font-medium transition-all cursor-pointer mt-1"
        >
          <Lock className="w-3 h-3 text-sky-400" />
          <span>Создать .conf / QR-код</span>
          <ArrowUpRight className="w-3 h-3 text-slate-500" />
        </button>
      </div>

    </div>
  );
};
