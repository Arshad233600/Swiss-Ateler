
import React, { useState, useMemo, useEffect } from 'react';
import { PRODUCTS } from '../constants';
import { useApp } from '../store/context';
import { Product } from '../types';
import { GoogleGenAI } from "@google/genai";
import { performGlobalDesignAudit } from '../services/gemini';

type SortConfig = { key: keyof Product | 'valuation'; direction: 'asc' | 'desc' } | null;

const AdminProducts: React.FC = () => {
  const { language } = useApp();
  const [isAuditing, setIsAuditing] = useState(false);
  const [isRepairing, setIsRepairing] = useState(false);
  const [auditReport, setAuditReport] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'id', direction: 'asc' });
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      setIsScanning(true);
      const timer = setTimeout(() => setIsScanning(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  const processedProducts = useMemo(() => {
    let result = PRODUCTS.filter(p => {
      const matchesSearch = p.name[language].toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCat;
    });

    if (sortConfig) {
      result.sort((a, b) => {
        let valA: any = sortConfig.key === 'valuation' ? a.price : (a[sortConfig.key as keyof Product] || '');
        if (typeof valA === 'object') valA = valA[language] || '';
        let valB: any = sortConfig.key === 'valuation' ? b.price : (b[sortConfig.key as keyof Product] || '');
        if (typeof valB === 'object') valB = valB[language] || '';
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [searchQuery, selectedCategory, sortConfig, language]);

  const toggleSort = (key: keyof Product | 'valuation') => {
    setSortConfig(prev => (prev?.key === key ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'asc' }));
  };

  const runNeuralAudit = async () => {
    setIsAuditing(true);
    setAuditReport(null);
    const result = await performGlobalDesignAudit("Admin_Inventory_Nexus");
    setAuditReport(result);
    setIsAuditing(false);
  };

  const executeNeuralRepair = () => {
    setIsRepairing(true);
    // Simulate high-level systemic repair cycle
    setTimeout(() => {
      setIsRepairing(false);
      setAuditReport((prev: any) => ({ ...prev, status: "OPTIMAL", driftPoints: [] }));
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white pt-24 pb-48 px-10 selection:bg-[#D90429] reveal-view">
      <div className="max-w-screen-2xl mx-auto space-y-24">
        
        {/* SYSTEM STATUS HEADER */}
        <div className="flex justify-between items-center text-[8px] font-mono tracking-[0.8em] text-zinc-700 uppercase border-b border-white/5 pb-6">
           <div className="flex items-center gap-6">
              <span className="w-2.5 h-2.5 bg-[#D90429] rounded-sm shadow-[0_0_12px_#D90429]"></span>
              <span>ENGINEER: ABDULLAH ARSHAD // STATUS: SECURE</span>
           </div>
           <div className="flex gap-16">
              <span className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${isScanning || isRepairing ? 'bg-[#D90429] animate-ping' : 'bg-green-500'}`}></div> {isRepairing ? 'REPAIRING_NODES' : isScanning ? 'SCANNING_ARCHIVE' : 'STABLE_LINK'}</span>
              <span>ZURICH_HQ: ONLINE</span>
           </div>
        </div>

        {/* ULTRA-ENGINEERED SEARCH HUD */}
        <div className="relative group">
           <div className="absolute -top-16 left-0 flex items-center gap-10">
              <div className="relative w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center font-black text-2xl text-[#D90429] italic">
                 AA
                 <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#D90429]"></div>
              </div>
              <div className="flex flex-col gap-1">
                 <span className="text-[11px] font-black tracking-tighter uppercase italic text-white">Abdullah Arshad Archive Protocol</span>
                 <span className="text-[8px] font-mono tracking-[0.6em] text-zinc-600 uppercase">Master_Control_v13</span>
              </div>
           </div>

           <div className="relative mt-4">
              <div className="absolute -top-4 -left-4 w-10 h-10 border-t-2 border-l-2 border-[#D90429]/40"></div>
              <div className="absolute -bottom-4 -right-4 w-10 h-10 border-b-2 border-r-2 border-[#D90429]/40"></div>
              
              <div className="relative overflow-hidden bg-white/5 backdrop-blur-3xl border border-white/10">
                 <input 
                   type="text" 
                   placeholder="ARCHIVE_QUERY_INPUT..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full bg-transparent px-24 py-12 text-5xl md:text-8xl font-black uppercase italic tracking-tighter outline-none focus:text-[#D90429] transition-all placeholder:text-zinc-900"
                 />
                 {(isScanning || isRepairing) && <div className="absolute inset-y-0 w-1 bg-[#D90429] shadow-[0_0_30px_#D90429] animate-[scan_1.5s_ease-in-out_infinite] z-20"></div>}
              </div>
           </div>
        </div>

        {/* ANALYTICS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1">
          {[
            { label: 'GROSS_ARCHIVE_VALUE', val: 'CHF 14.8M' },
            { label: 'ACTIVE_UNITS', val: PRODUCTS.length },
            { label: 'DEMAND_STABILITY', val: '99.1%' },
            { label: 'ENGINEER_DIRECTIVE', val: 'OPTIMAL' }
          ].map((m, i) => (
            <div key={i} className="bg-white/5 border border-white/5 p-12 hover:bg-white/10 transition-all group relative overflow-hidden">
               <div className="absolute -bottom-6 -right-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <span className="text-9xl font-black italic tracking-tighter">0{i+1}</span>
               </div>
               <p className="text-[9px] font-black text-zinc-600 tracking-[0.6em] uppercase mb-6 group-hover:text-zinc-400">{m.label}</p>
               <p className="text-5xl font-black italic tracking-tighter group-hover:text-[#D90429] transition-colors">{m.val}</p>
            </div>
          ))}
        </div>

        {/* DATA ARCHIVE TABLE */}
        <div className="bg-[#050506] border border-white/5 overflow-hidden relative">
          <div className="hud-bracket hud-bracket-tr"></div>
          <div className="p-12 border-b border-white/5 flex flex-wrap justify-between items-center gap-12">
             <div className="flex gap-12">
                {['All', 'Men', 'Women', 'Accessories'].map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)} className={`text-[10px] font-black uppercase tracking-[0.6em] transition-all relative py-3 ${selectedCategory === cat ? 'text-[#D90429]' : 'text-zinc-600 hover:text-white'}`}>
                    {cat}
                    {selectedCategory === cat && <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#D90429]"></div>}
                  </button>
                ))}
             </div>
             <div className="flex gap-4">
                <button onClick={runNeuralAudit} disabled={isAuditing} className="bg-white/5 text-white border border-white/10 px-8 py-4 text-[11px] font-black uppercase tracking-[0.8em] hover:bg-white hover:text-black transition-all disabled:opacity-20">{isAuditing ? 'CALIBRATING...' : 'SCAN_NEURAL_LINK'}</button>
                <button onClick={executeNeuralRepair} disabled={isRepairing || auditReport?.status !== 'DRIFT'} className="bg-[#D90429] text-white px-8 py-4 text-[11px] font-black uppercase tracking-[0.8em] hover:bg-white hover:text-black transition-all disabled:opacity-20">{isRepairing ? 'REPAIRING_NODES' : 'EXECUTE_REPAIR'}</button>
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-950/50 border-b border-white/5">
                  <th className="p-10 w-12"><input type="checkbox" className="accent-[#D90429]" /></th>
                  <th onClick={() => toggleSort('id')} className="p-10 text-[10px] font-black uppercase tracking-widest text-zinc-500 cursor-pointer hover:text-white">TAG_ID</th>
                  <th onClick={() => toggleSort('name')} className="p-10 text-[10px] font-black uppercase tracking-widest text-zinc-500 cursor-pointer hover:text-white">DESCRIPTION</th>
                  <th onClick={() => toggleSort('valuation')} className="p-10 text-[10px] font-black uppercase tracking-widest text-zinc-500 cursor-pointer hover:text-white text-right">VALUATION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {processedProducts.map(p => (
                  <tr key={p.id} className="hover:bg-white/[0.03] transition-all group">
                    <td className="p-10"><input type="checkbox" className="accent-[#D90429]" /></td>
                    <td className="p-10 font-mono text-[11px] text-zinc-600">#{p.id.toUpperCase()}</td>
                    <td className="p-10">
                      <div className="flex items-center gap-10">
                        <div className="w-16 h-20 bg-zinc-900 overflow-hidden border border-white/5 p-1">
                           <img src={p.images[0]} className="w-full h-full object-cover saturate-0 group-hover:saturate-100 transition-all duration-[2s]" />
                        </div>
                        <span className="text-2xl font-black italic tracking-tighter uppercase group-hover:text-[#D90429] transition-colors">{p.name[language]}</span>
                      </div>
                    </td>
                    <td className="p-10 text-3xl font-thin italic text-right">CHF {p.price.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {auditReport && (
          <div className={`p-12 bg-white/5 border border-white/10 space-y-8 animate-in fade-in duration-700 relative overflow-hidden`}>
             <div className={`absolute top-0 right-0 px-6 py-2 lab-tag ${auditReport.status === 'OPTIMAL' ? 'bg-emerald-500 text-white' : 'bg-[#D90429] text-white'}`}>
                {auditReport.status}
             </div>
             <h3 className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Arshad_Neural_Audit_Results</h3>
             {auditReport.driftPoints?.length > 0 ? (
               <ul className="space-y-4 pt-4 border-t border-white/5">
                 {auditReport.driftPoints.map((dp: string, idx: number) => (
                   <li key={idx} className="text-lg font-light italic text-zinc-400 uppercase flex gap-4">
                     <span className="text-[#D90429]">[-]</span> {dp}
                   </li>
                 ))}
               </ul>
             ) : (
               <p className="text-xl font-light italic text-emerald-400 uppercase tracking-tight">"SYSTEMIC_INTEGRITY_STABLE. NO_DRIFT_DETECTED."</p>
             )}
             <div className="pt-8 border-t border-white/5">
                <p className="lab-tag text-zinc-600 mb-2">ENGINEER_DIRECTIVE:</p>
                <p className="text-xl font-bold italic text-white uppercase">{auditReport.repairDirective}</p>
             </div>
          </div>
        )}
      </div>
      <style>{`@keyframes scan { 0% { transform: translateX(-100vw); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateX(100vw); opacity: 0; } }`}</style>
    </div>
  );
};

export default AdminProducts;
