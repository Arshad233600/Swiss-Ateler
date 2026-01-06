
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import ProductCard from '../components/ProductCard';
import { useApp } from '../store/context';

const Home: React.FC = () => {
  const { t, language } = useApp();
  const [ticker, setTicker] = useState(0);
  const [stability, setStability] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setTicker(t => (t + 1) % 1000);
      setStability(s => Math.min(100, Math.max(99.5, s + (Math.random() - 0.5) * 0.05)));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const featured = PRODUCTS.filter(p => p.featured).slice(0, 4);

  return (
    <div className="reveal-view bg-white">
      
      {/* 01 // NEURAL HERO */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden border-b border-zinc-100">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none lab-grid"></div>
        
        {/* Telemetry HUD */}
        <div className={`absolute top-28 ${language === 'fa' ? 'right-16 text-right' : 'left-16 text-left'} hidden xl:flex flex-col gap-12`}>
           <div className="flex items-center gap-5">
              <div className="w-3 h-3 bg-[#D90429] rounded-full animate-pulse shadow-[0_0_15px_#D90429]"></div>
              <span className="order-tag text-zinc-950 font-black">LOGIC_SYNC: {stability.toFixed(2)}%</span>
           </div>
           <div className="space-y-3">
              <p className="order-tag text-zinc-300">ARCHIVE_V.16</p>
              <p className="font-mono text-[10px] text-zinc-950 font-bold border-l-2 border-[#D90429] pl-5 uppercase tracking-wider">
                NODE_STABLE // {ticker.toString().padStart(3, '0')}
              </p>
           </div>
        </div>

        <div className="container-precision relative z-10 text-center space-y-20">
           <div className="space-y-10">
              <span className="order-tag text-[#D90429] block tracking-[2.5em] font-black animate-in fade-in slide-in-from-top-4 duration-1000">
                SWISS_ATELIER_AUTONOMOUS
              </span>
              <div className="w-[1px] h-32 bg-gradient-to-b from-[#D90429] to-transparent mx-auto"></div>
           </div>

           <h1 className="order-h1 text-zinc-950 select-none">
              <span className="block opacity-10">{t('precision')}</span>
              <span className="block -mt-12 font-black tracking-tighter uppercase">{t('archive')}</span>
           </h1>

           <div className="max-w-5xl mx-auto space-y-16">
              <p className={`text-3xl font-light italic text-zinc-400 uppercase tracking-[0.15em] leading-relaxed ${language === 'fa' ? 'font-farsi' : ''}`}>
                {language === 'fa' 
                  ? 'مهندسی دقیق آرشیوهای مد آلپاین؛ جایی که منطق بر زیبایی حکم‌فرماست.' 
                  : 'Strategic engineering of Alpine fashion archives; where logic dictates the aesthetic code.'}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center pt-10">
                <Link to="/products" className="lab-button lab-button-primary min-w-[320px] h-20 text-[11px] tracking-[0.6em] font-black rounded-sm shadow-4xl hover:scale-105 transition-all">
                   {t('enterArchive')}
                </Link>
                <Link to="/vision" className="lab-button border border-zinc-200 text-zinc-950 hover:border-zinc-950 min-w-[320px] h-20 text-[11px] tracking-[0.6em] font-black rounded-sm transition-all">
                   {language === 'fa' ? 'آزمایشگاه بصری' : 'NEURAL_LAB'}
                </Link>
              </div>
           </div>
        </div>
      </section>

      {/* 02 // LOGIC GRID */}
      <section className="py-52 bg-[#FBFBFC] border-y border-zinc-50 relative overflow-hidden">
         <div className="container-precision grid grid-cols-1 lg:grid-cols-12 gap-32 items-center">
            <div className="lg:col-span-5 space-y-16">
               <div className="space-y-5">
                  <span className="order-tag text-[#D90429] font-black tracking-[1em]">02_USER_INTEGRITY</span>
                  <h2 className="text-7xl font-black italic tracking-tighter uppercase leading-[0.85] text-zinc-950">NEURAL_SYNC_PROTOCOL</h2>
               </div>
               <p className="text-2xl font-light italic text-zinc-500 leading-relaxed uppercase tracking-tight">
                  "WE CONSTANTLY MONITOR VISUAL ALIGNMENT TO ENSURE THE HIGHEST CONVENIENCE FOR THE HUMAN USER."
               </p>
               <div className="flex gap-6">
                  <div className="p-10 bg-white border border-zinc-100 rounded-lg flex-grow shadow-sm">
                     <span className="order-tag text-zinc-300 block mb-5">LOGIC_SCORE</span>
                     <span className="text-6xl font-black italic text-zinc-950">99.8%</span>
                  </div>
                  <div className="p-10 bg-zinc-950 text-white rounded-lg flex-grow shadow-4xl">
                     <span className="order-tag text-zinc-700 block mb-5">MODE</span>
                     <span className="text-6xl font-black italic text-[#D90429]">ACTIVE</span>
                  </div>
               </div>
            </div>
            <div className="lg:col-span-7 grid grid-cols-2 gap-10">
               {[
                 { label: "GRID_REALIGN", val: "DONE" },
                 { label: "COLOR_SYNC", val: "100%" },
                 { label: "TYPO_WEIGHTS", val: "FIXED" },
                 { label: "ORDER_INDEX", val: "MAX" }
               ].map((stat, i) => (
                 <div key={i} className="p-16 bg-white border border-zinc-50 rounded-lg group hover:border-[#D90429] transition-all duration-700 shadow-sm">
                    <span className="order-tag text-zinc-300 group-hover:text-[#D90429] transition-colors mb-6 block">{stat.label}</span>
                    <p className="text-5xl font-black italic tracking-tighter uppercase text-zinc-950">{stat.val}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* 03 // FEATURED SPECIMENS */}
      <section className="py-64 bg-white">
         <div className="container-precision">
            <header className="mb-40 flex flex-col md:flex-row justify-between items-end gap-20 border-b border-zinc-100 pb-24">
               <div className="space-y-8">
                  <div className="flex items-center gap-8">
                     <div className="w-24 h-[3px] bg-[#D90429]"></div>
                     <p className="order-tag text-[#D90429] font-black tracking-[1.2em]">FEATURED_UNITS</p>
                  </div>
                  <h2 className="order-h1 !text-[8vw] leading-none">{t('featuredHeritage')}</h2>
               </div>
               <Link to="/products" className="order-tag text-zinc-400 hover:text-[#D90429] transition-all pb-5 border-b border-zinc-100 group">
                  EXPLORE_FULL_VAULT <span className="group-hover:translate-x-3 transition-transform inline-block">→</span>
               </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
               {featured.map(product => (
                 <ProductCard key={product.id} product={product} />
               ))}
            </div>
         </div>
      </section>
    </div>
  );
};

export default Home;
