import React, { useState, useRef } from 'react';
import { Loader2, X, Zap, Image as ImageIcon, CheckCircle2, ChevronRight, ScanLine } from 'lucide-react';
import { analyzeMedicalDocument } from '../services/geminiService';
import { MedicalRecord, RecordType } from '../types';

interface ScannerProps {
  onScanComplete: (record: MedicalRecord) => void;
  onClose: () => void;
  userContext: string;
}

const Scanner: React.FC<ScannerProps> = ({ onScanComplete, onClose, userContext }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanStep, setScanStep] = useState<'capture' | 'review' | 'analyzing' | 'result'>('capture');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setScanStep('review');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imagePreview) return;

    setScanStep('analyzing');
    setIsAnalyzing(true);
    try {
      // Strip base64 prefix for API
      const base64Data = imagePreview.split(',')[1];
      const result = await analyzeMedicalDocument(base64Data, userContext);
      setAnalysisResult(result);
      setScanStep('result');
    } catch (error) {
      alert("Rasmni tahlil qilib bo'lmadi. Iltimos, qayta urinib ko'ring.");
      setScanStep('review');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (!analysisResult) return;

    const newRecord: MedicalRecord = {
        id: Date.now().toString(),
        type: RecordType.LAB_RESULT, 
        title: analysisResult.title || 'Tahlil Natijasi',
        date: new Date().toISOString().split('T')[0],
        summary: analysisResult.summary,
        doctor: analysisResult.doctorNotes ? 'AI assistent' : 'Aniqlanmadi',
        aiAnalysis: JSON.stringify(analysisResult),
        riskLevel: analysisResult.riskLevel,
        imageUrl: imagePreview!,
        relevance: analysisResult.recommendation,
        isPending: true
    };

    onScanComplete(newRecord);
  };

  // 1. Capture View (Camera Interface)
  if (scanStep === 'capture') {
      return (
        <div className="absolute inset-0 z-50 bg-black flex flex-col animate-fade-in">
            {/* Camera Header */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 bg-gradient-to-b from-black/60 to-transparent">
                <button onClick={onClose} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
                    <X size={24} />
                </button>
                <div className="px-4 py-1 bg-black/40 backdrop-blur-sm rounded-full border border-white/10">
                    <span className="text-xs font-semibold text-white tracking-wide uppercase">AI Scanner</span>
                </div>
                <button className="p-2 text-white/80 hover:text-white">
                    <Zap size={24} className="fill-current" />
                </button>
            </div>

            {/* Viewport / Frame */}
            <div className="flex-1 relative overflow-hidden flex items-center justify-center">
                {/* Simulated Camera Feed Background */}
                <div className="absolute inset-0 bg-slate-900">
                    <div className="w-full h-full opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 via-black to-black"></div>
                </div>

                {/* Scan Frame */}
                <div className="relative w-[85%] aspect-[3/4] border-[2px] border-white/30 rounded-[32px] overflow-hidden shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]">
                    <div className="absolute inset-0 flex items-center justify-center">
                         <ScanLine className="text-blue-500 w-full h-1 animate-pulse-down absolute top-0 opacity-50" />
                    </div>
                    {/* Corners */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-xl"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-xl"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-xl"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-xl"></div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                         <p className="text-white/70 text-sm font-medium bg-black/40 px-3 py-1 rounded-lg backdrop-blur-sm">
                             Hujjatni ramkaga joylang
                         </p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="h-32 bg-black flex items-center justify-between px-10 pb-6 pt-2">
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white/50 active:scale-95 transition-transform"
                >
                    <ImageIcon size={24} />
                </div>

                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1 active:scale-95 transition-transform shadow-lg shadow-blue-900/50"
                >
                    <div className="w-full h-full bg-white rounded-full"></div>
                </button>

                <div className="w-12 h-12"></div> {/* Spacer */}
            </div>

            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
            />
        </div>
      );
  }

  // 2. Review View
  if (scanStep === 'review') {
    return (
        <div className="absolute inset-0 z-50 bg-black flex flex-col">
            <div className="flex-1 relative">
                <img src={imagePreview!} alt="Review" className="w-full h-full object-contain bg-black" />
                
                <button onClick={() => setScanStep('capture')} className="absolute top-6 left-6 p-3 bg-black/50 backdrop-blur-md rounded-full text-white">
                    <X size={20} />
                </button>
            </div>
            
            <div className="bg-white p-6 rounded-t-[32px] -mt-6 relative z-10 animate-slide-up">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Tasvirni tasdiqlash</h3>
                <p className="text-slate-500 text-sm mb-6">Tasvir aniq va o'qishga oson ekanligiga ishonch hosil qiling.</p>
                
                <button 
                    onClick={handleAnalyze}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                    <Zap size={20} className="fill-current" /> AI orqali tahlil qilish
                </button>
            </div>
        </div>
    );
  }

  // 3. Analyzing View
  if (scanStep === 'analyzing') {
    return (
        <div className="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center p-8">
            <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-blue-100 animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 size={40} className="text-blue-600 animate-spin" strokeWidth={2} />
                </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-2 text-center">Tahlil qilinmoqda...</h3>
            <p className="text-slate-500 text-center max-w-xs leading-relaxed">
                Gemini AI tibbiy ma'lumotlarni o'qib, shifokor uchun hisobot tayyorlamoqda.
            </p>
        </div>
    );
  }

  // 4. Result View
  return (
    <div className="absolute inset-0 z-50 bg-slate-50 flex flex-col animate-fade-in">
        <div className="bg-white px-6 pt-12 pb-4 shadow-sm border-b border-slate-100 sticky top-0 z-10">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="text-green-500" size={24} /> 
                Tahlil Yakunlandi
            </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Status Card */}
            <div className={`p-5 rounded-3xl border flex items-start gap-4 ${
                analysisResult.riskLevel === 'High' 
                    ? 'bg-red-50 border-red-100' 
                    : analysisResult.riskLevel === 'Medium'
                    ? 'bg-orange-50 border-orange-100'
                    : 'bg-green-50 border-green-100'
            }`}>
                 <div className="flex-1">
                    <h3 className={`font-bold text-lg mb-1 ${
                        analysisResult.riskLevel === 'High' ? 'text-red-700' : 
                        analysisResult.riskLevel === 'Medium' ? 'text-orange-700' : 'text-green-700'
                    }`}>
                        {analysisResult.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{analysisResult.summary}</p>
                 </div>
            </div>

            {/* Doctor's Note */}
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                        <ScanLine size={18} />
                    </div>
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Mutaxassis uchun</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-700 font-mono text-sm leading-relaxed">
                    {analysisResult.doctorNotes || "Texnik xulosa mavjud emas."}
                </div>
            </div>

            {/* Recommendation */}
            <div className="bg-blue-600 p-5 rounded-3xl text-white shadow-lg shadow-blue-600/30">
                 <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <Zap size={18} className="fill-white" /> Tavsiya
                 </h4>
                 <p className="text-blue-50 opacity-90 leading-relaxed">
                    {analysisResult.recommendation}
                 </p>
            </div>
        </div>

        <div className="p-6 bg-white border-t border-slate-100">
            <button 
                onClick={handleSave}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
                Saqlash va Mutaxassisga yuborish <ChevronRight size={20} />
            </button>
        </div>
    </div>
  );
};

export default Scanner;