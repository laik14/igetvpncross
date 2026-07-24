import React from 'react';
import { Globe, ShieldCheck, ShieldAlert, RefreshCw, Cpu, CheckCircle2 } from 'lucide-react';
import { IPInfo } from '../types';

interface IPCheckerWidgetProps {
  ipInfo: IPInfo | null;
  loading: boolean;
  onRefresh: () => void;
}

export const IPCheckerWidget: React.FC<IPCheckerWidgetProps> = ({ ipInfo, loading, onRefresh }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Current Network Status
          </h3>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Refresh IP & Location Check"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {ipInfo ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* IP Card */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Public IP Address
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-lg font-mono font-bold text-white tracking-tight">
                {ipInfo.ip}
              </span>
              <span className="text-xl leading-none">{ipInfo.flag}</span>
            </div>
            <span className="text-xs text-slate-400 mt-1 font-medium">
              {ipInfo.city}, {ipInfo.country}
            </span>
          </div>

          {/* Security & Cipher Card */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Tunnel Encryption
            </span>
            
            <div className="mt-1">
              {ipInfo.protected ? (
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>WireGuard Active (ChaCha20)</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Unencrypted Direct Route</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-900 text-[11px] text-slate-400">
              <span className="truncate">{ipInfo.isp}</span>
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3 h-3" />
                DNS Leak Protected
              </span>
            </div>
          </div>

        </div>
      ) : (
        <div className="py-6 text-center text-xs text-slate-500">
          Loading network status...
        </div>
      )}
    </div>
  );
};
