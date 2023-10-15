import { db } from "@/data/firebase";
import { collection, getDoc, getDocs } from "firebase/firestore";
import TournamentIndexCard from "./TournamentIndexCard";

const getTournaments = async () => {
  const tournamentSnapshots = await getDocs(collection(db, "tournaments"));
  const tournaments: Tournament[] = [];
  for (let doc of tournamentSnapshots.docs) {
    const data = doc.data();
    const firestoreRoundsSnapshots = await getDocs(
      collection(db, "tournaments", data.slug, "rounds")
    );
    const rounds: Round[] = [];
    for (let roundDoc of firestoreRoundsSnapshots.docs) {
      const pairs: Pair[] = [];
      const firestorePairsSnapshots = await getDocs(
        collection(db, "tournaments", data.slug, "rounds", roundDoc.id, "pairs")
      );
      for (let pairDoc of firestorePairsSnapshots.docs) {
        pairs.push(pairDoc.data() as Pair);
      }
      rounds.push({ id: Number(roundDoc.id), pairs });
    }
    const tournament: Tournament = {
      userSub: data.userSub,
      slug: data.slug,
      title: data.title,
      pointSystem: data.pointSystem,
      timestamp: data.timestamp,
      rounds,
      players: data.players,
    };
    tournaments.push(tournament);
  }
  const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));
  // await wait(500); // simulate network delay
  return tournaments.sort((a, b) => b.timestamp - a.timestamp);
};

export default async function Tournaments() {
  const tournaments: Tournament[] = await getTournaments();
  console.log(tournaments);

  return (
    <div className="flex flex-col gap-4">
      {tournaments.map((tournament) => (
        <TournamentIndexCard key={tournament.slug} tournament={tournament} />
      ))}
    </div>
  );
}