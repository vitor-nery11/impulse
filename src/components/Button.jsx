import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className,
  as: Component = 'button',
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-[#0a0a0a] disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-[#f5f5f5] text-black hover:bg-white shadow-sm font-bold",
    secondary: "bg-[#1e1e1e] text-[#f5f5f5] hover:bg-[#2a2a2c] shadow-sm font-bold border border-white/5",
    outline: "border border-[#333] bg-transparent hover:bg-[#1a1a1a] text-[#aaa] hover:text-[#f5f5f5]",
    ghost: "bg-transparent hover:bg-[#1a1a1a] text-[#888] hover:text-[#f5f5f5]",
    danger: "bg-red-900/50 text-red-400 hover:bg-red-900/70 shadow-sm border border-red-900/50"
  };

  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-base",
    lg: "h-14 px-8 text-lg"
  };

  return (
    <Component 
      className={cn(baseStyles, variants[variant], sizes[size], className)} 
      {...props}
    >
      {children}
    </Component>
  );
}
