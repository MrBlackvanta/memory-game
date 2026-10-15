import { Button } from "@/components/ui";
import { useRef } from "react";

type GameMenuProps = {
  onRestart: () => void;
  onNewGame: () => void;
};

export default function GameMenu({ onRestart, onNewGame }: GameMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const resumeRef = useRef<HTMLButtonElement>(null);

  function openMenu() {
    dialogRef.current?.showModal();
    resumeRef.current?.focus();
  }

  function closeMenu() {
    dialogRef.current?.close();
  }

  function restart() {
    closeMenu();
    onRestart();
  }

  function startNewGame() {
    closeMenu();
    onNewGame();
  }

  return (
    <>
      <Button
        variant="primary"
        onClick={openMenu}
        className="text-menu h-10 px-4.5 md:hidden"
      >
        Menu
      </Button>
      <dialog
        ref={dialogRef}
        aria-label="Menu"
        closedby="any"
        className="bg-dialog rounded-card inset-x-6 m-auto w-auto max-w-163.5 gap-4 p-6 backdrop:bg-black/50 open:grid motion-safe:backdrop:transition-colors starting:backdrop:bg-transparent"
      >
        <Button
          variant="primary"
          onClick={restart}
          className="text-button h-12"
        >
          Restart
        </Button>
        <Button
          variant="secondary"
          onClick={startNewGame}
          className="text-button h-12"
        >
          New Game
        </Button>
        <Button
          ref={resumeRef}
          variant="secondary"
          onClick={closeMenu}
          className="text-button h-12"
        >
          Resume Game
        </Button>
      </dialog>
    </>
  );
}
