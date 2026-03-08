import React, { useState, useCallback, useMemo, useEffect } from "react";
import { getAllFlashCards, FlashCard, filterByProfession } from "@/game/vocabularyData";
import germanLlamaLogo from "@/assets/germanllama-logo.png";
import { Brain, RotateCcw, Trophy, Skull, Copy, Check } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProfessionFilter } from "@/hooks/useProfessionFilter";
import ProfessionFilter from "@/components/ProfessionFilter";

interface MemoryCard {
  id: number;
  pairId: number;
  text: string;
  lang: "de" | "cz";
  flipped: boolean;
  matched: boolean;
  flipCount: number;
  locked: boolean;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const MAX_FLIPS = 3;

function buildCards(pairCount: number): MemoryCard[] {
  let allCards = getAllFlashCards();
  if (!allCards || allCards.length === 0) {
    allCards = [
      { german: "der Hund", czech: "pes", type: "noun", profession: "obecné" },
      { german: "die Katze", czech: "kočka", type: "noun", profession: "obecné" },
      { german: "das Haus", czech: "dům", type: "noun", profession: "obecné" },
      { german: "der Tisch", czech: "stůl", type: "noun", profession: "obecné" },
      { german: "die Blume", czech: "květina", type: "noun", profession: "obecné" },
    ];
  }
  const selected = shuffleArray(allCards).slice(0, pairCount);
  const memoryCards: MemoryCard[] = [];
  selected.forEach((card, i) => {
    memoryCards.push({
      id: i * 2,
      pairId: i,
      text: card.german,
      lang: "de",
      flipped: false,
      matched: false,
      flipCount: 0,
      locked: false,
    });
    memoryCards.push({
      id: i * 2 + 1,
      pairId: i,
      text: card.czech,
      lang: "cz",
      flipped: false,
      matched: false,
      flipCount: 0,
      locked: false,
    });
  });
  return shuffleArray(memoryCards);
}

const Pexeso = () => {
  const isMobile = useIsMobile();
  const pairCount = 5;

  const [cards, setCards] = useState<MemoryCard[]>(() => buildCards(pairCount));
  const [selected, setSelected] = useState<number[]>([]);
  const [checking, setChecking] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [completedGames, setCompletedGames] = useState(0);
  const [totalMatchedPairs, setTotalMatchedPairs] = useState(0);
  const [copied, setCopied] = useState(false);

  // Rebuild when pairCount changes (resize)
  useEffect(() => {
    resetGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairCount]);

  const matchedCount = useMemo(() => cards.filter((c) => c.matched).length / 2, [cards]);
  const totalPairs = useMemo(() => new Set(cards.map((c) => c.pairId)).size, [cards]);

  const resetGame = useCallback(() => {
    setCards(buildCards(pairCount));
    setSelected([]);
    setChecking(false);
    setGameOver(false);
    setWon(false);
  }, [pairCount]);

  const handleCardClick = useCallback(
    (id: number) => {
      if (checking || gameOver || won) return;
      const card = cards.find((c) => c.id === id);
      if (!card || card.flipped || card.matched || card.locked) return;
      if (selected.length >= 2) return;

      // Flip card & increment counter
      const updated = cards.map((c) => {
        if (c.id === id) {
          const newFlipCount = c.flipCount + 1;
          return { ...c, flipped: true, flipCount: newFlipCount };
        }
        return c;
      });
      const newSelected = [...selected, id];
      setCards(updated);
      setSelected(newSelected);

      if (newSelected.length === 2) {
        setChecking(true);
        const [firstId, secondId] = newSelected;
        const first = updated.find((c) => c.id === firstId)!;
        const second = updated.find((c) => c.id === secondId)!;

        setTimeout(() => {
          let finalCards: MemoryCard[];
          if (first.pairId === second.pairId && first.lang !== second.lang) {
            // Match found
            finalCards = updated.map((c) =>
              c.pairId === first.pairId ? { ...c, matched: true, flipped: true } : c
            );
          } else {
            // No match — lock cards that hit limit
            finalCards = updated.map((c) => {
              if (c.id === firstId || c.id === secondId) {
                const isLocked = c.flipCount >= MAX_FLIPS;
                return { ...c, flipped: false, locked: isLocked };
              }
              return c;
            });
          }

          setCards(finalCards);
          setSelected([]);
          setChecking(false);

          // Check win/lose
          const allMatched = finalCards.filter((c) => c.matched).length === finalCards.length;
          const anyLocked = finalCards.some((c) => c.locked);
          if (allMatched) setWon(true);
          else if (anyLocked) setGameOver(true);
        }, 800);
      }
    },
    [cards, selected, checking, gameOver, won]
  );

  const gridCols = isMobile ? "grid-cols-3" : "grid-cols-5";

  return (
    <>
      {/* Rules */}
      <section className="py-4 sm:py-8 px-3 sm:px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-2xl px-4 sm:px-8 py-2 sm:py-2.5 text-center">
            <h2 className="font-game text-base sm:text-xl font-bold">Pravidla Hry</h2>
          </div>
          <div className="bg-muted rounded-b-2xl border border-t-0 border-border px-4 sm:px-8 py-3 sm:py-4 shadow-sm">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-body font-bold text-foreground text-sm sm:text-base">Pexeso</h3>
                <p className="font-body text-muted-foreground text-xs sm:text-sm leading-relaxed">
                  Najdi dvojice německých slovíček a jejich českých překladů. Pozor! Každou kartu můžeš otočit jen 3×, tak si dobře pamatuj, co pod ní bylo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Game Area */}
      <section className="px-3 sm:px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Status bar */}
          <div className="flex items-center justify-between mb-4 px-1">
            <span className="font-body text-sm sm:text-base text-foreground font-semibold">
              Nalezeno: {matchedCount} / {totalPairs}
            </span>
            <button
              onClick={resetGame}
              className="flex items-center gap-1.5 font-body text-xs sm:text-sm font-semibold bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Nová hra
            </button>
          </div>

          {/* Overlay */}
          {(won || gameOver) && (
            <div className="relative z-10 mb-4 flex flex-col items-center gap-4">
              <div className={`rounded-2xl border-2 px-6 py-8 text-center w-full ${won ? "bg-primary/10 border-primary" : "bg-destructive/10 border-destructive"}`}>
                <div className="flex justify-center mb-3">
                  {won ? <Trophy className="w-12 h-12 text-primary" /> : <Skull className="w-12 h-12 text-destructive" />}
                </div>
                <h3 className={`font-game text-lg sm:text-2xl mb-2 ${won ? "text-primary" : "text-destructive"}`}>
                  {won ? "Výborně!" : "Game Over"}
                </h3>
                <p className="font-body text-muted-foreground text-sm mb-2">
                  {won
                    ? `Všech ${totalPairs} dvojic nalezeno!`
                    : "Vyčerpal jsi pokusy u jedné z karet."}
                </p>
                {completedGames > 0 && (
                  <p className="font-body text-muted-foreground text-xs mb-4">
                    Dokončeno her: {completedGames}
                  </p>
                )}
                <button
                  onClick={() => {
                    if (won) {
                      setTotalMatchedPairs((prev) => prev + totalPairs);
                      setCompletedGames((prev) => prev + 1);
                    }
                    resetGame();
                  }}
                  className="font-game text-xs sm:text-sm bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
                >
                  {won ? "Další hra" : "Zkusit znovu"}
                </button>
              </div>

              {/* Share section */}
              {won && (
                <div className="bg-share-bg rounded-2xl shadow-lg p-6 w-full max-w-xs flex flex-col items-center gap-3 relative overflow-hidden">
                  {Array.from({ length: 20 }).map((_, i) => {
                    const left = Math.random() * 100;
                    const top = Math.random() * 100;
                    const delay = (Math.random() * 2).toFixed(2);
                    const size = Math.random() > 0.5 ? "text-sm" : "text-xs";
                    return (
                      <span
                        key={`bg-${i}`}
                        className={`absolute ${size} pointer-events-none`}
                        style={{
                          left: `${left}%`,
                          top: `${top}%`,
                          animation: `sparkle-float 2s ease-in-out ${delay}s infinite`,
                        }}
                      >
                        ✨
                      </span>
                    );
                  })}
                  <span className="relative z-10 font-game text-sm text-foreground text-center">📣 Pochlub se a sdílej výsledek 🤩</span>
                  <div className="relative">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                      const rad = (angle * Math.PI) / 180;
                      const x = Math.cos(rad) * 38;
                      const y = Math.sin(rad) * 38;
                      return (
                        <span
                          key={i}
                          className="absolute left-1/2 top-1/2 text-xs pointer-events-none"
                          style={{
                            ["--sp-x" as string]: `${x}px`,
                            ["--sp-y" as string]: `${y}px`,
                            animation: `sparkle-burst 1.6s ease-in-out ${(i * 0.2).toFixed(1)}s infinite`,
                          }}
                        >
                          ✨
                        </span>
                      );
                    })}
                    <button
                      onClick={() => {
                        const newCompleted = completedGames + 1;
                        const newPairs = totalMatchedPairs + totalPairs;
                        navigator.clipboard.writeText(
                          `V pexesu na https://www.germanllama.com jsem našel už ${newPairs} dvojic a dokončil ${newCompleted} kol! Zkus to taky 🦙`
                        );
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="relative z-10 flex items-center gap-2 font-game text-xs px-5 py-3 rounded-xl bg-primary text-primary-foreground hover:scale-105 transition-transform shadow-md"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Zkopírováno!" : "Kopírovat"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Card Grid */}
          <div className={`grid ${gridCols} gap-2 sm:gap-3`}>
            {cards.map((card) => {
              const isRevealed = card.flipped || card.matched;
              const isLocked = card.locked;
              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  disabled={isRevealed || isLocked || checking || gameOver || won}
                  className={`relative aspect-[3/4] rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                    card.matched
                      ? "bg-primary/15 border-primary"
                      : isLocked
                        ? "bg-muted/60 border-border opacity-50 cursor-not-allowed"
                        : isRevealed
                          ? "bg-card border-primary shadow-md"
                          : "bg-card border-border hover:border-primary/50 hover:shadow-sm cursor-pointer"
                  }`}
                >
                  {isRevealed ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2 sm:p-3">
                      <span className="font-body text-xs sm:text-sm font-bold text-foreground text-center leading-snug break-words">
                        {card.text}
                      </span>
                      <span className={`mt-1.5 font-body text-[9px] sm:text-xs font-semibold uppercase ${card.lang === "de" ? "text-primary" : "text-accent"}`}>
                        {card.lang === "de" ? "DE" : "CZ"}
                      </span>
                    </div>
                  ) : isLocked ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-game text-[8px] sm:text-xs text-muted-foreground">✕</span>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                      <img
                        src={germanLlamaLogo}
                        alt="GermanLlama"
                        className="w-8 h-8 sm:w-12 sm:h-12 rounded-md opacity-70"
                      />
                    </div>
                  )}
                  {/* Flip counter badge */}
                  {!card.matched && !isLocked && (
                    <div className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1">
                      <span
                        className={`font-body text-[7px] sm:text-[9px] font-bold px-1 py-0.5 rounded ${
                          card.flipCount >= 2
                            ? "bg-destructive/20 text-destructive"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {card.flipCount}/{MAX_FLIPS}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Pexeso;
