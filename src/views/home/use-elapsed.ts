import { elapsed, type Clock } from "@/lib";
import { useEffect, useState } from "react";

export default function useElapsed(clock: Clock) {
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (clock.status !== "running") return;

    let timeout: ReturnType<typeof setTimeout>;
    function scheduleNextSecond() {
      const ms = elapsed(clock, Date.now());
      timeout = setTimeout(tick, 1000 - (ms % 1000));
    }
    function tick() {
      setNow(Date.now());
      scheduleNextSecond();
    }

    scheduleNextSecond();
    return () => clearTimeout(timeout);
  }, [clock]);

  return elapsed(clock, now);
}
