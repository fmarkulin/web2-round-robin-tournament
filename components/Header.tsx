"use client";

import { AlertCircle, Home } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useUser } from "@auth0/nextjs-auth0/client";
import AvatarLoading from "./AvatarLoading";

export default function Header() {
  const { user, isLoading, error } = useUser();

  return (
    <header className="sticky bg-inherit top-0 left-0 right-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-8">
        <Link aria-label="Home page" href={"/"}>
          <Home className="w-8 h-8" />
        </Link>
        <div className="flex gap-4 items-center">
          {isLoading && <AvatarLoading />}
          {!isLoading && error && (
            <AlertCircle className="w-8 h-8 stroke-destructive" />
          )}
          {!isLoading && !user && (
            <Link href={"/api/auth/login"} className="font-bold">
              Login
            </Link>
          )}
          {!isLoading && user && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarFallback>
                    {user.nickname?.[0] || user.email?.[0] || "u"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link
                  href={"/api/auth/logout"}
                  className="font-bold hover:cursor-pointer"
                  passHref
                >
                  <DropdownMenuItem className="hover:cursor-pointer">
                    Logout
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
