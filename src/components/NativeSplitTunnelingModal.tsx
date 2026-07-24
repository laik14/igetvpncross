import React, { useState, useEffect } from 'react';
import { X, Split, ShieldCheck, ShieldOff, Check, Search, Smartphone, Layers } from 'lucide-react';
import { NativeAppRule } from '../types';

interface NativeSplitTunnelingModalProps {
  isOpen: boolean;
  onClose: () => void;
  apps: NativeAppRule[];
  onToggleAppRule: (packageName: string) => void;
}

export const NativeSplitTunnelingModal: React.FC<NativeSplitTunnelingModalProps> = ({
  isOpen,
  onClose,
  apps,
  onToggleAppRule
}) => {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  if (!isOpen) return null;

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.appName.toLowerCase().includes(search.toLowerCase()) || app.packageName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'all' || app.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(apps.map(a => a.category)));

  const routedCount = apps.filter(a => a.routeViaVpn).length;
  const bypassedCount = apps.filter(a => !a.routeViaVpn).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Шапка */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Split className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Управление Раздельным Туннелированием (Split Tunneling)
              </h3>
              <p className="text-xs text-slate-400">
                Выберите, какие приложения отправлять через WireGuard, а какие прямо
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

        {/* Сводка и поиска */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 space-y-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-between text-sky-300">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>Защищено VPN</span>
              </span>
              <span className="font-bold font-mono">{routedCount} прил.</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-amber-300">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldOff className="w-4 h-4 text-amber-400" />
                <span>Прямой провайдер</span>
              </span>
              <span className="font-bold font-mono">{bypassedCount} прил.</span>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Поиск по имени или пакету..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Все категории</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Список мобильных приложений */}
        <div className="p-4 flex-1 overflow-y-auto space-y-2">
          {filteredApps.map(app => (
            <div
              key={app.packageName}
              onClick={() => onToggleAppRule(app.packageName)}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                app.routeViaVpn
                  ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  : 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{app.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-white flex items-center gap-2">
                    <span>{app.appName}</span>
                    <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {app.category}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">
                    {app.packageName}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                  app.routeViaVpn
                    ? 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                }`}>
                  {app.routeViaVpn ? 'Маршрут через WireGuard' : 'Обход VPN (Прямой)'}
                </span>
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                  app.routeViaVpn ? 'bg-sky-500 border-sky-400 text-slate-950' : 'bg-slate-800 border-slate-700'
                }`}>
                  {app.routeViaVpn && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Подвал */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
            <span>Применяется автоматически в нативном VpnService Android и iOS</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-lg shadow-indigo-600/20"
          >
            Сохранить правила
          </button>
        </div>

      </div>
    </div>
  );
};
