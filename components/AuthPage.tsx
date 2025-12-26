import React, { useState } from 'react';
import { ShieldCheck, Smartphone, Lock, ArrowRight, Fingerprint, Activity, ChevronLeft, User, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AuthPageProps {
  onLogin: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [view, setView] = useState<'welcome' | 'login' | 'register'>('welcome');
  const [phone, setPhone] = useState('+998 ');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validatePhone = (p: string) => p.trim().length >= 13; // +998 XX XXX XX XX

  const handleLogin = () => {
    setError('');
    
    if (!validatePhone(phone)) {
        setError("Telefon raqamni to'liq kiriting");
        return;
    }
    if (password.length < 4) {
        setError("Parol noto'g'ri");
        return;
    }
    
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
        setIsLoading(false);
        onLogin();
    }, 1500);
  };

  const handleRegister = () => {
    setError('');

    if (name.length < 3) {
        setError("Ismingizni to'liq kiriting");
        return;
    }
    if (!validatePhone(phone)) {
        setError("Telefon raqamni to'liq kiriting");
        return;
    }
    if (password.length < 4) {
        setError("Parol kamida 4 ta belgidan iborat bo'lishi kerak");
        return;
    }
    if (password !== confirmPassword) {
        setError("Parollar mos kelmadi");
        return;
    }

    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        onLogin(); // Auto login after register
    }, 1500);
  };

  const handleBiometric = () => {
    setIsLoading(true);
    // Face ID simulation
    setTimeout(() => {
        setIsLoading(false);
        onLogin();
    }, 1000);
  };

  // Welcome Screen (Onboarding style)
  if (view === 'welcome') {
    return (
      <div className="flex-1 h-full w-full bg-blue-600 flex flex-col items-center justify-between p-6 relative overflow-hidden animate-fade-in">
        {/* Background Patterns */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl -mr-10 -mb-10 pointer-events-none"></div>

        <div className="relative flex-1 flex flex-col items-center justify-center text-center mt-10 z-10 pointer-events-none">
            <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center shadow-2xl shadow-blue-900/20 mb-8 animate-slide-up">
                <Activity size={48} className="text-blue-600" strokeWidth={2} />
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                MediVault AI
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed max-w-xs animate-slide-up" style={{ animationDelay: '0.2s' }}>
                Sizning va oilangizning salomatlik tarixi ishonchli qo'llarda.
            </p>
        </div>

        <div className="relative w-full space-y-4 mb-12 z-50 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <button 
                type="button"
                onClick={() => setView('login')}
                className="w-full bg-white text-blue-600 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/10 hover:bg-blue-50 transition-colors active:scale-95 cursor-pointer relative z-50"
            >
                Kirish
            </button>
            <button 
                type="button"
                onClick={() => setView('register')}
                className="w-full bg-blue-700/50 text-white border border-white/20 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-colors active:scale-95 backdrop-blur-sm cursor-pointer relative z-50"
            >
                Ro'yxatdan o'tish
            </button>
        </div>
      </div>
    );
  }

  // Common Header for Login/Register
  const Header = ({ title, subtitle }: { title: string, subtitle: string }) => (
    <div className="bg-blue-600 h-64 rounded-b-[40px] relative overflow-hidden shrink-0 transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500 to-blue-600"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        
        <div className="relative p-6 pt-12 z-10">
        <button 
            type="button"
            onClick={() => {
                setError('');
                setView('welcome');
            }}
            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white mb-6 hover:bg-white/30 transition-colors cursor-pointer relative z-50"
        >
            <ChevronLeft size={24} />
        </button>
        <h2 className="text-3xl font-bold text-white mb-2 animate-slide-right">{title}</h2>
        <p className="text-blue-100 animate-slide-right" style={{ animationDelay: '0.1s' }}>{subtitle}</p>
        </div>
    </div>
  );

  if (view === 'register') {
      return (
        <div className="flex-1 h-full w-full bg-slate-50 flex flex-col">
            <Header title="Ro'yxatdan o'tish" subtitle="Yangi hisob yarating" />
            
            <div className="flex-1 px-6 -mt-10 pb-6 overflow-y-auto">
                <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-slate-200/50 space-y-5 animate-slide-up relative z-10">
                    
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium flex items-center gap-2 animate-shake">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Ism va Familiya</label>
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-1 flex items-center focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-50">
                                <User size={20} strokeWidth={1.5} />
                            </div>
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="flex-1 bg-transparent px-4 py-2 outline-none text-slate-800 font-bold text-lg placeholder:text-slate-300"
                                placeholder="Ismingiz"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Telefon raqam</label>
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-1 flex items-center focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-50">
                                <Smartphone size={20} strokeWidth={1.5} />
                            </div>
                            <input 
                                type="text" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="flex-1 bg-transparent px-4 py-2 outline-none text-slate-800 font-bold text-lg placeholder:text-slate-300"
                                placeholder="+998"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Parol</label>
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-1 flex items-center focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-50">
                                <Lock size={20} strokeWidth={1.5} />
                            </div>
                            <input 
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="flex-1 bg-transparent px-4 py-2 outline-none text-slate-800 font-bold text-lg placeholder:text-slate-300"
                                placeholder="••••••"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="pr-4 text-slate-400">
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Parolni tasdiqlang</label>
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-1 flex items-center focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-50">
                                <Lock size={20} strokeWidth={1.5} />
                            </div>
                            <input 
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="flex-1 bg-transparent px-4 py-2 outline-none text-slate-800 font-bold text-lg placeholder:text-slate-300"
                                placeholder="••••••"
                            />
                        </div>
                    </div>

                    <button 
                        type="button"
                        onClick={handleRegister}
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                    >
                        {isLoading ? (
                            <>Ro'yxatdan o'tilmoqda...</>
                        ) : (
                            <>Hisob yaratish <ArrowRight size={20} strokeWidth={2} /></>
                        )}
                    </button>
                </div>

                <p className="text-center text-slate-400 text-sm mt-8 pb-8">
                    Hisobingiz bormi? <button type="button" onClick={() => setView('login')} className="text-blue-600 font-bold">Kirish</button>
                </p>
            </div>
        </div>
      );
  }

  // Login Form
  return (
    <div className="flex-1 h-full w-full bg-slate-50 flex flex-col">
        <Header title="Xush kelibsiz!" subtitle="Hisobingizga kiring" />

        {/* Login Card */}
        <div className="flex-1 px-6 -mt-10 pb-6 overflow-y-auto">
            <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-slate-200/50 space-y-6 animate-slide-up relative z-10">
                
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium flex items-center gap-2 animate-shake">
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Telefon raqam</label>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-1 flex items-center focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-50">
                            <Smartphone size={20} strokeWidth={1.5} />
                        </div>
                        <input 
                            type="text" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="flex-1 bg-transparent px-4 py-2 outline-none text-slate-800 font-bold text-lg placeholder:text-slate-300"
                            placeholder="+998"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Parol</label>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-1 flex items-center focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-50">
                            <Lock size={20} strokeWidth={1.5} />
                        </div>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="flex-1 bg-transparent px-4 py-2 outline-none text-slate-800 font-bold text-lg placeholder:text-slate-300"
                            placeholder="••••••"
                        />
                         <button type="button" onClick={() => setShowPassword(!showPassword)} className="pr-4 text-slate-400">
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    <div className="flex justify-end">
                        <button type="button" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Parolni unutdingizmi?</button>
                    </div>
                </div>

                <button 
                    type="button"
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>Kirilmoqda...</>
                    ) : (
                        <>Kirish <ArrowRight size={20} strokeWidth={2} /></>
                    )}
                </button>

                <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-100"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-slate-400 font-medium">yoki</span>
                    </div>
                </div>

                <button 
                    type="button"
                    onClick={handleBiometric}
                    disabled={isLoading}
                    className="w-full py-3 rounded-2xl border-2 border-slate-100 text-slate-600 font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors active:scale-95"
                >
                    <Fingerprint size={24} className="text-slate-400" />
                    Face ID orqali kirish
                </button>
            </div>

            <p className="text-center text-slate-400 text-sm mt-8 pb-8">
                Hisobingiz yo'qmi? <button type="button" onClick={() => setView('register')} className="text-blue-600 font-bold">Ro'yxatdan o'tish</button>
            </p>
        </div>
    </div>
  );
};

export default AuthPage;