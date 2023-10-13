import AddTournamentDialog from "@/components/AddTournamentDialog";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./data/firebase";

const getTournaments = async () => {
  const tournamentSnapshots = await getDocs(collection(db, "tournaments"));
  const tournaments = tournamentSnapshots.docs.map((doc) => doc.data());
  return tournaments;
}

export default async function Home() {
  const tournaments = await getTournaments();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <AddTournamentDialog />
    </main>
  );
}
