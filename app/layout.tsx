import Header from "@/components/Header";
import "./globals.css";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { Toaster } from "react-hot-toast";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WEB2 - Round Robin",
  description:
    "Web app by Fran Markulin for the 1st project assignment of the course WEB2",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={spaceGrotesk.className}>
        <Toaster />
        <Header />
        <main className="min-h-screen p-8 selection:bg-primary selection:text-primary-foreground">
          {children}
        </main>
      </body>
    </html>
  );
}
