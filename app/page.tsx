import AddTournamentDialog from "@/components/AddTournamentDialog";
import { Suspense } from "react";
import Tournaments from "@/components/Tournaments";
import TournamentsLoading from "@/components/TournamentsLoading";

export default async function Home() {
  return (
    <>
      <AddTournamentDialog />
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-bold mb-5">My Tournaments</h1>
        <Suspense fallback={<TournamentsLoading />}>
          <Tournaments />
        </Suspense>
      </div>
    </>
  );
}
