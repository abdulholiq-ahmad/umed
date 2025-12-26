import React from 'react';
import { MedicalRecord, RecordType } from '../types';
import { FileText, AlertCircle, CheckCircle, Activity, Sparkles, Clock, ShieldCheck, ShieldAlert } from 'lucide-react';

interface RecordCardProps {
  record: MedicalRecord;
}

const RecordCard: React.FC<RecordCardProps> = ({ record }) => {
  const getIcon = () => {
    switch (record.type) {
      case RecordType.PRESCRIPTION: return <FileText className="text-blue-500" strokeWidth={1.5} />;
      case RecordType.LAB_RESULT: return <Activity className="text-purple-500" strokeWidth={1.5} />;
      case RecordType.SYMPTOM: return <AlertCircle className="text-orange-500" strokeWidth={1.5} />;
      default: return <CheckCircle className="text-green-500" strokeWidth={1.5} />;
    }
  };

  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case 'High': return 'bg-red-50 text-red-600 border-red-100';
      case 'Medium': return 'bg-orange-50 text-orange-600 border-orange-100';
      default: return 'bg-green-50 text-green-600 border-green-100';
    }
  };

  // If pending, use Amber styling
  const isPending = record.isPending;
  const cardBorderClass = isPending ? 'border-amber-200 bg-amber-50/50' : 'border-slate-100 bg-white';

  return (
    <div className={`p-4 rounded-2xl shadow-sm border flex flex-col gap-3 hover:shadow-md transition-shadow ${cardBorderClass}`}>
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isPending ? 'bg-amber-100' : 'bg-slate-50'}`}>
            {getIcon()}
        </div>
        <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-slate-800 text-base">{record.title}</h4>
                <span className="text-xs text-slate-400">{record.date}</span>
            </div>
            
            {/* AI Summary Section */}
            <div className="mb-2">
                <div className="flex items-center gap-1 mb-1">
                    <Sparkles size={12} strokeWidth={1.5} className="text-blue-500" />
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">AI Xulosasi</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{record.summary}</p>
            </div>

            <div className="flex gap-2 mb-2">
                {record.riskLevel && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getRiskColor(record.riskLevel)}`}>
                        {record.riskLevel} Risk
                    </span>
                )}
                {isPending && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full border bg-amber-100 text-amber-700 border-amber-200 flex items-center gap-1">
                        <Clock size={12} /> Tasdiqlanmoqda
                    </span>
                )}
            </div>
        </div>
      </div>

      {/* Relevance & Trust Source Footer */}
      <div className={`pt-3 border-t flex flex-col gap-2 ${isPending ? 'border-amber-100' : 'border-slate-50'}`}>
            {record.relevance && (
                <div className="flex gap-2 items-start">
                    <div className="w-1 h-full min-h-[12px] bg-blue-200 rounded-full mt-1"></div>
                    <p className="text-xs text-slate-500 italic">
                        <span className="font-semibold text-slate-600">Nima uchun muhim:</span> {record.relevance}
                    </p>
                </div>
            )}
            
            {/* Trust Indicator Row */}
            <div className="flex items-center justify-between mt-1">
                 <div className="flex items-center gap-1 text-xs text-slate-400">
                    {isPending ? (
                        <ShieldAlert size={12} strokeWidth={1.5} className="text-amber-500" />
                    ) : (
                        <ShieldCheck size={12} strokeWidth={1.5} className="text-emerald-500" />
                    )}
                    <span>{record.source || 'Manba: Tizim'}</span>
                 </div>
                 {record.createdAt && (
                    <div className="flex items-center gap-1 text-xs text-slate-300">
                        <Clock size={12} strokeWidth={1.5} />
                        <span>Kiritildi: {record.createdAt}</span>
                    </div>
                 )}
            </div>
        </div>
    </div>
  );
};

export default RecordCard;