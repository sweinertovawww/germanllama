import { memo, useState, useCallback } from "react";
import { type CrosswordData } from "./crosswordGenerator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

interface ScrabbleHintsProps {
  crossword: CrosswordData;
  completedWords: Set<number>;
}

function maskWord(word: string): string {
  if (word.length <= 4) {
    return word[0] + "·".repeat(word.length - 2) + word[word.length - 1];
  }
  const first3 = word.slice(0, 3);
  const last = word[word.length - 1];
  const hidden = "·".repeat(word.length - 4);
  return first3 + hidden + last;
}

const ScrabbleHints = memo(function ScrabbleHints({
  crossword,
  completedWords,
}: ScrabbleHintsProps) {
  const [revealedWords, setRevealedWords] = useState<Set<number>>(new Set());

  const toggleReveal = useCallback((num: number) => {
    setRevealedWords(prev => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  }, []);

  const remaining = crossword.placed.filter(p => !completedWords.has(p.number));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Lightbulb className="h-4 w-4" />
          Nápověda
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-game text-lg">Nápověda</DialogTitle>
        </DialogHeader>
        {remaining.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground py-4 text-center">
            Všechna slova jsou vyplněna! 🎉
          </p>
        ) : (
          <div className="space-y-1">
            {remaining.map(p => {
              const isRevealed = revealedWords.has(p.number);
              return (
                <button
                  key={p.number}
                  onClick={() => toggleReveal(p.number)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors flex items-center justify-between gap-3"
                >
                  <span className="font-body text-sm text-foreground">
                    <span className="text-muted-foreground mr-1.5">{p.number}.</span>
                    {p.entry.czech}
                    {p.entry.article && (
                      <span className="text-muted-foreground ml-1">({p.entry.article})</span>
                    )}
                  </span>
                  <span
                    className={`font-mono text-sm tracking-wider ${
                      isRevealed
                        ? "text-primary font-semibold"
                        : "text-muted-foreground"
                    }`}
                  >
                    {isRevealed ? p.word : maskWord(p.word)}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
});

export default ScrabbleHints;
