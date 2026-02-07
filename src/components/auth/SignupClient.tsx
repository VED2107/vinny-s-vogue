'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { SubmitButton } from '@/components/auth/SubmitButton';

type Method = 'email' | 'phone';
type Stage = 'enter' | 'verify';

type Props = {
  next: string;
  error: string | null;
  initialMethod: Method;
  initialStage: Stage;
  initialPhone: string;
  signupAction: (formData: FormData) => void | Promise<void>;
  requestOtpAction: (formData: FormData) => void | Promise<void>;
  verifyOtpAction: (formData: FormData) => void | Promise<void>;
};

export const SignupClient = ({
  next,
  error,
  initialMethod,
  initialStage,
  initialPhone,
  signupAction,
  requestOtpAction,
  verifyOtpAction,
}: Props) => {
  const [method, setMethod] = useState<Method>(initialMethod);

  const stage: Stage = useMemo(() => {
    if (method !== 'phone') return 'enter';
    return initialStage;
  }, [method, initialStage]);

  const phone = initialPhone;

  return (
    <div className="container py-14">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-boutique-olive">VINNY’S VOGUE</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Create your account</h1>
          <p className="mt-2 text-sm text-boutique-olive-dark/80">A minimal, editorial shopping experience.</p>
        </div>

        <div className="mt-6 flex overflow-hidden rounded-2xl border border-black/10 bg-white">
          <button
            type="button"
            onClick={() => setMethod('email')}
            className={
              'flex-1 px-4 py-2 text-center text-sm font-semibold ' +
              (method === 'email' ? 'bg-boutique-olive text-white' : 'text-boutique-olive-dark/80 hover:text-boutique-ink')
            }
            aria-pressed={method === 'email'}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => setMethod('phone')}
            className={
              'flex-1 px-4 py-2 text-center text-sm font-semibold ' +
              (method === 'phone' ? 'bg-boutique-olive text-white' : 'text-boutique-olive-dark/80 hover:text-boutique-ink')
            }
            aria-pressed={method === 'phone'}
          >
            Phone
          </button>
        </div>

        <div className="mt-8 card p-6">
          {error ? (
            <div className="mb-4 rounded-xl border border-black/10 bg-boutique-offwhite px-4 py-3 text-sm text-boutique-ink" role="alert">
              {error}
            </div>
          ) : null}

          {method === 'email' ? (
            <form action={signupAction} className="grid gap-4">
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
                <input className="input" name="password" type="password" required minLength={6} autoComplete="new-password" />
              </div>

              <SubmitButton className="btn btn-primary w-full">Create account</SubmitButton>
            </form>
          ) : stage === 'verify' ? (
            <form action={verifyOtpAction} className="grid gap-4">
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
            <form action={requestOtpAction} className="grid gap-4">
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
};
