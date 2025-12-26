import React, { useState } from 'react';
import { X, Pill, FileText, CheckCircle2, AlertTriangle, Clock, Info, Check } from 'lucide-react';

interface NotificationPageProps {
  isOpen: boolean;
  onClose: () => void;
}

// Initial Data
const INITIAL_NOTIFICATIONS = [
    {
        id: '1',
        type: 'medication',
        title: 'Dori ichish vaqti',
        message: 'Amoksitsillin 500mg, ovqatdan keyin. Kechiktirmang!',
        time: 'Hozirgina',
        isUnread: true,
        isUrgent: true
    },
    {
        id: '2',
        type: 'analysis',
        title: 'Tahlil natijalari tayyor',
        message: 'Umumiy qon tahlili natijalari yuklandi. AI xulosasini ko\'rish mumkin.',
        time: '14:30',
        isUnread: true,
        isUrgent: false
    },
    {
        id: '3',
        type: 'system',
        title: 'Tizim yangilandi',
        message: 'MediVault ilovasi yangi versiyaga o\'tdi. Yangi imkoniyatlar bilan tanishing.',
        time: 'Kecha',
        isUnread: false,
        isUrgent: false
    },
    {
        id: '4',
        type: 'checkup',
        title: 'Kardiolog qabuli',
        message: 'Ertaga soat 10:00 da Dr. Karimov qabuliga yozilgansiz.',
        time: 'Kecha',
        isUnread: false,
        isUrgent: false
    }
];

const NotificationPage: React.FC<NotificationPageProps> = ({ isOpen, onClose }) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all');
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch(type) {
        case 'medication': return <Pill size={20} strokeWidth={1.5} />;
        case 'analysis': return <FileText size={20} strokeWidth={1.5} />;
        case 'checkup': return <Clock size={20} strokeWidth={1.5} />;
        default: return <Info size={20} strokeWidth={1.5} />;
    }
  };

  const getIconStyles = (type: string, isUrgent: boolean) => {
    if (isUrgent) return 'bg-red-100 text-red-600';
    switch(type) {
        case 'medication': return 'bg-blue-100 text-blue-600';
        case 'analysis': return 'bg-purple-100 text-purple-600';
        case 'checkup': return 'bg-emerald-100 text-emerald-600';
        default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getCardStyles = (isUnread: boolean, isUrgent: boolean) => {
    if (isUrgent) return 'bg-red-50/60 border-red-200 shadow-sm';
    if (isUnread) return 'bg-white border-blue-200 shadow-blue-100/50 shadow-md';
    return 'bg-white border-slate-100 shadow-sm opacity-90';
  };

  const filteredNotifications = notifications.filter(n => {
      if (filter === 'unread') return n.isUnread;
      if (filter === 'important') return n.isUrgent;
      return true;
  });

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
    // If we are on the 'unread' tab, automatically switch to 'all' so the list doesn't suddenly disappear
    if (filter === 'unread') {
        setFilter('all');
    }
  };

  const unreadCount = notifications.filter(n => n.isUnread).length;

  const tabs = [
    { id: 'all', label: 'Barchasi' },
    { id: 'unread', label: 'O\'qilmagan' },
    { id: 'important', label: 'Muhim' }
  ];

  const activeTabIndex = tabs.findIndex(tab => tab.id === filter);

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-slate-50 animate-slide-up">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md px-6 pt-12 pb-4 shadow-sm border-b border-slate-100 flex justify-between items-center sticky top-0 z-20">
        <div>
            <h2 className="text-2xl font-bold text-slate-900">Bildirishnomalar</h2>
            <p className="text-slate-500 text-sm font-medium">
                {unreadCount > 0 
                    ? `Sizda ${unreadCount} ta o'qilmagan xabar bor`
                    : "Barcha xabarlar o'qilgan"
                }
            </p>
        </div>
        <button 
            onClick={onClose}
            className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
        >
            <X size={24} strokeWidth={1.5} />
        </button>
      </div>

      {/* Filter Tabs - Sliding Segmented Control */}
      <div className="px-6 py-4 sticky top-[88px] z-10 bg-slate-50/95 backdrop-blur-sm">
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex relative isolate">
            {/* The Sliding Pill */}
            <div 
                className="absolute top-1.5 bottom-1.5 rounded-xl bg-blue-600 shadow-lg shadow-blue-500/30 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] -z-10"
                style={{
                    left: `calc(${activeTabIndex * (100 / 3)}% + 6px)`,
                    width: `calc((100% - 12px) / 3)`
                }}
            />
            
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id as any)}
                    className={`flex-1 py-3 text-sm font-bold transition-colors duration-200 text-center ${
                        filter === tab.id 
                        ? 'text-white' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 pt-2">
        {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
                <div 
                    key={notification.id} 
                    className={`relative p-5 rounded-3xl border transition-all active:scale-[0.98] ${getCardStyles(notification.isUnread, notification.isUrgent)}`}
                >
                    {/* Unread Dot */}
                    {notification.isUnread && !notification.isUrgent && (
                        <div className="absolute top-6 right-6 w-2.5 h-2.5 bg-blue-500 rounded-full ring-4 ring-blue-50"></div>
                    )}

                    <div className="flex gap-4">
                        {/* Icon Box */}
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${getIconStyles(notification.type, notification.isUrgent)}`}>
                            {getIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pt-0.5">
                            <div className="flex justify-between items-start pr-4 mb-1">
                                <h3 className={`text-base font-bold truncate ${notification.isUnread ? 'text-slate-900' : 'text-slate-600'}`}>
                                    {notification.title}
                                </h3>
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed mb-3 line-clamp-2">
                                {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-400 bg-white/50 px-2 py-1 rounded-md border border-slate-100/50">
                                    {notification.time}
                                </span>
                                {notification.isUrgent && (
                                    <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-white px-2 py-1 rounded-md shadow-sm border border-red-100">
                                        <AlertTriangle size={12} strokeWidth={2} /> Muhim
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))
        ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} strokeWidth={1.5} className="text-slate-300" />
                </div>
                <p className="font-medium">Xabarlar yo'q</p>
            </div>
        )}
      </div>

      {/* Bottom Action - Only show if there are unread messages */}
      {unreadCount > 0 && (
          <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] z-20">
            <button 
                onClick={markAllAsRead}
                className="w-full py-4 rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 active:scale-95"
            >
                <Check size={20} strokeWidth={2} />
                Barchasini o'qilgan deb belgilash
            </button>
          </div>
      )}
    </div>
  );
};

export default NotificationPage;