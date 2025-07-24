import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Bell, User, Settings, ArrowLeft, Loader2, Archive } from 'lucide-react';
import { AuthButton } from '../components/AuthButton';
import { LanguageSelector, Language } from '../components/LanguageSelector';
import { ProfileSection } from '../components/dashboard/ProfileSection';
import { NotificationsSection } from '../components/dashboard/NotificationsSection';
import { ArchivedSection } from '../components/dashboard/ArchivedSection';
import { ToastContainer } from '../components/Toast';
import { useDashboardData } from '../hooks/useDashboardData';
import { useToast } from '../hooks/useToast';
import { UserProfile } from '../types/api';

type TabType = 'notifications' | 'archived' | 'profile';

const detectBrowserLanguage = (): Language => {
  const browserLang = navigator.language.toLowerCase();
  
  if (browserLang.startsWith('it')) return 'it';
  if (browserLang.startsWith('es')) return 'es';
  if (browserLang.startsWith('fr')) return 'fr';
  if (browserLang.startsWith('de')) return 'de';
  if (browserLang.startsWith('zh')) return 'zh';
  
  return 'en';
};

const translations = {
  en: {
    title: "Notificamy",
    alphaStatus: "Alpha",
    dashboard: "Dashboard",
    backToHome: "← Back to Home",
    notifications: "Notifications",
    archived: "Archived",
    profile: "Profile",
    loading: "Loading dashboard...",
    error: "Failed to load dashboard",
    retry: "Retry"
  },
  it: {
    title: "Notificamy",
    alphaStatus: "Alpha",
    dashboard: "Dashboard",
    backToHome: "← Torna alla Home",
    notifications: "Notifiche",
    archived: "Archiviate",
    profile: "Profilo",
    loading: "Caricamento dashboard...",
    error: "Errore nel caricamento dashboard",
    retry: "Riprova"
  },
  es: {
    title: "Notificamy",
    alphaStatus: "Alpha",
    dashboard: "Panel de Control",
    backToHome: "← Volver al Inicio",
    notifications: "Notificaciones",
    archived: "Archivadas",
    profile: "Perfil",
    loading: "Cargando panel...",
    error: "Error al cargar el panel",
    retry: "Reintentar"
  },
  fr: {
    title: "Notificamy",
    alphaStatus: "Alpha",
    dashboard: "Tableau de Bord",
    backToHome: "← Retour à l'Accueil",
    notifications: "Notifications",
    archived: "Archivées",
    profile: "Profil",
    loading: "Chargement du tableau de bord...",
    error: "Échec du chargement du tableau de bord",
    retry: "Réessayer"
  },
  de: {
    title: "Notificamy",
    alphaStatus: "Alpha",
    dashboard: "Dashboard",
    backToHome: "← Zurück zur Startseite",
    notifications: "Benachrichtigungen",
    archived: "Archiviert",
    profile: "Profil",
    loading: "Dashboard wird geladen...",
    error: "Dashboard konnte nicht geladen werden",
    retry: "Wiederholen"
  },
  zh: {
    title: "Notificamy",
    alphaStatus: "Alpha",
    dashboard: "仪表板",
    backToHome: "← 返回首页",
    notifications: "通知",
    archived: "已归档",
    profile: "个人资料",
    loading: "正在加载仪表板...",
    error: "加载仪表板失败",
    retry: "重试"
  }
};

export const DashboardPage: React.FC = () => {
  const { isSignedIn, isLoaded } = useUser();
  const [language, setLanguage] = useState<Language>(detectBrowserLanguage());
  const [activeTab, setActiveTab] = useState<TabType>('notifications');
  const { toasts, removeToast } = useToast();
  
  const {
    userProfile,
    userStats,
    queries,
    queryStats,
    loading,
    error,
    refreshData,
    setUserProfile,
    setQueries
  } = useDashboardData();

  const t = translations[language];

  // Redirect to home if not authenticated
  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      console.log('Redirecting to home - not authenticated');
      // Use a timeout to avoid immediate redirect during Auth0 initialization
      const timer = setTimeout(() => {
        window.location.href = '/';
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isSignedIn, isLoaded]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-fuchsia-400" />
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null; // Will redirect via useEffect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 opacity-50"></div>
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,255,0.1),transparent_50%)]"></div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-fuchsia-400" />
            <p className="text-xl text-gray-300">{t.loading}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 opacity-50"></div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-2">Backend Temporarily Unavailable</h2>
            <p className="text-gray-400 mb-4">Il server è attualmente in manutenzione.</p>
            <p className="text-sm text-gray-500 mb-6">Stai visualizzando dati demo mentre ripristiniamo il servizio.</p>
            <button
              onClick={refreshData}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl font-semibold text-white hover:from-yellow-600 hover:to-orange-600 transition-all duration-300"
            >
              Riprova Connessione
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile || !userStats || !queryStats) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 opacity-50"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,255,0.1),transparent_50%)]"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,255,255,0.1),transparent_50%)]"></div>
      
      {/* Header */}
      <header className="relative z-10 px-4 py-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Home</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <LanguageSelector 
                  language={language} 
                  onLanguageChange={setLanguage} 
                />
                <AuthButton language={language} />
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
                    {t.title}
                  </h1>
                  <span className="text-xs font-medium text-fuchsia-400 uppercase tracking-wider -mt-1">
                    {t.dashboard}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.backToHome}</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
                    {t.title}
                  </h1>
                  <span className="text-xs font-medium text-fuchsia-400 uppercase tracking-wider -mt-1">
                    {t.dashboard}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSelector 
                language={language} 
                onLanguageChange={setLanguage} 
              />
              <AuthButton language={language} />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="relative z-10 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-1 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-2">
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 justify-center ${
                activeTab === 'notifications'
                  ? 'bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Bell className="w-5 h-5" />
              <span className="hidden sm:inline">{t.notifications}</span>
            </button>
            
            <button
              onClick={() => setActiveTab('archived')}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 justify-center ${
                activeTab === 'archived'
                  ? 'bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Archive className="w-5 h-5" />
              <span className="hidden sm:inline">{t.archived}</span>
            </button>
            
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 justify-center ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">{t.profile}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'notifications' && (
            <NotificationsSection
              queries={queries.filter(q => !q.closed)}
              queryStats={queryStats}
              onQueriesUpdate={setQueries}
              language={language}
            />
          )}
          
          {activeTab === 'archived' && (
            <ArchivedSection
              queries={queries.filter(q => q.closed)}
              onQueriesUpdate={setQueries}
              language={language}
            />
          )}
          
          {activeTab === 'profile' && (
            <ProfileSection
              userProfile={userProfile}
              userStats={userStats}
              onProfileUpdate={setUserProfile}
              language={language}
            />
          )}
        </div>
      </main>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};