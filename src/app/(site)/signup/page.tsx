import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { toFriendlyAuthError } from '@/lib/authErrors';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { getSiteUrl } from '@/lib/siteUrl';

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
      await supabase.from('profiles').upsert(
        {
          id: user.id,
          email: user.email,
          role: 'user',
        },
        { onConflict: 'id' }
      );
    }

    redirect(next);
  };

  return (
    <div className="container py-14">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-boutique-olive">VINNY’S VOGUE</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Create your account</h1>
          <p className="mt-2 text-sm text-boutique-olive-dark/80">A minimal, editorial shopping experience.</p>
        </div>

        <div className="mt-6 flex overflow-hidden rounded-2xl border border-black/10 bg-white">
          <Link
            href={`/signup?method=email&next=${encodeURIComponent(next)}`}
            className={
              "flex-1 px-4 py-2 text-center text-sm font-semibold " +
              (method === 'email' ? 'bg-boutique-olive text-white' : 'text-boutique-olive-dark/80 hover:text-boutique-ink')
            }
          >
            Email
          </Link>
          <Link
            href={`/signup?method=phone&next=${encodeURIComponent(next)}`}
            className={
              "flex-1 px-4 py-2 text-center text-sm font-semibold " +
              (method === 'phone' ? 'bg-boutique-olive text-white' : 'text-boutique-olive-dark/80 hover:text-boutique-ink')
            }
          >
            Phone
          </Link>
        </div>

        <div className="mt-8 card p-6">
          {error ? (
            <div className="mb-4 rounded-xl border border-black/10 bg-boutique-offwhite px-4 py-3 text-sm text-boutique-ink" role="alert">
              {error}
            </div>
          ) : null}

          {method === 'email' ? (
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
          ) : stage === 'verify' ? (
            <form action={verifyOtp} className="grid gap-4">
              <input type="hidden" name="phone" value={phone} />
              <div className="grid gap-2">
                <span className="label">Phone</span>
                <input className="input" value={phone} readOnly />
              </div>

              <div className="grid gap-2">
                <span className="label">OTP</span>
                <input className="input" name="token" inputMode="numeric" autoComplete="one-time-code" required />
              </div>

              <SubmitButton className="btn btn-primary w-full">Verify & continue</SubmitButton>

              <Link
                href={`/signup?method=phone&next=${encodeURIComponent(next)}`}
                className="text-center text-sm text-boutique-olive-dark/80 underline underline-offset-4 hover:text-boutique-ink"
              >
                Use a different phone
              </Link>
            </form>
          ) : (
            <form action={requestOtp} className="grid gap-4">
              <div className="grid gap-2">
                <span className="label">Phone</span>
                <input className="input" name="phone" placeholder="+91XXXXXXXXXX" autoComplete="tel" required />
              </div>

              <SubmitButton className="btn btn-primary w-full">Send OTP</SubmitButton>
              <p className="text-xs text-boutique-olive-dark/70">We’ll text you a one-time code.</p>
            </form>
          )}
        </div>

        <p className="mt-4 text-center text-sm text-boutique-olive-dark/80">
          Already have an account?{' '}
          <Link className="underline underline-offset-4 hover:text-boutique-ink" href={`/login?next=${encodeURIComponent(next)}`}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
