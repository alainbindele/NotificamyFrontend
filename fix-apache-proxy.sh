#!/bin/bash

echo "🔧 Fixing Apache proxy configuration for backend on port 8080..."

# Enable required Apache modules
echo "📦 Enabling Apache modules..."
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod rewrite
sudo a2enmod headers

# Backup current Apache config
echo "💾 Backing up current Apache config..."
sudo cp /etc/apache2/sites-available/notificamy.conf /etc/apache2/sites-available/notificamy.conf.backup.$(date +%s)

# Copy new configuration
echo "📝 Updating Apache configuration..."
sudo cp apache-site.conf /etc/apache2/sites-available/notificamy.conf

# Test Apache configuration
echo "🧪 Testing Apache configuration..."
sudo apache2ctl configtest

if [ $? -eq 0 ]; then
    echo "✅ Apache configuration is valid"
    
    # Reload Apache
    echo "🔄 Reloading Apache..."
    sudo systemctl reload apache2
    
    echo "✅ Apache proxy configuration updated successfully!"
    echo ""
    echo "🔍 Testing proxy..."
    echo "Frontend: https://notificamy.com"
    echo "API Health: https://notificamy.com/api/health"
    echo "Backend Direct: http://localhost:8080/api/health"
    
else
    echo "❌ Apache configuration has errors!"
    echo "🔄 Restoring backup..."
    sudo cp /etc/apache2/sites-available/notificamy.conf.backup.$(date +%s) /etc/apache2/sites-available/notificamy.conf
    exit 1
fi