import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App.tsx';
import { PlansPage } from './pages/PlansPage.tsx';
import { auth0Config } from './config/auth0';
import './index.css';

// Debug environment variables
console.log('Environment check:', {
  AUTH0_DOMAIN: import.meta.env.VITE_AUTH0_DOMAIN,
  AUTH0_CLIENT_ID: import.meta.env.VITE_AUTH0_CLIENT_ID ? 'SET' : 'NOT SET',
  AUTH0_AUDIENCE: import.meta.env.VITE_AUTH0_AUDIENCE,
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider {...auth0Config}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/plans" element={<PlansPage />} />
        </Routes>
      </BrowserRouter>
    </Auth0Provider>
  </StrictMode>
);