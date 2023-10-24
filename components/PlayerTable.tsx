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
  pointSystem: PointSystem;
  rounds: Round[];
  players: Player[];
}) {
  (() => {
    for (let round of rounds) {
      for (let pair of round.pairs) {
        if (pair.p1 !== null && pair.p2 !== null) {
          const p1 = players.find((player) => player.id === pair.p1);
          const p2 = players.find((player) => player.id === pair.p2);
          if (p1 && p2) {
            if (pair.winner === 1) {
              p1.points += pointSystem.win;
              p2.points += pointSystem.loss;
            } else if (pair.winner === 2) {
              p2.points += pointSystem.win;
              p1.points += pointSystem.loss;
            } else if (pair.winner === 0) {
              p1.points += pointSystem.draw;
              p2.points += pointSystem.draw;
            }
          }
        }
      }
    }
  })();

  return (
    <Table className="border-2">
      <TableCaption>
        <h5 className="text-lg font-medium mb-2">Current lineup</h5>
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nº</TableHead>
          <TableHead>Player</TableHead>
          <TableHead>Points</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players
          .sort((a, b) => b.points - a.points)
          .map((player) => (
            <TableRow key={player.id}>
              <TableCell className="text-muted-foreground">
                {`#${player.id + 1}`}
              </TableCell>
              <TableCell>{player.name}</TableCell>
              <TableCell>{player.points}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
