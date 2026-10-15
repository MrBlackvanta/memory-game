"use client";

import { DEFAULT_SETTINGS, type Settings } from "@/data";
import { useState } from "react";
import GameScreen from "./game-screen";
import SetupScreen from "./setup-screen";

type View =
  | { screen: "setup"; previous: Settings | null }
  | { screen: "game"; settings: Settings };

export default function MemoryGame() {
  const [view, setView] = useState<View>({ screen: "setup", previous: null });

  if (view.screen === "game") {
    return (
      <GameScreen
        settings={view.settings}
        onNewGame={() => setView({ screen: "setup", previous: view.settings })}
      />
    );
  }

  return (
    <SetupScreen
      preselected={view.previous ?? DEFAULT_SETTINGS}
      focusOnMount={view.previous !== null}
      onStart={(settings) => setView({ screen: "game", settings })}
    />
  );
}
