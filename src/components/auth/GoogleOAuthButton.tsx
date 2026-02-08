'use client';

import { useState } from 'react';
import { getSiteUrl } from '@/lib/siteUrl';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

type Props = {
  next?: string;
};

export const GoogleOAuthButton = ({ next }: Props) => {
  const [redirecting, setRedirecting] = useState(false);

  const onContinueWithGoogle = async () => {
    if (redirecting) return;
    setRedirecting(true);

    const supabase = createSupabaseBrowserClient();
    const siteUrl = getSiteUrl();

    const redirectTo = next ? `${siteUrl}/auth/callback?next=${encodeURIComponent(next)}` : `${siteUrl}/auth/callback`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    });

    if (error) {
      setRedirecting(false);
    }
  };

  return (
    <button
      type="button"
      className="btn btn-ghost w-full"
      onClick={onContinueWithGoogle}
      disabled={redirecting}
      aria-disabled={redirecting}
    >
      {redirecting ? 'Redirecting…' : 'Continue with Google'}
    </button>
  );
};
