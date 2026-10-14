import {
  DEFAULT_SETTINGS,
  GRID_SIZE_OPTIONS,
  PLAYER_OPTIONS,
  THEME_OPTIONS,
  type Option,
  type Settings,
} from "@/data";

function findOption<Value>(
  options: readonly Option<Value>[],
  raw: FormDataEntryValue | null,
) {
  return options.find((option) => String(option.value) === raw)?.value;
}

export function readSettings(data: FormData): Settings {
  return {
    theme:
      findOption(THEME_OPTIONS, data.get("theme")) ?? DEFAULT_SETTINGS.theme,
    players:
      findOption(PLAYER_OPTIONS, data.get("players")) ??
      DEFAULT_SETTINGS.players,
    gridSize:
      findOption(GRID_SIZE_OPTIONS, data.get("gridSize")) ??
      DEFAULT_SETTINGS.gridSize,
  };
}
