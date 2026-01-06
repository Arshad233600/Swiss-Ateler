
import React, { useState, useEffect } from 'react';

const PrecisionLoader: React.FC = () => {
  const [percent, setPercent] = useState(0);
  const [status, setStatus] = useState('INIT_CORE');

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent(p => {
        if (p < 30) setStatus('LINKING_NEURAL_NODES');
        else if (p < 60) setStatus('API_CORE_HANDSHAKE');
        else if (p < 90) setStatus('SYNCHRONIZING_ARCHIVE');
        else setStatus('PRECISION_STABLE');
        return p < 100 ? p + 1 : 100;
      });
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] bg-[#0A0A0B] flex flex-col items-center justify-center p-10 font-mono text-white">
      {/* HUD Scanner Effect */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#D90429 1px, transparent 1px)', backgroundSize: '100% 4px' }}></div>
      
      <div className="max-w-md w-full space-y-12 relative z-10">
        <div className="flex justify-between items-end border-b border-white/10 pb-6">
          <div className="space-y-2">
            <span className="text-[8px] font-black text-[#D90429] tracking-[0.5em] uppercase">SYSTEM_ARCHITECT: ABDULLAH ARSHAD</span>
            <h1 className="text-3xl font-black italic tracking-tighter text-white">SWISS_ATELIER_V13.0</h1>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-3xl font-black italic text-[#D90429]">{percent}%</span>
             <span className="text-[7px] text-zinc-600">LINK_STRENGTH: 99.9%</span>
          </div>
        </div>

        <div className="space-y-5">
           {[
             { label: 'Abdullah_Arshad_Kernel', loaded: percent > 20 },
             { label: 'Precision_Secure_Handshake', loaded: percent > 55 },
             { label: 'Alpine_Archive_Sync', loaded: percent > 85 }
           ].map(item => (
             <div key={item.label} className="flex justify-between text-[9px] tracking-[0.4em] uppercase">
                <span className="text-zinc-500">{item.label}</span>
                <span className={item.loaded ? 'text-[#D90429]' : 'text-zinc-800'}>
                   [{item.loaded ? 'SYNCED' : '...'}]
                </span>
             </div>
           ))}
        </div>

        <div className="h-1.5 w-full bg-white/5 relative overflow-hidden rounded-full">
           <div className="absolute top-0 left-0 h-full bg-[#D90429] shadow-[0_0_15px_#D90429] transition-all duration-300" style={{ width: `${percent}%` }}></div>
        </div>

        <div className="flex justify-between items-center pt-8">
           <div className="flex gap-1">
              {[1,2,3,4].map(i => <div key={i} className={`w-1 h-3 ${percent > i * 25 ? 'bg-[#D90429]' : 'bg-zinc-800'}`}></div>)}
           </div>
           <p className="text-[7px] font-black text-zinc-500 uppercase tracking-[0.6em] italic animate-pulse text-right">Built by Abdullah Arshad...</p>
        </div>
      </div>
    </div>
  );
};

export default PrecisionLoader;
