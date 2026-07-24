import React, { useState } from 'react';
import { Globe, ShieldCheck, ShieldAlert, RefreshCw, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { IPInfo } from '../types';

interface IPCheckerWidgetProps {
  ipInfo: IPInfo | null;
  loading: boolean;
  onRefresh: () => void;
  isLight?: boolean;
}

export const IPCheckerWidget: React.FC<IPCheckerWidgetProps> = ({ ipInfo, loading, onRefresh, isLight = false }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className={`border rounded-2xl p-3 shadow-sm transition-all ${
      isLight
        ? 'bg-white border-slate-200/80 text-slate-800'
        : 'bg-[#11243a]/90 border-slate-800 text-slate-200 shadow-xl'
    }`}>
      {/* Compact One-Line Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Globe className="w-4 h-4 text-sky-500 shrink-0" />
          <h3 className={`text-xs font-bold uppercase tracking-wider shrink-0 ${
            isLight ? 'text-slate-800' : 'text-slate-200'
          }`}>
            Статус сети
          </h3>

          {ipInfo && (
            <div className="flex items-center gap-2 text-xs font-mono truncate ml-1">
              <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{ipInfo.ip}</span>
              <span className="text-sm leading-none">{ipInfo.flag}</span>
              <span className={`text-[11px] hidden sm:inline truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                ({ipInfo.city}, {ipInfo.country})
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onRefresh}
            disabled={loading}
            className={`p-1 rounded-lg border transition-colors cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-600'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
            title="Обновить IP"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className={`px-2 py-1 rounded-lg border transition-colors flex items-center gap-1 text-[11px] font-semibold cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
          >
            <span className="hidden sm:inline">{showDetails ? 'Скрыть' : 'Подробнее'}</span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {showDetails && (
        <div className={`mt-3 pt-3 border-t animate-fadeIn ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
          {ipInfo ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* IP Card */}
              <div className={`border rounded-xl p-3 flex flex-col justify-between ${
                isLight ? 'bg-slate-50 border-slate-200/80' : 'bg-[#0a182b] border-slate-800/80'
              }`}>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Публичный IP-адрес
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className={`text-lg font-mono font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {ipInfo.ip}
                  </span>
                  <span className="text-xl leading-none">{ipInfo.flag}</span>
                </div>
                <span className={`text-xs mt-1 font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {ipInfo.city}, {ipInfo.country}
                </span>
              </div>

              {/* Security & Cipher Card */}
              <div className={`border rounded-xl p-3 flex flex-col justify-between ${
                isLight ? 'bg-slate-50 border-slate-200/80' : 'bg-[#0a182b] border-slate-800/80'
              }`}>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Шифрование туннеля
                </span>
                
                <div className="mt-1">
                  {ipInfo.protected ? (
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>WireGuard Активен (ChaCha20)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Прямой незашифрованный маршрут</span>
                    </div>
                  )}
                </div>

                <div className={`flex items-center justify-between mt-2 pt-2 border-t text-[11px] ${
                  isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-400'
                }`}>
                  <span className="truncate">{ipInfo.isp}</span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    Защита DNS
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center text-xs text-slate-500">
              Загрузка статуса сети...
            </div>
          )}
        </div>
      )}
    </div>
  );
};
