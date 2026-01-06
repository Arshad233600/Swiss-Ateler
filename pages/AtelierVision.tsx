
import React, { useState, useRef, useEffect } from 'react';
import { editImageWithGemini, generateVeoVideo } from '../services/gemini';
import { useApp } from '../store/context';

const AtelierVision: React.FC = () => {
  const { language } = useApp();
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [resultMedia, setResultMedia] = useState<{ url: string, type: 'image' | 'video' } | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<'edit' | 'animate'>('edit');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenKeySelection = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      // بر اساس دستورالعمل، بلافاصله پس از باز شدن دیالوگ، فرض بر موفقیت است
      return true;
    }
    return false;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSourceImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleExecute = async () => {
    if (!sourceImage) return;

    if (mode === 'animate') {
      const hasKey = (window as any).aistudio?.hasSelectedApiKey ? await (window as any).aistudio.hasSelectedApiKey() : true;
      if (!hasKey) {
        await handleOpenKeySelection();
      }
    }

    setIsProcessing(true);
    try {
      if (mode === 'edit') {
        const edited = await editImageWithGemini(sourceImage, prompt);
        if (edited) setResultMedia({ url: edited, type: 'image' });
      } else {
        // Fix: Removed extra boolean argument to match the signature generateVeoVideo(base64Image, prompt)
        const videoUrl = await generateVeoVideo(sourceImage, prompt);
        setResultMedia({ url: videoUrl, type: 'video' });
      }
    } catch (err: any) {
      console.error(err);
      if (err?.message?.includes("Requested entity was not found.")) {
        // بازنشانی وضعیت کلید و درخواست مجدد
        await handleOpenKeySelection();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-60 reveal-view">
      <header className="container-precision mb-32 space-y-12">
        <div className="flex items-center gap-8">
          <div className="w-16 h-[2px] bg-[#D90429]"></div>
          <span className="lab-tag text-[#D90429]">NEURAL_LAB_v10.1</span>
        </div>
        <h1 className="lab-huge italic leading-none">Vision_Atelier</h1>
      </header>

      <div className="container-precision grid grid-cols-1 lg:grid-cols-12 gap-32">
        <div className="lg:col-span-4 space-y-20">
          <div className="bg-zinc-950 p-16 text-white space-y-16 shadow-3xl border border-white/5 relative overflow-hidden rounded-xl">
             <div className="absolute top-0 right-0 w-2 h-2 bg-[#D90429]"></div>
             <div className="flex gap-4 border-b border-white/10 pb-12">
                <button onClick={() => setMode('edit')} className={`flex-grow py-5 text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'edit' ? 'bg-[#D90429] text-white' : 'text-zinc-600 hover:text-white'}`}>EDIT_UNIT</button>
                <button onClick={() => setMode('animate')} className={`flex-grow py-5 text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'animate' ? 'bg-[#D90429] text-white' : 'text-zinc-600 hover:text-white'}`}>ANIMATE_VEO</button>
             </div>

             <div className="space-y-8">
                <label className="lab-tag text-zinc-600 italic">01 // INPUT_SPECIMEN</label>
                <div onClick={() => fileInputRef.current?.click()} className="aspect-square bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:border-[#D90429]/50 transition-all overflow-hidden group rounded-lg">
                  {sourceImage ? <img src={sourceImage} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Source" /> : <span className="lab-tag text-zinc-800 group-hover:text-[#D90429]">SELECT_IMAGE</span>}
                </div>
                <input type="file" hidden ref={fileInputRef} onChange={handleFileUpload} accept="image/*" />
             </div>

             <div className="space-y-8">
                <label className="lab-tag text-zinc-600 italic">02 // NEURAL_PROMPT</label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Recalibrate aesthetic parameters..."
                  className="w-full bg-white/5 border border-white/10 p-8 text-xl font-light italic text-white outline-none focus:border-[#D90429] min-h-[160px] transition-all placeholder:text-zinc-900 rounded-lg"
                />
             </div>

             <button 
               onClick={handleExecute}
               disabled={isProcessing || !sourceImage}
               className="w-full lab-button lab-button-primary bg-white text-zinc-950 hover:bg-[#D90429] hover:text-white"
             >
               {isProcessing ? "PROCESSING_LINK..." : "EXECUTE_VISION"}
             </button>
          </div>
        </div>

        <div className="lg:col-span-8 bg-[#FBFBFC] border border-zinc-100 relative flex items-center justify-center min-h-[75vh] shadow-inner overflow-hidden rounded-2xl">
           <div className="absolute inset-0 opacity-[0.04] pointer-events-none lab-grid"></div>
           
           {isProcessing ? (
             <div className="flex flex-col items-center gap-12 relative z-10">
                <div className="w-24 h-24 border-2 border-[#D90429] border-t-transparent rounded-full animate-spin shadow-[0_0_20px_#D90429]"></div>
                <div className="text-center space-y-4">
                   <p className="lab-tag text-[#D90429] animate-pulse">RECONSTRUCTING_ARTIFACT</p>
                </div>
             </div>
           ) : resultMedia ? (
             <div className="w-full h-full p-20 animate-in zoom-in-95 duration-1000 relative z-10 flex flex-col items-center">
               <div className="w-full aspect-[3/4] bg-white shadow-4xl relative group rounded-lg overflow-hidden border border-zinc-100">
                  {resultMedia.type === 'image' ? <img src={resultMedia.url} className="w-full h-full object-contain" alt="Result" /> : <video src={resultMedia.url} autoPlay loop muted className="w-full h-full object-contain" />}
               </div>
               <a href={resultMedia.url} download="ATELIER_SPECIMEN" className="mt-12 lab-tag text-zinc-300 hover:text-[#D90429] transition-all">DOWNLOAD_SPECIMEN →</a>
             </div>
           ) : (
             <div className="opacity-[0.03] select-none text-[clamp(6rem,18vw,25rem)] font-black italic tracking-tighter text-zinc-950">VISION</div>
           )}
        </div>
      </div>
    </div>
  );
};

export default AtelierVision;