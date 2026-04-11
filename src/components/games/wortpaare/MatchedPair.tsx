import React from "react";
import { Check, ArrowLeftRight } from "lucide-react";
import { MatchedPairData } from "@/hooks/useWortpaare";

interface MatchedPairProps {
  data: MatchedPairData;
}

const MatchedPair: React.FC<MatchedPairProps> = ({ data }) => {
  const { pair } = data;
  const isSynonym = pair.pair_type === "synonym";

  return (
    <div className="flex items-center gap-2 sm:gap-3 rounded-xl border-2 border-border/60 bg-muted/50 px-3 py-2.5 sm:px-4 sm:py-3 opacity-90">
      {/* Word A */}
      <div className="flex-1 text-center">
        <p className="font-body font-bold text-sm sm:text-base text-foreground/70">{pair.word_a}</p>
        <p className="font-body text-xs text-muted-foreground">{pair.translation_a}</p>
      </div>

      {/* Badge */}
      <div className="flex flex-col items-center gap-0.5 shrink-0">
        <ArrowLeftRight className="w-3.5 h-3.5 text-primary/60" />
        <span
          className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full ${
            isSynonym
              ? "bg-primary/15 text-primary"
              : "bg-accent/20 text-accent-foreground"
          }`}
        >
          {isSynonym ? "Synonym" : "Antonym"}
        </span>
      </div>

      {/* Word B */}
      <div className="flex-1 text-center">
        <p className="font-body font-bold text-sm sm:text-base text-foreground/70">{pair.word_b}</p>
        <p className="font-body text-xs text-muted-foreground">{pair.translation_b}</p>
      </div>

      <Check className="w-4 h-4 text-primary shrink-0" />
    </div>
  );
};

export default MatchedPair;
