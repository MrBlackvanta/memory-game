import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";
import PlayerScores from "./player-scores";

function cards() {
  return screen.getAllByRole("term").map((term) => term.parentElement!);
}

describe("PlayerScores", () => {
  it("lists every player with their score", () => {
    render(<PlayerScores scores={[4, 0, 2]} turn={0} />);

    expect(
      screen.getAllByRole("definition").map((score) => score.textContent),
    ).toEqual(["4", "0", "2"]);
  });

  it("spells each player out and hides the short label", () => {
    render(<PlayerScores scores={[0, 0]} turn={1} />);

    expect(screen.getByText("Player 1")).not.toHaveAttribute("aria-hidden");
    expect(screen.getByText("P1")).toHaveAttribute("aria-hidden", "true");
  });

  it.each([0, 1, 2, 3])("marks only player index %i as current", (turn) => {
    render(<PlayerScores scores={[0, 0, 0, 0]} turn={turn} />);

    expect(cards().map((card) => card.getAttribute("aria-current"))).toEqual(
      [0, 1, 2, 3].map((player) => (player === turn ? "true" : null)),
    );
    expect(cards()[turn]).toHaveTextContent("Current turn");
    expect(screen.getAllByText("Current turn")).toHaveLength(1);
  });
});
