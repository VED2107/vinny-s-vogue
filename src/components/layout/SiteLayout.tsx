import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { logout } from '@/app/actions/auth';

export const SiteLayout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-[#fbf7f0]/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#c8a45a]" aria-hidden="true" />
            <span className="text-sm font-semibold tracking-[0.22em]">BOUTIQUE</span>
          </Link>

          <nav className="flex items-center gap-4 text-sm">
            <Link href="/collection" className="text-black/70 hover:text-black">
              Collection
            </Link>
            <Link href="/cart" className="text-black/70 hover:text-black">
              Cart
            </Link>
            {user ? (
              <Link href="/profile" className="text-black/70 hover:text-black">
                {user.email}
              </Link>
            ) : (
              <Link href="/login" className="text-black/70 hover:text-black">
                Login
              </Link>
            )}

            {user ? (
              <form action={logout}>
                <button className="btn btn-ghost" type="submit">
                  Logout
                </button>
              </form>
            ) : (
              <Link className="btn btn-primary" href="/signup">
                Sign up
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-black/5">
        <div className="container py-10 text-xs text-black/60">© {new Date().getFullYear()} Boutique</div>
      </footer>
    </div>
  );
};
