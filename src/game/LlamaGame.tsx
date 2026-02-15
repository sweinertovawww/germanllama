import { useEffect, useRef, useState, useCallback } from "react";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 300;
const GROUND_Y = 240;
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const GAME_SPEED_INITIAL = 5;
const GAME_SPEED_INCREMENT = 0.002;
const OBSTACLE_INTERVAL = 90;

interface Obstacle {
  x: number;
  width: number;
  height: number;
}

const drawLlama = (ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) => {
  const legOffset = Math.sin(frame * 0.3) * 4;

  // Body
  ctx.fillStyle = "#e8d5b7";
  ctx.fillRect(x + 8, y + 10, 24, 20);

  // Neck
  ctx.fillRect(x + 26, y - 10, 8, 22);

  // Head
  ctx.fillStyle = "#f0e0c8";
  ctx.fillRect(x + 24, y - 22, 14, 14);

  // Ear
  ctx.fillStyle = "#d4b896";
  ctx.fillRect(x + 32, y - 28, 4, 8);

  // Eye
  ctx.fillStyle = "#2a1a0a";
  ctx.fillRect(x + 33, y - 18, 3, 3);

  // Legs
  ctx.fillStyle = "#d4b896";
  ctx.fillRect(x + 10, y + 28, 5, 12 + legOffset);
  ctx.fillRect(x + 20, y + 28, 5, 12 - legOffset);

  // Tail
  ctx.fillStyle = "#c8a878";
  ctx.fillRect(x + 4, y + 8, 6, 4);
};

const drawCactus = (ctx: CanvasRenderingContext2D, x: number, height: number) => {
  const y = GROUND_Y - height;
  ctx.fillStyle = "#5a8a3c";
  ctx.fillRect(x + 4, y, 12, height);
  // Arms
  ctx.fillRect(x, y + 10, 8, 6);
  ctx.fillRect(x + 12, y + 20, 8, 6);
  ctx.fillRect(x, y + 13, 4, 12);
  ctx.fillRect(x + 16, y + 23, 4, 10);
};

const drawGround = (ctx: CanvasRenderingContext2D, offset: number) => {
  ctx.fillStyle = "#8b7355";
  ctx.fillRect(0, GROUND_Y + 40, CANVAS_WIDTH, 20);
  ctx.fillStyle = "#a08868";
  ctx.fillRect(0, GROUND_Y + 38, CANVAS_WIDTH, 4);

  // Ground detail dots
  ctx.fillStyle = "#9a815f";
  for (let i = 0; i < 30; i++) {
    const dx = ((i * 50 + offset * 0.5) % (CANVAS_WIDTH + 20)) - 10;
    ctx.fillRect(dx, GROUND_Y + 44, 2, 2);
  }
};

const drawSky = (ctx: CanvasRenderingContext2D, offset: number) => {
  // Clouds
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

const LlamaGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("llama-highscore") || "0");
  });
  const [gameState, setGameState] = useState<"idle" | "playing" | "over">("idle");

  const gameRef = useRef({
    llamaY: GROUND_Y,
    velocityY: 0,
    isJumping: false,
    obstacles: [] as Obstacle[],
    frameCount: 0,
    speed: GAME_SPEED_INITIAL,
    score: 0,
    groundOffset: 0,
  });

  const jump = useCallback(() => {
    const g = gameRef.current;
    if (!g.isJumping) {
      g.velocityY = JUMP_FORCE;
      g.isJumping = true;
    }
  }, []);

  const startGame = useCallback(() => {
    const g = gameRef.current;
    g.llamaY = GROUND_Y;
    g.velocityY = 0;
    g.isJumping = false;
    g.obstacles = [];
    g.frameCount = 0;
    g.speed = GAME_SPEED_INITIAL;
    g.score = 0;
    g.groundOffset = 0;
    setScore(0);
    setGameState("playing");
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "ArrowUp" || e.code === "Space") {
        e.preventDefault();
        if (gameState === "idle" || gameState === "over") {
          startGame();
        } else if (gameState === "playing") {
          jump();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameState, jump, startGame]);

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
      g.groundOffset += g.speed;

      // Physics
      g.velocityY += GRAVITY;
      g.llamaY += g.velocityY;
      if (g.llamaY >= GROUND_Y) {
        g.llamaY = GROUND_Y;
        g.velocityY = 0;
        g.isJumping = false;
      }

      // Spawn obstacles
      if (g.frameCount % OBSTACLE_INTERVAL === 0) {
        const h = 30 + Math.random() * 25;
        g.obstacles.push({ x: CANVAS_WIDTH, width: 20, height: h });
      }

      // Move obstacles
      g.obstacles = g.obstacles.filter((o) => {
        o.x -= g.speed;
        return o.x > -30;
      });

      // Speed up
      g.speed += GAME_SPEED_INCREMENT;

      // Score
      g.score++;
      if (g.score % 5 === 0) setScore(Math.floor(g.score / 5));

      // Collision
      const llamaBox = { x: 30 + 8, y: g.llamaY - 22, w: 30, h: 62 };
      for (const o of g.obstacles) {
        const obsBox = { x: o.x, y: GROUND_Y - o.height + 40, w: o.width, h: o.height };
        if (
          llamaBox.x < obsBox.x + obsBox.w &&
          llamaBox.x + llamaBox.w > obsBox.x &&
          llamaBox.y + llamaBox.h > obsBox.y
        ) {
          const finalScore = Math.floor(g.score / 5);
          setScore(finalScore);
          if (finalScore > highScore) {
            setHighScore(finalScore);
            localStorage.setItem("llama-highscore", String(finalScore));
          }
          setGameState("over");
          return;
        }
      }

      // Draw
      // Sky gradient
      const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      grad.addColorStop(0, "#87CEEB");
      grad.addColorStop(0.7, "#c8e6f0");
      grad.addColorStop(1, "#e8d5b7");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      drawSky(ctx, g.groundOffset);
      drawGround(ctx, g.groundOffset);

      // Mountains
      ctx.fillStyle = "#c4a882";
      for (let i = 0; i < 5; i++) {
        const mx = ((i * 200 + 50 - g.groundOffset * 0.1) % (CANVAS_WIDTH + 200)) - 100;
        ctx.beginPath();
        ctx.moveTo(mx, GROUND_Y + 38);
        ctx.lineTo(mx + 60, GROUND_Y - 40 - i * 10);
        ctx.lineTo(mx + 120, GROUND_Y + 38);
        ctx.fill();
      }

      // Obstacles
      for (const o of g.obstacles) {
        drawCactus(ctx, o.x, o.height);
      }

      // Llama
      drawLlama(ctx, 30, g.llamaY, g.frameCount);

      // Score display
      ctx.fillStyle = "#2a1a0a";
      ctx.font = "14px 'Press Start 2P', monospace";
      ctx.fillText(`${Math.floor(g.score / 5)}`, CANVAS_WIDTH - 100, 30);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, highScore]);

  // Draw idle/game over screen
  useEffect(() => {
    if (gameState === "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    grad.addColorStop(0, "#87CEEB");
    grad.addColorStop(0.7, "#c8e6f0");
    grad.addColorStop(1, "#e8d5b7");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    drawSky(ctx, 0);
    drawGround(ctx, 0);
    drawLlama(ctx, 30, GROUND_Y, 0);

    ctx.fillStyle = "#2a1a0a";
    ctx.font = "20px 'Press Start 2P', monospace";
    ctx.textAlign = "center";

    if (gameState === "idle") {
      ctx.fillText("LLAMA RUN", CANVAS_WIDTH / 2, 100);
      ctx.font = "10px 'Press Start 2P', monospace";
      ctx.fillText("Stiskni ↑ nebo MEZERNÍK", CANVAS_WIDTH / 2, 140);
    } else {
      ctx.fillText("GAME OVER", CANVAS_WIDTH / 2, 90);
      ctx.font = "12px 'Press Start 2P', monospace";
      ctx.fillText(`Skóre: ${score}`, CANVAS_WIDTH / 2, 125);
      ctx.fillText(`Nejlepší: ${highScore}`, CANVAS_WIDTH / 2, 150);
      ctx.font = "10px 'Press Start 2P', monospace";
      ctx.fillText("Stiskni ↑ pro restart", CANVAS_WIDTH / 2, 185);
    }
    ctx.textAlign = "start";
  }, [gameState, score, highScore]);

  return (
    <div className="flex flex-col items-center gap-6">
      <h1 className="font-game text-2xl text-foreground tracking-wider">
        🦙 Llama Run
      </h1>

      <div className="relative rounded-xl overflow-hidden shadow-lg border-2 border-border">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="block"
        />
      </div>

      <div className="flex gap-8 font-game text-sm">
        <span className="text-muted-foreground">
          Skóre: <span className="text-foreground">{score}</span>
        </span>
        <span className="text-muted-foreground">
          Nejlepší: <span className="text-primary">{highScore}</span>
        </span>
      </div>

      <button
        onClick={() => {
          if (gameState === "playing") jump();
          else startGame();
        }}
        className="bg-primary text-primary-foreground font-game text-xs px-6 py-3 rounded-lg hover:opacity-90 transition-opacity md:hidden"
      >
        ↑ SKOK
      </button>

      <p className="text-muted-foreground text-sm">
        Použij <kbd className="bg-muted px-2 py-1 rounded text-xs font-game">↑</kbd> nebo{" "}
        <kbd className="bg-muted px-2 py-1 rounded text-xs font-game">SPACE</kbd> pro skok
      </p>
    </div>
  );
};

export default LlamaGame;
