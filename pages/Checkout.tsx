
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/context';
import { Order } from '../types';

type Step = 'shipping' | 'payment' | 'confirmation';

const Checkout: React.FC = () => {
  const { cart, clearCart, addOrder, language, t } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingData, setShippingData] = useState({ name: '', address: '', city: '', postal: '', country: 'Switzerland' });

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleFinalize = () => {
    setIsProcessing(true);
    
    // Create formal order record
    const newOrder: Order = {
      id: `SA-ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      date: new Date().toLocaleDateString('de-CH'),
      items: [...cart],
      total: subtotal,
      status: 'ARCHIVED'
    };

    setTimeout(() => {
      setIsProcessing(false);
      addOrder(newOrder);
      clearCart();
      setStep('confirmation');
    }, 3500);
  };

  if (cart.length === 0 && step !== 'confirmation') {
    return <div className="min-h-screen flex items-center justify-center lab-tag">NO_ACQUISITION_ACTIVE</div>;
  }

  return (
    <div className={`min-h-screen pt-32 pb-60 bg-white reveal-view ${language === 'fa' ? 'font-farsi' : ''}`}>
      <div className="container-precision max-w-5xl">
        
        {/* Step Indicator */}
        <div className="flex justify-between items-center mb-24 relative">
           <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-zinc-100 -z-10"></div>
           {['shipping', 'payment', 'confirmation'].map((s, i) => (
             <div key={s} className="flex flex-col items-center gap-4 bg-white px-6">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center lab-tag !text-[10px] border transition-all ${step === s ? 'bg-zinc-950 text-white border-zinc-950' : 'bg-white text-zinc-300 border-zinc-100'}`}>
                  0{i + 1}
                </div>
                <span className={`lab-tag !text-[7px] tracking-[0.3em] ${step === s ? 'text-zinc-950 font-black' : 'text-zinc-300'}`}>{s.toUpperCase()}</span>
             </div>
           ))}
        </div>

        {step === 'shipping' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 animate-in fade-in duration-700">
             <div className="lg:col-span-7 space-y-10">
                <h2 className="lab-h2 italic border-b border-zinc-100 pb-6 uppercase">Shipping_Protocol</h2>
                <div className="space-y-6">
                   <input 
                     type="text" 
                     placeholder="FULL_IDENTITY" 
                     className="w-full bg-[#FBFBFC] border border-zinc-100 p-5 rounded-lg lab-tag !text-[10px] outline-none focus:border-[#D90429] transition-all"
                     value={shippingData.name}
                     onChange={(e) => setShippingData({...shippingData, name: e.target.value})}
                   />
                   <textarea 
                     placeholder="PHYSICAL_DESTINATION_ADDRESS" 
                     className="w-full bg-[#FBFBFC] border border-zinc-100 p-5 rounded-lg lab-tag !text-[10px] outline-none focus:border-[#D90429] transition-all min-h-[120px]"
                     value={shippingData.address}
                     onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                   />
                   <div className="grid grid-cols-2 gap-6">
                      <input 
                        type="text" 
                        placeholder="CITY" 
                        className="bg-[#FBFBFC] border border-zinc-100 p-5 rounded-lg lab-tag !text-[10px] outline-none"
                        value={shippingData.city}
                        onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                      />
                      <input 
                        type="text" 
                        placeholder="POSTAL_CODE" 
                        className="bg-[#FBFBFC] border border-zinc-100 p-5 rounded-lg lab-tag !text-[10px] outline-none"
                        value={shippingData.postal}
                        onChange={(e) => setShippingData({...shippingData, postal: e.target.value})}
                      />
                   </div>
                </div>
                <button onClick={() => setStep('payment')} className="w-full lab-button lab-button-primary h-16 rounded-xl">Initialize_Payment</button>
             </div>
             <div className="lg:col-span-5 bg-zinc-50 p-10 rounded-2xl border border-zinc-100 h-fit">
                <h3 className="lab-tag text-zinc-400 mb-8 block">ACQUISITION_SUMMARY</h3>
                <div className="space-y-4">
                   {cart.map(item => (
                     <div key={item.id} className="flex justify-between items-center lab-tag !text-[8px]">
                        <span className="text-zinc-600 italic">{item.quantity}x {item.name[language]}</span>
                        <span className="text-zinc-950 font-black">CHF {(item.price * item.quantity).toLocaleString()}</span>
                     </div>
                   ))}
                   <div className="pt-6 border-t border-zinc-200 flex justify-between items-baseline">
                      <span className="lab-tag text-zinc-950 font-black">TOTAL</span>
                      <span className="text-3xl font-black italic tracking-tighter">CHF {subtotal.toLocaleString()}</span>
                   </div>
                </div>
             </div>
          </div>
        )}

        {step === 'payment' && (
          <div className="max-w-xl mx-auto space-y-12 animate-in zoom-in-95 duration-500 text-center">
             <div className="p-12 bg-zinc-950 text-white rounded-3xl relative overflow-hidden group shadow-4xl">
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none lab-grid"></div>
                <div className="relative z-10 space-y-10">
                   <div className="flex justify-between items-center">
                      <div className="w-12 h-8 bg-zinc-800 rounded-sm"></div>
                      <span className="lab-tag text-zinc-500 !text-[8px]">VISA / MASTERCARD / AMEX</span>
                   </div>
                   <input type="text" placeholder="CARD_NUMBER" className="w-full bg-transparent border-b border-white/10 py-4 text-2xl font-black tracking-[0.2em] outline-none focus:border-[#D90429] text-center" />
                   <div className="grid grid-cols-2 gap-10">
                      <input type="text" placeholder="EXP_DATE" className="bg-transparent border-b border-white/10 py-4 text-center lab-tag outline-none" />
                      <input type="text" placeholder="CVV_CODE" className="bg-transparent border-b border-white/10 py-4 text-center lab-tag outline-none" />
                   </div>
                </div>
             </div>
             <button onClick={handleFinalize} disabled={isProcessing} className={`w-full h-20 lab-button transition-all duration-700 shadow-3xl rounded-2xl ${isProcessing ? 'bg-zinc-100 text-zinc-400' : 'lab-button-primary'}`}>
                {isProcessing ? 'SYNCHRONIZING_WITH_VAULT...' : 'AUTHORIZE_TRANSACTION'}
             </button>
          </div>
        )}

        {step === 'confirmation' && (
          <div className="text-center space-y-12 py-20 animate-in fade-in duration-1000">
             <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
             </div>
             <div className="space-y-4">
                <h1 className="lab-huge !text-[4rem] italic text-zinc-950">Acquisition_Success</h1>
                <p className="lab-tag text-zinc-400 tracking-[0.8em]">PROTOCOL_ID: SA-{(Math.random()*1000000).toFixed(0)}</p>
             </div>
             <p className="lab-body italic text-zinc-500 uppercase max-w-lg mx-auto">
                {language === 'fa' ? 'واحد شما با موفقیت در آرشیو ثبت شد. ایمیل تاییدیه ارسال گردید.' : 'Unit successfully recorded in archive. Dispatch protocol initiated.'}
             </p>
             <button onClick={() => navigate('/')} className="lab-button lab-button-primary px-16 rounded-xl">RETURN_TO_ARCHIVE</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
