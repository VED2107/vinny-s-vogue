import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { logout } from '@/app/actions/auth';
import { BrandLogo } from '@/components/brand/BrandLogo';

export const SiteLayout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-boutique-offwhite/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <BrandLogo size="sm" priority />
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

      <footer className="border-t border-black/5 bg-boutique-offwhite">
        <div className="container py-12">
          <div className="grid gap-8 md:grid-cols-2 md:items-start">
            <div>
              <BrandLogo size="sm" />
              <p className="mt-3 max-w-prose text-sm text-boutique-olive-dark/80">
                Quiet confidence, editorial essentials.
              </p>
              <p className="mt-6 text-xs text-boutique-olive-dark/70">© {new Date().getFullYear()} Vinny’s Vogue</p>
            </div>

            <div className="justify-self-start md:justify-self-end">
              <p className="text-xs font-semibold tracking-[0.22em] text-boutique-olive">CONTACT</p>
              <div className="mt-3 grid gap-2 text-sm text-boutique-olive-dark/80">
                <a
                  className="hover:text-boutique-ink"
                  href="https://www.instagram.com/vinnys_vogue_/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram: @vinnys_vogue_
                </a>
                <a className="hover:text-boutique-ink" href="mailto:contact@vinnysvogue.com">
                  contact@vinnysvogue.com
                </a>
                <a className="hover:text-boutique-ink" href="tel:+91-XXXXXXXXXX">
                  +91-XXXXXXXXXX
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
