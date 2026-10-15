import { Icon } from "@/components/ui";
import { ICONS, type GridSize, type Theme } from "@/data";
import { targetCell, tileState, type Game } from "@/lib";
import { useState, type KeyboardEvent } from "react";
import Tile from "./tile";

type BoardProps = {
  game: Game;
  autoFocus: boolean;
  onFlip: (index: number) => void;
};

const LAYOUTS: Record<GridSize, { board: string; row: string }> = {
  4: {
    board: "size-[min(100cqmin,33.25rem)] grid-rows-4 gap-[3.75%]",
    row: "grid-cols-4 gap-[3.75%] text-tile md:text-tile-md",
  },
  6: {
    board: "size-[min(100cqmin,35.75rem)] grid-rows-6 gap-[2.8%]",
    row: "grid-cols-6 gap-[2.8%] text-tile-dense md:text-tile-dense-md",
  },
};

function describeFace(theme: Theme, face: number) {
  if (theme === "numbers") return { label: String(face), content: face };

  const { name, definition } = ICONS[face];
  return {
    label: name,
    content: <Icon definition={definition} className="size-[48%]" />,
  };
}

export default function Board({ game, autoFocus, onFlip }: BoardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { theme, gridSize } = game.settings;
  const layout = LAYOUTS[gridSize];
  const rows = Array.from({ length: gridSize }, (_, row) =>
    game.tiles.slice(row * gridSize, (row + 1) * gridSize),
  );

  function moveFocus(event: KeyboardEvent<HTMLDivElement>) {
    const target = targetCell(activeIndex, event.key, gridSize, event.ctrlKey);
    if (target === null) return;

    event.preventDefault();
    event.currentTarget.querySelectorAll("button")[target].focus();
  }

  return (
    <div className="@container-size grid min-h-70 place-items-center">
      <div
        role="grid"
        aria-label="Tiles"
        onKeyDown={moveFocus}
        className={`@container grid ${layout.board}`}
      >
        {rows.map((tiles, row) => (
          <div key={row} role="row" className={`grid ${layout.row}`}>
            {tiles.map((tile, column) => {
              const index = row * gridSize + column;
              const { label, content } = describeFace(theme, tile.face);

              return (
                <div key={column} role="gridcell">
                  <Tile
                    label={label}
                    state={tileState(game, index)}
                    autoFocus={autoFocus && index === 0}
                    tabIndex={index === activeIndex ? 0 : -1}
                    onFocus={() => setActiveIndex(index)}
                    onClick={() => onFlip(index)}
                  >
                    {content}
                  </Tile>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
