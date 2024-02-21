import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from 'next/link';
import "./globals.css";

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
        <header className="bg-gray-700 text-white p-6">
          <div className="container mx-auto flex items-center fixed top-2 left-10 right-10 z-100">
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
        </header>
        <main className="flex-grow container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}