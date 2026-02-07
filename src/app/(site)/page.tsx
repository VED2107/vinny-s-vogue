import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { logout } from '@/app/actions/auth';

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <div className="container py-14">
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] text-black/50">PREMIUM BOUTIQUE</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            A quiet luxury edit.
          </h1>
          <p className="mt-4 max-w-prose text-black/70">
            Discover elevated essentials—minimal silhouettes, refined textures, and considered craftsmanship.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/collection" className="btn btn-primary">
              Shop collection
            </Link>
            <Link href="/cart" className="btn btn-ghost">
              View cart
            </Link>
          </div>

          <div className="mt-8 text-xs text-black/60">
            {user ? (
              <div className="flex flex-wrap items-center gap-3">
                <span>Signed in as {user.email}</span>
                <Link href="/profile" className="underline underline-offset-4 hover:text-black">
                  Profile
                </Link>
                <Link href="/studio-admin" className="underline underline-offset-4 hover:text-black">
                  Admin
                </Link>
                <form action={logout}>
                  <button type="submit" className="underline underline-offset-4 hover:text-black">
                    Logout
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <span>Not signed in.</span>
                <Link href="/login" className="underline underline-offset-4 hover:text-black">
                  Login
                </Link>
                <Link href="/signup" className="underline underline-offset-4 hover:text-black">
                  Create account
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="grid grid-cols-2 gap-0">
            <div className="aspect-[3/4] bg-gradient-to-br from-boutique-sand to-white" />
            <div className="aspect-[3/4] bg-gradient-to-br from-white to-boutique-sand" />
            <div className="aspect-[3/4] bg-gradient-to-br from-white to-boutique-sand" />
            <div className="aspect-[3/4] bg-gradient-to-br from-boutique-sand to-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
