import { type Profession, PROFESSION_LIST } from "@/game/vocabularyData";

interface ScrabbleLobbyProps {
  selected: Profession[];
  onToggle: (p: Profession) => void;
  onSelectAll: () => void;
  isAllSelected: boolean;
  onStart: () => void;
  groupColors: Record<string, string>;
}

export default function ScrabbleLobby({
  selected,
  onToggle,
  onSelectAll,
  isAllSelected,
  onStart,
  groupColors,
}: ScrabbleLobbyProps) {
  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
      <div className="text-center mb-6">
        <h2 className="font-game text-lg sm:text-xl text-foreground mb-1">Vyber si svou profesi</h2>
        <p className="font-body text-sm text-muted-foreground">
          Vyber profese, ze kterých chceš skládat křížovku
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-8">
        <button
          onClick={onSelectAll}
          className={`font-body font-bold text-[10px] sm:text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 transition-all active:scale-95 ${
            isAllSelected
              ? "text-primary-foreground border-transparent shadow-lg ring-2 ring-primary/30"
              : "bg-card text-foreground border-primary/50 hover:border-primary hover:shadow-md"
          }`}
          style={isAllSelected ? { backgroundColor: "hsl(var(--primary))", borderColor: "hsl(var(--primary))" } : undefined}
        >
          🌍 Všechny profese
        </button>

        {PROFESSION_LIST.map(prof => {
          const isActive = selected.includes(prof.id);
          const color = groupColors[prof.group] || groupColors.obecné;
          return (
            <button
              key={prof.id}
              onClick={() => onToggle(prof.id)}
              className={`font-body font-semibold text-[10px] sm:text-xs px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full border-2 transition-all active:scale-95 ${
                isActive
                  ? "text-white border-transparent shadow-md"
                  : "bg-card text-muted-foreground border-border hover:shadow-sm"
              }`}
              style={isActive ? { backgroundColor: color, borderColor: color } : undefined}
              onMouseEnter={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.borderColor = color;
                  (e.currentTarget as HTMLElement).style.color = color;
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.borderColor = "";
                  (e.currentTarget as HTMLElement).style.color = "";
                }
              }}
            >
              {prof.emoji} {prof.label}
            </button>
          );
        })}
      </div>

      <div className="text-center">
        <button
          onClick={onStart}
          className="font-game text-sm sm:text-base px-8 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg"
        >
          ZAČÍT HRU
        </button>
      </div>
    </div>
  );
}
