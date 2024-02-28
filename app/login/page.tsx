'use client';

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database.types'

const HomePage = () => {
  const supabase = createClientComponentClient<Database>()

  return (
    <>
    <Auth
      supabaseClient={supabase}
      appearance={{theme: ThemeSupa}}
      providers={['google']}
      redirectTo='https://practice-record.vercel.app/auth/callback'
    />
    </>
  );
};

export default HomePage;