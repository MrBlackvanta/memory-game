import { useState } from "react";
import GameHeader from "./game-header";

type GameScreenProps = {
  onNewGame: () => void;
};

export default function GameScreen({ onNewGame }: GameScreenProps) {
  const [round, setRound] = useState(0);

  return (
    <div className="mx-auto box-content flex max-w-277.5 flex-col px-6 pt-6 md:px-10 md:pt-9 lg:pt-17">
      <GameHeader
        onRestart={() => setRound((current) => current + 1)}
        onNewGame={onNewGame}
      />
      <main key={round} />
    </div>
  );
}
