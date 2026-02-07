export const toFriendlyAuthError = (message: string) => {
  const msg = message.toLowerCase();

  if (msg.includes('invalid login credentials')) return 'Invalid email or password.';
  if (msg.includes('email not confirmed')) return 'Please confirm your email, then try again.';
  if (msg.includes('user already registered')) return 'An account with this email already exists.';
  if (msg.includes('password should be at least')) return 'Password is too short.';
  if (msg.includes('rate limit')) return 'Too many attempts. Please wait and try again.';

  return 'Unable to complete the request. Please try again.';
};
