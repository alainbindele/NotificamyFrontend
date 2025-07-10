#!/bin/bash

echo "🔍 Testing backend connectivity..."

# Test if backend is running on port 8080
echo "Testing localhost:8080..."
curl -v http://localhost:8080/api/health 2>&1 | head -20

echo ""
echo "Testing if Apache proxy is working..."
curl -v https://notificamy.com/api/health 2>&1 | head -20

echo ""
echo "🔧 Backend service status:"
sudo systemctl status your-backend-service-name || echo "Backend service not found"

echo ""
echo "🔍 Checking what's running on port 8080:"
sudo netstat -tlnp | grep :8080 || echo "Nothing running on port 8080"

echo ""
echo "📋 Apache modules status:"
sudo apache2ctl -M | grep -E "(proxy|rewrite)" || echo "Proxy/Rewrite modules not loaded"