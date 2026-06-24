import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from './Button';

export function CategoryCard({ title, description, icon: Icon, to, colorClass }) {
  return (
    <Link 
      to={to}
      className="group relative bg-[#141414] rounded-2xl p-6 shadow-sm border border-white/5 hover:border-white/20 transition-all hover:-translate-y-1 flex flex-col items-start overflow-hidden"
    >
      <div className={cn(
        "p-4 rounded-xl mb-4 transition-transform group-hover:scale-110",
        "bg-[#1e1e1e] text-[#f5f5f5] border border-white/5"
      )}>
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold text-[#f5f5f5] mb-2">{title}</h3>
      <p className="text-[#888] text-sm mb-4 leading-relaxed flex-1">{description}</p>
      
      <div className="flex items-center text-sm font-semibold mt-auto opacity-0 group-hover:opacity-100 transition-opacity text-[#f5f5f5]">
        <span>Praticar agora</span>
        <svg className="w-4 h-4 ml-1 text-[#f5f5f5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
