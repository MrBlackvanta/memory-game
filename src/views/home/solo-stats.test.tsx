import { IDLE_CLOCK, type Clock } from "@/lib";
import { act, render, screen } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vite-plus/test";
import SoloStats from "./solo-stats";

const NOW = 50_000;

beforeEach(() => {
  vi.useFakeTimers({ now: NOW });
});

afterEach(() => {
  vi.useRealTimers();
});

function definition(term: string) {
  return screen.getByText(term, { selector: "dt" }).nextElementSibling;
}

async function wait(ms: number) {
  await act(() => vi.advanceTimersByTime(ms));
}

describe("SoloStats", () => {
  it("pairs each term with its value", () => {
    render(<SoloStats moves={7} clock={IDLE_CLOCK} />);

    expect(screen.getAllByRole("term").map((term) => term.textContent)).toEqual(
      ["Time", "Moves"],
    );
    expect(definition("Time")).toHaveTextContent("0:00");
    expect(definition("Moves")).toHaveTextContent("7");
  });

  it("gives the time a machine-readable duration", () => {
    render(
      <SoloStats moves={0} clock={{ status: "stopped", banked: 113_000 }} />,
    );

    expect(screen.getByText("1:53")).toHaveAttribute("datetime", "PT1M53S");
  });

  it("ticks over on each whole second while running", async () => {
    render(
      <SoloStats
        moves={0}
        clock={{ status: "running", banked: 61_500, since: NOW }}
      />,
    );

    expect(definition("Time")).toHaveTextContent("1:01");
    await wait(499);
    expect(definition("Time")).toHaveTextContent("1:01");
    await wait(1);
    expect(definition("Time")).toHaveTextContent("1:02");
    await wait(58_000);
    expect(definition("Time")).toHaveTextContent("2:00");
  });

  it.each<[string, Clock]>([
    ["idle", IDLE_CLOCK],
    ["paused", { status: "paused", banked: 5_000 }],
    ["stopped", { status: "stopped", banked: 5_000 }],
  ])("schedules no tick while %s", async (_, clock) => {
    render(<SoloStats moves={0} clock={clock} />);
    const shown = definition("Time")?.textContent;

    await wait(10_000);

    expect(definition("Time")).toHaveTextContent(shown!);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("drops its tick when it unmounts", async () => {
    const { unmount } = render(
      <SoloStats
        moves={0}
        clock={{ status: "running", banked: 0, since: NOW }}
      />,
    );

    unmount();
    await wait(0);

    expect(vi.getTimerCount()).toBe(0);
  });
});
