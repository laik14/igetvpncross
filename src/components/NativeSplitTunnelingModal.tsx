import React, { useState } from 'react';
import { X, Split, ShieldCheck, ShieldOff, Check, Search, Smartphone } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Шапка */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <Split className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-bold text-white truncate">
                Раздельное туннелирование (Split Tunneling)
              </h3>
              <p className="text-xs text-slate-400 truncate">
                Маршрутизация приложений через WireGuard
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Сводка и поиск */}
        <div className="p-3.5 sm:p-4 bg-slate-950/60 border-b border-slate-800 space-y-3">
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-between gap-2 text-sky-300 min-w-0">
              <span className="flex items-center gap-1.5 font-medium truncate">
                <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="truncate">Защищено VPN</span>
              </span>
              <span className="font-bold font-mono shrink-0 whitespace-nowrap">{routedCount} прил.</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-2 text-amber-300 min-w-0">
              <span className="flex items-center gap-1.5 font-medium truncate">
                <ShieldOff className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">Прямой трафик</span>
              </span>
              <span className="font-bold font-mono shrink-0 whitespace-nowrap">{bypassedCount} прил.</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
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
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 w-full sm:w-40 shrink-0"
            >
              <option value="all">Все категории</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Список мобильных приложений */}
        <div className="p-3 sm:p-4 flex-1 overflow-y-auto space-y-2 custom-scrollbar">
          {filteredApps.map(app => (
            <div
              key={app.packageName}
              onClick={() => onToggleAppRule(app.packageName)}
              className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all min-w-0 ${
                app.routeViaVpn
                  ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  : 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/30'
              }`}
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <span className="text-2xl shrink-0">{app.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs sm:text-sm font-semibold text-white flex flex-wrap items-center gap-1.5 min-w-0">
                    <span className="truncate max-w-[130px] sm:max-w-[200px]">{app.appName}</span>
                    <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                      {app.category}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 truncate">
                    {app.packageName}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[11px] font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border whitespace-nowrap ${
                  app.routeViaVpn
                    ? 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                }`}>
                  <span className="hidden sm:inline">{app.routeViaVpn ? 'Маршрут через WireGuard' : 'Обход VPN (Прямой)'}</span>
                  <span className="sm:hidden">{app.routeViaVpn ? 'VPN' : 'Прямой'}</span>
                </span>
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                  app.routeViaVpn ? 'bg-sky-500 border-sky-400 text-slate-950' : 'bg-slate-800 border-slate-700'
                }`}>
                  {app.routeViaVpn && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Подвал */}
        <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1.5 text-center sm:text-left">
            <Smartphone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Применяется автоматически в системном туннеле iOS и Android</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-lg shadow-indigo-600/20 shrink-0"
          >
            Сохранить правила
          </button>
        </div>

      </div>
    </div>
  );
};
