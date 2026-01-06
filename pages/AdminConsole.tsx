
import React, { useState, useEffect } from 'react';
import { useApp } from '../store/context';
import { PRODUCTS } from '../constants';
import { Product, AdminActionLog, UserRole } from '../types';
import { Navigate } from 'react-router-dom';

const AdminConsole: React.FC = () => {
  const { user, isAdmin, language, t } = useApp();
  const [productList, setProductList] = useState<Product[]>(PRODUCTS as Product[]);
  const [logs, setLogs] = useState<AdminActionLog[]>([]);
  const [activeTab, setActiveTab] = useState<'inventory' | 'audit' | 'users'>('inventory');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Security Check
  if (!user || !isAdmin()) return <Navigate to="/auth" />;

  const recordAction = (action: AdminActionLog['action'], productId: string, productName: string, oldVal: any, newVal: any) => {
    const newLog: AdminActionLog = {
      id: `LOG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      adminId: user.id,
      adminName: user.name,
      action,
      productId,
      productName,
      oldValue: oldVal,
      newValue: newVal,
      timestamp: new Date().toISOString()
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handlePriceUpdate = (id: string, newPrice: number) => {
    const prod = productList.find(p => p.id === id);
    if (!prod) return;
    recordAction('UPDATE_PRICE', id, prod.name[language], prod.price, newPrice);
    setProductList(prev => prev.map(p => p.id === id ? { ...p, price: newPrice } : p));
  };

  const handleStockUpdate = (id: string, newStock: number) => {
    const prod = productList.find(p => p.id === id);
    if (!prod) return;
    recordAction('UPDATE_STOCK', id, prod.name[language], prod.stock || 0, newStock);
    setProductList(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
  };

  const handleDelete = (id: string) => {
    const prod = productList.find(p => p.id === id);
    if (!prod) return;
    if (confirm(`INITIATE_DELETE_PROTOCOL for ${prod.name[language]}?`)) {
      recordAction('REMOVE_PRODUCT', id, prod.name[language], 'ACTIVE', 'DELETED');
      setProductList(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className={`min-h-screen pt-24 pb-48 bg-white reveal-view ${language === 'fa' ? 'font-farsi' : ''}`}>
      <div className="container-precision">
        
        {/* TOP STATUS BAR */}
        <div className="flex justify-between items-center mb-16 border-b border-zinc-100 pb-8">
           <div className={`flex items-center gap-6 ${language === 'fa' ? 'flex-row-reverse' : ''}`}>
              <div className="w-12 h-12 bg-zinc-950 text-white flex items-center justify-center font-black italic rounded-lg">A</div>
              <div className={`${language === 'fa' ? 'text-right' : ''}`}>
                 <h1 className="text-2xl font-black italic tracking-tighter uppercase leading-none">Command_Console</h1>
                 <p className="lab-tag text-zinc-400 !text-[8px] mt-1">OPERATOR: {user.name} // ROLE: {user.role}</p>
              </div>
           </div>
           
           <div className="flex gap-2 p-1 bg-zinc-50 rounded-xl">
              {['inventory', 'audit', 'users'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-8 py-2.5 lab-tag !text-[8px] transition-all rounded-lg ${activeTab === tab ? 'bg-zinc-950 text-white' : 'text-zinc-400 hover:text-zinc-950'}`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
           </div>
        </div>

        {activeTab === 'inventory' && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <div className={`flex justify-between items-center ${language === 'fa' ? 'flex-row-reverse' : ''}`}>
               <h2 className="lab-h2 italic uppercase tracking-tighter">Asset_Management</h2>
               <button className="lab-button lab-button-primary h-12 !px-8 !text-[9px] rounded-lg">ADD_NEW_UNIT +</button>
            </div>

            <div className="grid grid-cols-1 gap-4">
               {productList.map(p => (
                 <div key={p.id} className="group p-6 bg-[#FBFBFC] border border-zinc-100 hover:border-zinc-300 transition-all rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className={`flex items-center gap-6 ${language === 'fa' ? 'flex-row-reverse' : ''}`}>
                       <div className="w-16 h-20 bg-zinc-200 overflow-hidden rounded-lg border border-zinc-100">
                          <img src={p.images[0]} className="w-full h-full object-cover saturate-0 group-hover:saturate-100 transition-all" alt="" />
                       </div>
                       <div className={`${language === 'fa' ? 'text-right' : ''}`}>
                          <p className="lab-tag text-zinc-400 !text-[7px]">REF_{p.id.toUpperCase()}</p>
                          <h3 className="text-lg font-black italic tracking-tighter uppercase">{p.name[language]}</h3>
                          <span className="lab-tag !text-[6px] text-indigo-500">{p.category}</span>
                       </div>
                    </div>

                    <div className={`flex flex-wrap items-center gap-8 ${language === 'fa' ? 'flex-row-reverse' : ''}`}>
                       <div className="space-y-1">
                          <p className="lab-tag text-zinc-400 !text-[7px]">VALUATION</p>
                          <div className="flex items-center gap-2">
                             <span className="text-xs font-mono text-zinc-400">CHF</span>
                             <input 
                               type="number" 
                               defaultValue={p.price}
                               onBlur={(e) => handlePriceUpdate(p.id, Number(e.target.value))}
                               className="w-24 bg-transparent text-xl font-black italic border-b border-zinc-200 focus:border-[#D90429] outline-none"
                             />
                          </div>
                       </div>
                       <div className="space-y-1">
                          <p className="lab-tag text-zinc-400 !text-[7px]">STOCK_COUNT</p>
                          <input 
                            type="number" 
                            defaultValue={p.stock || 12}
                            onBlur={(e) => handleStockUpdate(p.id, Number(e.target.value))}
                            className="w-20 bg-transparent text-xl font-black italic border-b border-zinc-200 focus:border-[#D90429] outline-none"
                          />
                       </div>
                       <div className="flex gap-2">
                          <button className="p-3 bg-zinc-100 hover:bg-zinc-950 hover:text-white transition-all rounded-lg">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2.5"/></svg>
                          </button>
                          <button 
                            onClick={() => handleDelete(p.id)}
                            className="p-3 bg-rose-50 text-[#D90429] hover:bg-[#D90429] hover:text-white transition-all rounded-lg"
                          >
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2.5"/></svg>
                          </button>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="bg-zinc-950 p-12 text-white rounded-[32px] shadow-3xl relative overflow-hidden animate-in zoom-in-95 duration-500">
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none lab-grid"></div>
             <div className="relative z-10 space-y-8">
                <div className="flex justify-between items-center border-b border-white/10 pb-6">
                   <h3 className="lab-tag text-zinc-500 !text-[9px]">ENCRYPTED_AUDIT_TRAIL</h3>
                   <span className="text-[7px] font-mono text-emerald-500">SYSTEM_STABLE_v16.0</span>
                </div>
                
                {logs.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                     <p className="lab-tag text-zinc-700">NO_ACTIONS_RECORDED</p>
                  </div>
                ) : (
                  <div className="space-y-4 font-mono text-[9px] uppercase tracking-widest">
                    {logs.map(log => (
                      <div key={log.id} className="p-4 bg-white/5 border-l-2 border-[#D90429] flex flex-col md:flex-row justify-between gap-4 group hover:bg-white/10 transition-all">
                         <div className="space-y-1">
                            <span className="text-[#D90429] font-bold">[{log.timestamp.split('T')[1].substr(0, 8)}] {log.action}</span>
                            <p className="text-zinc-400">ADMIN: {log.adminName} // PRODUCT: {log.productName}</p>
                         </div>
                         <div className="text-right">
                            <p className="text-zinc-500">MODIFICATION:</p>
                            <span className="text-zinc-300">{log.oldValue} <span className="text-[#D90429]">→</span> {log.newValue}</span>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminConsole;
