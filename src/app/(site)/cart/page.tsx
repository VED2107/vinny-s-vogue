import { requireUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { removeCartItem, updateCartItem } from '@/app/cart/actions';

type Props = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function CartPage({ searchParams }: Props) {
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
      productId: String(row.product_id),
      size: row.size ? String(row.size) : '',
      quantity: qty,
      productName: product?.name ? String(product.name) : row.product_id,
      price,
      stock: typeof product?.stock === 'number' ? product.stock : 0,
      lineTotal: price * qty,
    };
  });

  const total = normalized.reduce((sum, i) => sum + i.lineTotal, 0);

  return (
    <div className="container py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-[0.22em] text-black/50">CART</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Your selection</h1>
        <p className="mt-2 text-sm text-black/60">Signed in as {user.email}</p>
      </div>

      {error ? (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4">
          {normalized.length === 0 ? (
            <div className="card p-6">
              <p className="text-sm text-black/70">Your cart is empty.</p>
            </div>
          ) : null}

          {normalized.map((item) => (
            <div key={item.id} className="card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold tracking-tight">{item.productName}</p>
                  <p className="mt-1 text-xs text-black/60">Size: {item.size || '—'} • Stock: {item.stock}</p>
                </div>
                <p className="text-sm text-black/80">₹{item.price}</p>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <form action={updateCartItem} className="flex items-center gap-3">
                  <input type="hidden" name="cart_item_id" value={item.id} />
                  <label className="flex items-center gap-2 text-sm text-black/70">
                    Qty
                    <input
                      name="quantity"
                      type="number"
                      min="1"
                      step="1"
                      defaultValue={String(item.quantity)}
                      required
                      className="input w-24"
                    />
                  </label>
                  <button type="submit" className="btn btn-ghost">
                    Update
                  </button>
                </form>

                <form action={removeCartItem}>
                  <input type="hidden" name="cart_item_id" value={item.id} />
                  <button type="submit" className="btn btn-ghost">
                    Remove
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>

        <aside className="card p-6 h-fit">
          <h2 className="text-sm font-semibold tracking-tight">Order summary</h2>
          <div className="mt-4 flex items-center justify-between text-sm text-black/70">
            <span>Subtotal</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-black/70">
            <span>Shipping</span>
            <span>—</span>
          </div>
          <div className="mt-4 h-px bg-black/10" />
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-semibold">Total</span>
            <span className="text-sm font-semibold">₹{total.toFixed(2)}</span>
          </div>
          <a href="/checkout" className="btn btn-primary mt-6 w-full text-center">
            Continue to checkout
          </a>
        </aside>
      </div>
    </div>
  );
}
