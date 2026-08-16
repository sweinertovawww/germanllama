import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Copy, Check } from "lucide-react";
import { getStory, getStoryVocabPairs, type VocabPair } from "@/data/beginnerStories";
import { currentShareUrl } from "@/lib/utils";

const CANVAS_WIDTH = 450;
const CANVAS_HEIGHT = 800;
const GROUND_Y = 640;
const GRAVITY = 0.6;
const JUMP_FORCE = -12;

const TILE_X = 15;
const TILE_W = 200;
const TILE_H = 44;
const TILE_SPEED_INITIAL = 2.6;
const TILE_SPEED_INCREMENT = 0.04;
const NEXT_TILE_DELAY = 45;
const START_LIVES = 3;

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Tile {
  y: number;
  de: string;
  correct: boolean;
  resolved: boolean;
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

const drawGround = (ctx: CanvasRenderingContext2D, offset: number) => {
  ctx.fillStyle = "#8b7355";
  ctx.fillRect(0, GROUND_Y + 40, CANVAS_WIDTH, 20);
  ctx.fillStyle = "#a08868";
  ctx.fillRect(0, GROUND_Y + 38, CANVAS_WIDTH, 4);
  ctx.fillStyle = "#9a815f";
  for (let i = 0; i < 30; i++) {
    const dx = ((i * 50 + offset * 0.5) % (CANVAS_WIDTH + 20)) - 10;
    ctx.fillRect(dx, GROUND_Y + 44, 2, 2);
  }
};

const drawScene = (
  ctx: CanvasRenderingContext2D,
  g: { llamaY: number; frameCount: number; tile: Tile | null; score: number; lives: number; prompt: string; hurtTimer: number; flashTimer: number }
) => {
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  grad.addColorStop(0, "#87CEEB");
  grad.addColorStop(0.7, "#c8e6f0");
  grad.addColorStop(1, "#e8d5b7");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawSky(ctx, g.frameCount);
  drawGround(ctx, g.frameCount);

  ctx.fillStyle = "#c4a882";
  for (let i = 0; i < 5; i++) {
    const mx = ((i * 200 + 50 - g.frameCount * 0.1) % (CANVAS_WIDTH + 200)) - 100;
    ctx.beginPath();
    ctx.moveTo(mx, GROUND_Y + 38);
    ctx.lineTo(mx + 60, GROUND_Y - 40 - i * 10);
    ctx.lineTo(mx + 120, GROUND_Y + 38);
    ctx.fill();
  }

  // Falling tile
  if (g.tile && !g.tile.resolved) {
    const t = g.tile;
    ctx.save();
    ctx.fillStyle = "#d4b96a";
    ctx.strokeStyle = "#8b6f2f";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(TILE_X, t.y, TILE_W, TILE_H, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#2a1a0a";
    ctx.font = "13px 'Press Start 2P', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(t.de, TILE_X + TILE_W / 2, t.y + TILE_H / 2 + 1);
    ctx.restore();
  }

  // Llama
  drawLlama(ctx, 30, g.llamaY, g.frameCount, g.hurtTimer > 0);

  // Catch flash
  if (g.flashTimer > 0) {
    ctx.fillStyle = g.flashTimer % 2 === 0 ? "rgba(120,220,140,0.35)" : "rgba(255,255,255,0)";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  // Prompt bar
  ctx.fillStyle = "rgba(10,10,10,0.85)";
  ctx.fillRect(0, 0, CANVAS_WIDTH, 46);
  ctx.fillStyle = "#ffd629";
  ctx.font = "11px 'Press Start 2P', monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("Catch:", 14, 23);
  ctx.fillStyle = "#ffffff";
  ctx.font = "14px 'Press Start 2P', monospace";
  ctx.fillText(g.prompt, 90, 23);

  // Score + lives
  ctx.textAlign = "right";
  ctx.font = "13px 'Press Start 2P', monospace";
  ctx.fillStyle = "#2a1a0a";
  ctx.fillText(`${g.score}`, CANVAS_WIDTH - 14, 70);
  ctx.textAlign = "left";
  ctx.font = "16px sans-serif";
  ctx.fillText("❤️".repeat(Math.max(0, g.lives)), 14, 70);
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
  const [gameState, setGameState] = useState<"idle" | "playing" | "over">("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem("llama-jump-highscore") || "0"));
  const [copied, setCopied] = useState(false);

  const queueRef = useRef<VocabPair[]>([]);
  const queueIndexRef = useRef(0);
  const distractorStreakRef = useRef(0);
  const nextTileDelayRef = useRef(0);

  const gameRef = useRef({
    llamaY: GROUND_Y,
    velocityY: 0,
    isJumping: false,
    frameCount: 0,
    speed: TILE_SPEED_INITIAL,
    score: 0,
    lives: START_LIVES,
    tile: null as Tile | null,
    currentPair: null as VocabPair | null,
    hurtTimer: 0,
    flashTimer: 0,
  });

  const jump = useCallback(() => {
    const g = gameRef.current;
    if (!g.isJumping) {
      g.velocityY = JUMP_FORCE;
      g.isJumping = true;
    }
  }, []);

  const nextPrompt = useCallback(() => {
    if (queueIndexRef.current >= queueRef.current.length) {
      queueRef.current = shuffleArray(vocabPool);
      queueIndexRef.current = 0;
    }
    const pair = queueRef.current[queueIndexRef.current];
    queueIndexRef.current++;
    gameRef.current.currentPair = pair;
    return pair;
  }, [vocabPool]);

  const spawnTile = useCallback(() => {
    const g = gameRef.current;
    if (!g.currentPair) g.currentPair = nextPrompt();
    const forceCorrect = distractorStreakRef.current >= 3;
    const showCorrect = forceCorrect || Math.random() < 0.45;
    let de: string;
    if (showCorrect) {
      de = g.currentPair.de;
      distractorStreakRef.current = 0;
    } else {
      const others = vocabPool.filter((p) => p.de !== g.currentPair!.de);
      const pick = others[Math.floor(Math.random() * others.length)] ?? g.currentPair;
      de = pick.de;
      distractorStreakRef.current++;
    }
    g.tile = { y: -TILE_H, de, correct: showCorrect, resolved: false };
  }, [nextPrompt, vocabPool]);

  const startGame = useCallback(() => {
    const g = gameRef.current;
    g.llamaY = GROUND_Y;
    g.velocityY = 0;
    g.isJumping = false;
    g.frameCount = 0;
    g.speed = TILE_SPEED_INITIAL;
    g.score = 0;
    g.lives = START_LIVES;
    g.tile = null;
    g.currentPair = null;
    g.hurtTimer = 0;
    g.flashTimer = 0;
    queueRef.current = shuffleArray(vocabPool);
    queueIndexRef.current = 0;
    distractorStreakRef.current = 0;
    nextTileDelayRef.current = 0;
    nextPrompt();
    setScore(0);
    setGameState("playing");
  }, [vocabPool, nextPrompt]);

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
      if (e.code === "ArrowUp" || e.code === "Space") {
        e.preventDefault();
        if (gameState === "idle" || gameState === "over") startGame();
        else if (gameState === "playing") jump();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameState, jump, startGame]);

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

      g.velocityY += GRAVITY;
      g.llamaY += g.velocityY;
      if (g.llamaY >= GROUND_Y) {
        g.llamaY = GROUND_Y;
        g.velocityY = 0;
        g.isJumping = false;
      }

      // Tile movement / spawning
      if (g.tile && !g.tile.resolved) {
        g.tile.y += g.speed;
        if (g.tile.y > CANVAS_HEIGHT) {
          g.tile.resolved = true;
          if (g.tile.correct) g.currentPair = nextPrompt();
          nextTileDelayRef.current = NEXT_TILE_DELAY;
          g.tile = null;
        } else {
          const llamaBox = { x: 30, y: g.llamaY - 30, w: 40, h: 60 };
          const tileBox = { x: TILE_X, y: g.tile.y, w: TILE_W, h: TILE_H };
          const overlap =
            llamaBox.x < tileBox.x + tileBox.w &&
            llamaBox.x + llamaBox.w > tileBox.x &&
            llamaBox.y < tileBox.y + tileBox.h &&
            llamaBox.y + llamaBox.h > tileBox.y;
          if (overlap && g.isJumping) {
            g.tile.resolved = true;
            if (g.tile.correct) {
              g.score += 1;
              setScore(g.score);
              g.flashTimer = 10;
              if (g.score > parseInt(localStorage.getItem("llama-jump-highscore") || "0")) {
                setHighScore(g.score);
                localStorage.setItem("llama-jump-highscore", String(g.score));
              }
              g.currentPair = nextPrompt();
            } else {
              g.lives -= 1;
              g.hurtTimer = 20;
            }
            nextTileDelayRef.current = NEXT_TILE_DELAY;
            g.tile = null;
          }
        }
      } else if (!g.tile) {
        if (nextTileDelayRef.current > 0) {
          nextTileDelayRef.current--;
        } else {
          spawnTile();
        }
      }

      g.speed += TILE_SPEED_INCREMENT * 0.02;

      if (g.lives <= 0) {
        setGameState("over");
        return;
      }

      drawScene(ctx, {
        llamaY: g.llamaY,
        frameCount: g.frameCount,
        tile: g.tile,
        score: g.score,
        lives: g.lives,
        prompt: g.currentPair?.en ?? "",
        hurtTimer: g.hurtTimer,
        flashTimer: g.flashTimer,
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, nextPrompt, spawnTile]);

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
      tile: null,
      score: 0,
      lives: START_LIVES,
      prompt: vocabPool[0]?.en ?? "",
      hurtTimer: 0,
      flashTimer: 0,
    });
  }, [gameState, vocabPool]);

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
                Jump onto the tile that matches the English word shown at the top. Stay on the ground if it's wrong!
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

      {gameState === "playing" && (
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
