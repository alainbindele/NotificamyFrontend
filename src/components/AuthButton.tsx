import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { LogIn, LogOut, User, Loader2 } from 'lucide-react';

interface AuthButtonProps {
  language: 'en' | 'it';
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
  }
};

export const AuthButton: React.FC<AuthButtonProps> = ({ language }) => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();
  const t = authTranslations[language];

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">{t.loading}</span>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
          {user.picture ? (
            <img 
              src={user.picture} 
              alt={user.name || 'User'} 
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <User className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">
            {t.welcome}, {user.name?.split(' ')[0] || user.email}
          </span>
        </div>
        
        <button
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500/20 backdrop-blur-sm border border-red-500/30 hover:bg-red-500/30 transition-all duration-300 text-red-400 hover:text-red-300"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">{t.logout}</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => loginWithRedirect()}
      className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-fuchsia-500/20 to-cyan-500/20 backdrop-blur-sm border border-fuchsia-500/30 hover:border-fuchsia-500/50 hover:from-fuchsia-500/30 hover:to-cyan-500/30 transition-all duration-300"
    >
      <LogIn className="w-4 h-4" />
      <span className="text-sm font-medium">{t.login}</span>
    </button>
  );
};