
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useApp } from '../store/context';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language } = useApp();
  
  return (
    <Link to={`/product/${product.id}`} className="group block relative no-underline">
      {/* Specimen Container with Precision Borders */}
      <div className="relative aspect-specimen overflow-hidden bg-[#FBFBFC] mb-5 border border-zinc-100 group-hover:border-[#D90429]/40 transition-all duration-1000 rounded-[2px] shadow-sm">
        
        {/* Technical Alignment Brackets */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-zinc-200 z-10 group-hover:border-[#D90429]/40 transition-colors"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-zinc-200 z-10 group-hover:border-[#D90429]/40 transition-colors"></div>

        <img 
          src={product.images[0]} 
          alt={product.name[language]}
          className="w-full h-full object-cover saturate-[0.8] group-hover:saturate-100 group-hover:scale-105 transition-all duration-[1.5s] ease-out"
        />
        
        {/* Dynamic Status Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
           {product.isNew && (
             <span className="bg-[#D90429] text-white px-2.5 py-1 lab-tag !text-[7.5px] italic rounded-[1px] shadow-xl">
               NEW_ARRIVAL
             </span>
           )}
           <span className="lab-tag text-zinc-400 bg-white/70 backdrop-blur-sm px-2 py-0.5 rounded-[1px] group-hover:text-zinc-950 transition-colors">REF_ID_{product.id.toUpperCase()}</span>
        </div>

        {/* Hover Interaction Overlay */}
        <div className="absolute inset-0 bg-zinc-950/0 group-hover:bg-zinc-950/5 transition-all duration-700 pointer-events-none"></div>
        <div className="absolute inset-x-0 h-[1px] bg-[#D90429]/20 top-0 opacity-0 group-hover:opacity-100 group-hover:animate-[scanline_3s_linear_infinite] z-30"></div>
      </div>

      {/* Information Hierarchy */}
      <div className="px-1 space-y-2">
        <div className="flex justify-between items-start gap-5">
           <div className="min-w-0 flex-grow">
              <span className="lab-tag text-zinc-300 block mb-1 uppercase tracking-[0.3em] font-medium !text-[7.5px]">
                {product.category} // ARCHIVE_PIECE
              </span>
              <h3 className="text-[16px] font-black italic tracking-tighter text-zinc-950 uppercase group-hover:text-[#D90429] transition-colors truncate">
                {product.name[language]}
              </h3>
           </div>
           <div className="text-right shrink-0">
              <div className="flex items-baseline gap-1.5 pt-1">
                 <span className="text-[10px] font-mono text-zinc-300 italic uppercase">CHF</span>
                 <span className="lab-price text-zinc-950 group-hover:text-[#D90429] transition-colors !text-[17px]">
                   {product.price.toLocaleString()}
                 </span>
              </div>
           </div>
        </div>
        
        <div className="flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-all duration-1000 pt-1">
           <div className="h-[1px] flex-grow bg-zinc-100 group-hover:bg-[#D90429]/20"></div>
           <span className="text-[6px] font-mono text-zinc-300 uppercase tracking-[0.4em]">Heritage Calibrated 2024</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
