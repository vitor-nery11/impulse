import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Layers, TrendingUp, Settings, UploadCloud, Timer, CheckSquare } from 'lucide-react';
import { cn } from './Button';

const bottomNavItems = [
  { name: 'Início', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Decks', path: '/flashcards', icon: Layers },
  { name: 'Tarefas', path: '/tasks', icon: CheckSquare },
  { name: 'Foco', path: '/pomodoro', icon: Timer },
  { name: 'Importar', path: '/import-pdf', icon: UploadCloud },
  { name: 'Evolução', path: '/progress', icon: TrendingUp },
];

export function BottomNav() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/90 backdrop-blur-md border-t border-white/5 pb-safe z-50">
      <div className="flex justify-around items-center h-16 px-2">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors rounded-xl mx-1",
                active 
                  ? "text-white" 
                  : "text-[#555] hover:text-[#aaa]"
              )}
            >
              <Icon size={22} className={active ? "text-white" : ""} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
