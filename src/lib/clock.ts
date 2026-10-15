export type Clock =
  | { status: "idle" }
  | { status: "running"; banked: number; since: number }
  | { status: "paused" | "stopped"; banked: number };

export const IDLE_CLOCK: Clock = { status: "idle" };

export function elapsed(clock: Clock, now: number) {
  if (clock.status === "idle") return 0;
  if (clock.status !== "running") return clock.banked;
  return clock.banked + Math.max(now - clock.since, 0);
}

export function startClock(clock: Clock, at: number): Clock {
  if (clock.status !== "idle") return clock;
  return { status: "running", banked: 0, since: at };
}

export function pauseClock(clock: Clock, at: number): Clock {
  if (clock.status !== "running") return clock;
  return { status: "paused", banked: elapsed(clock, at) };
}

export function resumeClock(clock: Clock, at: number): Clock {
  if (clock.status !== "paused") return clock;
  return { status: "running", banked: clock.banked, since: at };
}

export function stopClock(clock: Clock, at: number): Clock {
  if (clock.status !== "running") return clock;
  return { status: "stopped", banked: elapsed(clock, at) };
}

export function formatClock(ms: number) {
  const seconds = Math.floor(ms / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export function clockDuration(ms: number) {
  const seconds = Math.floor(ms / 1000);
  return `PT${Math.floor(seconds / 60)}M${seconds % 60}S`;
}
