import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Copy, Check, ArrowLeft, Gamepad2 } from "lucide-react";
import { QUESTIONS, FILL_QUESTIONS, filterByProfession, filterByLevel, isTranslationCorrect, type Question, type FillQuestion, type Profession, type Level } from "./vocabularyData";
import { useProfessionFilter } from "@/hooks/useProfessionFilter";
import ProfessionFilter from "@/components/ProfessionFilter";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations, type Lang } from "@/i18n/translations";
import { drawStar, drawSombrero, type Star, type Sombrero } from "./collectibles";

function getTranslation(q: Question | FillQuestion, lang: Lang): string {
  if (lang === "ko") return q.translationKo;
  if (lang === "en") return q.translationEn ?? q.translation;
  if (lang === "pl") return q.translationPl ?? q.translation;
  if (lang === "uk") return q.translationUk ?? q.translationEn ?? q.translation;
  if (lang === "sk") return q.translationSk ?? q.translation;
  return q.translation;
}

const PROF_LABEL_KEYS: Record<Profession, keyof typeof translations.cs> = {
  obecné: "profLabelObecne",
  automechanik: "profLabelAutomechanik",
  elektrikář: "profLabelElektrikar",
  gastro: "profLabelGastro",
  instalatér: "profLabelInstalater",
  kadeřník: "profLabelKadernik",
  kancelář: "profLabelKancelar",
  pokladní: "profLabelPokladni",
  systemy_pro_haseni: "profLabelHaseni",
  sestřička: "profLabelSestricka",
  truhlář: "profLabelTruhlar",
  učitel: "profLabelUcitel",
  uklízečka: "profLabelUklizecka",
  zahradník: "profLabelZahradnik",
  zedník: "profLabelZednik",
};

function getGermanWordFromText(text: string): string {
  const m = text.match(/má\s+(.+?)\?/);
  return m ? m[1] : text;
}

const CANVAS_WIDTH = 450;
const CANVAS_HEIGHT = 800;
const GROUND_Y = 640;
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

interface Wolf {
  x: number;
  alive: boolean;
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


const drawWolf = (ctx: CanvasRenderingContext2D, x: number, frame: number) => {
  const y = GROUND_Y;
  const legOffset = Math.sin(frame * 0.4) * 3;
  ctx.save();
  // Flip horizontally so wolf faces left (toward llama)
  ctx.translate(x + 26, 0);
  ctx.scale(-1, 1);
  const ox = -26; // offset after flip
  // Body
  ctx.fillStyle = "#555";
  ctx.fillRect(ox + 4, y + 8, 30, 16);
  // Head
  ctx.fillStyle = "#666";
  ctx.fillRect(ox + 30, y + 2, 14, 14);
  // Ears
  ctx.fillStyle = "#444";
  ctx.fillRect(ox + 36, y - 6, 4, 8);
  ctx.fillRect(ox + 42, y - 4, 4, 6);
  // Snout
  ctx.fillStyle = "#777";
  ctx.fillRect(ox + 44, y + 8, 8, 6);
  // Eye
  ctx.fillStyle = "#ff3333";
  ctx.fillRect(ox + 38, y + 5, 3, 3);
  // Legs
  ctx.fillStyle = "#444";
  ctx.fillRect(ox + 8, y + 22, 5, 10 + legOffset);
  ctx.fillRect(ox + 18, y + 22, 5, 10 - legOffset);
  ctx.fillRect(ox + 24, y + 22, 5, 10 + legOffset);
  // Tail
  ctx.fillStyle = "#555";
  ctx.fillRect(ox - 4, y + 6, 10, 4);
  ctx.fillRect(ox - 8, y + 2, 6, 6);
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

const drawScene = (ctx: CanvasRenderingContext2D, g: { groundOffset: number; obstacles: Obstacle[]; stars: Star[]; sombreros: Sombrero[]; wolves: Wolf[]; llamaY: number; frameCount: number; score: number }) => {
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

  // Sombreros
  for (const s of g.sombreros) {
    if (!s.collected) {
      drawSombrero(ctx, s.x, s.y, g.frameCount);
    }
  }

  // Wolves
  for (const w of g.wolves) {
    if (w.alive) {
      drawWolf(ctx, w.x, g.frameCount);
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

const sparklePositions = [
  { angle: 0, delay: "0s" },
  { angle: 45, delay: "0.15s" },
  { angle: 90, delay: "0.3s" },
  { angle: 135, delay: "0.45s" },
  { angle: 180, delay: "0.6s" },
  { angle: 225, delay: "0.75s" },
  { angle: 270, delay: "0.9s" },
  { angle: 315, delay: "1.05s" },
];

const ShareButtons = ({ score, level }: { score: number; level: number }) => {
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();
  const shareText = t("shareLlamaRun", { score: String(score), level: String(level) });

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-share-bg rounded-2xl shadow-lg p-6 w-full max-w-xs flex flex-col items-center gap-3 animate-fade-in relative overflow-hidden">
      {/* Section-wide sparkles */}
      {Array.from({ length: 20 }).map((_, i) => {
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = (Math.random() * 2).toFixed(2);
        const size = Math.random() > 0.5 ? "text-sm" : "text-xs";
        return (
          <span
            key={`bg-${i}`}
            className={`absolute ${size} pointer-events-none`}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              animation: `sparkle-float 2s ease-in-out ${delay}s infinite`,
            }}
          >
            ✨
          </span>
        );
      })}
      <span className="relative z-10 font-game text-sm text-foreground text-center">{t("shareBoast")}</span>
      <div className="relative">
        {/* Button sparkles */}
        {sparklePositions.map((sp, i) => {
          const rad = (sp.angle * Math.PI) / 180;
          const x = Math.cos(rad) * 38;
          const y = Math.sin(rad) * 38;
          return (
            <span
              key={i}
              className="absolute left-1/2 top-1/2 text-xs pointer-events-none"
              style={{
                ["--sp-x" as string]: `${x}px`,
                ["--sp-y" as string]: `${y}px`,
                animation: `sparkle-burst 1.6s ease-in-out ${sp.delay} infinite`,
              }}
            >
              ✨
            </span>
          );
        })}
        <button
          onClick={handleCopy}
          className="relative z-10 flex items-center gap-2 font-game text-xs px-5 py-3 rounded-xl bg-primary text-primary-foreground hover:scale-105 transition-transform shadow-md"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? t("copied") : t("copy")}
        </button>
      </div>
    </div>
  );
};

interface DailyEntry {
  name: string;
  score: number;
  date: string;
}

const getTodayStr = () => new Date().toISOString().slice(0, 10);

const getDailyPlayers = (): string[] => {
  const data = JSON.parse(localStorage.getItem("llama-daily-players") || "{}");
  const today = getTodayStr();
  if (data.date !== today) return [];
  return data.players || [];
};

const addDailyPlayer = (name: string) => {
  const today = getTodayStr();
  const data = JSON.parse(localStorage.getItem("llama-daily-players") || "{}");
  let players: string[] = data.date === today ? (data.players || []) : [];
  const normalized = name.trim().toLowerCase();
  if (!players.includes(normalized)) {
    players.push(normalized);
  }
  localStorage.setItem("llama-daily-players", JSON.stringify({ date: today, players }));
  return players.length;
};

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
  const todayEntries = entries.filter(e => e.date === today);
  todayEntries.push({ name, score, date: today });
  localStorage.setItem("llama-daily", JSON.stringify(todayEntries));
};

interface LeaderboardEntry {
  name: string;
  score: number;
}

const fetchLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  const { data, error } = await supabase
    .from("leaderboard")
    .select("name, score")
    .order("score", { ascending: false })
    .limit(10);
  if (error) {
    console.error("Leaderboard fetch error:", error);
    return [];
  }
  return data || [];
};

const saveToLeaderboardDB = async (name: string, score: number) => {
  await supabase.from("leaderboard").insert({ name, score });
};

const isMobileDevice = () => window.innerWidth < 768;

interface LlamaGameProps {
  onGameComplete?: (score: number) => void;
  challengeMode?: boolean;
  timeLimitSeconds?: number;
  levelOverride?: Level;
}

const LlamaGame = ({ onGameComplete, challengeMode = false, timeLimitSeconds, levelOverride }: LlamaGameProps) => {
  const { t, lang } = useLanguage();
  const profFilter = useProfessionFilter();
  const [inLobby, setInLobby] = useState(!challengeMode);
  const [nameEntry, setNameEntry] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const filteredQuestions = useMemo(() => {
    if (levelOverride) return filterByLevel(QUESTIONS, levelOverride);
    const result = filterByProfession(QUESTIONS, profFilter.selected);
    return result.length > 0 ? result : QUESTIONS.filter(q => q.profession === "obecné");
  }, [profFilter.selected, levelOverride]);
  const filteredFill = useMemo(() => {
    if (levelOverride) return filterByLevel(FILL_QUESTIONS, levelOverride);
    const result = filterByProfession(FILL_QUESTIONS, profFilter.selected);
    return result.length > 0 ? result : FILL_QUESTIONS.filter(q => q.profession === "obecné");
  }, [profFilter.selected, levelOverride]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
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
  const [dailyPlayerCount, setDailyPlayerCount] = useState(() => getDailyPlayers().length);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const questionIndexRef = useRef(0);
  const fillIndexRef = useRef(0);
  const shuffledQuestionsRef = useRef<Question[]>([]);
  const shuffledFillRef = useRef<FillQuestion[]>([]);
  const translationInputRef = useRef<HTMLInputElement>(null);
  const fillInputRef = useRef<HTMLInputElement>(null);
  const playerNameRef = useRef("");

  // Challenge mode refs — kept stable across re-renders for use inside game loop
  const challengeModeRef = useRef(challengeMode);
  const timeLimitRef = useRef(timeLimitSeconds);
  const onGameCompleteRef = useRef(onGameComplete);
  const challengeStartTimeRef = useRef<number | null>(null);
  const finalScoreRef = useRef(0);
  const completionCalledRef = useRef(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(
    challengeMode && timeLimitSeconds ? timeLimitSeconds : null
  );

  useEffect(() => { challengeModeRef.current = challengeMode; }, [challengeMode]);
  useEffect(() => { timeLimitRef.current = timeLimitSeconds; }, [timeLimitSeconds]);
  useEffect(() => { onGameCompleteRef.current = onGameComplete; }, [onGameComplete]);

  const gameRef = useRef({
    llamaY: GROUND_Y,
    velocityY: 0,
    isJumping: false,
    obstacles: [] as Obstacle[],
    stars: [] as Star[],
    sombreros: [] as Sombrero[],
    wolves: [] as Wolf[],
    frameCount: 0,
    speed: GAME_SPEED_INITIAL,
    score: 0,
    groundOffset: 0,
    starTimer: 0,
    sombreroTimer: 0,
    wolfTimer: 0,
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
    g.sombreros = [];
    g.wolves = [];
    g.starTimer = 0;
    g.sombreroTimer = 0;
    g.wolfTimer = 0;
    g.frameCount = 0;
    g.speed = GAME_SPEED_INITIAL;
    g.score = 0;
    g.groundOffset = 0;
    questionIndexRef.current = 0;
    fillIndexRef.current = 0;
    const lamaQ = filteredQuestions.find(q => q.text.includes("Lama"));
    const rest = filteredQuestions.filter(q => !q.text.includes("Lama")).sort(() => Math.random() - 0.5);
    shuffledQuestionsRef.current = lamaQ ? [lamaQ, ...rest] : rest;
    shuffledFillRef.current = [...filteredFill].sort(() => Math.random() - 0.5);
    setScore(0);
    setCurrentQuestion(null);
    setCurrentFillQuestion(null);
    setFillInput("");
    setFillResult(null);
    setQuizPhase("article");
    setTranslationInput("");
    setTranslationResult(null);
    setArticleResult(null);
    const count = addDailyPlayer(playerName.trim());
    setDailyPlayerCount(count);
    setGameState("playing");
  }, [playerName, filteredQuestions, filteredFill]);

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
    const isCorrect = isTranslationCorrect(fillInput, currentFillQuestion.answer);
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

  const exitGame = useCallback(async () => {
    const g = gameRef.current;
    const finalScore = g.score;
    if (finalScore > 0) {
      saveDailyScore(playerNameRef.current, finalScore);
      setDailyBest(getDailyBest());
      await saveToLeaderboardDB(playerNameRef.current, finalScore);
      const updated = await fetchLeaderboard();
      setLeaderboard(updated);
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
    const isCorrect = isTranslationCorrect(translationInput, getTranslation(currentQuestion, lang));
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

  // Load global leaderboard on mount
  useEffect(() => {
    fetchLeaderboard().then(setLeaderboard);
  }, []);

  // Fullscreen mode management
  useEffect(() => {
    if (!inLobby && isMobileDevice()) {
      setIsFullscreen(true);
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      document.body.style.touchAction = 'none';
      document.body.style.overscrollBehavior = 'none';
    } else {
      setIsFullscreen(false);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.touchAction = '';
      document.body.style.overscrollBehavior = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.touchAction = '';
      document.body.style.overscrollBehavior = '';
    };
  }, [inLobby]);

  // Prevent iOS gestures (pinch zoom, double tap)
  useEffect(() => {
    if (!isFullscreen) return;
    const preventGesture = (e: Event) => e.preventDefault();
    const preventDblClick = (e: Event) => e.preventDefault();
    document.addEventListener('gesturestart', preventGesture, { passive: false });
    document.addEventListener('gesturechange', preventGesture, { passive: false });
    document.addEventListener('gestureend', preventGesture, { passive: false });
    document.addEventListener('dblclick', preventDblClick, { passive: false });
    return () => {
      document.removeEventListener('gesturestart', preventGesture);
      document.removeEventListener('gesturechange', preventGesture);
      document.removeEventListener('gestureend', preventGesture);
      document.removeEventListener('dblclick', preventDblClick);
    };
  }, [isFullscreen]);

  // Responsive scaling - fit within viewport
  useEffect(() => {
    const updateScale = () => {
      const container = containerRef.current;
      if (!container) return;

      if (isFullscreen) {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        // Reserve space for jump button (64px) and score bar (40px)
        const reservedHeight = 110;
        const availW = vw - 8;
        const availH = vh - reservedHeight;
        const scaleByWidth = availW / CANVAS_WIDTH;
        const scaleByHeight = availH / CANVAS_HEIGHT;
        setScale(Math.min(scaleByWidth, scaleByHeight));
      } else {
        const parentWidth = container.parentElement?.clientWidth || window.innerWidth;
        const maxWidth = Math.min(parentWidth - 16, CANVAS_WIDTH);
        const scaleByWidth = maxWidth / CANVAS_WIDTH;
        const navHeight = document.querySelector('nav')?.getBoundingClientRect().height || 0;
        const availableHeight = window.innerHeight - navHeight - 140;
        const scaleByHeight = Math.max(0.3, availableHeight / CANVAS_HEIGHT);
        setScale(Math.min(scaleByWidth, scaleByHeight));
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [isFullscreen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameState === "starQuiz") {
        if (e.code === "Enter") {
          e.preventDefault();
          fillInputRef.current?.blur();
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
          translationInputRef.current?.blur();
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
        const starY = GROUND_Y - 50 - Math.random() * 80; // between GROUND_Y-50 and GROUND_Y-130
        g.stars.push({ x: CANVAS_WIDTH, y: starY, collected: false });
      }

      // Move stars
      g.stars = g.stars.filter((s) => {
        s.x -= g.speed * 0.8;
        return s.x > -20;
      });

      // Spawn sombreros (every ~250 frames)
      g.sombreroTimer++;
      if (g.sombreroTimer > 200 + Math.random() * 150) {
        g.sombreroTimer = 0;
        const sy = GROUND_Y - 20 - Math.random() * 60;
        g.sombreros.push({ x: CANVAS_WIDTH, y: sy, collected: false });
      }

      // Move sombreros
      g.sombreros = g.sombreros.filter((s) => {
        s.x -= g.speed;
        return s.x > -30;
      });

      // Spawn wolves (every ~30 seconds = ~1800 frames)
      g.wolfTimer++;
      if (g.wolfTimer > 1800) {
        g.wolfTimer = 0;
        g.wolves.push({ x: CANVAS_WIDTH, alive: true });
      }

      // Move wolves
      g.wolves = g.wolves.filter((w) => {
        w.x -= g.speed * 0.7;
        return w.x > -60;
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

      // Sombrero collision (collect for +2 points)
      for (const sb of g.sombreros) {
        if (!sb.collected &&
          llamaBox.x < sb.x + 16 && llamaBox.x + llamaBox.w > sb.x - 16 &&
          llamaBox.y < sb.y + 13 && llamaBox.y + llamaBox.h > sb.y - 6
        ) {
          sb.collected = true;
          g.score += 2;
          setScore(g.score);
          if (g.score > parseInt(localStorage.getItem("llama-highscore") || "0")) {
            setHighScore(g.score);
            localStorage.setItem("llama-highscore", String(g.score));
          }
          saveDailyScore(playerNameRef.current, g.score);
          setDailyBest(getDailyBest());
        }
      }

      // Time limit check (challenge mode)
      if (timeLimitRef.current && challengeStartTimeRef.current && !completionCalledRef.current) {
        const elapsed = (Date.now() - challengeStartTimeRef.current) / 1000;
        if (elapsed >= timeLimitRef.current) {
          completionCalledRef.current = true;
          finalScoreRef.current = g.score;
          onGameCompleteRef.current?.(g.score);
          setGameState("over");
          return;
        }
      }

      // Wolf collision - llama must jump on top to kill, otherwise game over
      for (const w of g.wolves) {
        if (!w.alive) continue;
        const wolfBox = { x: w.x, y: GROUND_Y + 2, w: 52, h: 32 };
        const collides =
          llamaBox.x < wolfBox.x + wolfBox.w &&
          llamaBox.x + llamaBox.w > wolfBox.x &&
          llamaBox.y + llamaBox.h > wolfBox.y &&
          llamaBox.y < wolfBox.y + wolfBox.h;
        if (collides) {
          // Landed on top = kill wolf
          if (llamaBox.y + llamaBox.h < wolfBox.y + 16 && g.velocityY > 0) {
            w.alive = false;
            g.score += 3;
            setScore(g.score);
            g.velocityY = JUMP_FORCE * 0.6; // bounce off
            if (g.score > parseInt(localStorage.getItem("llama-highscore") || "0")) {
              setHighScore(g.score);
              localStorage.setItem("llama-highscore", String(g.score));
            }
            saveDailyScore(playerNameRef.current, g.score);
            setDailyBest(getDailyBest());
          } else {
            // Wolf hit llama from side
            if (challengeModeRef.current) {
              // Challenge: don't zero score, just complete the game
              if (!completionCalledRef.current) {
                completionCalledRef.current = true;
                finalScoreRef.current = g.score;
                onGameCompleteRef.current?.(g.score);
              }
              setGameState("over");
              return;
            }
            g.score = 0;
            setScore(0);
            fetchLeaderboard().then(setLeaderboard);
            setGameState("over");
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

  // Draw idle/lobby scene (static background with llama)
  useEffect(() => {
    if (gameState === "playing" || gameState === "quiz" || gameState === "starQuiz") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawScene(ctx, { groundOffset: 0, obstacles: [], stars: [], sombreros: [], wolves: [], llamaY: GROUND_Y, frameCount: 0, score: 0 });
    ctx.textAlign = "start";
  }, [gameState, score, highScore, inLobby, nameEntry]);

  const totalTrophies = Math.floor(score / 10);
  const level = Math.floor(totalTrophies / 10) + 1;
  const trophiesInLevel = totalTrophies % 10;

  const goToNameEntry = useCallback(() => {
    setInLobby(false);
    setNameEntry(true);
  }, []);

  const enterGame = useCallback(() => {
    if (!playerName.trim()) return;
    setNameEntry(false);
    playerNameRef.current = playerName.trim();
    const g = gameRef.current;
    g.llamaY = GROUND_Y;
    g.velocityY = 0;
    g.isJumping = false;
    g.obstacles = [];
    g.stars = [];
    g.sombreros = [];
    g.wolves = [];
    g.starTimer = 0;
    g.sombreroTimer = 0;
    g.wolfTimer = 0;
    g.frameCount = 0;
    g.speed = GAME_SPEED_INITIAL;
    g.score = 0;
    g.groundOffset = 0;
    questionIndexRef.current = 0;
    fillIndexRef.current = 0;
    const lamaQ = filteredQuestions.find(q => q.text.includes("Lama"));
    const rest = filteredQuestions.filter(q => !q.text.includes("Lama")).sort(() => Math.random() - 0.5);
    shuffledQuestionsRef.current = lamaQ ? [lamaQ, ...rest] : rest;
    shuffledFillRef.current = [...filteredFill].sort(() => Math.random() - 0.5);
    setScore(0);
    setCurrentQuestion(null);
    setCurrentFillQuestion(null);
    setFillInput("");
    setFillResult(null);
    setQuizPhase("article");
    setTranslationInput("");
    setTranslationResult(null);
    setArticleResult(null);
    const count = addDailyPlayer(playerName.trim());
    setDailyPlayerCount(count);
    setGameState("playing");
  }, [playerName, filteredQuestions, filteredFill]);

  const goToLobby = useCallback(() => {
    // Preserve playerName so it's pre-filled after profession change
    setInLobby(true);
    setNameEntry(false);
    setScore(0);
    setGameState("idle");
  }, []);

  const newPlayer = useCallback(() => {
    setPlayerName("");
    localStorage.removeItem("llama-player-name");
    setInLobby(true);
    setNameEntry(false);
    setScore(0);
    setGameState("idle");
  }, []);

  // Challenge: auto-start with all questions, no lobby or name entry
  useEffect(() => {
    if (!challengeMode) return;
    playerNameRef.current = "GermanLlama";
    const g = gameRef.current;
    g.llamaY = GROUND_Y;
    g.velocityY = 0;
    g.isJumping = false;
    g.obstacles = [];
    g.stars = [];
    g.sombreros = [];
    g.wolves = [];
    g.starTimer = 0;
    g.sombreroTimer = 0;
    g.wolfTimer = 0;
    g.frameCount = 0;
    g.speed = GAME_SPEED_INITIAL;
    g.score = 0;
    g.groundOffset = 0;
    questionIndexRef.current = 0;
    fillIndexRef.current = 0;
    const pool = levelOverride ? QUESTIONS.filter(q => q.level === levelOverride) : QUESTIONS;
    const lamaQ = pool.find(q => q.text.includes("Lama"));
    const rest = pool.filter(q => !q.text.includes("Lama")).sort(() => Math.random() - 0.5);
    shuffledQuestionsRef.current = lamaQ ? [lamaQ, ...rest] : rest;
    const fillPool = levelOverride ? FILL_QUESTIONS.filter(q => q.level === levelOverride) : FILL_QUESTIONS;
    shuffledFillRef.current = [...fillPool].sort(() => Math.random() - 0.5);
    setScore(0);
    challengeStartTimeRef.current = Date.now();
    setGameState("playing");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Challenge: countdown timer display
  useEffect(() => {
    if (!challengeMode || !timeLimitSeconds) return;
    const interval = setInterval(() => {
      if (!challengeStartTimeRef.current) return;
      const elapsed = (Date.now() - challengeStartTimeRef.current) / 1000;
      setRemainingSeconds(Math.max(0, Math.ceil(timeLimitSeconds - elapsed)));
    }, 500);
    return () => clearInterval(interval);
  }, [challengeMode, timeLimitSeconds]);



  const gameContent = (
    <div className={`flex flex-col items-center w-full ${isFullscreen ? 'gap-1' : 'gap-2 sm:gap-6'} ${isFullscreen ? '' : 'max-w-[800px] mx-auto'}`}>

      {inLobby ? (
        /* === LOBBY — Phase 1: profession selection === */
        <div className="flex flex-col items-center gap-4">
          <ProfessionFilter selected={profFilter.selected} onToggle={profFilter.toggle} onSelectAll={profFilter.selectAll} isAllSelected={profFilter.isAllSelected} />
          <button
            onClick={goToNameEntry}
            className="font-game text-sm sm:text-base px-10 sm:px-14 py-3 sm:py-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all shadow-lg flex items-center gap-2"
          >
            <Gamepad2 className="w-5 h-5" />
            {t("startGameBtn")}
          </button>
        </div>
      ) : (
      <>
      <div className="relative">
        <div
          ref={containerRef}
          className="relative rounded-lg sm:rounded-xl overflow-hidden shadow-lg border-2 border-border"
          style={{
            width: CANVAS_WIDTH * scale,
            height: CANVAS_HEIGHT * scale,
          }}
        >
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="block origin-top-left"
            style={{
              transform: `scale(${scale})`,
              width: CANVAS_WIDTH,
              height: CANVAS_HEIGHT,
            }}
          />

        {/* Exit button during play or quiz */}
        {/* Phase 2: Name entry overlay */}
        {nameEntry && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-foreground/40 backdrop-blur-[2px]">
            <div className="bg-card/95 rounded-2xl p-6 sm:p-8 shadow-2xl border-2 border-primary flex flex-col items-center gap-4 max-w-[90%] sm:max-w-xs">
              <p className="font-game text-sm sm:text-base text-foreground">{t("enterName")}</p>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && playerName.trim()) { (e.target as HTMLInputElement).blur(); enterGame(); } }}
                placeholder={t("namePlaceholder")}
                maxLength={20}
                autoFocus
                className="font-game text-xs sm:text-sm px-4 py-2.5 rounded-xl border-2 border-primary/40 bg-card text-card-foreground focus:border-primary focus:outline-none w-full text-center"
              />
              <button
                onClick={enterGame}
                disabled={!playerName.trim()}
                className="font-game text-sm px-8 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all shadow-md disabled:opacity-50"
              >
                START
              </button>
            </div>
          </div>
        )}

        {/* Exit button during play or quiz */}
        {!inLobby && !nameEntry && (gameState === "playing" || gameState === "quiz" || gameState === "starQuiz") && (
          <button
            onClick={exitGame}
            className="absolute top-2 right-2 font-game text-xs px-3 py-1 rounded bg-destructive/80 text-destructive-foreground hover:bg-destructive transition-colors z-20"
          >
            Exit
          </button>
        )}
        {/* Quiz overlay */}
        {gameState === "quiz" && currentQuestion && (
          <div className="absolute inset-0 bg-foreground/70 flex items-center justify-center">
            <div className="bg-card rounded-xl p-3 sm:p-6 shadow-2xl text-center max-w-[95%] sm:max-w-md mx-2 sm:mx-4 border-2 border-primary">
              <p className="font-game text-xs sm:text-sm text-card-foreground mb-3 sm:mb-4 leading-relaxed">
                {t("questionArticle").replace("{word}", getGermanWordFromText(currentQuestion.text))}
              </p>
              <span className="font-game text-[7px] text-muted-foreground/60 block mb-2">[{t(PROF_LABEL_KEYS[currentQuestion.profession])}]</span>

              {/* Phase 1: Article selection */}
              {quizPhase === "article" && (
                <>
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
                  {articleResult === "wrong" && (
                    <p className="font-game text-xs text-destructive mt-3 sm:mt-4">{t("wrongArticle", { article: currentQuestion.options[currentQuestion.correct] })}</p>
                  )}
                  {!articleResult && (
                    <p className="text-muted-foreground text-xs mt-3 sm:mt-4 hidden sm:block">{t("keys123")}</p>
                  )}
                </>
              )}

              {/* Phase 2: Translation input */}
              {quizPhase === "translation" && (
                <>
                  <p className="font-game text-xs text-green-500 mb-1">{t("correctArticle")}</p>
                  <p className="font-game text-[10px] text-muted-foreground mb-2 sm:mb-3">{t("useDiacritics")}</p>
                  <div className="flex gap-2 justify-center items-center">
                    <input
                      ref={translationInputRef}
                      type="text"
                      value={translationInput}
                      onChange={(e) => setTranslationInput(e.target.value)}
                      disabled={translationResult !== null}
                      placeholder={t("translationPlaceholder")}
                      className="font-game text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg border-2 border-border bg-card text-card-foreground focus:border-primary focus:outline-none w-32 sm:w-48"
                    />
                    <button
                      onClick={() => { translationInputRef.current?.blur(); handleTranslationSubmit(); }}
                      disabled={translationResult !== null}
                      className="font-game text-xs px-3 sm:px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                      OK
                    </button>
                  </div>
                  {translationResult === "correct" && (
                    <p className="font-game text-xs mt-3" style={{ color: "hsl(142, 71%, 45%)" }}>
                      {t("correct2", { word: getTranslation(currentQuestion, lang) })}
                    </p>
                  )}
                  {translationResult === "wrong" && (
                    <p className="font-game text-xs text-destructive mt-3">
                      {t("wrong1", { word: getTranslation(currentQuestion, lang) })}
                    </p>
                  )}
                  {!translationResult && (
                    <p className="text-muted-foreground text-xs mt-3 hidden sm:block">{t("enterConfirm")}</p>
                  )}
                </>
              )}
            </div>
          </div>
        )}
        {/* Star Quiz overlay */}
        {gameState === "starQuiz" && currentFillQuestion && (
          <div className="absolute inset-0 bg-foreground/70 flex items-center justify-center">
            <div className="bg-card rounded-xl p-3 sm:p-6 shadow-2xl text-center max-w-[95%] sm:max-w-md mx-2 sm:mx-4 border-2 border-accent">
              <p className="font-game text-xs sm:text-sm text-accent mb-2">{t("fillWord")}</p>
              <p className="font-game text-xs sm:text-sm text-card-foreground mb-2 leading-relaxed">
                {currentFillQuestion.sentence}
              </p>
              <span className="font-game text-[7px] text-muted-foreground/60 block mb-1">[{t(PROF_LABEL_KEYS[currentFillQuestion.profession])}]</span>
              <p className="font-game text-xs text-muted-foreground mb-3 sm:mb-4 italic">
                {getTranslation(currentFillQuestion, lang)}
              </p>
              <div className="flex gap-2 justify-center items-center">
                <input
                  ref={fillInputRef}
                  type="text"
                  value={fillInput}
                  onChange={(e) => setFillInput(e.target.value)}
                  disabled={fillResult !== null}
                  placeholder={t("fillPlaceholder")}
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
                  {t("correct1", { word: currentFillQuestion.answer })}
                </p>
              )}
              {fillResult === "wrong" && (
                <p className="font-game text-xs text-destructive mt-3">
                  {t("wrong0", { word: currentFillQuestion.answer })}
                </p>
              )}
              {!fillResult && (
                <p className="text-muted-foreground text-xs mt-3 hidden sm:block">{t("enterConfirm")}</p>
              )}
            </div>
          </div>
        )}
        {/* Game Over overlay */}
        {gameState === "over" && challengeMode && (
          <div className="absolute inset-0 flex items-center justify-center z-30 animate-fade-in">
            <div className="absolute inset-0 bg-foreground/60" />
            <div className="relative z-10 bg-card/95 rounded-2xl p-6 text-center border-2 border-primary mx-4">
              <p className="font-game text-sm text-foreground mb-2">{t("gameOverText")}</p>
              <p className="font-game text-xs text-muted-foreground">⏳ {t("challengeNextGame")} ...</p>
            </div>
          </div>
        )}
        {gameState === "over" && !challengeMode && (
          <div className="absolute inset-0 flex items-center justify-center z-30 animate-fade-in">
            <div className="absolute inset-0 bg-foreground/60 animate-game-over-flash" />
            <div className="relative z-10 flex flex-col items-center gap-3 sm:gap-4 bg-card/95 rounded-2xl p-4 sm:p-8 shadow-2xl border-2 border-primary mx-4 animate-scale-in max-w-[90%]">
              <p className="font-game text-lg sm:text-2xl text-destructive">{t("gameOverText")}</p>
              <div className="flex flex-col items-center gap-1">
                <p className="font-game text-sm sm:text-base text-foreground">{t("scoreLabel")}: <span className="text-primary">{score}</span></p>
                <p className="font-game text-xs text-muted-foreground">{t("bestLabel")}: <span className="text-primary">{highScore}</span></p>
                <p className="font-game text-xs text-muted-foreground">🏆 {totalTrophies}  ⭐ Level {level}</p>
              </div>
              <button
                onClick={() => { startGame(); }}
                className="font-game text-sm sm:text-base px-8 sm:px-12 py-3 sm:py-4 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all animate-retry-pulse whitespace-nowrap"
                style={{
                  background: 'linear-gradient(135deg, hsl(168, 72%, 40%), hsl(168, 72%, 30%))',
                  color: 'hsl(0, 0%, 100%)',
                  boxShadow: '0 4px 20px hsla(168, 72%, 40%, 0.4), 0 0 30px hsla(168, 72%, 40%, 0.2)',
                }}
              >
                {t("tryAgainBtn")}
              </button>
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={goToLobby}
                  className="font-game text-[10px] sm:text-xs px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl border-2 border-border bg-card/80 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:scale-105 active:scale-95 transition-all whitespace-nowrap flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  {t("changeFieldBtn")}
                </button>
                <button
                  onClick={newPlayer}
                  className="font-game text-[10px] sm:text-xs px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl border-2 border-destructive/50 bg-card/80 text-destructive hover:text-destructive hover:border-destructive hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                >
                  {t("newPlayer")}
                </button>
              </div>
            </div>
          </div>
        )}
        </div>{/* close container */}
      </div>{/* close relative */}

      {!inLobby && gameState !== "over" && (
        <div className="flex flex-col items-center gap-2">
          {challengeMode && remainingSeconds !== null && (
            <div className="font-game text-sm text-foreground">
              {t("challengeTimeLeft", { s: String(remainingSeconds) })}
            </div>
          )}
          <div className="flex gap-4 sm:gap-8 font-game text-xs sm:text-sm">
            <span className="text-muted-foreground">
              {t("scoreLabel")}: <span className="text-foreground">{score}</span>
            </span>
            {!challengeMode && (
              <span className="text-muted-foreground">
                {t("bestLabel")}: <span className="text-primary">{highScore}</span>
              </span>
            )}
          </div>
          <div className="flex gap-4 sm:gap-6 font-game text-xs items-center">
            <span className="text-muted-foreground">
              🏆 {"🏆".repeat(trophiesInLevel)}{"◦".repeat(10 - trophiesInLevel)} <span className="text-foreground">{totalTrophies}</span>
            </span>
            <span className="text-muted-foreground">
              ⭐ Level: <span className="text-primary">{level}</span>
            </span>
          </div>
          {dailyBest && (
            <div className="font-game text-xs text-muted-foreground">
              {t("todayBest")}: <span className="text-primary">{dailyBest.name}</span> — <span className="text-foreground">{dailyBest.score} b.</span>
            </div>
          )}
          <div className="font-game text-xs text-muted-foreground">
            {t("playersToday")}: <span className="text-foreground">{dailyPlayerCount}</span>
          </div>
        </div>
      )}

      {!inLobby && gameState === "over" && score > 0 && !challengeMode && (
        <ShareButtons score={score} level={level} />
      )}

      {!inLobby && (
        <button
          onClick={() => {
            if (gameState === "playing") jump();
            else if (gameState !== "quiz" && gameState !== "starQuiz") startGame();
          }}
          className="bg-primary text-primary-foreground font-game text-sm w-full max-w-xs py-5 rounded-xl hover:opacity-90 transition-opacity md:hidden active:scale-95 touch-manipulation shadow-md"
        >
          {t("jumpBtn")}
        </button>
      )}

      <p className="text-muted-foreground text-xs sm:text-sm hidden sm:block">
        {t("useKeys")} <kbd className="bg-muted px-2 py-1 rounded text-xs font-game">↑</kbd> {t("orKey")}{" "}
        <kbd className="bg-muted px-2 py-1 rounded text-xs font-game">SPACE</kbd> {t("forJump")}
      </p>

      {!challengeMode && <div className="w-full max-w-xs mt-2">
          <h3 className="font-game text-xs text-center text-primary mb-2">{t("globalTop10")}</h3>
          <table className="w-full text-xs font-game">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-1 px-2 text-muted-foreground">#</th>
                <th className="text-left py-1 px-2 text-muted-foreground">{t("nameCol")}</th>
                <th className="text-right py-1 px-2 text-muted-foreground">{t("scoreCol")}</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 10 }).map((_, i) => {
                const entry = leaderboard[i];
                return (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-1 px-2 text-muted-foreground">{i + 1}.</td>
                    <td className="py-1 px-2 text-foreground">{entry?.name || "—"}</td>
                    <td className="py-1 px-2 text-right text-foreground">{entry?.score ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>}

      </>
      )}
    </div>
  );

  if (isFullscreen) {
    return (
      <div
        className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
        style={{ touchAction: 'none', overscrollBehavior: 'none' }}
      >
        <div className="w-full h-full max-w-[500px] flex flex-col items-center justify-center overflow-hidden"
          style={{ aspectRatio: '9/16', maxHeight: '100dvh' }}
        >
          {gameContent}
        </div>
      </div>
    );
  }

  return gameContent;
};

export default LlamaGame;
