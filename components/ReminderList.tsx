import React from 'react';
import { Reminder } from '../types';
import { Pill, Syringe, CalendarClock, FlaskConical, Clock } from 'lucide-react';

interface ReminderListProps {
  reminders: Reminder[];
}

const ReminderList: React.FC<ReminderListProps> = ({ reminders }) => {
  if (reminders.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'medication': return <Pill size={18} strokeWidth={1.5} />;
      case 'vaccination': return <Syringe size={18} strokeWidth={1.5} />;
      case 'analysis': return <FlaskConical size={18} strokeWidth={1.5} />;
      default: return <CalendarClock size={18} strokeWidth={1.5} />;
    }
  };

  return (
    <div className="mb-6 px-6">
      <h3 className="text-slate-800 text-base font-bold mb-3 flex items-center gap-2">
        <Clock size={18} strokeWidth={1.5} className="text-blue-600" />
        Aqlli Eslatmalar
      </h3>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {reminders.map((reminder) => (
          <div 
            key={reminder.id} 
            className={`min-w-[240px] p-4 rounded-2xl border flex items-start gap-3 shadow-sm transition-transform active:scale-95 ${
              reminder.urgent 
                ? 'bg-orange-50 border-orange-100' 
                : 'bg-white border-slate-100'
            }`}
          >
            <div className={`p-2 rounded-xl shrink-0 ${
              reminder.urgent ? 'bg-orange-100 text-orange-600' : 'bg-blue-50 text-blue-600'
            }`}>
              {getIcon(reminder.type)}
            </div>
            <div>
              <h4 className={`text-base font-bold ${reminder.urgent ? 'text-orange-900' : 'text-slate-800'}`}>
                {reminder.title}
              </h4>
              <p className="text-sm text-slate-500 mt-0.5">{reminder.subtitle}</p>
              <div className={`text-xs font-semibold mt-2 px-2 py-0.5 rounded-full inline-block ${
                 reminder.urgent ? 'bg-white text-orange-600' : 'bg-slate-100 text-slate-500'
              }`}>
                {reminder.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReminderList;