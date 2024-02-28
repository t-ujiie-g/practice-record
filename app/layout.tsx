import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from 'next/link';
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
        {/* <header className="bg-gray-700 text-white p-6 z-50 fixed top-0 left-0 right-0">
          <div className="container mx-auto flex items-center fixed top-2 left-10 right-10">
            <Link href="/">
              <h1 className="text-lg font-bold mr-10">aPra</h1>
            </Link>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link href="/submit" className="hover:text-blue-200">
                    登録
                  </Link>
                </li>
                <li>
                  <Link href="/record" className="hover:text-blue-200">
                    記録
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header> */}
        <main className="flex-grow container p-4 pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}