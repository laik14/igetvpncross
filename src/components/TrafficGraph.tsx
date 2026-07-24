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
  isLight?: boolean;
}

export const TrafficGraph: React.FC<TrafficGraphProps> = ({
  data,
  currentDownloadMbps,
  currentUploadMbps,
  totalDownloadedMb,
  totalUploadedMb,
  isConnected,
  isLight = false
}) => {
  const [showChart, setShowChart] = useState(false);

  return (
    <div className={`border rounded-2xl p-3 shadow-sm transition-all ${
      isLight
        ? 'bg-white border-slate-200/80 text-slate-800'
        : 'bg-[#11243a]/90 border-slate-800 text-slate-200 shadow-xl'
    }`}>
      
      {/* Компактная шапка с показателями скорости */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-sky-500 shrink-0" />
          <h3 className={`text-xs font-bold uppercase tracking-wider ${
            isLight ? 'text-slate-800' : 'text-slate-200'
          }`}>
            Скорость и Трафик
          </h3>
        </div>

        {/* Индикаторы скорости в 1 строчку */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1 text-sky-500 font-bold">
            <ArrowDown className="w-3.5 h-3.5" />
            <span>{isConnected ? currentDownloadMbps.toFixed(1) : '0.0'}</span>
            <span className={`text-[10px] font-normal ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Мб/с</span>
          </div>

          <div className="flex items-center gap-1 text-emerald-500 font-bold">
            <ArrowUp className="w-3.5 h-3.5" />
            <span>{isConnected ? currentUploadMbps.toFixed(1) : '0.0'}</span>
            <span className={`text-[10px] font-normal ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Мб/с</span>
          </div>

          <button
            onClick={() => setShowChart(!showChart)}
            className={`ml-1 p-1 rounded-lg border transition-colors flex items-center gap-1 text-[11px] font-sans font-semibold cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
            title="График трафика"
          >
            <span className="hidden sm:inline">{showChart ? 'Скрыть' : 'График'}</span>
            {showChart ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Развернутые метрики и график (по клику) */}
      {showChart && (
        <div className={`mt-3 pt-3 border-t space-y-3 animate-fadeIn ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className={`border rounded-xl p-2.5 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0a182b] border-slate-800'}`}>
              <div className={`text-[10px] font-bold mb-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Входящая скорость</div>
              <div className="text-sm font-bold font-mono text-sky-500">
                {isConnected ? currentDownloadMbps.toFixed(1) : '0.0'} <span className="text-[10px] text-slate-400">Mbps</span>
              </div>
            </div>

            <div className={`border rounded-xl p-2.5 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0a182b] border-slate-800'}`}>
              <div className={`text-[10px] font-bold mb-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Исходящая скорость</div>
              <div className="text-sm font-bold font-mono text-emerald-500">
                {isConnected ? currentUploadMbps.toFixed(1) : '0.0'} <span className="text-[10px] text-slate-400">Mbps</span>
              </div>
            </div>

            <div className={`border rounded-xl p-2.5 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0a182b] border-slate-800'}`}>
              <div className={`text-[10px] font-bold mb-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Получено всего (Rx)</div>
              <div className={`text-sm font-bold font-mono ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                {totalDownloadedMb.toFixed(1)} <span className="text-[10px] text-slate-400">MB</span>
              </div>
            </div>

            <div className={`border rounded-xl p-2.5 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0a182b] border-slate-800'}`}>
              <div className={`text-[10px] font-bold mb-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Отправлено всего (Tx)</div>
              <div className={`text-sm font-bold font-mono ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                {totalUploadedMb.toFixed(1)} <span className="text-[10px] text-slate-400">MB</span>
              </div>
            </div>
          </div>

          <div className="h-32 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="downloadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="uploadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke={isLight ? '#94a3b8' : '#475569'} fontSize={10} tickLine={false} />
                <YAxis stroke={isLight ? '#94a3b8' : '#475569'} fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isLight ? '#ffffff' : '#0f172a',
                    borderColor: isLight ? '#cbd5e1' : '#334155',
                    borderRadius: '12px',
                    fontSize: '11px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  labelStyle={{ color: isLight ? '#334155' : '#94a3b8' }}
                />
                <Area type="monotone" dataKey="downloadMbps" name="Download (Mbps)" stroke="#0284c7" fillOpacity={1} fill="url(#downloadGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="uploadMbps" name="Upload (Mbps)" stroke="#10b981" fillOpacity={1} fill="url(#uploadGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

    </div>
  );
};
