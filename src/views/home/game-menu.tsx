import { Button, Dialog } from "@/components/ui";
import { useRef } from "react";

type GameMenuProps = {
  onRestart: () => void;
  onNewGame: () => void;
  onOpen: () => void;
  onClose: () => void;
};

export default function GameMenu({
  onRestart,
  onNewGame,
  onOpen,
  onClose,
}: GameMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const resumeRef = useRef<HTMLButtonElement>(null);

  function openMenu() {
    dialogRef.current?.showModal();
    resumeRef.current?.focus();
    onOpen();
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
        className="h-10 px-4.5 text-menu md:hidden"
      >
        Menu
      </Button>
      <Dialog
        ref={dialogRef}
        aria-label="Menu"
        closedby="any"
        onClose={onClose}
        className="gap-4 p-6 open:grid"
      >
        <Button
          variant="primary"
          onClick={restart}
          className="h-12 text-button"
        >
          Restart
        </Button>
        <Button
          variant="secondary"
          onClick={startNewGame}
          className="h-12 text-button"
        >
          New Game
        </Button>
        <Button
          ref={resumeRef}
          variant="secondary"
          onClick={closeMenu}
          className="h-12 text-button"
        >
          Resume Game
        </Button>
      </Dialog>
    </>
  );
}
