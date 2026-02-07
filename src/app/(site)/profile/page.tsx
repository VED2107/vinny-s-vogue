import { requireUser, getCurrentUserRole } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';

type Props = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function ProfilePage({ searchParams }: Props) {
  const user = await requireUser();
  const role = await getCurrentUserRole();

  const sp = searchParams ?? {};
  const order = typeof sp.order === 'string' ? sp.order : null;

  const supabase = await createSupabaseServerClient();
  const { data: orders } = await supabase
    .from('orders')
    .select('id, status, total_amount, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="container py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-[0.22em] text-black/50">PROFILE</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Your account</h1>
        <p className="mt-2 text-sm text-black/60">{user.email}</p>
      </div>

      {order === 'success' ? (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Order placed successfully.
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="card p-6 h-fit">
          <h2 className="text-sm font-semibold tracking-tight">Details</h2>
          <div className="mt-4 grid gap-2 text-sm text-black/70">
            <p>
              <span className="text-black/50">Email</span>
              <br />
              <span className="font-medium text-black">{user.email}</span>
            </p>
            <p>
              <span className="text-black/50">Role</span>
              <br />
              <span className="font-medium text-black">{role ?? 'user'}</span>
            </p>
          </div>
        </aside>

        <section>
          <h2 className="text-sm font-semibold tracking-tight">Order history</h2>

          {!orders?.length ? (
            <div className="mt-4 card p-6">
              <p className="text-sm text-black/70">No orders yet.</p>
            </div>
          ) : (
            <div className="mt-4 grid gap-4">
              {orders.map((o: any) => (
                <div key={o.id} className="card p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold tracking-tight">Order</p>
                      <p className="mt-1 text-xs text-black/60">{String(o.id)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">₹{Number(o.total_amount ?? 0).toFixed(2)}</p>
                      <p className="mt-1 text-xs text-black/60">{String(o.created_at)}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-[0.18em] text-black/50">STATUS</span>
                    <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-black/70">
                      {String(o.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
