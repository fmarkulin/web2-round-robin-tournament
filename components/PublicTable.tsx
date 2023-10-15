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
          <TableHead className="w-[100px]">Player</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>
            {pair.p1 !== null ? players[pair.p1].name : "bye"}
          </TableCell>
          <TableCell>
            <Badge>
              {pair.winner === 1
                ? "winner"
                : pair.winner === 0
                ? "draw"
                : pair.winner === null
                ? "pending"
                : ""}
            </Badge>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            {pair.p2 !== null ? players[pair.p2].name : "bye"}
          </TableCell>
          <TableCell>
            <Badge>
              {pair.winner === 1
                ? "winner"
                : pair.winner === 0
                ? "draw"
                : pair.winner === null
                ? "pending"
                : ""}
            </Badge>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
