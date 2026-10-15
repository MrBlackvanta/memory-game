import {
  DEFAULT_SETTINGS,
  GRID_SIZE_OPTIONS,
  PLAYER_OPTIONS,
  THEME_OPTIONS,
  type Settings,
} from "@/data";
import { describe, expect, it } from "vite-plus/test";
import { readSettings } from "./settings";

function formData(entries: Record<string, string | Blob>) {
  const data = new FormData();
  for (const [name, value] of Object.entries(entries)) data.append(name, value);
  return data;
}

const everyCombination: Settings[] = THEME_OPTIONS.flatMap((theme) =>
  PLAYER_OPTIONS.flatMap((players) =>
    GRID_SIZE_OPTIONS.map((gridSize) => ({
      theme: theme.value,
      players: players.value,
      gridSize: gridSize.value,
    })),
  ),
);

describe("readSettings", () => {
  it("covers all 16 combinations", () => {
    expect(everyCombination).toHaveLength(16);
  });

  it.each(everyCombination)("reads %o", (settings) => {
    const data = formData({
      theme: settings.theme,
      players: String(settings.players),
      gridSize: String(settings.gridSize),
    });

    expect(readSettings(data)).toEqual(settings);
  });

  it.each<[string, Record<string, string | Blob>]>([
    ["missing", {}],
    ["empty", { theme: "", players: "", gridSize: "" }],
    ["out of range", { theme: "letters", players: "5", gridSize: "8" }],
    [
      "a label, not a value",
      { theme: "Icons", players: "two", gridSize: "6x6" },
    ],
    ["padded", { theme: " icons", players: "2 ", gridSize: "06" }],
    [
      "a file",
      {
        theme: new Blob(["icons"]),
        players: new Blob(["2"]),
        gridSize: new Blob(["6"]),
      },
    ],
  ])("falls back to the defaults when every field is %s", (_, entries) => {
    expect(readSettings(formData(entries))).toEqual(DEFAULT_SETTINGS);
  });

  it("keeps the valid fields of a partly invalid form", () => {
    const data = formData({ theme: "icons", players: "9", gridSize: "6" });

    expect(readSettings(data)).toEqual({
      theme: "icons",
      players: DEFAULT_SETTINGS.players,
      gridSize: 6,
    });
  });

  it("takes the first value when a field repeats", () => {
    const data = formData({ theme: "icons" });
    data.append("theme", "numbers");

    expect(readSettings(data).theme).toBe("icons");
  });
});
