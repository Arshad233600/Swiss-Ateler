
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../store/context';

const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, language, t } = useApp();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center container-precision reveal-view text-center space-y-12">
        <h1 className="lab-huge !text-[5rem] text-zinc-100 italic">Vault_Empty</h1>
        <p className="lab-tag text-zinc-400">NO_UNITS_IDENTIFIED</p>
        <Link to="/products" className="lab-button lab-button-primary px-20 rounded-xl">Re-Enter Archive</Link>
      </div>
    );
  }

  return (
    <div className="container-precision pt-16 pb-60 reveal-view">
      <header className={`border-b border-zinc-100 pb-16 mb-24 flex justify-between items-end ${language === 'fa' ? 'flex-row-reverse' : ''}`}>
        <h1 className="lab-h1 !text-[4rem] italic uppercase tracking-tighter">Manifest_Cart</h1>
        <span className="lab-tag text-zinc-300 italic">UNITS: {cart.length}</span>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
        <div className="lg:col-span-8 space-y-12">
          {cart.map(item => (
            <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className={`flex flex-col sm:flex-row gap-12 pb-12 border-b border-zinc-50 ${language === 'fa' ? 'sm:flex-row-reverse' : ''}`}>
              <div className="w-full sm:w-48 aspect-specimen bg-zinc-50 border border-zinc-100 rounded-sm overflow-hidden">
                <img src={item.images[0]} alt="" className="w-full h-full object-cover saturate-0 hover:saturate-100 transition-all duration-1000" />
              </div>
              <div className="flex-grow flex flex-col justify-between py-2">
                <div className={`${language === 'fa' ? 'text-right' : ''}`}>
                   <h3 className="text-2xl font-black italic tracking-tighter uppercase">{item.name[language]}</h3>
                   <p className="lab-tag text-zinc-400 !text-[8px] mt-2">{item.selectedColor} // {item.selectedSize}</p>
                </div>
                <div className={`flex justify-between items-center mt-10 ${language === 'fa' ? 'flex-row-reverse' : ''}`}>
                  <div className="flex items-center border border-zinc-100 rounded-lg overflow-hidden">
                    <button onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedSize, -1)} className="w-10 h-10 flex items-center justify-center hover:bg-zinc-950 hover:text-white transition-all">–</button>
                    <span className="w-12 text-center lab-tag !text-zinc-950">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedSize, 1)} className="w-10 h-10 flex items-center justify-center hover:bg-zinc-950 hover:text-white transition-all">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedSize)} className="lab-tag !text-[8px] text-zinc-300 hover:text-[#D90429] transition-all">PURGE_UNIT</button>
                </div>
              </div>
              <div className={`text-right ${language === 'fa' ? 'text-left' : ''}`}>
                 <span className="text-2xl font-thin italic">CHF {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4 h-fit sticky top-32">
          <div className="bg-zinc-950 p-10 text-white space-y-10 rounded-[24px] shadow-3xl">
             <div className="space-y-6">
               <div className="flex justify-between items-baseline border-b border-white/5 pb-6">
                 <span className="text-xl font-black italic text-zinc-500">TOTAL</span>
                 <span className="text-5xl font-black italic tracking-tighter">CHF {subtotal.toLocaleString()}</span>
               </div>
             </div>
             <button onClick={() => navigate('/checkout')} className="w-full h-16 lab-button bg-white text-zinc-950 hover:bg-[#D90429] hover:text-white transition-all rounded-xl shadow-2xl">CONFIRM_ACQUISITION</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
