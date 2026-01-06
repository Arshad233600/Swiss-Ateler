
import React, { ReactNode, useState, useEffect, useCallback } from 'react';
import Navbar from './Navbar';
import BottomTab from './BottomTab';
import ChatBot from './ChatBot';
import LiveConcierge from './LiveConcierge';
import { performGlobalDesignAudit } from '../services/gemini';
import { useLocation, Link } from 'react-router-dom';
import { useApp } from '../store/context';

interface LayoutProps { children: ReactNode; }

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { t, language } = useApp();
  const [zurichTime, setZurichTime] = useState('');
  const [integrity, setIntegrity] = useState(100);
  const [systemState, setSystemState] = useState<'STABLE' | 'SCANNING' | 'REPAIRING'>('STABLE');
  const [neuralFixes, setNeuralFixes] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setZurichTime(new Intl.DateTimeFormat('de-CH', {
        timeZone: 'Europe/Zurich',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      }).format(new Date()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const runAutonomousHealing = useCallback(async () => {
    setSystemState('SCANNING');
    document.body.classList.add('healing-active');
    try {
      const result = await performGlobalDesignAudit(location.pathname);
      if (result.status === 'DRIFT_DETECTED' || result.integrityScore < 100) {
        setSystemState('REPAIRING');
        setIntegrity(result.integrityScore);
        if (result.cssRepairPayload) {
          setNeuralFixes(prev => prev + "\n" + result.cssRepairPayload);
        }
        setTimeout(() => {
          setSystemState('STABLE');
          setIntegrity(100);
          document.body.classList.remove('healing-active');
        }, 3000);
      } else {
        setSystemState('STABLE');
        setIntegrity(100);
        document.body.classList.remove('healing-active');
      }
    } catch (e) {
      setSystemState('STABLE');
      document.body.classList.remove('healing-active');
    }
  }, [location.pathname]);

  useEffect(() => {
    runAutonomousHealing();
    const guard = setInterval(runAutonomousHealing, 60000);
    return () => clearInterval(guard);
  }, [runAutonomousHealing]);

  return (
    <div className={`min-h-screen flex flex-col relative bg-white selection:bg-[#D90429] selection:text-white ${language === 'fa' ? 'font-farsi' : ''}`}>
      {neuralFixes && <style dangerouslySetInnerHTML={{ __html: neuralFixes }} />}

      {/* SYSTEM_GUARD_HUD */}
      <div className="fixed top-0 left-0 right-0 z-[600] h-12 bg-zinc-950 flex items-center justify-between px-8 border-b border-white/5 backdrop-blur-xl">
        <div className={`flex items-center gap-12 ${language === 'fa' ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="flex items-center gap-3">
             <div className={`w-2 h-2 rounded-full shadow-[0_0_12px] transition-all duration-700 ${systemState === 'STABLE' ? 'bg-emerald-500 shadow-emerald-500' : systemState === 'REPAIRING' ? 'bg-[#D90429] animate-ping shadow-[#D90429]' : 'bg-amber-500 animate-pulse shadow-amber-500'}`}></div>
             <span className="order-tag !text-[8px] text-zinc-100 font-black">SYSTEM_{systemState} // {zurichTime}</span>
          </div>
          <div className="hidden md:block w-[1px] h-4 bg-zinc-800"></div>
          <div className="flex items-center gap-3">
             <span className="order-tag !text-[8px] text-zinc-500 uppercase">Integrity:</span>
             <span className="order-tag !text-[9px] text-white font-black">{integrity}%</span>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
           <span className="order-tag !text-[8px] text-[#D90429] italic font-black animate-pulse">AUTONOMOUS_GUARD_v16</span>
           <div className="flex gap-1.5 items-center">
              {[1, 2, 3].map(i => (
                <div key={i} className={`w-1 h-3 transition-all duration-500 ${integrity >= i * 33 ? (systemState === 'STABLE' ? 'bg-emerald-500' : 'bg-[#D90429]') : 'bg-zinc-800'}`}></div>
              ))}
           </div>
        </div>
      </div>

      <Navbar />
      
      <main className="flex-grow pt-[130px] lg:pt-[160px] relative z-10">
        <div className="reveal-view">
          {children}
        </div>
      </main>
      
      <BottomTab />
      <ChatBot />
      <LiveConcierge />
      
      <footer className="py-40 bg-zinc-950 text-white border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none lab-grid"></div>
        <div className="container-precision grid grid-cols-1 md:grid-cols-3 gap-24 relative z-10">
          <div className={`space-y-10 ${language === 'fa' ? 'text-right' : 'text-left'}`}>
            <Link to="/" className="flex items-center gap-5 group">
               <div className="w-12 h-12 bg-[#D90429] flex items-center justify-center font-black text-white italic rounded-sm shadow-2xl">S</div>
               <span className="text-3xl font-black italic tracking-tighter uppercase">Swiss Atelier</span>
            </Link>
            <p className="order-tag !text-[9px] text-zinc-600 max-w-sm leading-relaxed uppercase">
              The highest standard of Alpine precision e-commerce. Designed for human convenience, governed by Abdullah Arshad's autonomous logic.
            </p>
          </div>
          <div className="space-y-10">
             <h4 className="order-tag !text-[10px] text-zinc-800 tracking-[0.8em]">VAULT_NODES</h4>
             <ul className="space-y-5 order-tag !text-zinc-500">
                <li><Link to="/products" className="hover:text-white transition-all">CENTRAL_ARCHIVE</Link></li>
                <li><Link to="/vision" className="hover:text-white transition-all">NEURAL_EXPERIMENTS</Link></li>
                <li><Link to="/boutiques" className="hover:text-white transition-all">GLOBAL_LOCATIONS</Link></li>
             </ul>
          </div>
          <div className="space-y-10">
             <h4 className="order-tag !text-[10px] text-zinc-800 tracking-[0.8em]">SYSTEM_STABILITY</h4>
             <div className="p-10 bg-white/5 border border-white/5 rounded-3xl flex justify-between items-center shadow-inner">
                <span className="text-6xl font-black italic tracking-tighter">{integrity}%</span>
                <span className="order-tag !text-[8px] text-emerald-500">VERIFIED</span>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
