export const clerkConfig = {
  publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up',
  afterSignUpUrl: '/dashboard',
  afterSignInUrl: '/dashboard',
  appearance: {
    theme: {
      primaryColor: '#d946ef'
    },
    elements: {
      formButtonPrimary: 'bg-gradient-to-r from-fuchsia-500 to-cyan-500 hover:from-fuchsia-600 hover:to-cyan-600',
      socialButtonsBlockButton: 'border-white/20 hover:border-fuchsia-500/50 bg-white/10 hover:bg-fuchsia-500/20',
      card: 'bg-gray-900 border border-white/20',
      modalContent: 'bg-gray-900 border border-white/20',
      modalCloseButton: 'text-white hover:text-fuchsia-400'
    }
  }
};

// Enhanced debug info
if (import.meta.env.DEV) {
  console.log('🔧 Clerk Configuration Debug:', {
    publishableKey: clerkConfig.publishableKey ? 'SET' : 'NOT SET',
    publishableKeySource: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? 'FROM_ENV' : 'FALLBACK',
    environment: import.meta.env.VITE_ENVIRONMENT,
    keyValid: clerkConfig.publishableKey?.startsWith('pk_'),
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