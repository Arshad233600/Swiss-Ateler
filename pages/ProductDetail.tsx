
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { useApp } from '../store/context';
import { getStylingAdvice } from '../services/gemini';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, joinWaitlist, isOnWaitlist, language, t } = useApp();
  
  const product = PRODUCTS.find(p => p.id === id);
  const [displayedImage, setDisplayedImage] = useState<string>(product?.images[0] || '');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || '');
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || '');
  const [stylistAdvice, setStylistAdvice] = useState<string | null>(null);
  const [isStylistLoading, setIsStylistLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'ARCHIVE_DATA'>('DETAILS');
  
  const relatedProducts = PRODUCTS.filter(p => p.category === product?.category && p.id !== id).slice(0, 6);

  useEffect(() => {
    if (product) {
      setIsStylistLoading(true);
      getStylingAdvice(product.name[language], product.description[language])
        .then(advice => {
          setStylistAdvice(advice || null);
          setIsStylistLoading(false);
        });
      setDisplayedImage(product.images[0]);
      setActiveImageIndex(0);
    }
    window.scrollTo(0, 0);
  }, [product, language, id]);

  const handleThumbnailClick = (img: string, index: number) => {
    setDisplayedImage(img);
    setActiveImageIndex(index);
  };

  if (!product) return null;

  const isWishlisted = isInWishlist(product.id);
  const onWaitlist = isOnWaitlist(product.id);
  const isOutOfStock = product.stock === 0;

  return (
    <div className={`min-h-screen text-zinc-950 pb-60 bg-white reveal-view ${language === 'fa' ? 'font-farsi' : ''}`}>
      <div className="container-precision mt-12 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32">
        
        {/* Specimen Visual System */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-8">
           
           {/* Thumbnails - Optimized for Visual Balance */}
           <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar md:w-28 shrink-0 pb-4 md:pb-0">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleThumbnailClick(img, idx)}
                  className={`relative aspect-[3/4] md:w-full min-w-[95px] border-2 transition-all duration-700 overflow-hidden rounded-[2px] ${activeImageIndex === idx ? 'border-[#D90429] shadow-2xl scale-105 opacity-100' : 'border-zinc-100 opacity-40 hover:opacity-100'}`}
                >
                   <img src={img} className="w-full h-full object-cover saturate-0 group-hover:saturate-100" alt="" />
                </button>
              ))}
           </div>

           {/* Core Specimen Display Area */}
           <div className="relative flex-grow aspect-[3/4] bg-[#FBFBFC] overflow-hidden rounded-[4px] border border-zinc-50 shadow-4xl group/hero">
              <img 
                src={displayedImage} 
                className="w-full h-full object-cover transition-all duration-[1.5s] ease-in-out group-hover/hero:scale-110 saturate-[0.9] group-hover/hero:saturate-100" 
                alt={product.name[language]} 
              />
              
              <button 
                onClick={() => isWishlisted ? removeFromWishlist(product.id) : addToWishlist(product)}
                className={`absolute top-8 right-8 w-14 h-14 rounded-full flex items-center justify-center transition-all backdrop-blur-xl z-40 border ${isWishlisted ? 'bg-[#D90429] border-[#D90429] text-white shadow-[0_0_20px_#D90429]' : 'bg-white/70 border-zinc-100 text-zinc-950 hover:bg-white shadow-lg'}`}
              >
                <svg className={`w-6 h-6 ${isWishlisted ? 'fill-current' : 'fill-none'}`} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </button>

              <div className="absolute bottom-10 left-10 flex flex-col gap-3 z-30">
                 <div className="bg-zinc-950 text-white px-5 py-2 lab-tag !text-[7.5px] tracking-[0.5em] italic rounded-[1px] shadow-3xl">UNIT_CODE: SA_SPEC_{product.id.toUpperCase()}</div>
                 <div className="lab-tag bg-white/90 backdrop-blur-md text-zinc-400 px-3 py-1.5 !text-[6.5px] rounded-[1px] shadow-sm">STREAM_ACCESS // VIEW_0{activeImageIndex + 1}</div>
              </div>

              <div className="absolute inset-0 pointer-events-none opacity-[0.03] lab-grid"></div>
           </div>
        </div>

        {/* Technical Data & Interface Panel */}
        <div className="lg:col-span-5 flex flex-col gap-14 pt-6">
           <header className="space-y-6">
              <div className="flex justify-between items-center">
                 <span className="lab-tag text-[#D90429] !text-[9.5px] font-black tracking-[0.6em]">PRECISION_ARTIFACT // 24</span>
                 <div className="flex items-center gap-2.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 2 ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                    <span className="lab-tag !text-[8.5px] text-zinc-400">STOCK_UNITS: {product.stock}</span>
                 </div>
              </div>
              <h1 className="lab-h1 !text-[clamp(2.8rem,6vw,4.8rem)] italic uppercase tracking-tighter leading-[0.9] text-zinc-950">{product.name[language]}</h1>
              <div className="flex items-baseline gap-4 pt-4">
                 <span className="text-3xl font-thin italic text-zinc-200 uppercase tracking-widest">CHF</span>
                 <span className="text-8xl font-black tracking-tighter italic text-zinc-950 leading-none">{product.price.toLocaleString()}</span>
              </div>
           </header>

           {/* Strategic Insight Tabs */}
           <div className="space-y-8">
              <div className="flex gap-12 border-b border-zinc-100 pb-4">
                 {['DETAILS', 'ARCHIVE_DATA'].map(tab => (
                   <button 
                     key={tab} 
                     onClick={() => setActiveTab(tab as any)}
                     className={`lab-tag !text-[9.5px] transition-all relative py-2 ${activeTab === tab ? 'text-zinc-950 font-black' : 'text-zinc-300 hover:text-zinc-600'}`}
                   >
                     {tab}
                     {activeTab === tab && <div className="absolute -bottom-[20px] left-0 w-full h-[2.5px] bg-zinc-950 animate-in fade-in slide-in-from-bottom-2"></div>}
                   </button>
                 ))}
              </div>
              <div className="min-h-[110px] py-2">
                 <p className="text-xl font-light italic text-zinc-500 leading-relaxed uppercase tracking-tight">
                    {isStylistLoading ? 'SYNCHRONIZING_AESTHETIC_INTELLIGENCE...' : stylistAdvice}
                 </p>
              </div>
           </div>

           {/* Configuration Matrix - High Precision Layout */}
           <div className="space-y-14 py-12 border-y border-zinc-50">
              <div className="space-y-6">
                <span className="lab-tag text-zinc-300 !text-[8.5px] tracking-[0.8em] font-medium">01_CHROMA_CALIBRATION</span>
                <div className="flex flex-wrap gap-4">
                  {product.colors.map(c => (
                    <button key={c} onClick={() => setSelectedColor(c)} className={`px-8 py-3.5 lab-tag !text-[9.5px] border-2 transition-all rounded-[4px] ${selectedColor === c ? 'bg-zinc-950 text-white border-zinc-950 shadow-2xl scale-105' : 'bg-white text-zinc-400 border-zinc-100 hover:border-zinc-400'}`}>{c}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <span className="lab-tag text-zinc-300 !text-[8.5px] tracking-[0.8em] font-medium">02_DIMENSIONAL_OFFSET</span>
                <div className="flex flex-wrap gap-4">
                  {product.sizes.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s)} className={`w-16 h-16 lab-tag !text-[11.5px] border-2 transition-all rounded-[4px] flex items-center justify-center ${selectedSize === s ? 'bg-[#D90429] text-white border-[#D90429] shadow-2xl scale-110' : 'bg-white text-zinc-300 border-zinc-100 hover:border-zinc-950'}`}>{s}</button>
                  ))}
                </div>
              </div>
           </div>

           {/* Strategic Acquisition Trigger */}
           {isOutOfStock ? (
             <button onClick={() => joinWaitlist(product.id)} disabled={onWaitlist} className={`w-full h-22 lab-button transition-all duration-1000 rounded-xl shadow-2xl ${onWaitlist ? 'bg-zinc-100 text-zinc-400' : 'lab-button-primary hover:scale-[1.02]'}`}>
                {onWaitlist ? "WAITLIST_SECURED_PROTOCOL" : "INITIATE_WAITLIST_PROTOCOL"}
             </button>
           ) : (
             <button 
                onClick={() => { addToCart(product, selectedColor, selectedSize); setIsAdded(true); setTimeout(() => setIsAdded(false), 3000); }}
                className={`w-full h-22 lab-button transition-all duration-1000 shadow-3xl rounded-xl ${isAdded ? 'bg-emerald-600 text-white' : 'lab-button-primary hover:scale-[1.02]'}`}
             >
                {isAdded ? "ACQUISITION_SUCCESSFUL" : "INITIATE_ACQUISITION_PROTOCOL"}
             </button>
           )}
        </div>
      </div>

      {/* MINIATURE ARCHIVE LOOKBOOK (Curated Similar Specimens) */}
      {relatedProducts.length > 0 && (
        <section className="container-precision mt-56 space-y-20 border-t border-zinc-100 pt-32 animate-in fade-in duration-1000">
           <div className={`flex items-center gap-10 ${language === 'fa' ? 'flex-row-reverse' : ''}`}>
              <div className="w-16 h-[2px] bg-[#D90429]"></div>
              <h2 className="lab-tag text-[#D90429] !text-[11.5px] tracking-[1em] font-black">ADJACENT_SPECIMENS_ARCHIVE</h2>
           </div>
           
           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-10 pt-12">
              {relatedProducts.map(p => (
                 <Link 
                   key={p.id} 
                   to={`/product/${p.id}`} 
                   className="group block space-y-5 scale-95 hover:scale-100 transition-all duration-1000"
                 >
                    <div className="aspect-[3/4] overflow-hidden bg-[#FBFBFC] border border-zinc-100 group-hover:border-[#D90429]/40 transition-all rounded-[2px] relative shadow-sm group-hover:shadow-3xl">
                       <img src={p.images[0]} className="w-full h-full object-cover saturate-0 group-hover:saturate-100 transition-all duration-[1.5s] ease-out" alt="" />
                       <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 lab-tag !text-[6.5px] opacity-0 group-hover:opacity-100 transition-opacity rounded-[1px] shadow-sm">
                          CHF {p.price.toLocaleString()}
                       </div>
                    </div>
                    <div className="space-y-1.5 px-1.5">
                       <h4 className="text-[12.5px] font-black italic uppercase tracking-tighter truncate text-zinc-950 group-hover:text-[#D90429] transition-colors">
                         {p.name[language]}
                       </h4>
                       <div className="flex justify-between items-center">
                          <p className="lab-tag !text-[5.5px] text-zinc-300 font-mono tracking-widest">REF_UNIT_{p.id.toUpperCase()}</p>
                          <div className="w-2.5 h-2.5 bg-zinc-50 rounded-full group-hover:bg-[#D90429] transition-colors shadow-sm"></div>
                       </div>
                    </div>
                 </Link>
              ))}
           </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
