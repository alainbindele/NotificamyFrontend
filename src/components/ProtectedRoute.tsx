import React from 'react';
import { useUser, SignUpButton } from '@clerk/clerk-react';
import { Loader2, Lock } from 'lucide-react';
import { Language } from './LanguageSelector';

interface ProtectedRouteProps {
  children: React.ReactNode;
  language: Language;
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
  },
  es: {
    loading: 'Cargando...',
    loginRequired: 'Autenticación Requerida',
    loginMessage: 'Inicia sesión para acceder a esta función',
    signIn: 'Iniciar Sesión'
  },
  fr: {
    loading: 'Chargement...',
    loginRequired: 'Authentification Requise',
    loginMessage: 'Veuillez vous connecter pour accéder à cette fonctionnalité',
    signIn: 'Se Connecter'
  },
  de: {
    loading: 'Laden...',
    loginRequired: 'Authentifizierung Erforderlich',
    loginMessage: 'Bitte melden Sie sich an, um auf diese Funktion zuzugreifen',
    signIn: 'Anmelden'
  },
  zh: {
    loading: '加载中...',
    loginRequired: '需要身份验证',
    loginMessage: '请登录以访问此功能',
    signIn: '登录'
  }
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, language }) => {
  const { isSignedIn, isLoaded } = useUser();
  const t = protectedTranslations[language];

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center space-x-2 py-8">
        <Loader2 className="w-6 h-6 animate-spin text-fuchsia-400" />
        <span className="text-gray-300">{t.loading}</span>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-fuchsia-500/20 rounded-2xl flex items-center justify-center">
          <Lock className="w-8 h-8 text-fuchsia-400" />
        </div>
        <h3 className="text-xl font-semibold mb-4 text-fuchsia-400">{t.loginRequired}</h3>
        <p className="text-gray-400 mb-6">{t.loginMessage}</p>
        <SignUpButton mode="modal">
          <button className="px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-xl font-semibold text-white hover:from-fuchsia-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300">
            {t.signIn}
          </button>
        </SignUpButton>
      </div>
    );
  }

  return <>{children}</>;
};