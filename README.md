# NotifyMe - AI-Powered Notification System

A modern web application that transforms natural language requests into smart notifications delivered via Email, WhatsApp, or Slack.

## Architecture

- **Frontend**: React 18 + TypeScript + Tailwind CSS (questo progetto)
- **Backend**: Gestito separatamente
- **Authentication**: Auth0 OAuth2/JWT
- **Build Tool**: Vite

## Features

- 🤖 AI-powered prompt validation
- 🔐 Secure Auth0 authentication
- 🌐 Multi-language support (EN/IT)
- 📱 Responsive cyberpunk design
- 🚀 Multi-platform notification delivery

## Prerequisites

- Node.js 18+ and npm
- Auth0 account
- Backend API separato già configurato

## Setup Instructions

### 1. Auth0 Configuration

1. Create an Auth0 application (Single Page Application type)
2. Set allowed callback URLs: `http://localhost:5173, https://notificamy.com`
3. Set allowed logout URLs: `http://localhost:5173, https://notificamy.com`
4. Create an API in Auth0 with identifier: `https://notificamy.com/api`

### 2. Environment Variables

Create a `.env` file in the root directory:

```bash
# Auth0 Configuration
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-spa-client-id
VITE_AUTH0_AUDIENCE=https://notificamy.com/api

# API Configuration
VITE_API_BASE_URL=https://your-backend-domain.com
```

## Development

### Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Production Deployment

### Build

```bash
npm run build
```

Built files will be in the `dist/` directory.

### Apache Configuration

```apache
<VirtualHost *:443>
    ServerName notificamy.com
    DocumentRoot /var/www/notificamy/dist
    
    # API Proxy
    ProxyPass /api/ https://your-backend-domain.com/api/
    ProxyPassReverse /api/ https://your-backend-domain.com/api/
    
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

1. User clicks "Sign In" → Redirected to Auth0
2. Auth0 authenticates → Returns to frontend with JWT
3. Frontend stores JWT → Makes API calls with Bearer token
4. Backend validates JWT → Processes requests

## Technology Stack

### Frontend
- React 18.3.1
- TypeScript 5.5.3
- Tailwind CSS 3.4.1
- Auth0 React SDK
- Lucide React Icons
- Vite 5.4.2

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

© 2025 NotifyMe. All rights reserved.