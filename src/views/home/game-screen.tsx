import type { Settings } from "@/data";
import {
  createDeck,
  gameReducer,
  isFinished,
  MISMATCH_DELAY,
  newGame,
} from "@/lib";
import { useEffect, useReducer, useState } from "react";
import Board from "./board";
import GameHeader from "./game-header";
import MoveStatus from "./move-status";
import PlayerScores from "./player-scores";
import ResultsDialog from "./results-dialog";
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
  const [focusedRound, setFocusedRound] = useState(1);
  const finished = isFinished(game);

  useEffect(() => {
    if (game.open.length < 2) return;

    const timeout = setTimeout(
      () => dispatch({ type: "conceal" }),
      MISMATCH_DELAY,
    );
    return () => clearTimeout(timeout);
  }, [game.open]);

  function restart() {
    dispatch({ type: "restart", deck: createDeck(settings) });
  }

  function playAgain() {
    setFocusedRound(game.round + 1);
    restart();
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-297.5 flex-col gap-6 p-6 md:gap-10 md:px-10 md:pt-9 md:pb-12 lg:pt-17 lg:pb-17.5">
      <GameHeader
        onRestart={restart}
        onNewGame={onNewGame}
        onMenuOpen={() => dispatch({ type: "pause", at: Date.now() })}
        onMenuClose={() => dispatch({ type: "resume", at: Date.now() })}
      />
      <main className="grid flex-1 grid-rows-[1fr_auto] gap-6 md:gap-10">
        <Board
          key={game.round}
          game={game}
          autoFocus={game.round === focusedRound}
          onFlip={(index) => dispatch({ type: "flip", index, at: Date.now() })}
        />
        <MoveStatus game={game} />
        {settings.players === 1 ? (
          <SoloStats moves={game.moves} clock={game.clock} />
        ) : (
          <PlayerScores
            scores={game.scores}
            turn={finished ? null : game.turn}
          />
        )}
        {finished && (
          <ResultsDialog
            game={game}
            onRestart={playAgain}
            onNewGame={onNewGame}
          />
        )}
      </main>
    </div>
  );
}
