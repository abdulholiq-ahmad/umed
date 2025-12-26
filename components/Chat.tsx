import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Mic, Loader2, Sparkles, ChevronLeft } from 'lucide-react';
import { chatWithAI } from '../services/geminiService';

interface ChatProps {
  userContext: string; // Name, Age, recent conditions
  onBack: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

const QUICK_QUESTIONS = [
  "Bosh og'rig'ida nima qilish kerak?",
  "Qon bosimi normasi qancha?",
  "Gripp alomatlari qanday?",
  "Bolamning isitmasi chiqdi"
];

const Chat: React.FC<ChatProps> = ({ userContext, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Assalomu alaykum! Men UMED AI yordamchisiman. ${userContext} bo'yicha qanday tibbiy savolingiz bor?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await chatWithAI(text, userContext);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || "Tushunarsiz holat yuz berdi.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      // Error handling
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 relative">
      {/* Header - Sticky Top */}
      <div className="bg-white px-6 pt-12 pb-4 shadow-sm z-20 shrink-0 sticky top-0">
        <div className="flex items-center gap-2">
             <button 
                onClick={onBack}
                className="p-2 -ml-2 rounded-full text-slate-500 hover:bg-slate-50 transition-colors"
            >
                <ChevronLeft size={28} strokeWidth={1.5} />
            </button>
            <div>
                <h1 className="text-slate-900 font-bold text-3xl flex items-center gap-2 leading-none">
                    <Sparkles size={24} className="text-blue-500" />
                    AI Maslahat
                </h1>
                <p className="text-slate-500 text-sm mt-1">24/7 Tibbiy yordamchi</p>
            </div>
        </div>
      </div>

      {/* Messages Area - with bottom padding for absolute input */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-48 sm:pb-40">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-blue-100 text-blue-600'}`}>
                {msg.role === 'user' ? <User size={16} strokeWidth={1.5} /> : <Bot size={16} strokeWidth={1.5} />}
              </div>
              <div>
                 <div className={`p-3 rounded-2xl text-base leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-sm'
                  }`}>
                    {msg.text}
                 </div>
                 <span className={`text-xs text-slate-400 mt-1 block ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
                 </span>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2 ml-10">
                    <Loader2 size={16} className="animate-spin text-blue-500" />
                    <span className="text-sm text-slate-400">AI yozmoqda...</span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Absolute Bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-30 pb-6 sm:pb-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {/* Quick Questions */}
        {messages.length < 3 && (
            <div className="px-4 pt-3 pb-1 flex gap-2 overflow-x-auto no-scrollbar">
                {QUICK_QUESTIONS.map((q, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleSend(q)}
                        className="whitespace-nowrap bg-white border border-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-50 transition-colors"
                    >
                        {q}
                    </button>
                ))}
            </div>
        )}
        
        <div className="p-4">
            <div className="flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Savolingizni yozing..."
                    className="flex-1 bg-transparent outline-none text-slate-700 text-base placeholder:text-slate-400"
                />
                {input.trim() ? (
                    <button onClick={() => handleSend()} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                        <Send size={16} strokeWidth={1.5} />
                    </button>
                ) : (
                    <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                        <Mic size={20} strokeWidth={1.5} />
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;