export const ContactSection = () => {
  return (
    <section className="bg-boutique-offwhite">
      <div className="container py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.22em] text-boutique-olive">CONTACT</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-boutique-ink md:text-4xl">Contact Vinny’s Vogue</h2>
          <p className="mt-4 max-w-prose text-sm leading-relaxed text-boutique-olive-dark/80 md:text-base">
            For orders, styling, or collaborations—reach us directly.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <a
              href="https://www.instagram.com/vinnys_vogue_/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-3xl border border-black/5 bg-white p-6 hover:border-black/10"
            >
              <p className="text-xs font-semibold tracking-[0.22em] text-boutique-olive">INSTAGRAM</p>
              <p className="mt-3 text-sm font-semibold text-boutique-ink">@vinnys_vogue_</p>
              <p className="mt-1 text-sm text-boutique-olive-dark/80">Follow the editorial.</p>
            </a>

            <a
              href="mailto:contact@vinnysvogue.com"
              className="rounded-3xl border border-black/5 bg-white p-6 hover:border-black/10"
            >
              <p className="text-xs font-semibold tracking-[0.22em] text-boutique-olive">EMAIL</p>
              <p className="mt-3 text-sm font-semibold text-boutique-ink">contact@vinnysvogue.com</p>
              <p className="mt-1 text-sm text-boutique-olive-dark/80">We reply within 24–48h.</p>
            </a>

            <a href="tel:+91-XXXXXXXXXX" className="rounded-3xl border border-black/5 bg-white p-6 hover:border-black/10">
              <p className="text-xs font-semibold tracking-[0.22em] text-boutique-olive">PHONE</p>
              <p className="mt-3 text-sm font-semibold text-boutique-ink">+91-XXXXXXXXXX</p>
              <p className="mt-1 text-sm text-boutique-olive-dark/80">Mon–Sat, 10am–6pm.</p>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
