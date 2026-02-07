'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const toString = (v: FormDataEntryValue | null) => (typeof v === 'string' ? v.trim() : '');
const toInt = (v: FormDataEntryValue | null) => {
  if (typeof v !== 'string') return NaN;
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : NaN;
};

const requireUserOrRedirect = async (nextPath: string) => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }
  return { supabase, user: data.user };
};

const clampQuantity = (quantity: number, stock: number) => {
  if (!Number.isFinite(quantity)) return NaN;
  if (!Number.isFinite(stock)) return NaN;
  if (quantity <= 0) return NaN;
  return Math.min(quantity, Math.max(0, stock));
};

export const addToCart = async (formData: FormData) => {
  const productId = toString(formData.get('product_id'));
  const size = toString(formData.get('size')) || null;
  const quantityRaw = toInt(formData.get('quantity'));
  const nextPath = toString(formData.get('next')) || '/cart';

  if (!productId) redirect(`${nextPath}?error=${encodeURIComponent('Invalid product.')}`);

  const { supabase, user } = await requireUserOrRedirect(nextPath);

  const { data: product } = await supabase
    .from('products')
    .select('id, stock')
    .eq('id', productId)
    .maybeSingle();

  if (!product) redirect(`${nextPath}?error=${encodeURIComponent('Product not found.')}`);

  const stock = typeof product.stock === 'number' ? product.stock : 0;
  const quantity = clampQuantity(quantityRaw, stock);

  if (!Number.isFinite(quantity) || quantity <= 0) {
    redirect(`${nextPath}?error=${encodeURIComponent('Quantity must be greater than 0.')}`);
  }

  const { data: existing } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .eq('size', size)
    .maybeSingle();

  if (existing?.id) {
    const currentQty = typeof existing.quantity === 'number' ? existing.quantity : 0;
    const newQty = clampQuantity(currentQty + quantity, stock);

    if (!Number.isFinite(newQty) || newQty <= 0) {
      redirect(`${nextPath}?error=${encodeURIComponent('Invalid quantity.')}`);
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: newQty })
      .eq('id', existing.id);

    if (error) redirect(`${nextPath}?error=${encodeURIComponent('Could not update cart.')}`);
  } else {
    const { error } = await supabase.from('cart_items').insert({
      user_id: user.id,
      product_id: productId,
      size,
      quantity,
    });

    if (error) redirect(`${nextPath}?error=${encodeURIComponent('Could not add to cart.')}`);
  }

  revalidatePath('/cart');
  redirect('/cart');
};

export const updateCartItem = async (formData: FormData) => {
  const cartItemId = toString(formData.get('cart_item_id'));
  const quantityRaw = toInt(formData.get('quantity'));

  const { supabase } = await requireUserOrRedirect('/cart');

  if (!cartItemId) redirect(`/cart?error=${encodeURIComponent('Invalid cart item.')}`);

  const { data: item, error: itemError } = await supabase
    .from('cart_items')
    .select('id, product_id, size')
    .eq('id', cartItemId)
    .maybeSingle();

  if (itemError || !item) {
    redirect(`/cart?error=${encodeURIComponent('Cart item not found.')}`);
  }

  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, stock')
    .eq('id', item.product_id)
    .maybeSingle();

  if (productError || !product) {
    redirect(`/cart?error=${encodeURIComponent('Product not found.')}`);
  }

  const stock = typeof product.stock === 'number' ? product.stock : 0;
  const quantity = clampQuantity(quantityRaw, stock);

  if (!Number.isFinite(quantity) || quantity <= 0) {
    redirect(`/cart?error=${encodeURIComponent('Quantity must be greater than 0.')}`);
  }

  const { error } = await supabase.from('cart_items').update({ quantity }).eq('id', cartItemId);
  if (error) redirect(`/cart?error=${encodeURIComponent('Could not update cart item.')}`);

  revalidatePath('/cart');
  redirect('/cart');
};

export const removeCartItem = async (formData: FormData) => {
  const cartItemId = toString(formData.get('cart_item_id'));

  const { supabase } = await requireUserOrRedirect('/cart');

  if (!cartItemId) redirect(`/cart?error=${encodeURIComponent('Invalid cart item.')}`);

  const { error } = await supabase.from('cart_items').delete().eq('id', cartItemId);
  if (error) redirect(`/cart?error=${encodeURIComponent('Could not remove item.')}`);

  revalidatePath('/cart');
  redirect('/cart');
};
