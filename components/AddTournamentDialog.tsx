"use client";

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
import { DialogClose } from "@radix-ui/react-dialog";
import { useRef } from "react";

export default function AddTournamentDialog() {
  const closeRef = useRef(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size={"icon"}
          className="rounded-full text-lg w-14 h-14 absolute right-8 bottom-8 shadow-lg hover:shadow-xl"
        >
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Tournament</DialogTitle>
          <DialogDescription>Define a new tournament</DialogDescription>
        </DialogHeader>
        <AddTournamentForm closeRef={closeRef} />
      </DialogContent>
      <DialogClose ref={closeRef} />
    </Dialog>
  );
}
