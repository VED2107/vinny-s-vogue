'use client';

import { useFormStatus } from 'react-dom';

export const SubmitButton = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} aria-disabled={pending} className={className}>
      {pending ? 'Please wait…' : children}
    </button>
  );
};
