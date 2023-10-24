import AddTournamentDialog from "@/components/AddTournamentDialog";
import Tournaments from "@/components/Tournaments";

export default async function Home() {
  return (
    <>
      <AddTournamentDialog />
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-bold mb-5">My Tournaments</h1>
        <Tournaments />
      </div>
    </>
  );
}
