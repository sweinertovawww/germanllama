import { useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Pexeso from "@/pages/Pexeso";
import SentenceBuilder from "@/pages/SentenceBuilder";
import WortpaareGame from "@/components/games/wortpaare/WortpaareGame";
import ScrabbleGame from "@/game/scrabble/ScrabbleGame";
import LlamaGame from "@/game/LlamaGame";
import ChallengeInterstitial from "./ChallengeInterstitial";
import ChallengeSummary from "./ChallengeSummary";
import type { Profession, Level } from "@/game/vocabularyData";

type ChallengePhase = "intro" | "playing" | "interstitial" | "summary";
type ChallengeVariant = "standard" | "a1";

const GAME_COUNT = 5;
// "obecné" is guaranteed to have sufficient vocabulary for Scrabble
const SCRABBLE_PROFESSION: Profession[] = ["obecné"];
const LLAMA_TIME_LIMIT = 180;

interface ChallengeModeProps {
  variant?: ChallengeVariant;
}

export default function ChallengeMode({ variant = "standard" }: ChallengeModeProps) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<ChallengePhase>("intro");
  const [gameIndex, setGameIndex] = useState(0);
  const [perGameScores, setPerGameScores] = useState<number[]>([]);
  const levelOverride: Level | undefined = variant === "a1" ? "A1" : undefined;

  const totalScore = perGameScores.reduce((a, b) => a + b, 0);

  const handleGameComplete = useCallback((score: number) => {
    setPerGameScores(prev => {
      const updated = [...prev, score];
      if (updated.length >= GAME_COUNT) {
        setPhase("summary");
      } else {
        setPhase("interstitial");
      }
      return updated;
    });
  }, []);

  const handleContinue = useCallback(() => {
    setGameIndex(prev => prev + 1);
    setPhase("playing");
  }, []);

  const handlePlayAgain = useCallback(() => {
    setGameIndex(0);
    setPerGameScores([]);
    setPhase("intro");
  }, []);

  const renderCurrentGame = () => {
    switch (gameIndex) {
      case 0:
        return <Pexeso key="pexeso" challengeMode levelOverride={levelOverride} onGameComplete={handleGameComplete} />;
      case 1:
        return <SentenceBuilder key="sentence" challengeMode levelOverride={levelOverride} onGameComplete={handleGameComplete} />;
      case 2:
        return (
          <section className="px-3 sm:px-4 pb-8">
            <div className="max-w-4xl mx-auto">
              <WortpaareGame key="wortpaare" challengeMode levelOverride={levelOverride} onGameComplete={handleGameComplete} />
            </div>
          </section>
        );
      case 3:
        return (
          <section className="py-4 sm:py-6 px-3 sm:px-4">
            <ScrabbleGame
              key="scrabble"
              challengeMode
              initialProfession={levelOverride ? undefined : SCRABBLE_PROFESSION}
              levelOverride={levelOverride}
              onGameComplete={handleGameComplete}
            />
          </section>
        );
      case 4:
        return (
          <section className="py-4 sm:py-6 px-3 sm:px-4">
            <LlamaGame
              key="llama"
              challengeMode
              timeLimitSeconds={LLAMA_TIME_LIMIT}
              levelOverride={levelOverride}
              onGameComplete={handleGameComplete}
            />
          </section>
        );
      default:
        return null;
    }
  };

  if (phase === "intro") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 gap-6">
        <div className="bg-card border-2 rounded-2xl p-8 sm:p-12 max-w-sm w-full text-center shadow-xl"
          style={{ borderImage: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent))) 1" }}>
          <span className="text-5xl block mb-4">🦙</span>
          <h1 className="font-game text-xl sm:text-2xl text-foreground mb-3">
            {t(variant === "a1" ? "challengeIntroTitleA1" : "challengeIntroTitle")}
          </h1>
          <p className="font-body text-sm text-muted-foreground mb-8 leading-relaxed">
            {t(variant === "a1" ? "challengeIntroTextA1" : "challengeIntroText")}
          </p>
          <div className="space-y-2 text-left mb-8">
            {["pexesoName", "sentenceBuilderName", "wordPairsName"].map((key, i) => (
              <div key={i} className="flex items-center gap-2 font-body text-sm text-foreground">
                <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-game">{i + 1}</span>
                {t(key as Parameters<typeof t>[0])}
              </div>
            ))}
            {["Scrabble", "Llama Run"].map((name, i) => (
              <div key={i + 3} className="flex items-center gap-2 font-body text-sm text-foreground">
                <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-game">{i + 4}</span>
                {name}
              </div>
            ))}
          </div>
          <button
            onClick={() => setPhase("playing")}
            className="w-full font-game text-sm py-4 rounded-xl text-primary-foreground hover:opacity-90 active:scale-95 transition-all shadow-lg"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}
          >
            {t(variant === "a1" ? "challengeStartA1" : "challengeStart")}
          </button>
        </div>
      </div>
    );
  }

  if (phase === "interstitial") {
    return (
      <ChallengeInterstitial
        nextGameIndex={gameIndex + 1}
        totalScore={totalScore}
        onContinue={handleContinue}
      />
    );
  }

  if (phase === "summary") {
    return <ChallengeSummary perGameScores={perGameScores} onPlayAgain={handlePlayAgain} variant={variant} />;
  }

  // phase === "playing"
  return <>{renderCurrentGame()}</>;
}
