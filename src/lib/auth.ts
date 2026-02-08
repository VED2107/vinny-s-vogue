import { redirect } from 'next/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createSupabaseServerClient } from './supabase/server';

export type Role = 'user' | 'admin';

export const getPostAuthRedirectPath = (role: Role | null) => {
  return role === 'admin' ? '/studio-admin' : '/';
};

export const isSafeNextPath = (next: string | null | undefined) => {
  if (!next) return false;
  if (!next.startsWith('/')) return false;
  if (next.startsWith('//')) return false;
  if (next.toLowerCase().startsWith('http')) return false;
  if (next.startsWith('/studio-admin')) return false;
  return true;
};

export const getPostAuthRedirectPathWithNext = (role: Role | null, next: string | null | undefined) => {
  if (role === 'admin') return '/studio-admin';
  return isSafeNextPath(next) ? String(next) : '/';
};

export const getUserRoleById = async (supabase: SupabaseClient, userId: string): Promise<Role | null> => {
  const { data: profile, error } = await supabase.from('profiles').select('role').eq('id', userId).single();
  if (error) return null;
  const role = profile?.role;
  return role === 'admin' ? 'admin' : 'user';
};

export const ensureProfileRow = async (supabase: SupabaseClient, user: { id: string; email?: string | null }) => {
  const { data: existing, error: existingError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  if (!existingError && existing) return;

  await supabase.from('profiles').insert({
    id: user.id,
    email: user.email ?? null,
    role: 'user',
  });
};

export const redirectAfterAuth = async (supabase: SupabaseClient, userId: string) => {
  const role = await getUserRoleById(supabase, userId);
  redirect(getPostAuthRedirectPath(role));
};

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
