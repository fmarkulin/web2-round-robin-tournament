import AdminTable from "@/components/AdminTable";
import CopyToClipboard from "@/components/CopyToClipboard";
import PlayerTable from "@/components/PlayerTable";
import PublicTable from "@/components/PublicTable";
import { db } from "@/data/firebase";
import { getSession } from "@auth0/nextjs-auth0";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { notFound } from "next/navigation";

const getTournament = async (slug: string) => {
  const tournamentRef = doc(db, "tournaments", slug);
  const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));
  await wait(500); // simulate network delay
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
        for (let pairDoc of firestorePairsSnapshots.docs) {
          pairs.push(pairDoc.data() as Pair);
        }
        rounds.push({ id: Number(roundDoc.id), pairs });
      }
      const tournament: Tournament = {
        userSub: data.userSub,
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

  const session = await getSession();
  const { user } = session || {};
  const { rounds, players } = tournament;

  return (
    <>
      <div className="flex gap-4 items-center">
        <h1 className="text-4xl text font-bold">{tournament.title}</h1>
        <CopyToClipboard />
      </div>
      <h4 className="text-2xl text-slate-500 font-medium mb-5">
        {tournament.pointSystem.charAt(0).toUpperCase() +
          tournament.pointSystem.slice(1)}
      </h4>
      <div className="flex flex-col justify-between gap-16 md:flex-row md:gap-4">
        <div className="flex flex-col gap-10">
          {rounds.map((round, index) => (
            <div key={round.id}>
              <h2 className="text-xl font-medium mb-2">
                Round {index + 1} - {round.pairs.length} matches
              </h2>
              <div className="flex gap-4 flex-wrap">
                {round.pairs.map((pair, index) => {
                  if (user && user.sub === tournament.userSub) {
                    return (
                      <AdminTable
                        key={"" + round.id + pair.id}
                        tournamentSlug={tournament.slug}
                        roundId={round.id}
                        pair={pair}
                        players={players}
                        index={index}
                      />
                    );
                  } else {
                    return (
                      <PublicTable
                        pair={pair}
                        players={players}
                        index={index}
                      />
                    );
                  }
                })}
              </div>
            </div>
          ))}
        </div>
        <PlayerTable
          pointSystem={tournament.pointSystem}
          rounds={rounds}
          players={players}
        />
      </div>
    </>
  );
}
