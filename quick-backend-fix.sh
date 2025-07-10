#!/bin/bash

echo "🔧 Quick backend troubleshooting..."

# Check if any backend is running
echo "1. Checking for running backend processes:"
ps aux | grep -E "(node|python|java)" | grep -E "(8080|backend|api|server)" | grep -v grep

echo ""
echo "2. Checking for backend files:"
find /var/www -name "*backend*" -o -name "*api*" -o -name "server.js" -o -name "app.py" 2>/dev/null | head -10

echo ""
echo "3. Checking systemd services:"
sudo systemctl list-units --type=service --state=running | grep -E "(backend|api|notif)"

echo ""
echo "4. Trying to start common backend services:"
sudo systemctl start notificamy-backend 2>/dev/null && echo "✅ Started notificamy-backend" || echo "❌ notificamy-backend service not found"
sudo systemctl start backend 2>/dev/null && echo "✅ Started backend" || echo "❌ backend service not found"
sudo systemctl start api 2>/dev/null && echo "✅ Started api" || echo "❌ api service not found"

echo ""
echo "5. Final check - what's on port 8080:"
sudo netstat -tlnp | grep :8080 || echo "❌ Still nothing on port 8080"

echo ""
echo "🔍 If nothing is running, you need to:"
echo "   1. Find your backend code"
echo "   2. Configure it to run on port 8080"
echo "   3. Start the backend service"
echo "   4. Make sure it accepts HTTPS requests"