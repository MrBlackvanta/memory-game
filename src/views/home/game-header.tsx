import { Button } from "@/components/ui";
import { SITE_NAME } from "@/data";
import GameMenu from "./game-menu";

type GameHeaderProps = {
  onRestart: () => void;
  onNewGame: () => void;
  onMenuOpen: () => void;
  onMenuClose: () => void;
};

export default function GameHeader({
  onRestart,
  onNewGame,
  onMenuOpen,
  onMenuClose,
}: GameHeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <h1 className="text-logo-header md:text-logo-md">{SITE_NAME}</h1>
      <div className="flex gap-4 max-md:hidden">
        <Button
          variant="primary"
          onClick={onRestart}
          className="h-13 px-7 text-button-md"
        >
          Restart
        </Button>
        <Button
          variant="secondary"
          onClick={onNewGame}
          className="h-13 px-6 text-button-md"
        >
          New Game
        </Button>
      </div>
      <GameMenu
        onRestart={onRestart}
        onNewGame={onNewGame}
        onOpen={onMenuOpen}
        onClose={onMenuClose}
      />
    </header>
  );
}
