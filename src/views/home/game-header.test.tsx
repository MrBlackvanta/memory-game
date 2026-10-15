import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vite-plus/test";
import GameHeader from "./game-header";

function renderHeader() {
  const callbacks = {
    onRestart: vi.fn(),
    onNewGame: vi.fn(),
    onMenuOpen: vi.fn(),
    onMenuClose: vi.fn(),
  };
  render(<GameHeader {...callbacks} />);
  return { ...callbacks, user: userEvent.setup() };
}

async function openMenu(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: "Menu" }));
  return screen.getByRole("dialog", { name: "Menu" });
}

describe("GameHeader", () => {
  it("is a banner headed by the logo", () => {
    renderHeader();

    expect(
      within(screen.getByRole("banner")).getByRole("heading", {
        level: 1,
        name: "memory",
      }),
    ).toBeInTheDocument();
  });

  it("restarts from its own button", async () => {
    const { onRestart, onNewGame, user } = renderHeader();

    await user.click(screen.getByRole("button", { name: "Restart" }));

    expect(onRestart).toHaveBeenCalledOnce();
    expect(onNewGame).not.toHaveBeenCalled();
  });

  it("starts a new game from its own button", async () => {
    const { onRestart, onNewGame, user } = renderHeader();

    await user.click(screen.getByRole("button", { name: "New Game" }));

    expect(onNewGame).toHaveBeenCalledOnce();
    expect(onRestart).not.toHaveBeenCalled();
  });

  it("keeps the menu closed until asked", () => {
    renderHeader();

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens the menu with the harmless choice focused", async () => {
    const { user } = renderHeader();

    const menu = await openMenu(user);

    expect(
      within(menu)
        .getAllByRole("button")
        .map((button) => button.textContent),
    ).toEqual(["Restart", "New Game", "Resume Game"]);
    expect(
      within(menu).getByRole("button", { name: "Resume Game" }),
    ).toHaveFocus();
  });

  it("lets a click outside the menu close it", async () => {
    const { user } = renderHeader();

    expect(await openMenu(user)).toHaveAttribute("closedby", "any");
  });

  it.each([
    ["Restart", 1, 0],
    ["New Game", 0, 1],
    ["Resume Game", 0, 0],
  ])("closes the menu on %s", async (choice, restarts, newGames) => {
    const { onRestart, onNewGame, user } = renderHeader();
    const menu = await openMenu(user);

    await user.click(within(menu).getByRole("button", { name: choice }));

    expect(menu).not.toHaveAttribute("open");
    expect(onRestart).toHaveBeenCalledTimes(restarts);
    expect(onNewGame).toHaveBeenCalledTimes(newGames);
  });

  it("reports the menu opening and closing", async () => {
    const { onMenuOpen, onMenuClose, user } = renderHeader();

    const menu = await openMenu(user);

    expect(onMenuOpen).toHaveBeenCalledOnce();
    expect(onMenuClose).not.toHaveBeenCalled();

    await user.click(within(menu).getByRole("button", { name: "Resume Game" }));

    expect(onMenuClose).toHaveBeenCalledOnce();
  });

  it("reports a close the menu did not start itself", async () => {
    const { onMenuClose, user } = renderHeader();
    const menu = await openMenu(user);

    fireEvent(menu, new Event("close"));

    expect(onMenuClose).toHaveBeenCalledOnce();
  });
});
