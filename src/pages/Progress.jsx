import React from 'react';
import { LayoutDashboard } from '../components/LayoutDashboard';
import { StudyStatsCard } from '../components/StudyStatsCard';
import { Layers, Trophy, Clock, CalendarDays, Zap, BookOpen } from 'lucide-react';
import { useDecks } from '../context/DeckContext';
import { useUser } from '../context/UserContext';

export function Progress() {
  const { decks } = useDecks();
  const { stats, getFormattedStudyTime } = useUser();

  const totalCards = decks.reduce((acc, deck) => acc + deck.cards.length, 0);
  const averageMastery = decks.length > 0 
    ? Math.round(decks.reduce((acc, deck) => acc + (deck.mastery || 0), 0) / decks.length)
    : 0;

  return (
    <LayoutDashboard>
      <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-[#1e1e1e] border border-white/5 p-2 rounded-xl text-[#f5f5f5]">
            <Trophy size={24} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#f5f5f5] tracking-tight">Sua Evolução</h1>
        </div>
        <p className="text-[#888] mt-2 text-base sm:text-lg">Acompanhe suas conquistas e mantenha o ritmo.</p>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 fill-mode-both">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#f5f5f5]">Visão Geral</h2>
        </div>
        
        {/* Grid 2x2 for stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <StudyStatsCard title="Decks Ativos" value={decks.length} icon={BookOpen} />
          <StudyStatsCard title="Total de Cartas" value={totalCards} icon={Layers} />
          <StudyStatsCard title="Domínio Médio" value={`${averageMastery}%`} icon={Zap} trend={{value: '+2%', isPositive: true}} />
          <StudyStatsCard title="Tempo Estudado" value={getFormattedStudyTime()} icon={Clock} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
        
        {/* Consistência Card */}
        <div className="order-1 lg:order-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-[#f5f5f5]">Consistência</h2>
          </div>
          <div className="bg-[#f5f5f5] rounded-[1.25rem] p-5 sm:p-6 shadow-sm border border-white/5 text-center relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-black/5 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-black/5">
                <CalendarDays size={24} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-black mb-1">{stats.streakDays} Dias Seguidos</h3>
              <p className="text-[#555] text-sm font-medium mb-6 max-w-[250px] mx-auto leading-tight">Você está on fire! Estude todos os dias para manter a ofensiva.</p>
              
              <div className="flex justify-center gap-1.5 sm:gap-2">
                {[...Array(7)].map((_, i) => {
                  const isAchieved = i < Math.min(stats.streakDays, 7);
                  return (
                    <div 
                      key={i} 
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-transform hover:scale-105 border
                        ${isAchieved 
                          ? 'bg-black text-white border-transparent shadow-sm' 
                          : 'bg-white text-[#888] border-black/10'}`}
                    >
                      {['D','S','T','Q','Q','S','S'][i]}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Domínio por Deck */}
        <div className="order-2 lg:order-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#f5f5f5]">Domínio por Deck</h2>
          </div>
          <div className="bg-[#141414] rounded-3xl p-6 sm:p-8 shadow-sm border border-white/5">
            {decks.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen size={48} className="mx-auto text-[#444] mb-4" />
                <p className="text-[#888] font-medium">Você ainda não tem decks para analisar.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {decks.map((deck, index) => (
                  <div key={deck.id} className="group">
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-bold text-[#f5f5f5] group-hover:text-white transition-colors truncate pr-4">{deck.name}</span>
                      <span className="text-sm font-black text-[#888] bg-[#1e1e1e] border border-white/5 px-2 py-0.5 rounded-md">{deck.mastery || 0}%</span>
                    </div>
                    <div className="w-full bg-[#1a1a1a] border border-white/5 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-[#f5f5f5] h-full rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${deck.mastery || 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </LayoutDashboard>
  );
}
