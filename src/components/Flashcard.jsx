import React, { useState } from 'react';
import { cn } from './Button';

export function Flashcard({ card, onFlip, isFlipped }) {
  return (
    <div 
      className="relative w-full max-w-xl mx-auto h-[55vh] min-h-[320px] max-h-[450px] cursor-pointer perspective-1000"
      onClick={onFlip}
    >
      <div className={cn(
        "w-full h-full relative transform-style-3d transition-all duration-500",
        isFlipped ? "rotate-y-180" : ""
      )}>
        {/* Front */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-[#141414] rounded-3xl shadow-lg border border-white/5 flex flex-col items-center justify-center p-6 sm:p-8 text-center">
          <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 flex justify-between text-xs sm:text-sm font-medium text-[#888]">
            <span className="truncate max-w-[60%] text-left">{card.category || 'Deck'}</span>
            <span className="px-2 py-1 bg-[#1e1e1e] border border-white/5 rounded-md shrink-0">{card.level || 'Misto'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5f5f5] mb-2 px-2 break-words w-full">{card.word}</h2>
          <p className="text-[#555] mt-auto text-xs sm:text-sm font-medium animate-pulse">Toque para virar</p>
        </div>

        {/* Back */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-[#141414] rounded-3xl shadow-lg border border-white/5 flex flex-col items-center justify-center p-6 sm:p-8 text-center rotate-y-180">
          <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 flex justify-between text-xs sm:text-sm font-medium text-[#888]">
            <span>Tradução</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#f5f5f5] mb-4 px-2 break-words w-full">{card.translation}</h2>
          
          {card.example && (
            <div className="w-full bg-[#1a1a1a] p-3 sm:p-4 rounded-xl mt-4 border border-white/5 overflow-y-auto max-h-[40%]">
              <p className="text-[#d4d4d4] italic mb-1 sm:mb-2 text-sm sm:text-base">"{card.example}"</p>
              {card.exampleTranslation && (
                <p className="text-[#888] text-xs sm:text-sm">"{card.exampleTranslation}"</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
