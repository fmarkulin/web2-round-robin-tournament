import { db } from "@/data/firebase";
import { collection, getDoc, getDocs } from "firebase/firestore";
import TournamentIndexCard from "./TournamentIndexCard";

const getTournaments = async () => {
  const tournamentSnapshots = await getDocs(collection(db, "tournaments"));
  const tournaments: Tournament[] = [];
  tournamentSnapshots.forEach(async (doc) => {
    const data = doc.data();
    const firestoreRounds = await getDocs(
      collection(db, "tournaments", doc.id, "rounds")
    );
    let rounds: Round[] = [];
    firestoreRounds.forEach(async (round) => {
      const pairs: Pair[] = [];
      const firestorePairs = await getDocs(
        collection(db, "rounds", round.id, "pairs")
      );
      firestorePairs.forEach((pair) => {
        pairs.push(pair.data() as Pair);
      });
      rounds.push({ id: Number(round.id), pairs });
    });
    const tournament: Tournament = {
      slug: doc.id,
      title: data.title,
      pointSystem: data.pointSystem,
      timestamp: data.timestamp,
      rounds,
      players: data.players,
    };
    tournaments.push(tournament);
  });
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
