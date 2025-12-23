import React, { useState, useEffect } from 'react';
import { useLogto } from '@logto/react';
import { Bell, Mail, MessageSquare, Slack, Hash, Check, ArrowLeft, Crown, Zap } from 'lucide-react';
import { AuthButton } from '../components/AuthButton';
import { LanguageSelector, Language } from '../components/LanguageSelector';

// Function to detect browser language
const detectBrowserLanguage = (): Language => {
  const browserLang = navigator.language.toLowerCase();
  
  if (browserLang.startsWith('it')) return 'it';
  if (browserLang.startsWith('es')) return 'es';
  if (browserLang.startsWith('fr')) return 'fr';
  if (browserLang.startsWith('de')) return 'de';
  if (browserLang.startsWith('zh')) return 'zh';
  
  return 'en'; // Default to English
};

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
  },
  es: {
    title: "Notificamy",
    alphaStatus: "Alpha",
    subtitle: "Elige Tu Plan",
    hero: "Precios Simples y Transparentes",
    description: "Comienza gratis y escala a medida que creces. Todos los planes incluyen nuestro sistema de notificaciones con IA.",
    backToHome: "← Volver al Inicio",
    back: "Atrás",
    monthly: "Mensual",
    yearly: "Anual",
    yearlyDiscount: "Ahorra 20%",
    mostPopular: "Más Popular",
    getStarted: "Comenzar",
    currentPlan: "Plan Actual",
    upgrade: "Actualizar Ahora",
    perMonth: "/mes",
    perYear: "/año",
    billed: "facturado",
    plans: {
      free: {
        name: "Gratis",
        price: "0",
        description: "Perfecto para comenzar",
        features: [
          "1 notificación por email al día",
          "Solo entrega por email",
          "Programación básica",
          "Soporte de la comunidad"
        ]
      },
      advanced: {
        name: "Avanzado",
        price: "5",
        description: "Para usuarios regulares",
        features: [
          "48 notificaciones por email al día",
          "Todos los canales de notificación",
          "Programación avanzada",
          "Soporte prioritario",
          "Plantillas personalizadas"
        ]
      },
      full: {
        name: "Completo",
        price: "10",
        description: "Para usuarios avanzados",
        features: [
          "300 notificaciones por email al día",
          "Todos los canales de notificación",
          "Funciones de IA avanzadas",
          "Soporte premium",
          "Integraciones personalizadas",
          "Panel de análisis"
        ]
      }
    },
    channels: {
      title: "Canales Disponibles por Plan",
      email: "Email",
      whatsapp: "WhatsApp",
      slack: "Slack",
      discord: "Discord"
    },
    faq: {
      title: "Preguntas Frecuentes",
      q1: "¿Puedo cambiar mi plan en cualquier momento?",
      a1: "Sí, puedes actualizar o reducir tu plan en cualquier momento. Los cambios toman efecto inmediatamente.",
      q2: "¿Qué pasa si excedo mi límite diario?",
      a2: "Las notificaciones se pondrán en cola y se enviarán al día siguiente. Puedes actualizar en cualquier momento para aumentar tus límites.",
      q3: "¿Ofrecen reembolsos?",
      a3: "Sí, ofrecemos una garantía de devolución de dinero de 30 días para todos los planes pagos.",
      q4: "¿Hay una tarifa de configuración?",
      a4: "No, no hay tarifas de configuración o costos ocultos. Solo pagas por tu plan seleccionado."
    },
    footer: "© 2025 Notificamy. Revolucionando las notificaciones con IA."
  },
  fr: {
    title: "Notificamy",
    alphaStatus: "Alpha",
    subtitle: "Choisissez Votre Plan",
    hero: "Prix Simples et Transparents",
    description: "Commencez gratuitement et évoluez à mesure que vous grandissez. Tous les plans incluent notre système de notifications alimenté par l'IA.",
    backToHome: "← Retour à l'Accueil",
    back: "Retour",
    monthly: "Mensuel",
    yearly: "Annuel",
    yearlyDiscount: "Économisez 20%",
    mostPopular: "Le Plus Populaire",
    getStarted: "Commencer",
    currentPlan: "Plan Actuel",
    upgrade: "Mettre à Niveau",
    perMonth: "/mois",
    perYear: "/an",
    billed: "facturé",
    plans: {
      free: {
        name: "Gratuit",
        price: "0",
        description: "Parfait pour commencer",
        features: [
          "1 notification email par jour",
          "Livraison par email uniquement",
          "Planification de base",
          "Support communautaire"
        ]
      },
      advanced: {
        name: "Avancé",
        price: "5",
        description: "Pour les utilisateurs réguliers",
        features: [
          "48 notifications email par jour",
          "Tous les canaux de notification",
          "Planification avancée",
          "Support prioritaire",
          "Modèles personnalisés"
        ]
      },
      full: {
        name: "Complet",
        price: "10",
        description: "Pour les utilisateurs avancés",
        features: [
          "300 notifications email par jour",
          "Tous les canaux de notification",
          "Fonctionnalités IA avancées",
          "Support premium",
          "Intégrations personnalisées",
          "Tableau de bord analytique"
        ]
      }
    },
    channels: {
      title: "Canaux Disponibles par Plan",
      email: "Email",
      whatsapp: "WhatsApp",
      slack: "Slack",
      discord: "Discord"
    },
    faq: {
      title: "Questions Fréquemment Posées",
      q1: "Puis-je changer mon plan à tout moment?",
      a1: "Oui, vous pouvez mettre à niveau ou rétrograder votre plan à tout moment. Les changements prennent effet immédiatement.",
      q2: "Que se passe-t-il si je dépasse ma limite quotidienne?",
      a2: "Les notifications seront mises en file d'attente et envoyées le jour suivant. Vous pouvez mettre à niveau à tout moment pour augmenter vos limites.",
      q3: "Offrez-vous des remboursements?",
      a3: "Oui, nous offrons une garantie de remboursement de 30 jours pour tous les plans payants.",
      q4: "Y a-t-il des frais de configuration?",
      a4: "Non, il n'y a pas de frais de configuration ou de coûts cachés. Vous ne payez que pour votre plan sélectionné."
    },
    footer: "© 2025 Notificamy. Révolutionner les notifications avec l'IA."
  },
  de: {
    title: "Notificamy",
    alphaStatus: "Alpha",
    subtitle: "Wählen Sie Ihren Plan",
    hero: "Einfache, Transparente Preise",
    description: "Starten Sie kostenlos und skalieren Sie, während Sie wachsen. Alle Pläne beinhalten unser KI-gestütztes Benachrichtigungssystem.",
    backToHome: "← Zurück zur Startseite",
    back: "Zurück",
    monthly: "Monatlich",
    yearly: "Jährlich",
    yearlyDiscount: "20% Sparen",
    mostPopular: "Am Beliebtesten",
    getStarted: "Loslegen",
    currentPlan: "Aktueller Plan",
    upgrade: "Jetzt Upgraden",
    perMonth: "/Monat",
    perYear: "/Jahr",
    billed: "abgerechnet",
    plans: {
      free: {
        name: "Kostenlos",
        price: "0",
        description: "Perfekt für den Einstieg",
        features: [
          "1 E-Mail-Benachrichtigung pro Tag",
          "Nur E-Mail-Zustellung",
          "Grundlegende Planung",
          "Community-Support"
        ]
      },
      advanced: {
        name: "Erweitert",
        price: "5",
        description: "Für regelmäßige Nutzer",
        features: [
          "48 E-Mail-Benachrichtigungen pro Tag",
          "Alle Benachrichtigungskanäle",
          "Erweiterte Planung",
          "Prioritäts-Support",
          "Benutzerdefinierte Vorlagen"
        ]
      },
      full: {
        name: "Vollständig",
        price: "10",
        description: "Für Power-User",
        features: [
          "300 E-Mail-Benachrichtigungen pro Tag",
          "Alle Benachrichtigungskanäle",
          "Erweiterte KI-Funktionen",
          "Premium-Support",
          "Benutzerdefinierte Integrationen",
          "Analytics-Dashboard"
        ]
      }
    },
    channels: {
      title: "Verfügbare Kanäle nach Plan",
      email: "E-Mail",
      whatsapp: "WhatsApp",
      slack: "Slack",
      discord: "Discord"
    },
    faq: {
      title: "Häufig Gestellte Fragen",
      q1: "Kann ich meinen Plan jederzeit ändern?",
      a1: "Ja, Sie können Ihren Plan jederzeit upgraden oder downgraden. Änderungen werden sofort wirksam.",
      q2: "Was passiert, wenn ich mein Tageslimit überschreite?",
      a2: "Benachrichtigungen werden in die Warteschlange eingereiht und am nächsten Tag gesendet. Sie können jederzeit upgraden, um Ihre Limits zu erhöhen.",
      q3: "Bieten Sie Rückerstattungen an?",
      a3: "Ja, wir bieten eine 30-tägige Geld-zurück-Garantie für alle bezahlten Pläne.",
      q4: "Gibt es eine Einrichtungsgebühr?",
      a4: "Nein, es gibt keine Einrichtungsgebühren oder versteckten Kosten. Sie zahlen nur für Ihren gewählten Plan."
    },
    footer: "© 2025 Notificamy. Revolutionierung von Benachrichtigungen mit KI."
  },
  zh: {
    title: "Notificamy",
    alphaStatus: "Alpha",
    subtitle: "选择您的计划",
    hero: "简单透明的定价",
    description: "免费开始，随着成长而扩展。所有计划都包含我们的AI驱动通知系统。",
    backToHome: "← 返回首页",
    back: "返回",
    monthly: "月付",
    yearly: "年付",
    yearlyDiscount: "节省20%",
    mostPopular: "最受欢迎",
    getStarted: "开始使用",
    currentPlan: "当前计划",
    upgrade: "立即升级",
    perMonth: "/月",
    perYear: "/年",
    billed: "计费",
    plans: {
      free: {
        name: "免费",
        price: "0",
        description: "完美的入门选择",
        features: [
          "每天1条邮件通知",
          "仅邮件投递",
          "基础调度",
          "社区支持"
        ]
      },
      advanced: {
        name: "高级",
        price: "5",
        description: "适合常规用户",
        features: [
          "每天48条邮件通知",
          "所有通知渠道",
          "高级调度",
          "优先支持",
          "自定义模板"
        ]
      },
      full: {
        name: "完整",
        price: "10",
        description: "适合高级用户",
        features: [
          "每天300条邮件通知",
          "所有通知渠道",
          "高级AI功能",
          "高级支持",
          "自定义集成",
          "分析仪表板"
        ]
      }
    },
    channels: {
      title: "按计划提供的渠道",
      email: "电子邮件",
      whatsapp: "WhatsApp",
      slack: "Slack",
      discord: "Discord"
    },
    faq: {
      title: "常见问题",
      q1: "我可以随时更改计划吗？",
      a1: "是的，您可以随时升级或降级您的计划。更改立即生效。",
      q2: "如果我超过每日限制会怎样？",
      a2: "通知将排队并在第二天发送。您可以随时升级以增加限制。",
      q3: "您提供退款吗？",
      a3: "是的，我们为所有付费计划提供30天退款保证。",
      q4: "有设置费吗？",
      a4: "没有，没有设置费或隐藏费用。您只需为选择的计划付费。"
    },
    footer: "© 2025 Notificamy. 用AI革新通知。"
  }
};

export const PlansPage: React.FC = () => {
  const { isAuthenticated } = useLogto();
  const [language, setLanguage] = useState<Language>('en');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Initialize language from browser on component mount
  useEffect(() => {
    const detectedLang = detectBrowserLanguage();
    setLanguage(detectedLang);
  }, []);

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
    if (channelKey === 'slack') return true; // Slack now available for all plans
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
                <LanguageSelector 
                  language={language} 
                  onLanguageChange={setLanguage} 
                />
                
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
              <LanguageSelector 
                language={language} 
                onLanguageChange={setLanguage} 
              />
              
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