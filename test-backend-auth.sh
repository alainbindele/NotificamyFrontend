#!/bin/bash

echo "🔐 Testing backend authentication..."

# Test health endpoint (should work without auth)
echo "1. Testing health endpoint (no auth required):"
curl -v https://notificamy.com:8080/api/v1/health 2>&1 | head -10

echo ""
echo "2. Testing protected endpoint without token (should fail):"
curl -v https://notificamy.com:8080/api/v1/user/profile 2>&1 | head -10

echo ""
echo "3. Testing with invalid token (should fail):"
curl -v -H "Authorization: Bearer invalid-token" https://notificamy.com:8080/api/v1/user/profile 2>&1 | head -10

echo ""
echo "4. Testing CORS preflight:"
curl -v -X OPTIONS \
  -H "Origin: https://notificamy.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization" \
  https://notificamy.com:8080/api/v1/validate-prompt 2>&1 | head -10

echo ""
echo "5. Backend logs (if available):"
sudo journalctl -u notificamy-backend --lines=10 2>/dev/null || echo "No backend service logs found"