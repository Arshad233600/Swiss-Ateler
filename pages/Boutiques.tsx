
import React, { useState, useEffect } from 'react';
import { findBoutiquesNearby } from '../services/gemini';

const Boutiques: React.FC = () => {
  const [locations, setLocations] = useState<any[]>([]);
  const [aiText, setAiText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          const result = await findBoutiquesNearby(pos.coords.latitude, pos.coords.longitude);
          setAiText(result.text);
          setLocations(result.places);
          setIsLoading(false);
        }, () => {
          setIsLoading(false);
          setAiText("Please enable location services to triangulate the nearest Swiss Atelier node.");
        });
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchLocations();
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-60 reveal-view">
      <header className="container-precision mb-40 space-y-12">
        <div className="flex items-center gap-8">
           <span className="w-20 h-[2px] bg-[#D90429]"></span>
           <span className="text-[11px] font-black uppercase tracking-[2em] text-[#D90429]">GLOBAL_PRESENCE_PROTOCOL</span>
        </div>
        <h1 className="text-huge italic leading-none text-zinc-950">Atelier_Boutiques</h1>
      </header>

      <div className="container-precision grid grid-cols-1 lg:grid-cols-12 gap-32">
        <div className="lg:col-span-5 space-y-24">
          {isLoading ? (
            <div className="space-y-12 animate-pulse">
               <div className="h-2 w-1/2 bg-zinc-100"></div>
               <div className="h-64 w-full bg-zinc-50"></div>
               <div className="h-64 w-full bg-zinc-50"></div>
            </div>
          ) : (
            <>
              <div className="text-3xl font-light italic text-zinc-500 leading-relaxed uppercase tracking-tight border-b border-zinc-100 pb-20">
                {aiText}
              </div>
              <div className="space-y-16">
                 {locations.map((loc: any, i: number) => (
                   <div key={i} className="group p-16 bg-white border border-zinc-50 hover:border-[#D90429] transition-all shadow-sm hover:shadow-4xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#D90429]/5 rotate-45 translate-x-12 -translate-y-12 group-hover:bg-[#D90429]/10 transition-colors"></div>
                      <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-6">{loc.maps?.title || "Boutique Node"}</h3>
                      <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.5em] mb-12">OFFICIAL_SYNCED_PARTNER</p>
                      <a 
                        href={loc.maps?.uri} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-block text-[11px] font-black uppercase tracking-[1em] text-zinc-950 border-b-2 border-[#D90429] pb-3 hover:text-[#D90429] transition-all"
                      >
                        INITIATE_NAV →
                      </a>
                   </div>
                 ))}
              </div>
            </>
          )}
        </div>

        {/* Standardized Map Banner (Cinematic scale) */}
        <div className="lg:col-span-7 aspect-identity lg:aspect-auto min-h-[700px] border border-zinc-100 flex items-center justify-center overflow-hidden relative group">
           <div className="absolute inset-0 opacity-40 saturate-0 scale-110 group-hover:scale-100 transition-transform duration-[4s]">
             <img src="https://images.unsplash.com/photo-1533420225143-f70f997411b2?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover" alt="Swiss Topology" />
           </div>
           <div className="relative z-10 text-center p-24 space-y-10 bg-white/40 backdrop-blur-2xl border border-white/40 shadow-3xl">
              <div className="lab-icon-large bg-[#D90429] text-white flex items-center justify-center mx-auto animate-bounce shadow-2xl">
                <svg className="lab-icon-action" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>
              </div>
              <p className="text-[12px] font-black uppercase tracking-[1.5em] text-zinc-950 italic">Geospatial_Mapping_Ready</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Boutiques;
