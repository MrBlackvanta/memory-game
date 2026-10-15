import type { Settings } from "@/data";
import {
  IDLE_CLOCK,
  pauseClock,
  resumeClock,
  startClock,
  stopClock,
  type Clock,
} from "./clock";

export const MISMATCH_DELAY = 800;

export type Tile = {
  face: number;
  matched: boolean;
};

export type TileState = "hidden" | "open" | "matched";

export type MoveResult = "match" | "mismatch";

export type Game = {
  settings: Settings;
  round: number;
  tiles: readonly Tile[];
  open: readonly number[];
  moves: number;
  scores: readonly number[];
  turn: number;
  lastMove: MoveResult | null;
  clock: Clock;
};

export type GameAction =
  | { type: "flip"; index: number; at: number }
  | { type: "conceal" }
  | { type: "pause"; at: number }
  | { type: "resume"; at: number }
  | { type: "restart"; deck: readonly number[] };

export function newGame(
  settings: Settings,
  deck: readonly number[],
  round = 1,
): Game {
  return {
    settings,
    round,
    tiles: deck.map((face) => ({ face, matched: false })),
    open: [],
    moves: 0,
    scores: Array.from({ length: settings.players }, () => 0),
    turn: 0,
    lastMove: null,
    clock: IDLE_CLOCK,
  };
}

export function tileState(game: Game, index: number): TileState {
  if (game.tiles[index].matched) return "matched";
  return game.open.includes(index) ? "open" : "hidden";
}

export function isFinished(game: Game) {
  return game.tiles.every((tile) => tile.matched);
}

export function playerName(player: number) {
  return `Player ${player + 1}`;
}

function turnTile(game: Game, index: number): Game {
  if (tileState(game, index) === "matched") return game;
  if (game.open.length !== 1) return { ...game, open: [index], lastMove: null };

  const [first] = game.open;
  if (first === index) return game;

  const moved = {
    ...game,
    moves: game.moves + 1,
    turn: (game.turn + 1) % game.settings.players,
  };
  if (game.tiles[first].face !== game.tiles[index].face)
    return { ...moved, open: [first, index], lastMove: "mismatch" };

  return {
    ...moved,
    tiles: game.tiles.map((tile, position) =>
      position === first || position === index
        ? { ...tile, matched: true }
        : tile,
    ),
    open: [],
    scores: game.scores.map((score, player) =>
      player === game.turn ? score + 1 : score,
    ),
    lastMove: "match",
  };
}

function flip(game: Game, index: number, at: number): Game {
  const next = turnTile(game, index);
  if (next === game) return game;

  const clock = startClock(game.clock, at);
  return { ...next, clock: isFinished(next) ? stopClock(clock, at) : clock };
}

function withClock(game: Game, clock: Clock): Game {
  return clock === game.clock ? game : { ...game, clock };
}

export function gameReducer(game: Game, action: GameAction): Game {
  switch (action.type) {
    case "flip":
      return flip(game, action.index, action.at);
    case "conceal":
      return game.open.length === 2 ? { ...game, open: [] } : game;
    case "pause":
      return withClock(game, pauseClock(game.clock, action.at));
    case "resume":
      return withClock(game, resumeClock(game.clock, action.at));
    case "restart":
      return newGame(game.settings, action.deck, game.round + 1);
  }
}
