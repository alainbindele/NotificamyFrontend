import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Bell, Mail, MessageSquare, Slack, Hash, Check, Globe, ArrowLeft, Crown, Zap, Shield, Users, BarChart3, Settings } from 'lucide-react';
import { AuthButton } from '../components/AuthButton';

const translations = {
  en: {
    title: "Notificamy",
    alphaStatus: "Alpha",
    subtitle: "Choose Your Plan",
    hero: "Simple, Transparent Pricing",
    description: "Start free and scale as you grow. All plans include our AI-powered notification system.",
    backToHome: "← Back to Home",
    back: "Back",
    monthly: "Monthly",
    yearly: "Yearly",
    yearlyDiscount: "Save 20%",
    mostPopular: "Most Popular",
    getStarted: "Get Started",
    currentPlan: "Current Plan",
    upgrade: "Upgrade Now",
    perMonth: "/month",
    perYear: "/year",
    billed: "billed",
    plans: {
      free: {
        name: "Free",
        price: "0",
        description: "Perfect for getting started",
        features: [
          "1 email notification per day",
          "Email delivery only",
          "Basic scheduling",
          "Community support"
        ]
      },
      advanced: {
        name: "Advanced",
        price: "5",
        description: "For regular users",
        features: [
          "48 email notifications per day",
          "All notification channels",
          "Advanced scheduling",
          "Priority support",
          "Custom templates"
        ]
      },
      full: {
        name: "Full",
        price: "10",
        description: "For power users",
        features: [
          "300 email notifications per day",
          "All notification channels",
          "Advanced AI features",
          "Premium support",
          "Custom integrations",
          "Analytics dashboard"
        ]
      }
    },
    channels: {
      title: "Available Channels by Plan",
      email: "Email",
      whatsapp: "WhatsApp",
      slack: "Slack",
      discord: "Discord"
    },
    faq: {
      title: "Frequently Asked Questions",
      q1: "Can I change my plan anytime?",
      a1: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
      q2: "What happens if I exceed my daily limit?",
      a2: "Notifications will be queued and sent the next day. You can upgrade anytime to increase your limits.",
      q3: "Do you offer refunds?",
      a3: "Yes, we offer a 30-day money-back guarantee for all paid plans.",
      q4: "Is there a setup fee?",
      a4: "No, there are no setup fees or hidden costs. You only pay for your selected plan."
    },
    footer: "© 2025 Notificamy. Revolutionizing notifications with AI."
  },
  it: {
    title: "Notificamy",
    alphaStatus: "Alpha",
    subtitle: "Scegli il Tuo Piano",
    hero: "Prezzi Semplici e Trasparenti",
    description: "Inizia gratis e scala man mano che cresci. Tutti i piani includono il nostro sistema di notifiche basato su AI.",
    backToHome: "← Torna alla Home",
    back: "Indietro",
    monthly: "Mensile",
    yearly: "Annuale",
    yearlyDiscount: "Risparmia 20%",
    mostPopular: "Più Popolare",
    getStarted: "Inizia",
    currentPlan: "Piano Attuale",
    upgrade: "Aggiorna Ora",
    perMonth: "/mese",
    perYear: "/anno",
    billed: "fatturato",
    plans: {
      free: {
        name: "Gratuito",
        price: "0",
        description: "Perfetto per iniziare",
        features: [
          "1 notifica email al giorno",
          "Solo consegna email",
          "Programmazione base",
          "Supporto community"
        ]
      },
      advanced: {
        name: "Avanzato",
        price: "5",
        description: "Per utenti regolari",
        features: [
          "48 notifiche email al giorno",
          "Tutti i canali di notifica",
          "Programmazione avanzata",
          "Supporto prioritario",
          "Template personalizzati"
        ]
      },
      full: {
        name: "Completo",
        price: "10",
        description: "Per utenti avanzati",
        features: [
          "300 notifiche email al giorno",
          "Tutti i canali di notifica",
          "Funzioni AI avanzate",
          "Supporto premium",
          "Integrazioni personalizzate",
          "Dashboard analytics"
        ]
      }
    },
    channels: {
      title: "Canali Disponibili per Piano",
      email: "Email",
      whatsapp: "WhatsApp",
      slack: "Slack",
      discord: "Discord"
    },
    faq: {
      title: "Domande Frequenti",
      q1: "Posso cambiare piano in qualsiasi momento?",
      a1: "Sì, puoi aggiornare o ridurre il tuo piano in qualsiasi momento. Le modifiche hanno effetto immediato.",
      q2: "Cosa succede se supero il limite giornaliero?",
      a2: "Le notifiche verranno messe in coda e inviate il giorno successivo. Puoi aggiornare in qualsiasi momento per aumentare i limiti.",
      q3: "Offrite rimborsi?",
      a3: "Sì, offriamo una garanzia di rimborso di 30 giorni per tutti i piani a pagamento.",
      q4: "C'è una tassa di attivazione?",
      a4: "No, non ci sono tasse di attivazione o costi nascosti. Paghi solo per il piano selezionato."
    },
    footer: "© 2025 Notificamy. Rivoluzione delle notifiche con AI."
  }
};

export const PlansPage: React.FC = () => {
  const { isAuthenticated } = useAuth0();
  const [language, setLanguage] = useState<'en' | 'it'>('en');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const t = translations[language];

  const getPrice = (basePrice: string) => {
    const price = parseInt(basePrice);
    if (price === 0) return '0';
    
    if (billingCycle === 'yearly') {
      return Math.round(price * 12 * 0.8).toString(); // 20% discount for yearly
    }
    return basePrice;
  };

  const getPriceDisplay = (basePrice: string) => {
    const price = getPrice(basePrice);
    if (price === '0') return '€0';
    
    if (billingCycle === 'yearly') {
      return `€${price}${t.perYear}`;
    }
    return `€${price}${t.perMonth}`;
  };

  const plans = [
    {
      key: 'free',
      popular: false,
      color: 'gray',
      icon: Mail
    },
    {
      key: 'advanced',
      popular: true,
      color: 'fuchsia',
      icon: Crown
    },
    {
      key: 'full',
      popular: false,
      color: 'cyan',
      icon: Zap
    }
  ];

  const channels = [
    { key: 'email', icon: Mail, color: 'red' },
    { key: 'whatsapp', icon: MessageSquare, color: 'green' },
    { key: 'slack', icon: Slack, color: 'purple' },
    { key: 'discord', icon: Hash, color: 'indigo' }
  ];

  const getChannelAvailability = (planKey: string, channelKey: string) => {
    if (channelKey === 'email') return true;
    if (planKey === 'free') return false;
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 opacity-50"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,255,0.1),transparent_50%)]"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,255,255,0.1),transparent_50%)]"></div>
      
      {/* Header */}
      <header className="relative z-10 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Layout */}
          <div className="md:hidden">
            {/* Top row with back button and auth */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.back}</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setLanguage(language === 'en' ? 'it' : 'en')}
                  className="flex items-center space-x-1 px-2 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-xs font-medium">{language.toUpperCase()}</span>
                </button>
                
                <AuthButton language={language} />
              </div>
            </div>
            
            {/* Bottom row with logo */}
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
                    {t.alphaStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
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
                    {t.alphaStatus}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setLanguage(language === 'en' ? 'it' : 'en')}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">{language.toUpperCase()}</span>
              </button>
              
              <AuthButton language={language} />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-sm font-semibold text-fuchsia-400 mb-2 tracking-wide uppercase">
            {t.subtitle}
          </h2>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent leading-tight">
            {t.hero}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t.description}
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'}`}>
              {t.monthly}
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-14 h-7 bg-white/20 rounded-full transition-all duration-300 focus:outline-none"
            >
              <div className={`absolute top-1 w-5 h-5 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-full transition-all duration-300 ${
                billingCycle === 'yearly' ? 'left-8' : 'left-1'
              }`}></div>
            </button>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-400'}`}>
                {t.yearly}
              </span>
              {billingCycle === 'yearly' && (
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                  {t.yearlyDiscount}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="relative z-10 px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const planData = t.plans[plan.key as keyof typeof t.plans];
              const Icon = plan.icon;
              
              return (
                <div
                  key={plan.key}
                  className={`relative p-8 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    plan.popular
                      ? `border-${plan.color}-500 bg-gradient-to-br from-${plan.color}-500/10 to-${plan.color}-500/5 shadow-2xl shadow-${plan.color}-500/20`
                      : `border-white/20 bg-white/5 hover:border-${plan.color}-500/50`
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-full text-sm font-semibold text-white">
                        {t.mostPopular}
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 mx-auto mb-4 bg-${plan.color}-500/20 rounded-2xl flex items-center justify-center`}>
                      <Icon className={`w-8 h-8 text-${plan.color}-400`} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{planData.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{planData.description}</p>
                    
                    <div className="mb-6">
                      <div className="text-4xl font-bold mb-2">
                        {getPriceDisplay(planData.price)}
                      </div>
                      {planData.price !== '0' && billingCycle === 'yearly' && (
                        <div className="text-sm text-gray-400">
                          {t.billed} {t.yearly.toLowerCase()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {planData.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className={`w-5 h-5 text-${plan.color}-400 mt-0.5 flex-shrink-0`} />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      plan.popular
                        ? `bg-gradient-to-r from-${plan.color}-500 to-cyan-500 text-white hover:from-${plan.color}-600 hover:to-cyan-600`
                        : `border-2 border-${plan.color}-500/50 text-${plan.color}-400 hover:bg-${plan.color}-500/20 hover:border-${plan.color}-500`
                    }`}
                  >
                    {planData.price === '0' ? t.getStarted : t.upgrade}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Channel Comparison */}
      <section className="relative z-10 px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            {t.channels.title}
          </h3>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
            <div className="grid grid-cols-4 gap-2 md:gap-4 p-4 md:p-6 border-b border-white/10">
              <div className="font-semibold text-gray-300 text-sm md:text-base">Channel</div>
              <div className="text-center font-semibold text-gray-300 text-sm md:text-base">Free</div>
              <div className="text-center font-semibold text-fuchsia-400 text-sm md:text-base">Advanced</div>
              <div className="text-center font-semibold text-cyan-400 text-sm md:text-base">Full</div>
            </div>
            
            {channels.map((channel) => {
              const Icon = channel.icon;
              return (
                <div key={channel.key} className="grid grid-cols-4 gap-2 md:gap-4 p-4 md:p-6 border-b border-white/5 last:border-b-0">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <Icon className={`w-4 h-4 md:w-5 md:h-5 text-${channel.color}-400`} />
                    <span className="text-gray-300 text-sm md:text-base">{t.channels[channel.key as keyof typeof t.channels]}</span>
                  </div>
                  
                  {plans.map((plan) => (
                    <div key={plan.key} className="text-center">
                      {getChannelAvailability(plan.key, channel.key) ? (
                        <Check className="w-4 h-4 md:w-5 md:h-5 text-green-400 mx-auto" />
                      ) : (
                        <div className="w-4 h-4 md:w-5 md:h-5 mx-auto rounded-full bg-gray-600"></div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            {t.faq.title}
          </h3>
          
          <div className="space-y-6">
            {[
              { q: t.faq.q1, a: t.faq.a1 },
              { q: t.faq.q2, a: t.faq.a2 },
              { q: t.faq.q3, a: t.faq.a3 },
              { q: t.faq.q4, a: t.faq.a4 }
            ].map((faq, index) => (
              <div key={index} className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <h4 className="text-lg font-semibold mb-3 text-fuchsia-400">{faq.q}</h4>
                <p className="text-gray-300 leading-relaxed">{faq.a}</p>
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
    </div>
  );
};