export const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || 'dev-ksochydsohqywqbm.us.auth0.com',
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || 'your-client-id',
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: import.meta.env.VITE_AUTH0_AUDIENCE || 'https://notificamy.com/api',
    scope: 'openid profile email offline_access'
  },
  cacheLocation: 'localstorage' as const,
  useRefreshTokens: true
};