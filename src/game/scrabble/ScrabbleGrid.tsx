import { memo } from "react";
import { type CrosswordData } from "./crosswordGenerator";

interface ScrabbleGridProps {
  crossword: CrosswordData;
  filledCells: Record<string, string>;
  pendingCells: Record<string, string>;
  cellNumbers: Record<string, number>;
  activeWordCells: Set<string>;
  cursorCellKey: string | null;
  shakingCells: Set<string>;
  onCellClick: (row: number, col: number) => void;
  onDrop: (row: number, col: number, tileId: number) => void;
  onCellRef: (key: string, el: HTMLDivElement | null) => void;
}

const ScrabbleGrid = memo(function ScrabbleGrid({
  crossword,
  filledCells,
  pendingCells,
  cellNumbers,
  activeWordCells,
  cursorCellKey,
  shakingCells,
  onCellClick,
  onDrop,
  onCellRef,
}: ScrabbleGridProps) {
  return (
    <div className="flex justify-center mb-6 overflow-x-auto">
      <div
        className="inline-grid gap-0"
        style={{
          gridTemplateColumns: `repeat(${crossword.cols}, auto)`,
        }}
      >
        {Array.from({ length: crossword.rows }, (_, row) =>
          Array.from({ length: crossword.cols }, (_, col) => {
            const key = `${row}-${col}`;
            const letter = crossword.grid[row][col];
            const filled = filledCells[key];
            const pending = pendingCells[key];
            const isActive = activeWordCells.has(key);
            const isCursor = cursorCellKey === key;
            const isShaking = shakingCells.has(key);
            const num = cellNumbers[key];

            if (!letter) {
              return <div key={key} className="w-10 h-10 sm:w-12 sm:h-12" />;
            }

            const displayLetter = filled || pending;
            const isFilled = !!filled;
            const isPending = !!pending && !filled;

            return (
              <div
                key={key}
                ref={el => onCellRef(key, el)}
                onClick={() => onCellClick(row, col)}
                className={`
                  relative w-10 h-10 sm:w-12 sm:h-12 border flex items-center justify-center
                  font-body font-bold text-sm sm:text-base cursor-pointer select-none transition-all
                  ${isFilled ? "bg-primary text-primary-foreground border-primary/50" : ""}
                  ${isPending ? "bg-card text-muted-foreground border-border/50" : ""}
                  ${!displayLetter ? "bg-card border-border/50" : ""}
                  ${isActive && !isFilled ? "ring-2 ring-primary/40" : ""}
                  ${isCursor && !isFilled ? "ring-2 ring-primary border-primary" : ""}
                  ${isShaking ? "animate-shake" : ""}
                `}
                onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
                onDrop={e => {
                  e.preventDefault();
                  const tileId = parseInt(e.dataTransfer.getData("text/plain"), 10);
                  if (!isNaN(tileId)) onDrop(row, col, tileId);
                }}
              >
                {num && !displayLetter && (
                  <span className="absolute top-0 left-0.5 text-[8px] sm:text-[10px] text-muted-foreground font-body">
                    {num}
                  </span>
                )}
                {displayLetter && <span>{displayLetter}</span>}
                {isCursor && !displayLetter && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="w-0.5 h-5 bg-primary animate-pulse" />
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});

export default ScrabbleGrid;
