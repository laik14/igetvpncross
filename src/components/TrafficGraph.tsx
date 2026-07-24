import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowDown, ArrowUp, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { TrafficPoint } from '../types';

interface TrafficGraphProps {
  data: TrafficPoint[];
  currentDownloadMbps: number;
  currentUploadMbps: number;
  totalDownloadedMb: number;
  totalUploadedMb: number;
  isConnected: boolean;
}

export const TrafficGraph: React.FC<TrafficGraphProps> = ({
  data,
  currentDownloadMbps,
  currentUploadMbps,
  totalDownloadedMb,
  totalUploadedMb,
  isConnected
}) => {
  const [showChart, setShowChart] = useState(false);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-xl transition-all">
      
      {/* Компактная шапка с показателями скорости */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-sky-400 shrink-0" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Скорость и Трафик
          </h3>
        </div>

        {/* Индикаторы скорости в 1 строчку */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1 text-sky-400 font-bold">
            <ArrowDown className="w-3.5 h-3.5" />
            <span>{isConnected ? currentDownloadMbps.toFixed(1) : '0.0'}</span>
            <span className="text-[10px] font-normal text-slate-500">Мб/с</span>
          </div>

          <div className="flex items-center gap-1 text-emerald-400 font-bold">
            <ArrowUp className="w-3.5 h-3.5" />
            <span>{isConnected ? currentUploadMbps.toFixed(1) : '0.0'}</span>
            <span className="text-[10px] font-normal text-slate-500">Мб/с</span>
          </div>

          <button
            onClick={() => setShowChart(!showChart)}
            className="ml-1 p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-[11px] font-sans cursor-pointer"
            title="График трафика"
          >
            <span className="hidden sm:inline">{showChart ? 'Скрыть' : 'График'}</span>
            {showChart ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Развернутые метрики и график (по клику) */}
      {showChart && (
        <div className="mt-3 pt-3 border-t border-slate-800 space-y-3 animate-fadeIn">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5">
              <div className="text-[10px] text-slate-400 font-semibold mb-0.5">Входящая скорость</div>
              <div className="text-sm font-bold font-mono text-sky-400">
                {isConnected ? currentDownloadMbps.toFixed(1) : '0.0'} <span className="text-[10px] text-slate-500">Mbps</span>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5">
              <div className="text-[10px] text-slate-400 font-semibold mb-0.5">Исходящая скорость</div>
              <div className="text-sm font-bold font-mono text-emerald-400">
                {isConnected ? currentUploadMbps.toFixed(1) : '0.0'} <span className="text-[10px] text-slate-500">Mbps</span>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5">
              <div className="text-[10px] text-slate-400 font-semibold mb-0.5">Получено всего (Rx)</div>
              <div className="text-sm font-bold font-mono text-slate-200">
                {totalDownloadedMb.toFixed(1)} <span className="text-[10px] text-slate-500">MB</span>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5">
              <div className="text-[10px] text-slate-400 font-semibold mb-0.5">Отправлено всего (Tx)</div>
              <div className="text-sm font-bold font-mono text-slate-200">
                {totalUploadedMb.toFixed(1)} <span className="text-[10px] text-slate-500">MB</span>
              </div>
            </div>
          </div>

          <div className="h-32 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="downloadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="uploadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Area type="monotone" dataKey="downloadMbps" name="Download (Mbps)" stroke="#38bdf8" fillOpacity={1} fill="url(#downloadGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="uploadMbps" name="Upload (Mbps)" stroke="#34d399" fillOpacity={1} fill="url(#uploadGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

    </div>
  );
};

