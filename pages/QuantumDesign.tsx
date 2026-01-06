
import React, { useState, useEffect, useRef } from 'react';
import { generateQuantumCouture, runStrategicInnovation } from '../services/gemini';
import { useApp } from '../store/context';

const QuantumDesign = () => {
  const { language } = useApp();
  const [inspiration, setInspiration] = useState('');
  const [concept, setConcept] = useState<any>(null);
  const [innovation, setInnovation] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAutonomous, setIsAutonomous] = useState(false);
  const [isDeepReasoning, setIsDeepReasoning] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const autonomousTimer = useRef<any>(null);

  const PROTOCOL_ID = "SA-QUANTUM-SYS-V16_STABLE"; 

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString('de-CH', { hour12: false });
    setLogs(prev => [`[${timestamp}] ${msg}`, ...prev.slice(0, 15)]);
  };

  const handleOpenKeySelection = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      return true;
    }
    return false;
  };

  const handleGenerate = async (vibeOverride?: string) => {
    const vibeToUse = vibeOverride || inspiration;
    
    const hasKey = (window as any).aistudio?.hasSelectedApiKey ? await (window as any).aistudio.hasSelectedApiKey() : true;
    if (!hasKey) {
      const triggered = await handleOpenKeySelection();
      if (!triggered) {
        addLog("ERROR: API_KEY_SELECTION_REQUIRED");
        return;
      }
    }

    setIsGenerating(true);
    addLog(`INIT_REASONING_CHAIN: BUDGET_32K`);

    try {
      const result = await generateQuantumCouture(vibeToUse, isDeepReasoning);
      
      if (result) {
        setConcept(result);
        addLog(`DESIGN_SYNTHESIS_COMPLETE: ${result.name}`);
      }

      if (isAutonomous || isDeepReasoning) {
        const innovationResult = await runStrategicInnovation(isDeepReasoning);
        if (innovationResult) {
          setInnovation(innovationResult);
          addLog("STRATEGIC_RESEARCH_SYNCED");
        }
      }
    } catch (err: any) {
      addLog(`FATAL_ERROR: ${err.message || 'NEURAL_LINK_DROPPED'}`);
      if (err?.message?.includes("Requested entity was not found.")) {
        await handleOpenKeySelection();
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleAutonomous = () => {
    setIsAutonomous(!isAutonomous);
    if (!isAutonomous) {
      addLog("AUTONOMOUS_HUB: CONNECTED");
      handleGenerate("INITIAL_EVOLUTION");
    } else {
      addLog("AUTONOMOUS_HUB: DISCONNECTED");
      if (autonomousTimer.current) clearTimeout(autonomousTimer.current);
    }
  };

  useEffect(() => {
    if (isAutonomous && !isGenerating) {
      autonomousTimer.current = setTimeout(() => handleGenerate("SELF_ITERATION"), 45000);
    }
    return () => { if (autonomousTimer.current) clearTimeout(autonomousTimer.current); };
  }, [isAutonomous, isGenerating]);

  return (
    <div className={`min-h-screen pt-20 pb-60 transition-all duration-1000 ${isDeepReasoning ? 'bg-[#010103]' : 'bg-[#0A0A0B]'} text-white`}>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none lab-grid"></div>
      
      <header className="container-precision mb-24 space-y-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <div className={`w-20 h-[2px] transition-all duration-700 ${isDeepReasoning ? 'bg-indigo-500 shadow-[0_0_40px_#6366f1]' : 'bg-[#D90429]'}`}></div>
            <div className="flex flex-col">
              <span className="order-tag text-zinc-500">{PROTOCOL_ID}</span>
              <span className="text-[7px] font-mono text-indigo-700 animate-pulse uppercase tracking-[0.5em] mt-1">H.A.L (High Altitude Logic) Engaged</span>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setIsDeepReasoning(!isDeepReasoning)} className={`px-8 py-3 lab-tag border transition-all ${isDeepReasoning ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>DS_DEEP_REASONING</button>
            <button onClick={toggleAutonomous} className={`px-8 py-3 lab-tag border transition-all ${isAutonomous ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>AUTONOMOUS_HUB</button>
          </div>
        </div>
        <h1 className="order-h1 italic leading-none tracking-tighter text-white">Quantum_Atelier</h1>
      </header>

      <div className="container-precision grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
        <div className="lg:col-span-4 space-y-8">
          <div className={`bg-zinc-950/80 border p-10 space-y-8 rounded-2xl backdrop-blur-xl transition-all duration-700 ${isDeepReasoning ? 'border-indigo-500/40 shadow-indigo-500/10' : 'border-white/10'}`}>
             
             {isDeepReasoning && (
               <div className="h-20 flex items-center justify-center gap-4 border border-indigo-500/20 rounded-lg bg-indigo-500/5 px-6">
                 <div className="flex-grow space-y-2">
                   <p className="text-[7px] font-black text-indigo-400 uppercase tracking-widest">Reasoning_Matrix</p>
                   <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 animate-pulse" style={{ width: '85%' }}></div>
                   </div>
                 </div>
                 <span className="text-xl font-black italic text-indigo-400">32K</span>
               </div>
             )}

             {!isAutonomous && (
               <div className="space-y-4">
                  <label className="order-tag text-zinc-600">INPUT_DNA_SEED</label>
                  <textarea value={inspiration} onChange={(e) => setInspiration(e.target.value)} placeholder="Enter design essence..." className="w-full bg-transparent border-b py-4 text-xl font-light italic outline-none min-h-[140px] transition-all border-white/10 focus:border-indigo-500 text-white" />
                  <button onClick={() => handleGenerate()} disabled={isGenerating || !inspiration} className={`w-full h-16 order-tag transition-all flex items-center justify-center rounded-lg ${isDeepReasoning ? 'bg-indigo-600 text-white' : 'bg-[#D90429] text-white'}`}>
                    {isGenerating ? "MAPPING_NEURONS..." : "SYNTHESIZE_ARTIFACT"}
                  </button>
               </div>
             )}

             {concept?.reasoningChain && (
               <div className="pt-8 border-t border-white/5 space-y-4">
                 <span className="order-tag text-zinc-700">REASONING_CHAIN</span>
                 <div className="space-y-3">
                   {concept.reasoningChain.map((step: string, i: number) => (
                     <div key={i} className="flex gap-4 items-start animate-in fade-in slide-in-from-left duration-700" style={{ animationDelay: `${i * 0.2}s` }}>
                        <span className="text-indigo-500 font-mono text-[9px] mt-1">[{i+1}]</span>
                        <p className="text-[10px] text-zinc-400 italic leading-tight uppercase tracking-tight">{step}</p>
                     </div>
                   ))}
                 </div>
               </div>
             )}

             <div className="pt-6 border-t border-white/5 max-h-[140px] overflow-y-auto no-scrollbar">
                <span className="order-tag text-zinc-800 block mb-4">ENGINE_TRACE</span>
                {logs.map((log, i) => (
                  <div key={i} className="flex items-center gap-3 text-[9px] font-mono text-zinc-600 uppercase tracking-widest leading-loose">
                    <div className={`w-1 h-1 rounded-full ${log.includes('COMPLETE') ? 'bg-emerald-500' : 'bg-indigo-500'}`}></div>
                    {log}
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className={`lg:col-span-8 min-h-[85vh] bg-zinc-950/40 border relative overflow-hidden flex flex-col items-center justify-center rounded-3xl transition-all duration-1000 ${isDeepReasoning ? 'border-indigo-500/20' : 'border-white/5'}`}>
           {isGenerating && (
             <div className="flex flex-col items-center gap-12 relative z-20">
                <div className={`w-48 h-48 border-t-2 rounded-full animate-spin ${isDeepReasoning ? 'border-indigo-500 shadow-[0_0_100px_#6366f144]' : 'border-[#D90429]'}`}></div>
                <p className="order-tag animate-pulse text-zinc-500 tracking-[1.5em]">THINKING...</p>
             </div>
           )}

           {concept && !isGenerating && (
             <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 animate-in fade-in zoom-in-95 duration-1000">
                <div className="relative aspect-square overflow-hidden">
                   <img src={concept.imageUrl} className="w-full h-full object-cover saturate-0 brightness-75" alt="Couture" />
                </div>
                <div className="p-16 space-y-12 flex flex-col justify-center bg-zinc-950/20 backdrop-blur-md">
                   <div className="space-y-4">
                      <span className="order-tag text-indigo-400">SPECIMEN_ALPHASYNC</span>
                      <h2 className="text-7xl font-black italic uppercase tracking-tighter leading-none text-white">{concept.name}</h2>
                   </div>
                   <div className="space-y-8">
                      <div className="space-y-2">
                        <p className="order-tag text-zinc-700">COMPOSITION</p>
                        <p className="text-2xl font-bold uppercase italic text-indigo-400">{concept.material}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="order-tag text-zinc-700">CORE_PHILOSOPHY</p>
                        <p className="text-xl font-light italic text-zinc-500 leading-relaxed uppercase">"{concept.philosophy}"</p>
                      </div>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default QuantumDesign;
