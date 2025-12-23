import { LogtoConfig } from '@logto/react';

const getRedirectUri = () => {
  if (import.meta.env.VITE_ENVIRONMENT === 'production') {
    return 'https://notificamy.com/callback';
  }
  return 'http://localhost:5173/callback';
};

const getPostLogoutRedirectUri = () => {
  if (import.meta.env.VITE_ENVIRONMENT === 'production') {
    return 'https://notificamy.com';
  }
  return 'http://localhost:5173';
};

export const logtoConfig: LogtoConfig = {
  endpoint: import.meta.env.VITE_LOGTO_ENDPOINT || '',
  appId: import.meta.env.VITE_LOGTO_APP_ID || '',
  scopes: ['openid', 'profile', 'email'],
  resources: ['https://notificamy.com:8080'],
  redirectUri: getRedirectUri(),
  postLogoutRedirectUri: getPostLogoutRedirectUri(),
};

// Enhanced debug info
console.log('🔧 Logto Configuration:', {
  endpoint: logtoConfig.endpoint ? 'SET' : 'NOT SET',
  appId: logtoConfig.appId ? 'SET' : 'NOT SET',
  redirectUri: logtoConfig.redirectUri,
  postLogoutRedirectUri: logtoConfig.postLogoutRedirectUri,
  scopes: logtoConfig.scopes,
  environment: import.meta.env.VITE_ENVIRONMENT || 'development',
});

if (import.meta.env.VITE_ENVIRONMENT !== 'production') {
  // Validate configuration
  if (!logtoConfig.endpoint) {
    console.error('❌ LOGTO ERROR: No endpoint found! Set VITE_LOGTO_ENDPOINT');
  }
  if (!logtoConfig.appId) {
    console.error('❌ LOGTO ERROR: No app ID found! Set VITE_LOGTO_APP_ID');
  }
}

// Production validation
if (import.meta.env.VITE_ENVIRONMENT === 'production' && (!logtoConfig.endpoint || !logtoConfig.appId)) {
  throw new Error('VITE_LOGTO_ENDPOINT and VITE_LOGTO_APP_ID are required in production');
}
