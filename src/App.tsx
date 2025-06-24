import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Bell, Mail, MessageSquare, Slack, Calendar, Clock, Zap, Globe, Smartphone, Monitor, Loader2, Hash, Lock, Shield, UserCheck } from 'lucide-react';
import { ApiService } from './services/apiService';
import { AuthApiService } from './services/authApiService';
import { NotificationPopup } from './components/NotificationPopup';
import { AuthButton } from './components/AuthButton';
import { SocialLoginModal } from './components/SocialLoginModal';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ChannelConfigModal } from './components/ChannelConfigModal';

const translations = {
  en: {
    title: "Notificamy",
    alphaStatus: "Alpha",
    subtitle: "Never Miss What Matters",
    hero: "The Ultimate AI-Powered Notification System",
    description: "Transform any idea into smart notifications. Get alerted via Email, WhatsApp, Slack, or Discord exactly when you need it.",
    promptPlaceholder: "Tell our AI what you want to be notified about...",
    emailPlaceholder: "Enter your email address",
    channelLabel: "Choose your notification channels (select multiple)",
    getStarted: "Notificamy!",
    processing: "Processing...",
    loginToUse: "Sign in to create notifications",
    signInRequired: "Sign In Required",
    signInMessage: "Create your free account to start receiving AI-powered notifications",
    signInNow: "Sign In Now",
    whySignIn: "Why sign in?",
    signInBenefits: [
      "Save your notification preferences",
      "Track your notification history", 
      "Access all notification channels",
      "Get personalized AI recommendations"
    ],
    features: "Features",
    multiPlatform: "Multi-Platform Delivery",
    multiPlatformDesc: "Receive notifications on your preferred platforms - Email, WhatsApp, Slack, or Discord",
    smartScheduling: "Smart Scheduling",
    smartSchedulingDesc: "Set periodic notifications or schedule for specific dates and times",
    aiPowered: "AI-Powered Intelligence",
    aiPoweredDesc: "Our AI understands context and delivers relevant notifications at the perfect moment",
    howItWorks: "How It Works",
    step1: "Describe Your Need",
    step1Desc: "Tell our AI what you want to be notified about in natural language",
    step2: "Choose Your Platforms",
    step2Desc: "Select Email, WhatsApp, Slack, or Discord as your notification channels",
    step3: "Set Your Schedule",
    step3Desc: "Choose periodic alerts or set specific dates and times",
    step4: "Stay Informed",
    step4Desc: "Receive intelligent notifications exactly when you need them",
    platforms: "Supported Platforms",
    pricing: "Simple Pricing",
    free: "Free",
    freeDesc: "Perfect for getting started",
    freeFeatures: ["5 notifications/month", "Email delivery", "Basic scheduling"],
    pro: "Pro",
    proDesc: "For power users",
    proFeatures: ["Unlimited notifications", "All platforms", "Advanced AI", "Custom scheduling"],
    enterprise: "Enterprise",
    enterpriseDesc: "For teams and organizations",
    enterpriseFeatures: ["Team management", "API access", "Priority support", "Custom integrations"],
    footer: "© 2025 Notificamy. Revolutionizing notifications with AI.",
    errorGeneric: "An error occurred while processing your request. Please try again.",
    errorNetwork: "Unable to connect to the server. Please check your connection and try again.",
    errorAuth: "Authentication required. Please sign in to continue.",
    errorNoChannels: "Please select at least one notification channel.",
    comingSoon: "Coming Soon",
    channels: {
      email: "Email",
      whatsapp: "WhatsApp",
      slack: "Slack",
      discord: "Discord"
    },
    selectedChannels: "Selected channels"
  },
  it: {
    title: "Notificamy",
    alphaStatus: "Alpha",
    subtitle: "Non Perdere Mai Ciò Che Conta",
    hero: "Il Sistema di Notifiche Definitivo Basato su AI",
    description: "Trasforma qualsiasi idea in notifiche intelligenti. Ricevi avvisi via Email, WhatsApp, Slack o Discord esattamente quando ne hai bisogno.",
    promptPlaceholder: "Racconta alla nostra AI di cosa vuoi essere notificato...",
    emailPlaceholder: "Inserisci il tuo indirizzo email",
    channelLabel: "Scegli i tuoi canali di notifica (selezione multipla)",
    getStarted: "Notificamy!",
    processing: "Elaborazione...",
    loginToUse: "Accedi per creare notifiche",
    signInRequired: "Accesso Richiesto",
    signInMessage: "Crea il tuo account gratuito per iniziare a ricevere notifiche basate su AI",
    signInNow: "Accedi Ora",
    whySignIn: "Perché accedere?",
    signInBenefits: [
      "Salva le tue preferenze di notifica",
      "Traccia la cronologia delle notifiche",
      "Accedi a tutti i canali di notifica",
      "Ottieni raccomandazioni AI personalizzate"
    ],
    features: "Caratteristiche",
    multiPlatform: "Consegna Multi-Piattaforma",
    multiPlatformDesc: "Ricevi notifiche sulle tue piattaforme preferite - Email, WhatsApp, Slack o Discord",
    smartScheduling: "Programmazione Intelligente",
    smartSchedulingDesc: "Imposta notifiche periodiche o programma per date e orari specifici",
    aiPowered: "Intelligenza Basata su AI",
    aiPoweredDesc: "La nostra AI comprende il contesto e invia notifiche rilevanti al momento perfetto",
    howItWorks: "Come Funziona",
    step1: "Descrivi la Tua Necessità",
    step1Desc: "Racconta alla nostra AI di cosa vuoi essere notificato in linguaggio naturale",
    step2: "Scegli le Tue Piattaforme",
    step2Desc: "Seleziona Email, WhatsApp, Slack o Discord come canali di notifica",
    step3: "Imposta la Programmazione",
    step3Desc: "Scegli avvisi periodici o imposta date e orari specifici",
    step4: "Rimani Informato",
    step4Desc: "Ricevi notifiche intelligenti esattamente quando ne hai bisogno",
    platforms: "Piattaforme Supportate",
    pricing: "Prezzi Semplici",
    free: "Gratuito",
    freeDesc: "Perfetto per iniziare",
    freeFeatures: ["5 notifiche/mese", "Consegna email", "Programmazione base"],
    pro: "Pro",
    proDesc: "Per utenti avanzati",
    proFeatures: ["Notifiche illimitate", "Tutte le piattaforme", "AI avanzata", "Programmazione personalizzata"],
    enterprise: "Enterprise",
    enterpriseDesc: "Per team e organizzazioni",
    enterpriseFeatures: ["Gestione team", "Accesso API", "Supporto prioritario", "Integrazioni personalizzate"],
    footer: "© 2025 Notificamy. Rivoluzione delle notifiche con AI.",
    errorGeneric: "Si è verificato un errore durante l'elaborazione della richiesta. Riprova.",
    errorNetwork: "Impossibile connettersi al server. Controlla la connessione e riprova.",
    errorAuth: "Autenticazione richiesta. Effettua l'accesso per continuare.",
    errorNoChannels: "Seleziona almeno un canale di notifica.",
    comingSoon: "Prossimamente",
    channels: {
      email: "Email",
      whatsapp: "WhatsApp",
      slack: "Slack",
      discord: "Discord"
    },
    selectedChannels: "Canali selezionati"
  }
};

export type NotificationChannel = 'email' | 'whatsapp' | 'slack' | 'discord';

export interface ChannelConfig {
  email?: string;
  whatsapp?: string;
  slack?: string;
  discord?: string;
}

function App() {
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const [language, setLanguage] = useState<'en' | 'it'>('en');
  const [prompt, setPrompt] = useState('');
  const [email, setEmail] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<NotificationChannel[]>(['email']);
  const [channelConfigs, setChannelConfigs] = useState<ChannelConfig>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showChannelConfigModal, setShowChannelConfigModal] = useState(false);
  const [popup, setPopup] = useState<{
    isOpen: boolean;
    isSuccess: boolean;
    message: string;
  }>({
    isOpen: false,
    isSuccess: false,
    message: ''
  });

  const t = translations[language];

  // Auto-fill email from authenticated user
  React.useEffect(() => {
    if (isAuthenticated && user?.email && !email) {
      setEmail(user.email);
      setChannelConfigs(prev => ({ ...prev, email: user.email }));
    }
  }, [isAuthenticated, user, email]);

  const channelIcons = {
    email: Mail,
    whatsapp: MessageSquare,
    slack: Slack,
    discord: Hash
  };

  const channelColors = {
    email: 'red',
    whatsapp: 'green',
    slack: 'purple',
    discord: 'indigo'
  };

  // Disabled channels for alpha
  const disabledChannels: NotificationChannel[] = ['whatsapp', 'slack', 'discord'];

  const toggleChannel = (channel: NotificationChannel) => {
    // Prevent toggling disabled channels
    if (disabledChannels.includes(channel)) {
      return;
    }

    setSelectedChannels(prev => {
      if (prev.includes(channel)) {
        // Remove channel
        const newChannels = prev.filter(c => c !== channel);
        // Remove config for this channel
        const newConfigs = { ...channelConfigs };
        delete newConfigs[channel];
        setChannelConfigs(newConfigs);
        return newChannels;
      } else {
        // Add channel
        return [...prev, channel];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim() || !email.trim()) {
      return;
    }

    if (selectedChannels.length === 0) {
      setPopup({
        isOpen: true,
        isSuccess: false,
        message: t.errorNoChannels
      });
      return;
    }

    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    // Check if we need channel configurations
    const needsConfig = selectedChannels.some(channel => {
      if (channel === 'email') return false; // Email is already configured
      return !channelConfigs[channel];
    });

    if (needsConfig) {
      setShowChannelConfigModal(true);
      return;
    }

    setIsLoading(true);

    try {
      const token = await getAccessTokenSilently();
      
      const validationData = await AuthApiService.validatePromptAuthenticated({
        prompt: prompt.trim(),
        email: email.trim(),
        channels: selectedChannels,
        channelConfigs: channelConfigs
      }, token);

      const isValid = validationData.validity.valid_prompt;
      const invalidReason = validationData.validity.invalid_reason;

      setPopup({
        isOpen: true,
        isSuccess: isValid,
        message: invalidReason || ''
      });

      // Clear form on success
      if (isValid) {
        setPrompt('');
        // Keep email and channels for authenticated users
        if (!isAuthenticated) {
          setEmail('');
          setSelectedChannels(['email']);
          setChannelConfigs({});
        }
      }

    } catch (error) {
      console.error('Validation failed:', error);
      
      let errorMessage = t.errorGeneric;
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage = t.errorNetwork;
        } else if (error.message.includes('Authentication required')) {
          errorMessage = t.errorAuth;
          setShowLoginModal(true);
        }
      }

      setPopup({
        isOpen: true,
        isSuccess: false,
        message: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChannelConfigSave = (configs: ChannelConfig) => {
    // Ensure we're storing clean string values
    const cleanConfigs: ChannelConfig = {};
    Object.keys(configs).forEach(key => {
      const value = configs[key as NotificationChannel];
      if (value && typeof value === 'string') {
        cleanConfigs[key as NotificationChannel] = value;
      }
    });
    
    setChannelConfigs(prev => ({ ...prev, ...cleanConfigs }));
    setShowChannelConfigModal(false);
    
    // Now submit the form
    handleSubmit(new Event('submit') as any);
  };

  const closePopup = () => {
    setPopup(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 opacity-50"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,255,0.1),transparent_50%)]"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,255,255,0.1),transparent_50%)]"></div>
      
      {/* Header */}
      <header className="relative z-10 px-4 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
                {t.title}
              </h1>
              <span className="text-xs font-medium text-fuchsia-400 uppercase tracking-wider -mt-1">
                {t.alphaStatus}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              onClick={() => setLanguage(language === 'en' ? 'it' : 'en')}
              className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs md:text-sm font-medium">{language.toUpperCase()}</span>
            </button>
            
            <AuthButton language={language} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-fuchsia-400 mb-2 tracking-wide uppercase">
              {t.subtitle}
            </h2>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent leading-tight">
              {t.hero}
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              {t.description}
            </p>
          </div>

          {/* Sign-in Required Section - Only show when not authenticated */}
          {!isAuthenticated && (
            <div className="max-w-2xl mx-auto mb-12 p-8 rounded-2xl bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/10 border border-fuchsia-500/30 backdrop-blur-sm">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-fuchsia-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center border border-fuchsia-500/30">
                  <Shield className="w-8 h-8 text-fuchsia-400" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                {t.signInRequired}
              </h3>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                {t.signInMessage}
              </p>

              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-4 text-fuchsia-400">{t.whySignIn}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {t.signInBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <UserCheck className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowLoginModal(true)}
                className="px-8 py-4 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-2xl font-semibold text-white hover:from-fuchsia-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-fuchsia-500/25"
              >
                <span className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>{t.signInNow}</span>
                </span>
              </button>
            </div>
          )}

          {/* Main Form - Only show when authenticated */}
          {isAuthenticated && (
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={t.promptPlaceholder}
                  className="w-full h-32 px-6 py-4 bg-white/10 backdrop-blur-sm border border-fuchsia-500/30 rounded-2xl placeholder-gray-400 text-white resize-none focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 transition-all duration-300"
                  rows={4}
                  required
                  disabled={isLoading}
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-fuchsia-500/20 to-cyan-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {/* Channel Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-300 text-left">
                    {t.channelLabel}
                  </label>
                  {selectedChannels.length > 0 && (
                    <div className="text-xs text-gray-400">
                      {t.selectedChannels}: {selectedChannels.length}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(Object.keys(channelIcons) as NotificationChannel[]).map((channel) => {
                    const Icon = channelIcons[channel];
                    const color = channelColors[channel];
                    const isSelected = selectedChannels.includes(channel);
                    const isDisabled = disabledChannels.includes(channel);
                    
                    return (
                      <button
                        key={channel}
                        type="button"
                        onClick={() => toggleChannel(channel)}
                        disabled={isLoading || isDisabled}
                        className={`
                          relative p-4 rounded-xl border-2 transition-all duration-300 transform
                          ${isDisabled 
                            ? 'border-gray-600 bg-gray-800/50 cursor-not-allowed opacity-60' 
                            : isSelected 
                              ? `border-${color}-500 bg-${color}-500/20 shadow-lg shadow-${color}-500/25 hover:scale-105` 
                              : `border-white/20 bg-white/5 hover:border-${color}-500/50 hover:bg-${color}-500/10 hover:scale-105`
                          }
                          disabled:transform-none
                        `}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <div className="relative">
                            <Icon className={`w-6 h-6 ${
                              isDisabled 
                                ? 'text-gray-500' 
                                : isSelected 
                                  ? `text-${color}-400` 
                                  : 'text-gray-400'
                            }`} />
                            {isDisabled && (
                              <Lock className="absolute -top-1 -right-1 w-3 h-3 text-gray-500" />
                            )}
                          </div>
                          <span className={`text-sm font-medium ${
                            isDisabled 
                              ? 'text-gray-500' 
                              : isSelected 
                                ? `text-${color}-400` 
                                : 'text-gray-400'
                          }`}>
                            {t.channels[channel]}
                          </span>
                          {isDisabled && (
                            <span className="text-xs text-gray-500 font-medium">
                              {t.comingSoon}
                            </span>
                          )}
                        </div>
                        {isSelected && !isDisabled && (
                          <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-${color}-500/10 to-${color}-500/20 pointer-events-none`}></div>
                        )}
                        {isSelected && !isDisabled && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-white">{selectedChannels.indexOf(channel) + 1}</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Selected Channels Summary */}
                {selectedChannels.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {selectedChannels.map((channel) => {
                      const Icon = channelIcons[channel];
                      const color = channelColors[channel];
                      const hasConfig = channel === 'email' || (channelConfigs[channel] && typeof channelConfigs[channel] === 'string');
                      
                      return (
                        <div
                          key={channel}
                          className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs border ${
                            hasConfig 
                              ? `border-${color}-500/50 bg-${color}-500/20 text-${color}-300`
                              : `border-yellow-500/50 bg-yellow-500/20 text-yellow-300`
                          }`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{t.channels[channel]}</span>
                          {!hasConfig && <span className="text-yellow-400">⚠</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-cyan-500/30 rounded-2xl placeholder-gray-400 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                    required
                    disabled={isLoading || (isAuthenticated && user?.email)}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading || !prompt.trim() || !email.trim() || selectedChannels.length === 0}
                  className="px-8 py-4 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-2xl font-semibold text-white hover:from-fuchsia-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-fuchsia-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span className="flex items-center space-x-2">
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Zap className="w-5 h-5" />
                    )}
                    <span>{isLoading ? t.processing : t.getStarted}</span>
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Platforms Section */}
      <section className="relative z-10 px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            {t.platforms}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-red-500/50 transition-all duration-300 group">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-2xl flex items-center justify-center group-hover:bg-red-500/30 transition-all duration-300">
                <Mail className="w-8 h-8 text-red-400" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Email</h4>
              <p className="text-gray-400">Reliable delivery to your inbox</p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 opacity-60 relative">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-2xl flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-green-400" />
                <Lock className="absolute top-2 right-2 w-4 h-4 text-gray-500" />
              </div>
              <h4 className="text-xl font-semibold mb-2">WhatsApp</h4>
              <p className="text-gray-400">Instant mobile notifications</p>
              <div className="absolute top-4 right-4 px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300">
                {t.comingSoon}
              </div>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 opacity-60 relative">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                <Slack className="w-8 h-8 text-purple-400" />
                <Lock className="absolute top-2 right-2 w-4 h-4 text-gray-500" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Slack</h4>
              <p className="text-gray-400">Team collaboration alerts</p>
              <div className="absolute top-4 right-4 px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300">
                {t.comingSoon}
              </div>
            </div>

            <div className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 opacity-60 relative">
              <div className="w-16 h-16 mx-auto mb-4 bg-indigo-500/20 rounded-2xl flex items-center justify-center">
                <Hash className="w-8 h-8 text-indigo-400" />
                <Lock className="absolute top-2 right-2 w-4 h-4 text-gray-500" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Discord</h4>
              <p className="text-gray-400">Gaming and community alerts</p>
              <div className="absolute top-4 right-4 px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300">
                {t.comingSoon}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-16 bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            {t.features}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-fuchsia-500/10 to-purple-500/10 border border-fuchsia-500/20 hover:border-fuchsia-500/40 transition-all duration-300">
              <div className="w-12 h-12 bg-fuchsia-500/20 rounded-xl flex items-center justify-center mb-6">
                <Smartphone className="w-6 h-6 text-fuchsia-400" />
              </div>
              <h4 className="text-xl font-semibold mb-4">{t.multiPlatform}</h4>
              <p className="text-gray-300">{t.multiPlatformDesc}</p>
            </div>
            
            <div className="p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6 text-cyan-400" />
              </div>
              <h4 className="text-xl font-semibold mb-4">{t.smartScheduling}</h4>
              <p className="text-gray-300">{t.smartSchedulingDesc}</p>
            </div>
            
            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="text-xl font-semibold mb-4">{t.aiPowered}</h4>
              <p className="text-gray-300">{t.aiPoweredDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-16 bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            {t.howItWorks}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: t.step1, desc: t.step1Desc, icon: MessageSquare, color: 'fuchsia' },
              { title: t.step2, desc: t.step2Desc, icon: Monitor, color: 'cyan' },
              { title: t.step3, desc: t.step3Desc, icon: Clock, color: 'purple' },
              { title: t.step4, desc: t.step4Desc, icon: Bell, color: 'indigo' }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 mx-auto mb-6 bg-${step.color}-500/20 rounded-2xl flex items-center justify-center border border-${step.color}-500/30`}>
                  <step.icon className={`w-8 h-8 text-${step.color}-400`} />
                </div>
                <h4 className="text-lg font-semibold mb-3">{step.title}</h4>
                <p className="text-gray-400 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              {t.title}
            </h3>
          </div>
          <p className="text-gray-400">{t.footer}</p>
        </div>
      </footer>

      {/* Modals */}
      <SocialLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        language={language}
      />

      <ChannelConfigModal
        isOpen={showChannelConfigModal}
        onClose={() => setShowChannelConfigModal(false)}
        onSave={handleChannelConfigSave}
        selectedChannels={selectedChannels}
        existingConfigs={channelConfigs}
        language={language}
      />

      <NotificationPopup
        isOpen={popup.isOpen}
        onClose={closePopup}
        isSuccess={popup.isSuccess}
        message={popup.message}
        language={language}
      />
    </div>
  );
}

export default App;