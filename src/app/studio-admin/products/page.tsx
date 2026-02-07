import { requireAdmin } from '@/lib/auth';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createProduct, deleteProduct, updateProduct } from './actions';

type Props = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function AdminProductsPage({ searchParams }: Props) {
  await requireAdmin();

  const sp = searchParams ?? {};
  const ok = typeof sp.ok === 'string' ? sp.ok : null;
  const error = typeof sp.error === 'string' ? sp.error : null;

  const supabaseAdmin = createSupabaseAdminClient();
  const { data: products } = await supabaseAdmin
    .from('products')
    .select('id, name, description, price, sizes, stock, images, is_featured, created_at')
    .order('created_at', { ascending: false });

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.22em] text-white/60">PRODUCTS</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Products</h1>

      {ok ? (
        <div className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          {ok}
        </div>
      ) : null}
      {error ? (
        <div className="mt-6 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100" role="alert">
          {error}
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-[420px_1fr]">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-sm font-semibold">Add product</h2>
          <form action={createProduct} className="mt-4 grid gap-3">
            <div className="grid gap-2">
              <span className="text-xs font-semibold tracking-[0.18em] text-white/60">NAME</span>
              <input name="name" type="text" required className="input bg-black/20 text-white placeholder:text-white/40 border-white/10 focus:border-boutique-gold" />
            </div>

            <div className="grid gap-2">
              <span className="text-xs font-semibold tracking-[0.18em] text-white/60">DESCRIPTION</span>
              <textarea name="description" rows={3} className="input bg-black/20 text-white placeholder:text-white/40 border-white/10 focus:border-boutique-gold" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <span className="text-xs font-semibold tracking-[0.18em] text-white/60">PRICE</span>
                <input name="price" type="number" step="0.01" min="0" required className="input bg-black/20 text-white border-white/10 focus:border-boutique-gold" />
              </div>
              <div className="grid gap-2">
                <span className="text-xs font-semibold tracking-[0.18em] text-white/60">STOCK</span>
                <input name="stock" type="number" step="1" min="0" required className="input bg-black/20 text-white border-white/10 focus:border-boutique-gold" />
              </div>
            </div>

            <div className="grid gap-2">
              <span className="text-xs font-semibold tracking-[0.18em] text-white/60">SIZES</span>
              <input name="sizes" type="text" placeholder="XS, S, M, L" className="input bg-black/20 text-white placeholder:text-white/40 border-white/10 focus:border-boutique-gold" />
            </div>

            <div className="grid gap-2">
              <span className="text-xs font-semibold tracking-[0.18em] text-white/60">IMAGES</span>
              <input name="images" type="text" placeholder="https://.../1.jpg, https://.../2.jpg" className="input bg-black/20 text-white placeholder:text-white/40 border-white/10 focus:border-boutique-gold" />
            </div>

            <label className="flex items-center gap-2 text-sm text-white/80">
              <input name="is_featured" type="checkbox" className="h-4 w-4 accent-boutique-gold" />
              Featured
            </label>

            <button type="submit" className="btn btn-primary w-full">
              Create
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-sm font-semibold">All products</h2>

          <div className="mt-4 grid gap-4">
            {(products ?? []).map((p: any) => (
              <div key={p.id} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{p.name ?? p.id}</p>
                    <p className="mt-1 text-xs text-white/60">{String(p.id)}</p>
                  </div>
                  <p className="text-sm text-white/80">₹{p.price} • stock: {p.stock}</p>
                </div>

                <details className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
                  <summary className="cursor-pointer select-none text-sm text-white/80 hover:text-white">
                    Edit product
                  </summary>

                  <div className="mt-4 grid gap-3">
                    <form action={updateProduct} className="grid gap-3">
                      <input type="hidden" name="id" value={p.id} />

                      <div className="grid gap-2">
                        <span className="text-xs font-semibold tracking-[0.18em] text-white/60">NAME</span>
                        <input
                          name="name"
                          type="text"
                          defaultValue={p.name ?? ''}
                          required
                          className="input bg-black/20 text-white border-white/10 focus:border-boutique-gold"
                        />
                      </div>

                      <div className="grid gap-2">
                        <span className="text-xs font-semibold tracking-[0.18em] text-white/60">DESCRIPTION</span>
                        <textarea
                          name="description"
                          rows={3}
                          defaultValue={p.description ?? ''}
                          className="input bg-black/20 text-white border-white/10 focus:border-boutique-gold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-2">
                          <span className="text-xs font-semibold tracking-[0.18em] text-white/60">PRICE</span>
                          <input
                            name="price"
                            type="number"
                            step="0.01"
                            min="0"
                            defaultValue={String(p.price ?? 0)}
                            required
                            className="input bg-black/20 text-white border-white/10 focus:border-boutique-gold"
                          />
                        </div>
                        <div className="grid gap-2">
                          <span className="text-xs font-semibold tracking-[0.18em] text-white/60">STOCK</span>
                          <input
                            name="stock"
                            type="number"
                            step="1"
                            min="0"
                            defaultValue={String(p.stock ?? 0)}
                            required
                            className="input bg-black/20 text-white border-white/10 focus:border-boutique-gold"
                          />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <span className="text-xs font-semibold tracking-[0.18em] text-white/60">SIZES</span>
                        <input
                          name="sizes"
                          type="text"
                          defaultValue={Array.isArray(p.sizes) ? p.sizes.join(', ') : ''}
                          className="input bg-black/20 text-white border-white/10 focus:border-boutique-gold"
                        />
                      </div>

                      <div className="grid gap-2">
                        <span className="text-xs font-semibold tracking-[0.18em] text-white/60">IMAGES</span>
                        <input
                          name="images"
                          type="text"
                          defaultValue={Array.isArray(p.images) ? p.images.join(', ') : ''}
                          className="input bg-black/20 text-white border-white/10 focus:border-boutique-gold"
                        />
                      </div>

                      <label className="flex items-center gap-2 text-sm text-white/80">
                        <input
                          name="is_featured"
                          type="checkbox"
                          defaultChecked={Boolean(p.is_featured)}
                          className="h-4 w-4 accent-boutique-gold"
                        />
                        Featured
                      </label>

                      <div className="flex flex-wrap gap-3">
                        <button type="submit" className="btn btn-primary">
                          Save
                        </button>
                      </div>
                    </form>

                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className="btn btn-ghost border-white/10 text-white hover:bg-white/10">
                        Delete
                      </button>
                    </form>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
