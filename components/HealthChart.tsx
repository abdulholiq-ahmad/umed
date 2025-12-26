import React from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { Info, Sparkles } from 'lucide-react';

interface HealthChartProps {
  insight?: string;
}

const data = [
  { day: 'Dush', bpm: 68 },
  { day: 'Sesh', bpm: 72 },
  { day: 'Chor', bpm: 70 },
  { day: 'Pay', bpm: 76 },
  { day: 'Juma', bpm: 74 },
  { day: 'Shan', bpm: 78 },
  { day: 'Yak', bpm: 72 },
];

const HealthChart: React.FC<HealthChartProps> = ({ insight }) => {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 mb-6 mx-6 relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
            Yurak Urishi <Info size={14} strokeWidth={1.5} />
          </h3>
          <p className="text-3xl font-bold text-slate-800">72 <span className="text-base font-normal text-slate-500">bpm</span></p>
        </div>
        <div className="flex flex-col items-end">
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">+2%</span>
            <span className="text-xs text-slate-400 mt-1">o'tgan haftaga nisbatan</span>
        </div>
      </div>

      {insight && (
        <div className="flex items-start gap-2 mb-4 bg-slate-50 p-2 rounded-lg border border-slate-100">
             <Sparkles size={14} strokeWidth={1.5} className="text-blue-400 mt-0.5 shrink-0" />
             <p className="text-sm text-slate-600">
                {insight}
            </p>
        </div>
      )}
      
      <div className="h-24 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorBpm" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
            />
            <Area 
                type="monotone" 
                dataKey="bpm" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorBpm)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HealthChart;