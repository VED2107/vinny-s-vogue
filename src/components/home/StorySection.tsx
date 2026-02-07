export const StorySection = () => {
  return (
    <section className="bg-boutique-olive/5">
      <div className="container py-20 md:py-28">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="rounded-3xl bg-black/[0.03] p-8">
            <div className="aspect-[4/5] rounded-2xl bg-black/[0.04]" />
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-boutique-olive">STORY</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-boutique-ink md:text-4xl">A modern atelier.</h2>
            <div className="mt-5 grid gap-4 text-sm leading-relaxed text-boutique-olive-dark/80 md:text-base">
              <p>
                We believe luxury is felt—through proportion, fabric, and restraint. Each piece is designed to sit quietly,
                and be worn often.
              </p>
              <p>
                The collection is intentionally small. The intent is clarity: fewer choices, better choices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
