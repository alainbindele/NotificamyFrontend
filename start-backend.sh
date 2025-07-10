#!/bin/bash

echo "🚀 Starting NotifyMe Backend..."

# Check if backend directory exists
BACKEND_DIRS=(
    "/var/www/notificamy-backend"
    "/opt/notificamy/backend"
    "/home/notificamy/backend"
    "/var/www/backend"
    "./backend"
)

BACKEND_DIR=""
for dir in "${BACKEND_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        BACKEND_DIR="$dir"
        echo "✅ Found backend directory: $BACKEND_DIR"
        break
    fi
done

if [ -z "$BACKEND_DIR" ]; then
    echo "❌ Backend directory not found!"
    echo "🔍 Searching for backend files..."
    find /var/www -name "*.jar" -o -name "pom.xml" -o -name "build.gradle" 2>/dev/null | head -5
    exit 1
fi

cd "$BACKEND_DIR"

# Check if it's a Java Spring Boot project
if [ -f "pom.xml" ] || [ -f "build.gradle" ]; then
    echo "☕ Detected Java Spring Boot project"
    
    # Look for JAR file
    JAR_FILE=$(find . -name "*.jar" -not -path "./target/original-*" | head -1)
    
    if [ -n "$JAR_FILE" ]; then
        echo "🚀 Starting with JAR: $JAR_FILE"
        java -jar "$JAR_FILE" --server.port=8080 --spring.profiles.active=production
    else
        echo "🔨 Building and starting..."
        if [ -f "pom.xml" ]; then
            mvn clean package -DskipTests
            JAR_FILE=$(find target -name "*.jar" -not -name "*original*" | head -1)
        else
            ./gradlew build
            JAR_FILE=$(find build/libs -name "*.jar" | head -1)
        fi
        
        if [ -n "$JAR_FILE" ]; then
            java -jar "$JAR_FILE" --server.port=8080 --spring.profiles.active=production
        else
            echo "❌ No JAR file found after build"
            exit 1
        fi
    fi

# Check if it's a Node.js project
elif [ -f "package.json" ]; then
    echo "📦 Detected Node.js project"
    npm install
    PORT=8080 npm start

# Check if it's a Python project
elif [ -f "requirements.txt" ] || [ -f "app.py" ] || [ -f "main.py" ]; then
    echo "🐍 Detected Python project"
    
    if [ -f "requirements.txt" ]; then
        pip3 install -r requirements.txt
    fi
    
    if [ -f "app.py" ]; then
        python3 app.py --port 8080
    elif [ -f "main.py" ]; then
        python3 main.py --port 8080
    else
        echo "❌ No main Python file found"
        exit 1
    fi

else
    echo "❌ Unknown project type"
    echo "📁 Directory contents:"
    ls -la
    exit 1
fi