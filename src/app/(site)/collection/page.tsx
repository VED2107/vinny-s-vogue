import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';

type ProductRow = {
  id: string;
  name: string | null;
  price: number | null;
};

export default async function CollectionPage() {
  const supabase = await createSupabaseServerClient();

  const { data: products } = await supabase
    .from('products')
    .select('id, name, price')
    .order('created_at', { ascending: false });

  const productRows = (products ?? []) as unknown as ProductRow[];

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-end justify-between gap-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] text-black/50">COLLECTION</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">New arrivals</h1>
          <p className="mt-2 text-sm text-black/60">A curated edit of timeless pieces.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {productRows.map((p) => (
          <Link key={p.id} href={`/product/${p.id}`} className="group">
            <div className="card overflow-hidden">
              <div className="aspect-[4/5] bg-black/[0.03]" />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold tracking-tight group-hover:underline group-hover:underline-offset-4">
                      {p.name ?? p.id}
                    </p>
                    <p className="mt-1 text-xs text-black/60">Essential</p>
                  </div>

                  {typeof p.price === 'number' ? (
                    <p className="text-sm text-black/80">₹{p.price.toFixed(2)}</p>
                  ) : null}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
