#!/bin/bash

echo "🔍 Checking backend status..."

echo ""
echo "1. Checking what's running on port 80:"
sudo netstat -tlnp | grep :80 || echo "❌ Nothing running on port 80"

echo ""
echo "2. Checking all listening ports:"
sudo netstat -tlnp | grep LISTEN | grep -E "(80|443|3000|3001|5000|8000)"

echo ""
echo "3. Testing API through Apache:"
curl -v https://notificamy.com/api/health 2>&1 | head -10

echo ""
echo "4. Testing backend directly:"
curl -v http://localhost:80/api/health 2>&1 | head -10

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