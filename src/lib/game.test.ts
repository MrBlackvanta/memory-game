import type { PlayerCount, Settings } from "@/data";
import { describe, expect, it } from "vite-plus/test";
import { elapsed, IDLE_CLOCK } from "./clock";
import {
  gameReducer,
  isFinished,
  newGame,
  playerName,
  tileState,
  type Game,
  type GameAction,
  type MoveResult,
} from "./game";

const PAIRS = [1, 2, 3, 4, 5, 6, 7, 8];
const DECK = [...PAIRS, ...PAIRS];
const SOLVE = PAIRS.flatMap((_, pair) => [pair, pair + 8]);

function settingsFor(players: PlayerCount): Settings {
  return { theme: "numbers", players, gridSize: 4 };
}

function flips(...indexes: number[]): GameAction[] {
  return indexes.map((index, step) => ({
    type: "flip",
    index,
    at: (step + 1) * 1_000,
  }));
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
      lastMove: null,
      clock: IDLE_CLOCK,
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

  it.each<[string, GameAction[], MoveResult | null]>([
    ["nothing before a move", [], null],
    ["nothing while a move is half made", flips(0), null],
    ["a mismatch", flips(0, 1), "mismatch"],
    ["a match", flips(0, 8), "match"],
    [
      "the mismatch through its hold",
      [...flips(0, 1), { type: "conceal" }],
      "mismatch",
    ],
    ["nothing once the next move starts", flips(0, 1, 5), null],
  ])("reports %s", (_, actions, lastMove) => {
    expect(play(actions).lastMove).toBe(lastMove);
  });

  it("matches every tile once every pair is found", () => {
    const game = play(flips(...SOLVE));

    expect(isFinished(game)).toBe(true);
    expect(states(game).every((state) => state === "matched")).toBe(true);
    expect(game.moves).toBe(8);
    expect(game.scores).toEqual([8]);
  });

  it.each<[string, GameAction[], boolean]>([
    ["a fresh board", [], false],
    ["a board one pair short", flips(...SOLVE.slice(0, -2)), false],
    ["a board with the last pair open", flips(...SOLVE.slice(0, -1)), false],
    ["a solved board", flips(...SOLVE), true],
  ])("calls %s finished: %s", (_, actions, finished) => {
    expect(isFinished(play(actions))).toBe(finished);
  });

  it("starts the clock on the first flip", () => {
    const game = play(flips(0));

    expect(game.clock).toEqual({ status: "running", banked: 0, since: 1_000 });
  });

  it("stops the clock on the last match", () => {
    const game = play(flips(...SOLVE));

    expect(game.clock).toEqual({ status: "stopped", banked: 15_000 });
  });

  it("pauses and resumes the clock", () => {
    const game = play([
      ...flips(0),
      { type: "pause", at: 3_000 },
      { type: "resume", at: 10_000 },
    ]);

    expect(elapsed(game.clock, 12_000)).toBe(4_000);
  });

  it.each<[string, GameAction]>([
    ["a pause", { type: "pause", at: 1_000 }],
    ["a resume", { type: "resume", at: 1_000 }],
  ])("ignores %s before the first flip", (_, action) => {
    const before = play([]);

    expect(gameReducer(before, action)).toBe(before);
  });

  it("restarts with a fresh deck, the same settings and the next round", () => {
    const deck = [...DECK].reverse();
    const finished = play(flips(0, 8, 1, 2), 2);

    const game = gameReducer(finished, { type: "restart", deck });

    expect(game).toEqual(newGame(settingsFor(2), deck, 2));
  });
});

describe("playerName", () => {
  it.each<[number, string]>([
    [0, "Player 1"],
    [3, "Player 4"],
  ])("names player index %i %s", (player, name) => {
    expect(playerName(player)).toBe(name);
  });
});
