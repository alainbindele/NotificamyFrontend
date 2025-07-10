#!/bin/bash

echo "🔄 Force rebuilding frontend with new API configuration..."

cd NotificamyFrontend

# Clear any build cache
echo "🧹 Clearing build cache..."
rm -rf dist/
rm -rf node_modules/.vite/
rm -rf .vite/

# Backup current dist
echo "📦 Backing up current dist..."
sudo mv /var/www/notificamy/dist ../bkp_dist/force-rebuild-`date +%s`.dist 2>/dev/null || echo "No existing dist to backup"

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin master 

# Show environment variables that will be used
echo "🔍 Environment variables:"
echo "VITE_API_BASE_URL: $(grep VITE_API_BASE_URL .env || echo 'NOT SET')"
echo "VITE_AUTH0_DOMAIN: $(grep VITE_AUTH0_DOMAIN .env || echo 'NOT SET')"

# Force clean install
echo "📦 Clean installing dependencies..."
rm -rf node_modules/
npm install

# Build with verbose output
echo "🔨 Building project with verbose output..."
npm run build -- --mode production

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed! dist directory not found"
    exit 1
fi

# Show what's in the built files (check if API URL is correct)
echo "🔍 Checking built files for API URL..."
grep -r "notificamy.com" dist/ | head -5

# Move new dist to web directory
echo "🚀 Deploying new build..."
sudo mv dist/ /var/www/notificamy/

# Set proper permissions
echo "🔐 Setting permissions..."
sudo chown -R www-data:www-data /var/www/notificamy/dist
sudo chmod -R 755 /var/www/notificamy/dist

echo "✅ Force rebuild completed!"
echo "🌐 Site available at: https://notificamy.com"
echo "🔧 API calls should now go to: https://notificamy.com:8080"