
import React, { useState, useRef } from 'react';
import { useApp } from '../store/context';
import { analyzeGarmentForResale } from '../services/gemini';
import { Navigate } from 'react-router-dom';

const ResaleProtocol: React.FC = () => {
  const { user, incrementListingCount, language } = useApp();
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hudPoints, setHudPoints] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    category: '', brand: '', condition: '', material: '', color: '', size: '', price: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return <Navigate to="/auth" />;

  const handleAutoScan = async (img: string) => {
    setIsAnalyzing(true);
    setHudPoints([]);
    try {
      const result = await analyzeGarmentForResale(img);
      if (result) {
        setFormData({
          brand: result.brand || 'ATELIER_SAMPLE',
          material: result.material || 'VIRGIN_WOOL',
          color: result.color || 'OBSIDIAN',
          size: result.suggestedSize || 'EU_50',
          category: result.category || 'MEN',
          price: result.suggestedPrice?.toString() || '1200',
          condition: 'NEW_UNWORN'
        });
        if (result.hudPoints) setHudPoints(result.hudPoints);
      }
    } catch (err) {
      console.error("ANALYSIS_SYNC_FAIL");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        handleAutoScan(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`min-h-screen pt-24 pb-60 reveal-view bg-white ${language === 'fa' ? 'font-farsi' : ''}`}>
      <header className="container-precision mb-24 space-y-8">
        <div className={`flex items-center gap-8 ${language === 'fa' ? 'flex-row-reverse' : ''}`}>
           <span className="w-16 h-[2px] bg-[#D90429] shadow-[0_0_15px_#D90429]"></span>
           <span className="lab-tag text-[#D90429] !text-[9px]">NEURAL_ASSET_ENTRY</span>
        </div>
        <h1 className="lab-huge !text-[clamp(3rem,8vw,6rem)] italic leading-none text-zinc-950 uppercase">
          Unit_Offloading
        </h1>
      </header>

      <form 
        onSubmit={(e) => { e.preventDefault(); setIsSubmitted(true); incrementListingCount(); }} 
        className="container-precision grid grid-cols-1 lg:grid-cols-12 gap-20 items-start"
      >
        <div className="lg:col-span-6">
          <div 
            onClick={() => fileInputRef.current?.click()} 
            className="group relative aspect-[3/4] bg-[#FBFBFC] border border-zinc-100 hover:border-[#D90429] transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden rounded-sm shadow-xl"
          >
            {image ? (
               <img src={image} className="w-full h-full object-cover saturate-0 opacity-80 group-hover:opacity-100 transition-all duration-1000" alt="Input" />
            ) : (
               <div className="text-center space-y-6">
                  <div className="w-16 h-16 border border-zinc-100 rounded-full flex items-center justify-center mx-auto group-hover:border-[#D90429] transition-all">
                     <svg className="w-6 h-6 text-zinc-200 group-hover:text-[#D90429]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2" strokeLinecap="round"/></svg>
                  </div>
                  <span className="lab-tag text-zinc-300 !text-[8px] tracking-[0.5em]">UPLOAD_SPECIMEN</span>
               </div>
            )}
            
            {/* Neural Scanner Effect */}
            <div className="absolute inset-0 z-20 pointer-events-none">
                <div className="w-full h-[1px] bg-[#D90429] shadow-[0_0_15px_#D90429] absolute top-0 animate-[macro-scan_4s_linear_infinite]"></div>
            </div>

            {hudPoints.map((pt, i) => (
              <div key={i} className="absolute z-30 group/pt" style={{ left: `${pt.x}%`, top: `${pt.y}%` }}>
                 <div className="w-3 h-3 bg-[#D90429] rounded-full animate-ping opacity-60"></div>
                 <div className="absolute top-0 left-0 w-3 h-3 bg-[#D90429] rounded-full"></div>
                 <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-zinc-950 text-white px-3 py-1 lab-tag !text-[5px] whitespace-nowrap opacity-0 group-hover/pt:opacity-100 transition-opacity">
                   {pt.label}
                 </div>
              </div>
            ))}

            {isAnalyzing && (
              <div className="absolute inset-0 z-40 bg-white/90 backdrop-blur-xl flex flex-col items-center justify-center gap-8">
                <div className="w-12 h-12 border-2 border-[#D90429] border-t-transparent rounded-full animate-spin"></div>
                <p className="lab-tag text-[#D90429] animate-pulse tracking-[1em] !text-[7px]">DECODING_ARTIFACT</p>
              </div>
            )}
            
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} hidden accept="image/*" />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-12">
          <div className="p-10 bg-zinc-50 border border-zinc-100 rounded-sm space-y-10">
            <div className="space-y-4">
               <label className="lab-tag text-zinc-400 !text-[7px]">01 // BRAND_VERIFICATION</label>
               <input 
                 type="text" 
                 value={formData.brand} 
                 onChange={(e) => setFormData({...formData, brand: e.target.value})}
                 className={`w-full bg-white border border-zinc-100 p-4 lab-tag !text-[10px] text-zinc-950 outline-none focus:border-[#D90429] transition-all ${language === 'fa' ? 'text-right' : ''}`} 
               />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                 <label className="lab-tag text-zinc-400 !text-[7px]">02 // CATEGORY</label>
                 <select 
                   value={formData.category} 
                   onChange={(e) => setFormData({...formData, category: e.target.value})}
                   className={`w-full bg-white border border-zinc-100 p-4 lab-tag !text-[10px] outline-none ${language === 'fa' ? 'text-right' : ''}`}
                 >
                    <option>MEN</option>
                    <option>WOMEN</option>
                    <option>ACCESSORIES</option>
                 </select>
              </div>
              <div className="space-y-4">
                 <label className="lab-tag text-zinc-400 !text-[7px]">03 // SIZE_TAG</label>
                 <input 
                   type="text" 
                   value={formData.size} 
                   className={`w-full bg-white border border-zinc-100 p-4 lab-tag !text-[10px] outline-none`} 
                 />
              </div>
            </div>

            <div className="space-y-4">
               <label className="lab-tag text-zinc-300 !text-[7px]">04 // ESTIMATED_VALUATION_CHF</label>
               <div className="flex items-baseline gap-4">
                  <span className="text-xl font-thin italic text-zinc-300">CHF</span>
                  <input 
                    type="number" 
                    value={formData.price} 
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-transparent text-7xl font-black italic tracking-tighter outline-none focus:text-[#D90429] transition-colors" 
                  />
               </div>
            </div>

            <button 
              type="submit" 
              disabled={!image || isAnalyzing || isSubmitted} 
              className={`w-full h-16 lab-button transition-all duration-700 shadow-2xl ${isSubmitted ? 'bg-emerald-600 text-white' : 'lab-button-primary'}`}
            >
              {isSubmitted ? "SYNC_PROTOCOL_COMPLETED" : "Initiate_Neural_Listing"}
            </button>
          </div>

          <div className="flex justify-between items-center text-[6px] font-mono text-zinc-200 uppercase tracking-[0.8em]">
             <span>VALUATION_ENGINE_v14</span>
             <span>SIGNED_BY_ARSHAD</span>
          </div>
        </div>
      </form>

      <style>{`
        @keyframes macro-scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          50% { top: 50%; opacity: 0.5; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ResaleProtocol;
