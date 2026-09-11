import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  VERB_CONJUGATIONS,
  PRONOUN_LABEL,
  PRONOUNS,
  getVerbTranslation,
  type Pronoun,
  type VerbConjugation,
} from "@/data/verbConjugations";

// A single persistent maze per game — the llama explores deeper into it round
// by round rather than restarting fresh each time, so "escaping the labyrinth"
// after ROUNDS_TOTAL correct picks actually means something.
const COLS = 8;
const ROWS = 8;
const CELL = 46;
const CANVAS_SIZE = COLS * CELL;

const ROUNDS_TOTAL = 8;
const START_LIVES = 3;
const POINTS_PER_ROUND = 10;
const MOVE_FRAMES = 8; // frames for one cell-to-cell slide
const CORRECT_FLASH_MS = 550;
const WRONG_FLASH_MS = 650;
// A round's 4 tiles are placed at cells this many *path* steps from the
// llama's current spot (not straight-line) — far enough to require real
// navigation, not so far the round drags on.
const TILE_MIN_DIST = 3;
const TILE_MAX_DIST = 16;

type Dir = "N" | "S" | "E" | "W";
const DIR_DELTA: Record<Dir, [number, number]> = { N: [0, -1], S: [0, 1], E: [1, 0], W: [-1, 0] };
const OPPOSITE: Record<Dir, Dir> = { N: "S", S: "N", E: "W", W: "E" };

interface Cell {
  walls: Record<Dir, boolean>;
}

interface WordTile {
  col: number;
  row: number;
  text: string;
  correct: boolean;
  gone: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Randomized depth-first backtracker — produces a "perfect" maze (exactly one path between any two cells). */
function generateMaze(cols: number, rows: number): Cell[][] {
  const grid: Cell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ walls: { N: true, S: true, E: true, W: true } }))
  );
  const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));
  const stack: [number, number][] = [[0, 0]];
  visited[0][0] = true;
  while (stack.length > 0) {
    const [c, r] = stack[stack.length - 1];
    const options: { dir: Dir; nc: number; nr: number }[] = [];
    if (r > 0 && !visited[r - 1][c]) options.push({ dir: "N", nc: c, nr: r - 1 });
    if (r < rows - 1 && !visited[r + 1][c]) options.push({ dir: "S", nc: c, nr: r + 1 });
    if (c < cols - 1 && !visited[r][c + 1]) options.push({ dir: "E", nc: c + 1, nr: r });
    if (c > 0 && !visited[r][c - 1]) options.push({ dir: "W", nc: c - 1, nr: r });
    if (options.length === 0) {
      stack.pop();
      continue;
    }
    const pick = options[Math.floor(Math.random() * options.length)];
    grid[r][c].walls[pick.dir] = false;
    grid[pick.nr][pick.nc].walls[OPPOSITE[pick.dir]] = false;
    visited[pick.nr][pick.nc] = true;
    stack.push([pick.nc, pick.nr]);
  }
  return grid;
}

/** BFS path-distance from `start` to every cell, respecting maze walls. */
function bfsDistances(maze: Cell[][], start: { col: number; row: number }): number[][] {
  const dist = Array.from({ length: ROWS }, () => Array(COLS).fill(-1));
  const queue: [number, number][] = [[start.col, start.row]];
  dist[start.row][start.col] = 0;
  let qi = 0;
  while (qi < queue.length) {
    const [c, r] = queue[qi++];
    const cell = maze[r][c];
    const neighbors: [Dir, number, number][] = [
      ["N", c, r - 1],
      ["S", c, r + 1],
      ["E", c + 1, r],
      ["W", c - 1, r],
    ];
    for (const [dir, nc, nr] of neighbors) {
      if (nc < 0 || nc >= COLS || nr < 0 || nr >= ROWS) continue;
      if (cell.walls[dir]) continue;
      if (dist[nr][nc] !== -1) continue;
      dist[nr][nc] = dist[r][c] + 1;
      queue.push([nc, nr]);
    }
  }
  return dist;
}

/** Correct form + 3 distractors for one pronoun slot of a verb, shuffled. Distractors are the verb's other forms
 *  first (closest grammatically), topped up from other verbs if a verb has too many duplicate forms (e.g. schließen). */
function pickChoices(verb: VerbConjugation, pronoun: Pronoun): { text: string; correct: boolean }[] {
  const correctText = verb.forms[pronoun];
  const ownPool = Array.from(new Set(PRONOUNS.filter((p) => p !== pronoun).map((p) => verb.forms[p]))).filter(
    (f) => f !== correctText
  );
  const distractors = shuffle(ownPool).slice(0, 3);
  if (distractors.length < 3) {
    const others = shuffle(VERB_CONJUGATIONS.filter((v) => v !== verb));
    outer: for (const v of others) {
      for (const p of PRONOUNS) {
        const f = v.forms[p];
        if (f !== correctText && !distractors.includes(f)) {
          distractors.push(f);
          if (distractors.length >= 3) break outer;
        }
      }
    }
  }
  return shuffle([{ text: correctText, correct: true }, ...distractors.map((d) => ({ text: d, correct: false }))]);
}

function pickTileCells(maze: Cell[][], from: { col: number; row: number }, count: number): { col: number; row: number }[] {
  const dist = bfsDistances(maze, from);
  const inRange: { col: number; row: number }[] = [];
  const fallback: { col: number; row: number }[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (c === from.col && r === from.row) continue;
      const d = dist[r][c];
      if (d < 0) continue;
      if (d >= TILE_MIN_DIST && d <= TILE_MAX_DIST) inRange.push({ col: c, row: r });
      else fallback.push({ col: c, row: r });
    }
  }
  const pool = inRange.length >= count ? inRange : [...inRange, ...fallback];
  return shuffle(pool).slice(0, count);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

const FACING_ANGLE: Record<Dir, number> = { E: 0, S: Math.PI / 2, W: Math.PI, N: -Math.PI / 2 };

// The llama's bounding box in LlamaJump's own drawLlama (x+4..x+38, y-28..y+40) — used
// to center that exact sprite on its own midpoint before scaling/rotating it here.
const SPRITE_OX = -21;
const SPRITE_OY = -6;
const SPRITE_SCALE = (CELL - 8) / 68;

/** The exact same pixel-art llama as Llama Run/Llama Jump (identical shapes and colors), scaled down
 *  and rotated to face the direction of travel for this top-down maze. */
function drawLlamaSprite(ctx: CanvasRenderingContext2D, cx: number, cy: number, facing: Dir, frame: number) {
  const legOffset = Math.sin(frame * 0.3) * 4;
  const x = SPRITE_OX;
  const y = SPRITE_OY;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(FACING_ANGLE[facing]);
  ctx.scale(SPRITE_SCALE, SPRITE_SCALE);
  ctx.fillStyle = "#e8d5b7";
  ctx.fillRect(x + 8, y + 10, 24, 20);
  ctx.fillRect(x + 26, y - 10, 8, 22);
  ctx.fillStyle = "#f0e0c8";
  ctx.fillRect(x + 24, y - 22, 14, 14);
  ctx.fillStyle = "#d4b896";
  ctx.fillRect(x + 32, y - 28, 4, 8);
  ctx.fillStyle = "#2a1a0a";
  ctx.fillRect(x + 33, y - 18, 3, 3);
  ctx.fillStyle = "#d4b896";
  ctx.fillRect(x + 10, y + 28, 5, 12 + legOffset);
  ctx.fillRect(x + 20, y + 28, 5, 12 - legOffset);
  ctx.fillStyle = "#c8a878";
  ctx.fillRect(x + 4, y + 8, 6, 4);
  ctx.restore();
}

interface FlashState {
  col: number;
  row: number;
  kind: "correct" | "wrong";
}

function drawMaze(ctx: CanvasRenderingContext2D, maze: Cell[][]) {
  ctx.fillStyle = "#f5ecd8";
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  ctx.strokeStyle = "rgba(139,115,85,0.1)";
  ctx.lineWidth = 1;
  for (let c = 1; c < COLS; c++) {
    ctx.beginPath();
    ctx.moveTo(c * CELL, 0);
    ctx.lineTo(c * CELL, CANVAS_SIZE);
    ctx.stroke();
  }
  for (let r = 1; r < ROWS; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * CELL);
    ctx.lineTo(CANVAS_SIZE, r * CELL);
    ctx.stroke();
  }

  ctx.strokeStyle = "#5c4530";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = maze[r][c];
      const x0 = c * CELL;
      const y0 = r * CELL;
      const x1 = x0 + CELL;
      const y1 = y0 + CELL;
      if (cell.walls.N) {
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y0);
        ctx.stroke();
      }
      if (cell.walls.W) {
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x0, y1);
        ctx.stroke();
      }
      if (r === ROWS - 1 && cell.walls.S) {
        ctx.beginPath();
        ctx.moveTo(x0, y1);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }
      if (c === COLS - 1 && cell.walls.E) {
        ctx.beginPath();
        ctx.moveTo(x1, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }
    }
  }
}

function drawTile(ctx: CanvasRenderingContext2D, tile: WordTile, flash: FlashState | null) {
  if (tile.gone) return;
  const cx = tile.col * CELL + CELL / 2;
  const cy = tile.row * CELL + CELL / 2;
  ctx.font = "bold 10px system-ui, sans-serif";
  const textW = ctx.measureText(tile.text).width;
  const w = Math.max(CELL - 8, textW + 14);
  const h = 22;
  const flashing = flash && flash.col === tile.col && flash.row === tile.row;
  ctx.fillStyle = flashing ? (flash!.kind === "correct" ? "rgba(120,220,140,0.95)" : "rgba(230,90,90,0.95)") : "rgba(255,255,255,0.94)";
  ctx.strokeStyle = flashing ? (flash!.kind === "correct" ? "#2f9e58" : "#c0392b") : "#8b7355";
  ctx.lineWidth = 2;
  roundRect(ctx, cx - w / 2, cy - h / 2, w, h, 6);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#2a1a0a";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(tile.text, cx, cy + 1);
}

interface GameState {
  maze: Cell[][];
  pos: { col: number; row: number };
  animFrom: { col: number; row: number };
  tweening: boolean;
  tweenProgress: number;
  facing: Dir;
  frameCount: number;
  tiles: WordTile[];
  resolving: boolean;
  flash: FlashState | null;
  score: number;
  lives: number;
  round: number; // rounds completed so far
  lastVerbIdx: number;
}

function makeInitialGameState(): GameState {
  return {
    maze: generateMaze(COLS, ROWS),
    pos: { col: 0, row: 0 },
    animFrom: { col: 0, row: 0 },
    tweening: false,
    tweenProgress: 1,
    facing: "E",
    frameCount: 0,
    tiles: [],
    resolving: false,
    flash: null,
    score: 0,
    lives: START_LIVES,
    round: 0,
    lastVerbIdx: -1,
  };
}

const LlamaLabyrinth = () => {
  const { t, lang } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const [gameState, setGameState] = useState<"idle" | "playing" | "over">("idle");
  const [outcome, setOutcome] = useState<"win" | "lose" | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(START_LIVES);
  const [round, setRound] = useState(1);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem("llama-labyrinth-highscore") || "0"));
  const [verb, setVerb] = useState<VerbConjugation>(VERB_CONJUGATIONS[0]);
  const [pronoun, setPronoun] = useState<Pronoun>("ich");

  const g = useRef<GameState>(makeInitialGameState());

  const startRound = useCallback((state: GameState) => {
    let idx = Math.floor(Math.random() * VERB_CONJUGATIONS.length);
    if (VERB_CONJUGATIONS.length > 1) {
      while (idx === state.lastVerbIdx) idx = Math.floor(Math.random() * VERB_CONJUGATIONS.length);
    }
    state.lastVerbIdx = idx;
    const nextVerb = VERB_CONJUGATIONS[idx];
    const nextPronoun = PRONOUNS[Math.floor(Math.random() * PRONOUNS.length)];
    const choices = pickChoices(nextVerb, nextPronoun);
    const cells = pickTileCells(state.maze, state.pos, choices.length);
    state.tiles = choices.map((choice, i) => ({ ...cells[i], text: choice.text, correct: choice.correct, gone: false }));
    state.resolving = false;
    state.flash = null;
    setVerb(nextVerb);
    setPronoun(nextPronoun);
  }, []);

  const startGame = useCallback(() => {
    const state = makeInitialGameState();
    g.current = state;
    startRound(state);
    setScore(0);
    setLives(START_LIVES);
    setRound(1);
    setOutcome(null);
    setGameState("playing");
  }, [startRound]);

  const finishGame = useCallback((result: "win" | "lose") => {
    const finalScore = g.current.score;
    if (finalScore > parseInt(localStorage.getItem("llama-labyrinth-highscore") || "0")) {
      localStorage.setItem("llama-labyrinth-highscore", String(finalScore));
      setHighScore(finalScore);
    }
    setOutcome(result);
    setGameState("over");
  }, []);

  const exitGame = useCallback(() => {
    setGameState("idle");
  }, []);

  // Called once a cell-to-cell slide finishes landing exactly on the target cell.
  const onArrive = useCallback(() => {
    const state = g.current;
    const tile = state.tiles.find((tl) => !tl.gone && tl.col === state.pos.col && tl.row === state.pos.row);
    if (!tile) return;

    if (tile.correct) {
      state.score += POINTS_PER_ROUND;
      setScore(state.score);
      state.resolving = true;
      state.flash = { col: tile.col, row: tile.row, kind: "correct" };
      const nextRound = state.round + 1;
      state.round = nextRound;
      setTimeout(() => {
        if (nextRound >= ROUNDS_TOTAL) {
          finishGame("win");
        } else {
          setRound(nextRound + 1);
          startRound(state);
        }
      }, CORRECT_FLASH_MS);
    } else {
      tile.gone = true;
      state.lives -= 1;
      setLives(state.lives);
      state.resolving = true;
      state.flash = { col: tile.col, row: tile.row, kind: "wrong" };
      setTimeout(() => {
        if (state.lives <= 0) {
          finishGame("lose");
        } else {
          state.resolving = false;
          state.flash = null;
        }
      }, WRONG_FLASH_MS);
    }
  }, [finishGame, startRound]);

  const tryMove = useCallback(
    (dir: Dir) => {
      const state = g.current;
      if (gameState !== "playing" || state.tweening || state.resolving) return;
      const { col, row } = state.pos;
      const cell = state.maze[row]?.[col];
      if (!cell || cell.walls[dir]) return;
      const [dc, dr] = DIR_DELTA[dir];
      const nCol = col + dc;
      const nRow = row + dr;
      if (nCol < 0 || nCol >= COLS || nRow < 0 || nRow >= ROWS) return;
      state.animFrom = { col, row };
      state.pos = { col: nCol, row: nRow };
      state.facing = dir;
      state.tweenProgress = 0;
      state.tweening = true;
    },
    [gameState]
  );

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameState === "idle" || gameState === "over") {
        if (e.code === "Enter" || e.code === "Space") {
          e.preventDefault();
          startGame();
        }
        return;
      }
      const map: Partial<Record<string, Dir>> = { ArrowUp: "N", ArrowDown: "S", ArrowLeft: "W", ArrowRight: "E" };
      const dir = map[e.key];
      if (dir) {
        e.preventDefault();
        tryMove(dir);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameState, startGame, tryMove]);

  // Responsive scaling — fit the container width, same principle as the other llama games.
  useEffect(() => {
    const updateScale = () => {
      const container = containerRef.current;
      if (!container) return;
      const parentWidth = container.parentElement?.clientWidth || window.innerWidth;
      const maxWidth = Math.min(parentWidth - 16, CANVAS_SIZE);
      setScale(Math.max(0.5, maxWidth / CANVAS_SIZE));
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // Main render loop — advances the cell-to-cell slide animation and redraws every frame.
  useEffect(() => {
    if (gameState !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const loop = () => {
      const state = g.current;
      state.frameCount++;
      if (state.tweening) {
        state.tweenProgress += 1 / MOVE_FRAMES;
        if (state.tweenProgress >= 1) {
          state.tweenProgress = 1;
          state.tweening = false;
          onArrive();
        }
      }

      drawMaze(ctx, state.maze);
      for (const tile of state.tiles) drawTile(ctx, tile, state.flash);

      const fx = state.animFrom.col + (state.pos.col - state.animFrom.col) * state.tweenProgress;
      const fy = state.animFrom.row + (state.pos.row - state.animFrom.row) * state.tweenProgress;
      drawLlamaSprite(ctx, fx * CELL + CELL / 2, fy * CELL + CELL / 2, state.facing, state.frameCount);

      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, onArrive]);

  const pronounLabel = PRONOUN_LABEL[pronoun];

  return (
    <div className="flex flex-col items-center w-full gap-3 sm:gap-4">
      {gameState === "playing" && (
        <>
          <div className="flex items-center justify-between w-full" style={{ maxWidth: CANVAS_SIZE }}>
            <span className="font-game text-[10px] sm:text-xs text-muted-foreground">
              {t("labyrinthRoundLabel", { n: round, total: ROUNDS_TOTAL })}
            </span>
            <span className="text-sm sm:text-base">{"❤️".repeat(Math.max(0, lives))}</span>
            <span className="font-game text-[10px] sm:text-xs text-foreground">
              {t("scoreLabel")}: <span className="text-primary">{score}</span>
            </span>
          </div>
          <div className="bg-muted rounded-2xl border-2 border-border px-4 py-2 text-center w-full" style={{ maxWidth: CANVAS_SIZE }}>
            <p className="font-body text-[9px] sm:text-[10px] text-muted-foreground mb-0.5">{t("labyrinthFindPrompt")}</p>
            <p className="font-game text-xs sm:text-sm text-foreground">
              {pronounLabel} ___{" "}
              <span className="font-body font-normal text-muted-foreground text-[10px] sm:text-xs">
                ({verb.infinitive} — {getVerbTranslation(verb, lang)})
              </span>
            </p>
          </div>
        </>
      )}

      <div
        ref={containerRef}
        className="relative rounded-lg sm:rounded-xl overflow-hidden shadow-lg border-2 border-border"
        style={{ width: CANVAS_SIZE * scale, height: CANVAS_SIZE * scale }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="block origin-top-left"
          style={{ transform: `scale(${scale})`, width: CANVAS_SIZE, height: CANVAS_SIZE }}
        />

        {gameState === "idle" && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/40 backdrop-blur-[2px]">
            <div className="bg-card/95 rounded-2xl p-6 shadow-2xl border-2 border-primary flex flex-col items-center gap-4 max-w-[85%]">
              <p className="font-game text-sm text-foreground text-center">🦙 Llama Labyrint</p>
              {highScore > 0 && (
                <p className="font-body text-[10px] text-muted-foreground">
                  {t("bestLabel")}: {highScore}
                </p>
              )}
              <button
                onClick={startGame}
                className="font-game text-sm px-8 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all shadow-lg"
              >
                {t("startGameBtn")}
              </button>
            </div>
          </div>
        )}

        {gameState === "playing" && (
          <button
            onClick={exitGame}
            className="absolute top-2 right-2 font-game text-xs px-3 py-1 rounded bg-destructive/80 text-destructive-foreground hover:bg-destructive transition-colors z-20"
          >
            {t("exitBtn")}
          </button>
        )}

        {gameState === "over" && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="absolute inset-0 bg-foreground/60 animate-game-over-flash" />
            <div className="relative z-10 flex flex-col items-center gap-3 sm:gap-4 bg-card/95 rounded-2xl p-4 sm:p-8 shadow-2xl border-2 border-primary mx-4 max-w-[90%] text-center">
              {outcome === "win" ? (
                <>
                  <p className="font-game text-sm sm:text-lg text-primary">{t("labyrinthWinTitle")}</p>
                  <p className="font-body text-xs sm:text-sm text-foreground">{t("labyrinthWinText", { score })}</p>
                </>
              ) : (
                <p className="font-game text-lg sm:text-2xl text-destructive">{t("gameOverText")}</p>
              )}
              <div className="flex flex-col items-center gap-1">
                <p className="font-game text-sm sm:text-base text-foreground">
                  {t("scoreLabel")}: <span className="text-primary">{score}</span>
                </p>
                <p className="font-game text-xs text-muted-foreground">
                  {t("bestLabel")}: <span className="text-primary">{highScore}</span>
                </p>
              </div>
              <button
                onClick={startGame}
                className="font-game text-sm sm:text-base px-8 sm:px-12 py-3 sm:py-4 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all animate-retry-pulse whitespace-nowrap"
                style={{
                  background: "linear-gradient(135deg, hsl(168, 72%, 40%), hsl(168, 72%, 30%))",
                  color: "hsl(0, 0%, 100%)",
                  boxShadow: "0 4px 20px hsla(168, 72%, 40%, 0.4), 0 0 30px hsla(168, 72%, 40%, 0.2)",
                }}
              >
                {t("tryAgainBtn")}
              </button>
            </div>
          </div>
        )}
      </div>

      {gameState === "playing" && (
        <div className="grid grid-cols-3 grid-rows-3 gap-1.5 w-36 sm:w-40">
          <div />
          <button
            onClick={() => tryMove("N")}
            className="flex items-center justify-center py-2 rounded-lg border-2 border-border bg-card hover:border-primary/50 active:scale-95 transition-all touch-manipulation"
          >
            <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div />
          <button
            onClick={() => tryMove("W")}
            className="flex items-center justify-center py-2 rounded-lg border-2 border-border bg-card hover:border-primary/50 active:scale-95 transition-all touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div className="flex items-center justify-center text-lg">🦙</div>
          <button
            onClick={() => tryMove("E")}
            className="flex items-center justify-center py-2 rounded-lg border-2 border-border bg-card hover:border-primary/50 active:scale-95 transition-all touch-manipulation"
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div />
          <button
            onClick={() => tryMove("S")}
            className="flex items-center justify-center py-2 rounded-lg border-2 border-border bg-card hover:border-primary/50 active:scale-95 transition-all touch-manipulation"
          >
            <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div />
        </div>
      )}

      <p className="text-muted-foreground text-xs hidden sm:block">{t("labyrinthControlsHint")}</p>
    </div>
  );
};

export default LlamaLabyrinth;
