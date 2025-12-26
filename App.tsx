import React, { useState } from 'react';
import Layout from './components/Layout';
import Header from './components/Header';
import FamilySelector from './components/FamilySelector';
import HealthChart from './components/HealthChart';
import RecordCard from './components/RecordCard';
import ReminderList from './components/ReminderList';
import Timeline from './components/Timeline';
import Scanner from './components/Scanner';
import EditDataModal from './components/EditDataModal';
import Chat from './components/Chat';
import Profile from './components/Profile';
import NotificationPage from './components/NotificationPage';
import AuthPage from './components/AuthPage';
import { MOCK_USER } from './constants';
import { MedicalRecord } from './types';
import { LayoutDashboard, ScanLine, User as UserIcon, Activity, FileClock, Sparkles, Clock, Edit2, MessageSquareText, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedMemberId, setSelectedMemberId] = useState(MOCK_USER.familyMembers[0].id);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(MOCK_USER);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editConfig, setEditConfig] = useState<{title: string, value: string | number, field: 'weight' | 'height' | 'name'} | null>(null);

  // Derived state
  const selectedMember = currentUser.familyMembers.find(m => m.id === selectedMemberId) || currentUser.familyMembers[0];

  const handleScanComplete = (newRecord: MedicalRecord) => {
    const recordWithPendingStatus = {
        ...newRecord,
        isPending: true, 
        source: 'Manba: Foydalanuvchi (AI Skaner)',
        createdAt: new Date().toLocaleTimeString('uz-UZ', {hour: '2-digit', minute:'2-digit'})
    };

    const updatedMembers = currentUser.familyMembers.map(member => {
      if (member.id === selectedMemberId) {
        return {
          ...member,
          records: [recordWithPendingStatus, ...member.records]
        };
      }
      return member;
    });

    setCurrentUser({ ...currentUser, familyMembers: updatedMembers });
    setIsScannerOpen(false);
  };

  const openEditModal = (field: 'weight' | 'height' | 'name') => {
    let title = '';
    let value = '';

    if (field === 'weight') {
        title = 'Vazn (kg)';
        value = selectedMember.stats.weight.toString();
    } else if (field === 'height') {
        title = 'Bo\'y (sm)';
        value = selectedMember.stats.height.toString();
    }

    setEditConfig({ title, value, field });
    setEditModalOpen(true);
  };

  const handleSaveData = (newValue: string | number, isCritical: boolean) => {
     if (!editConfig) return;

     const updatedMembers = currentUser.familyMembers.map(member => {
        if (member.id === selectedMemberId) {
            const newStats = { ...member.stats };
            
            if (isCritical) {
                if (editConfig.field === 'weight') {
                    newStats.pendingWeight = {
                        value: newValue,
                        timestamp: 'Hozirgina',
                        requestedBy: 'user'
                    };
                } else if (editConfig.field === 'height') {
                    newStats.pendingHeight = {
                        value: newValue,
                        timestamp: 'Hozirgina',
                        requestedBy: 'user'
                    };
                }
            } else {
                if (editConfig.field === 'weight') newStats.weight = Number(newValue);
                if (editConfig.field === 'height') newStats.height = Number(newValue);
                newStats.lastUpdated = 'Hozirgina';
            }

            return { ...member, stats: newStats };
        }
        return member;
     });

     setCurrentUser({ ...currentUser, familyMembers: updatedMembers });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'timeline':
        return (
          <div className="flex flex-col h-full">
             <div className="bg-white px-6 pt-12 pb-4 shadow-sm z-20">
               <h1 className="text-slate-900 font-bold text-3xl">Tibbiy Tarix</h1>
               <p className="text-slate-500 text-base">Bemor Tarixi: {selectedMember.name}</p>
             </div>
             <Timeline records={selectedMember.records} />
          </div>
        );
      
      case 'chat':
        return (
          <Chat 
            userContext={`Ism: ${selectedMember.name}, Yosh: ${selectedMember.age}, Qon guruhi: ${selectedMember.bloodType}`} 
            onBack={() => setActiveTab('home')}
          />
        );

      case 'profile':
        return (
          <Profile member={selectedMember} />
        );

      default:
        // Home Tab
        return (
            <div className="flex-1 overflow-y-auto no-scrollbar pb-24 bg-slate-50">
            <Header 
              userName={selectedMember.name} 
              avatarUrl={selectedMember.avatarUrl} 
              onNotificationClick={() => setIsNotificationsOpen(true)}
              hasUnread={true}
            />
            
            <div className="mt-2">
               <FamilySelector 
                  members={currentUser.familyMembers} 
                  selectedId={selectedMemberId} 
                  onSelect={setSelectedMemberId} 
               />
            </div>

            {selectedMember.reminders.length > 0 && (
                <div className="mt-4">
                    <ReminderList reminders={selectedMember.reminders} />
                </div>
            )}

            <div className="px-6 mt-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-bold text-slate-800">Salomatlik Ko'rsatkichlari</h2>
                    <button className="text-blue-600 text-sm font-semibold bg-blue-50 px-3 py-1 rounded-full">Haftalik</button>
                </div>
                
                {selectedMember.healthOverview && (
                    <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 mb-2">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles size={16} strokeWidth={1.5} className="text-blue-500" />
                            <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">AI Xulosasi</span>
                        </div>
                        <p className="text-base text-slate-700 font-medium leading-relaxed">
                            {selectedMember.healthOverview}
                        </p>
                    </div>
                )}
            </div>

            <HealthChart insight={selectedMember.stats.heartRateInsight} />

            <div className="grid grid-cols-2 gap-4 px-6 mb-6">
                <button 
                    onClick={() => openEditModal('weight')}
                    className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between text-left hover:border-blue-300 transition-colors relative"
                >
                    <div className="absolute top-3 right-3 text-slate-300">
                        <Edit2 size={14} strokeWidth={1.5} />
                    </div>
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                                <Activity size={16} strokeWidth={1.5} />
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm">Vazn</p>
                        <p className="text-slate-800 font-bold text-xl">{selectedMember.stats.weight} <span className="text-sm font-normal">kg</span></p>
                        
                        {selectedMember.stats.pendingWeight && (
                             <div className="mt-2 bg-amber-50 border border-amber-100 rounded-lg p-2 flex items-center gap-2">
                                <Clock size={14} className="text-amber-500 animate-pulse" />
                                <span className="text-xs font-bold text-amber-700">
                                    {selectedMember.stats.pendingWeight.value} kg (kutilmoqda)
                                </span>
                             </div>
                        )}
                    </div>
                    {!selectedMember.stats.pendingWeight && selectedMember.stats.growthInsight && (
                        <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-50 leading-tight">
                            {selectedMember.stats.growthInsight}
                        </p>
                    )}
                </button>
                
                <button 
                    onClick={() => openEditModal('height')}
                    className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between text-left hover:border-blue-300 transition-colors relative"
                >
                    <div className="absolute top-3 right-3 text-slate-300">
                        <Edit2 size={14} strokeWidth={1.5} />
                    </div>
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                                <UserIcon size={16} strokeWidth={1.5} />
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm">Bo'y</p>
                        <p className="text-slate-800 font-bold text-xl">{selectedMember.stats.height} <span className="text-sm font-normal">cm</span></p>

                        {selectedMember.stats.pendingHeight && (
                             <div className="mt-2 bg-amber-50 border border-amber-100 rounded-lg p-2 flex items-center gap-2">
                                <Clock size={14} className="text-amber-500 animate-pulse" />
                                <span className="text-xs font-bold text-amber-700">
                                    {selectedMember.stats.pendingHeight.value} cm (kutilmoqda)
                                </span>
                             </div>
                        )}
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-50 w-full">
                         <p className="text-xs text-slate-500">BMI: normal</p>
                    </div>
                </button>
            </div>

            <div className="px-6 mb-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">So'nggi Yozuvlar</h2>
              <button 
                onClick={() => setActiveTab('timeline')}
                className="text-slate-400 text-base hover:text-blue-600"
              >
                Tarixni ko'rish
              </button>
            </div>

            <div className="px-6 space-y-4">
              {selectedMember.records.slice(0, 3).length > 0 ? (
                selectedMember.records.slice(0, 3).map((record) => (
                  <RecordCard key={record.id} record={record} />
                ))
              ) : (
                <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200">
                    <p className="text-slate-400 text-base">Yozuvlar topilmadi: {selectedMember.name}</p>
                    <button 
                      onClick={() => setIsScannerOpen(true)}
                      className="mt-2 text-blue-600 font-semibold text-base"
                    >
                      Birinchi yozuvni qo'shish
                    </button>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <AuthPage onLogin={() => setIsAuthenticated(true)} />
      </Layout>
    );
  }

  return (
    <Layout>
      <NotificationPage isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />

      {isScannerOpen && (
        <Scanner 
          onScanComplete={handleScanComplete} 
          onClose={() => setIsScannerOpen(false)}
          userContext={`Name: ${selectedMember.name}, Age: ${selectedMember.age}`}
        />
      )}

      {editModalOpen && editConfig && (
        <EditDataModal 
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            title={editConfig.title}
            currentValue={editConfig.value}
            fieldName={editConfig.field}
            onSave={handleSaveData}
        />
      )}

      {renderContent()}

      {/* 5-Tab Bottom Navigation with Integrated Floating Scanner Button */}
      {activeTab !== 'chat' && (
        <div className="absolute bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-slate-100 py-2 px-2 flex justify-between items-end z-20 pb-6 sm:pb-4 rounded-b-[40px] h-[80px]">
            
            <NavIcon icon={<LayoutDashboard size={22} strokeWidth={1.5} />} label="Asosiy" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <NavIcon icon={<MessageSquareText size={22} strokeWidth={1.5} />} label="AI Chat" active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
            
            {/* Floating Center Button */}
            <div className="relative -top-6 mx-1">
                <button 
                onClick={() => setIsScannerOpen(true)}
                className="w-14 h-14 bg-blue-600 rounded-full text-white shadow-lg shadow-blue-600/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform border-4 border-slate-100"
                >
                <ScanLine size={24} strokeWidth={1.5} />
                </button>
            </div>

            <NavIcon icon={<FileClock size={22} strokeWidth={1.5} />} label="Tarix" active={activeTab === 'timeline'} onClick={() => setActiveTab('timeline')} />
            <NavIcon icon={<Settings size={22} strokeWidth={1.5} />} label="Profil" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </div>
      )}
    </Layout>
  );
};

const NavIcon = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-colors w-16 ${active ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </button>
);

export default App;