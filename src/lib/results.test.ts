import { describe, expect, it } from "vite-plus/test";
import { pluralize, rankPlayers, resultTitle, type Standing } from "./results";

function standing(player: number, score: number, winner = false): Standing {
  return { player, score, winner };
}

describe("rankPlayers", () => {
  it.each<[string, number[], Standing[]]>([
    [
      "puts a lone winner first",
      [4, 3, 8, 1],
      [standing(2, 8, true), standing(0, 4), standing(1, 3), standing(3, 1)],
    ],
    [
      "keeps tied winners in player order",
      [6, 3, 6, 1],
      [
        standing(0, 6, true),
        standing(2, 6, true),
        standing(1, 3),
        standing(3, 1),
      ],
    ],
    [
      "keeps tied losers in player order",
      [2, 5, 2],
      [standing(1, 5, true), standing(0, 2), standing(2, 2)],
    ],
    [
      "crowns everyone in a full tie",
      [4, 4],
      [standing(0, 4, true), standing(1, 4, true)],
    ],
    ["crowns a solo player", [8], [standing(0, 8, true)]],
  ])("%s", (_, scores, standings) => {
    expect(rankPlayers(scores)).toEqual(standings);
  });

  it("leaves the scores it ranks alone", () => {
    const scores = [1, 2, 3];

    rankPlayers(scores);

    expect(scores).toEqual([1, 2, 3]);
  });
});

describe("resultTitle", () => {
  it.each<[string, number[], string]>([
    ["names a lone winner", [4, 3, 8, 1], "Player 3 Wins!"],
    ["names the first player when they win", [5, 3], "Player 1 Wins!"],
    ["calls a shared lead a tie", [6, 3, 6, 1], "It’s a tie!"],
    ["calls a full tie a tie", [4, 4, 4], "It’s a tie!"],
  ])("%s", (_, scores, title) => {
    expect(resultTitle(rankPlayers(scores))).toBe(title);
  });
});

describe("pluralize", () => {
  it.each<[number, string, string]>([
    [0, "Move", "Moves"],
    [1, "Move", "Move"],
    [2, "Move", "Moves"],
    [1, "Pair", "Pair"],
    [8, "Pair", "Pairs"],
  ])("calls %i of a %s %s", (count, noun, word) => {
    expect(pluralize(count, noun)).toBe(word);
  });
});
