import React, { useState, useCallback, useMemo } from "react";
import { FILL_QUESTIONS } from "@/game/vocabularyData";
import { Copy, Check, ArrowRight, GripVertical, PuzzleIcon } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const SENTENCES_PER_ROUND = 5;

interface SentencePair {
  id: number;
  fullGerman: string;
  translation: string;
  start: string;
  end: string;
  matched: boolean;
}

function splitSentence(sentence: string): { start: string; end: string } {
  const words = sentence.split(" ");
  const splitAt = Math.min(2, Math.max(1, Math.floor(words.length / 2)));
  return {
    start: words.slice(0, splitAt).join(" "),
    end: words.slice(splitAt).join(" "),
  };
}

function buildRound(): SentencePair[] {
  const selected = shuffleArray(FILL_QUESTIONS).slice(0, SENTENCES_PER_ROUND);
  return selected.map((q, i) => {
    const full = q.sentence.replace("___", q.answer);
    const { start, end } = splitSentence(full);
    return { id: i, fullGerman: full, translation: q.translation, start, end, matched: false };
  });
}

// Draggable end piece
function DraggableEnd({ id, text, disabled }: { id: string; text: string; disabled: boolean }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id, disabled });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg border-2 font-body text-xs sm:text-sm cursor-grab active:cursor-grabbing select-none transition-all ${
        isDragging
          ? "opacity-30 border-primary/30 bg-muted/50"
          : disabled
            ? "opacity-40 border-border bg-muted/30 cursor-default"
            : "border-border bg-card hover:border-primary/50 hover:shadow-sm"
      }`}
    >
      <GripVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
      <span className="text-foreground font-semibold">{text}</span>
    </div>
  );
}

// Droppable slot
function DroppableSlot({
  id,
  matched,
  matchedText,
  isOver,
}: {
  id: string;
  matched: boolean;
  matchedText?: string;
  isOver: boolean;
}) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`min-h-[40px] sm:min-h-[44px] rounded-lg border-2 border-dashed px-3 py-2 sm:px-4 sm:py-2.5 transition-all flex items-center ${
        matched
          ? "border-primary bg-primary/10"
          : isOver
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border bg-muted/30"
      }`}
    >
      {matched ? (
        <span className="font-body text-xs sm:text-sm font-bold text-primary">{matchedText}</span>
      ) : (
        <span className="font-body text-[10px] sm:text-xs text-muted-foreground italic">přetáhni sem...</span>
      )}
    </div>
  );
}

const SentenceBuilder = () => {
  const [pairs, setPairs] = useState<SentencePair[]>(() => buildRound());
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [completedRounds, setCompletedRounds] = useState(0);
  const [copied, setCopied] = useState(false);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [overSlotId, setOverSlotId] = useState<string | null>(null);

  const availableEnds = useMemo(() => {
    const matched = new Set(pairs.filter((p) => p.matched).map((p) => p.id));
    return shuffleArray(pairs.filter((p) => !matched.has(p.id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairs]);

  const allMatched = pairs.every((p) => p.matched);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  }, []);

  const handleDragOver = useCallback((event: any) => {
    setOverSlotId(event.over?.id ? String(event.over.id) : null);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveDragId(null);
      setOverSlotId(null);
      const { active, over } = event;
      if (!over) return;

      const draggedEndId = parseInt(String(active.id).replace("end-", ""));
      const slotId = parseInt(String(over.id).replace("slot-", ""));

      if (isNaN(draggedEndId) || isNaN(slotId)) return;

      // Check if it's a correct match
      if (draggedEndId === slotId) {
        setPairs((prev) =>
          prev.map((p) => (p.id === slotId ? { ...p, matched: true } : p))
        );
        setScore((s) => s + 1);
      }
    },
    []
  );

  const handleNextRound = () => {
    const newTotalScore = totalScore + score;
    const newRounds = completedRounds + 1;
    setTotalScore(newTotalScore);
    setCompletedRounds(newRounds);
    setScore(0);
    setPairs(buildRound());
  };

  const handleCopy = () => {
    const finalScore = totalScore + score;
    const finalRounds = completedRounds + (allMatched ? 1 : 0);
    navigator.clipboard.writeText(
      `Na Germanllama.com jsem ve Skládání vět správně složil/a ${finalScore} vět v ${finalRounds} kolech! Zkus to taky 🦙 https://www.germanllama.com`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeDragText = useMemo(() => {
    if (!activeDragId) return "";
    const id = parseInt(activeDragId.replace("end-", ""));
    return pairs.find((p) => p.id === id)?.end ?? "";
  }, [activeDragId, pairs]);

  return (
    <>
      <section className="max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
        {/* Rules box */}
        <div className="mb-6">
          <button
            onClick={() => setRulesOpen(!rulesOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-muted border-2 border-border hover:border-primary/30 transition-colors"
          >
            <span className="font-game text-[10px] sm:text-xs text-foreground">📖 Pravidla hry</span>
            {rulesOpen ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          {rulesOpen && (
            <div className="mt-2 px-4 py-3 rounded-xl bg-card border border-border">
              <p className="font-body text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Přiřaď správné konce německých vět k jejich začátkům. Pomůže ti český překlad vlevo.
                Stačí konec věty chytit a přetáhnout na správné místo.
              </p>
            </div>
          )}
        </div>

        {/* Score */}
        <div className="flex items-center justify-between mb-5">
          <span className="font-game text-[10px] sm:text-xs text-muted-foreground">
            Kolo: {completedRounds + 1}
          </span>
          <span className="font-game text-[10px] sm:text-xs text-foreground">
            ✅ {score}/{SENTENCES_PER_ROUND}
          </span>
        </div>

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: sentence starts with drop zones */}
            <div className="space-y-3">
              <h3 className="font-game text-[10px] sm:text-xs text-muted-foreground mb-2">Začátky vět</h3>
              {pairs.map((pair) => (
                <div
                  key={pair.id}
                  className={`rounded-xl border-2 p-3 sm:p-4 transition-all ${
                    pair.matched ? "border-primary/40 bg-primary/5" : "border-border bg-card"
                  }`}
                >
                  <p className="font-body text-[10px] sm:text-xs text-muted-foreground mb-1.5 italic">
                    🇨🇿 {pair.translation}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-body text-xs sm:text-sm font-bold text-foreground whitespace-nowrap">
                      🇩🇪 {pair.start}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-[120px]">
                      <DroppableSlot
                        id={`slot-${pair.id}`}
                        matched={pair.matched}
                        matchedText={pair.end}
                        isOver={overSlotId === `slot-${pair.id}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: draggable ends */}
            <div className="space-y-3">
              <h3 className="font-game text-[10px] sm:text-xs text-muted-foreground mb-2">Konce vět</h3>
              {availableEnds.length > 0 ? (
                <div className="space-y-2">
                  {availableEnds.map((pair) => (
                    <DraggableEnd
                      key={pair.id}
                      id={`end-${pair.id}`}
                      text={pair.end}
                      disabled={pair.matched}
                    />
                  ))}
                </div>
              ) : (
                <p className="font-body text-xs text-muted-foreground italic text-center py-4">
                  Vše přiřazeno! 🎉
                </p>
              )}
            </div>
          </div>

          <DragOverlay>
            {activeDragId ? (
              <div className="flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg border-2 border-primary bg-card shadow-lg font-body text-xs sm:text-sm">
                <GripVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
                <span className="text-foreground font-semibold">{activeDragText}</span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Win banner */}
        {allMatched && (
          <div className="mt-8 rounded-2xl border-2 border-primary p-6 sm:p-8 text-center space-y-4" style={{ background: `hsl(var(--share-bg))` }}>
            <div className="space-y-1">
              <h2 className="font-game text-sm sm:text-base text-foreground">🎉 Skvělá práce!</h2>
              <p className="font-body text-xs sm:text-sm text-muted-foreground">
                Složil/a jsi všech {SENTENCES_PER_ROUND} vět správně!
              </p>
            </div>

            {/* Sparkle share section */}
            <div className="flex flex-col items-center gap-3">
              <span className="font-game text-[10px] sm:text-xs text-foreground">📣 Pochlub se a sdílej výsledek 🤩</span>
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
                  onClick={handleCopy}
                  className="relative z-10 flex items-center gap-2 font-game text-xs px-5 py-3 rounded-xl bg-primary text-primary-foreground hover:scale-105 transition-transform shadow-md"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Zkopírováno!" : "Kopírovat"}
                </button>
              </div>
            </div>

            <button
              onClick={handleNextRound}
              className="font-game text-xs px-6 py-3 rounded-xl bg-accent text-accent-foreground hover:scale-105 transition-transform shadow-md"
            >
              Další věty →
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default SentenceBuilder;
