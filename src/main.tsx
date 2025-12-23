import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LogtoProvider } from '@logto/react';
import App from './App.tsx';
import { PlansPage } from './pages/PlansPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { CallbackPage } from './pages/CallbackPage.tsx';
import { logtoConfig } from './config/logto';
import './index.css';

// Debug environment variables
if (import.meta.env.DEV) {
  console.log('🔍 Environment Variables Check:', {
    LOGTO_ENDPOINT: import.meta.env.VITE_LOGTO_ENDPOINT ? 'SET' : 'NOT SET',
    LOGTO_APP_ID: import.meta.env.VITE_LOGTO_APP_ID ? 'SET' : 'NOT SET',
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT,
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
    ALL_VITE_VARS: Object.keys(import.meta.env).filter(k => k.startsWith('VITE_'))
  });
}

// Validate Logto config before rendering
if (!logtoConfig.endpoint || !logtoConfig.appId) {
  console.error('❌ CRITICAL: Logto configuration is missing!');
  console.error('Check your .env file for VITE_LOGTO_ENDPOINT and VITE_LOGTO_APP_ID');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LogtoProvider
      config={logtoConfig}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/callback" element={<CallbackPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </BrowserRouter>
    </LogtoProvider>
  </StrictMode>
);