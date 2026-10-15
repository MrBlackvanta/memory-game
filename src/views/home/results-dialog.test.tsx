import type { PlayerCount } from "@/data";
import { newGame, type Game } from "@/lib";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vite-plus/test";
import ResultsDialog from "./results-dialog";

function renderResults(overrides: Partial<Game> & { scores: number[] }) {
  const callbacks = { onRestart: vi.fn(), onNewGame: vi.fn() };
  const players = overrides.scores.length as PlayerCount;
  const game = {
    ...newGame({ theme: "numbers", players, gridSize: 4 }, []),
    ...overrides,
  };
  render(<ResultsDialog game={game} {...callbacks} />);
  return callbacks;
}

function renderSolo() {
  return renderResults({
    scores: [8],
    moves: 39,
    clock: { status: "stopped", banked: 113_400 },
  });
}

function dialog() {
  return screen.getByRole("dialog");
}

function texts(role: "term" | "definition") {
  return within(dialog())
    .getAllByRole(role)
    .map((element) => element.textContent);
}

describe("ResultsDialog", () => {
  it("opens as a modal named by its heading", () => {
    renderSolo();

    expect(dialog()).toHaveAttribute("open");
    expect(dialog()).toHaveAccessibleName("You did it!");
    expect(
      within(dialog()).getByRole("heading", { level: 2 }),
    ).toHaveTextContent("You did it!");
  });

  it("opens on its heading so a held key cannot press a button", () => {
    renderSolo();

    expect(within(dialog()).getByRole("heading")).toHaveFocus();
  });

  it("describes itself with the subtitle and every result", () => {
    renderSolo();

    expect(dialog()).toHaveAccessibleDescription(
      "Game over! Here’s how you got on… Time Elapsed 1:53 Moves Taken 39 Moves",
    );
  });

  it("reports the time and the moves of a solo game", () => {
    renderSolo();

    expect(texts("term")).toEqual(["Time Elapsed", "Moves Taken"]);
    expect(texts("definition")).toEqual(["1:53", "39 Moves"]);
    expect(within(dialog()).getByText("1:53")).toHaveAttribute(
      "datetime",
      "PT1M53S",
    );
  });

  it.each<[string, number[], string, string[], string[]]>([
    [
      "a winner",
      [4, 3, 8, 1],
      "Player 3 Wins!",
      ["Player 3 (Winner!)", "Player 1", "Player 2", "Player 4"],
      ["8 Pairs", "4 Pairs", "3 Pairs", "1 Pair"],
    ],
    [
      "a tie",
      [6, 3, 6, 1],
      "It’s a tie!",
      ["Player 1 (Winner!)", "Player 3 (Winner!)", "Player 2", "Player 4"],
      ["6 Pairs", "6 Pairs", "3 Pairs", "1 Pair"],
    ],
  ])("ranks the players after %s", (_, scores, title, terms, definitions) => {
    renderResults({ scores });

    expect(dialog()).toHaveAccessibleName(title);
    expect(
      within(dialog()).getByText("Game over! Here are the results…"),
    ).toBeInTheDocument();
    expect(texts("term")).toEqual(terms);
    expect(texts("definition")).toEqual(definitions);
  });

  it.each([
    ["Restart", "onRestart"],
    ["Set Up New Game", "onNewGame"],
  ] as const)("closes before it hands %s on", (name, callback) => {
    const callbacks = renderSolo();
    const results = dialog();

    fireEvent.click(within(results).getByRole("button", { name }));

    expect(results).not.toHaveAttribute("open");
    expect(callbacks[callback]).toHaveBeenCalledOnce();
    expect(
      Object.values(callbacks).filter((spy) => spy.mock.calls.length > 0),
    ).toHaveLength(1);
  });

  it("closes on Escape but not on a click outside", () => {
    renderSolo();

    expect(dialog()).toHaveAttribute("closedby", "closerequest");
  });
});
