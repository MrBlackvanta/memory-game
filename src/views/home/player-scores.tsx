import { Counter } from "@/components/ui";
import { playerName } from "@/lib";

type PlayerScoresProps = {
  scores: readonly number[];
  turn: number | null;
};

export default function PlayerScores({ scores, turn }: PlayerScoresProps) {
  return (
    <dl className="grid grid-cols-4 gap-6 md:gap-2.75 lg:gap-7.5">
      {scores.map((score, player) => (
        <div
          key={player}
          aria-current={player === turn || undefined}
          className="group/player relative flex h-17.5 flex-col items-center justify-center gap-0.5 rounded-box bg-cloud aria-current:v-notch aria-current:bg-accent md:h-20 md:items-start md:gap-1.25 md:rounded-card md:pl-4 lg:h-18 lg:flex-row lg:items-center lg:justify-between lg:pr-6 lg:pl-5"
        >
          <dt className="text-stat-label text-muted group-aria-current/player:text-navy lg:text-stat-label-md">
            <span aria-hidden="true" className="md:hidden">
              P{player + 1}
            </span>
            <span className="max-md:sr-only">{playerName(player)}</span>
            {player === turn && (
              <span className="text-turn text-ink uppercase max-lg:sr-only lg:absolute lg:inset-x-0 lg:top-full lg:mt-6 lg:text-center">
                Current turn
              </span>
            )}
          </dt>
          <dd className="text-stat text-navy tabular-nums lg:text-stat-md">
            <Counter value={score} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
