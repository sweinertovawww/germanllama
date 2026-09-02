import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Copy, Check } from "lucide-react";
import { getStory, getStoryVocabPairs, type VocabPair } from "@/data/beginnerStories";
import { currentShareUrl } from "@/lib/utils";
import { isTranslationCorrect } from "@/game/vocabularyData";

const CANVAS_WIDTH = 450;
const CANVAS_HEIGHT = 800;
const GROUND_Y = 640;
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const LLAMA_X = 30;
const LLAMA_W = 40;

const TILE_H = 14;
const TILE_W_MIN = 60;
const TILE_W_MAX = 80;
const GAP_MIN = 45;
const GAP_MAX = 95;
const SPEED_INITIAL = 2.8;
const SPEED_INCREMENT = 0.001;
const FALL_LIMIT = GROUND_Y + 140;
const START_LIVES = 3;

// Multi-level platforms: a handful of fixed floors the llama can jump up onto
// or drop down from. Steps within a staircase sit flush against each other
// (no gap) but differ in height, so climbing up always needs an actual jump
// while walking off a ledge down to a lower one happens naturally by falling.
const LEVELS = 4;
const LEVEL_STEP = 70;
const STAIR_TILE_W = 60;
const STAIR_LEN_MIN = 2;
const STAIR_LEN_MAX = 4;

function levelToY(level: number) {
  return GROUND_Y - level * LEVEL_STEP;
}
function yToLevel(y: number) {
  return Math.round((GROUND_Y - y) / LEVEL_STEP);
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Tile {
  x: number;
  width: number;
  y: number;
}

const drawLlama = (ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, hurt: boolean) => {
  const legOffset = Math.sin(frame * 0.3) * 4;
  ctx.save();
  if (hurt) ctx.globalAlpha = 0.5;
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
};

const drawSky = (ctx: CanvasRenderingContext2D, offset: number) => {
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  for (let i = 0; i < 4; i++) {
    const cx = ((i * 250 + 80 - offset * 0.2) % (CANVAS_WIDTH + 100)) - 50;
    const cy = 30 + i * 25;
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.arc(cx + 20, cy - 5, 14, 0, Math.PI * 2);
    ctx.arc(cx + 35, cy, 16, 0, Math.PI * 2);
    ctx.fill();
  }
};

const drawScene = (
  ctx: CanvasRenderingContext2D,
  g: { llamaY: number; frameCount: number; tiles: Tile[]; score: number; lives: number; hurtTimer: number; flashTimer: number }
) => {
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  grad.addColorStop(0, "#87CEEB");
  grad.addColorStop(0.7, "#c8e6f0");
  grad.addColorStop(1, "#e8d5b7");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawSky(ctx, g.frameCount);

  ctx.fillStyle = "#c4a882";
  for (let i = 0; i < 5; i++) {
    const mx = ((i * 200 + 50 - g.frameCount * 0.1) % (CANVAS_WIDTH + 200)) - 100;
    ctx.beginPath();
    ctx.moveTo(mx, GROUND_Y + 38);
    ctx.lineTo(mx + 60, GROUND_Y - 40 - i * 10);
    ctx.lineTo(mx + 120, GROUND_Y + 38);
    ctx.fill();
  }

  // Tiles (thin brown stepping platforms, no text)
  for (const t of g.tiles) {
    // Faint support column down to ground level so elevated tiles read as "floating up", not misplaced
    if (t.y < GROUND_Y) {
      ctx.fillStyle = "rgba(139,115,85,0.15)";
      ctx.fillRect(t.x + t.width / 2 - 3, t.y + TILE_H, 6, GROUND_Y - t.y);
    }
    ctx.fillStyle = "#8b7355";
    ctx.fillRect(t.x, t.y, t.width, TILE_H);
    ctx.fillStyle = "#a08868";
    ctx.fillRect(t.x, t.y, t.width, 3);
  }

  // Llama
  drawLlama(ctx, LLAMA_X, g.llamaY, g.frameCount, g.hurtTimer > 0);

  if (g.flashTimer > 0) {
    ctx.fillStyle = g.flashTimer % 2 === 0 ? "rgba(120,220,140,0.3)" : "rgba(255,255,255,0)";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  ctx.textAlign = "right";
  ctx.font = "14px 'Press Start 2P', monospace";
  ctx.fillStyle = "#2a1a0a";
  ctx.fillText(`${g.score}`, CANVAS_WIDTH - 14, 30);
  ctx.textAlign = "left";
  ctx.font = "16px sans-serif";
  ctx.fillText("❤️".repeat(Math.max(0, g.lives)), 14, 32);
};

interface LlamaJumpProps {
  storyId: string;
}

const LlamaJump = ({ storyId }: LlamaJumpProps) => {
  const story = useMemo(() => getStory(storyId), [storyId]);
  const vocabPool = useMemo(() => (story ? getStoryVocabPairs(story) : []), [story]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [gameState, setGameState] = useState<"idle" | "playing" | "quiz" | "over">("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem("llama-jump-highscore") || "0"));
  const [copied, setCopied] = useState(false);
  const [currentPair, setCurrentPair] = useState<VocabPair | null>(null);
  const [answerInput, setAnswerInput] = useState("");
  const [answerResult, setAnswerResult] = useState<"correct" | "wrong" | null>(null);
  const answerInputRef = useRef<HTMLInputElement>(null);

  const queueRef = useRef<VocabPair[]>([]);
  const queueIndexRef = useRef(0);
  const landingsUntilQuizRef = useRef(4);

  const gameRef = useRef({
    llamaY: GROUND_Y,
    velocityY: 0,
    isJumping: false,
    onGround: true,
    // Highest point (smallest Y) reached since the last landing — a tile can
    // only be landed on if the llama actually rose at least that high first,
    // which is what forces a real jump to reach a higher step.
    airMinY: GROUND_Y,
    frameCount: 0,
    speed: SPEED_INITIAL,
    score: 0,
    lives: START_LIVES,
    tiles: [] as Tile[],
    hurtTimer: 0,
    flashTimer: 0,
    landedTileCount: 0,
  });

  const jump = useCallback(() => {
    const g = gameRef.current;
    if (g.onGround && !g.isJumping) {
      g.velocityY = JUMP_FORCE;
      g.isJumping = true;
      g.onGround = false;
    }
  }, []);

  const nextQuizPair = useCallback(() => {
    if (queueIndexRef.current >= queueRef.current.length) {
      queueRef.current = shuffleArray(vocabPool);
      queueIndexRef.current = 0;
    }
    const pair = queueRef.current[queueIndexRef.current];
    queueIndexRef.current++;
    return pair;
  }, [vocabPool]);

  // Appends either a contiguous staircase (steps touching, height varies ±1
  // level per step) or a standalone platform after a gap, at a level within
  // reach of the previous one.
  const spawnSegment = useCallback((afterX: number, afterLevel: number) => {
    const g = gameRef.current;
    if (Math.random() < 0.45) {
      const len = STAIR_LEN_MIN + Math.floor(Math.random() * (STAIR_LEN_MAX - STAIR_LEN_MIN + 1));
      const gap = GAP_MIN + Math.random() * (GAP_MAX - GAP_MIN);
      let x = afterX + gap;
      let level = afterLevel;
      for (let i = 0; i < len; i++) {
        if (i > 0) {
          const dir = Math.random() < 0.5 ? 1 : -1;
          level = Math.max(0, Math.min(LEVELS - 1, level + dir));
        }
        g.tiles.push({ x, width: STAIR_TILE_W, y: levelToY(level) });
        x += STAIR_TILE_W;
      }
    } else {
      const width = TILE_W_MIN + Math.random() * (TILE_W_MAX - TILE_W_MIN);
      const gap = GAP_MIN + Math.random() * (GAP_MAX - GAP_MIN);
      const x = afterX + gap;
      const dir = Math.random() < 0.5 ? 0 : Math.random() < 0.5 ? 1 : -1;
      const level = Math.max(0, Math.min(LEVELS - 1, afterLevel + dir));
      g.tiles.push({ x, width, y: levelToY(level) });
    }
  }, []);

  const rightmostTile = (tiles: Tile[]): Tile | null =>
    tiles.reduce<Tile | null>((best, t) => (!best || t.x + t.width > best.x + best.width ? t : best), null);

  const startGame = useCallback(() => {
    const g = gameRef.current;
    g.llamaY = GROUND_Y;
    g.velocityY = 0;
    g.isJumping = false;
    g.onGround = true;
    g.airMinY = GROUND_Y;
    g.frameCount = 0;
    g.speed = SPEED_INITIAL;
    g.score = 0;
    g.lives = START_LIVES;
    g.hurtTimer = 0;
    g.flashTimer = 0;
    g.landedTileCount = 0;
    g.tiles = [{ x: 0, width: 160, y: GROUND_Y }];
    while (true) {
      const last = rightmostTile(g.tiles);
      if (!last || last.x + last.width >= CANVAS_WIDTH + 300) break;
      spawnSegment(last.x + last.width, yToLevel(last.y));
    }
    queueRef.current = shuffleArray(vocabPool);
    queueIndexRef.current = 0;
    landingsUntilQuizRef.current = 3 + Math.floor(Math.random() * 3);
    setScore(0);
    setCurrentPair(null);
    setAnswerInput("");
    setAnswerResult(null);
    setGameState("playing");
  }, [vocabPool, spawnSegment]);

  const resumeGame = useCallback(() => {
    setCurrentPair(null);
    setAnswerInput("");
    setAnswerResult(null);
    setGameState("playing");
  }, []);

  const triggerQuiz = useCallback(() => {
    setCurrentPair(nextQuizPair());
    setAnswerInput("");
    setAnswerResult(null);
    setGameState("quiz");
    setTimeout(() => answerInputRef.current?.focus(), 100);
  }, [nextQuizPair]);

  const handleAnswerSubmit = useCallback(() => {
    if (!currentPair || answerResult !== null) return;
    const isCorrect = isTranslationCorrect(answerInput, currentPair.de);
    setAnswerResult(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      gameRef.current.score += 3;
      setScore(gameRef.current.score);
      if (gameRef.current.score > parseInt(localStorage.getItem("llama-jump-highscore") || "0")) {
        setHighScore(gameRef.current.score);
        localStorage.setItem("llama-jump-highscore", String(gameRef.current.score));
      }
    }
    setTimeout(resumeGame, 1200);
  }, [currentPair, answerInput, answerResult, resumeGame]);

  // Responsive scaling
  useEffect(() => {
    const updateScale = () => {
      const container = containerRef.current;
      if (!container) return;
      const parentWidth = container.parentElement?.clientWidth || window.innerWidth;
      const maxWidth = Math.min(parentWidth - 16, CANVAS_WIDTH);
      const scaleByWidth = maxWidth / CANVAS_WIDTH;
      const availableHeight = window.innerHeight - 260;
      const scaleByHeight = Math.max(0.35, availableHeight / CANVAS_HEIGHT);
      setScale(Math.min(scaleByWidth, scaleByHeight));
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameState === "quiz") {
        if (e.code === "Enter") {
          e.preventDefault();
          answerInputRef.current?.blur();
          handleAnswerSubmit();
        }
        return;
      }
      if (e.code === "ArrowUp" || e.code === "Space") {
        e.preventDefault();
        if (gameState === "idle" || gameState === "over") startGame();
        else if (gameState === "playing") jump();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameState, jump, startGame, handleAnswerSubmit]);

  // Main loop
  useEffect(() => {
    if (gameState !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const loop = () => {
      const g = gameRef.current;
      g.frameCount++;
      if (g.hurtTimer > 0) g.hurtTimer--;
      if (g.flashTimer > 0) g.flashTimer--;

      // Scroll tiles left
      g.tiles = g.tiles.filter((t) => {
        t.x -= g.speed;
        return t.x + t.width > -20;
      });
      // Keep spawning ahead
      const rightmost = rightmostTile(g.tiles);
      if (!rightmost || rightmost.x + rightmost.width < CANVAS_WIDTH + 200) {
        spawnSegment(rightmost ? rightmost.x + rightmost.width : 0, rightmost ? yToLevel(rightmost.y) : 0);
      }

      // Physics
      g.velocityY += GRAVITY;
      g.llamaY += g.velocityY;
      g.airMinY = Math.min(g.airMinY, g.llamaY);

      const llamaFootX = LLAMA_X + LLAMA_W / 2;
      const tileHere = g.tiles.find((t) => llamaFootX >= t.x && llamaFootX <= t.x + t.width);
      // A tile only counts as a valid landing if the llama actually rose at
      // least as high as its surface first (airMinY <= tile.y) — that's what
      // makes climbing onto a higher step require a real jump, while walking
      // off a ledge down onto a lower one still works without jumping.
      const canLand = tileHere && g.airMinY <= tileHere.y;

      if (g.velocityY >= 0) {
        // Falling or resting — check landing
        if (canLand && tileHere && g.llamaY >= tileHere.y) {
          if (!g.onGround) {
            g.landedTileCount++;
            g.score += 1;
            setScore(g.score);
            landingsUntilQuizRef.current--;
            if (landingsUntilQuizRef.current <= 0) {
              landingsUntilQuizRef.current = 3 + Math.floor(Math.random() * 3);
              g.llamaY = tileHere.y;
              g.velocityY = 0;
              g.isJumping = false;
              g.onGround = true;
              g.airMinY = g.llamaY;
              triggerQuiz();
              return;
            }
          }
          g.llamaY = tileHere.y;
          g.velocityY = 0;
          g.isJumping = false;
          g.onGround = true;
          g.airMinY = g.llamaY;
        } else {
          g.onGround = false;
          if (g.llamaY > FALL_LIMIT) {
            // Missed the tile — lose a life
            g.lives -= 1;
            g.hurtTimer = 25;
            if (g.lives <= 0) {
              setGameState("over");
              return;
            }
            // Respawn on solid ground under the llama
            g.tiles = g.tiles.filter((t) => t.x > LLAMA_X + 120).map((t) => ({ ...t }));
            g.tiles.unshift({ x: 0, width: 140, y: GROUND_Y });
            g.llamaY = GROUND_Y;
            g.velocityY = 0;
            g.isJumping = false;
            g.onGround = true;
            g.airMinY = GROUND_Y;
          }
        }
      } else {
        g.onGround = false;
      }

      g.speed += SPEED_INCREMENT;

      drawScene(ctx, {
        llamaY: g.llamaY,
        frameCount: g.frameCount,
        tiles: g.tiles,
        score: g.score,
        lives: g.lives,
        hurtTimer: g.hurtTimer,
        flashTimer: g.flashTimer,
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, spawnSegment, triggerQuiz]);

  // Idle frame
  useEffect(() => {
    if (gameState === "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawScene(ctx, {
      llamaY: GROUND_Y,
      frameCount: 0,
      tiles: [{ x: 0, width: 200, y: GROUND_Y }],
      score: 0,
      lives: START_LIVES,
      hurtTimer: 0,
      flashTimer: 0,
    });
  }, [gameState]);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `I scored ${score} points in Llama Jump on GermanLlama! 🦙 ${currentShareUrl("en")}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!story || vocabPool.length === 0) {
    return <p className="font-body text-muted-foreground text-sm">Story not found.</p>;
  }

  return (
    <div className="flex flex-col items-center w-full gap-3 sm:gap-4">
      <div
        ref={containerRef}
        className="relative rounded-lg sm:rounded-xl overflow-hidden shadow-lg border-2 border-border"
        style={{ width: CANVAS_WIDTH * scale, height: CANVAS_HEIGHT * scale }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="block origin-top-left"
          style={{ transform: `scale(${scale})`, width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
        />

        {gameState === "idle" && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/40 backdrop-blur-[2px]">
            <div className="bg-card/95 rounded-2xl p-6 shadow-2xl border-2 border-primary flex flex-col items-center gap-4 max-w-[85%]">
              <p className="font-game text-sm text-foreground text-center">🦙 Llama Jump</p>
              <p className="font-body text-xs text-muted-foreground text-center leading-relaxed">
                Jump from tile to tile — don't fall in the gaps! Every few tiles, translate a word from the story.
              </p>
              <button
                onClick={startGame}
                className="font-game text-sm px-8 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all shadow-lg"
              >
                START
              </button>
            </div>
          </div>
        )}

        {gameState === "quiz" && currentPair && (
          <div className="absolute inset-0 bg-foreground/70 flex items-center justify-center">
            <div className="bg-card rounded-xl p-4 sm:p-6 shadow-2xl text-center max-w-[90%] sm:max-w-md mx-4 border-2 border-primary">
              <p className="font-game text-[10px] sm:text-xs text-muted-foreground mb-2">Translate to German:</p>
              <p className="font-game text-sm sm:text-base text-card-foreground mb-4">{currentPair.en}</p>
              <div className="flex gap-2 justify-center items-center">
                <input
                  ref={answerInputRef}
                  type="text"
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  disabled={answerResult !== null}
                  placeholder="Type in German..."
                  className="font-game text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg border-2 border-border bg-card text-card-foreground focus:border-primary focus:outline-none w-40 sm:w-56"
                />
                <button
                  onClick={() => { answerInputRef.current?.blur(); handleAnswerSubmit(); }}
                  disabled={answerResult !== null}
                  className="font-game text-xs px-3 sm:px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  OK
                </button>
              </div>
              {answerResult === "correct" && (
                <p className="font-game text-xs mt-3" style={{ color: "hsl(142, 71%, 45%)" }}>
                  Correct! +3
                </p>
              )}
              {answerResult === "wrong" && (
                <p className="font-game text-xs text-destructive mt-3">
                  It's "{currentPair.de}"
                </p>
              )}
              {!answerResult && (
                <p className="text-muted-foreground text-xs mt-3 hidden sm:block">Press Enter to confirm</p>
              )}
            </div>
          </div>
        )}

        {gameState === "over" && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="absolute inset-0 bg-foreground/60" />
            <div className="relative z-10 flex flex-col items-center gap-3 bg-card/95 rounded-2xl p-6 shadow-2xl border-2 border-primary mx-4 max-w-[90%]">
              <p className="font-game text-lg text-destructive">Game Over</p>
              <p className="font-game text-sm text-foreground">Score: <span className="text-primary">{score}</span></p>
              <p className="font-game text-xs text-muted-foreground">Best: <span className="text-primary">{highScore}</span></p>
              <button
                onClick={startGame}
                className="font-game text-sm px-8 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all shadow-lg"
              >
                Try Again
              </button>
              {score > 0 && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 font-game text-xs px-4 py-2 rounded-lg border-2 border-border text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Share score"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {(gameState === "playing" || gameState === "quiz") && (
        <button
          onClick={jump}
          className="bg-primary text-primary-foreground font-game text-sm w-full max-w-xs py-4 rounded-xl hover:opacity-90 transition-opacity active:scale-95 touch-manipulation shadow-md"
        >
          JUMP
        </button>
      )}

      <p className="text-muted-foreground text-xs hidden sm:block">
        Press <kbd className="bg-muted px-2 py-1 rounded text-xs font-game">↑</kbd> or{" "}
        <kbd className="bg-muted px-2 py-1 rounded text-xs font-game">SPACE</kbd> to jump
      </p>
    </div>
  );
};

export default LlamaJump;
