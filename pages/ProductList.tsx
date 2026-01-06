
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PRODUCTS, GARMENT_TYPES } from '../constants';
import ProductCard from '../components/ProductCard';
import { useApp } from '../store/context';
import { searchGroundingQuery } from '../services/gemini';

const ProductList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { language, t } = useApp();
  const [aiInsights, setAiInsights] = useState<{text: string, sources: any[]} | null>(null);
  
  const currentCategory = searchParams.get('cat') || 'All';
  const searchQuery = searchParams.get('q') || '';

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name[language].toLowerCase().includes(q) || 
        p.description[language].toLowerCase().includes(q)
      );
    }
    if (currentCategory !== 'All') result = result.filter(p => p.category === currentCategory);
    return result;
  }, [currentCategory, searchQuery, language]);

  useEffect(() => {
    if (searchQuery && filteredProducts.length === 0) {
      searchGroundingQuery(searchQuery).then(setAiInsights);
    } else {
      setAiInsights(null);
    }
  }, [searchQuery, filteredProducts.length]);

  return (
    <div className="reveal-view bg-white min-h-screen">
      <div className="container-precision py-20">
        
        <header className="space-y-16 mb-40">
          <div className="flex items-center gap-8">
            <div className="w-16 h-[2px] bg-[#D90429]"></div>
            <p className="lab-tag text-[#D90429]">INDEX_v6.0_STABLE</p>
          </div>
          
          <h1 className="lab-huge !text-[clamp(3.5rem,8vw,10rem)] leading-none text-zinc-950">
            {searchQuery ? `Query: ${searchQuery}` : t(currentCategory.toLowerCase() as any)}
          </h1>
          
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 border-b border-zinc-100 pb-12">
            <div className="flex items-baseline gap-4">
              <span className="text-7xl font-black italic tracking-tighter text-zinc-950">{filteredProducts.length}</span>
              <span className="lab-tag text-zinc-300">UNITS_LOCATED</span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {['All', ...GARMENT_TYPES].map(cat => (
                <button 
                  key={cat}
                  onClick={() => {
                    const p = new URLSearchParams(searchParams);
                    if (cat === 'All') p.delete('cat'); else p.set('cat', cat);
                    setSearchParams(p);
                  }}
                  className={`px-10 h-[48px] lab-tag transition-all duration-500 border rounded-[8px] ${currentCategory === cat ? 'bg-zinc-950 text-white border-zinc-950 shadow-xl' : 'bg-white text-zinc-300 border-zinc-100 hover:border-zinc-300'}`}
                >
                  {t(cat.toLowerCase() as any)}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="min-h-[60vh]">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-32">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="max-w-4xl py-40 space-y-12 text-center mx-auto">
              <div className="w-[1px] h-32 bg-gradient-to-b from-[#D90429] to-transparent mx-auto"></div>
              <h2 className="lab-huge !text-[clamp(3rem,8vw,6rem)] text-zinc-100 italic leading-none">ZERO_INDEX</h2>
              <p className="lab-body italic text-zinc-400 uppercase tracking-widest leading-relaxed">
                The core could not locate specimens matching your query.
              </p>
              {aiInsights && (
                <div className="p-10 bg-[#FBFBFC] border-l-2 border-[#D90429] text-left">
                  <p className="lab-body text-zinc-600 italic font-light leading-relaxed">{aiInsights.text}</p>
                </div>
              )}
              <button 
                onClick={() => setSearchParams({})}
                className="lab-button lab-button-primary min-w-[240px]"
              >
                REBOOT_PROTOCOL
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductList;
