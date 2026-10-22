import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";
import NotFound, { metadata } from "./not-found";

describe("NotFound", () => {
  it("names the problem as the only heading, under the logo", () => {
    render(<NotFound />);

    expect(screen.getByRole("main")).toHaveTextContent(/^memoryPage not found/);
    expect(screen.getAllByRole("heading")).toEqual([
      screen.getByRole("heading", { level: 1, name: "Page not found" }),
    ]);
  });

  it("offers exactly one way out, a real link back to the setup", () => {
    render(<NotFound />);

    const link = screen.getByRole("link");
    expect(link).toHaveAccessibleName("Set Up New Game");
    expect(link).toHaveAttribute("href", "/");
  });

  it("sits on the dark theme like the setup screen", () => {
    render(<NotFound />);

    expect(screen.getByRole("main")).toHaveAttribute("data-theme", "dark");
  });

  it("carries its own title and drops the home canonical", () => {
    expect(metadata.title).toBe("memory | Page not found");
    expect(metadata.alternates).toEqual({ canonical: null });
  });
});
