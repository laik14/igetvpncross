import React from 'react';
import { ShieldCheck, Smartphone, Settings, Code2, Rocket } from 'lucide-react';

interface HeaderProps {
  platform: 'ios' | 'android' | 'desktop';
  onOpenGuides: () => void;
  onOpenSettings: () => void;
  onOpenNativeCode: () => void;
  isNativeConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  platform,
  onOpenGuides,
  onOpenSettings,
  onOpenNativeCode,
  isNativeConnected
}) => {
  return (
    <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40 px-3 sm:px-6 py-2.5 overflow-hidden">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 min-w-0">
        
        {/* Логотип и Название */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
          <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-blue-600 p-[1px] shadow-md shadow-sky-500/15 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <ShieldCheck className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${isNativeConnected ? 'text-emerald-400' : 'text-sky-400'}`} />
            </div>
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              {isNativeConnected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isNativeConnected ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <h1 className="text-xs sm:text-base font-bold text-white tracking-tight truncate flex items-center gap-1">
                WireGuard <span className="text-sky-400 font-semibold hidden xs:inline">Native</span>
              </h1>
              
              {/* Компактный статус подключения */}
              <span className={`text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full border transition-colors shrink-0 ${
                isNativeConnected
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {isNativeConnected ? 'Защищено' : 'Готов'}
              </span>
            </div>

            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium items-center gap-1 hidden sm:flex truncate">
              <Smartphone className="w-3 h-3 text-slate-400 shrink-0" />
              <span>
                {platform === 'ios' ? 'iOS Tunnel' : platform === 'android' ? 'Android VpnService' : 'Cross-Platform App'}
              </span>
            </p>
          </div>
        </div>

        {/* Действия в шапке */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Исходники */}
          <button
            onClick={onOpenNativeCode}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-semibold rounded-xl bg-sky-500/10 text-sky-300 border border-sky-500/20 hover:bg-sky-500/20 hover:border-sky-500/40 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            title="Исходный код Swift/Kotlin для Android Studio и Xcode"
          >
            <Code2 className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="hidden sm:inline">Исходники</span>
          </button>

          {/* Инструкция выкатки */}
          <button
            onClick={onOpenGuides}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            title="Инструкция выкатки в Google Play & App Store"
          >
            <Rocket className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="hidden md:inline">Выкатка в Прод</span>
            <span className="hidden sm:inline md:hidden">Релиз</span>
          </button>

          {/* Настройки */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 active:scale-95 transition-all cursor-pointer shrink-0"
            title="Настройки параметров туннеля"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};


