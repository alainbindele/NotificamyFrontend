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
    actualKey: clerkConfig.publishableKey,
    keyLength: clerkConfig.publishableKey?.length,
    keyValid: clerkConfig.publishableKey?.startsWith('pk_'),
    keyValidLength: clerkConfig.publishableKey && clerkConfig.publishableKey.length > 40
  });
  
  // Validate key format
  if (!clerkConfig.publishableKey) {
    console.error('❌ CLERK ERROR: No publishable key found!');
  } else if (!clerkConfig.publishableKey.startsWith('pk_')) {
    console.error('❌ CLERK ERROR: Invalid key format. Should start with pk_');
  } else if (clerkConfig.publishableKey.length < 40) {
    console.error('❌ CLERK ERROR: Key seems too short. Expected 50+ characters, got:', clerkConfig.publishableKey.length);
  }
}

// Production debug (always show key issues)
if (clerkConfig.publishableKey && clerkConfig.publishableKey.length < 40) {
  console.error('🚨 CLERK KEY WARNING: Your key seems too short!');
  console.error('Expected length: 50+ characters');
  console.error('Actual length:', clerkConfig.publishableKey.length);
  console.error('Your key:', clerkConfig.publishableKey);
}

// Production validation
if (import.meta.env.PROD && !clerkConfig.publishableKey) {
  throw new Error('CLERK_PUBLISHABLE_KEY is required in production');
}