'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const logout = async () => {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/login');
};
