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
  console.log('Environment check:', {
    CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? 'SET' : 'NOT SET',
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT,
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD
  });
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