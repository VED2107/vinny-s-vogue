import Link from 'next/link';

export const FeaturedSection = () => {
  return (
    <section className="bg-boutique-offwhite">
      <div className="container py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-boutique-olive">FEATURED</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-boutique-ink md:text-4xl">
              The edit.
            </h2>
          </div>
          <Link href="/collection" className="text-sm text-boutique-olive-dark/80 underline underline-offset-4 hover:text-boutique-ink">
            View all
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { title: 'The Edit', subtitle: 'Essentials, refined', href: '/collection' },
            { title: 'New In', subtitle: 'Seasonal arrivals', href: '/collection' },
            { title: 'Minimal Icons', subtitle: 'Quiet statements', href: '/collection' },
          ].map((c) => (
            <Link key={c.title} href={c.href} className="group">
              <div className="overflow-hidden rounded-3xl border border-black/5 bg-white transition-transform duration-500 ease-out group-hover:scale-[1.02] group-hover:shadow-soft">
                <div className="aspect-[4/5] bg-black/[0.03]" />
                <div className="p-6">
                  <p className="text-lg font-semibold tracking-tight text-boutique-ink">{c.title}</p>
                  <p className="mt-1 text-sm text-boutique-olive-dark/80">{c.subtitle}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
