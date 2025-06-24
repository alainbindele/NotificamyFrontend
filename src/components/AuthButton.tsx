import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { LogIn, LogOut, User, Loader2 } from 'lucide-react';
import { Language } from './LanguageSelector';

interface AuthButtonProps {
  language: Language;
}

const authTranslations = {
  en: {
    login: 'Sign In',
    logout: 'Sign Out',
    loading: 'Loading...',
    welcome: 'Welcome'
  },
  it: {
    login: 'Accedi',
    logout: 'Esci',
    loading: 'Caricamento...',
    welcome: 'Benvenuto'
  },
  es: {
    login: 'Iniciar Sesión',
    logout: 'Cerrar Sesión',
    loading: 'Cargando...',
    welcome: 'Bienvenido'
  },
  fr: {
    login: 'Se Connecter',
    logout: 'Se Déconnecter',
    loading: 'Chargement...',
    welcome: 'Bienvenue'
  },
  de: {
    login: 'Anmelden',
    logout: 'Abmelden',
    loading: 'Laden...',
    welcome: 'Willkommen'
  },
  zh: {
    login: '登录',
    logout: '登出',
    loading: '加载中...',
    welcome: '欢迎'
  }
};

export const AuthButton: React.FC<AuthButtonProps> = ({ language }) => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();
  const t = authTranslations[language];

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 px-3 md:px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-xs md:text-sm hidden md:block">{t.loading}</span>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center space-x-2 md:space-x-3">
        <div className="flex items-center space-x-2 px-2 md:px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
          {user.picture ? (
            <img 
              src={user.picture} 
              alt={user.name || 'User'} 
              className="w-5 h-5 md:w-6 md:h-6 rounded-full"
            />
          ) : (
            <User className="w-4 h-4 md:w-5 md:h-5" />
          )}
          <span className="text-xs md:text-sm font-medium hidden md:block">
            {t.welcome}, {user.name?.split(' ')[0] || user.email}
          </span>
          <span className="text-xs font-medium md:hidden">
            {user.name?.split(' ')[0] || user.email?.split('@')[0]}
          </span>
        </div>
        
        <button
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          className="flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-2 rounded-lg bg-red-500/20 backdrop-blur-sm border border-red-500/30 hover:bg-red-500/30 transition-all duration-300 text-red-400 hover:text-red-300"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-xs md:text-sm font-medium hidden md:block">{t.logout}</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => loginWithRedirect()}
      className="flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 rounded-lg bg-gradient-to-r from-fuchsia-500/20 to-cyan-500/20 backdrop-blur-sm border border-fuchsia-500/30 hover:border-fuchsia-500/50 hover:from-fuchsia-500/30 hover:to-cyan-500/30 transition-all duration-300"
    >
      <LogIn className="w-4 h-4" />
      <span className="text-xs md:text-sm font-medium">{t.login}</span>
    </button>
  );
};