import { DEFAULT_SETTINGS, type Settings } from "@/data";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vite-plus/test";
import SetupScreen from "./setup-screen";

const GROUPS = [
  ["Select Theme", ["Numbers", "Icons"]],
  ["Number of Players", ["1", "2", "3", "4"]],
  ["Grid Size", ["4x4", "6x6"]],
] as const;

function renderSetup({
  preselected = DEFAULT_SETTINGS,
  focusOnMount = false,
}: { preselected?: Settings; focusOnMount?: boolean } = {}) {
  const onStart = vi.fn();
  render(
    <SetupScreen
      preselected={preselected}
      focusOnMount={focusOnMount}
      onStart={onStart}
    />,
  );
  return { onStart, user: userEvent.setup() };
}

function checkedNames() {
  return screen
    .getAllByRole("radio", { checked: true })
    .map((radio) => radio.closest("label")?.textContent);
}

describe("SetupScreen", () => {
  it("is a main landmark headed by the logo", () => {
    renderSetup();

    expect(
      within(screen.getByRole("main")).getByRole("heading", {
        level: 1,
        name: "memory",
      }),
    ).toBeInTheDocument();
  });

  it("is a named form with exactly three groups", () => {
    renderSetup();
    const form = screen.getByRole("form", { name: "Game setup" });

    expect(within(form).getAllByRole("group")).toHaveLength(GROUPS.length);
  });

  it.each(GROUPS)("offers %s as one radio group", (legend, labels) => {
    renderSetup();
    const group = screen.getByRole("group", { name: legend });
    const radios = within(group).getAllByRole("radio");

    expect(radios).toHaveLength(labels.length);
    labels.forEach((label, index) =>
      expect(radios[index]).toHaveAccessibleName(label),
    );
    expect(
      new Set(radios.map((radio) => radio.getAttribute("name"))).size,
    ).toBe(1);
  });

  it("checks the defaults", () => {
    renderSetup();

    expect(checkedNames()).toEqual(["Numbers", "1", "4x4"]);
  });

  it("checks the settings it is given", () => {
    renderSetup({ preselected: { theme: "icons", players: 3, gridSize: 6 } });

    expect(checkedNames()).toEqual(["Icons", "3", "6x6"]);
  });

  it("starts with the defaults when nothing is picked", async () => {
    const { onStart, user } = renderSetup();

    await user.click(screen.getByRole("button", { name: "Start Game" }));

    expect(onStart).toHaveBeenCalledExactlyOnceWith(DEFAULT_SETTINGS);
  });

  it("starts without navigating away", async () => {
    const { user } = renderSetup();
    const submits: SubmitEvent[] = [];
    screen
      .getByRole("form")
      .addEventListener("submit", (event) => submits.push(event));

    await user.click(screen.getByRole("button", { name: "Start Game" }));

    expect(submits).toHaveLength(1);
    expect(submits[0].defaultPrevented).toBe(true);
  });

  it("starts with the picked settings", async () => {
    const { onStart, user } = renderSetup();

    await user.click(screen.getByText("Icons"));
    await user.click(screen.getByText("4"));
    await user.click(screen.getByText("6x6"));
    await user.click(screen.getByRole("button", { name: "Start Game" }));

    expect(onStart).toHaveBeenCalledExactlyOnceWith({
      theme: "icons",
      players: 4,
      gridSize: 6,
    });
  });

  it("moves the selection with the arrow keys", async () => {
    const { user } = renderSetup();

    await user.tab();
    expect(screen.getByRole("radio", { name: "Numbers" })).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    await user.tab();
    await user.keyboard("{ArrowRight}{ArrowRight}");

    expect(checkedNames()).toEqual(["Icons", "3", "4x4"]);
  });

  it("focuses the checked theme when asked", () => {
    renderSetup({
      preselected: { theme: "icons", players: 2, gridSize: 4 },
      focusOnMount: true,
    });

    expect(screen.getByRole("radio", { name: "Icons" })).toHaveFocus();
  });

  it("leaves focus alone otherwise", () => {
    renderSetup();

    expect(document.body).toHaveFocus();
  });
});
