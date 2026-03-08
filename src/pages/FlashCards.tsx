import { useState, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight, Shuffle, BookOpen } from "lucide-react";
import { getAllFlashCards, type FlashCard } from "@/game/vocabularyData";
import germanLlamaLogo from "@/assets/germanllama-logo.png";

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const FlashCards = () => {
  const allCards = useMemo(() => getAllFlashCards(), []);
  const [cards, setCards] = useState<FlashCard[]>(allCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = cards[currentIndex];

  const goNext = useCallback(() => {
    setFlipped(false);
    setCurrentIndex((i) => (i + 1) % cards.length);
  }, [cards.length]);

  const goPrev = useCallback(() => {
    setFlipped(false);
    setCurrentIndex((i) => (i - 1 + cards.length) % cards.length);
  }, [cards.length]);

  const handleShuffle = useCallback(() => {
    setFlipped(false);
    setCards(shuffleArray(allCards));
    setCurrentIndex(0);
  }, [allCards]);

  return (
    <section className="py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Instructions box */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-2xl px-4 sm:px-8 py-2 sm:py-2.5 text-center">
          <h2 className="font-game text-base sm:text-xl font-bold">
            Flash Cards
          </h2>
        </div>
        <div className="bg-muted rounded-b-2xl border border-t-0 border-border px-4 sm:px-8 py-3 sm:py-4 shadow-sm mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-body font-bold text-foreground text-sm sm:text-base">Jak na to</h3>
              <p className="font-body text-muted-foreground text-xs sm:text-sm leading-relaxed">
                Přelož si slovíčko nebo větu a poté otoč kliknutím na kartičku pro kontrolu.
              </p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="flex flex-col items-center">
          <div
            className="w-full max-w-md aspect-[3/2] cursor-pointer mb-4 sm:mb-6"
            style={{ perspective: "1000px" }}
            onClick={() => setFlipped((f) => !f)}
          >
            <div
              className="relative w-full h-full transition-transform duration-500"
              style={{
                transformStyle: "preserve-3d",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Front */}
              <div
                className="absolute inset-0 rounded-2xl border-2 border-border bg-card shadow-lg flex flex-col items-center justify-center p-6 sm:p-8"
                style={{ backfaceVisibility: "hidden" }}
              >
                <img
                  src={germanLlamaLogo}
                  alt="GermanLlama"
                  className="absolute top-3 left-3 sm:top-4 sm:left-4 w-8 h-8 sm:w-10 sm:h-10 rounded-md opacity-60"
                />
                <span className="text-[10px] sm:text-xs font-body text-muted-foreground mb-2 uppercase tracking-wider">
                  {card.type === "noun" ? "Podstatné jméno" : "Věta"}
                </span>
                <p className={`font-body font-bold text-foreground text-center leading-relaxed break-words hyphens-auto ${card.type === "sentence" ? "text-base sm:text-xl" : "text-xl sm:text-3xl"}`}>
                  {card.german}
                </p>
                <span className="text-[10px] sm:text-xs font-body text-muted-foreground mt-4">
                  Klikni pro otočení →
                </span>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 rounded-2xl border-2 border-primary bg-primary/5 shadow-lg flex flex-col items-center justify-center p-6 sm:p-8"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <img
                  src={germanLlamaLogo}
                  alt="GermanLlama"
                  className="absolute top-3 left-3 sm:top-4 sm:left-4 w-8 h-8 sm:w-10 sm:h-10 rounded-md opacity-60"
                />
                <span className="text-[10px] sm:text-xs font-body text-primary mb-2 uppercase tracking-wider font-semibold">
                  Překlad
                </span>
                <p className="font-body font-bold text-foreground text-lg sm:text-2xl text-center leading-relaxed">
                  {card.czech}
                </p>
              </div>
            </div>
          </div>

          {/* Counter */}
          <p className="font-body text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4">
            {currentIndex + 1} / {cards.length}
          </p>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={goPrev}
              className="flex items-center gap-1 font-body font-semibold text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl border-2 border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted active:scale-95 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Předchozí
            </button>
            <button
              onClick={handleShuffle}
              className="flex items-center gap-1 font-body font-semibold text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl border-2 border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 active:scale-95 transition-all"
            >
              <Shuffle className="w-4 h-4" />
              Náhodné
            </button>
            <button
              onClick={goNext}
              className="flex items-center gap-1 font-body font-semibold text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl border-2 border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted active:scale-95 transition-all"
            >
              Další
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlashCards;
