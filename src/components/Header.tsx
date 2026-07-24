import React from 'react';
import { ShieldCheck, Smartphone, Settings, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  platform: 'ios' | 'android' | 'desktop';
  onOpenSettings: () => void;
  isNativeConnected: boolean;
  theme: 'liquid-dark' | 'liquid-light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  platform,
  onOpenSettings,
  isNativeConnected,
  theme,
  onToggleTheme
}) => {
  const isLight = theme === 'liquid-light';

  return (
    <header className={`w-full sticky top-0 z-40 px-3 sm:px-6 py-2.5 overflow-hidden transition-colors border-b ${
      isLight
        ? 'bg-white/80 backdrop-blur-xl border-slate-200/80 shadow-sm text-slate-900'
        : 'bg-[#091627]/90 backdrop-blur-xl border-slate-800/80 text-white'
    }`}>
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 min-w-0">
        
        {/* Логотип и Название в стиле iGet */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
          <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-blue-600 p-[1px] shadow-md shadow-sky-500/15 shrink-0">
            <div className={`w-full h-full rounded-[11px] flex items-center justify-center ${
              isLight ? 'bg-slate-100' : 'bg-slate-950'
            }`}>
              <ShieldCheck className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${isNativeConnected ? 'text-emerald-500' : 'text-sky-500'}`} />
            </div>
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              {isNativeConnected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isNativeConnected ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <h1 className={`text-sm sm:text-lg font-black tracking-tight truncate flex items-center gap-1.5 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                WireGuard <span className="text-sky-500 font-extrabold hidden xs:inline">Native</span>
              </h1>
              
              {/* Компактный бейдж WG */}
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border tracking-wider transition-colors shrink-0 ${
                isLight
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                PRO
              </span>
            </div>

            <p className={`text-[10px] sm:text-[11px] font-medium items-center gap-1 hidden sm:flex truncate ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}>
              <Smartphone className="w-3 h-3 text-slate-400 shrink-0" />
              <span>
                {platform === 'ios' ? 'iOS NetworkExtension Tunnel' : platform === 'android' ? 'Android VpnService Engine' : 'Cross-Platform Client'}
              </span>
            </p>
          </div>
        </div>

        {/* Справа: Пилл-переключатель тем (Солнце / Луна как на скрине) + Настройки */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Сдвоенный переключатель темы ☀️ 🌙 из скриншота */}
          <div className={`p-1 rounded-full border flex items-center gap-1 transition-colors ${
            isLight ? 'bg-slate-200/80 border-slate-300' : 'bg-[#11243a] border-slate-700/80'
          }`}>
            <button
              onClick={() => isLight && onToggleTheme()}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                !isLight ? 'bg-sky-600 text-white shadow-sm scale-105' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Тёмная тема"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => !isLight && onToggleTheme()}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                isLight ? 'bg-white text-amber-500 shadow-sm scale-105' : 'text-slate-400 hover:text-white'
              }`}
              title="Светлая тема"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Настройки */}
          <button
            onClick={onOpenSettings}
            className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 active:scale-95 ${
              isLight
                ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-sm'
                : 'bg-[#11243a] hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700'
            }`}
            title="Настройки параметров туннеля"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
