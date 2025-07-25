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
    CLERK_KEY_VALUE: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.substring(0, 30) + '...',
    CLERK_KEY_LENGTH: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.length,
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT,
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
    ALL_VITE_VARS: Object.keys(import.meta.env).filter(k => k.startsWith('VITE_'))
  });
}

// Validate Clerk key before rendering
if (!clerkConfig.publishableKey) {
  console.error('❌ CRITICAL: Clerk publishable key is missing!');
  console.error('Check your .env file for VITE_CLERK_PUBLISHABLE_KEY');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider 
      publishableKey={clerkConfig.publishableKey}
      appearance={clerkConfig.appearance}
      afterSignInUrl={clerkConfig.afterSignInUrl}
      afterSignUpUrl={clerkConfig.afterSignUpUrl}
      signInUrl={clerkConfig.signInUrl}
      signUpUrl={clerkConfig.signUpUrl}
    >
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