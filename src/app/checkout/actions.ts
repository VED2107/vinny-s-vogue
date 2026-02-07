'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const toSafeCheckoutError = (message: string) => {
  const msg = message.toLowerCase();

  if (msg.includes('cart_empty')) return 'Your cart is empty.';
  if (msg.includes('insufficient_stock')) return 'Some items are out of stock. Please adjust your cart.';
  if (msg.includes('not_authenticated')) return 'Please log in to continue.';

  return 'Could not place order. Please try again.';
};

export const placeOrder = async () => {
  const user = await requireUser();
  void user;

  const supabase = await createSupabaseServerClient();

  const { data: orderId, error } = await supabase.rpc('place_order');
  void orderId;

  if (error) {
    redirect(`/checkout?error=${encodeURIComponent(toSafeCheckoutError(error.message))}`);
  }

  revalidatePath('/cart');
  revalidatePath('/checkout');
  revalidatePath('/profile');

  redirect('/profile?order=success');
};
