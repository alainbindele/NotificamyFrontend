#!/bin/bash

echo "🔍 Debugging API configuration..."

echo ""
echo "1. Checking .env file:"
cat .env | grep -E "(VITE_API_BASE_URL|VITE_AUTH0)"

echo ""
echo "2. Checking if .env is in the right location:"
ls -la .env

echo ""
echo "3. Checking built files for API URLs:"
if [ -d "/var/www/notificamy/dist" ]; then
    echo "Searching for API URLs in built files..."
    grep -r "notificamy.com" /var/www/notificamy/dist/ | head -10
else
    echo "No dist directory found"
fi

echo ""
echo "4. Testing current API endpoint:"
curl -v https://notificamy.com/api/health 2>&1 | head -10

echo ""
echo "5. Checking what's running on port 80:"
sudo netstat -tlnp | grep :80

echo ""
echo "6. Checking if backend is accessible:"