import { useState, useMemo, useCallback, useEffect } from "react";
import { type Profession, PROFESSION_LIST } from "@/game/vocabularyData";
import { generateCrossword, getWordsForProfession, type CrosswordData, type PlacedWord } from "./crosswordGenerator";
import { Grid, Hash } from "lucide-react";

function shuffle<T>(arr: T[]): T[] {
  const s = [...arr];
  for (let i = s.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
}

const GROUP_COLORS: Record<string, string> = {
  kancelář: "hsl(230 60% 55%)",
  řemesla: "hsl(210 70% 50%)",
  gastro: "hsl(25 90% 55%)",
  zdravotnictví: "hsl(150 60% 40%)",
  obchod: "hsl(160 55% 45%)",
  úklid: "hsl(180 55% 42%)",
  obecné: "hsl(210 10% 50%)",
  doprava: "hsl(280 65% 50%)",
  zemědělství: "hsl(90 70% 45%)",
  vzdělání: "hsl(260 70% 50%)",
};

type GamePhase = "lobby" | "playing" | "victory";

export default function ScrabbleGame() {
  const [phase, setPhase] = useState<GamePhase>("lobby");
  const [selectedProfessions, setSelectedProfessions] = useState<Profession[]>([]);
  const [crossword, setCrossword] = useState<CrosswordData | null>(null);
  const [filledCells, setFilledCells] = useState<Record<string, string>>({});
  const [selectedTile, setSelectedTile] = useState<number | null>(null);
  const [highlightedWord, setHighlightedWord] = useState<number | null>(null);
  const [shakingCell, setShakingCell] = useState<string | null>(null);
  const [completedWords, setCompletedWords] = useState<Set<number>>(new Set());
  const [tilePool, setTilePool] = useState<{ letter: string; id: number }[]>([]);

  const toggleProfession = useCallback((p: Profession) => {
    setSelectedProfessions(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  }, []);

  const startGame = useCallback(() => {
    const words = getWordsForProfession(selectedProfessions);
    if (words.length < 3) return;
    const cw = generateCrossword(words, 7);
    if (cw.placed.length < 2) return;
    setCrossword(cw);
    setFilledCells({});
    setCompletedWords(new Set());
    setSelectedTile(null);
    setHighlightedWord(null);

    // Build tile pool: all needed letters + distractors
    const neededLetters: string[] = [];
    for (const p of cw.placed) {
      for (let i = 0; i < p.word.length; i++) {
        const r = p.direction === "H" ? p.row : p.row + i;
        const c = p.direction === "H" ? p.col + i : p.col;
        const key = `${r}-${c}`;
        // Only add if not an intersection letter already counted
        if (!neededLetters.some((_, idx) => {
          // Check if this cell is shared — we still need the letter once
          return false;
        })) {
          neededLetters.push(p.word[i]);
        }
      }
    }

    // Deduplicate for intersections
    const cellLetters: Record<string, string> = {};
    for (const p of cw.placed) {
      for (let i = 0; i < p.word.length; i++) {
        const r = p.direction === "H" ? p.row : p.row + i;
        const c = p.direction === "H" ? p.col + i : p.col;
        cellLetters[`${r}-${c}`] = p.word[i];
      }
    }
    const uniqueLetters = Object.values(cellLetters);

    // Add 5 random distractors
    const alphabet = "ABCDEFGHIJKLMNOPRSTUVWZ";
    const distractors: string[] = [];
    for (let i = 0; i < 5; i++) {
      distractors.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
    }

    const allTiles = shuffle([...uniqueLetters, ...distractors]).map((letter, id) => ({ letter, id }));
    setTilePool(allTiles);
    setPhase("playing");
  }, [selectedProfessions]);

  // Check if a word is complete
  const checkWordCompletion = useCallback((filled: Record<string, string>, cw: CrosswordData) => {
    const newCompleted = new Set<number>();
    for (const p of cw.placed) {
      let complete = true;
      for (let i = 0; i < p.word.length; i++) {
        const r = p.direction === "H" ? p.row : p.row + i;
        const c = p.direction === "H" ? p.col + i : p.col;
        if (filled[`${r}-${c}`] !== p.word[i]) {
          complete = false;
          break;
        }
      }
      if (complete) newCompleted.add(p.number);
    }
    return newCompleted;
  }, []);

  // Place a tile on a cell
  const placeTile = useCallback((row: number, col: number) => {
    if (!crossword || selectedTile === null) return;
    const tile = tilePool.find(t => t.id === selectedTile);
    if (!tile) return;

    const key = `${row}-${col}`;
    if (filledCells[key]) return; // already filled

    // Check if this cell belongs to any word and if the letter is correct
    const expectedLetter = crossword.grid[row]?.[col];
    if (!expectedLetter) return;

    if (tile.letter === expectedLetter) {
      const newFilled = { ...filledCells, [key]: tile.letter };
      setFilledCells(newFilled);
      setTilePool(prev => prev.filter(t => t.id !== selectedTile));
      setSelectedTile(null);

      const completed = checkWordCompletion(newFilled, crossword);
      setCompletedWords(completed);

      // Check victory
      if (completed.size === crossword.placed.length) {
        setTimeout(() => setPhase("victory"), 600);
      }
    } else {
      // Wrong — shake
      setShakingCell(key);
      setTimeout(() => setShakingCell(null), 500);
      setSelectedTile(null);
    }
  }, [crossword, selectedTile, tilePool, filledCells, checkWordCompletion]);

  // Get cells for a word (for highlighting)
  const getWordCells = useCallback((p: PlacedWord): string[] => {
    const cells: string[] = [];
    for (let i = 0; i < p.word.length; i++) {
      const r = p.direction === "H" ? p.row : p.row + i;
      const c = p.direction === "H" ? p.col + i : p.col;
      cells.push(`${r}-${c}`);
    }
    return cells;
  }, []);

  const highlightedCells = useMemo(() => {
    if (highlightedWord === null || !crossword) return new Set<string>();
    const word = crossword.placed.find(p => p.number === highlightedWord);
    if (!word) return new Set<string>();
    return new Set(getWordCells(word));
  }, [highlightedWord, crossword, getWordCells]);

  // Get word number for a cell (first letter)
  const cellNumbers = useMemo(() => {
    if (!crossword) return {};
    const nums: Record<string, number> = {};
    for (const p of crossword.placed) {
      const key = `${p.row}-${p.col}`;
      if (!nums[key]) nums[key] = p.number;
    }
    return nums;
  }, [crossword]);

  if (phase === "lobby") {
    return <LobbyScreen
      selected={selectedProfessions}
      onToggle={toggleProfession}
      onSelectAll={() => setSelectedProfessions([])}
      isAllSelected={selectedProfessions.length === 0}
      onStart={startGame}
    />;
  }

  if (phase === "victory" && crossword) {
    return (
      <div className="max-w-md mx-auto text-center py-12 px-4">
        <h2 className="font-game text-2xl sm:text-3xl text-primary mb-4">Výborně! 🦙</h2>
        <p className="font-body text-foreground text-lg mb-8">
          Vyplnil/a jsi {crossword.placed.length} slov z {crossword.placed.length}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={startGame}
            className="font-body font-bold text-sm px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Hrát znovu
          </button>
          <button
            onClick={() => setPhase("lobby")}
            className="font-body font-bold text-sm px-6 py-3 rounded-xl border-2 border-border bg-card text-foreground hover:border-primary/40 transition-colors"
          >
            Změnit profesi
          </button>
        </div>
      </div>
    );
  }

  if (!crossword) return null;

  const horizontalWords = crossword.placed.filter(p => p.direction === "H");
  const verticalWords = crossword.placed.filter(p => p.direction === "V");

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4">
      {/* Grid */}
      <div className="flex justify-center mb-6 overflow-x-auto">
        <div
          className="inline-grid gap-0"
          style={{
            gridTemplateColumns: `repeat(${crossword.cols}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: crossword.rows }, (_, row) =>
            Array.from({ length: crossword.cols }, (_, col) => {
              const key = `${row}-${col}`;
              const letter = crossword.grid[row][col];
              const filled = filledCells[key];
              const isHighlighted = highlightedCells.has(key);
              const isShaking = shakingCell === key;
              const num = cellNumbers[key];

              if (!letter) {
                return <div key={key} className="w-10 h-10 sm:w-12 sm:h-12" />;
              }

              return (
                <div
                  key={key}
                  onClick={() => placeTile(row, col)}
                  className={`
                    relative w-10 h-10 sm:w-12 sm:h-12 border border-border/50 flex items-center justify-center
                    font-body font-bold text-sm sm:text-base cursor-pointer select-none transition-all
                    ${filled ? "bg-primary text-primary-foreground" : "bg-card"}
                    ${isHighlighted && !filled ? "ring-2 ring-primary/50" : ""}
                    ${isShaking ? "animate-shake" : ""}
                  `}
                  onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
                  onDrop={e => {
                    e.preventDefault();
                    const tileId = parseInt(e.dataTransfer.getData("text/plain"), 10);
                    if (!isNaN(tileId)) {
                      // Simulate selecting then placing
                      setSelectedTile(tileId);
                      // We need to place directly
                      const tile = tilePool.find(t => t.id === tileId);
                      if (tile && !filledCells[key]) {
                        const expected = crossword.grid[row]?.[col];
                        if (expected && tile.letter === expected) {
                          const newFilled = { ...filledCells, [key]: tile.letter };
                          setFilledCells(newFilled);
                          setTilePool(prev => prev.filter(t => t.id !== tileId));
                          setSelectedTile(null);
                          const completed = checkWordCompletion(newFilled, crossword);
                          setCompletedWords(completed);
                          if (completed.size === crossword.placed.length) {
                            setTimeout(() => setPhase("victory"), 600);
                          }
                        } else {
                          setShakingCell(key);
                          setTimeout(() => setShakingCell(null), 500);
                        }
                      }
                    }
                  }}
                >
                  {num && !filled && (
                    <span className="absolute top-0 left-0.5 text-[8px] sm:text-[10px] text-muted-foreground font-body">
                      {num}
                    </span>
                  )}
                  {filled && <span>{filled}</span>}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Clues */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 px-2">
        {horizontalWords.length > 0 && (
          <div>
            <h3 className="font-body font-bold text-sm text-foreground mb-2">→ Vodorovně</h3>
            <div className="space-y-1">
              {horizontalWords.map(p => (
                <button
                  key={p.number}
                  onClick={() => setHighlightedWord(highlightedWord === p.number ? null : p.number)}
                  className={`block w-full text-left font-body text-sm px-2 py-1 rounded transition-colors ${
                    highlightedWord === p.number ? "bg-primary/10" : "hover:bg-muted"
                  } ${completedWords.has(p.number) ? "line-through text-muted-foreground" : "text-foreground"}`}
                >
                  <span className="text-muted-foreground">{p.number}.</span>{" "}
                  {p.entry.czech} ({p.entry.article})
                  {completedWords.has(p.number) && " ✅"}
                </button>
              ))}
            </div>
          </div>
        )}
        {verticalWords.length > 0 && (
          <div>
            <h3 className="font-body font-bold text-sm text-foreground mb-2">↓ Svisle</h3>
            <div className="space-y-1">
              {verticalWords.map(p => (
                <button
                  key={p.number}
                  onClick={() => setHighlightedWord(highlightedWord === p.number ? null : p.number)}
                  className={`block w-full text-left font-body text-sm px-2 py-1 rounded transition-colors ${
                    highlightedWord === p.number ? "bg-primary/10" : "hover:bg-muted"
                  } ${completedWords.has(p.number) ? "line-through text-muted-foreground" : "text-foreground"}`}
                >
                  <span className="text-muted-foreground">{p.number}.</span>{" "}
                  {p.entry.czech} ({p.entry.article})
                  {completedWords.has(p.number) && " ✅"}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tile Pool */}
      <div className="px-2">
        <h3 className="font-body font-bold text-sm text-foreground mb-2 text-center">Písmena</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {tilePool.map(tile => (
            <div
              key={tile.id}
              draggable
              onDragStart={e => {
                e.dataTransfer.setData("text/plain", String(tile.id));
                e.dataTransfer.effectAllowed = "move";
              }}
              onClick={() => setSelectedTile(selectedTile === tile.id ? null : tile.id)}
              className={`
                w-11 h-11 flex items-center justify-center rounded-lg font-body font-bold text-base
                cursor-grab active:cursor-grabbing select-none transition-all
                bg-card border-2 shadow-sm hover:shadow-md
                ${selectedTile === tile.id
                  ? "border-primary ring-2 ring-primary/30 scale-110"
                  : "border-border text-foreground hover:border-primary/40"
                }
              `}
            >
              {tile.letter}
            </div>
          ))}
        </div>
      </div>

      {/* Back button */}
      <div className="text-center mt-6">
        <button
          onClick={() => setPhase("lobby")}
          className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Zpět na výběr profese
        </button>
      </div>
    </div>
  );
}

// Lobby screen
function LobbyScreen({
  selected,
  onToggle,
  onSelectAll,
  isAllSelected,
  onStart,
}: {
  selected: Profession[];
  onToggle: (p: Profession) => void;
  onSelectAll: () => void;
  isAllSelected: boolean;
  onStart: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
      <div className="text-center mb-6">
        <h2 className="font-game text-lg sm:text-xl text-foreground mb-1">Vyber si svou profesi</h2>
        <p className="font-body text-sm text-muted-foreground">
          Vyber profese, ze kterých chceš skládat křížovku
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-8">
        <button
          onClick={onSelectAll}
          className={`font-body font-bold text-[10px] sm:text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 transition-all active:scale-95 ${
            isAllSelected
              ? "text-primary-foreground border-transparent shadow-lg ring-2 ring-primary/30"
              : "bg-card text-foreground border-primary/50 hover:border-primary hover:shadow-md"
          }`}
          style={isAllSelected ? { backgroundColor: "hsl(var(--primary))", borderColor: "hsl(var(--primary))" } : undefined}
        >
          🌍 Všechny profese
        </button>

        {PROFESSION_LIST.map(prof => {
          const isActive = selected.includes(prof.id);
          const color = GROUP_COLORS[prof.group] || GROUP_COLORS.obecné;
          return (
            <button
              key={prof.id}
              onClick={() => onToggle(prof.id)}
              className={`font-body font-semibold text-[10px] sm:text-xs px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full border-2 transition-all active:scale-95 ${
                isActive
                  ? "text-white border-transparent shadow-md"
                  : "bg-card text-muted-foreground border-border hover:shadow-sm"
              }`}
              style={isActive ? { backgroundColor: color, borderColor: color } : undefined}
              onMouseEnter={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.borderColor = color;
                  (e.currentTarget as HTMLElement).style.color = color;
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.borderColor = "";
                  (e.currentTarget as HTMLElement).style.color = "";
                }
              }}
            >
              {prof.emoji} {prof.label}
            </button>
          );
        })}
      </div>

      <div className="text-center">
        <button
          onClick={onStart}
          className="font-game text-sm sm:text-base px-8 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg"
        >
          ZAČÍT HRU
        </button>
      </div>
    </div>
  );
}
