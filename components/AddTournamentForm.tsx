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
import { RefObject, useState } from "react";
import { Timestamp, doc, getDoc, writeBatch } from "firebase/firestore";
import { db } from "@/data/firebase";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import { useUser } from "@auth0/nextjs-auth0/client";
import { roundRobinTournament } from "@/lib/utils";
import { RefreshCcw } from "lucide-react";

const generate4DigitId = () => {
  return Math.floor(Math.random() * 1000)
    .toString()
    .padStart(4, "0");
};

export default function AddTournamentForm({
  closeRef,
}: {
  closeRef: RefObject<HTMLElement>;
}) {
  const router = useRouter();
  const { user } = useUser();

  const schema = z.object({
    title: z
      .string()
      .min(3, {
        message: "Title must contain at least 3 alphanumeric character",
      })
      .refine(
        (value) => {
          let newSlug = slugify(value, {
            lower: true,
            strict: true,
          });
          if (newSlug.length < 3) {
            setSlug("");
            return false;
          }

          // const slugId = generate4DigitId();
          newSlug = `${newSlug}-${slugId}`;
          setSlug(newSlug);

          return true;
        },
        {
          message: "Title must contain at least 3 alphanumeric character",
        }
      )
      .refine(
        async (value) => {
          let newSlug = slugify(value, {
            lower: true,
            strict: true,
          });
          if (newSlug.length < 3) {
            setSlug("");
            return false;
          }

          // const slugId = generate4DigitId();
          newSlug = `${newSlug}-${slugId}`;

          if (newSlug.length === 0) {
            return false;
          }
          const tournamentRef = doc(db, "tournaments", newSlug);
          try {
            const tournamentSnapshot = await getDoc(tournamentRef);
            if (tournamentSnapshot.exists()) {
              return false;
            }
            return true;
          } catch (error) {
            console.error(error);
            return false;
          }
        },
        {
          message:
            "Tournament with this title already exists. Regenerate the ID or choose a different title.",
        }
      ),
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
    pointSystem: z
      .string()
      .includes("/", {
        message: `Point system must be in the form of: win/draw/loss. Check for "/".`,
      })
      .refine(
        (value) => {
          const [win, draw, loss] = value.split("/");
          if (
            win === undefined ||
            win.length === 0 ||
            draw === undefined ||
            draw.length === 0 ||
            loss === undefined ||
            loss.length === 0
          ) {
            return false;
          }
          return true;
        },
        {
          message: `Point system must be in the form of: win/draw/loss. Check if you have all 3 values separated by "/".`,
        }
      )
      .refine(
        (value) => {
          const [win, draw, loss] = value.split("/");
          if (
            isNaN(Number(win)) ||
            isNaN(Number(draw)) ||
            isNaN(Number(loss))
          ) {
            return false;
          }
          return true;
        },
        {
          message: `Point system must be in the form of: win/draw/loss. Decimal values use dot (.) notation. Check if all 3 values are numbers.`,
        }
      ),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    reValidateMode: "onChange",
    delayError: 250,
    defaultValues: {
      title: "",
      players: "",
      pointSystem: "",
    },
    shouldUnregister: true,
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    const userToast = toast.loading("Checking user...");
    if (!user) {
      toast.dismiss(userToast);
      toast.error("You must be logged in to create a tournament.");
      return;
    }
    toast.dismiss(userToast);

    const { title, players, pointSystem } = values;

    const pointSystemToast = toast.loading("Formatting point system...");
    const [win, draw, loss] = pointSystem.split("/").map(Number);
    const formattedPointSystem: PointSystem = {
      win,
      draw,
      loss,
    };
    toast.dismiss(pointSystemToast);

    const playerToast = toast.loading("Formatting players...");
    const formattedPlayers: Player[] = players.split(";").map((player, i) => {
      return {
        id: i,
        name: player,
        points: 0,
      };
    });
    toast.dismiss(playerToast);

    const roundsToast = toast.loading("Creating rounds...");
    const rounds: Round[] = roundRobinTournament(formattedPlayers);
    toast.dismiss(roundsToast);

    const prepareToast = toast.loading("Preparing tournament...");
    const batch = writeBatch(db);

    const tournament = {
      slug,
      title,
      userSub: user.sub,
      players: formattedPlayers,
      pointSystem: formattedPointSystem,
      timestamp: Timestamp.now().toMillis(),
    };

    batch.set(doc(db, "tournaments", tournament.slug), tournament);

    rounds.forEach((round) => {
      const roundRef = doc(
        db,
        "tournaments",
        tournament.slug,
        "rounds",
        round.id.toString()
      );
      batch.set(roundRef, {
        id: round.id,
      });

      round.pairs.forEach((pair) => {
        const pairRef = doc(
          db,
          "tournaments",
          tournament.slug,
          "rounds",
          round.id.toString(),
          "pairs",
          pair.id.toString()
        );

        batch.set(pairRef, pair);
      });
    });

    const batchPromise = batch.commit();
    toast.promise(batchPromise, {
      loading: "Creating...",
      success: "Created!",
      error: "Error creating.",
    });
    toast.dismiss(prepareToast);

    try {
      await batchPromise;
      closeRef.current?.click();
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }

  const [slug, setSlug] = useState<string>("");
  const [slugId, setSlugId] = useState<string>(generate4DigitId);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <div className="flex justify-between gap-2">
              <FormItem className="grow">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Chess"
                    // onChange={(e) => setSlug(slugify(e.target.value))}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  URL:{" "}
                  <span className="font-mono">
                    {"/tournaments/"}
                    <span className="text-primary">{slug}</span>
                  </span>
                </FormDescription>
                <FormMessage />
              </FormItem>
              <FormItem>
                <FormLabel className="inline-flex gap-2">
                  ID{" "}
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    asChild
                    onClick={() => {
                      setSlugId(generate4DigitId);
                      setTimeout(() => {
                        form.trigger("title");
                      }, 150);
                    }}
                    className="active:scale-95 hover:cursor-pointer"
                  >
                    <RefreshCcw className="w-4 h-4 place-self-center" />
                  </Button>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="####"
                    value={slugId}
                    disabled
                    className="w-16"
                  />
                </FormControl>
              </FormItem>
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="players"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Players</FormLabel>
              <FormControl>
                <Input placeholder="John;Jane;..." {...field} />
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
              <FormLabel>Point system</FormLabel>
              <FormControl>
                <Input placeholder="1/0.5/0" {...field} />
              </FormControl>
              <FormDescription>
                Point system in the form of:{" "}
                <span className="font-mono">win/draw/loss</span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="hover:scale-105 active:scale-100 transition-all duration-75"
          type="submit"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
