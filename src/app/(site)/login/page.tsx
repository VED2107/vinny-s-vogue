import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { toFriendlyAuthError } from '@/lib/authErrors';
import { LoginClient } from '@/components/auth/LoginClient';
import { ensureProfileRow, getUserRoleById, getPostAuthRedirectPathWithNext } from '@/lib/auth';

export const metadata = {
  title: "Login | Vinny’s Vogue",
};

type Props = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function LoginPage({ searchParams }: Props) {
  const sp = searchParams ?? {};
  const error = typeof sp.error === 'string' ? sp.error : null;
  const next = typeof sp.next === 'string' ? sp.next : '/';
  const checkEmail = sp.checkEmail === '1';
  const method = sp.method === 'phone' ? 'phone' : 'email';
  const stage = sp.stage === 'verify' ? 'verify' : 'enter';
  const phone = typeof sp.phone === 'string' ? sp.phone : '';

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (data.user) {
    const role = await getUserRoleById(supabase, data.user.id);
    redirect(getPostAuthRedirectPathWithNext(role, next));
  }

  const login = async (formData: FormData) => {
    'use server';

    const email = String(formData.get('email') || '').trim().toLowerCase();
    const password = String(formData.get('password') || '');

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      redirect(`/login?next=${encodeURIComponent(next)}&error=${encodeURIComponent(toFriendlyAuthError(error.message))}`);
    }

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (user) {
      await ensureProfileRow(supabase, { id: user.id, email: user.email });
      const role = await getUserRoleById(supabase, user.id);
      redirect(getPostAuthRedirectPathWithNext(role, next));
    }

    redirect('/');
  };

  const requestOtp = async (formData: FormData) => {
    'use server';

    const phone = String(formData.get('phone') || '').trim();

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithOtp({
      phone,
      options: {
        shouldCreateUser: false,
      },
    });

    if (error) {
      redirect(
        `/login?method=phone&next=${encodeURIComponent(next)}&error=${encodeURIComponent(toFriendlyAuthError(error.message))}`
      );
    }

    redirect(`/login?method=phone&stage=verify&phone=${encodeURIComponent(phone)}&next=${encodeURIComponent(next)}`);
  };

  const verifyOtp = async (formData: FormData) => {
    'use server';

    const phone = String(formData.get('phone') || '').trim();
    const token = String(formData.get('token') || '').trim();

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });

    if (error) {
      redirect(
        `/login?method=phone&stage=verify&phone=${encodeURIComponent(phone)}&next=${encodeURIComponent(next)}&error=${encodeURIComponent(
          toFriendlyAuthError(error.message)
        )}`
      );
    }

    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (user) {
      await ensureProfileRow(supabase, { id: user.id, email: user.email });
      const role = await getUserRoleById(supabase, user.id);
      redirect(getPostAuthRedirectPathWithNext(role, next));
    }

    redirect('/');
  };

  return (
    <LoginClient
      next={next}
      error={error}
      checkEmail={checkEmail}
      initialMethod={method}
      initialStage={stage}
      initialPhone={phone}
      loginAction={login}
      requestOtpAction={requestOtp}
      verifyOtpAction={verifyOtp}
    />
  );
}
