#!/bin/bash

echo "🔍 Checking backend status..."

echo ""
echo "1. Checking what's running on port 8080:"
sudo netstat -tlnp | grep :8080 || echo "❌ Nothing running on port 8080"

echo ""
echo "2. Checking all listening ports:"
sudo netstat -tlnp | grep LISTEN | grep -E "(8080|3000|3001|5000|8000)"

echo ""
echo "3. Testing localhost backend:"
curl -v http://localhost:8080/api/health 2>&1 | head -10

echo ""
echo "4. Testing HTTPS on 8080:"
curl -v https://localhost:8080/api/health 2>&1 | head -10

echo ""
echo "5. Checking for backend processes:"
ps aux | grep -E "(node|python|java|backend|notif)" | grep -v grep

echo ""
echo "6. Checking systemd services:"
sudo systemctl list-units --type=service | grep -E "(backend|notif|api)"

echo ""
echo "7. Checking Docker containers:"
docker ps 2>/dev/null || echo "Docker not available"

echo ""
echo "8. Checking PM2 processes:"
pm2 list 2>/dev/null || echo "PM2 not available"