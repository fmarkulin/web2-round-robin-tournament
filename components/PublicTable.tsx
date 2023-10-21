import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export default function PublicTable({
  pair,
  players,
  index,
}: {
  pair: Pair;
  players: Player[];
  index: number;
}) {
  return (
    <Table className="border-2">
      <TableCaption>{`Pair ${index + 1}`}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Player</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>
            {pair.p1 !== null ? players[pair.p1].name : <i>bye</i>}
          </TableCell>
          <TableCell>
            <Badge
              className={
                (pair.winner === 1
                  ? "bg-green-500 hover:bg-green-400"
                  : pair.winner === 0
                  ? "bg-sky-500 hover:bg-sky-400"
                  : pair.winner === null
                  ? "bg-muted text-muted-foreground hover:bg-muted hover:text-muted-foreground"
                  : "bg-destructive hover:bg-destructive") +
                " hover:cursor-default"
              }
            >
              {pair.winner === 1
                ? "winner"
                : pair.winner === 0
                ? "draw"
                : pair.winner === null
                ? "pending"
                : "loser"}
            </Badge>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            {pair.p2 !== null ? players[pair.p2].name : <i>bye</i>}
          </TableCell>
          <TableCell>
            <Badge
              className={
                (pair.winner === 2
                  ? "bg-green-500 hover:bg-green-400"
                  : pair.winner === 0
                  ? "bg-sky-500 hover:bg-sky-400"
                  : pair.winner === null
                  ? "bg-muted text-muted-foreground hover:bg-muted hover:text-muted-foreground"
                  : "bg-destructive hover:bg-destructive") +
                " hover:cursor-default"
              }
            >
              {pair.winner === 2
                ? "winner"
                : pair.winner === 0
                ? "draw"
                : pair.winner === null
                ? "pending"
                : "loser"}
            </Badge>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
