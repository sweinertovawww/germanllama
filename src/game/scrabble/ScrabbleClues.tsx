import { type CrosswordData } from "./crosswordGenerator";

interface ScrabbleCluesProps {
  crossword: CrosswordData;
  activeWordNum: number | null;
  completedWords: Set<number>;
  onClueClick: (num: number) => void;
}

export default function ScrabbleClues({
  crossword,
  activeWordNum,
  completedWords,
  onClueClick,
}: ScrabbleCluesProps) {
  const horizontalWords = crossword.placed.filter(p => p.direction === "H");
  const verticalWords = crossword.placed.filter(p => p.direction === "V");

  const renderClue = (p: typeof crossword.placed[0]) => (
    <button
      key={p.number}
      onClick={() => onClueClick(p.number)}
      className={`block w-full text-left font-body text-sm px-2 py-1 rounded transition-colors ${
        activeWordNum === p.number ? "bg-primary/10" : "hover:bg-muted"
      } ${completedWords.has(p.number) ? "line-through text-muted-foreground" : "text-foreground"}`}
    >
      <span className="text-muted-foreground">{p.number}.</span>{" "}
      {p.entry.czech} ({p.entry.article})
      {completedWords.has(p.number) && " ✅"}
    </button>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 px-2">
      {horizontalWords.length > 0 && (
        <div>
          <h3 className="font-body font-bold text-sm text-foreground mb-2">→ Vodorovně</h3>
          <div className="space-y-1">{horizontalWords.map(renderClue)}</div>
        </div>
      )}
      {verticalWords.length > 0 && (
        <div>
          <h3 className="font-body font-bold text-sm text-foreground mb-2">↓ Svisle</h3>
          <div className="space-y-1">{verticalWords.map(renderClue)}</div>
        </div>
      )}
    </div>
  );
}
