import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function roundRobinTournament(players: Player[]) {
  const playersCopy = [...players];
  if (playersCopy.length % 2 === 1) {
    playersCopy.push({ name: "bye", id: playersCopy.length, points: 0 });
  }

  const numberOfRounds = playersCopy.length - 1;
  const half = playersCopy.length / 2;
  const rounds: Round[] = [];

  for (let i = 0; i < numberOfRounds; i++) {
    const round: Round = {
      id: i,
      pairs: [],
    };

    for (let j = 0; j < half; j++) {
      const p1 = playersCopy[j];
      const p2 = playersCopy[playersCopy.length - 1 - j];
      const pair: Pair = {
        id: j,
        p1: p1.name === "bye" ? null : p1.id,
        p2: p2.name === "bye" ? null : p2.id,
        winner: null,
      };

      round.pairs.push(pair);
    }
    rounds.push(round);

    playersCopy.splice(1, 0, playersCopy.pop()!);
  }

  return rounds;
}
