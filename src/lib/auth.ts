import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from './supabase/server';

export type Role = 'user' | 'admin';

export const getCurrentUser = async () => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) return null;
  return data.user ?? null;
};

export const getCurrentUserRole = async (): Promise<Role | null> => {
  const supabase = await createSupabaseServerClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) return null;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userData.user.id)
    .single();

  if (profileError) return null;

  const role = profile?.role;
  return role === 'admin' ? 'admin' : 'user';
};

export const requireUser = async () => {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
};

export const requireAdmin = async () => {
  const user = await requireUser();
  const role = await getCurrentUserRole();

  if (role !== 'admin') redirect('/');
  return { user, role };
};
