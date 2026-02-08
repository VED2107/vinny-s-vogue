import Link from 'next/link';

export const HeroSection = ({
  userEmail,
  logoutAction,
}: {
  userEmail: string | null;
  logoutAction: () => Promise<void>;
}) => {
  return (
    <section className="bg-boutique-offwhite">
      <div className="container py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-boutique-ink md:text-6xl">
              Quiet confidence.
            </h1>
            <p className="mt-5 max-w-prose text-sm leading-relaxed text-boutique-olive-dark/80 md:text-base">
              Editorial essentials—minimal silhouettes, refined textures, and considered craftsmanship.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/collection" className="btn btn-primary">
                Shop collection
              </Link>
              <Link href="/cart" className="btn btn-ghost">
                View cart
              </Link>
            </div>

            <div className="mt-8 text-xs text-boutique-olive-dark/70">
              {userEmail ? (
                <div className="flex flex-wrap items-center gap-3">
                  <span>Signed in as {userEmail}</span>
                  <Link href="/profile" className="underline underline-offset-4 hover:text-boutique-ink">
                    Profile
                  </Link>
                  <Link href="/studio-admin" className="underline underline-offset-4 hover:text-boutique-ink">
                    Admin
                  </Link>
                  <form action={logoutAction}>
                    <button type="submit" className="underline underline-offset-4 hover:text-boutique-ink">
                      Logout
                    </button>
                  </form>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <span>Not signed in.</span>
                  <Link href="/login" className="underline underline-offset-4 hover:text-boutique-ink">
                    Login
                  </Link>
                  <Link href="/signup" className="underline underline-offset-4 hover:text-boutique-ink">
                    Create account
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-black/[0.03] p-8">
            <div className="grid gap-4">
              <div className="aspect-[16/10] rounded-2xl bg-black/[0.04]" />
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-[4/5] rounded-2xl bg-black/[0.04]" />
                <div className="aspect-[4/5] rounded-2xl bg-black/[0.04]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
