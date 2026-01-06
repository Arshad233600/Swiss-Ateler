
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../store/context';

const BottomTab: React.FC = () => {
  const location = useLocation();
  const { cart, t, language } = useApp();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { 
      path: '/', 
      label: t('atelier'), 
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    { 
      path: '/resale', 
      label: t('sell' as any), 
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    { 
      path: '/products', 
      label: t('archive'), 
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M4 6h16M4 12h16m-7 6h7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    { 
      path: '/cart', 
      label: t('bag'), 
      icon: (
        <div className="relative">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#D90429] text-white text-[7px] min-w-[12px] h-[12px] rounded-full flex items-center justify-center font-black animate-pulse shadow-[0_0_8px_#D90429]">
              {cartCount}
            </span>
          )}
        </div>
      )
    },
    { 
      path: '/profile', 
      label: t('id'), 
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  return (
    <div className="fixed bottom-8 left-0 right-0 z-[800] flex justify-center px-4 pointer-events-none">
      <div className={`bg-zinc-950/90 backdrop-blur-2xl h-16 w-full max-w-[440px] rounded-full flex items-center justify-between px-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 pointer-events-auto relative overflow-hidden ${language === 'fa' ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path === '/products' && location.pathname.startsWith('/product'));
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className="flex flex-col items-center justify-center w-14 h-full relative group transition-all"
            >
              <div className={`transition-all duration-500 ${isActive ? 'text-white scale-110 -translate-y-1' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                {item.icon}
              </div>
              
              <span className={`text-[7px] font-black uppercase tracking-widest mt-1 transition-all ${isActive ? 'text-white opacity-100' : 'text-zinc-600 opacity-60'} ${language === 'fa' ? 'font-farsi' : ''}`}>
                {item.label}
              </span>

              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-[#D90429] rounded-full shadow-[0_0_12px_#D90429]"></div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomTab;
