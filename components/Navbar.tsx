
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../store/context';
import { visualSearchInArchive } from '../services/gemini';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, t } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisualSearching, setIsVisualSearching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleVisualSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsVisualSearching(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = await visualSearchInArchive(reader.result as string);
        if (result) {
          navigate(`/products?q=${encodeURIComponent(result.keywords?.join(' ') || '')}`);
          setIsSearchOpen(false);
        }
        setIsVisualSearching(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <nav className={`fixed top-12 left-0 right-0 z-[450] transition-all duration-[1s] ease-in-out ${isScrolled ? 'h-20 bg-white/95 backdrop-blur-3xl border-b border-zinc-100 shadow-sm' : 'h-28 bg-transparent'}`}>
      <div className={`container-precision h-full flex items-center justify-between ${language === 'fa' ? 'flex-row-reverse' : 'flex-row'}`}>
        
        <Link to="/" className={`flex items-center gap-6 group ${language === 'fa' ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="relative w-12 h-12 bg-zinc-950 text-white flex items-center justify-center font-black text-xl italic transition-all group-hover:bg-[#D90429] rounded-[3px] shadow-xl">
             SA
             <div className="absolute top-0 right-0 w-2 h-2 bg-[#D90429] group-hover:bg-white transition-colors"></div>
          </div>
          <div className={`flex flex-col ${language === 'fa' ? 'items-end' : 'items-start'}`}>
            <span className="text-2xl font-black uppercase tracking-tighter italic text-zinc-950 leading-none">SWISS ATELIER</span>
            <span className="text-[7px] font-bold tracking-[0.5em] text-zinc-300 uppercase mt-1.5 transition-colors group-hover:text-[#D90429]">PRECISION_ENGINEERING_v16.0</span>
          </div>
        </Link>

        <div className="flex items-center gap-12">
          <div className="hidden lg:flex items-center gap-10">
             <Link to="/editorial" className={`lab-tag !text-[9px] hover:text-[#D90429] transition-all relative group ${location.pathname === '/editorial' ? 'text-[#D90429]' : 'text-zinc-400'}`}>
                JOURNAL
                <div className={`absolute -bottom-1 left-0 h-[1px] bg-[#D90429] transition-all duration-500 ${location.pathname === '/editorial' ? 'w-full' : 'w-0 group-hover:w-full'}`}></div>
             </Link>
             <Link to="/products" className={`lab-tag !text-[9px] hover:text-[#D90429] transition-all relative group ${location.pathname === '/products' ? 'text-[#D90429]' : 'text-zinc-400'}`}>
                ARCHIVE
                <div className={`absolute -bottom-1 left-0 h-[1px] bg-[#D90429] transition-all duration-500 ${location.pathname === '/products' ? 'w-full' : 'w-0 group-hover:w-full'}`}></div>
             </Link>
          </div>
          <button onClick={() => setIsSearchOpen(true)} className="flex items-center justify-center p-3 group transition-all rounded-full hover:bg-zinc-50">
            <svg className="w-6 h-6 text-zinc-950 group-hover:text-[#D90429] transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 21l-4.35-4.35M19 11a8 8 0 11-16 0 8 8 0 0116 0z" /></svg>
          </button>
        </div>
      </div>

      {isSearchOpen && (
        <div className="fixed inset-0 bg-zinc-950/98 backdrop-blur-3xl z-[1000] flex items-center justify-center animate-in fade-in zoom-in-95 duration-700">
           <button 
             onClick={() => setIsSearchOpen(false)} 
             className="absolute top-12 right-12 p-5 border border-white/10 hover:border-[#D90429] transition-all text-white rounded-full bg-white/5"
           >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
           
           <div className="w-full max-w-5xl px-12 text-center space-y-24 relative z-10">
             <div className="space-y-8">
                <p className="lab-tag text-[#D90429] text-[11px] tracking-[1.2em] font-black">SEARCH_PROTOCOL_ACTIVE_v16</p>
                <form onSubmit={handleSearchSubmit}>
                  <input 
                    autoFocus
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    className={`w-full bg-transparent text-5xl md:text-8xl font-black uppercase italic tracking-tighter outline-none border-b-2 border-zinc-900 pb-12 text-center text-white placeholder:text-zinc-900 focus:border-[#D90429] transition-all duration-1000 ${language === 'fa' ? 'font-farsi' : ''}`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
             </div>

             <div className="flex flex-col items-center gap-12">
                <span className="lab-tag text-zinc-700 !text-[9px] tracking-[0.8em]">OR // NEURAL_VISUAL_DECODER</span>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isVisualSearching}
                  className="flex items-center gap-6 px-16 py-8 bg-white/5 border border-white/10 hover:border-[#D90429] transition-all rounded-[3px] group shadow-2xl"
                >
                   {isVisualSearching ? (
                     <div className="w-5 h-5 border-2 border-[#D90429] border-t-transparent rounded-full animate-spin"></div>
                   ) : (
                     <svg className="w-6 h-6 text-[#D90429]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                   )}
                   <span className="lab-tag text-white !text-[10px] tracking-[0.5em] font-black uppercase">UPLOAD_AESTHETIC_SEED</span>
                </button>
                <input type="file" ref={fileInputRef} onChange={handleVisualSearch} hidden accept="image/*" />
             </div>
           </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
