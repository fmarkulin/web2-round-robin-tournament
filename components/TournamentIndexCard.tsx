import Link from "next/link";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

export default function TournamentIndexCard({
  tournament,
}: {
  tournament: Omit<Tournament, "rounds">;
}) {
  return (
    <Card className="shadow hover:shadow-md transition-all duration-200 ">
      <CardHeader>
        <CardTitle>
          {tournament.title}{" "}
          <span className="text-gray-400">
            #{tournament.slug.slice(tournament.slug.length - 4)}
          </span>
        </CardTitle>
        <CardDescription>
          {tournament.pointSystem.win}/{tournament.pointSystem.draw}/
          {tournament.pointSystem.loss}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[205px] rounded-md border p-3">
          <h4 className="mb-3 text-md font-medium leading-none ">Players</h4>
          {tournament.players.map((player, i) => (
            <div key={player.id}>
              <p>
                <span className="text-muted-foreground">{`#${
                  player.id + 1
                } `}</span>
                {player.name}
              </p>
              {i !== tournament.players.length - 1 && (
                <Separator className="my-2" />
              )}
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <Button
          className="hover:scale-105 active:scale-100 transition-all duration-75"
          asChild
          aria-label="View tournament"
        >
          <Link href={`/tournaments/${tournament.slug}`}>View</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
