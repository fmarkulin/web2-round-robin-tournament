import { Home } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { getSession } from "@auth0/nextjs-auth0";

export default async function Header() {
  const session = await getSession();
  const { user } = session || {};

  return (
    <header className="sticky bg-inherit top-0 left-0 right-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-8">
        <Link aria-label="Home page" href={"/"}>
          <Home className="w-8 h-8" />
        </Link>
        <div className="flex gap-4 items-center">
          <ModeToggle />
          {!user && (
            <Link href={"/api/auth/login"} className="font-bold">
              Login
            </Link>
          )}
          {user && (
            <Link href={"/api/auth/logout"} className="font-bold">
              Logout
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
