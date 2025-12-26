import React from 'react';
import { Bell } from 'lucide-react';

interface HeaderProps {
  userName: string;
  avatarUrl: string;
  onNotificationClick: () => void;
  hasUnread: boolean;
}

const Header: React.FC<HeaderProps> = ({ userName, avatarUrl, onNotificationClick, hasUnread }) => {
  return (
    <div className="bg-white px-6 pt-12 pb-4 flex justify-between items-center sticky top-0 z-20 shadow-sm border-b border-slate-50">
      <div className="flex items-center gap-3">
        <img src={avatarUrl} alt="Profile" className="w-10 h-10 rounded-full border-2 border-slate-100 object-cover" />
        <div>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Xush kelibsiz</p>
          <h1 className="text-slate-900 font-bold text-lg leading-tight">{userName}</h1>
        </div>
      </div>
      <button 
        onClick={onNotificationClick}
        className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-full relative transition-all active:scale-95 border border-slate-100"
      >
        <Bell size={20} strokeWidth={1.5} />
        {hasUnread && (
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white ring-2 ring-white"></span>
        )}
      </button>
    </div>
  );
};

export default Header;