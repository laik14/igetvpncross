import React from 'react';
import { X, Shield, Lock, Zap, Sliders, Code2, Rocket, Sun, Moon, Sparkles } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onClose: () => void;
  onOpenNativeCode: () => void;
  onOpenGuides: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
  onOpenNativeCode,
  onOpenGuides
}) => {
  const isLight = settings.theme === 'liquid-light';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className={`w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border transition-colors ${
        isLight ? 'bg-white/95 border-slate-200 text-slate-800' : 'bg-slate-900/95 border-slate-800 text-slate-200'
      }`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isLight ? 'bg-slate-100/80 border-slate-200' : 'bg-slate-950/70 border-slate-800'
        }`}>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-sky-500" />
            <h2 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Настройки WireGuard & Нативного Клиента
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 text-xs custom-scrollbar">
          
          {/* Быстрые действия: Исходный код & Выкатка в Прод */}
          <div className={`p-3.5 rounded-xl border space-y-2.5 ${
            isLight ? 'bg-sky-50 border-sky-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <label className={`block font-bold text-xs uppercase tracking-wider ${
              isLight ? 'text-sky-900' : 'text-sky-400'
            }`}>
              Разработка и Релиз приложений
            </label>
            <p className="text-[11px] text-slate-500">
              Исходные файлы Swift/Kotlin и пошаговая инструкция публикации в App Store / Google Play:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenNativeCode();
                }}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
              >
                <Code2 className="w-4 h-4" />
                <span>Исходный код (Swift/Kotlin)</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenGuides();
                }}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-sm"
              >
                <Rocket className="w-4 h-4" />
                <span>Инструкция выкатки в Прод</span>
              </button>
            </div>
          </div>

          {/* Переключение тем Liquid Glass */}
          <div className="space-y-2">
            <label className={`block text-xs font-semibold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
              Тема оформления интерфейса (Liquid Glass)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onUpdateSettings({ ...settings, theme: 'liquid-dark' })}
                className={`p-2.5 rounded-xl border font-semibold text-xs flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  settings.theme === 'liquid-dark'
                    ? 'bg-sky-500/20 border-sky-500 text-sky-400 shadow-md'
                    : isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <Moon className="w-4 h-4 text-sky-400" />
                <span>Liquid Dark</span>
              </button>

              <button
                onClick={() => onUpdateSettings({ ...settings, theme: 'liquid-light' })}
                className={`p-2.5 rounded-xl border font-semibold text-xs flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  settings.theme === 'liquid-light'
                    ? 'bg-sky-500/20 border-sky-500 text-sky-600 shadow-md'
                    : isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Liquid Light</span>
              </button>

              <button
                onClick={() => onUpdateSettings({ ...settings, theme: 'dark' })}
                className={`p-2.5 rounded-xl border font-semibold text-xs flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  settings.theme === 'dark'
                    ? 'bg-sky-500/20 border-sky-500 text-sky-400 shadow-md'
                    : isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Cyber Dark</span>
              </button>
            </div>
          </div>

          {/* Client Device Name */}
          <div className="space-y-1.5">
            <label className={`block text-xs font-semibold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
              Идентификатор устройства / Имя клиента
            </label>
            <input
              type="text"
              value={settings.clientName}
              onChange={(e) => onUpdateSettings({ ...settings, clientName: e.target.value })}
              className={`w-full border rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-sky-500 ${
                isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
              }`}
            />
          </div>

          {/* DNS Server Selection */}
          <div className="space-y-1.5">
            <label className={`block text-xs font-semibold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
              Зашифрованный DNS резолвер
            </label>
            <select
              value={settings.customDns}
              onChange={(e) => onUpdateSettings({ ...settings, customDns: e.target.value })}
              className={`w-full border rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-sky-500 ${
                isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
              }`}
            >
              <option value="1.1.1.1, 1.0.0.1">Cloudflare DNS (1.1.1.1, 1.0.0.1)</option>
              <option value="8.8.8.8, 8.8.4.4">Google Public DNS (8.8.8.8)</option>
              <option value="9.9.9.9, 149.112.112.112">Quad9 No-Log DNS (9.9.9.9)</option>
              <option value="94.140.14.14, 94.140.15.15">AdGuard DNS (Блокировка рекламы)</option>
            </select>
          </div>

          {/* MTU Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className={`text-xs font-semibold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                WireGuard MTU (Размер пакета)
              </label>
              <span className="font-mono text-sky-500 font-bold">{settings.mtu} bytes</span>
            </div>
            <input
              type="range"
              min="1280"
              max="1420"
              step="10"
              value={settings.mtu}
              onChange={(e) => onUpdateSettings({ ...settings, mtu: Number(e.target.value) })}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          {/* Kill Switch Toggle */}
          <div className={`flex items-center justify-between p-3.5 rounded-xl border ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <div>
              <div className={`font-semibold flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <Lock className="w-4 h-4 text-rose-500" />
                <span>Strict Kill Switch</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Блокирует незашифрованный трафик при разрыве туннеля.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ ...settings, killSwitch: !settings.killSwitch })}
              className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center cursor-pointer shrink-0 ${
                settings.killSwitch ? 'bg-rose-500 justify-end' : isLight ? 'bg-slate-300 justify-start' : 'bg-slate-800 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-sm transition-all" />
            </button>
          </div>

          {/* Obfuscation Toggle */}
          <div className={`flex items-center justify-between p-3.5 rounded-xl border ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <div>
              <div className={`font-semibold flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <Shield className="w-4 h-4 text-amber-500" />
                <span>Протокол обфускации AmneziaWG</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Маскирует WireGuard заголовки для обхода блокировок ТСПУ / DPI.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ ...settings, obfuscation: !settings.obfuscation })}
              className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center cursor-pointer shrink-0 ${
                settings.obfuscation ? 'bg-amber-500 justify-end' : isLight ? 'bg-slate-300 justify-start' : 'bg-slate-800 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-sm transition-all" />
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex justify-end ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
        }`}>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-md"
          >
            Сохранить и Применить
          </button>
        </div>

      </div>
    </div>
  );
};
