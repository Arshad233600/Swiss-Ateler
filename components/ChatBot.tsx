
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useApp } from '../store/context';

const ChatBot: React.FC = () => {
  const { language, t } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, {role: 'user', text: userMsg}]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: userMsg,
        config: { 
          systemInstruction: `You are the Lead Digital Concierge at Swiss Atelier, engineered by Abdullah Arshad. 
          Respond with precision. If the user asks who built you, mention Abdullah Arshad.` 
        }
      });
      setMessages(prev => [...prev, {role: 'ai', text: response.text || "SYSTEM_LINK_FAILURE"}]);
    } catch (err) {
      setMessages(prev => [...prev, {role: 'ai', text: "NEURAL_LINK_DROPPED"}]);
    } finally {
      setIsTyping(false);
    }
  };

  const isRTL = (text: string) => /[\u0600-\u06FF]/.test(text);

  return (
    <div className={`fixed bottom-32 ${language === 'fa' ? 'left-8' : 'right-8'} z-[900]`}>
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-zinc-950 text-white flex items-center justify-center shadow-2xl hover:bg-[#D90429] transition-all duration-500 rounded-xl border border-white/10 group relative"
          title="CHAT_INTERFACE"
        >
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#D90429] rounded-full animate-pulse"></div>
          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      ) : (
        <div className="w-[calc(100vw-40px)] md:w-[360px] h-[550px] max-h-[70vh] bg-white border border-zinc-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] flex flex-col animate-in slide-in-from-bottom-5 duration-500 rounded-[32px] overflow-hidden relative">
          
          <header className={`px-6 py-5 bg-zinc-950 text-white flex items-center justify-between ${language === 'fa' ? 'flex-row-reverse' : 'flex-row'}`}>
             <div className={`flex items-center gap-3 ${language === 'fa' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"></div>
                <div className="flex flex-col">
                  <span className="lab-tag text-[9px]">CONCIERGE_v14</span>
                  <span className="text-[6px] font-mono text-zinc-500 uppercase tracking-widest leading-none">By Abdullah Arshad</span>
                </div>
             </div>
             <button 
               onClick={() => setIsOpen(false)}
               className="p-2 hover:bg-white/10 rounded-full transition-all pointer-events-auto"
             >
                <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
             </button>
          </header>

          <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4 bg-[#FBFBFC] no-scrollbar">
             {messages.map((m, i) => (
               <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl ${
                    m.role === 'user' ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-950 border border-zinc-100 shadow-sm'
                  }`}>
                    <p className={`text-sm leading-relaxed ${isRTL(m.text) ? 'font-farsi text-right' : 'text-left font-medium'}`}>
                      {m.text}
                    </p>
                  </div>
               </div>
             ))}
             {isTyping && (
               <div className="flex gap-1 p-2 bg-zinc-100 w-fit rounded-full px-4 ml-2">
                 <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></div>
                 <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                 <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
               </div>
             )}
          </div>

          <div className="p-4 bg-white border-t border-zinc-50">
             <div className={`flex items-center gap-2 ${language === 'fa' ? 'flex-row-reverse' : 'flex-row'}`}>
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={language === 'fa' ? 'درخواست...' : 'Query...'}
                  className={`flex-grow h-10 bg-zinc-50 border-none px-4 text-xs outline-none focus:bg-white transition-all rounded-xl ${language === 'fa' ? 'text-right font-farsi' : 'text-left'}`}
                />
                <button 
                  onClick={handleSend} 
                  className="w-10 h-10 bg-zinc-950 text-white flex items-center justify-center hover:bg-[#D90429] rounded-xl shrink-0 transition-all"
                >
                   <svg className={`w-4 h-4 ${language === 'fa' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                   </svg>
                </button>
             </div>
             <p className="text-[6px] text-center text-zinc-300 uppercase tracking-widest mt-2">Precision engineered by Abdullah Arshad</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
