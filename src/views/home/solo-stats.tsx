import { Counter } from "@/components/ui";
import { clockDuration, formatClock, type Clock } from "@/lib";
import type { ReactNode } from "react";
import useElapsed from "./use-elapsed";

type SoloStatsProps = {
  moves: number;
  clock: Clock;
};

type StatProps = {
  label: string;
  children: ReactNode;
};

function Stat({ label, children }: StatProps) {
  return (
    <div className="flex h-17.5 flex-col items-center justify-center gap-0.5 rounded-box bg-cloud md:h-18 md:flex-row md:justify-between md:rounded-card md:pr-6 md:pl-5">
      <dt className="text-stat-label text-muted md:text-stat-label-md">
        {label}
      </dt>
      <dd className="text-stat text-navy tabular-nums md:text-stat-md">
        {children}
      </dd>
    </div>
  );
}

export default function SoloStats({ moves, clock }: SoloStatsProps) {
  const time = useElapsed(clock);

  return (
    <dl className="grid grid-cols-2 gap-6 md:mx-auto md:w-full md:max-w-135 md:gap-7.5">
      <Stat label="Time">
        <time dateTime={clockDuration(time)}>{formatClock(time)}</time>
      </Stat>
      <Stat label="Moves">
        <Counter value={moves} />
      </Stat>
    </dl>
  );
}
