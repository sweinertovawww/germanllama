import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { drawStar } from "@/game/collectibles";
import { isTranslationCorrect } from "@/game/vocabularyData";
import { VERB_CONJUGATIONS, PRONOUNS, getNativePhrase, getGermanAnswer, type Pronoun } from "@/data/verbConjugations";

// A single persistent maze per game. The llama roams it freely, collecting stars —
// each one poses a short native-language phrase ("on vaří") to translate into German.
const COLS = 8;
const ROWS = 8;
const CELL = 46;
const CANVAS_SIZE = COLS * CELL;

const GAME_SECONDS = 90;
const GAME_FRAMES = GAME_SECONDS * 60;
const STAR_POINTS = 5;
const STARS_ACTIVE = 3;
const MOVE_FRAMES = 8; // frames for one cell-to-cell slide
const CORRECT_FLASH_MS = 900;
const WRONG_FLASH_MS = 1400;
// A freshly-spawned star sits at least this many *path* steps from the llama's
// current spot, so it's never handed to you for free.
const STAR_MIN_DIST = 2;
// The wolf takes one cell every this many frames — slow enough that actively moving
// llama easily stays ahead, but standing still for a few seconds lets it close in.
const WOLF_STEP_FRAMES = 40;
// The wolf's starting distance from the llama (in path steps) is kept in this range —
// far enough for a real grace period, close enough that idling actually gets punished
// in well under a minute even on a maze with a long, winding diameter.
const WOLF_START_MIN_DIST = 10;
const WOLF_START_MAX_DIST = 20;
// Guarantees a real first move: the wolf's start distance is always pushed out at least
// this much farther than the nearest star, so reaching that star — and opening the first
// escape route — never depends on luck.
const WOLF_SAFETY_MARGIN = 3;

type Dir = "N" | "S" | "E" | "W";
const DIR_DELTA: Record<Dir, [number, number]> = { N: [0, -1], S: [0, 1], E: [1, 0], W: [-1, 0] };
const OPPOSITE: Record<Dir, Dir> = { N: "S", S: "N", E: "W", W: "E" };

interface Cell {
  walls: Record<Dir, boolean>;
}

interface StarTile {
  col: number;
  row: number;
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

/** A cell at least `minDist` (and at most WOLF_START_MAX_DIST, when that leaves any candidates)
 *  path-steps from `from` — falls back to the single farthest cell available otherwise. */
function pickWolfStartCell(maze: Cell[][], from: { col: number; row: number }, minDist: number): { col: number; row: number } {
  const dist = bfsDistances(maze, from);
  const inRange: { col: number; row: number }[] = [];
  const atLeastMin: { col: number; row: number }[] = [];
  let farthest = from;
  let farthestDist = -1;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const d = dist[r][c];
      if (d < 0) continue;
      if (d >= minDist && d <= WOLF_START_MAX_DIST) inRange.push({ col: c, row: r });
      if (d >= minDist) atLeastMin.push({ col: c, row: r });
      if (d > farthestDist) {
        farthestDist = d;
        farthest = { col: c, row: r };
      }
    }
  }
  if (inRange.length > 0) return shuffle(inRange)[0];
  if (atLeastMin.length > 0) return shuffle(atLeastMin)[0];
  return farthest;
}

/** The first step of the shortest path from `from` toward `to` — one BFS per wolf move, cheap on an 8×8 maze. */
function bfsNextStep(maze: Cell[][], from: { col: number; row: number }, to: { col: number; row: number }): { col: number; row: number } {
  if (from.col === to.col && from.row === to.row) return from;
  const key = (c: number, r: number) => `${c},${r}`;
  const prev = new Map<string, { col: number; row: number }>();
  const visited = new Set([key(from.col, from.row)]);
  const queue: { col: number; row: number }[] = [from];
  let qi = 0;
  while (qi < queue.length) {
    const cur = queue[qi++];
    if (cur.col === to.col && cur.row === to.row) break;
    const cell = maze[cur.row][cur.col];
    const neighbors: [Dir, number, number][] = [
      ["N", cur.col, cur.row - 1],
      ["S", cur.col, cur.row + 1],
      ["E", cur.col + 1, cur.row],
      ["W", cur.col - 1, cur.row],
    ];
    for (const [dir, nc, nr] of neighbors) {
      if (nc < 0 || nc >= COLS || nr < 0 || nr >= ROWS) continue;
      if (cell.walls[dir]) continue;
      const k = key(nc, nr);
      if (visited.has(k)) continue;
      visited.add(k);
      prev.set(k, cur);
      queue.push({ col: nc, row: nr });
    }
  }
  const toKey = key(to.col, to.row);
  if (!visited.has(toKey)) return from; // unreachable — shouldn't happen in a perfect maze
  let cur = to;
  let curKey = toKey;
  let parent = prev.get(curKey);
  while (parent && !(parent.col === from.col && parent.row === from.row)) {
    cur = parent;
    curKey = key(cur.col, cur.row);
    parent = prev.get(curKey);
  }
  return cur;
}

/** Picks a cell for a new star: far enough from the llama, not already holding another star. */
// How far around the llama a correctly-answered question can knock down a wall — close enough
// that the new shortcut is actually reachable and useful right away.
const OPEN_WALL_RADIUS = 3;

/** Knocks down one existing wall near `near` (grid distance, not path distance), turning the maze's
 *  single deterministic corridor into one with a genuine alternate route — a real way to lose the wolf. */
function openNewPath(maze: Cell[][], near: { col: number; row: number }) {
  const candidates: { col: number; row: number; dir: Dir }[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (Math.abs(c - near.col) + Math.abs(r - near.row) > OPEN_WALL_RADIUS) continue;
      const cell = maze[r][c];
      for (const dir of ["N", "S", "E", "W"] as Dir[]) {
        if (!cell.walls[dir]) continue;
        const [dc, dr] = DIR_DELTA[dir];
        const nc = c + dc;
        const nr = r + dr;
        if (nc < 0 || nc >= COLS || nr < 0 || nr >= ROWS) continue;
        candidates.push({ col: c, row: r, dir });
      }
    }
  }
  if (candidates.length === 0) return;
  const pick = shuffle(candidates)[0];
  const [dc, dr] = DIR_DELTA[pick.dir];
  maze[pick.row][pick.col].walls[pick.dir] = false;
  maze[pick.row + dr][pick.col + dc].walls[OPPOSITE[pick.dir]] = false;
}

function pickStarCell(maze: Cell[][], from: { col: number; row: number }, avoid: StarTile[]): { col: number; row: number } {
  const dist = bfsDistances(maze, from);
  const isAvoided = (c: number, r: number) => avoid.some((a) => a.col === c && a.row === r);
  const inRange: { col: number; row: number }[] = [];
  const fallback: { col: number; row: number }[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (c === from.col && r === from.row) continue;
      if (isAvoided(c, r)) continue;
      const d = dist[r][c];
      if (d < 0) continue;
      if (d >= STAR_MIN_DIST) inRange.push({ col: c, row: r });
      else fallback.push({ col: c, row: r });
    }
  }
  const pool = inRange.length > 0 ? inRange : fallback;
  return shuffle(pool)[0] ?? { col: from.col, row: from.row };
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

// The wolf's bounding box in LlamaGame's own drawWolf (x-8..x+52, y-6..y+32) — centered the same way as the llama.
const WOLF_OX = -22;
const WOLF_OY = -13;

/** The exact same pixel-art wolf as Llama Run (identical shapes and colors), scaled and rotated to face
 *  whichever way it's currently stalking. */
function drawWolfSprite(ctx: CanvasRenderingContext2D, cx: number, cy: number, facing: Dir, frame: number) {
  const legOffset = Math.sin(frame * 0.4) * 3;
  const x = WOLF_OX;
  const y = WOLF_OY;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(FACING_ANGLE[facing]);
  ctx.scale(SPRITE_SCALE, SPRITE_SCALE);
  ctx.fillStyle = "#555";
  ctx.fillRect(x + 4, y + 8, 30, 16);
  ctx.fillStyle = "#666";
  ctx.fillRect(x + 30, y + 2, 14, 14);
  ctx.fillStyle = "#444";
  ctx.fillRect(x + 36, y - 6, 4, 8);
  ctx.fillRect(x + 42, y - 4, 4, 6);
  ctx.fillStyle = "#777";
  ctx.fillRect(x + 44, y + 8, 8, 6);
  ctx.fillStyle = "#ff3333";
  ctx.fillRect(x + 38, y + 5, 3, 3);
  ctx.fillStyle = "#444";
  ctx.fillRect(x + 8, y + 22, 5, 10 + legOffset);
  ctx.fillRect(x + 18, y + 22, 5, 10 - legOffset);
  ctx.fillRect(x + 24, y + 22, 5, 10 + legOffset);
  ctx.fillStyle = "#555";
  ctx.fillRect(x - 4, y + 6, 10, 4);
  ctx.fillRect(x - 8, y + 2, 6, 6);
  ctx.restore();
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

interface GameState {
  maze: Cell[][];
  pos: { col: number; row: number };
  animFrom: { col: number; row: number };
  tweening: boolean;
  tweenProgress: number;
  facing: Dir;
  frameCount: number;
  stars: StarTile[];
  remainingFrames: number;
  score: number;
  lastVerbIdx: number;
  wolf: { col: number; row: number };
  wolfFacing: Dir;
  wolfMoveFrames: number;
}

function makeInitialGameState(): GameState {
  const maze = generateMaze(COLS, ROWS);
  const start = { col: 0, row: 0 };
  return {
    maze,
    pos: start,
    animFrom: start,
    tweening: false,
    tweenProgress: 1,
    facing: "E",
    frameCount: 0,
    stars: [],
    remainingFrames: GAME_FRAMES,
    score: 0,
    lastVerbIdx: -1,
    // Placeholder — placeStars must run first, then placeWolf positions it for real
    // (its minimum distance depends on where the stars ended up).
    wolf: start,
    wolfFacing: "W",
    wolfMoveFrames: WOLF_STEP_FRAMES,
  };
}

/** Positions the wolf only once stars exist — guarantees it starts farther from the llama than the
 *  nearest star, so the first star (and the escape route answering it opens) is always reachable first. */
function placeWolf(state: GameState) {
  const dist = bfsDistances(state.maze, state.pos);
  const nearestStarDist = Math.min(...state.stars.map((s) => dist[s.row][s.col]));
  const minDist = Math.max(WOLF_START_MIN_DIST, nearestStarDist + WOLF_SAFETY_MARGIN);
  state.wolf = pickWolfStartCell(state.maze, state.pos, minDist);
}

const LlamaLabyrinth = () => {
  const { t, lang } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const [gameState, setGameState] = useState<"idle" | "playing" | "quiz" | "over">("idle");
  const [outcome, setOutcome] = useState<"timeup" | "caught" | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem("llama-labyrinth-highscore") || "0"));

  const [currentPhrase, setCurrentPhrase] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState(""); // "/"-separated accepted variants, for isTranslationCorrect
  const [input, setInput] = useState("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const g = useRef<GameState>(makeInitialGameState());

  const spawnStar = useCallback((state: GameState) => {
    const cell = pickStarCell(state.maze, state.pos, state.stars);
    state.stars.push({ col: cell.col, row: cell.row });
  }, []);

  const startGame = useCallback(() => {
    const state = makeInitialGameState();
    for (let i = 0; i < STARS_ACTIVE; i++) spawnStar(state);
    placeWolf(state);
    g.current = state;
    setScore(0);
    setTimeLeft(GAME_SECONDS);
    setResult(null);
    setOutcome(null);
    setGameState("playing");
  }, [spawnStar]);

  const endGame = useCallback((reason: "timeup" | "caught") => {
    const finalScore = g.current.score;
    if (finalScore > parseInt(localStorage.getItem("llama-labyrinth-highscore") || "0")) {
      localStorage.setItem("llama-labyrinth-highscore", String(finalScore));
      setHighScore(finalScore);
    }
    setOutcome(reason);
    setGameState("over");
  }, []);

  // The wolf catching the llama wipes the run's score — real stakes for standing still too long.
  const caughtByWolf = useCallback(() => {
    g.current.score = 0;
    setScore(0);
    endGame("caught");
  }, [endGame]);

  const exitGame = useCallback(() => {
    setGameState("idle");
  }, []);

  const resumeGame = useCallback(() => {
    spawnStar(g.current);
    setResult(null);
    setGameState("playing");
  }, [spawnStar]);

  const handleSubmit = useCallback(() => {
    if (result !== null) return;
    const isCorrect = isTranslationCorrect(input, currentAnswer);
    setResult(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      g.current.score += STAR_POINTS;
      setScore(g.current.score);
      // A correct answer earns a real escape route: knock down one wall near the llama so the
      // wolf's chase no longer has just one deterministic corridor to follow.
      openNewPath(g.current.maze, g.current.pos);
    }
    setTimeout(resumeGame, isCorrect ? CORRECT_FLASH_MS : WRONG_FLASH_MS);
  }, [input, currentAnswer, result, resumeGame]);

  // Landing on a star freezes movement and poses a translation quiz — picking up
  // the star mid-frame so it visually vanishes the instant it's touched.
  const triggerQuiz = useCallback(
    (star: StarTile) => {
      const state = g.current;
      state.stars = state.stars.filter((s) => s !== star);

      let idx = Math.floor(Math.random() * VERB_CONJUGATIONS.length);
      if (VERB_CONJUGATIONS.length > 1) {
        while (idx === state.lastVerbIdx) idx = Math.floor(Math.random() * VERB_CONJUGATIONS.length);
      }
      state.lastVerbIdx = idx;
      const verb = VERB_CONJUGATIONS[idx];
      const pronoun = PRONOUNS[Math.floor(Math.random() * PRONOUNS.length)] as Pronoun;

      setCurrentPhrase(getNativePhrase(verb, lang, pronoun));
      setCurrentAnswer(getGermanAnswer(verb, pronoun));
      setInput("");
      setResult(null);
      setGameState("quiz");
      setTimeout(() => inputRef.current?.focus(), 100);
    },
    [lang]
  );

  const onArrive = useCallback(() => {
    const state = g.current;
    if (state.wolf.col === state.pos.col && state.wolf.row === state.pos.row) {
      caughtByWolf();
      return;
    }
    const star = state.stars.find((s) => s.col === state.pos.col && s.row === state.pos.row);
    if (star) triggerQuiz(star);
  }, [triggerQuiz, caughtByWolf]);

  const tryMove = useCallback(
    (dir: Dir) => {
      const state = g.current;
      if (gameState !== "playing" || state.tweening) return;
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
      if (gameState === "quiz") {
        if (e.code === "Enter") {
          e.preventDefault();
          handleSubmit();
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
  }, [gameState, startGame, tryMove, handleSubmit]);

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

  // Main render loop — only runs while actually roaming (paused during the quiz overlay,
  // which is exactly when the countdown should pause too). Advances the slide animation,
  // ticks the timer down, and redraws every frame.
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
      state.remainingFrames -= 1;

      if (state.remainingFrames <= 0) {
        endGame("timeup");
        return;
      }
      if (state.frameCount % 15 === 0) setTimeLeft(Math.max(0, Math.ceil(state.remainingFrames / 60)));

      if (state.tweening) {
        state.tweenProgress += 1 / MOVE_FRAMES;
        if (state.tweenProgress >= 1) {
          state.tweenProgress = 1;
          state.tweening = false;
          onArrive();
        }
      }

      // The wolf creeps one cell closer, on its own slower cadence, always re-pathing toward
      // wherever the llama currently is.
      state.wolfMoveFrames -= 1;
      if (state.wolfMoveFrames <= 0) {
        state.wolfMoveFrames = WOLF_STEP_FRAMES;
        const next = bfsNextStep(state.maze, state.wolf, state.pos);
        if (next.col !== state.wolf.col || next.row !== state.wolf.row) {
          state.wolfFacing =
            next.col > state.wolf.col ? "E" : next.col < state.wolf.col ? "W" : next.row > state.wolf.row ? "S" : "N";
          state.wolf = next;
        }
        if (state.wolf.col === state.pos.col && state.wolf.row === state.pos.row) {
          caughtByWolf();
          return;
        }
      }

      drawMaze(ctx, state.maze);
      for (const star of state.stars) drawStar(ctx, star.col * CELL + CELL / 2, star.row * CELL + CELL / 2, state.frameCount);
      drawWolfSprite(ctx, state.wolf.col * CELL + CELL / 2, state.wolf.row * CELL + CELL / 2, state.wolfFacing, state.frameCount);

      const fx = state.animFrom.col + (state.pos.col - state.animFrom.col) * state.tweenProgress;
      const fy = state.animFrom.row + (state.pos.row - state.animFrom.row) * state.tweenProgress;
      drawLlamaSprite(ctx, fx * CELL + CELL / 2, fy * CELL + CELL / 2, state.facing, state.frameCount);

      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, onArrive, endGame, caughtByWolf]);

  return (
    <div className="flex flex-col items-center w-full gap-3 sm:gap-4">
      {(gameState === "playing" || gameState === "quiz") && (
        <div className="flex items-center justify-between w-full" style={{ maxWidth: CANVAS_SIZE }}>
          <span className="font-game text-[10px] sm:text-xs text-foreground">
            {t("scoreLabel")}: <span className="text-primary">{score}</span>
          </span>
          <span className="font-game text-[10px] sm:text-xs text-muted-foreground">{t("challengeTimeLeft", { s: timeLeft })}</span>
        </div>
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

        {(gameState === "playing" || gameState === "quiz") && (
          <button
            onClick={exitGame}
            className="absolute top-2 right-2 font-game text-xs px-3 py-1 rounded bg-destructive/80 text-destructive-foreground hover:bg-destructive transition-colors z-20"
          >
            {t("exitBtn")}
          </button>
        )}

        {gameState === "quiz" && (
          <div className="absolute inset-0 bg-foreground/70 flex items-center justify-center">
            <div className="bg-card rounded-xl p-3 sm:p-6 shadow-2xl text-center max-w-[95%] sm:max-w-md mx-2 sm:mx-4 border-2 border-accent">
              <p className="font-game text-xs sm:text-sm text-accent mb-2">{t("labyrinthStarPrompt")}</p>
              <p className="font-game text-sm sm:text-base text-card-foreground mb-3 sm:mb-4">{currentPhrase}</p>
              <div className="flex gap-2 justify-center items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={result !== null}
                  placeholder={t("fillPlaceholder")}
                  className="font-game text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg border-2 border-border bg-card text-card-foreground focus:border-accent focus:outline-none w-32 sm:w-48"
                />
                <button
                  onClick={handleSubmit}
                  disabled={result !== null}
                  className="font-game text-xs px-3 sm:px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
                >
                  OK
                </button>
              </div>
              {result === "correct" && (
                <p className="font-game text-xs mt-3" style={{ color: "hsl(142, 71%, 45%)" }}>
                  {t("articleCorrectPts", { points: STAR_POINTS })}
                </p>
              )}
              {result === "wrong" && (
                <p className="font-game text-xs text-destructive mt-3">{t("wrong0", { word: currentAnswer.split("/")[0] })}</p>
              )}
              {!result && <p className="text-muted-foreground text-xs mt-3 hidden sm:block">{t("enterConfirm")}</p>}
            </div>
          </div>
        )}

        {gameState === "over" && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="absolute inset-0 bg-foreground/60 animate-game-over-flash" />
            <div className="relative z-10 flex flex-col items-center gap-3 sm:gap-4 bg-card/95 rounded-2xl p-4 sm:p-8 shadow-2xl border-2 border-primary mx-4 max-w-[90%] text-center">
              {outcome === "caught" ? (
                <>
                  <p className="font-game text-sm sm:text-lg text-destructive">{t("labyrinthCaughtTitle")}</p>
                  <p className="font-body text-xs sm:text-sm text-foreground">{t("labyrinthCaughtText")}</p>
                </>
              ) : (
                <>
                  <p className="font-game text-sm sm:text-lg text-primary">{t("labyrinthTimeUpTitle")}</p>
                  <p className="font-body text-xs sm:text-sm text-foreground">{t("labyrinthTimeUpText", { score })}</p>
                </>
              )}
              <p className="font-game text-xs text-muted-foreground">
                {t("bestLabel")}: <span className="text-primary">{highScore}</span>
              </p>
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
