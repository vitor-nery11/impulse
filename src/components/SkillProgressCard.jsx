import React from 'react';
import { cn } from './Button';

export function SkillProgressCard({ skill, percentage, icon: Icon, colorClass }) {
  return (
    <div className="bg-[#141414] rounded-2xl p-5 shadow-sm border border-white/5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#1e1e1e] text-[#a1a1aa] border border-white/5 rounded-lg">
            <Icon size={20} />
          </div>
          <span className="font-semibold text-[#f5f5f5]">{skill}</span>
        </div>
        <span className="font-bold text-[#f5f5f5]">{percentage}%</span>
      </div>
      
      <div className="w-full h-2 bg-[#1a1a1a] border border-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#f5f5f5] rounded-full transition-all duration-1000"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
