import React, { useState } from 'react';
import { X, Search, RefreshCw, Check, Shield, Zap, Sparkles, Filter } from 'lucide-react';
import { WGNode } from '../types';

interface NodeSelectorModalProps {
  nodes: WGNode[];
  selectedNode: WGNode;
  onSelectNode: (node: WGNode) => void;
  onClose: () => void;
  onRefreshPings: () => void;
  pinging: boolean;
}

export const NodeSelectorModal: React.FC<NodeSelectorModalProps> = ({
  nodes,
  selectedNode,
  onSelectNode,
  onClose,
  onRefreshPings,
  pinging
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
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-bold text-white">Select WireGuard Server Node</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filters Toolbar */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by country, city, or feature..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterObfuscated(filterObfuscated === true ? null : true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                filterObfuscated === true
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>AmneziaWG / Obfuscated</span>
            </button>

            <button
              onClick={onRefreshPings}
              disabled={pinging}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
              title="Test Latency Ping to all nodes"
            >
              <RefreshCw className={`w-4 h-4 ${pinging ? 'animate-spin text-sky-400' : ''}`} />
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
                  className={`group relative p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-sky-500/10 border-sky-500/50 shadow-lg shadow-sky-500/10'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl leading-none">{node.flag}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                          {node.name}
                        </h4>
                        {node.obfuscated && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Obfuscated
                          </span>
                        )}
                        {node.supportsIPv6 && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                            IPv6
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <span>{node.endpoint}</span>
                        <span>•</span>
                        <span>IP: {node.ip}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Load & Ping */}
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1.5 text-xs font-mono font-semibold">
                        <span className={`w-2 h-2 rounded-full ${node.pingMs < 50 ? 'bg-emerald-400' : node.pingMs < 120 ? 'bg-amber-400' : 'bg-rose-400'}`}></span>
                        <span className="text-emerald-400">{node.pingMs} ms</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Load: {node.loadPercent}%
                      </div>
                    </div>

                    {/* Radio / Selection Indicator */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                      isSelected ? 'bg-sky-500 border-sky-400 text-white' : 'border-slate-700 group-hover:border-slate-500'
                    }`}>
                      {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-500 text-sm">
              No server nodes found matching search filters.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 text-xs text-slate-400 text-center">
          WireGuard servers utilize high-performance Linux kernel tun/tap drivers with ChaCha20-Poly1305 encryption.
        </div>

      </div>
    </div>
  );
};
