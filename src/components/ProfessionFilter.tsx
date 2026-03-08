import { PROFESSION_LIST, type Profession } from "@/game/vocabularyData";

const GROUP_COLORS: Record<string, string> = {
  kancelář: "hsl(230 60% 55%)",
  řemesla: "hsl(210 70% 50%)",
  gastro: "hsl(25 90% 55%)",
  zdravotnictví: "hsl(150 60% 40%)",
  obchod: "hsl(160 55% 45%)",
  úklid: "hsl(180 55% 42%)",
  obecné: "hsl(210 10% 50%)",
  doprava: "hsl(280 65% 50%)",
};

interface ProfessionFilterProps {
  selected: Profession[];
  onToggle: (p: Profession) => void;
  onSelectAll: () => void;
  isAllSelected: boolean;
}

export default function ProfessionFilter({
  selected,
  onToggle,
  onSelectAll,
  isAllSelected,
}: ProfessionFilterProps) {
  return (
    <div className="max-w-4xl mx-auto mb-4 sm:mb-6 px-3 sm:px-4">
      <p className="font-body font-bold text-foreground text-xs sm:text-sm mb-2 text-center">
        🎯 Vyber si svou profesi
      </p>
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {/* Všechny profese */}
        <button
          onClick={onSelectAll}
          className={`font-body font-semibold text-[10px] sm:text-xs px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full border-2 transition-all active:scale-95 ${
            isAllSelected
              ? "text-primary-foreground border-transparent shadow-md"
              : "bg-card text-muted-foreground border-border hover:border-primary/40"
          }`}
          style={isAllSelected ? { backgroundColor: "hsl(var(--primary))", borderColor: "hsl(var(--primary))" } : undefined}
        >
          🌍 Všechny
        </button>

        {PROFESSION_LIST.map((prof) => {
          const isActive = selected.includes(prof.id);
          const color = GROUP_COLORS[prof.group] || GROUP_COLORS.obecné;

          return (
            <button
              key={prof.id}
              onClick={() => onToggle(prof.id)}
              className={`font-body font-semibold text-[10px] sm:text-xs px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full border-2 transition-all active:scale-95 ${
                isActive
                  ? "text-white border-transparent shadow-md"
                  : "bg-card text-muted-foreground border-border hover:shadow-sm"
              }`}
              style={
                isActive
                  ? { backgroundColor: color, borderColor: color }
                  : { borderColor: undefined }
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.borderColor = color;
                  (e.currentTarget as HTMLElement).style.color = color;
                }
              }}
              onMouseLeave={(e) => {
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
    </div>
  );
}
