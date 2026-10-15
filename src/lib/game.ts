import type { Settings } from "@/data";

export const MISMATCH_DELAY = 800;

export type Tile = {
  face: number;
  matched: boolean;
};

export type TileState = "hidden" | "open" | "matched";

export type Game = {
  settings: Settings;
  round: number;
  tiles: readonly Tile[];
  open: readonly number[];
  moves: number;
  scores: readonly number[];
  turn: number;
};

export type GameAction =
  | { type: "flip"; index: number }
  | { type: "conceal" }
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
  };
}

export function tileState(game: Game, index: number): TileState {
  if (game.tiles[index].matched) return "matched";
  return game.open.includes(index) ? "open" : "hidden";
}

function flip(game: Game, index: number): Game {
  if (tileState(game, index) === "matched") return game;
  if (game.open.length !== 1) return { ...game, open: [index] };

  const [first] = game.open;
  if (first === index) return game;

  const moved = {
    ...game,
    moves: game.moves + 1,
    turn: (game.turn + 1) % game.settings.players,
  };
  if (game.tiles[first].face !== game.tiles[index].face)
    return { ...moved, open: [first, index] };

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
  };
}

export function gameReducer(game: Game, action: GameAction): Game {
  switch (action.type) {
    case "flip":
      return flip(game, action.index);
    case "conceal":
      return game.open.length === 2 ? { ...game, open: [] } : game;
    case "restart":
      return newGame(game.settings, action.deck, game.round + 1);
  }
}
