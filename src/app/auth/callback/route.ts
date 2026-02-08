import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { ensureProfileRow, getUserRoleById, getPostAuthRedirectPathWithNext } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  const next = url.searchParams.get('next') || '/';

  if (!code) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent('Invalid confirmation link.')}`, request.url));
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent('Server is not configured.')}`, request.url));
  }

  const response = NextResponse.redirect(new URL(next, request.url));

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent('Invalid confirmation link.')}`, request.url));
  }

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) return response;

  await ensureProfileRow(supabase, { id: user.id, email: user.email });
  const role = await getUserRoleById(supabase, user.id);

  const redirectTo = new URL(getPostAuthRedirectPathWithNext(role, next), request.url);
  const finalResponse = NextResponse.redirect(redirectTo);

  for (const cookie of response.cookies.getAll()) {
    finalResponse.cookies.set(cookie);
  }

  return finalResponse;
}
