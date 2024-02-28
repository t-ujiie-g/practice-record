'use client';

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database.types'

const HomePage = () => {
  const supabase = createClientComponentClient<Database>()
  const redirectUrl: string = process.env.APP_URL + "/auth/callback";

  return (
    <>
    <Auth
      supabaseClient={supabase}
      appearance={{theme: ThemeSupa}}
      providers={['google']}
      redirectTo={redirectUrl}
    />
    </>
  );
};

export default HomePage;