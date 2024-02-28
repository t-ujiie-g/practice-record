import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
// import { supabase } from '@/utils/supabaseClient'

import type {Database} from '@/lib/database.types';
 
const HomePage = async () => {
  // セッションの取得
  const supabase = createServerComponentClient<Database>({
    cookies,
  })

  const {
    data: {session},
  } = await supabase.auth.getSession()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {session ? (
      <div className="space-y-4">
        <Link href="/submit" className="text-2xl bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-6 rounded">
            登録
        </Link>
        <Link href="/record" className="text-2xl bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 m-6 rounded">
            記録
        </Link>
      </div>
      ) : (
        <div className="space-y-4">
          <p>未ログイン</p>
        </div>
      )}
    </div>
  );
};


export default HomePage;