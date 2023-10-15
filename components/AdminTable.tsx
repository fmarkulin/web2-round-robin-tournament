"use client";

import { MoreHorizontal } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/data/firebase";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AdminTable({
  tournamentSlug,
  roundId,
  pair,
  players,
  index,
}: {
  tournamentSlug: string;
  roundId: number;
  pair: Pair;
  players: Player[];
  index: number;
}) {
  const router = useRouter();

  const setWinner = async (winner: number) => {
    const updatePromise = updateDoc(
      doc(
        db,
        "tournaments",
        tournamentSlug,
        "rounds",
        roundId.toString(),
        "pairs",
        pair.id.toString()
      ),
      {
        winner: winner,
      }
    );
    toast.promise(updatePromise, {
      loading: "Updating...",
      success: "Updated!",
      error: "Error updating.",
    });

    try {
      await updatePromise;
      router.refresh();
    } catch (e) {
      console.log(e);
    }
  };

  const setDraw = async () => {
    const updatePromise = updateDoc(
      doc(
        db,
        "tournaments",
        tournamentSlug,
        "rounds",
        roundId.toString(),
        "pairs",
        pair.id.toString()
      ),
      {
        winner: 0,
      }
    );
    toast.promise(updatePromise, {
      loading: "Updating...",
      success: "Updated!",
      error: "Error updating.",
    });

    try {
      await updatePromise;
      router.refresh();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Table className="border-2">
      <TableCaption>{`Pair ${index + 1}`}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Player</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
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
                " hover:cursor-pointer"
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
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  disabled={pair.p1 === null || pair.p2 === null}
                  variant={"outline"}
                  size={"icon"}
                >
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Set Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="hover:cursor-pointer"
                  onClick={() => setWinner(1)}
                >
                  Winner
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:cursor-pointer"
                  onClick={() => setDraw()}
                >
                  Draw
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                " hover:cursor-pointer"
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
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  disabled={pair.p1 === null || pair.p2 === null}
                  variant={"outline"}
                  size={"icon"}
                >
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Set Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="hover:cursor-pointer"
                  onClick={() => setWinner(2)}
                >
                  Winner
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:cursor-pointer"
                  onClick={() => setDraw()}
                >
                  Draw
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
