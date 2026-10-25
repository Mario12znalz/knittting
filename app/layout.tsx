import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Threadkind — thoughtful tools for makers",
  description: "Yarn-friendly project kits and thoughtful tools for knitting and crochet.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}