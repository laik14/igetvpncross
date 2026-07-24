import React, { useState } from 'react';
import { Globe, Shield, Play, Lock, CheckCircle2, ArrowRight, CornerDownRight, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { WGNode } from '../types';

interface ProxyTesterTabProps {
  selectedNode: WGNode;
}

export const ProxyTesterTab: React.FC<ProxyTesterTabProps> = ({ selectedNode }) => {
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
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Тест проксирования веб-запросов (In-App Web Proxy)
          </h3>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hidden sm:inline-block">
            {selectedNode.flag} {selectedNode.city}
          </span>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-2.5 py-1 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>{isExpanded ? 'Свернуть' : 'Открыть утилиту'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-800 space-y-3 animate-fadeIn">
          <p className="text-xs text-slate-400">
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
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* URL Input Form */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Введит URL (например, https://example.com)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>
            <button
              onClick={() => handleTestProxy()}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-sky-600/20 cursor-pointer"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              <span>Проверить</span>
            </button>
          </div>

          {/* Result Display Area */}
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
              {error}
            </div>
          )}

          {result && (
            <div className="space-y-3 animate-fadeIn">
              <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-2 text-xs">
                  <span className="text-slate-400 font-mono">Выходной нод:</span>
                  <span className="font-bold text-sky-400 flex items-center gap-1">
                    <span>{result.proxiedThrough.nodeName}</span>
                    <span>({result.proxiedThrough.exitIp})</span>
                  </span>
                </div>

                <div className="text-xs text-slate-300 space-y-1 font-mono">
                  <div>Via: {result.headers['via']}</div>
                  <div>Tunnel: {result.headers['x-wireguard-tunnel']}</div>
                  <div>Encrypted Packet Size: {result.proxiedThrough.encryptedBytes} bytes</div>
                </div>
              </div>

              <div
                dangerouslySetInnerHTML={{ __html: result.previewHtml }}
                className="border border-slate-800 rounded-xl overflow-hidden"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

