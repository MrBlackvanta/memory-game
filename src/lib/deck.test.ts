import { ICONS, type Settings } from "@/data";
import { describe, expect, it } from "vite-plus/test";
import { createDeck, shuffle } from "./deck";

function sequence(...values: number[]) {
  let call = 0;
  return () => values[call++ % values.length];
}

function countFaces(deck: readonly number[]) {
  return Map.groupBy(deck, (face) => face);
}

describe("shuffle", () => {
  it.each([
    [
      "keeps the order when every pick is the last slot",
      () => 0.99,
      [1, 2, 3, 4],
    ],
    ["rotates left when every pick is the first slot", () => 0, [2, 3, 4, 1]],
    ["follows the picks it is given", sequence(0.5, 0, 0.99), [4, 2, 1, 3]],
  ])("%s", (_, random, expected) => {
    expect(shuffle([1, 2, 3, 4], random)).toEqual(expected);
  });

  it("leaves its input untouched", () => {
    const items = [1, 2, 3, 4];

    shuffle(items, () => 0);

    expect(items).toEqual([1, 2, 3, 4]);
  });

  it.each([[[]], [[7]]])("returns %j as it is", (items) => {
    expect(shuffle(items, () => 0)).toEqual(items);
  });
});

describe("createDeck", () => {
  it.each<[Settings["theme"], Settings["gridSize"], number]>([
    ["numbers", 4, 8],
    ["numbers", 6, 18],
    ["icons", 4, 8],
    ["icons", 6, 18],
  ])("deals %s on a %i-wide grid as %i pairs", (theme, gridSize, pairs) => {
    const deck = createDeck({ theme, players: 1, gridSize });
    const faces = countFaces(deck);

    expect(deck).toHaveLength(gridSize ** 2);
    expect(faces.size).toBe(pairs);
    expect([...faces.values()].every((copies) => copies.length === 2)).toBe(
      true,
    );
  });

  it.each([4, 6] as const)(
    "numbers a %i-wide grid from 1 upwards",
    (gridSize) => {
      const deck = createDeck({ theme: "numbers", players: 1, gridSize });

      expect(new Set(deck)).toEqual(
        new Set(Array.from({ length: gridSize ** 2 / 2 }, (_, i) => i + 1)),
      );
    },
  );

  it("draws icons from the icon set", () => {
    const deck = createDeck({ theme: "icons", players: 1, gridSize: 4 });

    expect(deck.every((face) => face in ICONS)).toBe(true);
  });

  it("uses every icon on a 6x6 board", () => {
    const deck = createDeck({ theme: "icons", players: 1, gridSize: 6 });

    expect(new Set(deck).size).toBe(ICONS.length);
  });

  it("shuffles the pairs it deals", () => {
    const settings: Settings = { theme: "numbers", players: 1, gridSize: 4 };

    expect(createDeck(settings, () => 0)).not.toEqual(
      createDeck(settings, () => 0.99),
    );
  });

  it("varies which icons a 4x4 board gets", () => {
    const settings: Settings = { theme: "icons", players: 1, gridSize: 4 };

    expect(new Set(createDeck(settings, () => 0.99))).not.toEqual(
      new Set(createDeck(settings, () => 0)),
    );
  });
});
