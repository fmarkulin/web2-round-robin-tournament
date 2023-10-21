import { db } from "@/data/firebase";
import { collection, getDocs } from "firebase/firestore";
import TournamentIndexCard from "./TournamentIndexCard";
import { getSession } from "@auth0/nextjs-auth0";

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
  const session = await getSession();
  const { user } = session || {};

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
