import { Button } from "@/components/ui";
import { SITE_NAME } from "@/data";
import GameMenu from "./game-menu";

type GameHeaderProps = {
  onRestart: () => void;
  onNewGame: () => void;
};

export default function GameHeader({ onRestart, onNewGame }: GameHeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <h1 className="text-logo-header md:text-logo-md">{SITE_NAME}</h1>
      <div className="flex gap-4 max-md:hidden">
        <Button
          variant="primary"
          onClick={onRestart}
          className="text-button-md h-13 px-7"
        >
          Restart
        </Button>
        <Button
          variant="secondary"
          onClick={onNewGame}
          className="text-button-md h-13 px-6"
        >
          New Game
        </Button>
      </div>
      <GameMenu onRestart={onRestart} onNewGame={onNewGame} />
    </header>
  );
}
