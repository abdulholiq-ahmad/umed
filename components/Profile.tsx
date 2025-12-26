import React, { useState } from 'react';
import { User, Bell, Globe, HelpCircle, LogOut, ChevronRight, Settings, Lock, X, Key, Check, Eye, EyeOff } from 'lucide-react';
import { FamilyMember } from '../types';

interface ProfileProps {
  member: FamilyMember;
}

const Profile: React.FC<ProfileProps> = ({ member }) => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordStep, setPasswordStep] = useState<'input' | 'success'>('input');
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const menuItems = [
    { 
      id: 'personal',
      icon: <User size={20} strokeWidth={1.5} />, 
      label: 'Shaxsiy ma\'lumotlar', 
      sub: 'Ism, tug\'ilgan sana, qon guruhi' 
    },
    { 
      id: 'security',
      icon: <Lock size={20} strokeWidth={1.5} />, 
      label: 'Xavfsizlik', 
      sub: 'Parolni o\'zgartirish' 
    },
    { 
      id: 'notifications',
      icon: <Bell size={20} strokeWidth={1.5} />, 
      label: 'Bildirishnomalar', 
      sub: 'Dori va ko\'rik eslatmalari' 
    },
    { 
      id: 'language',
      icon: <Globe size={20} strokeWidth={1.5} />, 
      label: 'Til (Language)', 
      sub: 'O\'zbekcha (Lotin)' 
    },
    { 
      id: 'help',
      icon: <HelpCircle size={20} strokeWidth={1.5} />, 
      label: 'Yordam va FAQ', 
      sub: 'Tez-tez beriladigan savollar' 
    },
  ];

  const handleMenuClick = (id: string) => {
    if (id === 'security') {
      setPasswordStep('input');
      setOldPass('');
      setNewPass('');
      setConfirmPass('');
      setIsPasswordModalOpen(true);
    }
  };

  const handleSavePassword = () => {
    // Mock validation and save
    if (!oldPass || !newPass || !confirmPass) return;
    
    // Simulate API call
    setTimeout(() => {
        setPasswordStep('success');
        // Close modal after showing success message
        setTimeout(() => {
            setIsPasswordModalOpen(false);
        }, 1500);
    }, 500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
        {/* Header */}
        <div className="bg-white px-6 pt-12 pb-6 shadow-sm z-20">
             <h1 className="text-slate-900 font-bold text-3xl mb-1">Profil</h1>
             <p className="text-slate-500 text-base">Sozlamalar va hisobni boshqarish</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
            {/* User Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-6 text-white shadow-lg shadow-blue-500/30 mb-8 flex items-center gap-4 relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/20 rounded-full -ml-5 -mb-5 blur-xl"></div>

                <img src={member.avatarUrl} alt={member.name} className="w-16 h-16 rounded-full border-2 border-white/30 object-cover relative z-10" />
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold">{member.name}</h2>
                    <p className="text-blue-100 text-base opacity-90">{member.relation} • {member.age} yosh</p>
                    <div className="mt-2 flex gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded-lg text-sm backdrop-blur-sm font-medium">Qon: {member.bloodType}</span>
                    </div>
                </div>
                <button className="ml-auto p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors relative z-10">
                    <Settings size={20} strokeWidth={1.5} />
                </button>
            </div>

            {/* Menu List */}
            <div className="space-y-3">
                {menuItems.map((item) => (
                    <button 
                        key={item.id} 
                        onClick={() => handleMenuClick(item.id)}
                        className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:bg-slate-50 transition-all active:scale-[0.99] group"
                    >
                        <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            {item.icon}
                        </div>
                        <div className="text-left flex-1">
                            <h4 className="font-bold text-slate-800 text-base">{item.label}</h4>
                            <p className="text-sm text-slate-400">{item.sub}</p>
                        </div>
                        <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-400" strokeWidth={1.5} />
                    </button>
                ))}
                
                <button className="w-full mt-6 p-4 rounded-2xl border border-red-100 bg-red-50 text-red-600 flex items-center justify-center gap-2 font-semibold text-base hover:bg-red-100 transition-colors active:scale-[0.98]">
                    <LogOut size={18} strokeWidth={1.5} />
                    Chiqish
                </button>
            </div>
            
            <p className="text-center text-slate-300 text-sm mt-8 pb-8">Versiya 1.0.0 (Beta)</p>
        </div>

        {/* Password Change Modal */}
        {isPasswordModalOpen && (
            <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
                <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl animate-slide-up relative overflow-hidden">
                    
                    {passwordStep === 'input' ? (
                        <>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <Key size={20} className="text-blue-500" />
                                    Parolni yangilash
                                </h3>
                                <button 
                                    onClick={() => setIsPasswordModalOpen(false)}
                                    className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200"
                                >
                                    <X size={20} strokeWidth={1.5} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Eski parol</label>
                                    <div className="relative">
                                        <input 
                                            type={showPassword ? "text" : "password"}
                                            value={oldPass}
                                            onChange={(e) => setOldPass(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-800 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Yangi parol</label>
                                    <div className="relative">
                                        <input 
                                            type={showPassword ? "text" : "password"}
                                            value={newPass}
                                            onChange={(e) => setNewPass(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-800 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Yangi parolni tasdiqlang</label>
                                    <div className="relative">
                                        <input 
                                            type={showPassword ? "text" : "password"}
                                            value={confirmPass}
                                            onChange={(e) => setConfirmPass(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-800 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                            placeholder="••••••••"
                                        />
                                        <button 
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleSavePassword}
                                disabled={!oldPass || !newPass || !confirmPass}
                                className={`w-full mt-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                                    oldPass && newPass && confirmPass
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 active:scale-95'
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                }`}
                            >
                                Saqlash
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 animate-bounce">
                                <Check size={40} strokeWidth={2} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-1">Muvaffaqiyatli!</h3>
                            <p className="text-slate-500 text-center">Parolingiz yangilandi.</p>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};

export default Profile;