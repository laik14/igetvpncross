import React, { useState } from 'react';
import { X, Search, RefreshCw, Check, Shield, Zap } from 'lucide-react';
import { WGNode } from '../types';

interface NodeSelectorModalProps {
  nodes: WGNode[];
  selectedNode: WGNode;
  onSelectNode: (node: WGNode) => void;
  onClose: () => void;
  onRefreshPings: () => void;
  pinging: boolean;
  isLight?: boolean;
}

export const NodeSelectorModal: React.FC<NodeSelectorModalProps> = ({
  nodes,
  selectedNode,
  onSelectNode,
  onClose,
  onRefreshPings,
  pinging,
  isLight = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterObfuscated, setFilterObfuscated] = useState<boolean | null>(null);

  const filteredNodes = nodes.filter(node => {
    const matchesSearch =
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.country.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterObfuscated === null) return matchesSearch;
    return matchesSearch && node.obfuscated === filterObfuscated;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-200'
      }`}>
        
        {/* Modal Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isLight ? 'bg-slate-100/80 border-slate-200' : 'bg-slate-950/50 border-slate-800'
        }`}>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-sky-500" />
            <h2 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Выберите серверный узел WireGuard
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

        {/* Search & Filters Toolbar */}
        <div className={`p-4 border-b flex flex-col sm:flex-row gap-3 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800/80'
        }`}>
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Поиск по названию, IP или локации..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full border rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-sky-500 ${
                isLight ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-slate-950 border-slate-800 text-white placeholder-slate-500'
              }`}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterObfuscated(filterObfuscated === true ? null : true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                filterObfuscated === true
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/40'
                  : isLight ? 'bg-white text-slate-600 border-slate-300' : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>AmneziaWG</span>
            </button>

            <button
              onClick={onRefreshPings}
              disabled={pinging}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isLight ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
              title="Проверить задержку Ping до всех серверов"
            >
              <RefreshCw className={`w-4 h-4 ${pinging ? 'animate-spin text-sky-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Nodes List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1 custom-scrollbar">
          {filteredNodes.length > 0 ? (
            filteredNodes.map(node => {
              const isSelected = selectedNode.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => {
                    onSelectNode(node);
                    onClose();
                  }}
                  className={`group relative p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-sky-500/10 border-sky-500/60 shadow-md'
                      : isLight
                      ? 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl leading-none">{node.flag}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-bold transition-colors ${
                          isLight ? 'text-slate-900 group-hover:text-sky-600' : 'text-white group-hover:text-sky-300'
                        }`}>
                          {node.name}
                        </h4>
                        {node.obfuscated && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                            Obfuscated
                          </span>
                        )}
                      </div>

                      <div className={`flex items-center gap-2 text-xs mt-1 font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        <span>Endpoint: {node.endpoint}</span>
                        <span>•</span>
                        <span>IP: {node.ip}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Load & Ping */}
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold">
                        <span className={`w-2 h-2 rounded-full ${node.pingMs < 50 ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        <span className="text-emerald-500">{node.pingMs} ms</span>
                      </div>
                      <div className={`text-[10px] mt-0.5 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                        Загрузка: {node.loadPercent}%
                      </div>
                    </div>

                    {/* Radio / Selection Indicator */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                      isSelected ? 'bg-sky-500 border-sky-400 text-white' : isLight ? 'border-slate-300' : 'border-slate-700'
                    }`}>
                      {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-500 text-sm">
              Серверы не найдены по текущему запросу.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-3 border-t text-xs text-center ${
          isLight ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-slate-950 border-slate-800 text-slate-400'
        }`}>
          Шифрование туннеля ChaCha20-Poly1305 в ядрах ОС Linux/Android/iOS.
        </div>

      </div>
    </div>
  );
};
