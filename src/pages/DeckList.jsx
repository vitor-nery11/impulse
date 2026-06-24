import React from 'react';
import { LayoutDashboard } from '../components/LayoutDashboard';
import { Button } from '../components/Button';
import { Layers, PlayCircle, Trash2, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDecks } from '../context/DeckContext';

import { useUser } from '../context/UserContext';

export function DeckList() {
  const { decks, deleteDeck, renameDeck } = useDecks();
  const { stats } = useUser();

  const handleDelete = (id, name) => {
    if (window.confirm(`Tem certeza que deseja excluir o deck "${name}"?`)) {
      deleteDeck(id);
    }
  };

  const handleRename = (id, currentName) => {
    const newName = window.prompt("Digite o novo nome para o deck:", currentName);
    if (newName !== null && newName.trim() !== "" && newName !== currentName) {
      renameDeck(id, newName.trim());
    }
  };

  const getDueCardsCount = (deck) => {
    const now = new Date();
    const newCards = deck.cards.filter(card => !card.nextReviewDate || card.repetition === 0);
    const reviewCards = deck.cards.filter(card => card.nextReviewDate && card.repetition > 0 && new Date(card.nextReviewDate) <= now);
    const limitedNewCards = newCards.slice(0, stats.dailyNewCards || 20);
    return reviewCards.length + limitedNewCards.length;
  };

  return (
    <LayoutDashboard>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#f5f5f5]">Meus Decks</h1>
          <p className="text-[#888] mt-2">Gerencie seus baralhos de estudo.</p>
        </div>
        <Link to="/import-pdf">
          <Button>Novo Deck</Button>
        </Link>
      </div>
      
      {decks.length === 0 ? (
        <div className="text-center py-16 bg-[#141414] rounded-3xl border border-white/5 border-dashed">
          <Layers size={48} className="mx-auto text-[#444] mb-4" />
          <h2 className="text-xl font-bold text-[#f5f5f5] mb-2">Nenhum deck encontrado</h2>
          <p className="text-[#888] mb-6 max-w-sm mx-auto">
            Você ainda não criou nenhum baralho. Que tal importar um PDF agora mesmo?
          </p>
          <Link to="/import-pdf">
            <Button>Importar PDF</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map(deck => {
            const dueCount = getDueCardsCount(deck);
            return (
            <div key={deck.id} className="bg-[#141414] rounded-2xl p-6 shadow-sm border border-white/5 hover:border-white/10 flex flex-col hover:-translate-y-1 transition-transform relative">
              {dueCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                  {dueCount}
                </div>
              )}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-[#1e1e1e] border border-white/5 rounded-xl flex items-center justify-center text-[#888]">
                  <Layers size={24} />
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => handleRename(deck.id, deck.name)}
                    className="text-[#555] hover:text-[#f5f5f5] transition-colors p-2"
                    title="Renomear deck"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(deck.id, deck.name)}
                    className="text-[#555] hover:text-red-500 transition-colors p-2"
                    title="Excluir deck"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
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
              
              <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-900/20 border border-emerald-900/50 px-2 py-1 rounded-md">
                  {deck.mastery || 0}% domínio
                </span>
                <Link to={`/flashcards/${deck.id}`}>
                  <Button size="sm" className={`gap-2 font-bold ${deck.mastery === 100 ? 'bg-[#1e1e1e] hover:bg-[#2a2a2c] text-[#f5f5f5] border border-white/10' : 'bg-white text-black hover:bg-[#e5e5e5]'}`}>
                    <PlayCircle size={16} /> Estudar
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
