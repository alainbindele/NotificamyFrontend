import React from 'react';
import { useLogto } from '@logto/react';
import { LogIn, LogOut, Loader2, User } from 'lucide-react';
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
  const { isAuthenticated, isLoading, signIn, signOut, fetchUserInfo } = useLogto();
  const [userInfo, setUserInfo] = React.useState<any>(null);
  const [showMenu, setShowMenu] = React.useState(false);
  const t = authTranslations[language];

  React.useEffect(() => {
    if (isAuthenticated && !userInfo) {
      fetchUserInfo().then(setUserInfo).catch(console.error);
    }
  }, [isAuthenticated, fetchUserInfo, userInfo]);

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 px-3 md:px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-xs md:text-sm hidden md:block">{t.loading}</span>
      </div>
    );
  }

  if (isAuthenticated && userInfo) {
    const displayName = userInfo.name || userInfo.username || userInfo.email?.split('@')[0] || 'User';

    return (
      <div className="flex items-center space-x-2 md:space-x-3 relative">
        <div className="flex items-center space-x-2 px-2 md:px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
          <span className="text-xs md:text-sm font-medium hidden md:block">
            {t.welcome}, {displayName}
          </span>
          <span className="text-xs font-medium md:hidden">
            {displayName}
          </span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 flex items-center justify-center hover:from-fuchsia-600 hover:to-cyan-600 transition-all"
          >
            <User className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-white/20 rounded-lg shadow-2xl z-50">
              <button
                onClick={() => {
                  setShowMenu(false);
                  signOut(window.location.origin);
                }}
                className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors flex items-center space-x-2 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn(window.location.origin + '/dashboard')}
      className="flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 rounded-lg bg-gradient-to-r from-fuchsia-500/20 to-cyan-500/20 backdrop-blur-sm border border-fuchsia-500/30 hover:border-fuchsia-500/50 hover:from-fuchsia-500/30 hover:to-cyan-500/30 transition-all duration-300"
    >
      <LogIn className="w-4 h-4" />
      <span className="text-xs md:text-sm font-medium">{t.login}</span>
    </button>
  );
};