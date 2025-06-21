import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Loader2, Lock } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  language: 'en' | 'it';
}

const protectedTranslations = {
  en: {
    loading: 'Loading...',
    loginRequired: 'Authentication Required',
    loginMessage: 'Please sign in to access this feature',
    signIn: 'Sign In'
  },
  it: {
    loading: 'Caricamento...',
    loginRequired: 'Autenticazione Richiesta',
    loginMessage: 'Effettua l\'accesso per utilizzare questa funzione',
    signIn: 'Accedi'
  }
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, language }) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const t = protectedTranslations[language];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center space-x-2 py-8">
        <Loader2 className="w-6 h-6 animate-spin text-fuchsia-400" />
        <span className="text-gray-300">{t.loading}</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-fuchsia-500/20 rounded-2xl flex items-center justify-center">
          <Lock className="w-8 h-8 text-fuchsia-400" />
        </div>
        <h3 className="text-xl font-semibold mb-4 text-fuchsia-400">{t.loginRequired}</h3>
        <p className="text-gray-400 mb-6">{t.loginMessage}</p>
        <button
          onClick={() => loginWithRedirect()}
          className="px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-xl font-semibold text-white hover:from-fuchsia-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300"
        >
          {t.signIn}
        </button>
      </div>
    );
  }

  return <>{children}</>;
};