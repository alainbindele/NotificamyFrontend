import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import { PlansPage } from './pages/PlansPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { clerkConfig } from './config/clerk';
import './index.css';

// Debug environment variables
if (import.meta.env.DEV) {
  console.log('🔍 Environment Variables Check:', {
    CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? 'SET' : 'NOT SET',
    CLERK_KEY_VALUE: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.substring(0, 20) + '...',
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT,
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
    ENV_FILES_LOADED: 'Check console for .env file loading'
  });
  
  // Show all VITE_ environment variables
  console.log('🔍 All VITE_ Environment Variables:', 
    Object.keys(import.meta.env)
      .filter(key => key.startsWith('VITE_'))
      .reduce((obj, key) => {
        obj[key] = import.meta.env[key];
        return obj;
      }, {})
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkConfig.publishableKey}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);