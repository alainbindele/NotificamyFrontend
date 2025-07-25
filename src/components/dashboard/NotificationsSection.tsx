import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { 
  Bell, 
  Plus, 
  Filter, 
  Clock, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  BarChart3,
  Search,
  Eye,
  X,
  Mail,
  MessageSquare,
  Hash,
  Phone,
  Repeat,
  AlertCircle,
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { NotificationQuery, QueryStatistics, CreateNotificationRequest } from '../../types/api';
import { useNotifyMeAPI } from '../../hooks/useNotifyMeAPI';
import { useToast } from '../../hooks/useToast';
import { Language } from '../LanguageSelector';

interface NotificationsSectionProps {
  queries: NotificationQuery[];
  queryStats: QueryStatistics;
  onQueriesUpdate: (queries: NotificationQuery[]) => void;
  language: Language;
}

type FilterType = 'all' | 'active' | 'cron' | 'specific' | 'check';

const notificationsTranslations = {
  en: {
    title: 'My Notifications',
    subtitle: 'Manage your active notifications',
    statistics: 'Notification Statistics',
    total: 'Total',
    recurring: 'Recurring',
    scheduled: 'Scheduled',
    conditional: 'Conditional',
    searchPlaceholder: 'Search notifications...',
    filterAll: 'All',
    filterActive: 'Active Only',
    filterRecurring: 'Recurring',
    filterScheduled: 'Scheduled',
    filterConditional: 'Conditional',
    createNew: 'Create New',
    noNotifications: 'No notifications found',
    noNotificationsMessage: 'Try modifying your search filters.',
    noNotificationsEmpty: 'Create your first notification to get started.',
    createFirst: 'Create Your First Notification',
    itemsPerPage: 'Items per page',
    page: 'Page',
    of: 'of',
    previous: 'Previous',
    next: 'Next',
    showing: 'Showing',
    to: 'to',
    totalItems: 'of',
    details: 'Details',
    close: 'Close',
    channels: 'Channels',
    selectChannels: 'Select notification channels',
    channelEmail: 'Email',
    channelSlack: 'Slack',
    slackWebhook: 'Slack Webhook URL',
    slackWebhookPlaceholder: 'https://hooks.slack.com/services/...',
    createdOn: 'Created',
    nextExecution: 'Next',
    lastExecution: 'Last',
    expiresOn: 'Expires',
    confidence: 'confidence',
    createNotification: 'Create New Notification',
    cancel: 'Cancel',
    create: 'Create Notification',
    creating: 'Creating...',
    describeNotification: 'Describe your notification',
    descriptionPlaceholder: 'E.g.: Notify me every day at 9 AM about tech news...',
    email: 'Email',
    timezone: 'Timezone',
    notificationClosed: 'Notification Closed',
    notificationClosedMessage: 'The notification has been closed successfully.',
    closeError: 'Error',
    createSuccess: 'Notification Created',
    createSuccessMessage: 'Your notification has been created successfully.',
    createError: 'Creation Error',
    types: {
      recurring: 'Recurring',
      scheduled: 'Scheduled',
      conditional: 'Conditional',
      unknown: 'Unknown'
    },
    status: {
      active: 'Active',
      invalid: 'Invalid',
      expired: 'Expired'
    },
    channelNames: {
      email: 'Email',
      whatsapp: 'WhatsApp',
      slack: 'Slack',
      discord: 'Discord'
    }
  },
  it: {
    title: 'Le Mie Notifiche',
    subtitle: 'Gestisci le tue notifiche attive',
    statistics: 'Statistiche Notifiche',
    total: 'Totali',
    recurring: 'Ricorrenti',
    scheduled: 'Programmate',
    conditional: 'Condizionali',
    searchPlaceholder: 'Cerca notifiche...',
    filterAll: 'Tutte',
    filterActive: 'Solo Attive',
    filterRecurring: 'Ricorrenti',
    filterScheduled: 'Programmate',
    filterConditional: 'Condizionali',
    createNew: 'Crea Nuova',
    noNotifications: 'Nessuna notifica trovata',
    noNotificationsMessage: 'Prova a modificare i filtri di ricerca.',
    noNotificationsEmpty: 'Crea la tua prima notifica per iniziare.',
    createFirst: 'Crea la Tua Prima Notifica',
    itemsPerPage: 'Elementi per pagina',
    page: 'Pagina',
    of: 'di',
    previous: 'Precedente',
    next: 'Successiva',
    showing: 'Visualizzando',
    to: 'a',
    totalItems: 'di',
    details: 'Dettagli',
    close: 'Chiudi',
    channels: 'Canali',
    selectChannels: 'Seleziona i canali di notifica',
    channelEmail: 'Email',
    channelSlack: 'Slack',
    slackWebhook: 'URL Webhook Slack',
    slackWebhookPlaceholder: 'https://hooks.slack.com/services/...',
    createdOn: 'Creata',
    nextExecution: 'Prossima',
    lastExecution: 'Ultima',
    expiresOn: 'Scade',
    confidence: 'fiducia',
    createNotification: 'Crea Nuova Notifica',
    cancel: 'Annulla',
    create: 'Crea Notifica',
    creating: 'Creazione...',
    describeNotification: 'Descrivi la tua notifica',
    descriptionPlaceholder: 'Es: Notificami ogni giorno alle 9 sulle notizie di tecnologia...',
    email: 'Email',
    timezone: 'Fuso Orario',
    notificationClosed: 'Notifica Chiusa',
    notificationClosedMessage: 'La notifica è stata chiusa con successo.',
    closeError: 'Errore',
    createSuccess: 'Notifica Creata',
    createSuccessMessage: 'La tua notifica è stata creata con successo.',
    createError: 'Errore Creazione',
    types: {
      recurring: 'Ricorrente',
      scheduled: 'Programmata',
      conditional: 'Condizionale',
      unknown: 'Sconosciuto'
    },
    status: {
      active: 'Attiva',
      invalid: 'Non Valida',
      expired: 'Scaduta'
    },
    channelNames: {
      email: 'Email',
      whatsapp: 'WhatsApp',
      slack: 'Slack',
      discord: 'Discord'
    }
  },
  es: {
    title: 'Mis Notificaciones',
    subtitle: 'Gestiona tus notificaciones activas',
    statistics: 'Estadísticas de Notificaciones',
    total: 'Total',
    recurring: 'Recurrentes',
    scheduled: 'Programadas',
    conditional: 'Condicionales',
    searchPlaceholder: 'Buscar notificaciones...',
    filterAll: 'Todas',
    filterActive: 'Solo Activas',
    filterRecurring: 'Recurrentes',
    filterScheduled: 'Programadas',
    filterConditional: 'Condicionales',
    createNew: 'Crear Nueva',
    noNotifications: 'No se encontraron notificaciones',
    noNotificationsMessage: 'Intenta modificar los filtros de búsqueda.',
    noNotificationsEmpty: 'Crea tu primera notificación para comenzar.',
    createFirst: 'Crear Tu Primera Notificación',
    itemsPerPage: 'Elementos por página',
    page: 'Página',
    of: 'de',
    previous: 'Anterior',
    next: 'Siguiente',
    showing: 'Mostrando',
    to: 'a',
    totalItems: 'de',
    details: 'Detalles',
    close: 'Cerrar',
    channels: 'Canales',
    selectChannels: 'Seleccionar canales de notificación',
    channelEmail: 'Email',
    channelSlack: 'Slack',
    slackWebhook: 'URL Webhook Slack',
    slackWebhookPlaceholder: 'https://hooks.slack.com/services/...',
    createdOn: 'Creada',
    nextExecution: 'Próxima',
    lastExecution: 'Última',
    expiresOn: 'Expira',
    confidence: 'confianza',
    createNotification: 'Crear Nueva Notificación',
    cancel: 'Cancelar',
    create: 'Crear Notificación',
    creating: 'Creando...',
    describeNotification: 'Describe tu notificación',
    descriptionPlaceholder: 'Ej: Notifícame todos los días a las 9 AM sobre noticias de tecnología...',
    email: 'Email',
    timezone: 'Zona Horaria',
    notificationClosed: 'Notificación Cerrada',
    notificationClosedMessage: 'La notificación ha sido cerrada exitosamente.',
    closeError: 'Error',
    createSuccess: 'Notificación Creada',
    createSuccessMessage: 'Tu notificación ha sido creada exitosamente.',
    createError: 'Error de Creación',
    types: {
      recurring: 'Recurrente',
      scheduled: 'Programada',
      conditional: 'Condicional',
      unknown: 'Desconocido'
    },
    status: {
      active: 'Activa',
      invalid: 'Inválida',
      expired: 'Expirada'
    },
    channelNames: {
      email: 'Email',
      whatsapp: 'WhatsApp',
      slack: 'Slack',
      discord: 'Discord'
    }
  },
  fr: {
    title: 'Mes Notifications',
    subtitle: 'Gérer vos notifications actives',
    statistics: 'Statistiques des Notifications',
    total: 'Total',
    recurring: 'Récurrentes',
    scheduled: 'Programmées',
    conditional: 'Conditionnelles',
    searchPlaceholder: 'Rechercher des notifications...',
    filterAll: 'Toutes',
    filterActive: 'Actives Seulement',
    filterRecurring: 'Récurrentes',
    filterScheduled: 'Programmées',
    filterConditional: 'Conditionnelles',
    createNew: 'Créer Nouvelle',
    noNotifications: 'Aucune notification trouvée',
    noNotificationsMessage: 'Essayez de modifier les filtres de recherche.',
    noNotificationsEmpty: 'Créez votre première notification pour commencer.',
    createFirst: 'Créer Votre Première Notification',
    itemsPerPage: 'Éléments par page',
    page: 'Page',
    of: 'de',
    previous: 'Précédent',
    next: 'Suivant',
    showing: 'Affichage',
    to: 'à',
    totalItems: 'de',
    details: 'Détails',
    close: 'Fermer',
    channels: 'Canaux',
    selectChannels: 'Sélectionner les canaux de notification',
    channelEmail: 'Email',
    channelSlack: 'Slack',
    slackWebhook: 'URL Webhook Slack',
    slackWebhookPlaceholder: 'https://hooks.slack.com/services/...',
    createdOn: 'Créée',
    nextExecution: 'Prochaine',
    lastExecution: 'Dernière',
    expiresOn: 'Expire',
    confidence: 'confiance',
    createNotification: 'Créer Nouvelle Notification',
    cancel: 'Annuler',
    create: 'Créer Notification',
    creating: 'Création...',
    describeNotification: 'Décrivez votre notification',
    descriptionPlaceholder: 'Ex: Me notifier tous les jours à 9h sur les actualités tech...',
    email: 'Email',
    timezone: 'Fuseau Horaire',
    notificationClosed: 'Notification Fermée',
    notificationClosedMessage: 'La notification a été fermée avec succès.',
    closeError: 'Erreur',
    createSuccess: 'Notification Créée',
    createSuccessMessage: 'Votre notification a été créée avec succès.',
    createError: 'Erreur de Création',
    types: {
      recurring: 'Récurrente',
      scheduled: 'Programmée',
      conditional: 'Conditionnelle',
      unknown: 'Inconnu'
    },
    status: {
      active: 'Active',
      invalid: 'Invalide',
      expired: 'Expirée'
    },
    channelNames: {
      email: 'Email',
      whatsapp: 'WhatsApp',
      slack: 'Slack',
      discord: 'Discord'
    }
  },
  de: {
    title: 'Meine Benachrichtigungen',
    subtitle: 'Verwalten Sie Ihre aktiven Benachrichtigungen',
    statistics: 'Benachrichtigungsstatistiken',
    total: 'Gesamt',
    recurring: 'Wiederkehrend',
    scheduled: 'Geplant',
    conditional: 'Bedingt',
    searchPlaceholder: 'Benachrichtigungen suchen...',
    filterAll: 'Alle',
    filterActive: 'Nur Aktive',
    filterRecurring: 'Wiederkehrend',
    filterScheduled: 'Geplant',
    filterConditional: 'Bedingt',
    createNew: 'Neue Erstellen',
    noNotifications: 'Keine Benachrichtigungen gefunden',
    noNotificationsMessage: 'Versuchen Sie, die Suchfilter zu ändern.',
    noNotificationsEmpty: 'Erstellen Sie Ihre erste Benachrichtigung, um zu beginnen.',
    createFirst: 'Ihre Erste Benachrichtigung Erstellen',
    itemsPerPage: 'Elemente pro Seite',
    page: 'Seite',
    of: 'von',
    previous: 'Zurück',
    next: 'Weiter',
    showing: 'Anzeige',
    to: 'bis',
    totalItems: 'von',
    details: 'Details',
    close: 'Schließen',
    channels: 'Kanäle',
    selectChannels: 'Benachrichtigungskanäle auswählen',
    channelEmail: 'E-Mail',
    channelSlack: 'Slack',
    slackWebhook: 'Slack Webhook URL',
    slackWebhookPlaceholder: 'https://hooks.slack.com/services/...',
    createdOn: 'Erstellt',
    nextExecution: 'Nächste',
    lastExecution: 'Letzte',
    expiresOn: 'Läuft ab',
    confidence: 'Vertrauen',
    createNotification: 'Neue Benachrichtigung Erstellen',
    cancel: 'Abbrechen',
    create: 'Benachrichtigung Erstellen',
    creating: 'Erstellen...',
    describeNotification: 'Beschreiben Sie Ihre Benachrichtigung',
    descriptionPlaceholder: 'Z.B.: Benachrichtige mich jeden Tag um 9 Uhr über Tech-News...',
    email: 'E-Mail',
    timezone: 'Zeitzone',
    notificationClosed: 'Benachrichtigung Geschlossen',
    notificationClosedMessage: 'Die Benachrichtigung wurde erfolgreich geschlossen.',
    closeError: 'Fehler',
    createSuccess: 'Benachrichtigung Erstellt',
    createSuccessMessage: 'Ihre Benachrichtigung wurde erfolgreich erstellt.',
    createError: 'Erstellungsfehler',
    types: {
      recurring: 'Wiederkehrend',
      scheduled: 'Geplant',
      conditional: 'Bedingt',
      unknown: 'Unbekannt'
    },
    status: {
      active: 'Aktiv',
      invalid: 'Ungültig',
      expired: 'Abgelaufen'
    },
    channelNames: {
      email: 'E-Mail',
      whatsapp: 'WhatsApp',
      slack: 'Slack',
      discord: 'Discord'
    }
  },
  zh: {
    title: '我的通知',
    subtitle: '管理您的活动通知',
    statistics: '通知统计',
    total: '总计',
    recurring: '重复',
    scheduled: '计划',
    conditional: '条件',
    searchPlaceholder: '搜索通知...',
    filterAll: '全部',
    filterActive: '仅活动',
    filterRecurring: '重复',
    filterScheduled: '计划',
    filterConditional: '条件',
    createNew: '创建新的',
    noNotifications: '未找到通知',
    noNotificationsMessage: '尝试修改搜索过滤器。',
    noNotificationsEmpty: '创建您的第一个通知以开始。',
    createFirst: '创建您的第一个通知',
    itemsPerPage: '每页项目',
    page: '页面',
    of: '的',
    previous: '上一页',
    next: '下一页',
    showing: '显示',
    to: '到',
    totalItems: '的',
    details: '详情',
    close: '关闭',
    channels: '渠道',
    selectChannels: '选择通知渠道',
    channelEmail: '电子邮件',
    channelSlack: 'Slack',
    slackWebhook: 'Slack Webhook URL',
    slackWebhookPlaceholder: 'https://hooks.slack.com/services/...',
    createdOn: '创建于',
    nextExecution: '下次',
    lastExecution: '上次',
    expiresOn: '到期',
    confidence: '置信度',
    createNotification: '创建新通知',
    cancel: '取消',
    create: '创建通知',
    creating: '创建中...',
    describeNotification: '描述您的通知',
    descriptionPlaceholder: '例如：每天上午9点通知我科技新闻...',
    email: '电子邮件',
    timezone: '时区',
    notificationClosed: '通知已关闭',
    notificationClosedMessage: '通知已成功关闭。',
    closeError: '错误',
    createSuccess: '通知已创建',
    createSuccessMessage: '您的通知已成功创建。',
    createError: '创建错误',
    types: {
      recurring: '重复',
      scheduled: '计划',
      conditional: '条件',
      unknown: '未知'
    },
    status: {
      active: '活动',
      invalid: '无效',
      expired: '已过期'
    },
    channelNames: {
      email: '电子邮件',
      whatsapp: 'WhatsApp',
      slack: 'Slack',
      discord: 'Discord'
    }
  }
};

export const NotificationsSection: React.FC<NotificationsSectionProps> = ({
  queries,
  queryStats,
  onQueriesUpdate,
  language
}) => {
  const { user } = useUser();
  const api = useNotifyMeAPI();
  const { success, error } = useToast();
  
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<NotificationQuery | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  const [createForm, setCreateForm] = useState({
    prompt: '',
    email: user?.emailAddresses?.[0]?.emailAddress || '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Rome',
    channels: ['email', 'slack'] as string[],
    channelConfigs: {} as Record<string, string>
  });

  const t = notificationsTranslations[language];

  // Filter queries based on current filter and search - only show active (non-closed) notifications
  const filteredQueries = queries.filter(query => {
    // Only show non-closed notifications in this section
    if (query.closed) return false;
    
    const matchesFilter = (() => {
      switch (filter) {
        case 'all': return true;
        case 'active': return query.isValid;
        case 'cron': return query.cron && !query.dateSpecific && !query.toCheck;
        case 'specific': return !query.cron && query.dateSpecific && !query.toCheck;
        case 'check': return query.toCheck;
        default: return true;
      }
    })();
    
    const matchesSearch = query.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (query.summaryText && query.summaryText.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  // Pagination calculations
  const totalItems = filteredQueries.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = Math.max(0, (currentPage - 1) * itemsPerPage);
  const endIndex = startIndex + itemsPerPage;
  const paginatedQueries = filteredQueries.slice(startIndex, endIndex);
  
  // Debug logging
  console.log('Pagination Debug:', {
    totalQueries: filteredQueries.length,
    currentPage,
    itemsPerPage,
    startIndex,
    endIndex,
    paginatedQueriesCount: paginatedQueries.length,
    firstQueryId: paginatedQueries[0]?.id,
    allQueryIds: filteredQueries.map(q => q.id).slice(0, 10)
  });

  // Reset to first page when filters change
  React.useEffect(() => {
    if (currentPage > 1) {
      setCurrentPage(1);
    }
  }, [filter, searchTerm]);

  // Reset to first page if current page is beyond available pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  // Get notification status with proper styling
  const getNotificationStatus = (query: NotificationQuery) => {
    if (!query.isValid) {
      return { 
        status: 'invalid', 
        label: t.status.invalid, 
        color: 'text-red-400 bg-red-500/20 border-red-500/30',
        icon: <XCircle className="w-4 h-4" />
      };
    }
    
    // Get current time in UTC for proper comparison
    const nowUTC = new Date();
    
    // Check if notification is expired based on validTo (UTC)
    if (query.validTo) {
      // IMPORTANTE: validTo è in UTC ma senza 'Z', devo forzare UTC
      const validToUTC = new Date(query.validTo + 'Z');
      if (validToUTC < nowUTC) {
        return { 
          status: 'expired', 
          label: t.status.expired, 
          color: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
          icon: <Clock className="w-4 h-4" />
        };
      }
    }
    
    // Check if specific date notification has passed (UTC comparison)
    if (query.nextExecution && query.dateSpecific) {
      // IMPORTANTE: nextExecution è in UTC ma senza 'Z', devo forzare UTC
      const nextExecUTC = new Date(query.nextExecution + 'Z');
      if (nextExecUTC < nowUTC) {
        return { 
          status: 'expired', 
          label: t.status.expired, 
          color: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
          icon: <Clock className="w-4 h-4" />
        };
      }
    }
    
    return { 
      status: 'active', 
      label: t.status.active, 
      color: 'text-green-400 bg-green-500/20 border-green-500/30',
      icon: <CheckCircle className="w-4 h-4" />
    };
  };

  // Format date for display with timezone info
  const formatDateWithTimezone = (dateString: string, timezone?: string) => {
    const locale = language === 'en' ? 'en-US' : language === 'it' ? 'it-IT' : language === 'es' ? 'es-ES' : language === 'fr' ? 'fr-FR' : language === 'de' ? 'de-DE' : 'zh-CN';
    
    // Parse UTC date string and convert to local timezone
    const date = new Date(dateString + (dateString.endsWith('Z') ? '' : 'Z'));
    
    // Always display in user's local timezone (client timezone)
    return date.toLocaleString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  // Format date considering user's timezone for display
  const formatDate = (dateString: string) => {
    const locale = language === 'en' ? 'en-US' : language === 'it' ? 'it-IT' : language === 'es' ? 'es-ES' : language === 'fr' ? 'fr-FR' : language === 'de' ? 'de-DE' : 'zh-CN';
    
    // IMPORTANTE: Le date dall'API sono in UTC ma senza 'Z'
    // Devo forzare l'interpretazione come UTC
    const date = new Date(dateString + 'Z');
    
    return date.toLocaleString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  // Get notification type with proper styling
  const getNotificationType = (query: NotificationQuery) => {
    if (query.cron && !query.dateSpecific && !query.toCheck) {
      return { 
        type: 'recurring', 
        label: t.types.recurring, 
        color: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
        icon: <Repeat className="w-4 h-4" />
      };
    }
    
    if (!query.cron && query.dateSpecific && !query.toCheck) {
      return { 
        type: 'scheduled', 
        label: t.types.scheduled, 
        color: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30',
        icon: <Calendar className="w-4 h-4" />
      };
    }
    
    if (query.toCheck) {
      return { 
        type: 'conditional', 
        label: t.types.conditional, 
        color: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
        icon: <AlertCircle className="w-4 h-4" />
      };
    }
    
    return { 
      type: 'unknown', 
      label: t.types.unknown, 
      color: 'text-gray-400 bg-gray-500/20 border-gray-500/30',
      icon: <Bell className="w-4 h-4" />
    };
  };

  const handleCloseQuery = async (queryId: number) => {
    setLoading(true);
    try {
      await api.closeQuery(queryId);
      
      // Update queries to mark as closed - this will automatically move it to archived section
      const updatedQueries = queries.map(q => 
        q.id === queryId ? { ...q, closed: true } : q
      );
      onQueriesUpdate(updatedQueries);
      
      success(t.notificationClosed, t.notificationClosedMessage);
    } catch (err) {
      error(t.closeError, err instanceof Error ? err.message : 'Impossibile chiudere la notifica');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare channel configs
      const channelConfigs: Record<string, string> = {};
      createForm.channels.forEach(channel => {
        if (channel === 'email') {
          channelConfigs.email = createForm.email;
        } else if (channel === 'slack') {
          channelConfigs.slack = createForm.channelConfigs.slack || '';
        } else if (channel === 'discord') {
          channelConfigs.discord = createForm.channelConfigs.discord || '';
        } else if (channel === 'whatsapp') {
          channelConfigs.whatsapp = createForm.channelConfigs.whatsapp || '';
        }
      });

      const requestData: CreateNotificationRequest = {
        prompt: createForm.prompt,
        email: createForm.email,
        channels: createForm.channels,
        channelConfigs,
        timezone: createForm.timezone
      };

      console.log('Creating notification with data:', JSON.stringify(requestData, null, 2));
      
      await api.createNotification(requestData);
      
      // Refresh queries list
      const updatedQueries = await api.getAllQueries();
      onQueriesUpdate(updatedQueries);
      
      setShowCreateForm(false);
      setCreateForm({
        prompt: '',
        email: user?.emailAddresses?.[0]?.emailAddress || '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Rome',
        channels: ['email', 'slack'],
        channelConfigs: {}
      });
      
      success(t.createSuccess, t.createSuccessMessage);
    } catch (err) {
      error(t.createError, err instanceof Error ? err.message : 'Impossibile creare la notifica');
    } finally {
      setLoading(false);
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="w-4 h-4 text-red-400" />;
      case 'whatsapp': return <Phone className="w-4 h-4 text-green-400" />;
      case 'slack': return <MessageSquare className="w-4 h-4 text-purple-400" />;
      case 'discord': return <Hash className="w-4 h-4 text-indigo-400" />;
      default: return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  const parseEnabledChannels = (enabledChannels?: string): string[] => {
    if (!enabledChannels) return ['email'];
    try {
      return JSON.parse(enabledChannels);
    } catch {
      return ['email'];
    }
  };

  // Check if execution date is in the past
  const isExecutionInPast = (executionDate: string): boolean => {
    const execDate = new Date(executionDate + (executionDate.endsWith('Z') ? '' : 'Z'));
    return execDate < new Date();
  };

  return (
    <div className="space-y-8">
      {/* Statistics */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-green-400" />
          </div>
          <span>{t.statistics}</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-blue-400 mb-1">{queryStats.totalQueries}</div>
            <div className="text-sm text-gray-400">{t.total}</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-purple-400 mb-1">{queryStats.cronQueries}</div>
            <div className="text-sm text-gray-400">{t.recurring}</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-cyan-400 mb-1">{queryStats.specificQueries}</div>
            <div className="text-sm text-gray-400">{t.scheduled}</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-yellow-400 mb-1">{queryStats.checkQueries}</div>
            <div className="text-sm text-gray-400">{t.conditional}</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-fuchsia-500/20 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-fuchsia-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{t.title}</h3>
                <p className="text-sm text-gray-400">{t.subtitle}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20"
              />
            </div>

            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="px-4 py-2 bg-gray-800 border border-white/20 rounded-lg text-white focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20"
            >
              <option value="all">{t.filterAll}</option>
              <option value="active">{t.filterActive}</option>
              <option value="cron">{t.filterRecurring}</option>
              <option value="specific">{t.filterScheduled}</option>
              <option value="check">{t.filterConditional}</option>
            </select>

            {/* Create Button */}
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-lg font-semibold text-white hover:from-fuchsia-600 hover:to-cyan-600 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              <span>{t.createNew}</span>
            </button>
          </div>
        </div>

        {/* Pagination Controls Top */}
        {totalItems > 0 && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 pt-4 border-t border-white/10">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">{t.itemsPerPage}:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="px-3 py-1 bg-gray-800 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-fuchsia-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div className="text-sm text-gray-400">
                {t.showing} {startIndex + 1} {t.to} {Math.min(endIndex, totalItems)} {t.totalItems} {totalItems}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-800 border border-white/20 rounded text-white text-sm hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t.previous}</span>
              </button>
              
              <span className="text-sm text-gray-400">
                {t.page} {currentPage} {t.of} {totalPages}
              </span>
              
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-800 border border-white/20 rounded text-white text-sm hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <span>{t.next}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {totalItems === 0 ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-12 text-center">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">{t.noNotifications}</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filter !== 'all' 
                ? t.noNotificationsMessage
                : t.noNotificationsEmpty
              }
            </p>
            {!searchTerm && filter === 'all' && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-xl font-semibold text-white hover:from-fuchsia-600 hover:to-cyan-600 transition-all duration-300"
              >
                {t.createFirst}
              </button>
            )}
          </div>
        ) : (
          paginatedQueries.map((query) => {
            const status = getNotificationStatus(query);
            const type = getNotificationType(query);
            const channels = parseEnabledChannels(query.enabledChannels);
            
            return (
              <div key={query.id} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="flex-1">
                        <p className="text-white font-medium leading-relaxed">{query.prompt}</p>
                        {query.summaryText && (
                          <p className="text-gray-400 text-sm mt-2">{query.summaryText}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Status Badge */}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                        <span className="flex items-center space-x-1">
                          {status.icon}
                          <span>{status.label}</span>
                        </span>
                      </span>
                      
                      {/* Type Badge */}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${type.color}`}>
                        <span className="flex items-center space-x-1">
                          {type.icon}
                          <span>{type.label}</span>
                        </span>
                      </span>
                      
                      {/* Channels */}
                      <div className="flex items-center space-x-1">
                        {channels.map((channel, index) => (
                          <div key={index} className="flex items-center space-x-1 px-2 py-1 bg-white/10 rounded-md">
                            {getChannelIcon(channel)}
                            <span className="text-xs text-gray-300 capitalize">{t.channelNames[channel as keyof typeof t.channelNames]}</span>
                          </div>
                        ))}
                      </div>

                      {/* Confidence Score */}
                      {query.confidenceScore && (
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-md">
                          {Math.round(query.confidenceScore * 100)}% {t.confidence}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{t.createdOn}: {formatDateWithTimezone(query.createdAt, query.timezone)}</span>
                      </div>
                      {query.nextExecution && (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {isExecutionInPast(query.nextExecution) ? t.lastExecution : t.nextExecution}: {formatDateWithTimezone(query.nextExecution, query.timezone)}
                          </span>
                        </div>
                      )}
                      {query.validTo && (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-orange-400" />
                          <span className="text-orange-400">{t.expiresOn}: {formatDateWithTimezone(query.validTo, query.timezone)}</span>
                        </div>
                      )}
                      {query.cronParams && (
                        <div className="flex items-center space-x-1">
                          <Zap className="w-4 h-4" />
                          <span className="font-mono text-xs">{query.cronParams}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedQuery(query)}
                      className="flex items-center space-x-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-all duration-300 text-blue-400"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">{t.details}</span>
                    </button>
                    
                    {query.isValid && (
                      <button
                        onClick={() => handleCloseQuery(query.id)}
                        disabled={loading}
                        className="flex items-center space-x-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all duration-300 text-red-400 disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        <span className="text-sm">{t.close}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls Bottom */}
      {totalItems > 0 && (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
            <div className="text-sm text-gray-400">
              {t.showing} {startIndex + 1} {t.to} {Math.min(endIndex, totalItems)} {t.totalItems} {totalItems}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center space-x-1 px-3 py-2 bg-gray-800 border border-white/20 rounded-lg text-white text-sm hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t.previous}</span>
              </button>
              
              <span className="text-sm text-gray-300 px-3 py-2">
                {t.page} {currentPage} {t.of} {totalPages}
              </span>
              
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center space-x-1 px-3 py-2 bg-gray-800 border border-white/20 rounded-lg text-white text-sm hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <span>{t.next}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Notification Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateForm(false)} />
          
          <div className="relative bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">{t.createNotification}</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNotification} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t.describeNotification}</label>
                <textarea
                  value={createForm.prompt}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, prompt: e.target.value }))}
                  placeholder={t.descriptionPlaceholder}
                  className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 resize-none focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t.email}</label>
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your-email@example.com"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t.timezone}</label>
                <input
                  type="text"
                  value={createForm.timezone}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, timezone: e.target.value }))}
                  placeholder="Europe/Rome"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20"
                  required
                />
              </div>

              {/* Channel Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t.selectChannels}</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const newChannels = createForm.channels.includes('email') 
                        ? createForm.channels.filter(c => c !== 'email')
                        : [...createForm.channels, 'email'];
                      setCreateForm(prev => ({ ...prev, channels: newChannels }));
                    }}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      createForm.channels.includes('email')
                        ? 'border-red-500 bg-red-500/20 shadow-lg'
                        : 'border-white/20 bg-white/5 hover:border-red-500/50'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Mail className={`w-6 h-6 ${createForm.channels.includes('email') ? 'text-red-400' : 'text-gray-400'}`} />
                      <span className={`text-sm font-medium ${createForm.channels.includes('email') ? 'text-red-400' : 'text-gray-400'}`}>
                        {t.channelEmail}
                      </span>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      const newChannels = createForm.channels.includes('slack') 
                        ? createForm.channels.filter(c => c !== 'slack')
                        : [...createForm.channels, 'slack'];
                      setCreateForm(prev => ({ ...prev, channels: newChannels }));
                    }}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      createForm.channels.includes('slack')
                        ? 'border-purple-500 bg-purple-500/20 shadow-lg'
                        : 'border-white/20 bg-white/5 hover:border-purple-500/50'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <MessageSquare className={`w-6 h-6 ${createForm.channels.includes('slack') ? 'text-purple-400' : 'text-gray-400'}`} />
                      <span className={`text-sm font-medium ${createForm.channels.includes('slack') ? 'text-purple-400' : 'text-gray-400'}`}>
                        {t.channelSlack}
                      </span>
                    </div>
                  </button>
                </div>
                
                {/* Selected Channels Summary */}
                {createForm.channels.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {createForm.channels.map((channel) => (
                      <div
                        key={channel}
                        className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs border ${
                          channel === 'email' 
                            ? 'border-red-500/50 bg-red-500/20 text-red-300'
                            : 'border-purple-500/50 bg-purple-500/20 text-purple-300'
                        }`}
                      >
                        {channel === 'email' ? <Mail className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
                        <span className="capitalize">{channel}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Channel Configuration */}
              {createForm.channels.includes('slack') && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 text-purple-400" />
                      <span>{t.slackWebhook}</span>
                    </div>
                  </label>
                  <input
                    type="url"
                    value={createForm.channelConfigs.slack || ''}
                    onChange={(e) => setCreateForm(prev => ({ 
                      ...prev, 
                      channelConfigs: { ...prev.channelConfigs, slack: e.target.value }
                    }))}
                    placeholder={t.slackWebhookPlaceholder}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    required={createForm.channels.includes('slack')}
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 bg-gray-500/20 hover:bg-gray-500/30 rounded-xl font-semibold text-gray-300 transition-all duration-300"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-xl font-semibold text-white hover:from-fuchsia-600 hover:to-cyan-600 transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? t.creating : t.create}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Query Details Modal */}
      {selectedQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedQuery(null)} />
          
          <div className="relative bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">{t.details}</h3>
              <button
                onClick={() => setSelectedQuery(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Prompt</label>
                <p className="text-white bg-white/5 p-4 rounded-xl">{selectedQuery.prompt}</p>
              </div>

              {selectedQuery.summaryText && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Riassunto</label>
                  <p className="text-white bg-white/5 p-4 rounded-xl">{selectedQuery.summaryText}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Tipo</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getNotificationType(selectedQuery).color}`}>
                    <span className="flex items-center space-x-1">
                      {getNotificationType(selectedQuery).icon}
                      <span>{getNotificationType(selectedQuery).label}</span>
                    </span>
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Stato</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getNotificationStatus(selectedQuery).color}`}>
                    <span className="flex items-center space-x-1">
                      {getNotificationStatus(selectedQuery).icon}
                      <span>{getNotificationStatus(selectedQuery).label}</span>
                    </span>
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Canali</label>
                <div className="flex flex-wrap gap-2">
                  {parseEnabledChannels(selectedQuery.enabledChannels).map((channel, index) => (
                    <div key={index} className="flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-lg">
                      {getChannelIcon(channel)}
                      <span className="text-sm capitalize">{t.channelNames[channel as keyof typeof t.channelNames]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">{t.createdOn}</label>
                  <p className="text-white">{formatDateWithTimezone(selectedQuery.createdAt, selectedQuery.timezone)}</p>
                </div>
                {selectedQuery.nextExecution && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      {isExecutionInPast(selectedQuery.nextExecution) ? t.lastExecution : t.nextExecution}
                    </label>
                    <p className="text-white">{formatDateWithTimezone(selectedQuery.nextExecution, selectedQuery.timezone)}</p>
                  </div>
                )}
              </div>
              
              {selectedQuery.validTo && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Data Scadenza</label>
                  <p className="text-white">{formatDateWithTimezone(selectedQuery.validTo, selectedQuery.timezone)}</p>
                </div>
              )}

              {selectedQuery.cronParams && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Espressione Cron</label>
                  <p className="text-white font-mono bg-white/5 p-3 rounded-lg">{selectedQuery.cronParams}</p>
                </div>
              )}

              {selectedQuery.confidenceScore && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Punteggio di Fiducia</label>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 h-2 rounded-full"
                        style={{ width: `${selectedQuery.confidenceScore * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-white font-medium">{Math.round(selectedQuery.confidenceScore * 100)}%</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">ID Notifica</label>
                <p className="text-white font-mono text-sm bg-white/5 p-3 rounded-lg">{selectedQuery.id}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};