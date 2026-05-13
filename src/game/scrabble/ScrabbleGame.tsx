import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Copy, Check } from "lucide-react";
import { type TileItem } from "./types";
import { type Profession, PROFESSION_LIST } from "@/game/vocabularyData";
import { generateCrossword, getWordsForProfession, type CrosswordData, type PlacedWord } from "./crosswordGenerator";
import { useLanguage } from "@/contexts/LanguageContext";
import ScrabbleLobby from "./ScrabbleLobby";
import ScrabbleGrid from "./ScrabbleGrid";
import ScrabbleClues from "./ScrabbleClues";
import ScrabbleTilePool from "./ScrabbleTilePool";
import ScrabbleHints from "./ScrabbleHints";

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

export type { TileItem } from "./types";

interface ScrabbleGameProps {
  onGameComplete?: (score: number) => void;
  challengeMode?: boolean;
  initialProfession?: Profession[];
}

export default function ScrabbleGame({ onGameComplete, challengeMode = false, initialProfession }: ScrabbleGameProps) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<GamePhase>("lobby");
  const [selectedProfessions, setSelectedProfessions] = useState<Profession[]>([]);
  const [crossword, setCrossword] = useState<CrosswordData | null>(null);

  // Confirmed (correct) cells
  const [filledCells, setFilledCells] = useState<Record<string, string>>({});
  // Pending (typed but unvalidated) cells
  const [pendingCells, setPendingCells] = useState<Record<string, string>>({});
  // Which tiles from pool were used for pending cells (to return on backspace)
  const [pendingTileIds, setPendingTileIds] = useState<Record<string, number>>({});

  const [completedWords, setCompletedWords] = useState<Set<number>>(new Set());
  const [tilePool, setTilePool] = useState<TileItem[]>([]);

  // Active word tracking
  const [activeWordNum, setActiveWordNum] = useState<number | null>(null);
  const [cursorPos, setCursorPos] = useState<number>(0);
  // For intersection toggle: H or V preference
  const [lastClickedCell, setLastClickedCell] = useState<string | null>(null);
  const [intersectionToggle, setIntersectionToggle] = useState<"H" | "V">("H");

  const [shakingCells, setShakingCells] = useState<Set<string>>(new Set());
  const [selectedTile, setSelectedTile] = useState<number | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cellRefsMap = useRef<Record<string, HTMLDivElement | null>>({});

  const setCellRef = useCallback((key: string, el: HTMLDivElement | null) => {
    cellRefsMap.current[key] = el;
  }, []);

  const completionCalledRef = useRef(false);

  // Challenge: auto-start with given profession
  useEffect(() => {
    if (!initialProfession) return;
    const profs = initialProfession;
    const words = getWordsForProfession(profs);
    if (words.length < 3) return;
    const cw = generateCrossword(words, 7);
    if (cw.placed.length < 2) return;
    setCrossword(cw);
    setFilledCells({});
    setPendingCells({});
    setPendingTileIds({});
    setCompletedWords(new Set());
    setSelectedTile(null);
    setActiveWordNum(null);
    setCursorPos(0);
    setTilePool(buildTilePool(cw));
    setSelectedProfessions(profs);
    setPhase("playing");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Challenge: fire onGameComplete on victory
  useEffect(() => {
    if (!challengeMode || phase !== "victory") return;
    if (completionCalledRef.current) return;
    completionCalledRef.current = true;
    const challengeScore = completedWords.size * 10;
    const timer = setTimeout(() => onGameComplete?.(challengeScore), 1500);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const toggleProfession = useCallback((p: Profession) => {
    setSelectedProfessions(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  }, []);

  const buildTilePool = useCallback((cw: CrosswordData): TileItem[] => {
    const cellLetters: Record<string, string> = {};
    for (const p of cw.placed) {
      for (let i = 0; i < p.word.length; i++) {
        const r = p.direction === "H" ? p.row : p.row + i;
        const c = p.direction === "H" ? p.col + i : p.col;
        cellLetters[`${r}-${c}`] = p.word[i];
      }
    }
    const uniqueLetters = Object.values(cellLetters);
    const alphabet = "ABCDEFGHIJKLMNOPRSTUVWZ";
    const distractors: string[] = [];
    for (let i = 0; i < 5; i++) {
      distractors.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
    }
    return shuffle([...uniqueLetters, ...distractors]).map((letter, id) => ({ letter, id }));
  }, []);

  const startGame = useCallback(() => {
    const words = getWordsForProfession(selectedProfessions);
    if (words.length < 3) return;
    const cw = generateCrossword(words, 7);
    if (cw.placed.length < 2) return;
    setCrossword(cw);
    setFilledCells({});
    setPendingCells({});
    setPendingTileIds({});
    setCompletedWords(new Set());
    setSelectedTile(null);
    setActiveWordNum(null);
    setCursorPos(0);
    setTilePool(buildTilePool(cw));
    setPhase("playing");
  }, [selectedProfessions, buildTilePool]);

  // Get cells for a placed word
  const getWordCells = useCallback((p: PlacedWord): string[] => {
    const cells: string[] = [];
    for (let i = 0; i < p.word.length; i++) {
      const r = p.direction === "H" ? p.row : p.row + i;
      const c = p.direction === "H" ? p.col + i : p.col;
      cells.push(`${r}-${c}`);
    }
    return cells;
  }, []);

  const activeWord = useMemo(() => {
    if (activeWordNum === null || !crossword) return null;
    return crossword.placed.find(p => p.number === activeWordNum) ?? null;
  }, [activeWordNum, crossword]);

  const activeWordCells = useMemo(() => {
    if (!activeWord) return [];
    return getWordCells(activeWord);
  }, [activeWord, getWordCells]);

  // Find first empty cell index in active word
  const findFirstEmptyIndex = useCallback((cells: string[], filled: Record<string, string>, pending: Record<string, string>): number => {
    for (let i = 0; i < cells.length; i++) {
      if (!filled[cells[i]] && !pending[cells[i]]) return i;
    }
    return cells.length; // all filled
  }, []);

  // Check which words at a given cell
  const getWordsAtCell = useCallback((cellKey: string): PlacedWord[] => {
    if (!crossword) return [];
    return crossword.placed.filter(p => {
      const cells = getWordCells(p);
      return cells.includes(cellKey);
    });
  }, [crossword, getWordCells]);

  // Activate a word by clicking a cell
  const handleCellClick = useCallback((row: number, col: number) => {
    if (!crossword) return;
    const key = `${row}-${col}`;
    const letter = crossword.grid[row]?.[col];
    if (!letter) return;

    // If a tile is selected from pool, place it
    if (selectedTile !== null) {
      const tile = tilePool.find(t => t.id === selectedTile);
      if (tile && !filledCells[key] && !pendingCells[key]) {
        // Find which word this cell belongs to, place as pending
        placePendingLetter(key, tile.letter, tile.id);
      }
      setSelectedTile(null);
      return;
    }

    const wordsHere = getWordsAtCell(key);
    if (wordsHere.length === 0) return;

    if (wordsHere.length === 1) {
      const w = wordsHere[0];
      activateWord(w.number, true);
    } else {
      // Intersection: toggle between H and V
      if (lastClickedCell === key) {
        const newDir = intersectionToggle === "H" ? "V" : "H";
        setIntersectionToggle(newDir);
        const target = wordsHere.find(w => w.direction === newDir) ?? wordsHere[0];
        activateWord(target.number, true);
      } else {
        const hWord = wordsHere.find(w => w.direction === "H");
        const target = hWord ?? wordsHere[0];
        setIntersectionToggle(target.direction);
        activateWord(target.number, true);
      }
    }
    setLastClickedCell(key);
  }, [crossword, selectedTile, tilePool, filledCells, pendingCells, activeWordNum, lastClickedCell, intersectionToggle, getWordsAtCell]);

  const activateWord = useCallback((wordNum: number, focusInput = false) => {
    setActiveWordNum(wordNum);
    setCursorPos(0);
    // focusInput=true only when called from a direct user gesture (tap on cell/clue)
    // so iOS keyboard opens. Deferred calls (after validation) omit this flag.
    if (focusInput) {
      hiddenInputRef.current?.focus({ preventScroll: true });
    }
  }, []);

  // Place a pending letter in a cell
  const placePendingLetter = useCallback((cellKey: string, letter: string, tileId?: number) => {
    setPendingCells(prev => ({ ...prev, [cellKey]: letter }));
    if (tileId !== undefined) {
      setPendingTileIds(prev => ({ ...prev, [cellKey]: tileId }));
      setTilePool(prev => prev.filter(t => t.id !== tileId));
    }
  }, []);

  // Validate active word when all cells are filled
  const validateActiveWord = useCallback((word: PlacedWord, filled: Record<string, string>, pending: Record<string, string>) => {
    const cells = getWordCells(word);
    // Check if all cells have a letter (filled or pending)
    const allFilled = cells.every(c => filled[c] || pending[c]);
    if (!allFilled) return;

    // Check correctness
    let correct = true;
    for (let i = 0; i < word.word.length; i++) {
      const cellLetter = filled[cells[i]] || pending[cells[i]];
      if (cellLetter !== word.word[i]) {
        correct = false;
        break;
      }
    }

    if (correct) {
      // Move pending to filled for this word's cells
      const newFilled = { ...filled };
      const newPending = { ...pending };
      const newPendingIds = { ...pendingTileIds };
      for (const c of cells) {
        if (pending[c]) {
          newFilled[c] = pending[c];
          delete newPending[c];
          delete newPendingIds[c];
        }
      }
      setFilledCells(newFilled);
      setPendingCells(newPending);
      setPendingTileIds(newPendingIds);

      // Mark completed
      const newCompleted = new Set(completedWords);
      newCompleted.add(word.number);

      // Also check other words that may now be complete due to shared cells
      if (crossword) {
        for (const p of crossword.placed) {
          if (newCompleted.has(p.number)) continue;
          const wCells = getWordCells(p);
          let allCorrect = true;
          for (let i = 0; i < p.word.length; i++) {
            if (newFilled[wCells[i]] !== p.word[i]) {
              allCorrect = false;
              break;
            }
          }
          if (allCorrect) newCompleted.add(p.number);
        }
      }
      setCompletedWords(newCompleted);

      // Jump to next unfilled word
      if (crossword && newCompleted.size < crossword.placed.length) {
        const next = crossword.placed.find(p => !newCompleted.has(p.number));
        if (next) {
          setTimeout(() => activateWord(next.number), 300);
        }
      }

      // Victory check
      if (crossword && newCompleted.size === crossword.placed.length) {
        setTimeout(() => setPhase("victory"), 600);
      }
    } else {
      // Wrong: shake and clear pending cells for this word
      const cellSet = new Set(cells.filter(c => pending[c]));
      setShakingCells(cellSet);
      setTimeout(() => {
        setShakingCells(new Set());
        // Clear pending and return tiles
        const newPending = { ...pending };
        const newPendingIds = { ...pendingTileIds };
        const returnedTiles: TileItem[] = [];
        for (const c of cells) {
          if (pending[c] && !filled[c]) {
            if (newPendingIds[c] !== undefined) {
              returnedTiles.push({ letter: pending[c], id: newPendingIds[c] });
              delete newPendingIds[c];
            }
            delete newPending[c];
          }
        }
        setPendingCells(newPending);
        setPendingTileIds(newPendingIds);
        if (returnedTiles.length > 0) {
          setTilePool(prev => [...prev, ...returnedTiles]);
        }
        setCursorPos(0);
      }, 500);
    }
  }, [getWordCells, pendingTileIds, completedWords, crossword, activateWord]);

  // Type a letter into the active word
  const typeLetter = useCallback((letter: string) => {
    if (!activeWord || !crossword) return;
    const cells = activeWordCells;
    const upperLetter = letter.toUpperCase();

    // Find first empty cell
    const emptyIdx = findFirstEmptyIndex(cells, filledCells, pendingCells);
    if (emptyIdx >= cells.length) return; // word fully typed

    // Skip cells that are already filled (confirmed from intersections)
    let targetIdx = emptyIdx;
    while (targetIdx < cells.length && filledCells[cells[targetIdx]]) {
      targetIdx++;
    }
    if (targetIdx >= cells.length) return;

    const cellKey = cells[targetIdx];

    // Try to consume a matching tile from pool
    const tileIdx = tilePool.findIndex(t => t.letter === upperLetter);
    if (tileIdx !== -1) {
      placePendingLetter(cellKey, upperLetter, tilePool[tileIdx].id);
    } else {
      // No matching tile — still allow typing
      placePendingLetter(cellKey, upperLetter);
    }
    setCursorPos(targetIdx + 1);

    // Check if word is now fully filled → validate
    const newPending = { ...pendingCells, [cellKey]: upperLetter };
    const allCellsFilled = cells.every(c => filledCells[c] || newPending[c]);
    if (allCellsFilled) {
      setTimeout(() => validateActiveWord(activeWord, filledCells, newPending), 100);
    }
  }, [activeWord, crossword, activeWordCells, filledCells, pendingCells, tilePool, findFirstEmptyIndex, placePendingLetter, validateActiveWord]);

  // Backspace: remove last pending letter
  const handleBackspace = useCallback(() => {
    if (!activeWord) return;
    const cells = activeWordCells;

    // Find last pending cell (searching from end)
    let lastPendingIdx = -1;
    for (let i = cells.length - 1; i >= 0; i--) {
      if (pendingCells[cells[i]] && !filledCells[cells[i]]) {
        lastPendingIdx = i;
        break;
      }
    }
    if (lastPendingIdx === -1) return;

    const cellKey = cells[lastPendingIdx];
    const tileId = pendingTileIds[cellKey];

    // Return tile to pool
    if (tileId !== undefined) {
      setTilePool(prev => [...prev, { letter: pendingCells[cellKey], id: tileId }]);
    }

    setPendingCells(prev => {
      const n = { ...prev };
      delete n[cellKey];
      return n;
    });
    setPendingTileIds(prev => {
      const n = { ...prev };
      delete n[cellKey];
      return n;
    });
    setCursorPos(lastPendingIdx);
  }, [activeWord, activeWordCells, pendingCells, filledCells, pendingTileIds]);

  // Jump to next unfilled word
  const jumpToNextWord = useCallback(() => {
    if (!crossword) return;
    const next = crossword.placed.find(p => !completedWords.has(p.number) && p.number !== activeWordNum);
    if (next) activateWord(next.number);
  }, [crossword, completedWords, activeWordNum, activateWord]);

  // Keyboard handler — control keys only (letters handled via hidden input onChange)
  useEffect(() => {
    if (phase !== "playing") return;

    const handler = (e: KeyboardEvent) => {
      if (!activeWord) return;

      if (e.key === "Escape") {
        setActiveWordNum(null);
        hiddenInputRef.current?.blur();
        return;
      }

      if (e.key === "Backspace") {
        e.preventDefault();
        handleBackspace();
        return;
      }

      if (e.key === "Enter" || e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        jumpToNextWord();
        return;
      }

      // Redirect letter keys to hidden input so onChange handles composition
      if (e.key.length === 1 && /[a-zA-ZäöüÄÖÜß]/i.test(e.key)) {
        hiddenInputRef.current?.focus({ preventScroll: true });
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, activeWord, handleBackspace, jumpToNextWord]);

  // Hidden input onChange — handles composed characters (umlauts via dead keys)
  const handleHiddenChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length > 0) {
      const addedChar = newValue.slice(-1);
      if (/[a-zA-ZäöüÄÖÜß]/i.test(addedChar)) {
        typeLetter(addedChar);
      }
    }
    e.target.value = "";
  }, [typeLetter]);

  const handleHiddenKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      handleBackspace();
    }
    if (e.key === "Enter" || e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      jumpToNextWord();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setActiveWordNum(null);
      hiddenInputRef.current?.blur();
    }
  }, [handleBackspace, jumpToNextWord]);

  // Drag and drop onto grid cell
  const handleDrop = useCallback((row: number, col: number, tileId: number) => {
    if (!crossword) return;
    const key = `${row}-${col}`;
    if (filledCells[key] || pendingCells[key]) return;
    const expected = crossword.grid[row]?.[col];
    if (!expected) return;

    const tile = tilePool.find(t => t.id === tileId);
    if (!tile) return;

    // Activate the word this cell belongs to (if not already)
    const wordsHere = getWordsAtCell(key);
    if (wordsHere.length > 0 && activeWordNum === null) {
      activateWord(wordsHere[0].number);
    }

    placePendingLetter(key, tile.letter, tile.id);

    // Check if any word containing this cell is now complete
    for (const w of wordsHere) {
      const cells = getWordCells(w);
      const newPending = { ...pendingCells, [key]: tile.letter };
      const allFilled = cells.every(c => filledCells[c] || newPending[c]);
      if (allFilled) {
        setTimeout(() => validateActiveWord(w, filledCells, newPending), 100);
        break;
      }
    }
  }, [crossword, filledCells, pendingCells, tilePool, getWordsAtCell, activeWordNum, activateWord, placePendingLetter, getWordCells, validateActiveWord]);

  // Cell numbers for crossword
  const cellNumbers = useMemo(() => {
    if (!crossword) return {};
    const nums: Record<string, number> = {};
    for (const p of crossword.placed) {
      const key = `${p.row}-${p.col}`;
      if (!nums[key]) nums[key] = p.number;
    }
    return nums;
  }, [crossword]);

  // Cursor cell key
  const cursorCellKey = useMemo(() => {
    if (!activeWord || cursorPos >= activeWordCells.length) return null;
    return activeWordCells[cursorPos];
  }, [activeWord, cursorPos, activeWordCells]);

  // Stable Set for activeWordCells to avoid re-creating on every render
  const activeWordCellsSet = useMemo(() => new Set(activeWordCells), [activeWordCells]);

  // Scroll active cursor cell into view whenever cursor moves.
  // Horizontal words: center vertically (word spans cols, cursor moves across the row).
  // Vertical words: nearest (cell scrolls just into view at top edge — avoids ending up
  // flush against the soft keyboard which sits below the visible area).
  useEffect(() => {
    if (!cursorCellKey) return;
    const el = cellRefsMap.current[cursorCellKey];
    if (el) {
      const isVertical = activeWord?.direction === "V";
      el.scrollIntoView({
        behavior: "smooth",
        block: isVertical ? "nearest" : "center",
        inline: "center",
      });
    }
  }, [cursorCellKey, activeWord]);



  if (phase === "lobby") {
    return <ScrabbleLobby
      selected={selectedProfessions}
      onToggle={toggleProfession}
      onSelectAll={() => setSelectedProfessions([])}
      isAllSelected={selectedProfessions.length === 0}
      onStart={startGame}
      groupColors={GROUP_COLORS}
    />;
  }

  if (phase === "victory" && crossword) {
    if (challengeMode) {
      return (
        <div className="max-w-md mx-auto text-center py-12 px-4">
          <h2 className="font-game text-2xl sm:text-3xl text-primary mb-4">{t("scrabbleVictoryTitle")}</h2>
          <p className="font-body text-foreground text-lg mb-4">
            {t("scrabbleVictoryText", { n: crossword.placed.length, total: crossword.placed.length })}
          </p>
          <p className="font-game text-sm text-muted-foreground">⏳ {t("challengeNextGame")} ...</p>
        </div>
      );
    }
    const handleShare = () => {
      const text = t("shareScrabble", { n: String(crossword.placed.length) });
      if (navigator.share) {
        navigator.share({ text }).catch(() => {});
      } else {
        navigator.clipboard.writeText(text);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      }
    };
    return (
      <div className="max-w-md mx-auto text-center py-12 px-4">
        <h2 className="font-game text-2xl sm:text-3xl text-primary mb-4">{t("scrabbleVictoryTitle")}</h2>
        <p className="font-body text-foreground text-lg mb-6">
          {t("scrabbleVictoryText", { n: crossword.placed.length, total: crossword.placed.length })}
        </p>
        <div className="flex flex-col items-center gap-3 mb-6">
          <p className="font-game text-sm text-foreground">{t("shareBoast")}</p>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 font-game text-xs px-5 py-3 rounded-xl bg-primary text-primary-foreground hover:scale-105 transition-transform shadow-md"
          >
            {shareCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {shareCopied ? t("copied") : t("copy")}
          </button>
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={startGame}
            className="font-body font-bold text-sm px-6 py-3 rounded-xl bg-muted border border-border text-foreground hover:bg-muted/80 transition-colors"
          >
            {t("playAgainScrabble")}
          </button>
          <button
            onClick={() => setPhase("lobby")}
            className="font-body font-bold text-sm px-6 py-3 rounded-xl border-2 border-border bg-card text-foreground hover:border-primary/40 transition-colors"
          >
            {t("changeProfession")}
          </button>
        </div>
      </div>
    );
  }

  if (!crossword) return null;

  return (
    <div ref={wrapperRef} className="max-w-4xl mx-auto px-2 sm:px-4 py-4" tabIndex={-1}>
      {/* Hidden input for mobile virtual keyboard */}
      {/* Hidden input: position:fixed at top-left so browser never scrolls to it,
          transform moves it visually off-screen. font-size:16px prevents iOS auto-zoom. */}
      <input
        ref={hiddenInputRef}
        type="text"
        inputMode="text"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="characters"
        spellCheck={false}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "1px",
          height: "1px",
          opacity: 0,
          fontSize: "16px",
          transform: "translateX(-9999px)",
          pointerEvents: "none",
        }}
        onChange={handleHiddenChange}
        onKeyDown={handleHiddenKeyDown}
      />

      <ScrabbleGrid
        crossword={crossword}
        filledCells={filledCells}
        pendingCells={pendingCells}
        cellNumbers={cellNumbers}
        activeWordCells={activeWordCellsSet}
        cursorCellKey={cursorCellKey}
        shakingCells={shakingCells}
        onCellClick={handleCellClick}
        onDrop={handleDrop}
        onCellRef={setCellRef}
      />

      <ScrabbleClues
        crossword={crossword}
        activeWordNum={activeWordNum}
        completedWords={completedWords}
        onClueClick={(num) => activateWord(num, true)}
      />

      <ScrabbleTilePool
        tilePool={tilePool}
        selectedTile={selectedTile}
        onTileClick={(id) => setSelectedTile(selectedTile === id ? null : id)}
      />

      <div className="flex items-center justify-center gap-4 mt-6">
        <ScrabbleHints crossword={crossword} completedWords={completedWords} />
        <button
          onClick={() => setPhase("lobby")}
          className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {t("backToProfession")}
        </button>
      </div>
    </div>
  );
}
