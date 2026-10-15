import { playerName } from "./game";

export type Standing = {
  player: number;
  score: number;
  winner: boolean;
};

export function rankPlayers(scores: readonly number[]): Standing[] {
  const best = Math.max(...scores);
  return scores
    .map((score, player) => ({ player, score, winner: score === best }))
    .toSorted((a, b) => b.score - a.score);
}

export function resultTitle(standings: readonly Standing[]) {
  const winners = standings.filter((standing) => standing.winner);
  return winners.length === 1
    ? `${playerName(winners[0].player)} Wins!`
    : "It’s a tie!";
}

export function pluralize(count: number, noun: string) {
  return count === 1 ? noun : `${noun}s`;
}
