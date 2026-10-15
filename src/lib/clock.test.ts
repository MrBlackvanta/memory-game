import { describe, expect, it } from "vite-plus/test";
import {
  clockDuration,
  elapsed,
  formatClock,
  IDLE_CLOCK,
  pauseClock,
  resumeClock,
  startClock,
  stopClock,
  type Clock,
} from "./clock";

const STEPS = {
  start: startClock,
  pause: pauseClock,
  resume: resumeClock,
  stop: stopClock,
};

type Step = [keyof typeof STEPS, number];

function apply(clock: Clock, [step, at]: Step) {
  return STEPS[step](clock, at);
}

function run(...steps: Step[]) {
  return steps.reduce(apply, IDLE_CLOCK);
}

describe("clock", () => {
  it.each<[string, Clock, number, number]>([
    ["reads zero before it starts", run(), 9_000, 0],
    ["counts from its start", run(["start", 1_000]), 4_500, 3_500],
    ["never reads below zero", run(["start", 1_000]), 500, 0],
    [
      "holds still while paused",
      run(["start", 0], ["pause", 2_000]),
      9_000,
      2_000,
    ],
    [
      "skips the paused time on resume",
      run(["start", 0], ["pause", 2_000], ["resume", 7_000]),
      8_000,
      3_000,
    ],
    [
      "banks every running stretch",
      run(
        ["start", 0],
        ["pause", 1_000],
        ["resume", 5_000],
        ["pause", 6_000],
        ["resume", 9_000],
      ),
      10_000,
      3_000,
    ],
    ["freezes when stopped", run(["start", 0], ["stop", 5_000]), 60_000, 5_000],
  ])("%s", (_, clock, now, expected) => {
    expect(elapsed(clock, now)).toBe(expected);
  });

  it.each<[string, Step[]]>([
    [
      "a second start",
      [
        ["start", 0],
        ["start", 5_000],
      ],
    ],
    ["a pause before the start", [["pause", 1_000]]],
    [
      "a resume while running",
      [
        ["start", 0],
        ["resume", 5_000],
      ],
    ],
    [
      "a second pause",
      [
        ["start", 0],
        ["pause", 1_000],
        ["pause", 5_000],
      ],
    ],
    [
      "a resume after the stop",
      [
        ["start", 0],
        ["stop", 1_000],
        ["resume", 5_000],
      ],
    ],
    [
      "a stop while paused",
      [
        ["start", 0],
        ["pause", 1_000],
        ["stop", 5_000],
      ],
    ],
    ["a stop before the start", [["stop", 1_000]]],
  ])("ignores %s", (_, steps) => {
    const before = run(...steps.slice(0, -1));

    expect(apply(before, steps.at(-1)!)).toBe(before);
  });
});

describe("formatClock", () => {
  it.each<[number, string]>([
    [0, "0:00"],
    [999, "0:00"],
    [1_000, "0:01"],
    [59_999, "0:59"],
    [60_000, "1:00"],
    [113_000, "1:53"],
    [600_000, "10:00"],
    [6_000_000, "100:00"],
  ])("shows %i ms as %s", (ms, text) => {
    expect(formatClock(ms)).toBe(text);
  });
});

describe("clockDuration", () => {
  it.each<[number, string]>([
    [0, "PT0M0S"],
    [113_999, "PT1M53S"],
    [600_000, "PT10M0S"],
  ])("writes %i ms as %s", (ms, duration) => {
    expect(clockDuration(ms)).toBe(duration);
  });
});
