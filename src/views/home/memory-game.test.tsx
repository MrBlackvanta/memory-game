import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
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
      screen.getByRole("button", { name: "New Game" }),
    ).toBeInTheDocument();
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
