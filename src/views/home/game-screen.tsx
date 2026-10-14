import { SITE_NAME } from "@/data";

type GameScreenProps = {
  onNewGame: () => void;
};

export default function GameScreen({ onNewGame }: GameScreenProps) {
  return (
    <main className="flex min-h-dvh items-start justify-between p-6">
      <h1 className="text-logo md:text-logo-md">{SITE_NAME}</h1>
      <button
        type="button"
        onClick={onNewGame}
        className="bg-cloud text-button text-navy md:text-button-md h-10 rounded-full px-5"
      >
        New Game
      </button>
    </main>
  );
}
