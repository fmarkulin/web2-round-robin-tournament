import { db } from "@/data/firebase";
import { collection, getDocs } from "firebase/firestore";
import TournamentIndexCard from "./TournamentIndexCard";

const getTournaments = async () => {
  const tournamentSnapshots = await getDocs(collection(db, "tournaments"));
  const tournaments: Tournament[] = tournamentSnapshots.docs.map(
    (doc) => doc.data() as Tournament
  );
  const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));
  await wait(500); // simulate network delay
  return tournaments.sort((a, b) => b.timestamp - a.timestamp);
};

export default async function Tournaments() {
  const tournaments: Tournament[] = await getTournaments();

  return (
    <div className="flex flex-col gap-4">
      {tournaments.map((tournament) => (
        <TournamentIndexCard tournament={tournament} />
      ))}
    </div>
  );
}
