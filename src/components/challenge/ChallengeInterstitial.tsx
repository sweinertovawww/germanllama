import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ChallengeInterstitialProps {
  nextGameIndex: number;
  totalScore: number;
  onContinue: () => void;
}

export default function ChallengeInterstitial({ nextGameIndex, totalScore, onContinue }: ChallengeInterstitialProps) {
  const { t } = useLanguage();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    setCountdown(5);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onContinue();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [nextGameIndex, onContinue]);

  const getGameName = (index: number): string => {
    if (index === 0) return t("pexesoName");
    if (index === 1) return t("sentenceBuilderName");
    if (index === 2) return t("wordPairsName");
    if (index === 3) return "Scrabble";
    return "Llama Run";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 gap-8">
      <div className="bg-card border-2 border-primary/40 rounded-2xl p-8 sm:p-12 max-w-sm w-full text-center shadow-xl">
        <p className="font-game text-xs text-muted-foreground mb-1">
          {t("challengeGameOf", { n: String(nextGameIndex + 1), total: "5" })}
        </p>
        <p className="font-body text-sm text-muted-foreground mb-4">
          {t("challengeCurrentScore")} <span className="font-game text-foreground">{totalScore}</span>
        </p>

        <div className="border-t border-border pt-4 mb-6">
          <p className="font-body text-xs text-muted-foreground mb-1">{t("challengeNextGame")}</p>
          <p className="font-game text-xl sm:text-2xl text-primary">{getGameName(nextGameIndex)}</p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full border-4 border-primary flex items-center justify-center">
            <span className="font-game text-2xl text-primary">{countdown}</span>
          </div>
          <button
            onClick={onContinue}
            className="font-game text-sm px-8 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all shadow-md"
          >
            {t("challengeContinue")}
          </button>
        </div>
      </div>
    </div>
  );
}
