import React from 'react';

export function ProgressBar({ current, total }) {
  const percentage = Math.round((current / total) * 100) || 0;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-[#888]">Progresso da sessão</span>
        <span className="text-sm font-bold text-[#f5f5f5]">{current} de {total}</span>
      </div>
      <div className="w-full h-3 bg-[#1a1a1a] rounded-full overflow-hidden border border-white/5">
        <div 
          className="h-full bg-[#f5f5f5] transition-all duration-500 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
