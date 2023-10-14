import AddTournamentDialog from "@/components/AddTournamentDialog";
import { Suspense } from "react";
import Tournaments from "@/components/Tournaments";
import TournamentLoading from "@/components/TournamentLoading";

export default async function Home() {
  return (
    <>
      <main className="min-h-screen p-8">
        <AddTournamentDialog />
        <div className="max-w-xl mx-auto">
          <h1 className="text-4xl font-bold mb-5">Tournaments</h1>
          <Suspense fallback={<TournamentLoading />}>
            <Tournaments />
          </Suspense>
        </div>
      </main>
    </>
  );
}
