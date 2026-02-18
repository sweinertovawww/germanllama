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

interface Star {
  x: number;
  y: number;
  collected: boolean;
}

interface Question {
  text: string;
  options: string[];
  correct: number;
  translation: string;
}

interface FillQuestion {
  sentence: string;
  answer: string;
  translation: string;
}

const QUESTIONS: Question[] = [
  { text: "Jaký člen má Lama?", options: ["der", "die", "das"], correct: 2, translation: "lama" },
  { text: "Jaký člen má Haus?", options: ["der", "die", "das"], correct: 2, translation: "dům" },
  { text: "Jaký člen má Hund?", options: ["der", "die", "das"], correct: 0, translation: "pes" },
  { text: "Jaký člen má Katze?", options: ["der", "die", "das"], correct: 1, translation: "kočka" },
  { text: "Jaký člen má Buch?", options: ["der", "die", "das"], correct: 2, translation: "kniha" },
  { text: "Jaký člen má Tisch?", options: ["der", "die", "das"], correct: 0, translation: "stůl" },
  { text: "Jaký člen má Blume?", options: ["der", "die", "das"], correct: 1, translation: "květina" },
  { text: "Jaký člen má Auto?", options: ["der", "die", "das"], correct: 2, translation: "auto" },
  { text: "Jaký člen má Baum?", options: ["der", "die", "das"], correct: 0, translation: "strom" },
  { text: "Jaký člen má Schule?", options: ["der", "die", "das"], correct: 1, translation: "škola" },
  { text: "Jaký člen má Schreibtisch?", options: ["der", "die", "das"], correct: 0, translation: "psací stůl" },
  { text: "Jaký člen má Stuhl?", options: ["der", "die", "das"], correct: 0, translation: "židle" },
  { text: "Jaký člen má Computer?", options: ["der", "die", "das"], correct: 0, translation: "počítač" },
  { text: "Jaký člen má Monitor?", options: ["der", "die", "das"], correct: 0, translation: "monitor" },
  { text: "Jaký člen má Tastatur?", options: ["der", "die", "das"], correct: 1, translation: "klávesnice" },
  { text: "Jaký člen má Maus?", options: ["der", "die", "das"], correct: 1, translation: "myš" },
  { text: "Jaký člen má Dokument?", options: ["der", "die", "das"], correct: 2, translation: "dokument" },
  { text: "Jaký člen má Formular?", options: ["der", "die", "das"], correct: 2, translation: "formulář" },
  { text: "Jaký člen má Büro?", options: ["der", "die", "das"], correct: 2, translation: "kancelář" },
  { text: "Jaký člen má Drucker?", options: ["der", "die", "das"], correct: 0, translation: "tiskárna" },
  { text: "Jaký člen má Scanner?", options: ["der", "die", "das"], correct: 0, translation: "skener" },
  { text: "Jaký člen má Kopierer?", options: ["der", "die", "das"], correct: 0, translation: "kopírka" },
  { text: "Jaký člen má Aktenschrank?", options: ["der", "die", "das"], correct: 0, translation: "kartotéka" },
  { text: "Jaký člen má Regal?", options: ["der", "die", "das"], correct: 2, translation: "regál" },
  { text: "Jaký člen má Telefon?", options: ["der", "die", "das"], correct: 2, translation: "telefon" },
  { text: "Jaký člen má E-Mail?", options: ["der", "die", "das"], correct: 1, translation: "e-mail" },
  { text: "Jaký člen má Besprechung?", options: ["der", "die", "das"], correct: 1, translation: "porada" },
  { text: "Jaký člen má Pause?", options: ["der", "die", "das"], correct: 1, translation: "přestávka" },
  { text: "Jaký člen má Kantine?", options: ["der", "die", "das"], correct: 1, translation: "jídelna" },
  { text: "Jaký člen má Notebook?", options: ["der", "die", "das"], correct: 2, translation: "notebook" },
  { text: "Jaký člen má Schrank?", options: ["der", "die", "das"], correct: 0, translation: "skříň" },
  { text: "Jaký člen má Tür?", options: ["der", "die", "das"], correct: 1, translation: "dveře" },
  { text: "Jaký člen má Fenster?", options: ["der", "die", "das"], correct: 2, translation: "okno" },
  { text: "Jaký člen má Papierkorb?", options: ["der", "die", "das"], correct: 0, translation: "koš" },
  { text: "Jaký člen má Lampe?", options: ["der", "die", "das"], correct: 1, translation: "lampa" },
  { text: "Jaký člen má Whiteboard?", options: ["der", "die", "das"], correct: 2, translation: "tabule" },
  { text: "Jaký člen má Chef?", options: ["der", "die", "das"], correct: 0, translation: "šéf" },
  { text: "Jaký člen má Kollegin?", options: ["der", "die", "das"], correct: 1, translation: "kolegyně" },
  { text: "Jaký člen má Kollege?", options: ["der", "die", "das"], correct: 0, translation: "kolega" },
  { text: "Jaký člen má Meeting?", options: ["der", "die", "das"], correct: 2, translation: "schůzka" },
  { text: "Jaký člen má Projektor?", options: ["der", "die", "das"], correct: 0, translation: "projektor" },
  { text: "Jaký člen má Präsentation?", options: ["der", "die", "das"], correct: 1, translation: "prezentace" },
  { text: "Jaký člen má Bürogebäude?", options: ["der", "die", "das"], correct: 2, translation: "kancelářská budova" },
  { text: "Jaký člen má Cafeteria?", options: ["der", "die", "das"], correct: 1, translation: "kavárna" },
  { text: "Jaký člen má WC?", options: ["der", "die", "das"], correct: 2, translation: "záchod" },
  { text: "Jaký člen má Umkleide?", options: ["der", "die", "das"], correct: 1, translation: "šatna" },
];

const FILL_QUESTIONS: FillQuestion[] = [
  { sentence: "Ich ___ Deutsch.", answer: "spreche", translation: "Já mluvím německy." },
  { sentence: "Er ___ ein Buch.", answer: "liest", translation: "On čte knihu." },
  { sentence: "Wir ___ nach Hause.", answer: "gehen", translation: "My jdeme domů." },
  { sentence: "Sie ___ Kaffee.", answer: "trinkt", translation: "Ona pije kávu." },
  { sentence: "Du ___ sehr schnell.", answer: "läufst", translation: "Ty běžíš velmi rychle." },
  { sentence: "Ich ___ müde.", answer: "bin", translation: "Já jsem unavený/á." },
  { sentence: "Er ___ Lehrer.", answer: "ist", translation: "On je učitel." },
  { sentence: "Wir ___ Studenten.", answer: "sind", translation: "My jsme studenti." },
  { sentence: "Sie ___ eine Katze.", answer: "hat", translation: "Ona má kočku." },
  { sentence: "Du ___ Hunger.", answer: "hast", translation: "Ty máš hlad." },
  { sentence: "Ich ___ gern Musik.", answer: "höre", translation: "Já rád/a poslouchám hudbu." },
  { sentence: "Er ___ Fußball.", answer: "spielt", translation: "On hraje fotbal." },
  { sentence: "Wir ___ ins Kino.", answer: "gehen", translation: "My jdeme do kina." },
  { sentence: "Sie ___ sehr gut.", answer: "kocht", translation: "Ona vaří velmi dobře." },
  { sentence: "Du ___ schön.", answer: "singst", translation: "Ty zpíváš krásně." },
  { sentence: "Ich ___ Wasser.", answer: "trinke", translation: "Já piji vodu." },
  { sentence: "Er ___ die Tür.", answer: "öffnet", translation: "On otevírá dveře." },
  { sentence: "Wir ___ Deutsch.", answer: "lernen", translation: "My se učíme německy." },
  { sentence: "Sie ___ das Fenster.", answer: "schließt", translation: "Ona zavírá okno." },
  { sentence: "Du ___ mir.", answer: "hilfst", translation: "Ty mi pomáháš." },
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

const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) => {
  const pulse = 1 + Math.sin(frame * 0.1) * 0.15;
  const size = 10 * pulse;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(frame * 0.05);
  ctx.fillStyle = "#FFD700";
  ctx.strokeStyle = "#FFA500";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const method = i === 0 ? "moveTo" : "lineTo";
    ctx[method](Math.cos(angle) * size, Math.sin(angle) * size);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Glow
  ctx.shadowColor = "#FFD700";
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.restore();
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

const drawScene = (ctx: CanvasRenderingContext2D, g: { groundOffset: number; obstacles: Obstacle[]; stars: Star[]; llamaY: number; frameCount: number; score: number }) => {
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

  // Stars
  for (const s of g.stars) {
    if (!s.collected) {
      drawStar(ctx, s.x, s.y, g.frameCount);
    }
  }

  // Llama
  drawLlama(ctx, 30, g.llamaY, g.frameCount);

  // Score display
  ctx.fillStyle = "#2a1a0a";
  ctx.font = "14px 'Press Start 2P', monospace";
  ctx.textAlign = "start";
  ctx.fillText(`${g.score}`, CANVAS_WIDTH - 100, 30);
};

interface DailyEntry {
  name: string;
  score: number;
  date: string;
}

const getTodayStr = () => new Date().toISOString().slice(0, 10);

const getDailyBest = (): DailyEntry | null => {
  const entries: DailyEntry[] = JSON.parse(localStorage.getItem("llama-daily") || "[]");
  const today = getTodayStr();
  const todayEntries = entries.filter(e => e.date === today);
  if (todayEntries.length === 0) return null;
  return todayEntries.reduce((best, e) => e.score > best.score ? e : best);
};

const saveDailyScore = (name: string, score: number) => {
  const entries: DailyEntry[] = JSON.parse(localStorage.getItem("llama-daily") || "[]");
  const today = getTodayStr();
  // Keep only today's entries + new one
  const todayEntries = entries.filter(e => e.date === today);
  todayEntries.push({ name, score, date: today });
  localStorage.setItem("llama-daily", JSON.stringify(todayEntries));
};

const LlamaGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("llama-highscore") || "0");
  });
  const [gameState, setGameState] = useState<"idle" | "playing" | "quiz" | "starQuiz" | "over">("idle");
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [quizPhase, setQuizPhase] = useState<"article" | "translation">("article");
  const [translationInput, setTranslationInput] = useState("");
  const [translationResult, setTranslationResult] = useState<"correct" | "wrong" | null>(null);
  const [articleResult, setArticleResult] = useState<"correct" | "wrong" | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [dailyBest, setDailyBest] = useState<DailyEntry | null>(getDailyBest());
  const [currentFillQuestion, setCurrentFillQuestion] = useState<FillQuestion | null>(null);
  const [fillInput, setFillInput] = useState("");
  const [fillResult, setFillResult] = useState<"correct" | "wrong" | null>(null);
  const questionIndexRef = useRef(0);
  const fillIndexRef = useRef(0);
  const shuffledQuestionsRef = useRef<Question[]>([]);
  const shuffledFillRef = useRef<FillQuestion[]>([]);
  const translationInputRef = useRef<HTMLInputElement>(null);
  const fillInputRef = useRef<HTMLInputElement>(null);
  const playerNameRef = useRef("");

  const gameRef = useRef({
    llamaY: GROUND_Y,
    velocityY: 0,
    isJumping: false,
    obstacles: [] as Obstacle[],
    stars: [] as Star[],
    frameCount: 0,
    speed: GAME_SPEED_INITIAL,
    score: 0,
    groundOffset: 0,
    starTimer: 0,
  });

  const jump = useCallback(() => {
    const g = gameRef.current;
    if (!g.isJumping) {
      g.velocityY = JUMP_FORCE;
      g.isJumping = true;
    }
  }, []);

  const startGame = useCallback(() => {
    if (!playerName.trim()) return;
    playerNameRef.current = playerName.trim();
    const g = gameRef.current;
    g.llamaY = GROUND_Y;
    g.velocityY = 0;
    g.isJumping = false;
    g.obstacles = [];
    g.stars = [];
    g.starTimer = 0;
    g.frameCount = 0;
    g.speed = GAME_SPEED_INITIAL;
    g.score = 0;
    g.groundOffset = 0;
    questionIndexRef.current = 0;
    fillIndexRef.current = 0;
    const lamaQ = QUESTIONS.find(q => q.text.includes("Lama"))!;
    const rest = QUESTIONS.filter(q => !q.text.includes("Lama")).sort(() => Math.random() - 0.5);
    shuffledQuestionsRef.current = [lamaQ, ...rest];
    shuffledFillRef.current = [...FILL_QUESTIONS].sort(() => Math.random() - 0.5);
    setScore(0);
    setCurrentQuestion(null);
    setCurrentFillQuestion(null);
    setFillInput("");
    setFillResult(null);
    setQuizPhase("article");
    setTranslationInput("");
    setTranslationResult(null);
    setArticleResult(null);
    setGameState("playing");
  }, [playerName]);

  const triggerQuiz = useCallback(() => {
    const q = shuffledQuestionsRef.current[questionIndexRef.current % shuffledQuestionsRef.current.length];
    questionIndexRef.current++;
    setCurrentQuestion(q);
    setQuizPhase("article");
    setTranslationInput("");
    setTranslationResult(null);
    setArticleResult(null);
    setGameState("quiz");
  }, []);

  const resumeGame = useCallback(() => {
    const g = gameRef.current;
    g.obstacles = g.obstacles.filter(o => o.x > 80);
    g.llamaY = GROUND_Y;
    g.velocityY = 0;
    g.isJumping = false;
    setCurrentQuestion(null);
    setCurrentFillQuestion(null);
    setFillInput("");
    setFillResult(null);
    setQuizPhase("article");
    setTranslationInput("");
    setTranslationResult(null);
    setArticleResult(null);
    setGameState("playing");
  }, []);

  const triggerStarQuiz = useCallback(() => {
    const q = shuffledFillRef.current[fillIndexRef.current % shuffledFillRef.current.length];
    fillIndexRef.current++;
    setCurrentFillQuestion(q);
    setFillInput("");
    setFillResult(null);
    setGameState("starQuiz");
    setTimeout(() => fillInputRef.current?.focus(), 100);
  }, []);

  const handleFillSubmit = useCallback(() => {
    if (!currentFillQuestion || fillResult !== null) return;
    const isCorrect = fillInput.trim().toLowerCase() === currentFillQuestion.answer.toLowerCase();
    setFillResult(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      gameRef.current.score += 1;
      const newScore = gameRef.current.score;
      setScore(newScore);
      if (newScore > parseInt(localStorage.getItem("llama-highscore") || "0")) {
        setHighScore(newScore);
        localStorage.setItem("llama-highscore", String(newScore));
      }
      saveDailyScore(playerNameRef.current, newScore);
      setDailyBest(getDailyBest());
    }
    setTimeout(resumeGame, 1000);
  }, [currentFillQuestion, fillInput, fillResult, resumeGame]);

  const exitGame = useCallback(() => {
    const g = gameRef.current;
    const finalScore = g.score;
    if (finalScore > 0) {
      saveDailyScore(playerNameRef.current, finalScore);
      setDailyBest(getDailyBest());
    }
    if (finalScore > parseInt(localStorage.getItem("llama-highscore") || "0")) {
      setHighScore(finalScore);
      localStorage.setItem("llama-highscore", String(finalScore));
    }
    setCurrentQuestion(null);
    setQuizPhase("article");
    setTranslationInput("");
    setTranslationResult(null);
    setArticleResult(null);
    setGameState("over");
  }, []);

  const handleAnswer = useCallback((index: number) => {
    if (!currentQuestion || quizPhase !== "article" || articleResult !== null) return;
    if (index === currentQuestion.correct) {
      setArticleResult("correct");
      setQuizPhase("translation");
      setTimeout(() => translationInputRef.current?.focus(), 100);
    } else {
      // Wrong article → 0 points, show feedback then continue
      setArticleResult("wrong");
      setTimeout(resumeGame, 1000);
    }
  }, [currentQuestion, quizPhase, articleResult, resumeGame]);

  const handleTranslationSubmit = useCallback(() => {
    if (!currentQuestion || quizPhase !== "translation") return;
    const isCorrect = translationInput.trim().toLowerCase() === currentQuestion.translation.toLowerCase();
    const points = isCorrect ? 2 : 1;
    setTranslationResult(isCorrect ? "correct" : "wrong");
    gameRef.current.score += points;
    const newScore = gameRef.current.score;
    setScore(newScore);
    if (newScore > parseInt(localStorage.getItem("llama-highscore") || "0")) {
      setHighScore(newScore);
      localStorage.setItem("llama-highscore", String(newScore));
    }
    saveDailyScore(playerNameRef.current, newScore);
    setDailyBest(getDailyBest());
    setTimeout(resumeGame, 1000);
  }, [currentQuestion, quizPhase, translationInput, resumeGame]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameState === "starQuiz") {
        if (e.code === "Enter") {
          e.preventDefault();
          handleFillSubmit();
        }
        return;
      }
      if (gameState === "quiz") {
        if (quizPhase === "article") {
          if (e.code === "Digit1" || e.code === "Numpad1") { e.preventDefault(); handleAnswer(0); }
          if (e.code === "Digit2" || e.code === "Numpad2") { e.preventDefault(); handleAnswer(1); }
          if (e.code === "Digit3" || e.code === "Numpad3") { e.preventDefault(); handleAnswer(2); }
        } else if (quizPhase === "translation" && e.code === "Enter") {
          e.preventDefault();
          handleTranslationSubmit();
        }
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
  }, [gameState, quizPhase, jump, startGame, handleAnswer, handleTranslationSubmit, handleFillSubmit]);

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

      // Spawn stars (every ~200 frames, random)
      g.starTimer++;
      if (g.starTimer > 150 + Math.random() * 100) {
        g.starTimer = 0;
        const starY = 80 + Math.random() * 80; // flying height
        g.stars.push({ x: CANVAS_WIDTH, y: starY, collected: false });
      }

      // Move stars
      g.stars = g.stars.filter((s) => {
        s.x -= g.speed * 0.8;
        return s.x > -20;
      });

      // Speed up
      g.speed += GAME_SPEED_INCREMENT;

      // Star collision (only while jumping)
      const llamaBox = { x: 38, y: g.llamaY - 22, w: 30, h: 62 };
      if (g.isJumping) {
        for (const s of g.stars) {
          if (!s.collected &&
            llamaBox.x < s.x + 12 && llamaBox.x + llamaBox.w > s.x - 12 &&
            llamaBox.y < s.y + 12 && llamaBox.y + llamaBox.h > s.y - 12
          ) {
            s.collected = true;
            triggerStarQuiz();
            return;
          }
        }
      }

      // Obstacle collision → trigger quiz
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
  }, [gameState, triggerQuiz, triggerStarQuiz]);

  // Draw idle/game over screen
  useEffect(() => {
    if (gameState === "playing" || gameState === "quiz" || gameState === "starQuiz") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawScene(ctx, { groundOffset: 0, obstacles: [], stars: [], llamaY: GROUND_Y, frameCount: 0, score: 0 });

    ctx.fillStyle = "#2a1a0a";
    ctx.font = "20px 'Press Start 2P', monospace";
    ctx.textAlign = "center";

    if (gameState === "idle") {
      ctx.fillText("LLAMA RUN", CANVAS_WIDTH / 2, 80);
      ctx.font = "10px 'Press Start 2P', monospace";
      ctx.fillText("Zadej jméno a stiskni START", CANVAS_WIDTH / 2, 120);
    } else {
      const t = Math.floor(score / 10);
      const l = Math.floor(t / 10) + 1;
      ctx.fillText("GAME OVER", CANVAS_WIDTH / 2, 80);
      ctx.font = "12px 'Press Start 2P', monospace";
      ctx.fillText(`Skóre: ${score}`, CANVAS_WIDTH / 2, 110);
      ctx.fillText(`Nejlepší: ${highScore}`, CANVAS_WIDTH / 2, 135);
      ctx.font = "10px 'Press Start 2P', monospace";
      ctx.fillText(`🏆 ${t}  ⭐ Level ${l}`, CANVAS_WIDTH / 2, 165);
      ctx.fillText("Stiskni ↑ pro restart", CANVAS_WIDTH / 2, 195);
    }
    ctx.textAlign = "start";
  }, [gameState, score, highScore]);

  const totalTrophies = Math.floor(score / 10);
  const level = Math.floor(totalTrophies / 10) + 1;
  const trophiesInLevel = totalTrophies % 10;

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

        {/* Exit button during play or quiz */}
        {(gameState === "playing" || gameState === "quiz" || gameState === "starQuiz") && (
          <button
            onClick={exitGame}
            className="absolute top-2 right-2 font-game text-xs px-3 py-1 rounded bg-destructive/80 text-destructive-foreground hover:bg-destructive transition-colors z-20"
          >
            Exit
          </button>
        )}

        {/* Name input overlay on idle */}
        {gameState === "idle" && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ paddingTop: "60px" }}>
            <div className="flex flex-col items-center gap-3">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") startGame(); }}
                placeholder="Tvoje jméno..."
                maxLength={20}
                className="font-game text-sm px-4 py-2 rounded-lg border-2 border-border bg-card text-card-foreground focus:border-primary focus:outline-none w-56 text-center"
              />
              <button
                onClick={startGame}
                disabled={!playerName.trim()}
                className="font-game text-xs px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                START
              </button>
            </div>
          </div>
        )}
        {/* Quiz overlay */}
        {gameState === "quiz" && currentQuestion && (
          <div className="absolute inset-0 bg-foreground/70 flex items-center justify-center">
            <div className="bg-card rounded-xl p-6 shadow-2xl text-center max-w-md mx-4 border-2 border-primary">
              <p className="font-game text-sm text-card-foreground mb-4 leading-relaxed">
                {currentQuestion.text}
              </p>

              {/* Phase 1: Article selection */}
              {quizPhase === "article" && (
                <>
                  <div className="flex gap-3 justify-center">
                    {currentQuestion.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        disabled={articleResult !== null}
                        className={`font-game text-sm px-5 py-3 rounded-lg border-2 transition-all ${
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
                  {articleResult === "wrong" && (
                    <p className="font-game text-xs text-destructive mt-4">✗ Špatně! Správně: {currentQuestion.options[currentQuestion.correct]} — 0 bodů</p>
                  )}
                  {!articleResult && (
                    <p className="text-muted-foreground text-xs mt-4">Klávesy 1, 2, 3 pro odpověď</p>
                  )}
                </>
              )}

              {/* Phase 2: Translation input */}
              {quizPhase === "translation" && (
                <>
                  <p className="font-game text-xs text-primary mb-3">✓ Správný člen! Napiš překlad do češtiny:</p>
                  <div className="flex gap-2 justify-center items-center">
                    <input
                      ref={translationInputRef}
                      type="text"
                      value={translationInput}
                      onChange={(e) => setTranslationInput(e.target.value)}
                      disabled={translationResult !== null}
                      placeholder="Překlad..."
                      className="font-game text-sm px-4 py-2 rounded-lg border-2 border-border bg-card text-card-foreground focus:border-primary focus:outline-none w-48"
                    />
                    <button
                      onClick={handleTranslationSubmit}
                      disabled={translationResult !== null}
                      className="font-game text-xs px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                      OK
                    </button>
                  </div>
                  {translationResult === "correct" && (
                    <p className="font-game text-xs mt-3" style={{ color: "hsl(142, 71%, 45%)" }}>✓ Správně! +2 body</p>
                  )}
                  {translationResult === "wrong" && (
                    <p className="font-game text-xs text-destructive mt-3">
                      ✗ Správně: {currentQuestion.translation} — +1 bod
                    </p>
                  )}
                  {!translationResult && (
                    <p className="text-muted-foreground text-xs mt-3">Enter pro potvrzení</p>
                  )}
                </>
              )}
            </div>
          </div>
        )}
        {/* Star Quiz overlay */}
        {gameState === "starQuiz" && currentFillQuestion && (
          <div className="absolute inset-0 bg-foreground/70 flex items-center justify-center">
            <div className="bg-card rounded-xl p-6 shadow-2xl text-center max-w-md mx-4 border-2 border-yellow-500">
              <p className="font-game text-sm text-yellow-500 mb-2">⭐ Doplň slovo!</p>
              <p className="font-game text-sm text-card-foreground mb-2 leading-relaxed">
                {currentFillQuestion.sentence}
              </p>
              <p className="font-game text-xs text-muted-foreground mb-4 italic">
                {currentFillQuestion.translation}
              </p>
              <div className="flex gap-2 justify-center items-center">
                <input
                  ref={fillInputRef}
                  type="text"
                  value={fillInput}
                  onChange={(e) => setFillInput(e.target.value)}
                  disabled={fillResult !== null}
                  placeholder="Doplň..."
                  className="font-game text-sm px-4 py-2 rounded-lg border-2 border-border bg-card text-card-foreground focus:border-yellow-500 focus:outline-none w-48"
                />
                <button
                  onClick={handleFillSubmit}
                  disabled={fillResult !== null}
                  className="font-game text-xs px-4 py-2 rounded-lg bg-yellow-500 text-black hover:opacity-90 transition-opacity"
                >
                  OK
                </button>
              </div>
              {fillResult === "correct" && (
                <p className="font-game text-xs mt-3" style={{ color: "hsl(142, 71%, 45%)" }}>✓ Správně! +1 bod</p>
              )}
              {fillResult === "wrong" && (
                <p className="font-game text-xs text-destructive mt-3">
                  ✗ Správně: {currentFillQuestion.answer} — 0 bodů
                </p>
              )}
              {!fillResult && (
                <p className="text-muted-foreground text-xs mt-3">Enter pro potvrzení</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-8 font-game text-sm">
          <span className="text-muted-foreground">
            Skóre: <span className="text-foreground">{score}</span>
          </span>
          <span className="text-muted-foreground">
            Nejlepší: <span className="text-primary">{highScore}</span>
          </span>
        </div>
        <div className="flex gap-6 font-game text-xs items-center">
          <span className="text-muted-foreground">
            🏆 {"🏆".repeat(trophiesInLevel)}{"◦".repeat(10 - trophiesInLevel)} <span className="text-foreground">{totalTrophies}</span>
          </span>
          <span className="text-muted-foreground">
            ⭐ Level: <span className="text-primary">{level}</span>
          </span>
        </div>
        {dailyBest && (
          <div className="font-game text-xs text-muted-foreground">
            🏆 Dnes nejlepší: <span className="text-primary">{dailyBest.name}</span> — <span className="text-foreground">{dailyBest.score} b.</span>
          </div>
        )}
      </div>

      <button
        onClick={() => {
          if (gameState === "playing") jump();
          else if (gameState !== "quiz" && gameState !== "starQuiz") startGame();
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
