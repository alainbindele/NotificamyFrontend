import React from 'react';
import { useUser, useClerk, SignUpButton, UserButton } from '@clerk/clerk-react';
import { LogIn, Loader2 } from 'lucide-react';
import { Language } from './LanguageSelector';

interface AuthButtonProps {
  language: Language;
}

const authTranslations = {
  en: {
    login: 'Sign In',
    loading: 'Loading...',
    welcome: 'Welcome'
  },
  it: {
    login: 'Accedi',
    loading: 'Caricamento...',
    welcome: 'Benvenuto'
  },
  es: {
    login: 'Iniciar Sesión',
    loading: 'Cargando...',
    welcome: 'Bienvenido'
  },
  fr: {
    login: 'Se Connecter',
    loading: 'Chargement...',
    welcome: 'Bienvenue'
  },
  de: {
    login: 'Anmelden',
    loading: 'Laden...',
    welcome: 'Willkommen'
  },
  zh: {
    login: '登录',
    loading: '加载中...',
    welcome: '欢迎'
  }
};

export const AuthButton: React.FC<AuthButtonProps> = ({ language }) => {
  const { isSignedIn, user, isLoaded } = useUser();
  const t = authTranslations[language];

  if (!isLoaded) {
    return (
      <div className="flex items-center space-x-2 px-3 md:px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-xs md:text-sm hidden md:block">{t.loading}</span>
      </div>
    );
  }

  if (isSignedIn && user) {
    return (
      <div className="flex items-center space-x-2 md:space-x-3">
        <div className="flex items-center space-x-2 px-2 md:px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
          <span className="text-xs md:text-sm font-medium hidden md:block">
            {t.welcome}, {user.firstName || user.emailAddresses[0]?.emailAddress?.split('@')[0]}
          </span>
          <span className="text-xs font-medium md:hidden">
            {user.firstName || user.emailAddresses[0]?.emailAddress?.split('@')[0]}
          </span>
        </div>
        
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "w-8 h-8 md:w-10 md:h-10",
              userButtonPopoverCard: "bg-gray-900 border border-white/20",
              userButtonPopoverActionButton: "text-white hover:bg-white/10",
              userButtonPopoverActionButtonText: "text-white",
              userButtonPopoverFooter: "hidden"
            }
          }}
        />
      </div>
    );
  }

  return (
    <SignUpButton mode="modal">
      <button className="flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 rounded-lg bg-gradient-to-r from-fuchsia-500/20 to-cyan-500/20 backdrop-blur-sm border border-fuchsia-500/30 hover:border-fuchsia-500/50 hover:from-fuchsia-500/30 hover:to-cyan-500/30 transition-all duration-300">
        <LogIn className="w-4 h-4" />
        <span className="text-xs md:text-sm font-medium">{t.login}</span>
      </button>
    </SignUpButton>
  );
};