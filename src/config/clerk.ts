export const clerkConfig = {
  publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up',
  afterSignInUrl: '/',
  afterSignUpUrl: '/',
  appearance: {
    theme: {
      primaryColor: '#d946ef'
    }
  }
};

// Enhanced debug info
if (import.meta.env.DEV) {
  console.log('🔧 Clerk Configuration Debug:', {
    publishableKey: clerkConfig.publishableKey ? 'SET' : 'NOT SET',
    publishableKeySource: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? 'FROM_ENV' : 'FALLBACK',
    environment: import.meta.env.VITE_ENVIRONMENT,
    actualKey: clerkConfig.publishableKey?.substring(0, 30) + '...',
    keyLength: clerkConfig.publishableKey?.length,
    keyValid: clerkConfig.publishableKey?.startsWith('pk_')
  });
  
  // Validate key format
  if (!clerkConfig.publishableKey) {
    console.error('❌ CLERK ERROR: No publishable key found!');
  } else if (!clerkConfig.publishableKey.startsWith('pk_')) {
    console.error('❌ CLERK ERROR: Invalid key format. Should start with pk_');
  }
}

// Production validation
if (import.meta.env.PROD && !clerkConfig.publishableKey) {
  throw new Error('CLERK_PUBLISHABLE_KEY is required in production');
}