import React from 'react';
import { X, Globe, Phone, ShieldQuestion, FileText, ChevronRight, LogOut, Zap } from 'lucide-react';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Menu Panel */}
      <div className="relative w-[80%] max-w-sm h-full bg-white shadow-2xl animate-slide-left flex flex-col">
        <div className="p-6 flex justify-between items-center border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Zap className="text-blue-600 fill-current" size={20} />
            UMED
          </h2>
          <button 
            onClick={onClose}
            className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Section 1 */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Sozlamalar</h3>
            <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors group">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white text-slate-600 flex items-center justify-center shadow-sm group-hover:text-blue-600">
                            <Globe size={18} strokeWidth={1.5} />
                        </div>
                        <span className="text-slate-700 font-medium">Ilova tili</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">O'zbek</span>
                        <ChevronRight size={16} className="text-slate-300" />
                    </div>
                </button>
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Yordam</h3>
            <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-green-50 transition-colors group">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white text-slate-600 flex items-center justify-center shadow-sm group-hover:text-green-600">
                            <Phone size={18} strokeWidth={1.5} />
                        </div>
                        <span className="text-slate-700 font-medium">Tezkor aloqa</span>
                    </div>
                    <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">103</span>
                </button>

                <button className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors group">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white text-slate-600 flex items-center justify-center shadow-sm group-hover:text-blue-600">
                            <ShieldQuestion size={18} strokeWidth={1.5} />
                        </div>
                        <span className="text-slate-700 font-medium">Qo'llanma</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-300" />
                </button>

                <button className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors group">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white text-slate-600 flex items-center justify-center shadow-sm group-hover:text-blue-600">
                            <FileText size={18} strokeWidth={1.5} />
                        </div>
                        <span className="text-slate-700 font-medium">Ommaviy oferta</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-300" />
                </button>
            </div>
          </div>

        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50">
             <button className="w-full flex items-center justify-center gap-2 text-red-500 font-medium hover:bg-red-50 p-3 rounded-xl transition-colors">
                <LogOut size={18} strokeWidth={1.5} />
                Chiqish
             </button>
             <p className="text-center text-slate-300 text-xs mt-4">Versiya 1.0.2</p>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;