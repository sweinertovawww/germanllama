import { useState, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight, BookOpen, ArrowLeft, Gamepad2 } from "lucide-react";
import { getAllFlashCards, filterByProfession, type FlashCard, type Profession } from "@/game/vocabularyData";
import germanLlamaLogo from "@/assets/germanllama-logo.png";
import { useProfessionFilter } from "@/hooks/useProfessionFilter";
import ProfessionFilter from "@/components/ProfessionFilter";

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

type Category = "mix" | "nouns" | "sentences";

const FlashCards = () => {
  const allCardsRaw = useMemo(() => getAllFlashCards(), []);
  const profFilter = useProfessionFilter();

  const [inLobby, setInLobby] = useState(true);
  const [category, setCategory] = useState<Category>("mix");
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const startGame = useCallback(() => {
    const filtered = filterByProfession(allCardsRaw, profFilter.selected);
    setCards(shuffleArray(filtered));
    setCurrentIndex(0);
    setFlipped(false);
    setCategory("mix");
    setInLobby(false);
  }, [allCardsRaw, profFilter.selected]);

  const goToLobby = useCallback(() => {
    setInLobby(true);
    setCards([]);
    setCurrentIndex(0);
    setFlipped(false);
  }, []);

  const filteredByCategory = useCallback(
    (cat: Category, source: FlashCard[]) => {
      if (cat === "nouns") return source.filter((c) => c.type === "noun");
      if (cat === "sentences") return source.filter((c) => c.type === "sentence");
      return source;
    },
    []
  );

  const handleCategoryChange = useCallback(
    (cat: Category) => {
      const filtered = filterByProfession(allCardsRaw, profFilter.selected);
      const byCat = filteredByCategory(cat, filtered);
      setCategory(cat);
      setFlipped(false);
      setCards(shuffleArray(byCat));
      setCurrentIndex(0);
    },
    [allCardsRaw, profFilter.selected, filteredByCategory]
  );

  const card = cards[currentIndex];

  const goNext = useCallback(() => {
    setFlipped(false);
    setCurrentIndex((i) => (i + 1) % cards.length);
  }, [cards.length]);

  const goPrev = useCallback(() => {
    setFlipped(false);
    setCurrentIndex((i) => (i - 1 + cards.length) % cards.length);
  }, [cards.length]);

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
              <p className="font-body text-muted-foreground text-xs sm:text-sm leading-relaxed mt-1">
                Slovíčka a věty ve Flash Cards se objevují i v ostatních hrách. Čím víc se jich naučíš – tím více nasbíráš bodů při hraní. 😉
              </p>
            </div>
          </div>
        </div>

        {inLobby ? (
          /* === LOBBY === */
          <div className="flex flex-col items-center gap-4">
            <ProfessionFilter
              selected={profFilter.selected}
              onToggle={profFilter.toggle}
              onSelectAll={profFilter.selectAll}
              isAllSelected={profFilter.isAllSelected}
            />
            <button
              onClick={startGame}
              className="font-game text-sm sm:text-base px-10 sm:px-14 py-3 sm:py-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all shadow-lg flex items-center gap-2"
            >
              <Gamepad2 className="w-5 h-5" />
              START HRY
            </button>
          </div>
        ) : (
          /* === GAME === */
          <>
            {/* Top bar with back button */}
            <div className="flex items-center justify-between mb-4 px-1">
              <button
                onClick={goToLobby}
                className="font-game text-[10px] sm:text-xs border border-border text-muted-foreground px-2.5 py-1 rounded-lg hover:text-foreground hover:border-primary/50 transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                Změnit obor
              </button>
              <span className="font-body text-sm text-muted-foreground">
                {currentIndex + 1} / {cards.length}
              </span>
            </div>

            {/* Category filter */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-6">
              {([
                { key: "nouns" as Category, label: "Slovíčka" },
                { key: "sentences" as Category, label: "Věty / Fráze" },
                { key: "mix" as Category, label: "Mix" },
              ]).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => handleCategoryChange(key)}
                  className={`font-body font-semibold text-[11px] sm:text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border transition-all active:scale-95 ${
                    category === key
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Card */}
            {card && (
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
                      <p className={`font-body font-bold text-foreground text-center leading-relaxed break-words hyphens-auto ${card.type === "sentence" ? "text-base sm:text-xl" : "text-xl sm:text-3xl"}`}>
                        {card.czech}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-3 sm:gap-4">
                  <button
                    onClick={goPrev}
                    className="flex items-center gap-1 font-body font-semibold text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl border-2 border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted active:scale-95 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Předchozí
                  </button>
                  <button
                    onClick={goNext}
                    className="flex items-center gap-1 font-body font-semibold text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl border-2 border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted active:scale-95 transition-all"
                  >
                    Další
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default FlashCards;
