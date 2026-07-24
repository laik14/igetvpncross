import React, { useState, useEffect } from 'react';
import { X, Copy, Download, QrCode, Check, Lock, Smartphone, FileText, ExternalLink, RefreshCw, ChevronDown } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] min-w-0">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-slate-800 bg-slate-950/60 gap-3 min-w-0">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <Lock className="w-5 h-5 text-sky-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <h2 className="text-sm sm:text-base font-bold text-white truncate">Конфигурация WireGuard</h2>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                Сервер: {selectedNode.name} ({selectedNode.flag} {selectedNode.country})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 p-1.5 sm:p-2 gap-1 sm:gap-2 min-w-0 overflow-x-hidden w-full">
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2 px-1.5 sm:px-3 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer min-w-0 ${
              activeTab === 'qr' ? 'bg-sky-500 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">QR-код</span>
          </button>

          <button
            onClick={() => setActiveTab('conf')}
            className={`flex-1 py-2 px-1.5 sm:px-3 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer min-w-0 ${
              activeTab === 'conf' ? 'bg-sky-500 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">.conf файл</span>
          </button>

          <button
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-2 px-1.5 sm:px-3 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer min-w-0 ${
              activeTab === 'ios' ? 'bg-sky-500 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">iOS профиль</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="p-3 sm:p-6 overflow-y-auto overflow-x-hidden flex-1 flex flex-col items-center justify-center min-w-0 w-full">
          {loading ? (
            <div className="py-12 flex flex-col items-center gap-3">
              <RefreshCw className="w-8 h-8 text-sky-400 animate-spin" />
              <span className="text-sm text-slate-400">Генерация ключей WireGuard...</span>
            </div>
          ) : (
            <>
              {activeTab === 'qr' && (
                <div className="flex flex-col items-center text-center w-full max-w-full min-w-0">
                  <div className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-2xl mb-3 border-4 border-slate-800 shrink-0">
                    {qrCodeDataUrl ? (
                      <img src={qrCodeDataUrl} alt="WireGuard QR Code" className="w-48 h-48 sm:w-60 sm:h-60 object-contain max-w-full" />
                    ) : (
                      <div className="w-48 h-48 sm:w-60 sm:h-60 bg-slate-200 flex items-center justify-center text-slate-500 text-xs">
                        Ошибка QR
                      </div>
                    )}
                  </div>

                  <details className="group w-full max-w-md my-2 bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden text-left">
                    <summary className="p-3 cursor-pointer text-xs font-semibold text-sky-400 flex items-center justify-between hover:bg-slate-900 select-none list-none gap-2">
                      <span className="truncate">Инструкция по сканированию QR-кода</span>
                      <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180 text-slate-400 shrink-0" />
                    </summary>
                    <div className="p-3 pt-2 text-xs text-slate-300 border-t border-slate-800/60">
                      Откройте официальное приложение WireGuard на устройстве, нажмите <strong className="text-sky-400">+ Добавить туннель</strong>, затем выберите <strong className="text-sky-400">Сканировать QR-код</strong> и наведите камеру на экран.
                    </div>
                  </details>

                  {configData?.wireguardDeepLink && (
                    <a
                      href={configData.wireguardDeepLink}
                      className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-semibold border border-slate-700 transition-all cursor-pointer mt-1 max-w-full min-w-0"
                    >
                      <ExternalLink className="w-4 h-4 shrink-0" />
                      <span className="truncate">Открыть в приложении WireGuard</span>
                    </a>
                  )}
                </div>
              )}

              {activeTab === 'conf' && (
                <div className="w-full flex flex-col gap-3 min-w-0">
                  <details className="group bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden text-left">
                    <summary className="p-3 cursor-pointer text-xs font-semibold text-sky-400 flex items-center justify-between hover:bg-slate-900 select-none list-none gap-2">
                      <span className="truncate">Инструкция по импорту .conf файла</span>
                      <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180 text-slate-400 shrink-0" />
                    </summary>
                    <div className="p-3 pt-2 text-xs text-slate-300 border-t border-slate-800/60">
                      Скачайте файл <code>{configData?.filename}</code> или скопируйте текст конфигурации. В клиенте WireGuard нажмите <strong className="text-sky-400">Импорт из файла</strong> и выберите сохраненный файл.
                    </div>
                  </details>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
                    <span className="text-xs text-slate-400 font-mono truncate min-w-0 max-w-full">
                      {configData?.filename}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={handleCopyConf}
                        className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                        <span>{copied ? 'Скопировано!' : 'Копировать'}</span>
                      </button>
                      <button
                        onClick={handleDownloadConf}
                        className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <Download className="w-3.5 h-3.5 shrink-0" />
                        <span>Скачать .conf</span>
                      </button>
                    </div>
                  </div>

                  <pre className="bg-slate-950 border border-slate-800 p-3 sm:p-4 rounded-xl text-[11px] sm:text-xs font-mono text-slate-300 max-h-64 overflow-y-auto overflow-x-hidden custom-scrollbar w-full max-w-full whitespace-pre-wrap break-all">
                    {configData?.confContent}
                  </pre>
                </div>
              )}

              {activeTab === 'ios' && (
                <div className="flex flex-col items-center text-center max-w-md py-2 sm:py-4 w-full min-w-0">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-2 sm:mb-3 shrink-0">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white mb-1.5 truncate max-w-full">iOS / iPadOS Профиль 1-Click</h3>
                  
                  <details className="group w-full my-2 sm:my-3 bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden text-left">
                    <summary className="p-3 cursor-pointer text-xs font-semibold text-sky-400 flex items-center justify-between hover:bg-slate-900 select-none list-none gap-2">
                      <span className="truncate">Инструкция по установке .mobileconfig</span>
                      <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180 text-slate-400 shrink-0" />
                    </summary>
                    <div className="p-3 pt-2 text-xs text-slate-300 border-t border-slate-800/60">
                      1. Нажмите <strong className="text-sky-400">Скачать .mobileconfig Профиль</strong>.<br />
                      2. Откройте <strong className="text-sky-400">Настройки iPhone &gt; Профиль загружен</strong>.<br />
                      3. Нажмите <strong className="text-sky-400">Установить</strong> и подтвердите паролем устройства.
                    </div>
                  </details>

                  <button
                    onClick={handleDownloadMobileConfig}
                    className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 cursor-pointer"
                  >
                    <Download className="w-4 h-4 shrink-0" />
                    <span>Скачать .mobileconfig Профиль</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400 gap-2 min-w-0">
          <span className="truncate">IP клиента: <strong className="text-slate-200 font-mono">{configData?.keys?.clientIPv4 || '10.66.0.x'}</strong></span>
          <button
            onClick={generateConfig}
            className="text-sky-400 hover:underline cursor-pointer shrink-0"
          >
            Пересоздать ключи
          </button>
        </div>

      </div>
    </div>
  );
};
