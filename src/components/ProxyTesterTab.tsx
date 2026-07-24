import React, { useState } from 'react';
import { Globe, Shield, Play, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { WGNode } from '../types';

interface ProxyTesterTabProps {
  selectedNode: WGNode;
  isLight?: boolean;
}

export const ProxyTesterTab: React.FC<ProxyTesterTabProps> = ({ selectedNode, isLight = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [url, setUrl] = useState('https://checkip.amazonaws.com');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const presets = [
    { label: 'Check IP', url: 'https://checkip.amazonaws.com' },
    { label: 'Geo Location', url: 'https://ipinfo.io/json' },
    { label: 'Wikipedia', url: 'https://en.wikipedia.org' },
    { label: 'Google Health', url: 'https://www.google.com' }
  ];

  const handleTestProxy = async (targetUrl = url) => {
    if (!targetUrl) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/proxy/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: targetUrl,
          nodeId: selectedNode.id
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to route traffic via WireGuard proxy node');
      }
    } catch (err: any) {
      setError('Proxy error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`border rounded-2xl p-3 sm:p-4 shadow-sm transition-all ${
      isLight
        ? 'bg-white border-slate-200/80 text-slate-800'
        : 'bg-[#11243a]/90 border-slate-800 text-slate-200 shadow-xl'
    }`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-sky-500" />
          <h3 className={`text-xs font-bold uppercase tracking-wider ${
            isLight ? 'text-slate-800' : 'text-slate-200'
          }`}>
            Тест проксирования веб-запросов (In-App Proxy)
          </h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hidden sm:inline-block">
            {selectedNode.flag} {selectedNode.city}
          </span>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1 cursor-pointer ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
              : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
          }`}
        >
          <span>{isExpanded ? 'Свернуть' : 'Открыть утилиту'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className={`mt-3 pt-3 border-t space-y-3 animate-fadeIn ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
          <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Проверьте маршрутизацию и маскировку выходящего IP-адреса непосредственно из приложения до системного подключения.
          </p>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setUrl(preset.url);
                  handleTestProxy(preset.url);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* URL Input Form */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Введите URL (например, https://example.com)"
                className={`w-full border rounded-xl pl-9 pr-3 py-2 text-xs font-mono focus:outline-none focus:border-sky-500 ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                }`}
              />
            </div>
            <button
              onClick={() => handleTestProxy()}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              <span>Проверить</span>
            </button>
          </div>

          {/* Result Display Area */}
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-600 dark:text-rose-300 text-xs">
              {error}
            </div>
          )}

          {result && (
            <div className="space-y-3 animate-fadeIn">
              <div className={`border p-3.5 rounded-xl ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}>
                <div className={`flex items-center justify-between border-b pb-2 mb-2 text-xs ${
                  isLight ? 'border-slate-200' : 'border-slate-900'
                }`}>
                  <span className={`${isLight ? 'text-slate-500' : 'text-slate-400'} font-mono`}>Выходной нод:</span>
                  <span className="font-bold text-sky-500 flex items-center gap-1">
                    <span>{result.proxiedThrough.nodeName}</span>
                    <span>({result.proxiedThrough.exitIp})</span>
                  </span>
                </div>

                <div className={`text-xs space-y-1 font-mono ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  <div>Via: {result.headers['via']}</div>
                  <div>Tunnel: {result.headers['x-wireguard-tunnel']}</div>
                  <div>Encrypted Packet Size: {result.proxiedThrough.encryptedBytes} bytes</div>
                </div>
              </div>

              <div
                dangerouslySetInnerHTML={{ __html: result.previewHtml }}
                className={`border rounded-xl overflow-hidden ${isLight ? 'border-slate-200' : 'border-slate-800'}`}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
