'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

const toNumber = (value: FormDataEntryValue | null) => {
  if (typeof value !== 'string') return NaN;
  return Number(value);
};

const toInt = (value: FormDataEntryValue | null) => {
  const n = toNumber(value);
  return Number.isFinite(n) ? Math.trunc(n) : NaN;
};

const toString = (value: FormDataEntryValue | null) => (typeof value === 'string' ? value.trim() : '');

const toStringArray = (value: FormDataEntryValue | null) => {
  const s = toString(value);
  if (!s) return null;

  const arr = s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);

  return arr.length ? arr : null;
};

const redirectWithMessage = (params: { ok?: string; error?: string }) => {
  const sp = new URLSearchParams();
  if (params.ok) sp.set('ok', params.ok);
  if (params.error) sp.set('error', params.error);
  redirect(`/studio-admin/products?${sp.toString()}`);
};

export const createProduct = async (formData: FormData) => {
  await requireAdmin();

  const name = toString(formData.get('name'));
  const description = toString(formData.get('description'));
  const price = toNumber(formData.get('price'));
  const stock = toInt(formData.get('stock'));

  const sizes = toStringArray(formData.get('sizes'));
  const images = toStringArray(formData.get('images'));
  const isFeatured = toString(formData.get('is_featured')) === 'on';

  if (!name) redirectWithMessage({ error: 'Name is required.' });
  if (!Number.isFinite(price) || price < 0) redirectWithMessage({ error: 'Price must be a valid number.' });
  if (!Number.isFinite(stock) || stock < 0) redirectWithMessage({ error: 'Stock must be a valid integer.' });

  const supabaseAdmin = createSupabaseAdminClient();

  const { error } = await supabaseAdmin.from('products').insert({
    name,
    description: description || null,
    price,
    stock,
    sizes,
    images,
    is_featured: isFeatured,
  });

  if (error) {
    redirectWithMessage({ error: 'Could not create product.' });
  }

  revalidatePath('/studio-admin/products');
  redirectWithMessage({ ok: 'Product created.' });
};

export const updateProduct = async (formData: FormData) => {
  await requireAdmin();

  const id = toString(formData.get('id'));
  const name = toString(formData.get('name'));
  const description = toString(formData.get('description'));
  const price = toNumber(formData.get('price'));
  const stock = toInt(formData.get('stock'));

  const sizes = toStringArray(formData.get('sizes'));
  const images = toStringArray(formData.get('images'));
  const isFeatured = toString(formData.get('is_featured')) === 'on';

  if (!id) redirectWithMessage({ error: 'Missing product id.' });
  if (!name) redirectWithMessage({ error: 'Name is required.' });
  if (!Number.isFinite(price) || price < 0) redirectWithMessage({ error: 'Price must be a valid number.' });
  if (!Number.isFinite(stock) || stock < 0) redirectWithMessage({ error: 'Stock must be a valid integer.' });

  const supabaseAdmin = createSupabaseAdminClient();

  const { error } = await supabaseAdmin
    .from('products')
    .update({
      name,
      description: description || null,
      price,
      stock,
      sizes,
      images,
      is_featured: isFeatured,
    })
    .eq('id', id);

  if (error) {
    redirectWithMessage({ error: 'Could not update product.' });
  }

  revalidatePath('/studio-admin/products');
  redirectWithMessage({ ok: 'Product updated.' });
};

export const deleteProduct = async (formData: FormData) => {
  await requireAdmin();

  const id = toString(formData.get('id'));
  if (!id) redirectWithMessage({ error: 'Missing product id.' });

  const supabaseAdmin = createSupabaseAdminClient();
  const { error } = await supabaseAdmin.from('products').delete().eq('id', id);

  if (error) {
    redirectWithMessage({ error: 'Could not delete product.' });
  }

  revalidatePath('/studio-admin/products');
  redirectWithMessage({ ok: 'Product deleted.' });
};
