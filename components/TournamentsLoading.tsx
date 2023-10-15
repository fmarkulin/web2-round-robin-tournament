import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function TournamentsLoading() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 2 }, (_, i) => i + 1).map((_, i) => (
        <Card
          key={i}
          className="shadow hover:shadow-md transition-all duration-200 "
        >
          <CardHeader>
            <Skeleton className="w-2/3 h-[30px] rounded-full" />
            <Skeleton className="w-[100px] h-[15px] rounded-full" />
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[205px] rounded-md border p-3">
              <Skeleton className="w-[80px] h-[20px] rounded-full mb-3" />
              {Array.from({ length: 4 }, (_, i) => i + 1).map((_, i) => (
                <div key={i}>
                  <Skeleton className="w-[150px] h-[20px] rounded-full" />
                  {i !== 3 && <Separator className="my-2" />}
                </div>
              ))}
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <Skeleton className="w-[80px] h-[40px] rounded-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
