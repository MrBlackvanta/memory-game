import { ICONS } from "@/data";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vite-plus/test";
import MemoryGame from "./memory-game";

describe("MemoryGame", () => {
  it("opens on the setup screen without taking focus", () => {
    render(<MemoryGame />);

    expect(
      screen.getByRole("form", { name: "Game setup" }),
    ).toBeInTheDocument();
    expect(document.body).toHaveFocus();
  });

  it("replaces the setup with the game on start", async () => {
    const user = userEvent.setup();
    render(<MemoryGame />);

    await user.click(screen.getByRole("button", { name: "Start Game" }));

    expect(screen.queryByRole("form")).not.toBeInTheDocument();
    expect(
      within(screen.getByRole("banner")).getByRole("heading", { level: 1 }),
    ).toBeInTheDocument();
  });

  it("deals the board the setup asked for", async () => {
    const user = userEvent.setup();
    render(<MemoryGame />);

    await user.click(screen.getByText("Icons"));
    await user.click(screen.getByText("6x6"));
    await user.click(screen.getByRole("button", { name: "Start Game" }));
    const board = screen.getByRole("grid", { name: "Tiles" });
    const [firstTile] = within(board).getAllByRole("button");
    await user.click(firstTile);

    expect(within(board).getAllByRole("row")).toHaveLength(6);
    expect(ICONS.map((icon) => icon.name)).toContain(
      firstTile.getAttribute("aria-label"),
    );
  });

  it("restarts without dropping focus", async () => {
    const user = userEvent.setup();
    render(<MemoryGame />);

    await user.click(screen.getByRole("button", { name: "Start Game" }));
    await user.click(screen.getByRole("button", { name: "Restart" }));

    expect(screen.getByRole("button", { name: "Restart" })).toHaveFocus();
  });

  it("marks only the setup screen for the ink page", async () => {
    const user = userEvent.setup();
    render(<MemoryGame />);

    expect(screen.getByRole("main")).toHaveAttribute("data-screen", "setup");

    await user.click(screen.getByRole("button", { name: "Start Game" }));

    expect(screen.getByRole("main")).not.toHaveAttribute("data-screen");
  });

  it("returns to the setup with the last settings checked and focused", async () => {
    const user = userEvent.setup();
    render(<MemoryGame />);

    await user.click(screen.getByText("Icons"));
    await user.click(screen.getByText("3"));
    await user.click(screen.getByText("6x6"));
    await user.click(screen.getByRole("button", { name: "Start Game" }));
    await user.click(screen.getByRole("button", { name: "New Game" }));

    expect(screen.getByRole("radio", { name: "Icons" })).toHaveFocus();
    expect(screen.getByRole("radio", { name: "3" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "6x6" })).toBeChecked();
  });
});
