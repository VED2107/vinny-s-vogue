import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { toFriendlyAuthError } from '@/lib/authErrors';
import { getSiteUrl } from '@/lib/siteUrl';
import { SignupClient } from '@/components/auth/SignupClient';
import { ensureProfileRow, getUserRoleById, getPostAuthRedirectPathWithNext } from '@/lib/auth';

export const metadata = {
  title: "Sign up | Vinny’s Vogue",
};

type Props = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function SignupPage({ searchParams }: Props) {
  const sp = searchParams ?? {};
  const error = typeof sp.error === 'string' ? sp.error : null;
  const next = typeof sp.next === 'string' ? sp.next : '/';
  const method = sp.method === 'phone' ? 'phone' : 'email';
  const stage = sp.stage === 'verify' ? 'verify' : 'enter';
  const phone = typeof sp.phone === 'string' ? sp.phone : '';

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (data.user) {
    const role = await getUserRoleById(supabase, data.user.id);
    redirect(getPostAuthRedirectPathWithNext(role, next));
  }

  const signup = async (formData: FormData) => {
    'use server';

    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim().toLowerCase();
    const password = String(formData.get('password') || '');

    const supabase = await createSupabaseServerClient();

    const siteUrl = getSiteUrl();
    const emailRedirectTo = `${siteUrl}/auth/callback?next=${encodeURIComponent(next)}`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
        data: name ? { name } : undefined,
      },
    });

    if (error) {
      redirect(`/signup?next=${encodeURIComponent(next)}&error=${encodeURIComponent(toFriendlyAuthError(error.message))}`);
    }

    const user = data.user;
    const session = data.session;

    if (user && session) {
      await ensureProfileRow(supabase, { id: user.id, email: user.email });
      const role = await getUserRoleById(supabase, user.id);
      redirect(getPostAuthRedirectPathWithNext(role, next));
    }

    redirect(`/login?checkEmail=1&next=${encodeURIComponent(next)}`);
  };

  const requestOtp = async (formData: FormData) => {
    'use server';

    const phone = String(formData.get('phone') || '').trim();

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithOtp({
      phone,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      redirect(
        `/signup?method=phone&next=${encodeURIComponent(next)}&error=${encodeURIComponent(toFriendlyAuthError(error.message))}`
      );
    }

    redirect(`/signup?method=phone&stage=verify&phone=${encodeURIComponent(phone)}&next=${encodeURIComponent(next)}`);
  };

  const verifyOtp = async (formData: FormData) => {
    'use server';

    const phone = String(formData.get('phone') || '').trim();
    const token = String(formData.get('token') || '').trim();

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });

    if (error) {
      redirect(
        `/signup?method=phone&stage=verify&phone=${encodeURIComponent(phone)}&next=${encodeURIComponent(next)}&error=${encodeURIComponent(
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

    redirect(next);
  };

  return (
    <SignupClient
      next={next}
      error={error}
      initialMethod={method}
      initialStage={stage}
      initialPhone={phone}
      signupAction={signup}
      requestOtpAction={requestOtp}
      verifyOtpAction={verifyOtp}
    />
  );
}
