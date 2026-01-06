
import React, { useState, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { cartTools } from '../services/gemini';
import { useApp } from '../store/context';
import { PRODUCTS } from '../constants';

const LiveConcierge: React.FC = () => {
  const { addToCart, language } = useApp();
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const audioSources = useRef(new Set<AudioBufferSourceNode>());
  const nextStartTimeRef = useRef(0);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const startSession = async () => {
    setIsConnecting(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    
    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: () => { setIsConnecting(false); setIsActive(true); },
        onmessage: async (msg: LiveServerMessage) => {
          if (msg.toolCall) {
            for (const fc of msg.toolCall.functionCalls) {
              if (fc.name === 'addItemToCart') {
                const { productId, color, size } = fc.args as any;
                const product = PRODUCTS.find(p => p.id === productId);
                if (product) addToCart(product, color, size);
                sessionPromise.then(s => s.sendToolResponse({ functionResponses: { id: fc.id, name: fc.name, response: { result: "OK" } } }));
              }
            }
          }
          const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audioData && audioContextRef.current) {
            const binary = atob(audioData);
            const bytes = new Uint8Array(binary.length);
            for(let i=0; i<binary.length; i++) bytes[i] = binary.charCodeAt(i);
            const int16 = new Int16Array(bytes.buffer);
            const buffer = audioContextRef.current.createBuffer(1, int16.length, 24000);
            const chan = buffer.getChannelData(0);
            for(let i=0; i<int16.length; i++) chan[i] = int16[i] / 32768;
            const source = audioContextRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContextRef.current.destination);
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioContextRef.current.currentTime);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            audioSources.current.add(source);
          }
        },
        onclose: () => setIsActive(false),
      },
      config: {
        responseModalities: [Modality.AUDIO],
        tools: [{ functionDeclarations: cartTools }],
        systemInstruction: "You are the Swiss Atelier Live Concierge."
      }
    });
    sessionRef.current = await sessionPromise;
  };

  // Stacked higher than ChatBot (bottom-32) by adding offset
  return (
    <div className={`fixed bottom-52 ${language === 'fa' ? 'left-8' : 'right-8'} z-[900]`}>
      {!isActive ? (
        <button 
          onClick={startSession} 
          className="w-14 h-14 bg-white text-zinc-950 flex items-center justify-center shadow-2xl hover:bg-zinc-950 hover:text-white transition-all duration-500 rounded-xl border border-zinc-100 group relative"
          title="VOICE_PROTOCOL"
        >
          {isConnecting ? (
            <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-7 h-7 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 10v1a7 7 0 01-14 0v-1M12 18v4m-4 0h8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
          <span className="absolute -left-20 opacity-0 group-hover:opacity-100 lab-tag text-[7px] bg-zinc-950 text-white px-2 py-1 transition-all rounded shadow-xl whitespace-nowrap">LIVE_VOICE</span>
        </button>
      ) : (
        <div className="flex items-center gap-4 bg-zinc-950 p-4 shadow-3xl rounded-2xl animate-in slide-in-from-right-5 duration-500 border border-white/5">
           <div className="flex gap-1 items-end h-8 px-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-1.5 bg-[#D90429] rounded-full animate-pulse shadow-[0_0_8px_#D90429]" style={{ height: `${40 + Math.random()*60}%`, animationDelay: `${i*0.1}s` }} />
              ))}
           </div>
           <button 
             onClick={() => { sessionRef.current?.close(); setIsActive(false); }} 
             className="bg-white/10 text-white p-2 rounded-xl hover:bg-[#D90429] transition-all"
           >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
           </button>
        </div>
      )}
    </div>
  );
};

export default LiveConcierge;
