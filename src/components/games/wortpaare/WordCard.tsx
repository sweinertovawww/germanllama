import React from "react";
import { cn } from "@/lib/utils";

interface WordCardProps {
  word: string;
  isSelected: boolean;
  isShaking: boolean;
  onClick: () => void;
}

const WordCard: React.FC<WordCardProps> = ({ word, isSelected, isShaking, onClick }) => {
  const fontSize = word.length > 14 ? "text-xs" : word.length > 10 ? "text-sm" : "text-base sm:text-lg";

  return (
    <button
      onClick={onClick}
      lang="de"
      className={cn(
        "relative rounded-xl border-2 bg-card px-4 py-5 sm:px-6 sm:py-6 font-body font-bold text-foreground",
        "flex items-center justify-center text-center",
        "min-h-[4rem] sm:min-h-[5rem] overflow-hidden",
        "transition-all duration-200 cursor-pointer select-none",
        "hover:shadow-md hover:border-primary/60 hover:scale-[1.03]",
        "active:scale-[0.97]",
        fontSize,
        isSelected
          ? "border-primary bg-primary/10 shadow-lg scale-[1.03] ring-2 ring-primary/30"
          : "border-border",
        isShaking && "animate-shake border-destructive"
      )}
      style={{ overflowWrap: "break-word", wordBreak: "break-word", hyphens: "auto" }}
    >
      {word}
    </button>
  );
};

export default WordCard;
