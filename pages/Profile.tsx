
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../store/context';
import { SubscriptionTier } from '../types';
import { getStylingAdvice } from '../services/gemini';

const Profile: React.FC = () => {
  const { user, logout, upgradeTier, orders, t, language } = useApp();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'archive' | 'tiers' | 'security'>('dashboard');
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  useEffect(() => {
    if (user && !aiReport) {
      setIsAuditing(true);
      const prompt = `User: ${user.name}, Tier: ${user.tier}, Trust: ${user.trustScore}. Provide a 2-line strategic aesthetic update for a high-end Swiss fashion profile.`;
      getStylingAdvice("System_User_Audit", prompt).then(res => {
        setAiReport(res);
        setIsAuditing(false);
      });
    }
  }, [user]);

  if (!user) return <Navigate to="/auth" />;

  const currentLimit = user.tier === 'Free' ? 5 : user.tier === 'Pro' ? 50 : 9999;
  const usagePercent = Math.min(100, (user.monthlyListingsUsed / currentLimit) * 100);

  return (
    <div className={`min-h-screen pt-24 pb-60 reveal-view ${language === 'fa' ? 'font-farsi' : ''}`}>
      <header className="container-precision mb-24 relative">
        <div className={`flex flex-col md:flex-row justify-between items-end gap-12 border-b border-zinc-100 pb-16 ${language === 'fa' ? 'flex-row-reverse' : ''}`}>
           <div className={`space-y-6 ${language === 'fa' ? 'text-right' : ''}`}>
              <div className={`flex items-center gap-4 ${language === 'fa' ? 'flex-row-reverse' : ''}`}>
                 <div className="w-16 h-[2px] bg-[#D90429] shadow-[0_0_15px_#D90429]"></div>
                 <span className="lab-tag text-[#D90429] !text-[9px] tracking-[0.5em]">IDENTITY_CORE_v15.0</span>
              </div>
              <h1 className="lab-h1 !text-[clamp(2.5rem,7vw,5rem)] leading-none italic tracking-tighter uppercase select-none">
                {t('commandCenter')}
              </h1>
           </div>

           <div className="flex gap-2 p-1 bg-zinc-50 border border-zinc-100 rounded-2xl">
              {['dashboard', 'archive', 'tiers'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-8 py-3 lab-tag !text-[8px] transition-all duration-500 rounded-xl ${activeTab === tab ? 'bg-zinc-950 text-white shadow-2xl' : 'text-zinc-400 hover:text-zinc-950'}`}
                >
                  {t(tab as any).toUpperCase()}
                </button>
              ))}
           </div>
        </div>
      </header>

      <main className="container-precision">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 space-y-12">
               <div className="bg-zinc-950 p-12 text-white rounded-[40px] shadow-3xl relative overflow-hidden group">
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none lab-grid"></div>
                  <div className="relative z-10 flex justify-between items-start">
                     <div className="w-24 h-24 bg-white text-zinc-950 flex items-center justify-center font-black text-4xl italic tracking-tighter shadow-2xl rounded-2xl">
                        {user.name[0].toUpperCase()}
                     </div>
                     <div className="text-right">
                        <span className="lab-tag text-zinc-600 block mb-2">TRUST_INDEX</span>
                        <span className={`text-4xl font-black italic tracking-tighter ${user.trustScore >= 95 ? 'text-emerald-500' : 'text-rose-500'}`}>{user.trustScore}%</span>
                     </div>
                  </div>
                  <div className={`mt-12 space-y-6 relative z-10 ${language === 'fa' ? 'text-right' : ''}`}>
                     <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">{user.name}</h2>
                     <p className="lab-tag text-zinc-500 !text-[8px]">{user.email}</p>
                  </div>
                  <button onClick={logout} className="mt-12 w-full h-14 border border-white/5 lab-tag !text-[8px] text-zinc-500 hover:text-white hover:bg-[#D90429] transition-all rounded-xl">TERMINATE_PROTOCOL</button>
               </div>
            </div>

            <div className="lg:col-span-8 space-y-12">
               <div className="p-10 bg-[#FBFBFC] border border-zinc-100 rounded-[40px] space-y-8 relative overflow-hidden">
                  <div className={`flex items-center gap-4 border-b border-zinc-100 pb-6 ${language === 'fa' ? 'flex-row-reverse' : ''}`}>
                     <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_#6366f1]"></div>
                     <span className="lab-tag text-zinc-400 !text-[8px]">NEURAL_STRATEGIC_AUDIT</span>
                  </div>
                  <p className={`text-2xl font-light italic text-zinc-600 uppercase tracking-tight ${language === 'fa' ? 'font-farsi text-right' : ''}`}>
                    "{isAuditing ? 'CALIBRATING...' : aiReport}"
                  </p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="bg-white border border-zinc-100 p-10 rounded-[40px] space-y-10 group">
                     <h3 className="lab-tag text-zinc-400 !text-[8px]">{t('resourceQuota')}</h3>
                     <div className="space-y-6">
                        <div className="flex justify-between items-baseline">
                           <span className="text-7xl font-black italic tracking-tighter">{user.monthlyListingsUsed}</span>
                           <span className="lab-tag text-zinc-300">/ {currentLimit} UNITS</span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-50 rounded-full overflow-hidden">
                           <div className="h-full bg-zinc-950 transition-all duration-[2s]" style={{ width: `${usagePercent}%` }}></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'archive' && (
          <div className="space-y-12 animate-in fade-in duration-700">
             <div className="flex justify-between items-center mb-10">
                <h2 className="lab-h1 italic uppercase">{language === 'fa' ? 'بایگانی واحدها' : 'ACQUISITION_ARCHIVE'}</h2>
                <span className="lab-tag text-zinc-300">TOTAL_RECORDS: {orders.length}</span>
             </div>

             {orders.length === 0 ? (
                <div className="py-40 text-center border border-dashed border-zinc-100 rounded-3xl">
                   <p className="lab-tag text-zinc-200">NO_RECORDS_IDENTIFIED_IN_VAULT</p>
                </div>
             ) : (
                <div className="space-y-8">
                   {orders.map(order => (
                      <div key={order.id} className="p-8 bg-zinc-50 border border-zinc-100 rounded-2xl flex flex-col md:flex-row justify-between gap-10 group hover:border-zinc-950 transition-all">
                         <div className="space-y-4">
                            <div className="flex items-center gap-4">
                               <span className="lab-tag text-[#D90429] !text-[8px]">{order.status}</span>
                               <span className="text-xl font-black italic tracking-tighter">{order.id}</span>
                            </div>
                            <p className="lab-tag text-zinc-400 !text-[7px]">ACQUISITION_DATE: {order.date}</p>
                            <div className="flex -space-x-4">
                               {order.items.map((item, idx) => (
                                  <div key={idx} className="w-12 h-16 border-2 border-white rounded-lg overflow-hidden bg-white shadow-sm">
                                     <img src={item.images[0]} className="w-full h-full object-cover saturate-0" alt="" />
                                  </div>
                               ))}
                            </div>
                         </div>
                         <div className="flex flex-col items-end justify-center">
                            <span className="lab-tag text-zinc-300 !text-[7px] mb-2">SETTLEMENT_VALUE</span>
                            <span className="text-4xl font-black italic tracking-tighter">CHF {order.total.toLocaleString()}</span>
                            <button className="mt-4 lab-tag !text-[6px] text-indigo-500 hover:text-zinc-950 transition-colors">GENERATE_CERTIFICATE →</button>
                         </div>
                      </div>
                   ))}
                </div>
             )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
