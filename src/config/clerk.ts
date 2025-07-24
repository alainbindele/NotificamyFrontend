export const clerkConfig = {
  publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_your-publishable-key-here',
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up',
  afterSignInUrl: '/',
  afterSignUpUrl: '/'
};

// Debug info
if (import.meta.env.DEV) {
  console.log('🔧 Clerk Configuration Debug:', {
    publishableKey: clerkConfig.publishableKey ? 'SET' : 'NOT SET',
    publishableKeySource: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? 'FROM_ENV' : 'FALLBACK',
    environment: import.meta.env.VITE_ENVIRONMENT,
    actualKey: clerkConfig.publishableKey?.substring(0, 20) + '...'
  });
}