#!/bin/bash

echo "🔍 Testing API connections..."

echo ""
echo "1. Testing API through Apache proxy:"
curl -v https://notificamy.com/api/health 2>&1 | head -10

echo ""
echo "2. Testing backend directly on port 80:"
curl -v http://localhost:80/api/health 2>&1 | head -10

echo ""
echo "3. Testing if Apache proxy is working:"
curl -v https://notificamy.com/api/v1/health 2>&1 | head -10

echo ""
echo "4. Checking what's running on port 80:"
sudo netstat -tlnp | grep :80

echo ""
echo "5. Testing Apache status:"
sudo systemctl status apache2

echo ""
echo "6. Checking backend service status:"
sudo systemctl status notificamy-backend || echo "Backend service not found"

echo ""