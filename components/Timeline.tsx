import React, { useState } from 'react';
import { MedicalRecord, RecordType } from '../types';
import { FileText, AlertCircle, Activity, Syringe, Stethoscope, Filter } from 'lucide-react';

interface TimelineProps {
  records: MedicalRecord[];
}

const Timeline: React.FC<TimelineProps> = ({ records }) => {
  const [filter, setFilter] = useState<string>('All');
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  const filters = ['All', RecordType.PRESCRIPTION, RecordType.LAB_RESULT, RecordType.VACCINATION, RecordType.CHECKUP];

  const handleFilterChange = (newFilter: string) => {
    const currentIndex = filters.indexOf(filter);
    const newIndex = filters.indexOf(newFilter);
    setSlideDirection(newIndex > currentIndex ? 'right' : 'left');
    setFilter(newFilter);
  };

  const typeLabels: Record<string, string> = {
    'All': 'Barchasi',
    [RecordType.PRESCRIPTION]: 'Retsept',
    [RecordType.LAB_RESULT]: 'Tahlil',
    [RecordType.VACCINATION]: 'Emlash',
    [RecordType.CHECKUP]: 'Ko\'rik',
    [RecordType.SYMPTOM]: 'Alomat',
    [RecordType.SURGERY]: 'Jarrohlik'
  };

  const filteredRecords = records.filter(r => filter === 'All' || r.type === filter);

  // Group icons map
  const getIcon = (type: RecordType) => {
    switch (type) {
      case RecordType.PRESCRIPTION: return <FileText size={16} strokeWidth={1.5} />;
      case RecordType.LAB_RESULT: return <Activity size={16} strokeWidth={1.5} />;
      case RecordType.SYMPTOM: return <AlertCircle size={16} strokeWidth={1.5} />;
      case RecordType.VACCINATION: return <Syringe size={16} strokeWidth={1.5} />;
      default: return <Stethoscope size={16} strokeWidth={1.5} />;
    }
  };

  const getTypeColor = (type: RecordType) => {
    switch (type) {
      case RecordType.PRESCRIPTION: return 'bg-blue-100 text-blue-600 border-blue-200';
      case RecordType.LAB_RESULT: return 'bg-purple-100 text-purple-600 border-purple-200';
      case RecordType.VACCINATION: return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case RecordType.SYMPTOM: return 'bg-orange-100 text-orange-600 border-orange-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col h-full bg-slate-50">
      {/* Filter Chips */}
      <div className="px-6 py-4 bg-white border-b border-slate-100 shadow-sm z-10">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <div className="p-2 bg-slate-100 rounded-full text-slate-500 shrink-0">
                <Filter size={16} strokeWidth={1.5} />
            </div>
            {filters.map(f => (
            <button
                key={f}
                onClick={() => handleFilterChange(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                filter === f
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105'
                    : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
                }`}
            >
                {typeLabels[f] || f}
            </button>
            ))}
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-28">
        <div
          key={filter}
          className={`${slideDirection === 'right' ? 'animate-slide-left' : 'animate-slide-right'}`}
        >
        {filteredRecords.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-64 text-slate-400">
             <Filter size={48} strokeWidth={1.5} className="opacity-20 mb-4" />
             <p>Ushbu filtr bo'yicha yozuvlar topilmadi.</p>
           </div>
        ) : (
            <div className="relative pl-4 border-l-2 border-slate-200 space-y-8">
            {filteredRecords.map((record, index) => (
                <div key={record.id} className="relative">
                {/* Timeline Node */}
                <div className={`absolute -left-[25px] top-0 w-5 h-5 rounded-full border-4 border-slate-50 ${
                    index === 0 ? 'bg-blue-500 ring-4 ring-blue-100' : 'bg-slate-300'
                }`}></div>

                {/* Date Header */}
                <div className="text-sm font-semibold text-slate-400 mb-2 pl-2">
                    {new Date(record.date).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>

                {/* Card */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200 hover:scale-[1.02] ml-2">
                    <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${getTypeColor(record.type)}`}>
                            {getIcon(record.type)}
                        </div>
                        <h4 className="font-bold text-slate-800 text-base">{record.title}</h4>
                    </div>
                    {record.riskLevel === 'High' && (
                        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">Yuqori Xavf</span>
                    )}
                    </div>
                    
                    <p className="text-sm text-slate-600 leading-relaxed mb-3">
                    {record.summary}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                        <span className="text-xs text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded-md">
                             {record.doctor || 'Shifokor ko\'rsatilmagan'}
                        </span>
                        {record.aiAnalysis && (
                            <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                                AI Tahlili
                            </span>
                        )}
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Timeline;