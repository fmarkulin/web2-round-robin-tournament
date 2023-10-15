import AdminTable from "@/components/AdminTable";
import { db } from "@/data/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { notFound } from "next/navigation";

const getTournament = async (slug: string) => {
  const tournamentRef = doc(db, "tournaments", slug);
  const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));
  await wait(1500); // simulate network delay
  try {
    const tournamentSnap = await getDoc(tournamentRef);
    if (tournamentSnap.exists()) {
      const data = tournamentSnap.data();
      const firestoreRoundsSnapshots = await getDocs(
        collection(db, "tournaments", slug, "rounds")
      );
      const rounds: Round[] = [];
      for (let roundDoc of firestoreRoundsSnapshots.docs) {
        const pairs: Pair[] = [];
        const firestorePairsSnapshots = await getDocs(
          collection(db, "tournaments", slug, "rounds", roundDoc.id, "pairs")
        );
        console.log("test");
        console.log(firestorePairsSnapshots.docs.length);
        for (let pairDoc of firestorePairsSnapshots.docs) {
          console.log("pairdoc", pairDoc.data());
          pairs.push(pairDoc.data() as Pair);
        }
        rounds.push({ id: Number(roundDoc.id), pairs });
      }
      const tournament: Tournament = {
        slug: tournamentSnap.id,
        title: data.title,
        pointSystem: data.pointSystem,
        timestamp: data.timestamp,
        rounds,
        players: data.players,
      };
      return tournament;
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
};

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const tournament = await getTournament(slug);
  if (!tournament) {
    notFound();
  }

  console.log("slug tournament log\n", tournament);

  const { rounds, players } = tournament;

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl text font-bold">{tournament.title}</h1>
      <h4 className="text-2xl text-slate-500 font-medium mb-5">
        {tournament.pointSystem.charAt(0).toUpperCase() +
          tournament.pointSystem.slice(1)}
      </h4>
      <div className="flex">
        <div className="flex flex-col gap-10">
          {rounds.map((round, index) => (
            <div>
              <h2 className="text-xl font-medium mb-2">
                Round {index + 1} - {round.pairs.length} matches
              </h2>
              <div className="flex gap-4">
                {round.pairs.map((pair, index) => (
                  <AdminTable
                    tournamentSlug={tournament.slug}
                    roundId={round.id}
                    pair={pair}
                    players={players}
                    index={index}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
