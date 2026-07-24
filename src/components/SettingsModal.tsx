import React from 'react';
import { X, Settings, Shield, Cpu, RefreshCw, Lock, Zap, Sliders } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-bold text-white">WireGuard & PWA Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs text-slate-300 custom-scrollbar">
          
          {/* Client Device Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-200">
              Device Identifier / Client Name
            </label>
            <input
              type="text"
              value={settings.clientName}
              onChange={(e) => onUpdateSettings({ ...settings, clientName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
            />
            <p className="text-[11px] text-slate-500">
              Used inside <code>[Interface]</code> metadata of exported .conf files.
            </p>
          </div>

          {/* DNS Server Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-200">
              Encrypted DNS Resolver
            </label>
            <select
              value={settings.customDns}
              onChange={(e) => onUpdateSettings({ ...settings, customDns: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
            >
              <option value="1.1.1.1, 1.0.0.1">Cloudflare DNS (1.1.1.1, 1.0.0.1)</option>
              <option value="8.8.8.8, 8.8.4.4">Google Public DNS (8.8.8.8)</option>
              <option value="9.9.9.9, 149.112.112.112">Quad9 No-Log DNS (9.9.9.9)</option>
              <option value="94.140.14.14, 94.140.15.15">AdGuard DNS (Block Ads & Trackers)</option>
            </select>
          </div>

          {/* MTU Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200">
                WireGuard MTU (Maximum Transmission Unit)
              </label>
              <span className="font-mono text-sky-400 font-bold">{settings.mtu} bytes</span>
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
            <p className="text-[11px] text-slate-500">
              Default 1420 for Wi-Fi/Ethernet. Lower to 1360 or 1280 if mobile LTE packets fragment.
            </p>
          </div>

          {/* Kill Switch Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <div className="font-semibold text-white flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-rose-400" />
                <span>Strict Kill Switch</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Blocks unencrypted web requests if the WireGuard tunnel drops.
              </p>
            </div>
            <button
              onClick={() => onUpdateSettings({ ...settings, killSwitch: !settings.killSwitch })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                settings.killSwitch ? 'bg-rose-500' : 'bg-slate-800'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                settings.killSwitch ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Obfuscation Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <div className="font-semibold text-white flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>AmneziaWG Obfuscation Protocol</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Applies random packet headers to bypass strict ISP / DPI firewalls.
              </p>
            </div>
            <button
              onClick={() => onUpdateSettings({ ...settings, obfuscation: !settings.obfuscation })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                settings.obfuscation ? 'bg-amber-500' : 'bg-slate-800'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                settings.obfuscation ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* PWA Background Sync */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <div className="font-semibold text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>PWA Service Worker Keep-Alive</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Performs background health pings via Service Worker in browser background tab.
              </p>
            </div>
            <button
              onClick={() => onUpdateSettings({ ...settings, pwaBackgroundSync: !settings.pwaBackgroundSync })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                settings.pwaBackgroundSync ? 'bg-emerald-500' : 'bg-slate-800'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                settings.pwaBackgroundSync ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Save & Apply
          </button>
        </div>

      </div>
    </div>
  );
};
