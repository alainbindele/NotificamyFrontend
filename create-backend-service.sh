#!/bin/bash

echo "🔧 Creating systemd service for NotifyMe Backend..."

# Find backend directory
BACKEND_DIR=""
BACKEND_DIRS=(
    "/var/www/notificamy-backend"
    "/opt/notificamy/backend"
    "/home/notificamy/backend"
    "/var/www/backend"
)

for dir in "${BACKEND_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        BACKEND_DIR="$dir"
        break
    fi
done

if [ -z "$BACKEND_DIR" ]; then
    echo "❌ Backend directory not found!"
    exit 1
fi

echo "✅ Using backend directory: $BACKEND_DIR"

# Determine project type and create appropriate service
cd "$BACKEND_DIR"

if [ -f "pom.xml" ] || [ -f "build.gradle" ]; then
    # Java Spring Boot
    JAR_FILE=$(find . -name "*.jar" -not -path "./target/original-*" | head -1)
    
    if [ -z "$JAR_FILE" ]; then
        echo "❌ No JAR file found. Building project..."
        if [ -f "pom.xml" ]; then
            mvn clean package -DskipTests
            JAR_FILE=$(find target -name "*.jar" -not -name "*original*" | head -1)
        else
            ./gradlew build
            JAR_FILE=$(find build/libs -name "*.jar" | head -1)
        fi
    fi
    
    if [ -n "$JAR_FILE" ]; then
        cat > /tmp/notificamy-backend.service << EOF
[Unit]
Description=NotifyMe Backend API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=$BACKEND_DIR
ExecStart=/usr/bin/java -jar $BACKEND_DIR/$JAR_FILE --server.port=8080 --spring.profiles.active=production
Restart=always
RestartSec=10
Environment=JAVA_OPTS="-Xmx512m"
Environment=SERVER_PORT=8080
Environment=SPRING_PROFILES_ACTIVE=production

[Install]
WantedBy=multi-user.target
EOF
    else
        echo "❌ No JAR file found"
        exit 1
    fi

elif [ -f "package.json" ]; then
    # Node.js
    cat > /tmp/notificamy-backend.service << EOF
[Unit]
Description=NotifyMe Backend API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=$BACKEND_DIR
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=8080

[Install]
WantedBy=multi-user.target
EOF

elif [ -f "app.py" ] || [ -f "main.py" ]; then
    # Python
    MAIN_FILE="app.py"
    [ -f "main.py" ] && MAIN_FILE="main.py"
    
    cat > /tmp/notificamy-backend.service << EOF
[Unit]
Description=NotifyMe Backend API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=$BACKEND_DIR
ExecStart=/usr/bin/python3 $MAIN_FILE
Restart=always
RestartSec=10
Environment=PYTHONPATH=$BACKEND_DIR
Environment=PORT=8080

[Install]
WantedBy=multi-user.target
EOF

else
    echo "❌ Unknown project type"
    exit 1
fi

# Install the service
echo "📦 Installing systemd service..."
sudo mv /tmp/notificamy-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable notificamy-backend
sudo systemctl start notificamy-backend

echo "✅ Service created and started!"
echo ""
echo "🔍 Service status:"
sudo systemctl status notificamy-backend

echo ""
echo "📋 Useful commands:"
echo "  sudo systemctl status notificamy-backend   # Check status"
echo "  sudo systemctl restart notificamy-backend  # Restart service"
echo "  sudo systemctl logs notificamy-backend     # View logs"
echo "  sudo journalctl -u notificamy-backend -f   # Follow logs"