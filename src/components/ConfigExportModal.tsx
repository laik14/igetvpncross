import React, { useState, useEffect } from 'react';
import { X, Copy, Download, QrCode, Check, Lock, Smartphone, FileText, ExternalLink, RefreshCw } from 'lucide-react';
import QRCode from 'qrcode';
import { WGNode } from '../types';

interface ConfigExportModalProps {
  selectedNode: WGNode;
  onClose: () => void;
  clientName: string;
}

export const ConfigExportModal: React.FC<ConfigExportModalProps> = ({
  selectedNode,
  onClose,
  clientName
}) => {
  const [loading, setLoading] = useState(true);
  const [configData, setConfigData] = useState<any>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'qr' | 'conf' | 'ios'>('qr');

  useEffect(() => {
    generateConfig();
  }, [selectedNode, clientName]);

  const generateConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/wireguard/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodeId: selectedNode.id,
          clientName: clientName || 'PWA Mobile Client'
        })
      });
      const data = await res.json();
      if (data.success) {
        setConfigData(data);
        // Generate QR code data URL from config string
        const qrUrl = await QRCode.toDataURL(data.confContent, {
          width: 320,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff'
          }
        });
        setQrCodeDataUrl(qrUrl);
      }
    } catch (err) {
      console.error('Config generation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyConf = () => {
    if (!configData) return;
    navigator.clipboard.writeText(configData.confContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadConf = () => {
    if (!configData) return;
    const blob = new Blob([configData.confContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = configData.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadMobileConfig = () => {
    window.open(`/api/wireguard/mobileconfig?nodeId=${selectedNode.id}&clientName=${encodeURIComponent(clientName)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-sky-400" />
            <div>
              <h2 className="text-base font-bold text-white">WireGuard Configuration & QR Import</h2>
              <p className="text-xs text-slate-400">
                Server: {selectedNode.name} ({selectedNode.flag} {selectedNode.country})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 p-2 gap-2">
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'qr' ? 'bg-sky-500 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>QR Code Import</span>
          </button>

          <button
            onClick={() => setActiveTab('conf')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'conf' ? 'bg-sky-500 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>.conf Text File</span>
          </button>

          <button
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'ios' ? 'bg-sky-500 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>iOS MobileConfig</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center">
          {loading ? (
            <div className="py-12 flex flex-col items-center gap-3">
              <RefreshCw className="w-8 h-8 text-sky-400 animate-spin" />
              <span className="text-sm text-slate-400">Generating cryptographic keypair...</span>
            </div>
          ) : (
            <>
              {activeTab === 'qr' && (
                <div className="flex flex-col items-center text-center">
                  <p className="text-xs text-slate-300 max-w-md mb-4">
                    Open official WireGuard app on iOS or Android, tap <strong className="text-sky-400">+ Add Tunnel</strong>, then select <strong className="text-sky-400">Scan from QR Code</strong>.
                  </p>
                  
                  <div className="bg-white p-3 rounded-2xl shadow-2xl mb-4 border-4 border-slate-800">
                    {qrCodeDataUrl ? (
                      <img src={qrCodeDataUrl} alt="WireGuard QR Code" className="w-64 h-64" />
                    ) : (
                      <div className="w-64 h-64 bg-slate-200 flex items-center justify-center text-slate-500 text-xs">
                        QR Code error
                      </div>
                    )}
                  </div>

                  {configData?.wireguardDeepLink && (
                    <a
                      href={configData.wireguardDeepLink}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open Directly in WireGuard App</span>
                    </a>
                  )}
                </div>
              )}

              {activeTab === 'conf' && (
                <div className="w-full flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono">
                      {configData?.filename}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyConf}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied!' : 'Copy'}</span>
                      </button>
                      <button
                        onClick={handleDownloadConf}
                        className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download .conf</span>
                      </button>
                    </div>
                  </div>

                  <pre className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs font-mono text-slate-300 overflow-x-auto max-h-72 custom-scrollbar">
                    {configData?.confContent}
                  </pre>
                </div>
              )}

              {activeTab === 'ios' && (
                <div className="flex flex-col items-center text-center max-w-md py-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-3">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">iOS / iPadOS 1-Click Profile</h3>
                  <p className="text-xs text-slate-300 mb-6">
                    Download Apple MobileConfig profile. Open iOS Settings &gt; Profile Downloaded &gt; Install to add WireGuard VPN natively to Apple Settings.
                  </p>

                  <button
                    onClick={handleDownloadMobileConfig}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download .mobileconfig Profile</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Client IP: <strong className="text-slate-200">{configData?.keys?.clientIPv4 || '10.66.0.x'}</strong></span>
          <button
            onClick={generateConfig}
            className="text-sky-400 hover:underline cursor-pointer"
          >
            Re-generate Keys
          </button>
        </div>

      </div>
    </div>
  );
};
