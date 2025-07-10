#!/bin/bash

echo "🔍 Testing API connections..."

echo ""
echo "1. Testing backend directly on port 8080:"
curl -v https://notificamy.com:8080/api/health 2>&1 | head -10

echo ""
echo "2. Testing if port 8080 is accessible:"
curl -v https://notificamy.com:8080/ 2>&1 | head -10

echo ""
echo "3. Testing HTTP on port 8080:"
curl -v http://notificamy.com:8080/api/health 2>&1 | head -10

echo ""
echo "4. Checking what's running on port 8080:"
sudo netstat -tlnp | grep :8080

echo ""
echo "5. Testing localhost backend:"
curl -v http://localhost:8080/api/health 2>&1 | head -10

echo ""
echo "6. Checking backend service status:"
sudo systemctl status notificamy-backend || echo "Backend service not found"

echo ""
echo "7. Checking if backend is configured for HTTPS on 8080:"
sudo ss -tlnp | grep :8080