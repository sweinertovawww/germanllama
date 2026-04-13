import { type TileItem } from "./ScrabbleGame";

interface ScrabbleTilePoolProps {
  tilePool: TileItem[];
  selectedTile: number | null;
  onTileClick: (id: number) => void;
}

export default function ScrabbleTilePool({
  tilePool,
  selectedTile,
  onTileClick,
}: ScrabbleTilePoolProps) {
  return (
    <div className="px-2">
      <h3 className="font-body font-bold text-sm text-foreground mb-2 text-center">Písmena</h3>
      <div className="flex flex-wrap justify-center gap-2">
        {tilePool.map(tile => (
          <div
            key={tile.id}
            draggable
            onDragStart={e => {
              e.dataTransfer.setData("text/plain", String(tile.id));
              e.dataTransfer.effectAllowed = "move";
            }}
            onClick={() => onTileClick(tile.id)}
            className={`
              w-11 h-11 flex items-center justify-center rounded-lg font-body font-bold text-base
              cursor-grab active:cursor-grabbing select-none transition-all
              bg-card border-2 shadow-sm hover:shadow-md
              ${selectedTile === tile.id
                ? "border-primary ring-2 ring-primary/30 scale-110"
                : "border-border text-foreground hover:border-primary/40"
              }
            `}
          >
            {tile.letter}
          </div>
        ))}
      </div>
    </div>
  );
}
