import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App.tsx';
import { PlansPage } from './pages/PlansPage.tsx';
import { auth0Config } from './config/auth0';
import './index.css';

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