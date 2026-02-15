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

interface Question {
  text: string;
  options: string[];
  correct: number; // index of correct answer
}

const QUESTIONS: Question[] = [
  { text: "Jaký člen má Lama?", options: ["der", "die", "das"], correct: 2 },
  { text: "Jaký člen má Haus?", options: ["der", "die", "das"], correct: 2 },
  { text: "Jaký člen má Hund?", options: ["der", "die", "das"], correct: 0 },
  { text: "Jaký člen má Katze?", options: ["der", "die", "das"], correct: 1 },
  { text: "Jaký člen má Buch?", options: ["der", "die", "das"], correct: 2 },
  { text: "Jaký člen má Tisch?", options: ["der", "die", "das"], correct: 0 },
  { text: "Jaký člen má Blume?", options: ["der", "die", "das"], correct: 1 },
  { text: "Jaký člen má Auto?", options: ["der", "die", "das"], correct: 2 },
  { text: "Jaký člen má Baum?", options: ["der", "die", "das"], correct: 0 },
  { text: "Jaký člen má Schule?", options: ["der", "die", "das"], correct: 1 },
];

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

const drawScene = (ctx: CanvasRenderingContext2D, g: { groundOffset: number; obstacles: Obstacle[]; llamaY: number; frameCount: number; score: number }) => {
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
  ctx.textAlign = "start";
  ctx.fillText(`${Math.floor(g.score / 5)}`, CANVAS_WIDTH - 100, 30);
};

const LlamaGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("llama-highscore") || "0");
  });
  const [gameState, setGameState] = useState<"idle" | "playing" | "quiz" | "over">("idle");
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [quizResult, setQuizResult] = useState<"correct" | "wrong" | null>(null);
  const questionIndexRef = useRef(0);

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
    questionIndexRef.current = 0;
    setScore(0);
    setCurrentQuestion(null);
    setQuizResult(null);
    setGameState("playing");
  }, []);

  const triggerQuiz = useCallback(() => {
    const q = QUESTIONS[questionIndexRef.current % QUESTIONS.length];
    questionIndexRef.current++;
    setCurrentQuestion(q);
    setQuizResult(null);
    setGameState("quiz");
  }, []);

  const handleAnswer = useCallback((index: number) => {
    if (!currentQuestion || quizResult) return;
    if (index === currentQuestion.correct) {
      setQuizResult("correct");
      // Remove the colliding obstacle and resume after a short delay
      setTimeout(() => {
        const g = gameRef.current;
        // Remove obstacle that caused collision (leftmost one near llama)
        g.obstacles = g.obstacles.filter(o => o.x > 80);
        g.llamaY = GROUND_Y;
        g.velocityY = 0;
        g.isJumping = false;
        setQuizResult(null);
        setCurrentQuestion(null);
        setGameState("playing");
      }, 800);
    } else {
      setQuizResult("wrong");
      setTimeout(() => {
        const finalScore = Math.floor(gameRef.current.score / 5);
        setScore(finalScore);
        if (finalScore > parseInt(localStorage.getItem("llama-highscore") || "0")) {
          setHighScore(finalScore);
          localStorage.setItem("llama-highscore", String(finalScore));
        }
        setGameState("over");
        setCurrentQuestion(null);
        setQuizResult(null);
      }, 1000);
    }
  }, [currentQuestion, quizResult]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameState === "quiz") {
        if (e.code === "Digit1" || e.code === "Numpad1") { e.preventDefault(); handleAnswer(0); }
        if (e.code === "Digit2" || e.code === "Numpad2") { e.preventDefault(); handleAnswer(1); }
        if (e.code === "Digit3" || e.code === "Numpad3") { e.preventDefault(); handleAnswer(2); }
        return;
      }
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
  }, [gameState, jump, startGame, handleAnswer]);

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

      // Collision → trigger quiz
      const llamaBox = { x: 38, y: g.llamaY - 22, w: 30, h: 62 };
      for (const o of g.obstacles) {
        const obsBox = { x: o.x, y: GROUND_Y - o.height + 40, w: o.width, h: o.height };
        if (
          llamaBox.x < obsBox.x + obsBox.w &&
          llamaBox.x + llamaBox.w > obsBox.x &&
          llamaBox.y + llamaBox.h > obsBox.y
        ) {
          triggerQuiz();
          return; // stop the loop
        }
      }

      // Draw
      drawScene(ctx, g);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, triggerQuiz]);

  // Draw idle/game over screen
  useEffect(() => {
    if (gameState === "playing" || gameState === "quiz") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawScene(ctx, { groundOffset: 0, obstacles: [], llamaY: GROUND_Y, frameCount: 0, score: 0 });

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
        
        {/* Quiz overlay */}
        {gameState === "quiz" && currentQuestion && (
          <div className="absolute inset-0 bg-foreground/70 flex items-center justify-center">
            <div className="bg-card rounded-xl p-6 shadow-2xl text-center max-w-md mx-4 border-2 border-primary">
              <p className="font-game text-sm text-card-foreground mb-6 leading-relaxed">
                {currentQuestion.text}
              </p>
              <div className="flex gap-3 justify-center">
                {currentQuestion.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={quizResult !== null}
                    className={`font-game text-sm px-5 py-3 rounded-lg border-2 transition-all ${
                      quizResult !== null && i === currentQuestion.correct
                        ? "bg-green-500 text-white border-green-600 scale-105"
                        : quizResult === "wrong" && i !== currentQuestion.correct
                        ? "bg-destructive text-destructive-foreground border-destructive opacity-60"
                        : "bg-card text-card-foreground border-border hover:border-primary hover:bg-muted"
                    }`}
                  >
                    <span className="text-muted-foreground text-xs mr-1">{i + 1}.</span>
                    {opt}
                  </button>
                ))}
              </div>
              {quizResult === "correct" && (
                <p className="font-game text-xs text-green-600 mt-4">✓ Správně! Pokračuješ...</p>
              )}
              {quizResult === "wrong" && (
                <p className="font-game text-xs text-destructive mt-4">✗ Špatně! Game Over</p>
              )}
              {!quizResult && (
                <p className="text-muted-foreground text-xs mt-4">Klávesy 1, 2, 3 pro odpověď</p>
              )}
            </div>
          </div>
        )}
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
          else if (gameState !== "quiz") startGame();
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
