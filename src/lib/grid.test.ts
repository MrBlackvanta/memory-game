import { describe, expect, it } from "vitest";
import { targetCell } from "./grid";

describe("targetCell", () => {
  it.each<[number, string, boolean, number, number | null]>([
    [5, "ArrowLeft", false, 4, 4],
    [5, "ArrowRight", false, 4, 6],
    [5, "ArrowUp", false, 4, 1],
    [5, "ArrowDown", false, 4, 9],
    [5, "Home", false, 4, 4],
    [5, "End", false, 4, 7],
    [5, "Home", true, 4, 0],
    [5, "End", true, 4, 15],
    [0, "ArrowLeft", false, 4, 0],
    [0, "ArrowUp", false, 4, 0],
    [3, "ArrowRight", false, 4, 3],
    [3, "ArrowUp", false, 4, 3],
    [12, "ArrowLeft", false, 4, 12],
    [12, "ArrowDown", false, 4, 12],
    [15, "ArrowRight", false, 4, 15],
    [15, "ArrowDown", false, 4, 15],
    [7, "ArrowUp", false, 6, 1],
    [29, "ArrowDown", false, 6, 35],
    [30, "Home", false, 6, 30],
    [30, "End", false, 6, 35],
    [14, "End", true, 6, 35],
    [5, "ArrowRight", false, 6, 5],
    [6, "ArrowLeft", false, 6, 6],
  ])(
    "moves from %i on %s (ctrl %s, size %i) to %i",
    (index, key, ctrl, size, target) => {
      expect(targetCell(index, key, size, ctrl)).toBe(target);
    },
  );

  it.each(["Enter", " ", "Tab", "a", "PageDown"])(
    "leaves %j to the browser",
    (key) => {
      expect(targetCell(5, key, 4)).toBeNull();
    },
  );
});
