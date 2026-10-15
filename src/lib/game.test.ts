import type { PlayerCount, Settings } from "@/data";
import { describe, expect, it } from "vitest";
import {
  gameReducer,
  newGame,
  tileState,
  type Game,
  type GameAction,
} from "./game";

const PAIRS = [1, 2, 3, 4, 5, 6, 7, 8];
const DECK = [...PAIRS, ...PAIRS];

function settingsFor(players: PlayerCount): Settings {
  return { theme: "numbers", players, gridSize: 4 };
}

function flips(...indexes: number[]): GameAction[] {
  return indexes.map((index) => ({ type: "flip", index }));
}

function play(actions: GameAction[], players: PlayerCount = 1) {
  return actions.reduce(gameReducer, newGame(settingsFor(players), DECK));
}

function states(game: Game) {
  return game.tiles.map((_, index) => tileState(game, index));
}

describe("newGame", () => {
  it.each<[PlayerCount, number[]]>([
    [1, [0]],
    [2, [0, 0]],
    [3, [0, 0, 0]],
    [4, [0, 0, 0, 0]],
  ])("deals %i player(s) a hidden board and %j", (players, scores) => {
    const game = newGame(settingsFor(players), DECK);

    expect(game).toMatchObject({
      round: 1,
      open: [],
      moves: 0,
      scores,
      turn: 0,
    });
    expect(game.tiles.map((tile) => tile.face)).toEqual(DECK);
    expect(states(game).every((state) => state === "hidden")).toBe(true);
  });
});

describe("gameReducer", () => {
  it.each<[string, GameAction[], number[], number]>([
    ["opens the first tile", flips(0), [0], 0],
    ["holds a mismatched pair", flips(0, 1), [0, 1], 1],
    ["clears a matched pair", flips(0, 8), [], 1],
    ["swaps a held pair for the next tile", flips(0, 1, 5), [5], 1],
    [
      "keeps one tile of a held pair when it is clicked",
      flips(0, 1, 1),
      [1],
      1,
    ],
    ["lets the next tile start a new pair", flips(0, 1, 5, 13), [], 2],
    ["counts a mismatch after a held pair", flips(0, 1, 5, 6), [5, 6], 2],
  ])("%s", (_, actions, open, moves) => {
    const game = play(actions);

    expect(game.open).toEqual(open);
    expect(game.moves).toBe(moves);
  });

  it.each<[string, GameAction[]]>([
    ["the open tile", flips(0, 0)],
    ["a matched tile with nothing open", flips(0, 8, 8)],
    ["a matched tile as the second of a pair", flips(0, 8, 1, 0)],
  ])("ignores %s", (_, actions) => {
    const before = play(actions.slice(0, -1));

    expect(gameReducer(before, actions.at(-1)!)).toBe(before);
  });

  it("marks a matched pair and leaves the rest hidden", () => {
    const game = play(flips(0, 8));

    expect(states(game)).toEqual(
      DECK.map((_, index) => (index % 8 === 0 ? "matched" : "hidden")),
    );
  });

  it.each<[GameAction[], number[]]>([
    [flips(0, 1), [0, 1]],
    [flips(0), [0]],
    [[], []],
  ])("conceals only a held pair: %j", (actions, held) => {
    const before = play(actions);
    const after = gameReducer(before, { type: "conceal" });

    expect(after.open).toEqual(held.length === 2 ? [] : held);
    expect(after === before).toBe(held.length !== 2);
  });

  it.each<[PlayerCount, number[], number]>([
    [1, [4], 0],
    [2, [2, 2], 0],
    [3, [2, 1, 1], 1],
    [4, [1, 1, 1, 1], 0],
  ])(
    "passes the turn after every move with %i player(s)",
    (players, scores, turn) => {
      const game = play(flips(0, 8, 1, 9, 2, 10, 3, 11), players);

      expect(game.scores).toEqual(scores);
      expect(game.turn).toBe(turn);
    },
  );

  it("credits a match to the player whose turn it was", () => {
    const game = play(flips(0, 1, 2, 10), 3);

    expect(game.scores).toEqual([0, 1, 0]);
    expect(game.turn).toBe(2);
  });

  it("matches every tile once every pair is found", () => {
    const game = play(flips(...PAIRS.flatMap((_, pair) => [pair, pair + 8])));

    expect(states(game).every((state) => state === "matched")).toBe(true);
    expect(game.moves).toBe(8);
    expect(game.scores).toEqual([8]);
  });

  it("restarts with a fresh deck, the same settings and the next round", () => {
    const deck = [...DECK].reverse();
    const finished = play(flips(0, 8, 1, 2), 2);

    const game = gameReducer(finished, { type: "restart", deck });

    expect(game).toEqual(newGame(settingsFor(2), deck, 2));
  });
});
