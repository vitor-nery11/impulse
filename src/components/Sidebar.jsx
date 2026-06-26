import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Layers, 
  UploadCloud, 
  TrendingUp, 
  Settings,
  AudioLines,
  Flame,
  LogOut,
  Timer,
  CheckSquare
} from 'lucide-react';
import { cn } from './Button';
import { useUser } from '../context/UserContext';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Meus Decks', path: '/flashcards', icon: Layers },
  { name: 'Importar PDF', path: '/import-pdf', icon: UploadCloud },
  { name: 'Pomodoro', path: '/pomodoro', icon: Timer },
  { name: 'Tarefas', path: '/tasks', icon: CheckSquare },
  { name: 'Evolução', path: '/progress', icon: TrendingUp },
];

export function Sidebar() {
  const location = useLocation();
  const { stats } = useUser();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-white/5 bg-[#0a0a0a] h-full shrink-0">
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
        <div className="bg-white text-black p-2 rounded-xl">
          <AudioLines size={24} />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">Impulse</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors",
                active 
                  ? "bg-[#1c1c1e] text-white border border-white/10" 
                  : "text-[#888] hover:bg-white/5 hover:text-white border border-transparent"
              )}
            >
              <Icon size={20} className={active ? "text-white" : "text-[#555]"} />
              {item.name}
            </Link>
          );
        })}

        <div className="pt-6 mt-6 border-t border-white/5">
          <Link 
            to="/settings"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors",
              location.pathname === '/settings'
                ? "bg-[#1c1c1e] text-white border border-white/10" 
                : "text-[#888] hover:bg-white/5 hover:text-white border border-transparent"
            )}
          >
            <Settings size={20} className={location.pathname === '/settings' ? "text-white" : "text-[#555]"} />
            Configurações
          </Link>
        </div>
      </nav>

      <div className="mt-auto p-4 space-y-4">
        
        {/* Marcador de Meta Diária e Ofensiva */}
        <div className="p-4 bg-[#1c1c1e] rounded-2xl border border-white/5 space-y-3">
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#ccc]">Ofensiva</span>
            <div className="flex items-center text-white">
              <Flame size={16} className={`mr-1 ${stats.cardsStudiedToday >= stats.dailyNewCards ? 'fill-orange-500 text-orange-500' : 'fill-current'}`} />
              <span className="font-bold">{stats.streakDays}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#888] font-medium">Meta Diária</span>
              <span className="text-[#f5f5f5] font-bold">{stats.cardsStudiedToday} / {stats.dailyNewCards}</span>
            </div>
            <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-orange-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min((stats.cardsStudiedToday / stats.dailyNewCards) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <p className="text-[10px] text-[#777] text-center leading-tight">
            {stats.cardsStudiedToday >= stats.dailyNewCards 
              ? "Meta alcançada hoje! 🔥" 
              : "Complete a meta para manter a ofensiva!"}
          </p>
        </div>

        <Link 
          to="/"
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors text-[#888] hover:bg-white/5 hover:text-white w-full"
        >
          <LogOut size={18} />
          Sair da Conta
        </Link>
      </div>
    </aside>
  );
}
