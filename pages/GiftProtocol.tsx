
import React, { useState } from 'react';
import { getGiftRecommendation } from '../services/gemini';

const GiftProtocol: React.FC = () => {
  const [vibe, setVibe] = useState('');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!vibe.trim()) return;
    setIsSearching(true);
    const results = await getGiftRecommendation(vibe);
    setRecommendations(results);
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen pt-20 pb-60 reveal-view bg-white">
      <header className="container-precision mb-40 space-y-16 text-center">
        <p className="lab-tag text-[#D90429] italic tracking-[2em]">GIFT_ENGINEERING_PROTOCOL</p>
        <h1 className="lab-h1 !text-[clamp(4.5rem,14vw,12rem)]">Perfect_Units.</h1>
        <div className="w-[1px] h-32 bg-zinc-200 mx-auto mt-16"></div>
        <p className="text-zinc-400 text-3xl font-light italic max-w-5xl mx-auto uppercase tracking-tight leading-relaxed pt-12">
          "Define the aesthetic coordinates of the recipient. Our neural core will identify the matching specimens."
        </p>
      </header>

      <div className="container-precision space-y-40">
        <div className="relative max-w-6xl mx-auto group text-center">
           <input 
             type="text" 
             value={vibe}
             onChange={(e) => setVibe(e.target.value)}
             placeholder="DESCRIBE THEIR SILHOUETTE & VIBE..."
             className="w-full bg-transparent border-b-2 border-zinc-100 p-16 text-5xl font-light italic outline-none focus:border-[#D90429] transition-all text-center placeholder:text-zinc-50 uppercase tracking-tighter"
           />
           <button 
             onClick={handleSearch}
             disabled={isSearching}
             className="mt-20 w-full max-w-md mx-auto lab-button bg-zinc-950 text-white hover:bg-[#D90429] transition-all shadow-4xl transform hover:-translate-y-2 block"
           >
             {isSearching ? "ANALYZING_DATA..." : "INIT_DISCOVERY"}
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
          {recommendations.map((rec, i) => (
            <div key={i} className="p-20 bg-white border border-zinc-50 shadow-sm hover:shadow-4xl transition-all duration-[1.5s] space-y-10 group relative overflow-hidden">
               <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#D90429] opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="h-[1px] w-24 bg-[#D90429]"></div>
               <h3 className="text-4xl font-black uppercase italic tracking-tighter text-zinc-950 leading-none group-hover:text-[#D90429] transition-colors">{rec.name}</h3>
               <p className="lab-body italic text-zinc-500 uppercase tracking-tight font-light">{rec.reason}</p>
               <div className="flex justify-between items-end pt-16 border-t border-zinc-50 mt-12">
                 <span className="lab-tag text-zinc-300 italic">{rec.priceEstimate}</span>
                 <span className="text-[#D90429] lab-tag tracking-widest cursor-pointer border-b border-[#D90429]/30 pb-1">ACQUIRE_UNIT →</span>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GiftProtocol;
