import { ICONS, type GridSize, type Theme } from "@/data";
import { gameReducer, newGame, type GameAction } from "@/lib";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vite-plus/test";
import Board from "./board";

function deckFor(gridSize: GridSize) {
  const faces = Array.from({ length: gridSize ** 2 / 2 }, (_, i) => i + 1);
  return [...faces, ...faces];
}

function renderBoard({
  theme = "numbers",
  gridSize = 4,
  flips = [],
  autoFocus = false,
}: {
  theme?: Theme;
  gridSize?: GridSize;
  flips?: number[];
  autoFocus?: boolean;
} = {}) {
  const game = flips
    .map((index): GameAction => ({ type: "flip", index, at: 0 }))
    .reduce(
      gameReducer,
      newGame({ theme, players: 1, gridSize }, deckFor(gridSize)),
    );
  const onFlip = vi.fn();
  render(<Board game={game} autoFocus={autoFocus} onFlip={onFlip} />);
  return { onFlip, user: userEvent.setup() };
}

function tiles() {
  return screen.getAllByRole("button");
}

describe("Board", () => {
  it.each([4, 6] as const)(
    "lays out a %i-wide grid of hidden tiles",
    (gridSize) => {
      renderBoard({ gridSize });

      const rows = within(
        screen.getByRole("grid", { name: "Tiles" }),
      ).getAllByRole("row");

      expect(rows).toHaveLength(gridSize);
      for (const row of rows) {
        const cells = within(row).getAllByRole("gridcell");
        expect(cells).toHaveLength(gridSize);
        for (const cell of cells)
          expect(
            within(cell).getByRole("button", { name: "Hidden tile" }),
          ).toBeInTheDocument();
      }
    },
  );

  it("names open and matched tiles by their face", () => {
    renderBoard({ flips: [0, 8, 1] });

    expect(tiles().map((tile) => tile.getAttribute("aria-label"))).toEqual([
      "1",
      "2",
      ...Array(6).fill("Hidden tile"),
      "1",
      ...Array(7).fill("Hidden tile"),
    ]);
  });

  it("names icon tiles by what they show", () => {
    renderBoard({ theme: "icons", flips: [0, 1] });

    expect(tiles()[0]).toHaveAccessibleName(ICONS[1].name);
    expect(tiles()[1]).toHaveAccessibleName(ICONS[2].name);
  });

  it("marks only matched tiles unavailable", () => {
    renderBoard({ flips: [0, 8, 1] });

    expect(
      tiles().filter((tile) => tile.getAttribute("aria-disabled") === "true"),
    ).toEqual([tiles()[0], tiles()[8]]);
  });

  it("flips the tile that is clicked", async () => {
    const { onFlip, user } = renderBoard();

    await user.click(tiles()[5]);

    expect(onFlip).toHaveBeenCalledExactlyOnceWith(5);
  });

  it("keeps the whole board to one tab stop", async () => {
    const { user } = renderBoard();

    await user.tab();
    await user.tab();

    expect(tiles().filter((tile) => tile.tabIndex === 0)).toEqual([tiles()[0]]);
    expect(document.body).toHaveFocus();
  });

  it.each<[string, string, number]>([
    ["{ArrowRight}", "right", 1],
    ["{ArrowDown}", "down", 4],
    ["{ArrowDown}{ArrowRight}{ArrowRight}{ArrowUp}", "around", 2],
    ["{End}", "to the end of the row", 3],
    ["{ArrowDown}{End}{Home}", "back to the start of the row", 4],
    ["{Control>}{End}{/Control}", "to the last tile", 15],
    ["{ArrowLeft}{ArrowUp}", "nowhere past the edge", 0],
  ])("moves focus with %s (%s)", async (keys, _, target) => {
    const { onFlip, user } = renderBoard();

    await user.tab();
    await user.keyboard(keys);

    expect(tiles()[target]).toHaveFocus();
    expect(tiles().filter((tile) => tile.tabIndex === 0)).toEqual([
      tiles()[target],
    ]);
    expect(onFlip).not.toHaveBeenCalled();
  });

  it.each([
    ["ArrowDown", false],
    ["End", false],
    ["Tab", true],
  ])("lets %s scroll the page: %s", (key, scrolls) => {
    renderBoard();

    expect(fireEvent.keyDown(tiles()[0], { key })).toBe(scrolls);
  });

  it.each(["{Enter}", " "])("flips the focused tile with %j", async (key) => {
    const { onFlip, user } = renderBoard();

    await user.tab();
    await user.keyboard(`{ArrowRight}${key}`);

    expect(onFlip).toHaveBeenCalledExactlyOnceWith(1);
  });

  it.each([true, false])("focuses the first tile on mount: %s", (autoFocus) => {
    renderBoard({ autoFocus });

    expect(tiles()[0] === document.activeElement).toBe(autoFocus);
  });
});
