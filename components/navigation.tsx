'use client';

import Link from "next/link";
import type { Session } from "@supabase/auth-helpers-nextjs";
// Supabaseクライアントインスタンスをインポート（適切なパスに置き換えてください）
import { supabase } from '@/utils/supabaseClient';

const Navigation = ({ session }: { session: Session | null }) => {
  // ログアウト処理を行う関数
  const redirectUrl: string = process.env.NEXT_PUBLIC_APP_URL + "/auth/signout";
  const handleLogout = async () => {
    try {
      const response = await fetch(redirectUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 必要に応じて認証トークンなどを送信
        // credentials: 'include', // クッキーを含める場合
      });
      window.location.href = '/login';
  
      if (!response.ok) {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  return (
    <header className="bg-gray-700 text-white p-6 z-50 fixed top-0 left-0 right-0">
      <div className="container mx-auto flex items-center justify-between">
        {/* タイトル用のコンテナ */}
        <div>
          <Link href="/">
            <h1 className="text-lg font-bold">aPra</h1>
          </Link>
        </div>
        {/* ナビゲーション用のコンテナ */}
        <nav>
          <ul className="flex space-x-4">
            {session ? (
              <>
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
                <li>
                  <button onClick={handleLogout} className="hover:text-blue-200">
                    ログアウト
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link href="/login">ログイン</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;