"use client";

import { db } from "@/data/firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import TournamentIndexCard from "./TournamentIndexCard";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";
import TournamentsLoading from "./TournamentsLoading";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from "lucide-react";

export default function Tournaments() {
  const { user, isLoading, error } = useUser();
  const [tournaments, setTournaments] = useState<
    Omit<Tournament, "rounds">[] | undefined
  >(undefined);

  // tournaments listener
  useEffect(() => {
    const ref = collection(db, "tournaments");
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const tournaments: Omit<Tournament, "rounds">[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        tournaments.push({
          userSub: data.userSub,
          slug: data.slug,
          title: data.title,
          pointSystem: data.pointSystem,
          timestamp: data.timestamp,
          players: data.players,
        });
      });
      setTournaments(tournaments);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading || tournaments === undefined) return <TournamentsLoading />;

  if (error)
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          An error occured. Please try again later by refreshing the page.
        </AlertDescription>
      </Alert>
    );

  if (!user)
    return (
      <div className="flex flex-col gap-4">
        Log in to see your tournaments or create a new one.
      </div>
    );

  const { sub } = user;
  const filteredTournaments = tournaments.filter(
    (tournament) => tournament.userSub === sub
  );

  return (
    <div className="flex flex-col gap-4">
      {filteredTournaments.length === 0 &&
        "No tournaments yet. Create one by clicking the button at the bottom right corner."}
      {filteredTournaments.map((tournament) => (
        <TournamentIndexCard key={tournament.slug} tournament={tournament} />
      ))}
    </div>
  );
}
