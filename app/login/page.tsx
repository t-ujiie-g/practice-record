'use client';

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database.types'

const HomePage = () => {
  const supabase = createClientComponentClient<Database>()
  const redirectUrl: string = process.env.NEXT_PUBLIC_APP_URL + "/auth/callback";
  console.log(redirectUrl);

  return (
    <>
    <Auth
      supabaseClient={supabase}
      appearance={{theme: ThemeSupa}}
      providers={['google']}
      // redirectTo={redirectUrl}
      redirectTo="https://practice-record-git-main-t-ujiies-projects.vercel.app/auth/callback"
    />
    </>
  );
};

export default HomePage;