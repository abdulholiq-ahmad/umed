import React, { useState } from 'react';
import { X, ShieldAlert, Check, Save, ArrowRight } from 'lucide-react';

interface EditDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  currentValue: string | number;
  fieldName: 'weight' | 'height' | 'name';
  onSave: (value: string | number, isCritical: boolean) => void;
}

const CRITICAL_FIELDS = ['weight', 'height', 'diagnosis', 'medications'];

const EditDataModal: React.FC<EditDataModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  currentValue, 
  fieldName,
  onSave 
}) => {
  const [value, setValue] = useState(currentValue);
  const [step, setStep] = useState<'input' | 'confirm'>('input');
  
  if (!isOpen) return null;

  const isCritical = CRITICAL_FIELDS.includes(fieldName);

  const handleSubmit = () => {
    if (isCritical && step === 'input') {
      setStep('confirm');
    } else {
      onSave(value, isCritical);
      onClose();
      setStep('input'); // reset
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-t-[30px] sm:rounded-[30px] p-6 animate-slide-up shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900">
            {step === 'input' ? 'Ma\'lumotni o\'zgartirish' : 'Tasdiqlash talab etiladi'}
          </h3>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {step === 'input' ? (
          <>
             <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    {title}
                </label>
                <input 
                    type={typeof currentValue === 'number' ? 'number' : 'text'}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full text-4xl font-bold text-slate-800 border-b-2 border-slate-200 focus:border-blue-500 outline-none py-2 bg-transparent"
                    autoFocus
                />
             </div>

             <div className="flex gap-3">
                <button 
                    onClick={onClose}
                    className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-2xl font-semibold"
                >
                    Bekor qilish
                </button>
                <button 
                    onClick={handleSubmit}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-semibold flex items-center justify-center gap-2"
                >
                    {isCritical ? 'Davom etish' : 'Saqlash'} <ArrowRight size={18} strokeWidth={1.5} />
                </button>
             </div>
          </>
        ) : (
          <>
             {/* Confirmation Step for Critical Data */}
             <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6 flex gap-3 items-start">
                <div className="bg-amber-100 p-2 rounded-full text-amber-600 shrink-0">
                    <ShieldAlert size={24} strokeWidth={1.5} />
                </div>
                <div>
                    <h4 className="font-bold text-amber-900 text-base mb-1">E'tibor bering</h4>
                    <p className="text-sm text-amber-800/80 leading-relaxed">
                        Siz kiritayotgan ma'lumot ({value}) tibbiy tashxis va AI xulosasiga ta'sir qiladi. 
                        Xavfsizlik maqsadida ushbu o'zgarish <b>shifokor yoki moderator</b> tomonidan tasdiqlanishi kerak.
                    </p>
                </div>
             </div>

             <div className="flex gap-3">
                <button 
                    onClick={() => setStep('input')}
                    className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-2xl font-semibold"
                >
                    Ortga
                </button>
                <button 
                    onClick={handleSubmit}
                    className="flex-1 py-3 bg-amber-500 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30"
                >
                    So'rov yuborish <Check size={18} strokeWidth={1.5} />
                </button>
             </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditDataModal;