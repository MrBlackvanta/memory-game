import type { Settings } from "@/data";
import { createDeck, gameReducer, MISMATCH_DELAY, newGame } from "@/lib";
import { useEffect, useReducer } from "react";
import Board from "./board";
import GameHeader from "./game-header";
import MoveStatus from "./move-status";
import PlayerScores from "./player-scores";
import SoloStats from "./solo-stats";

type GameScreenProps = {
  settings: Settings;
  onNewGame: () => void;
};

function startGame(settings: Settings) {
  return newGame(settings, createDeck(settings));
}

export default function GameScreen({ settings, onNewGame }: GameScreenProps) {
  const [game, dispatch] = useReducer(gameReducer, settings, startGame);

  useEffect(() => {
    if (game.open.length < 2) return;

    const timeout = setTimeout(
      () => dispatch({ type: "conceal" }),
      MISMATCH_DELAY,
    );
    return () => clearTimeout(timeout);
  }, [game.open]);

  return (
    <div className="mx-auto flex min-h-dvh max-w-297.5 flex-col gap-6 p-6 md:gap-10 md:px-10 md:pt-9 md:pb-12 lg:pt-17 lg:pb-17.5">
      <GameHeader
        onRestart={() =>
          dispatch({ type: "restart", deck: createDeck(settings) })
        }
        onNewGame={onNewGame}
        onMenuOpen={() => dispatch({ type: "pause", at: Date.now() })}
        onMenuClose={() => dispatch({ type: "resume", at: Date.now() })}
      />
      <main className="grid flex-1 grid-rows-[1fr_auto] gap-6 md:gap-10">
        <Board
          key={game.round}
          game={game}
          autoFocus={game.round === 1}
          onFlip={(index) => dispatch({ type: "flip", index, at: Date.now() })}
        />
        <MoveStatus game={game} />
        {settings.players === 1 ? (
          <SoloStats moves={game.moves} clock={game.clock} />
        ) : (
          <PlayerScores scores={game.scores} turn={game.turn} />
        )}
      </main>
    </div>
  );
}
