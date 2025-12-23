import { LogtoConfig } from '@logto/react';

export const logtoConfig: LogtoConfig = {
  endpoint: import.meta.env.VITE_LOGTO_ENDPOINT || '',
  appId: import.meta.env.VITE_LOGTO_APP_ID || '',
  resources: [import.meta.env.VITE_API_URL || 'http://localhost:3000'],
  // Explicitly set redirect URIs for production
  ...(import.meta.env.PROD && {
    scopes: ['openid', 'profile', 'email'],
  }),
};

// Enhanced debug info
if (import.meta.env.DEV) {
  console.log('🔧 Logto Configuration Debug:', {
    endpoint: logtoConfig.endpoint ? 'SET' : 'NOT SET',
    appId: logtoConfig.appId ? 'SET' : 'NOT SET',
    resources: logtoConfig.resources,
    environment: import.meta.env.VITE_ENVIRONMENT,
  });

  // Validate configuration
  if (!logtoConfig.endpoint) {
    console.error('❌ LOGTO ERROR: No endpoint found! Set VITE_LOGTO_ENDPOINT');
  }
  if (!logtoConfig.appId) {
    console.error('❌ LOGTO ERROR: No app ID found! Set VITE_LOGTO_APP_ID');
  }
}

// Production validation
if (import.meta.env.PROD && (!logtoConfig.endpoint || !logtoConfig.appId)) {
  throw new Error('VITE_LOGTO_ENDPOINT and VITE_LOGTO_APP_ID are required in production');
}
