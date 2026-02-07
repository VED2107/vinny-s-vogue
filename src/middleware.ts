import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const createSupabaseMiddlewareClient = (request: NextRequest, response: NextResponse) => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  return createServerClient(url, anonKey, {
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
};

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const response = NextResponse.next();

  const protectedPrefixes = ['/cart', '/checkout', '/profile'];
  const isProtected = protectedPrefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  const isAdminRoute = pathname === '/studio-admin' || pathname.startsWith('/studio-admin/');

  if (!isProtected && !isAdminRoute) {
    return NextResponse.next();
  }

  const supabase = createSupabaseMiddlewareClient(request, response);
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`);
    return NextResponse.redirect(url);
  }

  if (isAdminRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (profile?.role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.search = '';
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ['/cart/:path*', '/checkout/:path*', '/profile/:path*', '/studio-admin/:path*'],
};
