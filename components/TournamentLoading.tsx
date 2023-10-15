import { Table } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import {
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export default function TournamentLoading() {
  return (
    <div className="max-w-7xl mx-auto">
      <Skeleton className="w-[300px] h-[50px]" />
      <Skeleton className="w-[80px] h-[45px]" />
      <div className="flex">
        <div className="flex flex-col gap-10">
          {Array.from({ length: 4 }, (_, i) => i + 1).map((_, index) => (
            <div key={index}>
              <Skeleton className="w-[150px] h-[45px]" />
              <div className="flex gap-4">
                {Array.from({ length: 2 }, (_, i) => i + 1).map((_, index) => (
                  <Table className="border-2" key={index}>
                    <TableCaption>
                      <Skeleton className="w-[150px] h-[45px]" />
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Player</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Skeleton className="w-[50px] h-[45px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="w-[150px] h-[45px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="w-[45px] h-[45px]" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Skeleton className="w-[50px] h-[45px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="w-[150px] h-[45px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="w-[45px] h-[45px]" />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
