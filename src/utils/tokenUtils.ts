// Utility functions for JWT token handling

export interface TokenPayload {
  sub: string;
  aud: string | string[];
  iss: string;
  exp: number;
  iat: number;
  scope?: string;
  'https://notificamy.com/email'?: string;
  'https://notificamy.com/user_id'?: string;
  'https://notificamy.com/name'?: string;
}

/**
 * Decode JWT token payload (without verification)
 * This is for debugging purposes only
 */
export const decodeTokenPayload = (token: string): TokenPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }
    
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

/**
 * Extract email from token custom claims
 */
export const getEmailFromToken = (token: string): string | null => {
  const payload = decodeTokenPayload(token);
  return payload?.['https://notificamy.com/email'] || null;
};

/**
 * Extract user ID from token custom claims
 */
export const getUserIdFromToken = (token: string): string | null => {
  const payload = decodeTokenPayload(token);
  return payload?.['https://notificamy.com/user_id'] || null;
};

/**
 * Check if token has required custom claims
 */
export const hasRequiredClaims = (token: string): boolean => {
  const payload = decodeTokenPayload(token);
  if (!payload) return false;
  
  return !!(
    payload['https://notificamy.com/email'] &&
    payload['https://notificamy.com/user_id']
  );
};

/**
 * Debug token information
 */
export const debugToken = (token: string): void => {
  const payload = decodeTokenPayload(token);
  if (!payload) {
    console.log('❌ Invalid token');
    return;
  }
  
  console.group('🔍 JWT Token Debug');
  console.log('📧 Email:', payload['https://notificamy.com/email']);
  console.log('👤 User ID:', payload['https://notificamy.com/user_id']);
  console.log('🏷️ Name:', payload['https://notificamy.com/name']);
  console.log('🎯 Audience:', payload.aud);
  console.log('🔑 Subject:', payload.sub);
  console.log('⏰ Expires:', new Date(payload.exp * 1000).toLocaleString());
  console.log('🔒 Scopes:', payload.scope);
  console.groupEnd();
};