import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";
import Button from "./button";

describe("Button", () => {
  it("never submits a form unless told to", () => {
    render(
      <form>
        <Button variant="primary">Restart</Button>
        <Button variant="primary" type="submit">
          Start Game
        </Button>
      </form>,
    );

    expect(screen.getByRole("button", { name: "Restart" })).toHaveAttribute(
      "type",
      "button",
    );
    expect(screen.getByRole("button", { name: "Start Game" })).toHaveAttribute(
      "type",
      "submit",
    );
  });
});
