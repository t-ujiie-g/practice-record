import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import type { Database } from '@/lib/database.types'
// import {supabase} from '@/utils/supabaseClient';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient<Database>({ req, res })

  // Refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser()
  console.log(user);

  // Check if the user is authenticated
  if (!user && req.nextUrl.pathname !== '/login') {
    // User is not authenticated, redirect to login page
    return NextResponse.redirect(new URL('/login', req.url))
  }

  await supabase.auth.getSession();


  return res
}

export const config = {
  matcher: [
    '/',
    '/((?!api|_next/static|_next/image|.png).*)',
  ],
}