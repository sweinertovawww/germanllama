import { useState } from "react";
import { Trophy, Copy, Check, RotateCcw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { currentShareUrl } from "@/lib/utils";

interface ChallengeSummaryProps {
  perGameScores: number[];
  onPlayAgain: () => void;
  variant?: "standard" | "a1";
}

export default function ChallengeSummary({ perGameScores, onPlayAgain, variant = "standard" }: ChallengeSummaryProps) {
  const { t, lang } = useLanguage();
  const [copied, setCopied] = useState(false);

  const totalScore = perGameScores.reduce((a, b) => a + b, 0);

  const getGameName = (index: number): string => {
    if (index === 0) return t("pexesoName");
    if (index === 1) return t("sentenceBuilderName");
    if (index === 2) return t("wordPairsName");
    if (index === 3) return "Scrabble";
    return "Llama Run";
  };

  const handleShare = () => {
    const text = t(variant === "a1" ? "shareChallengeA1" : "shareChallenge", { score: String(totalScore), url: currentShareUrl(lang) });
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center px-4 py-8 gap-6 max-w-md mx-auto w-full">
      <div className="flex flex-col items-center gap-2">
        <Trophy className="w-12 h-12 text-primary" />
        <h2 className="font-game text-xl sm:text-2xl text-foreground text-center">
          {t("challengeComplete")}
        </h2>
      </div>

      {/* Total score */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/40 rounded-2xl px-8 py-5 text-center w-full">
        <p className="font-body text-sm text-muted-foreground mb-1">{t("challengeTotalScore")}</p>
        <p className="font-game text-4xl sm:text-5xl text-primary">{totalScore}</p>
      </div>

      {/* Per-game breakdown */}
      <div className="bg-card border border-border rounded-2xl p-4 w-full">
        <p className="font-game text-xs text-muted-foreground uppercase tracking-wider mb-3">
          {t("challengeGameBreakdown")}
        </p>
        <div className="space-y-2">
          {perGameScores.map((pts, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="font-body text-sm text-foreground">{getGameName(i)}</span>
              <span className="font-game text-sm text-primary">{pts} pts</span>
            </div>
          ))}
        </div>
      </div>

      {/* Share */}
      <div className="flex flex-col items-center gap-3 w-full">
        <p className="font-game text-xs text-foreground text-center">{t("shareBoast")}</p>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 font-game text-xs px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:scale-105 transition-transform shadow-md"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? t("copied") : t("copy")}
        </button>
      </div>

      {/* Play again */}
      <button
        onClick={onPlayAgain}
        className="flex items-center gap-2 font-game text-sm px-8 py-3 rounded-xl border-2 border-border text-foreground hover:border-primary/50 hover:bg-muted transition-all"
      >
        <RotateCcw className="w-4 h-4" />
        {t("challengePlayAgain")}
      </button>
    </div>
  );
}
