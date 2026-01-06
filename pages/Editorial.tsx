
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { useApp } from '../store/context';

const Editorial = () => {
  const { addToCart, language } = useApp();
  const [activeCollection, setActiveCollection] = useState<string | null>(null);

  const collections = [
    {
      id: 'st-moritz',
      title: 'St. Moritz After-Hours',
      vibe: 'ELEGANT_ALPINE_NIGHTS',
      image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=1200',
      items: PRODUCTS.slice(0, 2)
    },
    {
      id: 'zurich-boardroom',
      title: 'The Zurich Boardroom',
      vibe: 'PRECISION_MINIMALISM',
      image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&q=80&w=1200',
      items: PRODUCTS.slice(2, 4)
    }
  ];

  const handleAcquireLook = (items: typeof PRODUCTS) => {
    items.forEach(item => {
      addToCart(item, item.colors[0], item.sizes[0]);
    });
    alert("LOOK_DNA_SYNCHRONIZED: Items added to archive manifest.");
  };

  return (
    <div className="min-h-screen pt-24 pb-60 bg-white reveal-view">
      <header className="container-precision mb-32 space-y-12">
        <div className="flex items-center gap-8">
          <div className="w-16 h-[2px] bg-[#D90429]"></div>
          <span className="lab-tag text-[#D90429]">ARCHIVE_CURATION // v14</span>
        </div>
        <h1 className="lab-huge italic leading-none tracking-tighter">Atelier_Journal</h1>
      </header>

      <div className="container-precision space-y-60">
        {collections.map((col, idx) => (
          <section key={col.id} className={`grid grid-cols-1 lg:grid-cols-12 gap-20 items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
             <div className={`lg:col-span-7 relative group ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="aspect-[16/9] overflow-hidden rounded-sm border border-zinc-100 shadow-4xl relative">
                   <img src={col.image} className="w-full h-full object-cover saturate-0 group-hover:saturate-100 group-hover:scale-105 transition-all duration-[2s]" alt="" />
                   <div className="absolute inset-0 bg-zinc-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => handleAcquireLook(col.items)}
                        className="lab-button bg-white text-zinc-950 scale-90 group-hover:scale-100 transition-all duration-500 rounded-none tracking-[0.5em] !text-[10px]"
                      >
                        ACQUIRE_FULL_LOOK
                      </button>
                   </div>
                </div>
                <div className="absolute -bottom-12 -left-12 lg:block hidden bg-zinc-950 text-white p-12 space-y-4 max-w-xs shadow-3xl">
                   <span className="lab-tag text-[#D90429] !text-[7px]">NEURAL_CURATION</span>
                   <p className="text-xl font-light italic uppercase tracking-tighter">"{col.vibe}"</p>
                </div>
             </div>
             
             <div className="lg:col-span-5 space-y-12">
                <div className="space-y-6">
                   <h2 className="lab-h1 !text-[4.5rem] italic leading-none">{col.title}</h2>
                   <div className="w-20 h-[2px] bg-zinc-950"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                   {col.items.map(item => (
                     <Link key={item.id} to={`/product/${item.id}`} className="group space-y-4">
                        <div className="aspect-[3/4] bg-zinc-50 overflow-hidden rounded-lg border border-zinc-100 relative">
                           <img src={item.images[0]} className="w-full h-full object-cover saturate-0 group-hover:saturate-100 transition-all" alt="" />
                           <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2 py-1 lab-tag !text-[6px] opacity-0 group-hover:opacity-100 transition-opacity">
                              CHF {item.price}
                           </div>
                        </div>
                        <div className="space-y-1">
                           <p className="lab-tag !text-[7px] text-zinc-400 uppercase">{item.category}</p>
                           <p className="text-xs font-black italic tracking-tighter uppercase">{item.name[language]}</p>
                        </div>
                     </Link>
                   ))}
                </div>

                <div className="flex gap-4">
                   <button 
                     onClick={() => handleAcquireLook(col.items)}
                     className="lab-button lab-button-primary flex-grow rounded-xl"
                   >
                     ACQUIRE_LOOK
                   </button>
                </div>
             </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Editorial;
