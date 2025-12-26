import React from 'react';
import { FamilyMember } from '../types';
import { Plus, Activity, FileText, Syringe, AlertCircle, Stethoscope } from 'lucide-react';

interface FamilySelectorProps {
  members: FamilyMember[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const FamilySelector: React.FC<FamilySelectorProps> = ({ members, selectedId, onSelect }) => {
  const getRecordIcon = (type?: string) => {
    switch(type) {
        case 'Vaccination': return <Syringe size={20} strokeWidth={1.5} />;
        case 'Prescription': return <FileText size={20} strokeWidth={1.5} />;
        case 'Symptom': return <AlertCircle size={20} strokeWidth={1.5} />;
        case 'Checkup': return <Stethoscope size={20} strokeWidth={1.5} />;
        default: return <Activity size={20} strokeWidth={1.5} />;
    }
  };

  return (
    <div className="w-full py-4">
      <div className="flex justify-between items-center px-6 mb-4">
        <h2 className="text-xl font-bold text-slate-800">Mening oilam</h2>
        <button className="text-sm text-blue-600 font-medium hover:text-blue-700 bg-blue-50 px-3 py-1 rounded-full transition-colors">Barchasi</button>
      </div>
      
      <div className="w-full overflow-x-auto no-scrollbar px-6 flex gap-4 pb-6 snap-x snap-mandatory">
        {members.map((member) => {
          const isSelected = member.id === selectedId;
          const recentRecord = member.records[0];

          return (
            <button
              key={member.id}
              onClick={() => onSelect(member.id)}
              className={`relative min-w-[300px] rounded-3xl p-6 text-left transition-all duration-300 snap-center flex flex-col justify-between group
                ${isSelected 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white border border-slate-100 text-slate-800 hover:border-blue-200'
                }
              `}
            >
              <div>
                {/* Header: Avatar & Name */}
                <div className="flex items-center gap-4 mb-6">
                    <div className={`p-0.5 rounded-full border-2 ${isSelected ? 'border-white/30' : 'border-slate-100'}`}>
                        <img 
                        src={member.avatarUrl} 
                        alt={member.name} 
                        className="w-14 h-14 rounded-full object-cover" 
                        />
                    </div>
                    <div>
                    <h3 className={`text-2xl font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-800'}`}>{member.name}</h3>
                    <p className={`text-sm font-medium ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>{member.relation}</p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="flex justify-between items-center mb-6 px-1">
                    <div className="flex flex-col items-start gap-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>Yosh</span>
                        <span className="font-bold text-xl">{member.age}</span>
                    </div>
                    <div className="w-[1px] h-8 bg-current opacity-10"></div>
                    <div className="flex flex-col items-start gap-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>Qon</span>
                        <span className="font-bold text-xl">{member.bloodType}</span>
                    </div>
                    <div className="w-[1px] h-8 bg-current opacity-10"></div>
                    <div className="flex flex-col items-start gap-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>Bo'y</span>
                        <span className="font-bold text-xl">{member.stats.height}<span className="text-xs font-normal opacity-70 ml-0.5">sm</span></span>
                    </div>
                    <div className="w-[1px] h-8 bg-current opacity-10"></div>
                    <div className="flex flex-col items-start gap-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>Vazn</span>
                        <span className="font-bold text-xl">{member.stats.weight}<span className="text-xs font-normal opacity-70 ml-0.5">kg</span></span>
                    </div>
                </div>
              </div>

              {/* Recent Record Card */}
              {recentRecord ? (
                <div className={`rounded-2xl p-4 flex items-center gap-3 transition-colors ${isSelected ? 'bg-white/10 backdrop-blur-sm border border-white/10' : 'bg-slate-50 border border-slate-100 group-hover:bg-blue-50/50'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-white text-blue-600' : 'bg-white text-blue-500'}`}>
                    {getRecordIcon(recentRecord.type)}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                      {recentRecord.title}
                    </p>
                    <p className={`text-xs truncate ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                      {recentRecord.date}
                    </p>
                  </div>
                </div>
              ) : (
                <div className={`rounded-2xl p-4 flex items-center justify-center gap-2 h-[74px] border border-transparent ${isSelected ? 'bg-white/10' : 'bg-slate-50 border-slate-100'}`}>
                    <p className={`text-sm font-medium ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>Yozuvlar mavjud emas</p>
                </div>
              )}
            </button>
          );
        })}

        {/* Add Button Card - Redesigned */}
        <button className="min-w-[120px] rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-300 snap-center flex flex-col items-center justify-center gap-3 text-slate-400 group">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                 <Plus size={28} strokeWidth={1.5} className="group-hover:text-blue-600" />
            </div>
            <span className="text-sm font-bold">Qo'shish</span>
        </button>
      </div>
    </div>
  );
};

export default FamilySelector;