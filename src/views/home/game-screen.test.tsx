import type { PlayerCount } from "@/data";
import { MISMATCH_DELAY } from "@/lib";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vite-plus/test";
import GameScreen from "./game-screen";

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(Math, "random").mockReturnValue(0.99);
});

afterEach(() => {
  vi.useRealTimers();
});

const SOLVE = [0, 8, 1, 9, 2, 10, 3, 11, 4, 12, 5, 13, 6, 14, 7, 15];

function renderGame(players: PlayerCount = 1) {
  return render(
    <GameScreen
      settings={{ theme: "numbers", players, gridSize: 4 }}
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

async function wait(ms: number) {
  await act(() => vi.advanceTimersByTime(ms));
}

function definition(term: string) {
  return screen.getByText(term, { selector: "dt" }).nextElementSibling;
}

function currentPlayer() {
  return screen
    .getAllByRole("term")
    .findIndex((term) => term.parentElement!.hasAttribute("aria-current"));
}

function status() {
  return screen.getByRole("status");
}

function restart() {
  fireEvent.click(screen.getByRole("button", { name: "Restart" }));
}

describe("GameScreen", () => {
  it("hands focus to the first tile", () => {
    renderGame();

    expect(tiles()[0]).toHaveFocus();
  });

  it("shows a mismatched pair until the hold runs out", async () => {
    renderGame();

    flip(0, 1);
    await wait(MISMATCH_DELAY - 1);

    expect(names(0, 2)).toEqual(["1", "2"]);

    await wait(1);

    expect(names(0, 2)).toEqual(["Hidden tile", "Hidden tile"]);
  });

  it("turns a held pair back at once when another tile is clicked", async () => {
    renderGame();

    flip(0, 1, 2);

    expect(names(0, 3)).toEqual(["Hidden tile", "Hidden tile", "3"]);

    await wait(MISMATCH_DELAY);

    expect(names(2, 3)).toEqual(["3"]);
  });

  it("gives a new pair its own hold", async () => {
    renderGame();

    flip(0, 1);
    await wait(MISMATCH_DELAY / 2);
    flip(2, 3);
    await wait(MISMATCH_DELAY - 1);

    expect(names(2, 4)).toEqual(["3", "4"]);
  });

  it("leaves a matched pair face up for good", async () => {
    renderGame();

    flip(0, 8);
    await wait(MISMATCH_DELAY);

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

  it("never lets the last round's hold cut a new one short", async () => {
    renderGame();

    flip(0, 1);
    await wait(MISMATCH_DELAY / 2);
    fireEvent.click(screen.getByRole("button", { name: "Restart" }));
    flip(0, 1);
    await wait(MISMATCH_DELAY - 1);

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

  it("keeps a single open tile face up", async () => {
    renderGame();

    flip(0);
    await wait(MISMATCH_DELAY * 2);

    expect(names(0, 1)).toEqual(["1"]);
  });

  it("drops a pending hold when the game is left", async () => {
    const { unmount } = renderGame();

    flip(0, 1);
    unmount();
    await wait(0);

    expect(vi.getTimerCount()).toBe(0);
  });

  it("waits for the first flip to start the clock", async () => {
    renderGame();

    await wait(5_000);
    expect(definition("Time")).toHaveTextContent("0:00");

    flip(0);
    await wait(61_000);
    expect(definition("Time")).toHaveTextContent("1:01");
  });

  it("counts a move for each pair turned", () => {
    renderGame();

    flip(0, 1, 2);
    expect(definition("Moves")).toHaveTextContent("1");

    flip(10);
    expect(definition("Moves")).toHaveTextContent("2");
  });

  it("stops the clock while the menu is open", async () => {
    renderGame();

    flip(0);
    await wait(2_000);
    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    await wait(10_000);
    expect(definition("Time")).toHaveTextContent("0:02");

    fireEvent.click(screen.getByRole("button", { name: "Resume Game" }));
    await wait(1_000);
    expect(definition("Time")).toHaveTextContent("0:03");
  });

  it("stops the clock once every pair is found", async () => {
    renderGame();

    flip(...SOLVE.slice(0, -1));
    await wait(2_000);
    flip(15);
    await wait(3_000);

    expect(definition("Time")).toHaveTextContent("0:02");
    expect(definition("Moves")).toHaveTextContent("8");
  });

  it("zeroes the clock and the moves on restart", async () => {
    renderGame();

    flip(0, 1);
    await wait(4_000);
    restart();
    await wait(4_000);

    expect(definition("Time")).toHaveTextContent("0:00");
    expect(definition("Moves")).toHaveTextContent("0");
  });

  it("passes the turn after every move and credits matches", () => {
    renderGame(3);

    expect(currentPlayer()).toBe(0);
    flip(0, 8);
    expect(currentPlayer()).toBe(1);
    flip(1, 2);
    expect(currentPlayer()).toBe(2);
    expect(
      screen.getAllByRole("definition").map((score) => score.textContent),
    ).toEqual(["1", "0", "0"]);
  });

  it("hands the turn back to player 1 on restart", () => {
    renderGame(2);

    flip(0, 1);
    restart();

    expect(currentPlayer()).toBe(0);
  });

  it.each<[string, PlayerCount, number[], string]>([
    ["nothing before a move", 1, [], ""],
    ["nothing while a move is half made", 1, [0], ""],
    ["a solo match", 1, [0, 8], "Match."],
    ["a solo mismatch", 1, [0, 1], "No match."],
    ["a match and the next turn", 3, [0, 8], "Match. Player 2's turn."],
    ["a mismatch and the next turn", 2, [0, 1], "No match. Player 2's turn."],
    ["the last match without a turn", 2, SOLVE, "Match."],
  ])("announces %s", (_, players, indexes, message) => {
    renderGame(players);

    flip(...indexes);

    expect(status().textContent).toBe(message);
  });

  it("clears the announcement when the next move starts", () => {
    renderGame();

    flip(0, 8, 1);

    expect(status().textContent).toBe("");
  });
});
