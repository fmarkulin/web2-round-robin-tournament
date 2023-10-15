import { Home } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="max-w-7xl mx-auto mt-6 mb-2 flex justify-between">
      <Link href={"/"}>
        <Home className="w-8 h-8" />
      </Link>
      <Link href={"#"} className="font-bold">
        Login
      </Link>
    </header>
  );
}
