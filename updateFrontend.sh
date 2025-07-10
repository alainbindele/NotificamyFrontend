#!/bin/bash
#
echo "🚀 Starting frontend deployment..."

cd NotificamyFrontend

# Backup current dist
echo "📦 Backing up current dist..."
sudo mv /var/www/notificamy/dist ../bkp_dist/`date +%s`.dist

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin master 

# Install dependencies (in case package.json changed)
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed! dist directory not found"
    echo "🔄 Restoring backup..."
    sudo mv ../bkp_dist/$(ls -t ../bkp_dist/ | head -1) /var/www/notificamy/dist
    exit 1
fi

# Move new dist to web directory
echo "🚀 Deploying new build..."
sudo mv dist/ /var/www/notificamy/

# Set proper permissions
echo "🔐 Setting permissions..."
sudo chown -R www-data:www-data /var/www/notificamy/dist
sudo chmod -R 755 /var/www/notificamy/dist

echo "✅ Frontend deployment completed successfully!"
echo "🌐 Site available at: https://notificamy.com"