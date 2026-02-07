import { requireAdmin } from '@/lib/auth';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

type AdminOrderRow = {
  id: string;
  status: string | null;
  created_at: string | null;
  user_id: string | null;
};

export default async function AdminOrdersPage() {
  await requireAdmin();

  const supabaseAdmin = createSupabaseAdminClient();
  const { data: orders } = await supabaseAdmin
    .from('orders')
    .select('id, status, created_at, user_id')
    .order('created_at', { ascending: false });

  const orderRows = (orders ?? []) as unknown as AdminOrderRow[];

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.22em] text-white/60">ORDERS</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Vinny’s Vogue • Orders</h1>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-xs text-white/70">
            <tr>
              <th className="px-4 py-3 font-semibold">Order</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">User</th>
              <th className="px-4 py-3 font-semibold">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {orderRows.map((o) => (
              <tr key={o.id} className="hover:bg-white/5">
                <td className="px-4 py-3 text-white/90">{String(o.id)}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-xs text-white/80">
                    {String(o.status)}
                  </span>
                </td>
                <td className="px-4 py-3 text-white/70">{String(o.user_id)}</td>
                <td className="px-4 py-3 text-white/70">{String(o.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
