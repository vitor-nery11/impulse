import React from 'react';
import { LayoutDashboard } from '../components/LayoutDashboard';
import { StudyStatsCard } from '../components/StudyStatsCard';
import { Button } from '../components/Button';
import { mockUser } from '../data/mockUser';
import { Layers, Flame, Trophy, Clock, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDecks } from '../context/DeckContext';
import { useUser } from '../context/UserContext';

export function Dashboard() {
  const { decks } = useDecks();
  const { stats, getFormattedStudyTime } = useUser();

  const totalCards = decks.reduce((acc, deck) => acc + deck.cards.length, 0);
  const averageMastery = decks.length > 0 
    ? Math.round(decks.reduce((acc, deck) => acc + (deck.mastery || 0), 0) / decks.length)
    : 0;

  const getDueCardsCount = (deck) => {
    const now = new Date();
    const newCards = deck.cards.filter(card => !card.nextReviewDate || card.repetition === 0);
    const reviewCards = deck.cards.filter(card => card.nextReviewDate && card.repetition > 0 && new Date(card.nextReviewDate) <= now);
    const limitedNewCards = newCards.slice(0, stats.dailyNewCards || 20);
    return reviewCards.length + limitedNewCards.length;
  };

  return (
    <LayoutDashboard>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#f5f5f5]">Olá, {mockUser.name}! 👋</h1>
        <p className="text-[#888] mt-2">Você tem {decks.length} baralhos. Pronto para revisar hoje?</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <StudyStatsCard 
          title="Flashcards Salvos" 
          value={totalCards} 
          icon={Layers}
        />
        <StudyStatsCard 
          title="Dias Seguidos" 
          value={stats.streakDays} 
          icon={Flame}
        />
        <StudyStatsCard 
          title="Domínio Geral" 
          value={`${averageMastery}%`} 
          icon={Trophy}
        />
        <StudyStatsCard 
          title="Tempo de Estudo" 
          value={getFormattedStudyTime()} 
          icon={Clock}
        />
      </div>

      <div className="hidden sm:flex bg-[#141414] rounded-3xl p-6 sm:p-8 mb-10 border border-white/5 flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-[#f5f5f5] mb-2">Importe novos conteúdos</h2>
          <p className="text-[#888]">Transforme qualquer PDF em um deck de estudos em segundos.</p>
        </div>
        <Link to="/import-pdf" className="w-full sm:w-auto shrink-0">
          <Button size="lg" className="w-full bg-[#f5f5f5] text-black hover:bg-white border-none font-bold">
            Importar PDF
          </Button>
        </Link>
      </div>

      <div className="flex justify-between items-end mb-6">
        <h2 className="text-2xl font-bold text-[#f5f5f5]">Seus Decks Recentes</h2>
        <Link to="/flashcards" className="text-[#aaa] font-medium hover:text-white transition-colors">
          Ver todos
        </Link>
      </div>
      
      {decks.length === 0 ? (
        <div className="text-center py-12 bg-[#141414] rounded-2xl border border-white/5 border-dashed">
          <p className="text-[#888] mb-4">Você ainda não tem nenhum deck salvo.</p>
          <Link to="/import-pdf">
            <Button className="bg-[#1e1e1e] hover:bg-[#2a2a2c] text-[#f5f5f5] border border-white/10 font-bold">Criar meu primeiro deck</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {decks.slice(0, 3).map(deck => {
            const dueCount = getDueCardsCount(deck);
            return (
            <div key={deck.id} className="bg-[#141414] rounded-2xl p-6 shadow-sm border border-white/5 flex flex-col hover:-translate-y-1 transition-transform relative">
              {dueCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                  {dueCount}
                </div>
              )}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-[#1e1e1e] rounded-xl flex items-center justify-center text-[#888] border border-white/5">
                  <Layers size={24} />
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-900/20 border border-emerald-900/50 px-2 py-1 rounded-md">
                  {deck.mastery || 0}% domínio
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#f5f5f5] mb-1 truncate" title={deck.name}>{deck.name}</h3>
              <div className="flex gap-2 text-sm mb-6">
                <span className="text-[#888]">{deck.cards.length} cartas</span>
                {dueCount > 0 && (
                  <>
                    <span className="text-[#444]">•</span>
                    <span className="text-[#d4d4d4] font-medium">{dueCount} p/ revisar</span>
                  </>
                )}
              </div>
              
              <div className="mt-auto">
                <Link to={`/flashcards/${deck.id}`}>
                  <Button className={`w-full gap-2 font-bold ${deck.mastery === 100 ? 'bg-[#1e1e1e] hover:bg-[#2a2a2c] text-[#f5f5f5] border border-white/10' : 'bg-white text-black hover:bg-[#e5e5e5]'}`}>
                    <PlayCircle size={18} /> {deck.mastery === 100 ? "Revisar" : "Estudar"}
                  </Button>
                </Link>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </LayoutDashboard>
  );
}
