import React, { useState } from 'react';
import { 
  Archive, 
  Search, 
  Eye, 
  X,
  Mail,
  MessageSquare,
  Hash,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Repeat,
  AlertCircle,
  Zap,
  RotateCcw
} from 'lucide-react';
import { NotificationQuery } from '../../types/api';
import { useNotifyMeAPI } from '../../hooks/useNotifyMeAPI';
import { useToast } from '../../hooks/useToast';
import { Language } from '../LanguageSelector';

interface ArchivedSectionProps {
  queries: NotificationQuery[];
  onQueriesUpdate: (queries: NotificationQuery[]) => void;
  language: Language;
}

const archivedTranslations = {
  en: {
    title: 'Archived Notifications',
    subtitle: 'View and manage your archived notifications',
    searchPlaceholder: 'Search archived notifications...',
    noArchived: 'No archived notifications',
    noArchivedMessage: 'Notifications you close will appear here.',
    restore: 'Restore',
    details: 'Details',
    archivedOn: 'Archived on',
    createdOn: 'Created on',
    nextExecution: 'Next execution',
    lastExecution: 'Last execution',
    restoreSuccess: 'Notification Restored',
    restoreSuccessMessage: 'The notification has been restored successfully.',
    restoreError: 'Restore Failed',
    channels: {
      email: 'Email',
      whatsapp: 'WhatsApp',
      slack: 'Slack',
      discord: 'Discord'
    },
    types: {
      recurring: 'Recurring',
      scheduled: 'Scheduled',
      conditional: 'Conditional',
      unknown: 'Unknown'
    },
    status: {
      archived: 'Archived',
      invalid: 'Invalid',
      expired: 'Expired'
    }
  },
  it: {
    title: 'Notifiche Archiviate',
    subtitle: 'Visualizza e gestisci le tue notifiche archiviate',
    searchPlaceholder: 'Cerca notifiche archiviate...',
    noArchived: 'Nessuna notifica archiviata',
    noArchivedMessage: 'Le notifiche che chiudi appariranno qui.',
    restore: 'Ripristina',
    details: 'Dettagli',
    archivedOn: 'Archiviata il',
    createdOn: 'Creata il',
    nextExecution: 'Prossima esecuzione',
    lastExecution: 'Ultima esecuzione',
    restoreSuccess: 'Notifica Ripristinata',
    restoreSuccessMessage: 'La notifica è stata ripristinata con successo.',
    restoreError: 'Ripristino Fallito',
    channels: {
      email: 'Email',
      whatsapp: 'WhatsApp',
      slack: 'Slack',
      discord: 'Discord'
    },
    types: {
      recurring: 'Ricorrente',
      scheduled: 'Programmata',
      conditional: 'Condizionale',
      unknown: 'Sconosciuto'
    },
    status: {
      archived: 'Archiviata',
      invalid: 'Non Valida',
      expired: 'Scaduta'
    }
  },
  es: {
    title: 'Notificaciones Archivadas',
    subtitle: 'Ver y gestionar tus notificaciones archivadas',
    searchPlaceholder: 'Buscar notificaciones archivadas...',
    noArchived: 'No hay notificaciones archivadas',
    noArchivedMessage: 'Las notificaciones que cierres aparecerán aquí.',
    restore: 'Restaurar',
    details: 'Detalles',
    archivedOn: 'Archivada el',
    createdOn: 'Creada el',
    nextExecution: 'Próxima ejecución',
    lastExecution: 'Última ejecución',
    restoreSuccess: 'Notificación Restaurada',
    restoreSuccessMessage: 'La notificación ha sido restaurada exitosamente.',
    restoreError: 'Restauración Fallida',
    channels: {
      email: 'Email',
      whatsapp: 'WhatsApp',
      slack: 'Slack',
      discord: 'Discord'
    },
    types: {
      recurring: 'Recurrente',
      scheduled: 'Programada',
      conditional: 'Condicional',
      unknown: 'Desconocido'
    },
    status: {
      archived: 'Archivada',
      invalid: 'Inválida',
      expired: 'Expirada'
    }
  },
  fr: {
    title: 'Notifications Archivées',
    subtitle: 'Voir et gérer vos notifications archivées',
    searchPlaceholder: 'Rechercher des notifications archivées...',
    noArchived: 'Aucune notification archivée',
    noArchivedMessage: 'Les notifications que vous fermez apparaîtront ici.',
    restore: 'Restaurer',
    details: 'Détails',
    archivedOn: 'Archivée le',
    createdOn: 'Créée le',
    nextExecution: 'Prochaine exécution',
    lastExecution: 'Dernière exécution',
    restoreSuccess: 'Notification Restaurée',
    restoreSuccessMessage: 'La notification a été restaurée avec succès.',
    restoreError: 'Restauration Échouée',
    channels: {
      email: 'Email',
      whatsapp: 'WhatsApp',
      slack: 'Slack',
      discord: 'Discord'
    },
    types: {
      recurring: 'Récurrente',
      scheduled: 'Programmée',
      conditional: 'Conditionnelle',
      unknown: 'Inconnu'
    },
    status: {
      archived: 'Archivée',
      invalid: 'Invalide',
      expired: 'Expirée'
    }
  },
  de: {
    title: 'Archivierte Benachrichtigungen',
    subtitle: 'Ihre archivierten Benachrichtigungen anzeigen und verwalten',
    searchPlaceholder: 'Archivierte Benachrichtigungen suchen...',
    noArchived: 'Keine archivierten Benachrichtigungen',
    noArchivedMessage: 'Benachrichtigungen, die Sie schließen, erscheinen hier.',
    restore: 'Wiederherstellen',
    details: 'Details',
    archivedOn: 'Archiviert am',
    createdOn: 'Erstellt am',
    nextExecution: 'Nächste Ausführung',
    lastExecution: 'Letzte Ausführung',
    restoreSuccess: 'Benachrichtigung Wiederhergestellt',
    restoreSuccessMessage: 'Die Benachrichtigung wurde erfolgreich wiederhergestellt.',
    restoreError: 'Wiederherstellung Fehlgeschlagen',
    channels: {
      email: 'E-Mail',
      whatsapp: 'WhatsApp',
      slack: 'Slack',
      discord: 'Discord'
    },
    types: {
      recurring: 'Wiederkehrend',
      scheduled: 'Geplant',
      conditional: 'Bedingt',
      unknown: 'Unbekannt'
    },
    status: {
      archived: 'Archiviert',
      invalid: 'Ungültig',
      expired: 'Abgelaufen'
    }
  },
  zh: {
    title: '已归档通知',
    subtitle: '查看和管理您的已归档通知',
    searchPlaceholder: '搜索已归档通知...',
    noArchived: '没有已归档通知',
    noArchivedMessage: '您关闭的通知将出现在这里。',
    restore: '恢复',
    details: '详情',
    archivedOn: '归档于',
    createdOn: '创建于',
    nextExecution: '下次执行',
    lastExecution: '上次执行',
    restoreSuccess: '通知已恢复',
    restoreSuccessMessage: '通知已成功恢复。',
    restoreError: '恢复失败',
    channels: {
      email: '电子邮件',
      whatsapp: 'WhatsApp',
      slack: 'Slack',
      discord: 'Discord'
    },
    types: {
      recurring: '重复',
      scheduled: '计划',
      conditional: '条件',
      unknown: '未知'
    },
    status: {
      archived: '已归档',
      invalid: '无效',
      expired: '已过期'
    }
  }
};

export const ArchivedSection: React.FC<ArchivedSectionProps> = ({
  queries,
  onQueriesUpdate,
  language
}) => {
  const api = useNotifyMeAPI();
  const { success, error } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuery, setSelectedQuery] = useState<NotificationQuery | null>(null);
  const [loading, setLoading] = useState(false);

  const t = archivedTranslations[language];

  // Filter queries based on search
  const filteredQueries = queries.filter(query => {
    const matchesSearch = query.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (query.summaryText && query.summaryText.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

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
      icon: <Archive className="w-4 h-4" />
    };
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

  // Format date for display with timezone info
  const formatDateWithTimezone = (dateString: string, timezone?: string) => {
    const locale = language === 'en' ? 'en-US' : language === 'it' ? 'it-IT' : language === 'es' ? 'es-ES' : language === 'fr' ? 'fr-FR' : language === 'de' ? 'de-DE' : 'zh-CN';
    
    // IMPORTANTE: Le date dall'API sono in UTC ma senza 'Z'
    // Devo forzare l'interpretazione come UTC
    const date = new Date(dateString + 'Z');
    
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

  const handleRestoreQuery = async (queryId: number) => {
    setLoading(true);
    try {
      // Note: This would need a restore endpoint in the API
      // For now, we'll simulate the restore by updating the local state
      const updatedQueries = queries.map(q => 
        q.id === queryId ? { ...q, closed: false } : q
      );
      
      // Get all queries including active ones and update
      const allQueries = await api.getAllQueries();
      const restoredQueries = allQueries.map(q => 
        q.id === queryId ? { ...q, closed: false } : q
      );
      
      onQueriesUpdate(restoredQueries);
      
      success(t.restoreSuccess, t.restoreSuccessMessage);
    } catch (err) {
      error(t.restoreError, err instanceof Error ? err.message : 'Impossibile ripristinare la notifica');
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
      default: return <Archive className="w-4 h-4 text-gray-400" />;
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
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-500/20 rounded-xl flex items-center justify-center">
                <Archive className="w-5 h-5 text-gray-400" />
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
                className="pl-10 pr-4 py-2 bg-gray-800 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Archived Notifications List */}
      <div className="space-y-4">
        {filteredQueries.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-12 text-center">
            <Archive className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">{t.noArchived}</h3>
            <p className="text-gray-500">
              {searchTerm 
                ? 'Nessuna notifica archiviata corrisponde alla ricerca.'
                : t.noArchivedMessage
              }
            </p>
          </div>
        ) : (
          filteredQueries.map((query) => {
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
                      <span className="px-3 py-1 rounded-full text-xs font-medium border bg-gray-500/20 border-gray-500/30 text-gray-400">
                        <span className="flex items-center space-x-1">
                          <Archive className="w-4 h-4" />
                          <span>{t.status.archived}</span>
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
                            <span className="text-xs text-gray-300 capitalize">{t.channels[channel as keyof typeof t.channels]}</span>
                          </div>
                        ))}
                      </div>

                      {/* Confidence Score */}
                      {query.confidenceScore && (
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-md">
                          {Math.round(query.confidenceScore * 100)}% fiducia
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
                          <span className="text-orange-400">Scadeva: {formatDateWithTimezone(query.validTo, query.timezone)}</span>
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
                    
                    <button
                      onClick={() => handleRestoreQuery(query.id)}
                      disabled={loading}
                      className="flex items-center space-x-1 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-all duration-300 text-green-400 disabled:opacity-50"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span className="text-sm">{t.restore}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

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
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium border bg-gray-500/20 border-gray-500/30 text-gray-400">
                    <span className="flex items-center space-x-1">
                      <Archive className="w-4 h-4" />
                      <span>{t.status.archived}</span>
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
                      <span className="text-sm capitalize">{t.channels[channel as keyof typeof t.channels]}</span>
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