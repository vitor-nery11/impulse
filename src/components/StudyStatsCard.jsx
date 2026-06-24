import React from 'react';

export function StudyStatsCard({ title, value, icon: Icon, trend, className = '' }) {
  return (
    <div className={`bg-[#141414] rounded-[1.25rem] p-4 sm:p-5 shadow-md border border-white/5 flex flex-col items-start gap-3 hover:-translate-y-1 transition-all duration-300 cursor-default ${className}`}>
      <div className="p-2.5 sm:p-3 bg-[#1e1e1e] text-[#a1a1aa] rounded-xl shadow-inner border border-white/5">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <div className="w-full">
        <p className="text-xs sm:text-sm font-medium text-[#888] mb-0.5">{title}</p>
        <div className="flex items-end justify-between gap-2 w-full">
          <h4 className="text-xl sm:text-2xl font-extrabold text-[#f5f5f5] tracking-tight leading-none">{value}</h4>
          {trend && (
            <span className={`text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded-md ${trend.isPositive ? 'bg-emerald-900/20 text-emerald-400' : 'bg-[#1e1e1e] text-[#888]'}`}>
              {trend.value}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
