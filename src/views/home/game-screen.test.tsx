import { MISMATCH_DELAY } from "@/lib";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import GameScreen from "./game-screen";

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(Math, "random").mockReturnValue(0.99);
});

afterEach(() => {
  vi.useRealTimers();
});

function renderGame() {
  return render(
    <GameScreen
      settings={{ theme: "numbers", players: 1, gridSize: 4 }}
      onNewGame={vi.fn()}
    />,
  );
}

function tiles() {
  return within(screen.getByRole("grid")).getAllByRole("button");
}

function flip(...indexes: number[]) {
  for (const index of indexes) fireEvent.click(tiles()[index]);
}

function names(from: number, to: number) {
  return tiles()
    .slice(from, to)
    .map((tile) => tile.getAttribute("aria-label"));
}

function wait(ms: number) {
  act(() => vi.advanceTimersByTime(ms));
}

describe("GameScreen", () => {
  it("hands focus to the first tile", () => {
    renderGame();

    expect(tiles()[0]).toHaveFocus();
  });

  it("shows a mismatched pair until the hold runs out", () => {
    renderGame();

    flip(0, 1);
    wait(MISMATCH_DELAY - 1);

    expect(names(0, 2)).toEqual(["1", "2"]);

    wait(1);

    expect(names(0, 2)).toEqual(["Hidden tile", "Hidden tile"]);
  });

  it("turns a held pair back at once when another tile is clicked", () => {
    renderGame();

    flip(0, 1, 2);

    expect(names(0, 3)).toEqual(["Hidden tile", "Hidden tile", "3"]);

    wait(MISMATCH_DELAY);

    expect(names(2, 3)).toEqual(["3"]);
  });

  it("gives a new pair its own hold", () => {
    renderGame();

    flip(0, 1);
    wait(MISMATCH_DELAY / 2);
    flip(2, 3);
    wait(MISMATCH_DELAY - 1);

    expect(names(2, 4)).toEqual(["3", "4"]);
  });

  it("leaves a matched pair face up for good", () => {
    renderGame();

    flip(0, 8);
    wait(MISMATCH_DELAY);

    expect(names(0, 1)).toEqual(["1"]);
    expect(names(8, 9)).toEqual(["1"]);
    expect(tiles()[0]).toHaveAttribute("aria-disabled", "true");
  });

  it("restarts on a hidden board", () => {
    renderGame();

    flip(0, 8, 1, 2);
    fireEvent.click(screen.getByRole("button", { name: "Restart" }));

    expect(names(0, 16).every((name) => name === "Hidden tile")).toBe(true);
  });

  it("never lets the last round's hold cut a new one short", () => {
    renderGame();

    flip(0, 1);
    wait(MISMATCH_DELAY / 2);
    fireEvent.click(screen.getByRole("button", { name: "Restart" }));
    flip(0, 1);
    wait(MISMATCH_DELAY - 1);

    expect(names(0, 2)).toEqual(["1", "2"]);
  });

  it("deals a fresh shuffle on restart", () => {
    renderGame();

    vi.mocked(Math.random).mockReturnValue(0);
    fireEvent.click(screen.getByRole("button", { name: "Restart" }));
    flip(0);

    expect(names(0, 1)).toEqual(["2"]);
  });

  it("puts the tab stop back on the first tile after a restart", () => {
    renderGame();

    fireEvent.focus(tiles()[5]);
    fireEvent.click(screen.getByRole("button", { name: "Restart" }));

    expect(tiles().filter((tile) => tile.tabIndex === 0)).toEqual([tiles()[0]]);
  });

  it("schedules nothing while a single tile is open", () => {
    renderGame();

    flip(0);
    wait(0);

    expect(vi.getTimerCount()).toBe(0);
  });

  it("drops a pending hold when the game is left", () => {
    const { unmount } = renderGame();

    flip(0, 1);
    unmount();
    wait(0);

    expect(vi.getTimerCount()).toBe(0);
  });
});
