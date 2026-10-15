import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export type Theme = "numbers" | "icons";

export type PlayerCount = 1 | 2 | 3 | 4;

export type GridSize = 4 | 6;

export type Settings = {
  theme: Theme;
  players: PlayerCount;
  gridSize: GridSize;
};

export type Option<Value> = {
  value: Value;
  label: string;
};

export type SettingField = {
  name: keyof Settings;
  legend: string;
  options: readonly Option<Settings[keyof Settings]>[];
};

export type TileIcon = {
  name: string;
  definition: IconDefinition;
};
