import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import AddTournamentForm from "./AddTournamentForm";

export default function AddTournamentDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size={"icon"}
          className="rounded-full text-lg w-14 h-14 absolute right-8 bottom-8"
        >
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Tournament</DialogTitle>
          <DialogDescription>Define a new tournament</DialogDescription>
          <AddTournamentForm />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
