import { Button, Counter, Dialog } from "@/components/ui";
import {
  clockDuration,
  formatClock,
  playerName,
  pluralize,
  rankPlayers,
  resultTitle,
  type Clock,
  type Game,
  type Standing,
} from "@/lib";
import { useEffect, useId, useRef, type ReactNode } from "react";
import useElapsed from "./use-elapsed";

type ResultsDialogProps = {
  game: Game;
  onRestart: () => void;
  onNewGame: () => void;
};

type ResultProps = {
  label: string;
  winner?: boolean;
  children: ReactNode;
};

type TallyProps = {
  count: number;
  noun: string;
};

type SoloResultsProps = {
  moves: number;
  clock: Clock;
};

type PlayerResultsProps = {
  standings: readonly Standing[];
};

function Result({ label, winner = false, children }: ResultProps) {
  return (
    <div
      data-winner={winner || undefined}
      className="group/result flex h-12 items-center justify-between rounded-box bg-cloud px-4 data-winner:bg-ink md:h-18 md:rounded-card md:px-8"
    >
      <dt className="text-result-label text-muted group-data-winner/result:text-paper md:text-result-label-md">
        {label}
      </dt>
      <dd className="text-result text-navy tabular-nums group-data-winner/result:text-paper md:text-result-md">
        {children}
      </dd>
    </div>
  );
}

function Tally({ count, noun }: TallyProps) {
  return (
    <>
      <Counter value={count} /> {pluralize(count, noun)}
    </>
  );
}

function SoloResults({ moves, clock }: SoloResultsProps) {
  const time = useElapsed(clock);

  return (
    <>
      <Result label="Time Elapsed">
        <time dateTime={clockDuration(time)}>{formatClock(time)}</time>
      </Result>
      <Result label="Moves Taken">
        <Tally count={moves} noun="Move" />
      </Result>
    </>
  );
}

function PlayerResults({ standings }: PlayerResultsProps) {
  return standings.map(({ player, score, winner }) => (
    <Result
      key={player}
      label={winner ? `${playerName(player)} (Winner!)` : playerName(player)}
      winner={winner}
    >
      <Tally count={score} noun="Pair" />
    </Result>
  ));
}

export default function ResultsDialog({
  game,
  onRestart,
  onNewGame,
}: ResultsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const id = useId();
  const solo = game.settings.players === 1;
  const standings = rankPlayers(game.scores);

  useEffect(() => {
    dialogRef.current?.showModal();
    titleRef.current?.focus();
  }, []);

  function restart() {
    dialogRef.current?.close();
    onRestart();
  }

  function startNewGame() {
    dialogRef.current?.close();
    onNewGame();
  }

  return (
    <Dialog
      ref={dialogRef}
      closedby="closerequest"
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-subtitle ${id}-results`}
      className="px-6 pt-8 pb-6 md:rounded-panel md:px-14 md:pt-12.75 md:pb-17.25"
    >
      <h2
        ref={titleRef}
        id={`${id}-title`}
        tabIndex={-1}
        className="text-center text-title text-ink md:text-title-md"
      >
        {solo ? "You did it!" : resultTitle(standings)}
      </h2>
      <p
        id={`${id}-subtitle`}
        className="mt-2.25 text-center text-subtitle text-balance text-muted md:mt-4 md:text-subtitle-md"
      >
        {solo
          ? "Game over! Here’s how you got on…"
          : "Game over! Here are the results…"}
      </p>
      <dl id={`${id}-results`} className="mt-6 grid gap-2 md:mt-10 md:gap-4">
        {solo ? (
          <SoloResults moves={game.moves} clock={game.clock} />
        ) : (
          <PlayerResults standings={standings} />
        )}
      </dl>
      <div className="mt-6 grid gap-4 md:mt-10 md:grid-cols-2 md:gap-3.5">
        <Button
          variant="primary"
          onClick={restart}
          className="h-12 text-button md:h-13 md:text-button-md"
        >
          Restart
        </Button>
        <Button
          variant="secondary"
          onClick={startNewGame}
          className="h-12 text-button md:h-13 md:text-button-md"
        >
          Set Up New Game
        </Button>
      </div>
    </Dialog>
  );
}
