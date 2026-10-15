import { ICONS, type Settings } from "@/data";

export type Random = () => number;

export function shuffle<Item>(
  items: readonly Item[],
  random: Random = Math.random,
) {
  const shuffled = [...items];
  for (let last = shuffled.length - 1; last > 0; last--) {
    const pick = Math.floor(random() * (last + 1));
    [shuffled[last], shuffled[pick]] = [shuffled[pick], shuffled[last]];
  }
  return shuffled;
}

function pickFaces({ theme, gridSize }: Settings, random: Random) {
  const pairs = gridSize ** 2 / 2;
  if (theme === "numbers")
    return Array.from({ length: pairs }, (_, index) => index + 1);
  return shuffle([...ICONS.keys()], random).slice(0, pairs);
}

export function createDeck(settings: Settings, random: Random = Math.random) {
  const faces = pickFaces(settings, random);
  return shuffle([...faces, ...faces], random);
}
