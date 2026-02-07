import Link from 'next/link';

export const CTASection = () => {
  return (
    <section className="bg-white">
      <div className="container py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-boutique-olive">READY</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-boutique-ink md:text-5xl">Start with the edit.</h2>
          <p className="mt-5 text-sm leading-relaxed text-boutique-olive-dark/80 md:text-base">
            Explore a calm collection designed to outlast trends.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/collection" className="btn btn-primary">
              Shop now
            </Link>
            <Link href="/signup" className="btn btn-ghost">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
