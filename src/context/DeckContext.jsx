import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const DeckContext = createContext();

export function useDecks() {
  return useContext(DeckContext);
}

export function DeckProvider({ children }) {
  const { user } = useAuth();
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    if (user) {
      fetchDecks();
    } else {
      setDecks([]);
    }
  }, [user]);

  const fetchDecks = async () => {
    const { data: decksData, error: decksError } = await supabase
      .from('decks')
      .select(`
        *,
        cards (*)
      `)
      .order('created_at', { ascending: false });

    if (decksData) {
      const formattedDecks = decksData.map(deck => {
        const learnedCards = deck.cards.filter(c => c.repetition > 0).length;
        const mastery = deck.cards.length > 0 ? Math.round((learnedCards / deck.cards.length) * 100) : 0;
        
        return {
          id: deck.id,
          name: deck.name,
          createdAt: deck.created_at,
          mastery,
          cards: deck.cards.map(c => ({
            id: c.id,
            deck_id: c.deck_id,
            word: c.word,
            translation: c.translation,
            level: c.level,
            category: c.category,
            easeFactor: c.ease_factor,
            interval: c.interval,
            repetition: c.repetition,
            nextReviewDate: c.next_review_date
          }))
        };
      });
      setDecks(formattedDecks);
    }
  };

  const addDeck = async (deckInfo) => {
    if (!user) return;
    
    // Insert deck
    const { data: newDeckData, error: deckError } = await supabase
      .from('decks')
      .insert([{ name: deckInfo.name, user_id: user.id }])
      .select()
      .single();

    if (newDeckData) {
      // Insert cards
      if (deckInfo.cards && deckInfo.cards.length > 0) {
        const cardsToInsert = deckInfo.cards.map(c => ({
          deck_id: newDeckData.id,
          word: c.word,
          translation: c.translation,
          level: c.level || 'Iniciante',
          category: c.category || 'Geral'
        }));
        
        const { data: newCardsData } = await supabase
          .from('cards')
          .insert(cardsToInsert)
          .select();
          
        setDecks(prev => [{
          id: newDeckData.id,
          name: newDeckData.name,
          createdAt: newDeckData.created_at,
          mastery: 0,
          cards: newCardsData?.map(c => ({
            id: c.id,
            deck_id: c.deck_id,
            word: c.word,
            translation: c.translation,
            level: c.level,
            category: c.category,
            easeFactor: c.ease_factor,
            interval: c.interval,
            repetition: c.repetition,
            nextReviewDate: c.next_review_date
          })) || []
        }, ...prev]);
      } else {
        setDecks(prev => [{
          id: newDeckData.id,
          name: newDeckData.name,
          createdAt: newDeckData.created_at,
          mastery: 0,
          cards: []
        }, ...prev]);
      }
    }
  };

  const deleteDeck = async (id) => {
    if (!user) return;
    const { error } = await supabase.from('decks').delete().eq('id', id);
    if (!error) {
      setDecks(prev => prev.filter(d => d.id !== id));
    }
  };

  const updateDeckMastery = (id, mastery) => {
    setDecks(prev => prev.map(d => d.id === id ? { ...d, mastery } : d));
  };

  const renameDeck = async (id, newName) => {
    if (!user) return;
    const { error } = await supabase.from('decks').update({ name: newName }).eq('id', id);
    if (!error) {
      setDecks(prev => prev.map(d => d.id === id ? { ...d, name: newName } : d));
    }
  };

  const updateCardSRS = async (deckId, cardId, srsData) => {
    if (!user) return;
    
    const dbSrsData = {
      ease_factor: srsData.easeFactor,
      interval: srsData.interval,
      repetition: srsData.repetition,
      next_review_date: srsData.nextReviewDate
    };

    setDecks(prev => prev.map(deck => {
      if (deck.id === deckId) {
        return {
          ...deck,
          cards: deck.cards.map(card => {
            if (card.id === cardId) {
              return { ...card, ...srsData };
            }
            return card;
          })
        };
      }
      return deck;
    }));

    await supabase.from('cards').update(dbSrsData).eq('id', cardId);
  };

  const addCardsToDeck = async (deckId, newCards) => {
    if (!user) return;
    
    const cardsToInsert = newCards.map(c => ({
      deck_id: deckId,
      word: c.word,
      translation: c.translation,
      level: c.level || 'Iniciante',
      category: c.category || 'Geral'
    }));
    
    const { data: newCardsData } = await supabase
      .from('cards')
      .insert(cardsToInsert)
      .select();
      
    if (newCardsData) {
      setDecks(prev => prev.map(deck => {
        if (deck.id === deckId) {
          return {
            ...deck,
            cards: [...deck.cards, ...newCardsData.map(c => ({
              id: c.id,
              deck_id: c.deck_id,
              word: c.word,
              translation: c.translation,
              level: c.level,
              category: c.category,
              easeFactor: c.ease_factor,
              interval: c.interval,
              repetition: c.repetition,
              nextReviewDate: c.next_review_date
            }))]
          };
        }
        return deck;
      }));
    }
  };

  return (
    <DeckContext.Provider value={{ decks, addDeck, deleteDeck, updateDeckMastery, renameDeck, updateCardSRS, addCardsToDeck }}>
      {children}
    </DeckContext.Provider>
  );
}
