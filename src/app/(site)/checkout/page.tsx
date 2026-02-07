import { requireUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { placeOrder } from '@/app/checkout/actions';

type Props = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function CheckoutPage({ searchParams }: Props) {
  const user = await requireUser();

  const sp = searchParams ?? {};
  const error = typeof sp.error === 'string' ? sp.error : null;

  const supabase = await createSupabaseServerClient();
  const { data: items } = await supabase
    .from('cart_items')
    .select(
      [
        'id',
        'product_id',
        'size',
        'quantity',
        'products:products ( id, name, price, stock )',
      ].join(',')
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const normalized = (items ?? []).map((row: any) => {
    const product = row.products ?? null;
    const price = typeof product?.price === 'number' ? product.price : 0;
    const qty = typeof row.quantity === 'number' ? row.quantity : 0;
    return {
      id: String(row.id),
      productName: product?.name ? String(product.name) : String(row.product_id),
      size: row.size ? String(row.size) : '',
      quantity: qty,
      price,
      stock: typeof product?.stock === 'number' ? product.stock : 0,
      lineTotal: price * qty,
    };
  });

  const total = normalized.reduce((sum, i) => sum + i.lineTotal, 0);

  return (
    <div className="container py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-[0.22em] text-black/50">CHECKOUT</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Confirm your order</h1>
        <p className="mt-2 text-sm text-black/60">Signed in as {user.email}</p>
      </div>

      {error ? (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="card p-6">
          <h2 className="text-sm font-semibold tracking-tight">Items</h2>
          {normalized.length === 0 ? <p className="mt-4 text-sm text-black/70">Your cart is empty.</p> : null}

          <ul className="mt-4 grid gap-3">
            {normalized.map((i) => (
              <li key={i.id} className="flex items-start justify-between gap-4 border-b border-black/5 pb-3">
                <div>
                  <p className="text-sm font-semibold">{i.productName}</p>
                  <p className="mt-1 text-xs text-black/60">
                    {i.size ? `Size: ${i.size} • ` : ''}Qty: {i.quantity}
                  </p>
                </div>
                <p className="text-sm text-black/80">₹{i.lineTotal.toFixed(2)}</p>
              </li>
            ))}
          </ul>
        </div>

        <aside className="card p-6 h-fit">
          <h2 className="text-sm font-semibold tracking-tight">Summary</h2>
          <div className="mt-4 flex items-center justify-between text-sm text-black/70">
            <span>Total</span>
            <span className="font-semibold text-black">₹{total.toFixed(2)}</span>
          </div>

          {normalized.length ? (
            <form action={placeOrder} className="mt-6">
              <button type="submit" className="btn btn-primary w-full">
                Place Order
              </button>
            </form>
          ) : null}

          <p className="mt-4 text-xs text-black/50">Stock is validated again at checkout to prevent overselling.</p>
        </aside>
      </div>
    </div>
  );
}
