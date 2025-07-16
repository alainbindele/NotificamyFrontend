export const clerkConfig = {
  publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_your-key-here',
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up',
  afterSignInUrl: '/',
  afterSignUpUrl: '/'
};

// Debug info
console.log('🔧 Clerk Configuration:', {
  publishableKey: clerkConfig.publishableKey ? 'SET' : 'NOT SET',
  environment: import.meta.env.VITE_ENVIRONMENT
});