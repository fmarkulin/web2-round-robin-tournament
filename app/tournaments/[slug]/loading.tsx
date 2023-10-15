import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export default function TournamentLoading() {
  return (
    <div className="max-w-7xl mx-auto">
      <Skeleton className="w-4/5 sm:w-[500px] h-[45px] mb-1" />
      <Skeleton className="w-[120px] h-[35px] mb-6" />
      <div className="flex flex-col justify-between gap-16 md:flex-row md:gap-4">
        <div className="flex flex-col gap-10">
          {Array.from({ length: 3 }, (_, i) => i + 1).map((_, index) => (
            <div key={index}>
              <Skeleton className="w-[150px] h-[25px] mb-2" />
              <div className="flex gap-4 flex-wrap">
                {Array.from({ length: 2 }, (_, i) => i + 1).map((_, index) => (
                  <Table className="border-2" key={index}>
                    <TableCaption>
                      <Skeleton className="w-[60px] h-[20px]" />
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Player</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Skeleton className="w-[115px] h-[20px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="w-[80px] h-[20px]" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Skeleton className="w-[115px] h-[20px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="w-[80px] h-[20px]" />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Table className="border-2 w-auto mx-auto">
          <TableCaption>
            <h5 className="text-lg font-medium mb-2">Current lineup</h5>
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead>Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 4 }, (_, i) => i + 1).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="w-[115px] h-[20px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-[20px] h-[20px]" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
