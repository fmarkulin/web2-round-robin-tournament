"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { MutableRefObject, RefObject } from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/app/data/firebase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import toast from "react-hot-toast";

const schema = z.object({
  title: z
    .string()
    .min(3, "Tournament title must be at least 3 characters long"),
  players: z
    .string()
    .includes(";", {
      message: "Players must be separated by a semicolon (;)",
    })
    .refine(
      (value) =>
        value.split(";").length >= 4 &&
        value.split(";").length <= 8 &&
        value.split(";").every((player) => player.length > 0),
      {
        message:
          "Tournament must have at least 4 players and at most 8 players",
      }
    ),
  pointSystem: z.enum(["football", "chess", "basketball"], {
    required_error: "You must select a point system",
  }),
});

const kirkmanPairing = (n: number, r: number) => {
  // use fixating of first player
  const rounds: Round[] = [];

  // create array of pairs
  const indexes = [];
  for (let i = 0; i < n; i++) {
    indexes.push(i);
  }
  if (n % 2 === 1) {
    n++;
    indexes.push(null);
  }
  console.log(indexes);

  const indexPairs = [];
  for (let i = 0; i < n / 2; i++) {
    indexPairs.push(0 + "," + (n - 1 - i));
    for (let j = 1; j < n - 1; j++) {
      indexPairs.push(n - 1 - i - j + "," + j);
    }
  }
  console.log(indexPairs);

  return rounds;
};

export default function AddTournamentForm({
  closeRef,
}: {
  closeRef: RefObject<HTMLElement>;
}) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      players: "",
    },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    const { title, players, pointSystem } = values;
    console.log(pointSystem);

    const formattedPlayers: Player[] = players.split(";").map((player, i) => {
      return {
        id: i,
        name: player,
        points: 0,
      };
    });

    let numberOfRounds: number;
    switch (formattedPlayers.length) {
      case 8:
      case 7:
        numberOfRounds = 7;
        break;
      case 6:
      case 5:
        numberOfRounds = 5;
        break;
      default:
        numberOfRounds = 3;
        break;
    }

    const rounds: Round[] = [];

    for (let i = 0; i < numberOfRounds; i++) {
      let newRound: Round;
      if (formattedPlayers.length === 4) {
        if (i === 0) {
          const pair1: Pair = {
            id: 0,
            p1: 0,
            p2: 3,
            winner: null,
          };

          const pair2: Pair = {
            id: 1,
            p1: 1,
            p2: 2,
            winner: null,
          };

          newRound = {
            id: i,
            pairs: [pair1, pair2],
          };
        } else if (i === 1) {
          const pair1: Pair = {
            id: 0,
            p1: 0,
            p2: 1,
            winner: null,
          };

          const pair2: Pair = {
            id: 1,
            p1: 2,
            p2: 3,
            winner: null,
          };

          newRound = {
            id: i,
            pairs: [pair1, pair2],
          };
        } else {
          const pair1: Pair = {
            id: 0,
            p1: 0,
            p2: 2,
            winner: null,
          };

          const pair2: Pair = {
            id: 1,
            p1: 3,
            p2: 1,
            winner: null,
          };

          newRound = {
            id: i,
            pairs: [pair1, pair2],
          };
        }
      } else if (formattedPlayers.length === 5) {
        if (i === 0) {
          const pair1: Pair = {
            id: 0,
            p1: 0,
            p2: 4,
            winner: null,
          };

          const pair2: Pair = {
            id: 1,
            p1: 1,
            p2: 3,
            winner: null,
          };

          const pair3: Pair = {
            id: 2,
            p1: 2,
            p2: null,
            winner: 1,
          };

          newRound = {
            id: i,
            pairs: [pair1, pair2, pair3],
          };
        } else if (i === 1) {
          const pair1: Pair = {
            id: 0,
            p1: 0,
            p2: 1,
            winner: null,
          };

          const pair2: Pair = {
            id: 1,
            p1: 2,
            p2: 4,
            winner: null,
          };

          const pair3: Pair = {
            id: 2,
            p1: null,
            p2: 3,
            winner: 2,
          };

          newRound = {
            id: i,
            pairs: [pair1, pair2, pair3],
          };
        } else if (i === 2) {
          const pair1: Pair = {
            id: 0,
            p1: 0,
            p2: 2,
            winner: null,
          };

          const pair2: Pair = {
            id: 1,
            p1: null,
            p2: 1,
            winner: 2,
          };

          const pair3: Pair = {
            id: 2,
            p1: 3,
            p2: 4,
            winner: null,
          };

          newRound = {
            id: i,
            pairs: [pair1, pair2, pair3],
          };
        } else if (i === 3) {
          const pair1: Pair = {
            id: 0,
            p1: 0,
            p2: null,
            winner: 1,
          };

          const pair2: Pair = {
            id: 1,
            p1: 3,
            p2: 2,
            winner: null,
          };

          const pair3: Pair = {
            id: 2,
            p1: 4,
            p2: 1,
            winner: null,
          };

          newRound = {
            id: i,
            pairs: [pair1, pair2, pair3],
          };
        } else {
          const pair1: Pair = {
            id: 0,
            p1: 0,
            p2: 3,
            winner: null,
          };

          const pair2: Pair = {
            id: 1,
            p1: 4,
            p2: null,
            winner: 1,
          };

          const pair3: Pair = {
            id: 2,
            p1: 1,
            p2: 2,
            winner: null,
          };

          newRound = {
            id: i,
            pairs: [pair1, pair2, pair3],
          };
        }
      } else if (formattedPlayers.length === 6) {
        if (i === 0) {
          const pair1: Pair = {
            id: 0,
            p1: 0,
            p2: 5,
            winner: null,
          };

          const pair2: Pair = {
            id: 1,
            p1: 1,
            p2: 4,
            winner: null,
          };

          const pair3: Pair = {
            id: 2,
            p1: 2,
            p2: 3,
            winner: null,
          };

          newRound = {
            id: i,
            pairs: [pair1, pair2, pair3],
          };
        } else if (i === 1) {
          const pair1: Pair = {
            id: 0,
            p1: 0,
            p2: 1,
            winner: null,
          };

          const pair2: Pair = {
            id: 1,
            p1: 2,
            p2: 5,
            winner: null,
          };

          const pair3: Pair = {
            id: 2,
            p1: 3,
            p2: 4,
            winner: null,
          };

          newRound = {
            id: i,
            pairs: [pair1, pair2, pair3],
          };
        } else if (i === 2) {
          const pair1: Pair = {
            id: 0,
            p1: 0,
            p2: 2,
            winner: null,
          };

          const pair2: Pair = {
            id: 1,
            p1: 3,
            p2: 1,
            winner: null,
          };

          const pair3: Pair = {
            id: 2,
            p1: 4,
            p2: 5,
            winner: null,
          };

          newRound = {
            id: i,
            pairs: [pair1, pair2, pair3],
          };
        } else if (i === 3) {
          const pair1: Pair = {
            id: 0,
            p1: 0,
            p2: 3,
            winner: null,
          };

          const pair2: Pair = {
            id: 1,
            p1: 4,
            p2: 2,
            winner: null,
          };

          const pair3: Pair = {
            id: 2,
            p1: 5,
            p2: 1,
            winner: null,
          };

          newRound = {
            id: i,
            pairs: [pair1, pair2, pair3],
          };
        } else {
          const pair1: Pair = {
            id: 0,
            p1: 0,
            p2: 4,
            winner: null,
          };

          const pair2: Pair = {
            id: 1,
            p1: 5,
            p2: 3,
            winner: null,
          };

          const pair3: Pair = {
            id: 2,
            p1: 1,
            p2: 2,
            winner: null,
          };

          newRound = {
            id: i,
            pairs: [pair1, pair2, pair3],
          };
        }
      } else if (formattedPlayers.length === 7) {
        if (i === 0) {
          const pair1: Pair = {
            id: 0,
            p1: 0,
            p2: 6,
            winner: null,
          };

          const pair2: Pair = {
            id: 1,
            p1: 1,
            p2: 5,
            winner: null,
          };

          const pair3: Pair = {
            id: 2,
            p1: 2,
            p2: 4,
            winner: null,
          };

          const pair4: Pair = {
            id: 3,
            p1: 3,
            p2: null,
            winner: 1,
          };

          newRound = {
            id: i,
            pairs: [pair1, pair2, pair3, pair4],
          };
        } else if (i === 1) {
          const pair1: Pair = {
            id: 0,
            p1: 0,
            p2: 1,
            winner: null,
          };

          const pair2: Pair = {
            id: 1,
            p1: 2,
            p2: 6,
            winner: null,
          };

          const pair3: Pair = {
            id: 2,
            p1: 3,
            p2: 5,
            winner: null,
          };

          const pair4: Pair = {
            id: 3,
            p1: null,
            p2: 4,
            winner: 2,
          };

          newRound = {
            id: i,
            pairs: [pair1, pair2, pair3, pair4],
          };
        } else if (i === 2) {
          const pair1: Pair = {
            id: 0,
            p1: 0,
            p2: 2,
            winner: null,
          };

          const pair2: Pair = {
            id: 1,
            p1: 3,
            p2: 1,
            winner: null,
          };

          const pair3: Pair = {
            id: 2,
            p1: null,
            p2: 6,
            winner: 2,
          };

          const pair4: Pair = {
            id: 3,
            p1: 4,
            p2: 5,
            winner: null,
          };

          newRound = {
            id: i,
            pairs: [pair1, pair2, pair3, pair4],
          };
        } else if (i === 3) {
          const pair1: Pair = {
            id: 0,
            p1: 0,
            p2: 3,
            winner: null,
          };

          const pair2: Pair = {
            id: 1,
            p1: null,
            p2: 2,
            winner: 2,
          };

          const pair3: Pair = {
            id: 2,
            p1: 4,
            p2: 1,
            winner: null,
          };

          const pair4: Pair = {
            id: 3,
            p1: 5,
            p2: 6,
            winner: null,
          };

          newRound = {
            id: i,
            pairs: [pair1, pair2, pair3, pair4],
          };
        } else if (i === 4) {
          const pair1: Pair = {
            id: 0,
            p1: 0,
            p2: null,
            winner: 1,
          };

          const pair2: Pair = {
            id: 1,
            p1: 4,
            p2: 3,
            winner: null,
          };

          const pair3: Pair = {
            id: 2,
            p1: 5,
            p2: 2,
            winner: null,
          };

          const pair4: Pair = {
            id: 3,
            p1: 6,
            p2: 1,
            winner: null,
          };

          newRound = {
            id: i,
            pairs: [pair1, pair2, pair3, pair4],
          };
        } else if (i === 5) {
          const pair1: Pair = {
            id: 0,
            p1: 0,
            p2: 4,
            winner: null,
          };

          const pair2: Pair = {
            id: 1,
            p1: 5,
            p2: null,
            winner: 1,
          };

          const pair3: Pair = {
            id: 2,
            p1: 6,
            p2: 3,
            winner: null,
          };

          const pair4: Pair = {
            id: 3,
            p1: 1,
            p2: 2,
            winner: null,
          };

          newRound = {
            id: i,
            pairs: [pair1, pair2, pair3, pair4],
          };
        } else {
          const pair1: Pair = {
            id: 0,
            p1: 0,
            p2: 5,
            winner: null,
          };

          const pair2: Pair = {
            id: 1,
            p1: 6,
            p2: 4,
            winner: null,
          };

          const pair3: Pair = {
            id: 2,
            p1: 1,
            p2: null,
            winner: 1,
          };

          const pair4: Pair = {
            id: 3,
            p1: 2,
            p2: 3,
            winner: null,
          };

          newRound = {
            id: i,
            pairs: [pair1, pair2, pair3, pair4],
          };
        }
      } else {
        if (i === 0) {
          const pair1: Pair = {
            id: 0,
            p1: 0,
            p2: 7,
            winner: null,
          };

          const pair2: Pair = {
            id: 1,
            p1: 1,
            p2: 6,
            winner: null,
          };

          const pair3: Pair = {
            id: 2,
            p1: 2,
            p2: 5,
            winner: null,
          };

          const pair4: Pair = {
            id: 3,
            p1: 3,
            p2: 4,
            winner: null,
          };

          newRound = {
            id: i,
            pairs: [pair1, pair2, pair3, pair4],
          };
        } else if (i === 1) {
          const pair1: Pair = {
            id: 0,
            p1: 0,
            p2: 1,
            winner: null,
          };

          const pair2: Pair = {
            id: 1,
            p1: 2,
            p2: 7,
            winner: null,
          };

          const pair3: Pair = {
            id: 2,
            p1: 3,
            p2: 6,
            winner: null,
          };

          const pair4: Pair = {
            id: 3,
            p1: 4,
            p2: 5,
            winner: null,
          };

          newRound = {
            id: i,
            pairs: [pair1, pair2, pair3, pair4],
          };
        } else if (i === 2) {
          const pair1: Pair = {
            id: 0,
            p1: 0,
            p2: 2,
            winner: null,
          };

          const pair2: Pair = {
            id: 1,
            p1: 3,
            p2: 1,
            winner: null,
          };

          const pair3: Pair = {
            id: 2,
            p1: 4,
            p2: 7,
            winner: null,
          };

          const pair4: Pair = {
            id: 3,
            p1: 5,
            p2: 6,
            winner: null,
          };

          newRound = {
            id: i,
            pairs: [pair1, pair2, pair3, pair4],
          };
        } else if (i === 3) {
          const pair1: Pair = {
            id: 0,
            p1: 0,
            p2: 3,
            winner: null,
          };

          const pair2: Pair = {
            id: 1,
            p1: 4,
            p2: 2,
            winner: null,
          };

          const pair3: Pair = {
            id: 2,
            p1: 5,
            p2: 1,
            winner: null,
          };

          const pair4: Pair = {
            id: 3,
            p1: 6,
            p2: 7,
            winner: null,
          };

          newRound = {
            id: i,
            pairs: [pair1, pair2, pair3, pair4],
          };
        } else if (i === 4) {
          const pair1: Pair = {
            id: 0,
            p1: 0,
            p2: 4,
            winner: null,
          };

          const pair2: Pair = {
            id: 1,
            p1: 5,
            p2: 3,
            winner: null,
          };

          const pair3: Pair = {
            id: 2,
            p1: 6,
            p2: 2,
            winner: null,
          };

          const pair4: Pair = {
            id: 3,
            p1: 7,
            p2: 1,
            winner: null,
          };

          newRound = {
            id: i,
            pairs: [pair1, pair2, pair3, pair4],
          };
        } else if (i === 5) {
          const pair1: Pair = {
            id: 0,
            p1: 0,
            p2: 5,
            winner: null,
          };

          const pair2: Pair = {
            id: 1,
            p1: 6,
            p2: 4,
            winner: null,
          };

          const pair3: Pair = {
            id: 2,
            p1: 7,
            p2: 3,
            winner: null,
          };

          const pair4: Pair = {
            id: 3,
            p1: 1,
            p2: 2,
            winner: null,
          };

          newRound = {
            id: i,
            pairs: [pair1, pair2, pair3, pair4],
          };
        } else {
          const pair1: Pair = {
            id: 0,
            p1: 0,
            p2: 6,
            winner: null,
          };

          const pair2: Pair = {
            id: 1,
            p1: 7,
            p2: 5,
            winner: null,
          };

          const pair3: Pair = {
            id: 2,
            p1: 1,
            p2: 4,
            winner: null,
          };

          const pair4: Pair = {
            id: 3,
            p1: 2,
            p2: 3,
            winner: null,
          };

          newRound = {
            id: i,
            pairs: [pair1, pair2, pair3, pair4],
          };
        }
      }

      rounds.push(newRound);
    }

    const tournamentRef = doc(collection(db, "tournaments"));
    const tournament: Tournament = {
      id: tournamentRef.id,
      title,
      players: formattedPlayers,
      pointSystem,
      rounds,
    };

    const setPromise = setDoc(tournamentRef, tournament);
    toast.promise(setPromise, {
      loading: "Creating tournament...",
      success: "Tournament created!",
      error: "Error creating tournament",
    });

    try {
      await setPromise;
      closeRef.current?.click();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Chess" {...field} />
              </FormControl>
              <FormDescription>This is you tournament title.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="players"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Players</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none"
                  placeholder="John;Jane;..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                These are your tournament players.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pointSystem"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Players</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a point system" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="football">Football (3/1/0)</SelectItem>
                  <SelectItem value="chess">Chess (1/0,5/0)</SelectItem>
                  <SelectItem value="basketball">Basketball (2/0/1)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                These are your tournament players.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
