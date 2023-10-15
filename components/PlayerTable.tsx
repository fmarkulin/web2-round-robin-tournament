import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export default function PlayerTable({
  pointSystem,
  rounds,
  players,
}: {
  pointSystem: "football" | "basketball" | "chess";
  rounds: Round[];
  players: Player[];
}) {
  console.log("rounds", rounds);
  (() => {
    for (let round of rounds) {
      console.log("round", round);
      for (let pair of round.pairs) {
        console.log("pair", pair);
        if (pair.p1 !== null && pair.p2 !== null) {
          console.log("p1 and p2 exist");
          const p1 = players.find((player) => player.id === pair.p1);
          const p2 = players.find((player) => player.id === pair.p2);
          if (p1 && p2) {
            if (pair.winner === 1) {
              p1.points +=
                pointSystem === "football"
                  ? 3
                  : pointSystem === "basketball"
                  ? 2
                  : 1;
              p2.points +=
                pointSystem === "football"
                  ? 0
                  : pointSystem === "basketball"
                  ? 1
                  : 0;
            } else if (pair.winner === 2) {
              p2.points +=
                pointSystem === "football"
                  ? 3
                  : pointSystem === "basketball"
                  ? 2
                  : 1;
              p1.points +=
                pointSystem === "football"
                  ? 0
                  : pointSystem === "basketball"
                  ? 1
                  : 0;
            } else if (pair.winner === 0) {
              p1.points +=
                pointSystem === "football"
                  ? 1
                  : pointSystem === "basketball"
                  ? 0
                  : 0.5;
              p2.points +=
                pointSystem === "football"
                  ? 1
                  : pointSystem === "basketball"
                  ? 0
                  : 0.5;
            } else {
              console.log("not played");
            }
          }
        } else if (pair.p1 !== null) {
          console.log("p1 exists");
          const p1 = players.find((player) => player.id === pair.p1);
          if (p1) {
            p1.points +=
              pointSystem === "football"
                ? 3
                : pointSystem === "basketball"
                ? 2
                : 1;
          }
        } else if (pair.p2 !== null) {
          console.log("p2 exists");
          const p2 = players.find((player) => player.id === pair.p2);
          if (p2) {
            p2.points +=
              pointSystem === "football"
                ? 3
                : pointSystem === "basketball"
                ? 2
                : 1;
          }
        }
        console.log("players", players);
      }
    }
  })();

  return (
    <Table className="border-2 w-auto mx-auto">
      <TableCaption>
        <h5 className="text-lg font-medium mb-2">Current lineup</h5>
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Player</TableHead>
          <TableHead>Points</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players
          .sort((a, b) => b.points - a.points)
          .map((player) => (
            <TableRow>
              <TableCell>{player.name}</TableCell>
              <TableCell>{player.points}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
