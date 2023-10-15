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
  tournament: Tournament;
}) {
  return (
    <Card className="shadow hover:shadow-md transition-all duration-200 ">
      <CardHeader>
        <CardTitle>{tournament.title}</CardTitle>
        <CardDescription>
          {tournament.pointSystem.charAt(0).toUpperCase() +
            tournament.pointSystem.slice(1)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[205px] rounded-md border p-3">
          <h4 className="mb-3 text-md font-medium leading-none ">Players</h4>
          {tournament.players.map((player, i) => (
            <div key={player.id}>
              <p>{player.name}</p>
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
        >
          <Link href={`/tournaments/${tournament.slug}`}>View</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}