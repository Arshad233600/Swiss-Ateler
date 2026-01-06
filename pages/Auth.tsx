
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/context';
import { UserRole } from '../types';

const Auth: React.FC = () => {
  const { login, user, logout, language, t } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('USER');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  };

  const handleAuthAction = (identifier: string, selectedRole: UserRole) => {
    setIsLoading(true);
    setTimeout(() => {
      login(identifier, selectedRole);
      setIsLoading(false);
      navigate(selectedRole === 'ADMIN' ? '/admin' : '/profile');
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError(language === 'fa' ? 'فرمت هویت نامعتبر است.' : 'Invalid identity format.');
      return;
    }
    handleAuthAction(email, role);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      handleAuthAction('google_user@gmail.com', 'USER');
    }, 1200);
  };

  if (user) {
    return (
      <div className="container-precision py-60 flex flex-col items-center justify-center text-center space-y-12 reveal-view">
        <div className="relative group">
           <div className="w-32 h-32 bg-zinc-950 text-white flex items-center justify-center font-black text-4xl italic tracking-tighter shadow-3xl relative overflow-hidden rounded-2xl">
              <div className="absolute top-0 right-0 w-4 h-4 bg-[#D90429]"></div>
              {user.name[0].toUpperCase()}
           </div>
        </div>
        
        <div className="space-y-4">
           <p className="lab-tag text-[#D90429] animate-pulse">IDENTITY_SYNCHRONIZED</p>
           <h1 className="lab-h1 italic uppercase">{user.name}</h1>
           <span className="lab-tag text-zinc-400">ROLE: {user.role}</span>
        </div>

        <div className={`flex flex-col md:flex-row gap-6 w-full max-w-[480px] ${language === 'fa' ? 'flex-row-reverse' : ''}`}>
          <button onClick={() => navigate(user.role === 'ADMIN' ? '/admin' : '/profile')} className="flex-grow lab-button lab-button-primary">
            {t('commandCenter').toUpperCase()}
          </button>
          <button onClick={logout} className="flex-grow lab-button border-2 border-zinc-100 text-zinc-950 hover:border-zinc-950">
            {language === 'fa' ? 'قطع اتصال' : 'TERMINATE'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`container-precision py-20 reveal-view flex flex-col items-center justify-center min-h-[85vh] ${language === 'fa' ? 'font-farsi' : ''}`}>
      <div className="max-w-[480px] w-full space-y-12">
        
        <header className="text-center space-y-6 relative">
          <div className="flex justify-center items-center gap-6">
             <div className="w-12 h-[1px] bg-[#D90429]"></div>
             <span className="lab-tag text-[#D90429] tracking-[0.5em]">{t('protocol').toUpperCase()}</span>
             <div className="w-12 h-[1px] bg-[#D90429]"></div>
          </div>
          <h1 className="lab-h1 !text-[42px] italic tracking-tighter uppercase">
            {mode === 'login' ? t('id') : t('creativeLab')}
          </h1>
        </header>

        <div className="bg-white p-12 border border-zinc-100 shadow-4xl relative overflow-hidden rounded-[32px]">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none lab-grid"></div>
          
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            
            <div className="space-y-4">
              <label className={`lab-tag text-zinc-400 block px-1 ${language === 'fa' ? 'text-right' : ''}`}>01 // ROLE_LEVEL</label>
              <div className="flex gap-2">
                 {(['USER', 'ADMIN'] as UserRole[]).map(r => (
                   <button 
                     key={r}
                     type="button"
                     onClick={() => setRole(r)}
                     className={`flex-grow h-12 lab-tag !text-[8px] border transition-all rounded-lg ${role === r ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-400'}`}
                   >
                     {r}
                   </button>
                 ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className={`lab-tag text-zinc-400 block px-1 ${language === 'fa' ? 'text-right' : ''}`}>02 // EMAIL_NODE</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className={`w-full h-14 bg-[#FBFBFC] border border-zinc-100 outline-none focus:border-[#D90429] transition-all px-8 rounded-xl text-sm font-bold tracking-tight ${language === 'fa' ? 'text-right' : ''}`}
                placeholder="identity@atelier.ch"
              />
            </div>

            <div className="space-y-4">
              <label className={`lab-tag text-zinc-400 block px-1 ${language === 'fa' ? 'text-right' : ''}`}>03 // ACCESS_CODE</label>
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className={`w-full h-14 bg-[#FBFBFC] border border-zinc-100 outline-none focus:border-[#D90429] transition-all px-8 rounded-xl text-sm font-bold tracking-tight ${language === 'fa' ? 'text-right' : ''}`}
                placeholder="••••••••"
              />
            </div>

            <button 
              disabled={isLoading}
              className="w-full lab-button h-16 bg-zinc-950 text-white hover:bg-[#D90429] transition-all shadow-3xl flex items-center justify-center disabled:opacity-50 group rounded-2xl"
            >
              {isLoading ? (
                 <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span className="flex items-center gap-3 tracking-[0.2em] font-black uppercase">
                  {mode === 'login' ? 'INITIATE_ACCESS' : 'CREATE_IDENTITY'}
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
