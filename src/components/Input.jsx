import React from 'react';
import { cn } from './Button';

export function Input({ label, id, error, className, ...props }) {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-[#888]">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "block w-full rounded-xl border px-4 py-3 text-[#f5f5f5] placeholder:text-[#555] shadow-sm outline-none transition-colors",
          "focus:ring-1 focus:ring-white/20 focus:border-white/30",
          "bg-[#0a0a0a]",
          error 
            ? "border-red-900/50 focus:ring-red-900/50 focus:border-red-500" 
            : "border-[#333]",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
