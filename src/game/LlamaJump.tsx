import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Copy, Check } from "lucide-react";
import { getStory } from "@/data/beginnerStories";
import { currentShareUrl } from "@/lib/utils";
import { drawStar, drawSombrero, type Star, type Sombrero } from "@/game/collectibles";
import {
  QUESTIONS,
  FILL_QUESTIONS,
  filterByLevel,
  isTranslationCorrect,
  getGermanWordFromText,
  type Question,
  type FillQuestion,
} from "@/game/vocabularyData";

// A1-only pools — collecting a star quizzes the article (der/die/das) for a
// word, collecting a sombrero quizzes filling in a short A1 phrase/sentence.
const ARTICLE_POOL = filterByLevel(QUESTIONS, "A1");
const FILL_POOL = filterByLevel(FILL_QUESTIONS, "A1");

const ARTICLE_POINTS = 3;
const FILL_POINTS = 4;
const SOMBRERO_CHANCE = 0.22;
const STAR_CHANCE = 0.22;

const CANVAS_WIDTH = 450;
const CANVAS_HEIGHT = 800;
const GROUND_Y = 640;
// Tuned as a pair for a modest arc (just clears one level, not a big leap)
// that still covers enough ground horizontally at a slow scroll speed — a
// weaker jump force needs less gravity to match, which stretches the arc's
// duration (and therefore its horizontal reach) without raising its peak.
const GRAVITY = 0.36;
const JUMP_FORCE = -9;
const LLAMA_X = 30;
const LLAMA_W = 40;
// drawLlama's legs bottom out at y+40 (baseline, before the walk-cycle wobble) —
// physics treats llamaY as the foot/ground-contact point, so rendering must
// shift the sprite up by this much for the feet to actually land on the tile.
const LLAMA_FOOT_OFFSET = 40;

const TILE_H = 14;
const TILE_W_MIN = 85;
const TILE_W_MAX = 110;
// A jump's horizontal reach is speed × (fixed airtime). Sized comfortably
// under the reach of the tightest case (jumping up a level) at SPEED_INITIAL,
// so a jump always crosses the gap.
const GAP_MIN = 28;
const GAP_MAX = 42;
const SPEED_INITIAL = 1.3;
const SPEED_INCREMENT = 0.00036;
// Capped so a jump's horizontal reach can never grow enough to clear two
// tiles at once — otherwise a skipped tile could land the llama on one more
// than one level away from wherever it actually is.
const SPEED_MAX = 2.16;
const FALL_LIMIT = GROUND_Y + 140;
const START_LIVES = 3;

// A rare safety net: appears at ground level in the gap leading up to an
// elevated tile, every so often. Falling onto it bounces the llama back up
// instead of costing a life. Narrow enough to always fit inside the gap
// (GAP_MIN is 28, so this must stay comfortably under that).
const TRAMPOLINE_MIN_INTERVAL_FRAMES = 1800; // ~30s at 60fps
const TRAMPOLINE_JITTER_FRAMES = 600; // up to ~10s extra
const TRAMPOLINE_FIRST_DELAY_FRAMES = 600; // the very first one always shows up ~10s into a run
const TRAMPOLINE_WIDTH = 22;
const TRAMPOLINE_BOUNCE_FORCE = -14;

// Multi-level platforms: a handful of fixed floors the llama can jump up onto
// or drop down from. Every tile sits after a gap (no flush/contiguous steps),
// so reaching the next one — up, down, or level — always takes an active jump.
const LEVELS = 4;
const LEVEL_STEP = 70;

function levelToY(level: number) {
  return GROUND_Y - level * LEVEL_STEP;
}
function yToLevel(y: number) {
  return Math.round((GROUND_Y - y) / LEVEL_STEP);
}

interface Tile {
  x: number;
  width: number;
  y: number;
}

interface Trampoline {
  x: number;
  width: number;
  used: boolean;
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

const drawTrampoline = (ctx: CanvasRenderingContext2D, x: number, width: number) => {
  const cx = x + width / 2;
  const y = GROUND_Y + TILE_H;
  ctx.save();
  // Legs
  ctx.strokeStyle = "#7a5c3e";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + 6, y + 4);
  ctx.lineTo(x + 14, y + 16);
  ctx.moveTo(x + width - 6, y + 4);
  ctx.lineTo(x + width - 14, y + 16);
  ctx.stroke();
  // Frame ring
  ctx.strokeStyle = "#c0392b";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(cx, y, width / 2, 8, 0, 0, Math.PI * 2);
  ctx.stroke();
  // Bouncy bed
  ctx.fillStyle = "#2980b9";
  ctx.beginPath();
  ctx.ellipse(cx, y, width / 2 - 4, 5, 0, 0, Math.PI * 2);
  ctx.fill();
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
  g: {
    llamaY: number;
    frameCount: number;
    tiles: Tile[];
    trampolines: Trampoline[];
    stars: Star[];
    sombreros: Sombrero[];
    score: number;
    lives: number;
    hurtTimer: number;
    flashTimer: number;
  }
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

  for (const tr of g.trampolines) {
    if (!tr.used) drawTrampoline(ctx, tr.x, tr.width);
  }

  for (const s of g.sombreros) {
    if (!s.collected) drawSombrero(ctx, s.x, s.y, g.frameCount);
  }
  for (const s of g.stars) {
    if (!s.collected) drawStar(ctx, s.x, s.y, g.frameCount);
  }

  // Llama — shift up so the feet (not the sprite's y origin) sit on the tile
  drawLlama(ctx, LLAMA_X, g.llamaY - LLAMA_FOOT_OFFSET, g.frameCount, g.hurtTimer > 0);

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

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [gameState, setGameState] = useState<"idle" | "playing" | "quiz" | "over">("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem("llama-jump-highscore") || "0"));
  const [copied, setCopied] = useState(false);

  const [quizType, setQuizType] = useState<"article" | "fill" | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [articleResult, setArticleResult] = useState<"correct" | "wrong" | null>(null);
  const [currentFillQuestion, setCurrentFillQuestion] = useState<FillQuestion | null>(null);
  const [fillInput, setFillInput] = useState("");
  const [fillResult, setFillResult] = useState<"correct" | "wrong" | null>(null);
  const fillInputRef = useRef<HTMLInputElement>(null);

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
    trampolines: [] as Trampoline[],
    stars: [] as Star[],
    sombreros: [] as Sombrero[],
    hurtTimer: 0,
    flashTimer: 0,
    landedTileCount: 0,
    lastTrampolineFrame: 0,
    nextTrampolineDelay: TRAMPOLINE_MIN_INTERVAL_FRAMES,
  });

  const jump = useCallback(() => {
    const g = gameRef.current;
    if (g.onGround && !g.isJumping) {
      g.velocityY = JUMP_FORCE;
      g.isJumping = true;
      g.onGround = false;
    }
  }, []);

  // Collecting a star/sombrero freezes the world (the main loop only runs
  // while gameState === "playing") and opens a quiz overlay instead of
  // awarding points directly — points only come from answering correctly.
  const triggerArticleQuiz = useCallback(() => {
    setCurrentQuestion(ARTICLE_POOL[Math.floor(Math.random() * ARTICLE_POOL.length)]);
    setArticleResult(null);
    setQuizType("article");
    setGameState("quiz");
  }, []);

  const triggerFillQuiz = useCallback(() => {
    setCurrentFillQuestion(FILL_POOL[Math.floor(Math.random() * FILL_POOL.length)]);
    setFillInput("");
    setFillResult(null);
    setQuizType("fill");
    setGameState("quiz");
    setTimeout(() => fillInputRef.current?.focus(), 100);
  }, []);

  const resumeGame = useCallback(() => {
    setQuizType(null);
    setCurrentQuestion(null);
    setArticleResult(null);
    setCurrentFillQuestion(null);
    setFillInput("");
    setFillResult(null);
    setGameState("playing");
  }, []);

  const handleAnswer = useCallback(
    (index: number) => {
      if (!currentQuestion || articleResult !== null) return;
      const isCorrect = index === currentQuestion.correct;
      setArticleResult(isCorrect ? "correct" : "wrong");
      if (isCorrect) {
        gameRef.current.score += ARTICLE_POINTS;
        setScore(gameRef.current.score);
      }
      setTimeout(resumeGame, isCorrect ? 900 : 1400);
    },
    [currentQuestion, articleResult, resumeGame]
  );

  const handleFillSubmit = useCallback(() => {
    if (!currentFillQuestion || fillResult !== null) return;
    const isCorrect = isTranslationCorrect(fillInput, currentFillQuestion.answer);
    setFillResult(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      gameRef.current.score += FILL_POINTS;
      setScore(gameRef.current.score);
    }
    setTimeout(resumeGame, isCorrect ? 900 : 1400);
  }, [currentFillQuestion, fillInput, fillResult, resumeGame]);

  // Appends one long platform after a gap, at a level within jump reach of
  // the previous one (level stays the same, or moves ±1). Sometimes adds a
  // sombrero resting on the new tile, or a star floating mid-air in the gap
  // leading up to it.
  const spawnSegment = useCallback((afterX: number, afterLevel: number) => {
    const g = gameRef.current;
    const width = TILE_W_MIN + Math.random() * (TILE_W_MAX - TILE_W_MIN);
    const gap = GAP_MIN + Math.random() * (GAP_MAX - GAP_MIN);
    const x = afterX + gap;
    const dir = Math.random() < 0.5 ? 0 : Math.random() < 0.5 ? 1 : -1;
    const level = Math.max(0, Math.min(LEVELS - 1, afterLevel + dir));
    const y = levelToY(level);
    g.tiles.push({ x, width, y });

    if (Math.random() < SOMBRERO_CHANCE) {
      g.sombreros.push({ x: x + width / 2, y: y - 22, collected: false });
    }
    if (Math.random() < STAR_CHANCE) {
      const prevY = levelToY(afterLevel);
      g.stars.push({ x: afterX + gap / 2, y: Math.min(prevY, y) - 45, collected: false });
    }

    // Rare rescue net: sits in the gap leading up to an elevated tile (right
    // where a missed jump would actually fall through), only once the
    // min-interval-plus-jitter has actually elapsed since the last one.
    if (level > 0 && g.frameCount - g.lastTrampolineFrame > g.nextTrampolineDelay) {
      g.trampolines.push({ x: afterX + gap / 2 - TRAMPOLINE_WIDTH / 2, width: TRAMPOLINE_WIDTH, used: false });
      g.lastTrampolineFrame = g.frameCount;
      g.nextTrampolineDelay = TRAMPOLINE_MIN_INTERVAL_FRAMES + Math.random() * TRAMPOLINE_JITTER_FRAMES;
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
    g.lastTrampolineFrame = 0;
    g.nextTrampolineDelay = TRAMPOLINE_FIRST_DELAY_FRAMES;
    g.tiles = [{ x: 0, width: 160, y: GROUND_Y }];
    g.trampolines = [];
    g.stars = [];
    g.sombreros = [];
    while (true) {
      const last = rightmostTile(g.tiles);
      if (!last || last.x + last.width >= CANVAS_WIDTH + 300) break;
      spawnSegment(last.x + last.width, yToLevel(last.y));
    }
    setScore(0);
    setGameState("playing");
  }, [spawnSegment]);

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
        if (quizType === "fill" && e.code === "Enter") {
          e.preventDefault();
          fillInputRef.current?.blur();
          handleFillSubmit();
        } else if (quizType === "article" && ["Digit1", "Digit2", "Digit3"].includes(e.code)) {
          e.preventDefault();
          handleAnswer(Number(e.code.slice(-1)) - 1);
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
  }, [gameState, quizType, jump, startGame, handleFillSubmit, handleAnswer]);

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

      // Scroll tiles and collectibles left
      g.tiles = g.tiles.filter((t) => {
        t.x -= g.speed;
        return t.x + t.width > -20;
      });
      g.stars = g.stars.filter((s) => {
        s.x -= g.speed;
        return !s.collected && s.x > -30;
      });
      g.sombreros = g.sombreros.filter((s) => {
        s.x -= g.speed;
        return !s.collected && s.x > -30;
      });
      g.trampolines = g.trampolines.filter((t) => {
        t.x -= g.speed;
        return !t.used && t.x + t.width > -20;
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
      const llamaBodyY = g.llamaY - 20;

      // Sombreros: collectible any time (standing or mid-air), like Llama Run.
      // Collecting one pauses the game and opens the fill-in-the-phrase quiz.
      for (const s of g.sombreros) {
        if (!s.collected && Math.abs(llamaFootX - s.x) < 26 && Math.abs(llamaBodyY - s.y) < 30) {
          s.collected = true;
          triggerFillQuiz();
          return;
        }
      }
      // Stars: only collectible while airborne, same as Llama Run. Collecting
      // one pauses the game and opens the article (der/die/das) quiz.
      if (!g.onGround) {
        for (const s of g.stars) {
          if (!s.collected && Math.abs(llamaFootX - s.x) < 22 && Math.abs(llamaBodyY - s.y) < 28) {
            s.collected = true;
            triggerArticleQuiz();
            return;
          }
        }
      }

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
          }
          g.llamaY = tileHere.y;
          g.velocityY = 0;
          g.isJumping = false;
          g.onGround = true;
          g.airMinY = g.llamaY;
        } else {
          g.onGround = false;

          // Rescue net: bounce back up instead of falling all the way to
          // FALL_LIMIT if a trampoline happens to be under this exact spot.
          const trampolineHere = g.trampolines.find(
            (t) => !t.used && llamaFootX >= t.x && llamaFootX <= t.x + t.width
          );
          if (trampolineHere && g.llamaY >= GROUND_Y - 4) {
            trampolineHere.used = true;
            g.llamaY = GROUND_Y - 4;
            g.velocityY = TRAMPOLINE_BOUNCE_FORCE;
            g.airMinY = g.llamaY;
            g.isJumping = true;
          } else if (g.llamaY > FALL_LIMIT) {
            // Missed the tile — lose a life
            g.lives -= 1;
            g.hurtTimer = 25;
            if (g.lives <= 0) {
              if (g.score > parseInt(localStorage.getItem("llama-jump-highscore") || "0")) {
                setHighScore(g.score);
                localStorage.setItem("llama-jump-highscore", String(g.score));
              }
              setGameState("over");
              return;
            }
            // Respawn on solid ground under the llama. Discard every existing
            // tile and rebuild ahead from level 0 — keeping old tiles here
            // would leave them at whatever (possibly much higher) level they
            // were generated at, unreachable from this fresh ground level.
            g.tiles = [{ x: 0, width: 140, y: GROUND_Y }];
            g.trampolines = [];
            g.stars = [];
            g.sombreros = [];
            g.lastTrampolineFrame = g.frameCount;
            g.nextTrampolineDelay = TRAMPOLINE_MIN_INTERVAL_FRAMES + Math.random() * TRAMPOLINE_JITTER_FRAMES;
            while (true) {
              const last = rightmostTile(g.tiles);
              if (!last || last.x + last.width >= CANVAS_WIDTH + 300) break;
              spawnSegment(last.x + last.width, yToLevel(last.y));
            }
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

      g.speed = Math.min(SPEED_MAX, g.speed + SPEED_INCREMENT);

      drawScene(ctx, {
        llamaY: g.llamaY,
        frameCount: g.frameCount,
        tiles: g.tiles,
        trampolines: g.trampolines,
        stars: g.stars,
        sombreros: g.sombreros,
        score: g.score,
        lives: g.lives,
        hurtTimer: g.hurtTimer,
        flashTimer: g.flashTimer,
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, spawnSegment, triggerFillQuiz, triggerArticleQuiz]);

  // Idle frame — skip for "quiz" too, so the frozen game scene stays visible
  // behind the quiz overlay instead of being replaced by the placeholder.
  useEffect(() => {
    if (gameState === "playing" || gameState === "quiz") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawScene(ctx, {
      llamaY: GROUND_Y,
      frameCount: 0,
      tiles: [{ x: 0, width: 200, y: GROUND_Y }],
      trampolines: [],
      stars: [],
      sombreros: [],
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

  if (!story) {
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
                Jump from tile to tile — don't fall in the gaps! Grab a 👒 sombrero to fill in a word, or a ⭐ star mid-jump for an article quiz.
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

        {gameState === "quiz" && quizType === "article" && currentQuestion && (
          <div className="absolute inset-0 bg-foreground/70 flex items-center justify-center">
            <div className="bg-card rounded-xl p-3 sm:p-6 shadow-2xl text-center max-w-[95%] sm:max-w-md mx-2 sm:mx-4 border-2 border-primary">
              <p className="font-game text-xs sm:text-sm text-card-foreground mb-3 sm:mb-4 leading-relaxed">
                What is the article for "{getGermanWordFromText(currentQuestion.text)}"?
              </p>
              <div className="flex gap-2 sm:gap-3 justify-center">
                {currentQuestion.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={articleResult !== null}
                    className={`font-game text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-3 rounded-lg border-2 transition-all ${
                      articleResult !== null && i === currentQuestion.correct
                        ? "border-primary bg-primary/20 text-card-foreground scale-105"
                        : articleResult === "wrong"
                          ? "bg-destructive/20 text-card-foreground border-destructive/50 opacity-60"
                          : "bg-card text-card-foreground border-border hover:border-primary hover:bg-muted"
                    }`}
                  >
                    <span className="text-muted-foreground text-xs mr-1">{i + 1}.</span>
                    {opt}
                  </button>
                ))}
              </div>
              {articleResult === "correct" && (
                <p className="font-game text-xs mt-3" style={{ color: "hsl(142, 71%, 45%)" }}>
                  Correct! +{ARTICLE_POINTS}
                </p>
              )}
              {articleResult === "wrong" && (
                <p className="font-game text-xs text-destructive mt-3">
                  ✗ Wrong! Correct: {currentQuestion.options[currentQuestion.correct]} — 0 points
                </p>
              )}
            </div>
          </div>
        )}

        {gameState === "quiz" && quizType === "fill" && currentFillQuestion && (
          <div className="absolute inset-0 bg-foreground/70 flex items-center justify-center">
            <div className="bg-card rounded-xl p-3 sm:p-6 shadow-2xl text-center max-w-[95%] sm:max-w-md mx-2 sm:mx-4 border-2 border-accent">
              <p className="font-game text-xs sm:text-sm text-accent mb-2">Fill in the missing word:</p>
              <p className="font-game text-xs sm:text-sm text-card-foreground mb-2 leading-relaxed">
                {currentFillQuestion.sentence}
              </p>
              <p className="font-game text-xs text-muted-foreground mb-3 sm:mb-4 italic">
                {currentFillQuestion.translationEn ?? currentFillQuestion.translation}
              </p>
              <div className="flex gap-2 justify-center items-center">
                <input
                  ref={fillInputRef}
                  type="text"
                  value={fillInput}
                  onChange={(e) => setFillInput(e.target.value)}
                  disabled={fillResult !== null}
                  placeholder="Type in German..."
                  className="font-game text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg border-2 border-border bg-card text-card-foreground focus:border-accent focus:outline-none w-32 sm:w-48"
                />
                <button
                  onClick={() => { fillInputRef.current?.blur(); handleFillSubmit(); }}
                  disabled={fillResult !== null}
                  className="font-game text-xs px-3 sm:px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
                >
                  OK
                </button>
              </div>
              {fillResult === "correct" && (
                <p className="font-game text-xs mt-3" style={{ color: "hsl(142, 71%, 45%)" }}>
                  Correct! +{FILL_POINTS}
                </p>
              )}
              {fillResult === "wrong" && (
                <p className="font-game text-xs text-destructive mt-3">
                  ✗ Wrong! Answer: "{currentFillQuestion.answer}"
                </p>
              )}
              {!fillResult && (
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
