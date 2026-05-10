import React, { useState } from "react";
import { useWortpaare } from "@/hooks/useWortpaare";
import WordCard from "./WordCard";
import MatchedPair from "./MatchedPair";
import germanLlamaLogo from "@/assets/germanllama-logo.png";
import { RotateCcw, Copy, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const WortpaareGame: React.FC = () => {
  const { t } = useLanguage();
  const { cards, matched, selected, shaking, loading, completed, selectCard, startGame } = useWortpaare(6);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const text = t("shareWortpaare", { pairs: String(matched.length) });
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Instructions */}
      {matched.length === 0 && !completed && (
        <div className="bg-muted border border-border rounded-xl px-4 py-3 mb-4 text-center">
          <p className="font-body text-sm text-muted-foreground">
            {t("clickForPair")}
          </p>
        </div>
      )}

      {/* Completion screen */}
      {completed ? (
        <div className="flex flex-col items-center gap-6 py-10">
          <img src={germanLlamaLogo} alt="GermanLlama" className="w-24 h-24 rounded-2xl" />
          <h3 className="font-game text-lg sm:text-xl text-foreground text-center">
            {t("completedWortpaare")}
          </h3>
          <p className="font-body text-muted-foreground text-center">
            {t("allPairsCorrect")}
          </p>
          <div className="flex flex-col items-center gap-3">
            <p className="font-game text-sm text-foreground">{t("shareBoast")}</p>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 font-game text-xs px-5 py-3 rounded-xl bg-primary text-primary-foreground hover:scale-105 transition-transform shadow-md"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? t("copied") : t("copy")}
            </button>
          </div>
          <button
            onClick={startGame}
            className="inline-flex items-center gap-2 bg-muted border border-border text-foreground font-body font-bold px-6 py-3 rounded-xl hover:bg-muted/80 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {t("playAgain")}
          </button>

          {/* Show all matched pairs */}
          <div className="w-full space-y-2 mt-4">
            {matched.map((m) => (
              <MatchedPair key={m.pair.id} data={m} />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Progress */}
          <div className="flex items-center justify-between mb-3">
            <span className="font-body text-sm text-muted-foreground">
              {t("paired")}: {matched.length} / {matched.length + Math.floor(cards.length / 2)}
            </span>
            <button
              onClick={startGame}
              className="font-body text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              {t("newGame")}
            </button>
          </div>

          {/* Card grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
            {cards.map((card) => (
              <WordCard
                key={card.id}
                word={card.word}
                isSelected={selected === card.id}
                isShaking={shaking === card.id}
                onClick={() => selectCard(card.id)}
              />
            ))}
          </div>

          {/* Matched pairs */}
          {matched.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">
                {t("pairedWords")}
              </h4>
              {matched.map((m) => (
                <MatchedPair key={m.pair.id} data={m} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WortpaareGame;
