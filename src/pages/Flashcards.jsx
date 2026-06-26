import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard } from '../components/LayoutDashboard';
import { Flashcard } from '../components/Flashcard';
import { ProgressBar } from '../components/ProgressBar';
import { Button } from '../components/Button';
import { useDecks } from '../context/DeckContext';
import { useUser } from '../context/UserContext';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export function Flashcards() {
  const { deckId } = useParams();
  const { decks, updateDeckMastery, updateCardSRS } = useDecks();
  const { stats, recordStudySession, incrementDailyCard } = useUser();
  const navigate = useNavigate();

  const [dueCards, setDueCards] = useState([]);
  const [deckName, setDeckName] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [allDoneToday, setAllDoneToday] = useState(false);

  const startTime = useRef(Date.now());
  const sessionInitialized = useRef(false);

  useEffect(() => {
    if (sessionInitialized.current) return;

    const deck = decks.find(d => d.id === deckId);
    if (deck) {
      setDeckName(deck.name);
      
      const now = new Date();
      
      // Cartas Novas (nunca revisadas)
      const newCards = deck.cards.filter(card => !card.nextReviewDate || card.repetition === 0);
      
      // Cartas para Revisão (data de revisão <= hoje)
      const reviewCards = deck.cards.filter(card => card.nextReviewDate && card.repetition > 0 && new Date(card.nextReviewDate) <= now);

      // Limitar o número de cartas novas por sessão
      const limitedNewCards = newCards.slice(0, stats.dailyNewCards || 20);

      const combinedCards = [...reviewCards, ...limitedNewCards];

      if (combinedCards.length === 0) {
        setAllDoneToday(true);
      } else {
        const shuffled = [...combinedCards].sort(() => Math.random() - 0.5);
        setDueCards(shuffled);
        startTime.current = Date.now();
      }
      
      sessionInitialized.current = true;
    } else {
      alert("Deck não encontrado!");
      navigate('/dashboard');
    }
  }, [deckId, decks, navigate]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = (feedback) => {
    setIsFlipped(false);
    incrementDailyCard();
    
    if (feedback === 'correct') {
      setCorrectCount(prev => prev + 1);
    }

    const currentCard = dueCards[currentIndex];
    let easeFactor = currentCard.easeFactor || 2.5;
    let interval = currentCard.interval || 0;
    let repetition = currentCard.repetition || 0;

    let quality;
    if (feedback === 'wrong') quality = 1;
    else if (feedback === 'almost') quality = 3;
    else quality = 5;

    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;

    if (quality < 3) {
      repetition = 0;
      interval = 1;
    } else {
      if (repetition === 0) {
        interval = 1;
      } else if (repetition === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetition += 1;
    }

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + interval);
    const nextReviewDate = nextDate.toISOString();

    updateCardSRS(deckId, currentCard.id, {
      easeFactor,
      interval,
      repetition,
      nextReviewDate
    });

    setTimeout(() => {
      if (feedback === 'wrong') {
        setDueCards(prev => [...prev, {
          ...currentCard,
          easeFactor,
          interval,
          repetition,
          nextReviewDate
        }]);
      }

      const newLength = feedback === 'wrong' ? dueCards.length + 1 : dueCards.length;

      if (currentIndex < newLength - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        const deck = decks.find(d => d.id === deckId);
        const learnedCards = deck.cards.filter(c => c.repetition > 0).length;
        const mastery = Math.round((learnedCards / deck.cards.length) * 100);
        updateDeckMastery(deckId, mastery);
        
        const secondsSpent = Math.round((Date.now() - startTime.current) / 1000);
        recordStudySession(secondsSpent);
        setSessionCompleted(true);
      }
    }, 150);
  };

  const resetSession = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionCompleted(false);
    setCorrectCount(0);
    startTime.current = Date.now();
  };

  if (allDoneToday) {
    return (
      <LayoutDashboard>
        <div className="flex items-center gap-4 mb-8">
          <Link to="/flashcards" className="text-[#888] hover:text-[#f5f5f5] bg-[#141414] p-2 rounded-xl shadow-sm border border-white/5 hidden md:block">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-[#f5f5f5] truncate" title={deckName}>{deckName}</h1>
        </div>
        <div className="text-center py-24 bg-[#141414] rounded-3xl border border-white/5 shadow-sm max-w-xl mx-auto animate-in fade-in zoom-in-95">
          <div className="w-24 h-24 bg-emerald-900/20 border border-emerald-900/50 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-bold text-[#f5f5f5] mb-2">Tudo revisado!</h2>
          <p className="text-[#888] mb-8 max-w-sm mx-auto px-4">
            Parabéns! Você já revisou todas as cartas devidas deste baralho por hoje. Volte amanhã para continuar sua jornada.
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="w-full sm:w-auto">Voltar ao Início</Button>
          </Link>
        </div>
      </LayoutDashboard>
    );
  }

  if (dueCards.length === 0) return <LayoutDashboard><p className="text-[#888]">Carregando...</p></LayoutDashboard>;

  return (
    <LayoutDashboard>
      <div className="flex items-center gap-4 mb-8">
        <Link to="/flashcards" className="text-[#888] hover:text-[#f5f5f5] bg-[#141414] p-2 rounded-xl shadow-sm border border-white/5 hidden md:block">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#f5f5f5] truncate" title={deckName}>{deckName}</h1>
          <p className="text-[#888] text-sm mt-1">{dueCards.length} cartas para revisar hoje</p>
        </div>
      </div>

      <div className="max-w-xl mx-auto w-full mb-6">
        <ProgressBar current={currentIndex + (sessionCompleted ? 1 : 0)} total={dueCards.length} />
      </div>

      {!sessionCompleted ? (
        <div className="flex flex-col items-center">
          <Flashcard 
            card={dueCards[currentIndex]} 
            isFlipped={isFlipped}
            onFlip={handleFlip}
          />
          
          {isFlipped && (
            <div className="flex gap-3 sm:gap-4 mt-8 w-full max-w-xl justify-center animate-in fade-in slide-in-from-bottom-4 duration-300 px-4 sm:px-0">
              <Button variant="danger" onClick={() => handleNext('wrong')} className="flex-1 text-sm sm:text-base font-bold">
                Errei
              </Button>
              <Button variant="outline" onClick={() => handleNext('almost')} className="flex-1 border-amber-900/50 text-amber-500 hover:bg-amber-900/20 text-sm sm:text-base font-bold">
                Quase
              </Button>
              <Button variant="secondary" onClick={() => handleNext('correct')} className="flex-1 text-sm sm:text-base">
                Acertei
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#141414] rounded-3xl border border-white/5 shadow-sm max-w-xl mx-auto animate-in fade-in zoom-in-95">
          <div className="w-24 h-24 bg-emerald-900/20 border border-emerald-900/50 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-[#f5f5f5] mb-2">Sessão Concluída!</h2>
          <p className="text-lg text-emerald-400 font-bold mb-6">Você acertou {correctCount} de {dueCards.length} cartas!</p>
          <p className="text-[#888] mb-8 max-w-md mx-auto px-4">
            Suas respostas ajudarão a programar as próximas revisões de forma inteligente.
          </p>
          <div className="flex justify-center px-6">
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full">
                Voltar ao Início
              </Button>
            </Link>
          </div>
        </div>
      )}
    </LayoutDashboard>
  );
}
