import { isFinished, playerName, type Game } from "@/lib";

type MoveStatusProps = {
  game: Game;
};

function describeMove(game: Game) {
  if (game.lastMove === null) return "";

  const result = game.lastMove === "match" ? "Match." : "No match.";
  if (game.settings.players === 1 || isFinished(game)) return result;
  return `${result} ${playerName(game.turn)}'s turn.`;
}

export default function MoveStatus({ game }: MoveStatusProps) {
  return (
    <p role="status" className="sr-only">
      {describeMove(game)}
    </p>
  );
}
