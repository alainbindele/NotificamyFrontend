// Environment configuration
export const ENV = {
  isDevelopment: import.meta.env.VITE_ENVIRONMENT === 'development',
  isProduction: import.meta.env.VITE_ENVIRONMENT === 'production',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://notificamy.com',
  auth0: {
    domain: import.meta.env.VITE_AUTH0_DOMAIN || 'dev-ksochydsohqywqbm.us.auth0.com',
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || 'your-client-id',
    audience: import.meta.env.VITE_AUTH0_AUDIENCE || 'https://notificamy.com/api'
  }
};

// Debug info (only in development)
if (ENV.isDevelopment) {
  console.log('Environment Configuration:', {
    environment: import.meta.env.VITE_ENVIRONMENT,
    apiBaseUrl: ENV.apiBaseUrl,
    auth0Domain: ENV.auth0.domain,
    auth0ClientId: ENV.auth0.clientId ? 'SET' : 'NOT SET',
    auth0Audience: ENV.auth0.audience
  });
}