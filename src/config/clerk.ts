export const clerkConfig = {
  publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up',
  afterSignInUrl: '/',
  afterSignUpUrl: '/'
};

// Debug info
if (import.meta.env.DEV) {
  console.log('🔧 Clerk Configuration:', {
    publishableKey: clerkConfig.publishableKey ? 'SET' : 'NOT SET',
    environment: import.meta.env.VITE_ENVIRONMENT
  });
}