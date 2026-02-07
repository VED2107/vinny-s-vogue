import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';

export default async function AdminHomePage() {
  await requireAdmin();

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.22em] text-white/60">DASHBOARD</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Vinny’s Vogue Studio</h1>
      <p className="mt-2 text-sm text-white/70">Manage products, inventory, and orders.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link href="/studio-admin/products" className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10">
          <p className="text-sm font-semibold">Products</p>
          <p className="mt-1 text-xs text-white/70">Create, edit, and manage inventory.</p>
        </Link>
        <Link href="/studio-admin/orders" className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10">
          <p className="text-sm font-semibold">Orders</p>
          <p className="mt-1 text-xs text-white/70">Review customer orders.</p>
        </Link>
      </div>
    </div>
  );
}
