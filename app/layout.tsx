import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SupabaseListener from "@/components/supabase-listener";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Practice Record App",
  description: "Practice Record App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="flex flex-col">
        <SupabaseListener />
        <main className="flex-grow container p-4 pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}