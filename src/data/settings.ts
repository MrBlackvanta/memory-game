import type {
  GridSize,
  Option,
  PlayerCount,
  SettingField,
  Settings,
  Theme,
} from "./types";

export const THEME_OPTIONS: readonly Option<Theme>[] = [
  { value: "numbers", label: "Numbers" },
  { value: "icons", label: "Icons" },
];

export const PLAYER_OPTIONS: readonly Option<PlayerCount>[] = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
];

export const GRID_SIZE_OPTIONS: readonly Option<GridSize>[] = [
  { value: 4, label: "4x4" },
  { value: 6, label: "6x6" },
];

export const SETTING_FIELDS: readonly SettingField[] = [
  { name: "theme", legend: "Select Theme", options: THEME_OPTIONS },
  { name: "players", legend: "Number of Players", options: PLAYER_OPTIONS },
  { name: "gridSize", legend: "Grid Size", options: GRID_SIZE_OPTIONS },
];

export const DEFAULT_SETTINGS: Settings = {
  theme: "numbers",
  players: 1,
  gridSize: 4,
};
