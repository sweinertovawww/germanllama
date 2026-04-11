import React from "react";
import { useWortpaare } from "@/hooks/useWortpaare";
import WordCard from "./WordCard";
import MatchedPair from "./MatchedPair";
import germanLlamaLogo from "@/assets/germanllama-logo.png";
import { RotateCcw } from "lucide-react";

const WortpaareGame: React.FC = () => {
  const { cards, matched, selected, shaking, loading, completed, selectCard, startGame } = useWortpaare(6);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Instructions */}
      {matched.length === 0 && !completed && (
        <div className="bg-muted border border-border rounded-xl px-4 py-3 mb-4 text-center">
          <p className="font-body text-sm text-muted-foreground">
            Klikni na slovo a pak na jeho synonymum nebo antonymum.
          </p>
        </div>
      )}

      {/* Completion screen */}
      {completed ? (
        <div className="flex flex-col items-center gap-6 py-10">
          <img src={germanLlamaLogo} alt="GermanLlama" className="w-24 h-24 rounded-2xl" />
          <h3 className="font-game text-lg sm:text-xl text-foreground text-center">
            Výborně! 🎉
          </h3>
          <p className="font-body text-muted-foreground text-center">
            Všechny páry jsi správně přiřadil/a!
          </p>
          <button
            onClick={startGame}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-body font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Hrát znovu
          </button>

          {/* Show all matched pairs */}
          <div className="w-full space-y-2 mt-4">
            {matched.map((m) => (
              <MatchedPair key={m.pair.id} data={m} />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Progress */}
          <div className="flex items-center justify-between mb-3">
            <span className="font-body text-sm text-muted-foreground">
              Spárováno: {matched.length} / {matched.length + Math.floor(cards.length / 2)}
            </span>
            <button
              onClick={startGame}
              className="font-body text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Nová hra
            </button>
          </div>

          {/* Card grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
            {cards.map((card) => (
              <WordCard
                key={card.id}
                word={card.word}
                isSelected={selected === card.id}
                isShaking={shaking === card.id}
                onClick={() => selectCard(card.id)}
              />
            ))}
          </div>

          {/* Matched pairs */}
          {matched.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Spárovaná slova
              </h4>
              {matched.map((m) => (
                <MatchedPair key={m.pair.id} data={m} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WortpaareGame;
