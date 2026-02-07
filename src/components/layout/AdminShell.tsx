import Link from 'next/link';

export const AdminShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-dvh bg-[#0f0f10] text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-boutique-olive" aria-hidden="true" />
            <span className="text-xs font-semibold tracking-[0.22em]">VINNY’S VOGUE • STUDIO</span>
          </div>

          <nav className="grid gap-1 text-sm">
            <Link href="/studio-admin" className="rounded-xl px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white">
              Dashboard
            </Link>
            <Link
              href="/studio-admin/products"
              className="rounded-xl px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white"
            >
              Products
            </Link>
            <Link
              href="/studio-admin/orders"
              className="rounded-xl px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white"
            >
              Orders
            </Link>
            <Link href="/" className="mt-2 rounded-xl px-3 py-2 text-white/70 hover:bg-white/10 hover:text-white">
              Back to site
            </Link>
          </nav>
        </aside>

        <section className="rounded-2xl border border-white/10 bg-black/30 p-6">{children}</section>
      </div>
    </div>
  );
};
