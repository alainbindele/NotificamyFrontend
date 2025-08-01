# NotifyMe - AI-Powered Notification System

A modern web application that transforms natural language requests into smart notifications delivered via Email, WhatsApp, or Slack.

## Architecture

- **Frontend**: React 18 + TypeScript + Tailwind CSS (questo progetto)
- **Backend**: Gestito separatamente
- **Authentication**: Clerk
- **Build Tool**: Vite

## Features

- 🤖 AI-powered prompt validation
- 🔐 Secure Clerk authentication
- 🌐 Multi-language support (EN/IT)
- 📱 Responsive cyberpunk design
- 🚀 Multi-platform notification delivery

## Prerequisites

- Node.js 18+ and npm
- Clerk account
- Backend API separato già configurato

## Setup Instructions

### Production Deployment

The frontend is deployed using the `updateFrontend.sh` script:

```bash
# On the server
./updateFrontend.sh
```

This script:
1. Backs up the current deployment
2. Pulls latest changes from git
3. Installs dependencies
4. Builds the project
5. Deploys to Apache web directory
6. Sets proper permissions

### Backend Fallback System

The application includes a robust fallback system that automatically switches to demo data when the backend is unavailable (503/502 errors). This ensures users can still explore the application even during maintenance.

### 1. Clerk Configuration

1. Create a Clerk application at https://clerk.com
2. Get your publishable key from the Clerk dashboard
3. Configure allowed origins: `http://localhost:5173, https://notificamy.com`

### 2. Environment Variables

Create a `.env` file in the root directory for production:

```bash
# Clerk Configuration
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your-publishable-key-here

# API Configuration
VITE_API_BASE_URL=https://notificamy.com

# Environment
VITE_ENVIRONMENT=production
```

**Important**: Make sure to replace `pk_live_your-publishable-key-here` with your actual Clerk publishable key.

## Development

### Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Local Development with Backend Fallback

For local development, create a `.env.local` file:

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your-publishable-key-here
VITE_API_BASE_URL=http://localhost:3001
VITE_ENVIRONMENT=development
```

## Production Deployment

### Build

```bash
npm run build
```

Built files will be in the `dist/` directory. Use the provided `updateFrontend.sh` script for deployment.

### Apache Configuration

**IMPORTANTE**: Il backend deve essere configurato per girare sulla porta 8080.

```apache
<VirtualHost *:443>
    ServerName notificamy.com
    DocumentRoot /var/www/notificamy/dist
    
    # API Proxy to backend on port 8080
    ProxyPass /api/ http://localhost:80/api/
    ProxyPassReverse /api/ http://localhost:80/api/
    
    # SPA Routing
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} !^/api/
    RewriteRule . /index.html [L]
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/private.key
</VirtualHost>
```

### Backend Setup

**IMPORTANTE**: Il backend deve essere configurato per:
1. **Porta**: Girare sulla porta 80 con HTTP (dietro Apache proxy)
2. **CORS**: Accettare richieste da `https://notificamy.com`
3. **Endpoints**: Esporre tutti gli endpoint API sotto `/api/v1/`
4. **Proxy**: Configurato per funzionare dietro Apache proxy HTTPS

### Troubleshooting

Se le API vanno in errore 503, verifica:

```bash
# 1. Testa la connettività API
chmod +x test-api-connection.sh
./test-api-connection.sh

# 2. Verifica che il backend sia attivo sulla porta 8080 con HTTPS
curl http://localhost:80/api/health

# 3. Verifica che il backend accetti CORS
curl -H "Origin: https://notificamy.com" https://notificamy.com/api/health

# 4. Controlla i log del backend
sudo journalctl -u notificamy-backend -f
```

## API Endpoints

Il frontend si aspetta che il backend esponga:

- `POST /api/v1/validate-prompt` - Validate notification prompt (authenticated)

### Esempio di richiesta al backend:

```json
{
  "prompt": "Remind me to water the plants every morning",
  "email": "user@example.com",
  "timezone": "Europe/Rome",
  "channels": ["email"],
  "channelConfigs": {
    "email": "user@example.com"
  }
}
```

## Authentication Flow

1. User clicks "Sign In" → Clerk modal opens
2. Clerk authenticates → Returns JWT token
3. Frontend stores JWT → Makes API calls with Bearer token
4. Backend validates JWT → Processes requests

## Technology Stack

### Frontend
- **React 18.3.1** - UI Framework
- **TypeScript 5.5.3** - Type Safety
- **Tailwind CSS 3.4.1** - Styling
- **Clerk React** - Authentication
- **Lucide React Icons** - Icons
- **Vite 5.4.2** - Build Tool
- **React Router DOM** - Routing
- **React Hook Form** - Form Management

### Key Features
- 🌐 Multi-language support (EN, IT, ES, FR, DE, ZH)
- 🔐 Secure Clerk authentication
- 📱 Fully responsive design
- 🎨 Modern cyberpunk-inspired UI
- 🔄 Automatic backend fallback system
- 📊 Real-time dashboard with statistics
- 🚀 Production-ready deployment pipeline

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

© 2025 NotifyMe. All rights reserved.