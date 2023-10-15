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
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

export default function AddTournamentDialog() {
  const closeRef = useRef(null);
  const { user, error, isLoading } = useUser();

  return (
    <>
      {user ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size={"icon"}
              className="rounded-full z-10 text-lg w-14 h-14 fixed right-8 bottom-8 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-75"
            >
              <Plus />
            </Button>
          </DialogTrigger>
          <DialogContent className="h-full w-full md:h-auto overflow-y-auto">
            <DialogHeader>
              <DialogTitle>New Tournament</DialogTitle>
              <DialogDescription>Define a new tournament</DialogDescription>
            </DialogHeader>
            <AddTournamentForm closeRef={closeRef} />
          </DialogContent>
          <DialogClose ref={closeRef} />
        </Dialog>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size={"icon"}
              className="rounded-full z-10 text-lg w-14 h-14 fixed right-8 bottom-8 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-75"
            >
              <Plus />
            </Button>
          </DialogTrigger>
          <DialogContent className="h-full w-full md:h-auto overflow-y-auto">
            <DialogHeader>
              <DialogTitle>New Tournament</DialogTitle>
              <DialogDescription>Define a new tournament</DialogDescription>
            </DialogHeader>
            You need to be logged in to create a tournament.
            <Button asChild>
              <Link href="/api/auth/login">Login</Link>
            </Button>
          </DialogContent>
          <DialogClose ref={closeRef} />
        </Dialog>
      )}
    </>
  );
}
