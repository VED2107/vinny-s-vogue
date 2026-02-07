'use client';

import { useEffect, useRef, useState } from 'react';

const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  if (!window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const useInView = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(() => prefersReducedMotion());

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (inView) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [inView]);

  return { ref, inView };
};

export const ImageRevealSection = () => {
  const { ref, inView } = useInView();

  return (
    <section className="bg-white">
      <div className="container py-20 md:py-28">
        <div
          ref={ref}
          className={
            "overflow-hidden rounded-3xl bg-black/[0.03] transition-all duration-[1200ms] ease-out " +
            (inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')
          }
        >
          <div className="grid gap-6 p-6 md:grid-cols-2 md:p-10">
            <div className="aspect-[4/5] rounded-2xl bg-black/[0.04]" />
            <div className="grid content-center gap-4">
              <p className="text-xs font-semibold tracking-[0.22em] text-boutique-olive">VINNY’S VOGUE</p>
              <h2 className="text-3xl font-semibold tracking-tight text-boutique-ink md:text-4xl">
                Designed for presence.
              </h2>
              <p className="max-w-prose text-sm leading-relaxed text-boutique-olive-dark/80 md:text-base">
                A calm frame for statement pieces—made to feel modern, minimal, and assured.
              </p>
              <p className="text-xs text-boutique-olive-dark/70">
                Replace these placeholders with your lookbook imagery when ready.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
