import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
import { ArrowLeft, GripVertical } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { getStory, chunksToWords, pairColorClass, type StoryWord } from "@/data/beginnerStories";

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface PoolItem {
  id: string;
  text: string;
  pair: number;
}

function buildPool(sentences: StoryWord[][]): PoolItem[] {
  const items: PoolItem[] = [];
  sentences.forEach((words, sIdx) => {
    words.forEach((w, wIdx) => items.push({ id: `pool-${sIdx}-${wIdx}`, text: w.text, pair: w.pair }));
  });
  return shuffleArray(items);
}

// Word bank tile — draggable and tappable
function PoolTile({
  id,
  text,
  colorClass,
  selected,
  onTap,
}: {
  id: string;
  text: string;
  colorClass: string;
  selected: boolean;
  onTap: () => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onTap}
      style={{ touchAction: "none" }}
      className={`w-full flex items-center justify-center gap-1 px-1.5 py-2 rounded-lg border-2 font-body text-xs sm:text-sm text-center cursor-grab active:cursor-grabbing select-none transition-all ${
        isDragging
          ? "opacity-30 border-primary/30 bg-muted/50"
          : selected
            ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/30"
            : "border-border bg-card hover:border-primary/50 hover:shadow-sm"
      }`}
    >
      <span className={`font-semibold break-words ${colorClass}`}>{text}</span>
    </div>
  );
}

// Blank slot inside a sentence being built — droppable and tappable
function Slot({
  id,
  answerText,
  filled,
  colorClass,
  shaking,
  clickable,
  onTap,
}: {
  id: string;
  answerText: string;
  filled: boolean;
  colorClass: string;
  shaking: boolean;
  clickable: boolean;
  onTap: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      onClick={onTap}
      style={{ minWidth: `${Math.max(answerText.length, 2)}ch` }}
      className={`min-h-[28px] sm:min-h-[30px] flex items-center justify-center px-1.5 py-1 rounded-md border-2 transition-all ${
        shaking
          ? "animate-shake border-destructive bg-destructive/10"
          : filled
            ? "border-transparent bg-transparent"
            : isOver
              ? "border-primary bg-primary/10 scale-[1.03]"
              : clickable
                ? "border-primary/50 bg-primary/5 cursor-pointer border-dashed animate-pulse"
                : "border-border bg-muted/30 border-dashed"
      }`}
    >
      {filled && <span className={`font-body text-xs sm:text-sm font-bold ${colorClass}`}>{answerText}</span>}
    </div>
  );
}

const StoryExercise = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const story = storyId ? getStory(storyId) : undefined;

  const germanBySentence = useMemo(
    () => story?.sentences.map((s) => chunksToWords(s.german)) ?? [],
    [story]
  );
  const englishBySentence = useMemo(
    () => story?.sentences.map((s) => chunksToWords(s.english)) ?? [],
    [story]
  );

  const [hideGerman, setHideGerman] = useState(false);
  const [filled, setFilled] = useState<Record<string, boolean>>({});
  const [pool, setPool] = useState<PoolItem[]>([]);
  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(null);
  const [shakeSlot, setShakeSlot] = useState<string | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  useEffect(() => {
    setPool(buildPool(germanBySentence));
    setFilled({});
    setSelectedPoolId(null);
    setHideGerman(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyId]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  );

  const attemptPlace = useCallback(
    (poolItem: PoolItem, slotId: string, sIdx: number, wIdx: number) => {
      const target = germanBySentence[sIdx]?.[wIdx];
      if (!target) return;
      if (!filled[slotId] && target.text === poolItem.text) {
        setFilled((prev) => ({ ...prev, [slotId]: true }));
        setPool((prev) => prev.filter((p) => p.id !== poolItem.id));
      } else {
        setShakeSlot(slotId);
        setTimeout(() => setShakeSlot((s) => (s === slotId ? null : s)), 400);
      }
      setSelectedPoolId(null);
    },
    [filled, germanBySentence]
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveDragId(String(event.active.id));
    setSelectedPoolId(null);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveDragId(null);
      const { active, over } = event;
      if (!over) return;
      const poolItem = pool.find((p) => p.id === active.id);
      if (!poolItem) return;
      const match = String(over.id).match(/^slot-(\d+)-(\d+)$/);
      if (!match) return;
      attemptPlace(poolItem, String(over.id), Number(match[1]), Number(match[2]));
    },
    [pool, attemptPlace]
  );

  const handlePoolTap = useCallback((id: string) => {
    setSelectedPoolId((prev) => (prev === id ? null : id));
  }, []);

  const handleSlotTap = useCallback(
    (slotId: string, sIdx: number, wIdx: number) => {
      if (!selectedPoolId) return;
      const poolItem = pool.find((p) => p.id === selectedPoolId);
      if (!poolItem) return;
      attemptPlace(poolItem, slotId, sIdx, wIdx);
    },
    [selectedPoolId, pool, attemptPlace]
  );

  const activeDragItem = useMemo(() => pool.find((p) => p.id === activeDragId), [activeDragId, pool]);

  if (!story) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="font-body text-muted-foreground">Story not found.</p>
        <Link to="/start-from-beginning/sentence-structure" className="text-accent underline font-body text-sm">
          Back to Sentence Structure
        </Link>
      </section>
    );
  }

  const allDone = pool.length === 0;

  return (
    <>
      <SEOHead
        title={`${story.title} | Start German From the Beginning | GermanLlama`}
        description="Read a short German story side by side with English, then rebuild each sentence yourself."
        canonical={`/start-from-beginning/sentence-structure/${story.id}`}
      />
      <section className="max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-4">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
          <Link
            to="/start-from-beginning/sentence-structure"
            className="inline-flex items-center gap-1.5 font-body text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>

          <button
            onClick={() => setHideGerman((h) => !h)}
            className="font-game text-[10px] sm:text-xs px-3 py-1.5 rounded-lg border-2 border-accent text-accent hover:bg-accent/10 transition-colors"
          >
            {hideGerman ? "Show German" : "Hide German"}
          </button>
        </div>

        <h1 className="font-game text-sm sm:text-lg text-foreground mb-1">{story.title}</h1>

        {allDone && (
          <div className="mb-2 rounded-xl border-2 border-accent bg-accent/10 px-4 py-2 text-center">
            <p className="font-game text-xs sm:text-sm text-accent">🎉 Great job! You rebuilt the whole story.</p>
          </div>
        )}

        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-6">
          <div className="flex-1 min-w-0">
          {/* Column headers (desktop) */}
          <div className="hidden sm:grid sm:grid-cols-[1fr_1fr_1.3fr] sm:gap-x-4 mb-0.5">
            <span className="font-game text-[9px] text-muted-foreground">English</span>
            <span className="font-game text-[9px] text-muted-foreground">German</span>
            <span className="font-game text-[9px] text-muted-foreground">Build the sentence</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1.3fr] sm:gap-x-4 gap-y-0.5 sm:gap-y-0">
            {story.sentences.map((_, sIdx) => {
              const deWords = germanBySentence[sIdx];
              const enWords = englishBySentence[sIdx];
              const rowBorder = "py-1 sm:py-1.5 border-b border-border/50";
              return (
                <React.Fragment key={sIdx}>
                  {/* English column */}
                  <p className={`font-body text-[11px] sm:text-xs text-muted-foreground flex flex-wrap content-start gap-x-1.5 ${rowBorder}`}>
                    <span className="sm:hidden shrink-0">🇬🇧</span>
                    {enWords.map((w, i) => (
                      <span key={i} className={pairColorClass(w.pair)}>
                        {w.text}
                      </span>
                    ))}
                  </p>

                  {/* German column (hideable) */}
                  <p className={`font-body text-xs sm:text-sm flex flex-wrap content-start gap-x-1.5 min-h-[1.25rem] ${rowBorder}`}>
                    {hideGerman ? (
                      <span className="text-muted-foreground italic text-[10px]">🙈 hidden</span>
                    ) : (
                      <>
                        <span className="sm:hidden shrink-0">🇩🇪</span>
                        {deWords.map((w, i) => (
                          <span key={i} className={`font-semibold ${pairColorClass(w.pair)}`}>
                            {w.text}
                          </span>
                        ))}
                      </>
                    )}
                  </p>

                  {/* Build column */}
                  <div className={`flex flex-wrap content-start gap-1 sm:gap-1.5 ${rowBorder}`}>
                    {deWords.map((w, wIdx) => {
                      const slotId = `slot-${sIdx}-${wIdx}`;
                      const isFilled = !!filled[slotId];
                      return (
                        <Slot
                          key={slotId}
                          id={slotId}
                          answerText={w.text}
                          filled={isFilled}
                          colorClass={pairColorClass(w.pair)}
                          shaking={shakeSlot === slotId}
                          clickable={selectedPoolId !== null && !isFilled}
                          onTap={() => handleSlotTap(slotId, sIdx, wIdx)}
                        />
                      );
                    })}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
          </div>

          {/* Shared word bank — sticky 4th column on desktop, so it stays visible while scrolling */}
          <div className="lg:w-80 shrink-0">
            <div className="lg:sticky lg:top-28 rounded-xl border-2 border-dashed border-border p-3 sm:p-4 mt-6 lg:mt-0">
              <h3 className="font-game text-[10px] sm:text-xs text-muted-foreground mb-3">Word Bank</h3>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {pool.map((item) => (
                  <PoolTile
                    key={item.id}
                    id={item.id}
                    text={item.text}
                    colorClass={pairColorClass(item.pair)}
                    selected={selectedPoolId === item.id}
                    onTap={() => handlePoolTap(item.id)}
                  />
                ))}
                {allDone && <p className="font-body text-xs text-muted-foreground italic">All words placed!</p>}
              </div>
            </div>
          </div>
          </div>

          <DragOverlay>
            {activeDragItem ? (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 border-primary bg-card shadow-lg font-body text-sm opacity-80">
                <GripVertical className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className={`font-semibold ${pairColorClass(activeDragItem.pair)}`}>{activeDragItem.text}</span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </section>
    </>
  );
};

export default StoryExercise;
