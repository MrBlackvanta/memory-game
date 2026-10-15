import { render } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";
import Counter from "./counter";

describe("Counter", () => {
  it("draws the number from a custom property and reads it as text", () => {
    const { container } = render(<Counter value={7} />);
    const [drawn, read] = container.children;

    expect(drawn).toHaveAttribute("aria-hidden", "true");
    expect(drawn).toHaveStyle({ "--count": "7" });
    expect(drawn).toBeEmptyDOMElement();
    expect(read).toHaveTextContent("7");
  });
});
