import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { toFriendlyAuthError } from '@/lib/authErrors';
import { SubmitButton } from '@/components/auth/SubmitButton';

type Props = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function LoginPage({ searchParams }: Props) {
  const sp = searchParams ?? {};
  const error = typeof sp.error === 'string' ? sp.error : null;
  const next = typeof sp.next === 'string' ? sp.next : '/';
  const checkEmail = sp.checkEmail === '1';

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (data.user) redirect('/');

  const login = async (formData: FormData) => {
    'use server';

    const email = String(formData.get('email') || '').trim().toLowerCase();
    const password = String(formData.get('password') || '');

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      redirect(`/login?next=${encodeURIComponent(next)}&error=${encodeURIComponent(toFriendlyAuthError(error.message))}`);
    }

    redirect(next);
  };

  return (
    <div className="container py-14">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-black/50">BOUTIQUE</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-black/60">Sign in to continue.</p>
        </div>

        <div className="mt-8 card p-6">
          {checkEmail ? (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              Please check your email to confirm your account, then log in.
            </div>
          ) : null}

          {error ? (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">
              {error}
            </div>
          ) : null}

          <form action={login} className="grid gap-4">
            <div className="grid gap-2">
              <span className="label">Email</span>
              <input className="input" name="email" type="email" required autoComplete="email" />
            </div>

            <div className="grid gap-2">
              <span className="label">Password</span>
              <input
                className="input"
                name="password"
                type="password"
                required
                minLength={6}
                autoComplete="current-password"
              />
            </div>

            <SubmitButton className="btn btn-primary w-full">Sign in</SubmitButton>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-black/70">
          New here?{' '}
          <Link className="underline underline-offset-4 hover:text-black" href={`/signup?next=${encodeURIComponent(next)}`}>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
