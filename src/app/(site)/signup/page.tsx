import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { toFriendlyAuthError } from '@/lib/authErrors';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { getSiteUrl } from '@/lib/siteUrl';

type Props = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function SignupPage({ searchParams }: Props) {
  const sp = searchParams ?? {};
  const error = typeof sp.error === 'string' ? sp.error : null;
  const next = typeof sp.next === 'string' ? sp.next : '/';

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (data.user) redirect('/');

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
      await supabase.from('profiles').upsert(
        {
          id: user.id,
          email: user.email,
          role: 'user',
        },
        { onConflict: 'id' }
      );

      redirect(next);
    }

    redirect(`/login?checkEmail=1&next=${encodeURIComponent(next)}`);
  };

  return (
    <div className="container py-14">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-black/50">BOUTIQUE</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Create your account</h1>
          <p className="mt-2 text-sm text-black/60">A minimal, luxury shopping experience.</p>
        </div>

        <div className="mt-8 card p-6">
          {error ? (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">
              {error}
            </div>
          ) : null}

          <form action={signup} className="grid gap-4">
            <div className="grid gap-2">
              <span className="label">Name</span>
              <input className="input" name="name" type="text" autoComplete="name" />
            </div>

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
                autoComplete="new-password"
              />
            </div>

            <SubmitButton className="btn btn-primary w-full">Create account</SubmitButton>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-black/70">
          Already have an account?{' '}
          <Link className="underline underline-offset-4 hover:text-black" href={`/login?next=${encodeURIComponent(next)}`}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
