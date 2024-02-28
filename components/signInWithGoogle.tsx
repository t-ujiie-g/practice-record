'use client';

import { supabase } from '@/utils/supabaseClient'

const SignInWithGoogle = () => {
    const handleSignIn = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
        })
        if (error) console.error('Googleサインインエラー', error.message)
      }

    return (
        <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleSignIn}
        >
        Googleでサインイン
        </button>
    )
}

export default SignInWithGoogle