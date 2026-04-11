import React from "react";
import { cn } from "@/lib/utils";

interface WordCardProps {
  word: string;
  isSelected: boolean;
  isShaking: boolean;
  onClick: () => void;
}

const WordCard: React.FC<WordCardProps> = ({ word, isSelected, isShaking, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative rounded-xl border-2 bg-card px-4 py-5 sm:px-6 sm:py-6 font-body font-bold text-base sm:text-lg text-foreground",
        "transition-all duration-200 cursor-pointer select-none",
        "hover:shadow-md hover:border-primary/60 hover:scale-[1.03]",
        "active:scale-[0.97]",
        isSelected
          ? "border-primary bg-primary/10 shadow-lg scale-[1.03] ring-2 ring-primary/30"
          : "border-border",
        isShaking && "animate-shake border-destructive"
      )}
    >
      {word}
    </button>
  );
};

export default WordCard;
