import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { addToCart } from '@/app/cart/actions';

type Props = {
  params: { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function ProductPage({ params, searchParams }: Props) {
  const { id } = params;
  const sp = searchParams ?? {};
  const added = sp.added === '1';

  const supabase = await createSupabaseServerClient();
  const { data: product } = await supabase.from('products').select('*').eq('id', id).maybeSingle();

  if (!product) {
    redirect('/collection');
  }

  const images = Array.isArray(product.images) ? product.images : [];
  const primaryImage = images.length ? String(images[0]) : null;

  return (
    <div className="container py-10">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="card overflow-hidden">
          <div className="aspect-[4/5] w-full bg-black/5">
            {primaryImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={primaryImage} alt={product.name ?? 'Product'} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-black/40">No image</div>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.22em] text-boutique-olive">VINNY’S VOGUE</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{product.name ?? 'Product'}</h1>

          {typeof product.price === 'number' ? (
            <p className="mt-3 text-lg text-black/80">₹{product.price.toFixed(2)}</p>
          ) : null}

          {added ? (
            <div className="mt-4 rounded-xl border border-black/10 bg-boutique-offwhite px-4 py-3 text-sm text-boutique-olive-dark/90">
              Added to cart.
            </div>
          ) : null}

          {product.description ? <p className="mt-6 leading-relaxed text-black/70">{String(product.description)}</p> : null}

          <div className="mt-8 card p-6">
            <form action={addToCart} className="grid gap-4">
              <input type="hidden" name="product_id" value={id} />
              <input type="hidden" name="next" value={`/product/${id}`} />

              <div className="grid gap-2">
                <span className="label">Size</span>
                <input name="size" type="text" placeholder="e.g. M" className="input" />
              </div>

              <div className="grid gap-2">
                <span className="label">Quantity</span>
                <input name="quantity" type="number" min="1" step="1" defaultValue="1" required className="input" />
              </div>

              <button type="submit" className="btn btn-primary w-full">
                Add to cart
              </button>

              <p className="text-xs text-black/50">Stock is validated at add-to-cart and again at checkout.</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
