import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
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
  Zap
} from 'lucide-react';
import { NotificationQuery, QueryStatistics, CreateNotificationRequest } from '../../types/api';
import { useNotifyMeAPI } from '../../hooks/useNotifyMeAPI';
import { useToast } from '../../hooks/useToast';

interface NotificationsSectionProps {
  queries: NotificationQuery[];
  queryStats: QueryStatistics;
  onQueriesUpdate: (queries: NotificationQuery[]) => void;
}

type FilterType = 'all' | 'active' | 'cron' | 'specific' | 'check' | 'closed';

export const NotificationsSection: React.FC<NotificationsSectionProps> = ({
  queries,
  queryStats,
  onQueriesUpdate
}) => {
  const { user } = useAuth0();
  const api = useNotifyMeAPI();
  const { success, error } = useToast();
  
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<NotificationQuery | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [createForm, setCreateForm] = useState({
    prompt: '',
    email: user?.email || '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Rome',
    channels: ['email'] as string[],
    channelConfigs: {} as Record<string, string>
  });

  // Filter queries based on current filter and search
  const filteredQueries = queries.filter(query => {
    const matchesFilter = (() => {
      switch (filter) {
        case 'all': return true;
        case 'active': return query.isValid && !query.closed;
        case 'cron': return query.cron && !query.dateSpecific && !query.toCheck;
        case 'specific': return !query.cron && query.dateSpecific && !query.toCheck;
        case 'check': return query.toCheck;
        case 'closed': return query.closed;
        default: return true;
      }
    })();
    
    const matchesSearch = query.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (query.summaryText && query.summaryText.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  // Get notification status with proper styling
  const getNotificationStatus = (query: NotificationQuery) => {
    if (!query.isValid) {
      return { 
        status: 'invalid', 
        label: 'Non Valida', 
        color: 'text-red-400 bg-red-500/20 border-red-500/30',
        icon: <XCircle className="w-4 h-4" />
      };
    }
    
    if (query.closed) {
      return { 
        status: 'closed', 
        label: 'Chiusa', 
        color: 'text-gray-400 bg-gray-500/20 border-gray-500/30',
        icon: <XCircle className="w-4 h-4" />
      };
    }
    
    const now = new Date();
    const nextExec = query.nextExecution ? new Date(query.nextExecution) : null;
    
    if (nextExec && nextExec < now && query.dateSpecific) {
      return { 
        status: 'expired', 
        label: 'Scaduta', 
        color: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
        icon: <Clock className="w-4 h-4" />
      };
    }
    
    return { 
      status: 'active', 
      label: 'Attiva', 
      color: 'text-green-400 bg-green-500/20 border-green-500/30',
      icon: <CheckCircle className="w-4 h-4" />
    };
  };

  // Get notification type with proper styling
  const getNotificationType = (query: NotificationQuery) => {
    if (query.cron && !query.dateSpecific && !query.toCheck) {
      return { 
        type: 'recurring', 
        label: 'Ricorrente', 
        color: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
        icon: <Repeat className="w-4 h-4" />
      };
    }
    
    if (!query.cron && query.dateSpecific && !query.toCheck) {
      return { 
        type: 'scheduled', 
        label: 'Programmata', 
        color: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30',
        icon: <Calendar className="w-4 h-4" />
      };
    }
    
    if (query.toCheck) {
      return { 
        type: 'conditional', 
        label: 'Condizionale', 
        color: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
        icon: <AlertCircle className="w-4 h-4" />
      };
    }
    
    return { 
      type: 'unknown', 
      label: 'Sconosciuto', 
      color: 'text-gray-400 bg-gray-500/20 border-gray-500/30',
      icon: <Bell className="w-4 h-4" />
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('it-IT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCloseQuery = async (queryId: number) => {
    setLoading(true);
    try {
      await api.closeQuery(queryId);
      
      const updatedQueries = queries.map(q => 
        q.id === queryId ? { ...q, closed: true } : q
      );
      onQueriesUpdate(updatedQueries);
      
      success('Notifica Chiusa', 'La notifica è stata chiusa con successo.');
    } catch (err) {
      error('Errore', err instanceof Error ? err.message : 'Impossibile chiudere la notifica');
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
        }
        // Add other channel configs as needed
      });

      const requestData: CreateNotificationRequest = {
        prompt: createForm.prompt,
        email: createForm.email,
        timezone: createForm.timezone,
        channels: createForm.channels,
        channelConfigs
      };

      await api.createNotification(requestData);
      
      // Refresh queries list
      const updatedQueries = await api.getAllQueries();
      onQueriesUpdate(updatedQueries);
      
      setShowCreateForm(false);
      setCreateForm({
        prompt: '',
        email: user?.email || '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Rome',
        channels: ['email'],
        channelConfigs: {}
      });
      
      success('Notifica Creata', 'La tua notifica è stata creata con successo.');
    } catch (err) {
      error('Errore Creazione', err instanceof Error ? err.message : 'Impossibile creare la notifica');
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

  return (
    <div className="space-y-8">
      {/* Statistics */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-green-400" />
          </div>
          <span>Statistiche Notifiche</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-blue-400 mb-1">{queryStats.totalQueries}</div>
            <div className="text-sm text-gray-400">Totali</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-purple-400 mb-1">{queryStats.cronQueries}</div>
            <div className="text-sm text-gray-400">Ricorrenti</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-cyan-400 mb-1">{queryStats.specificQueries}</div>
            <div className="text-sm text-gray-400">Programmate</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-yellow-400 mb-1">{queryStats.checkQueries}</div>
            <div className="text-sm text-gray-400">Condizionali</div>
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
              <h3 className="text-xl font-semibold">Le Mie Notifiche</h3>
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
                placeholder="Cerca notifiche..."
                className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20"
              />
            </div>

            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20"
            >
              <option value="all">Tutte</option>
              <option value="active">Solo Attive</option>
              <option value="cron">Ricorrenti</option>
              <option value="specific">Programmate</option>
              <option value="check">Condizionali</option>
              <option value="closed">Chiuse</option>
            </select>

            {/* Create Button */}
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-lg font-semibold text-white hover:from-fuchsia-600 hover:to-cyan-600 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              <span>Crea Nuova</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredQueries.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-12 text-center">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Nessuna notifica trovata</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filter !== 'all' 
                ? 'Prova a modificare i filtri di ricerca.'
                : 'Crea la tua prima notifica per iniziare.'
              }
            </p>
            {!searchTerm && filter === 'all' && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-xl font-semibold text-white hover:from-fuchsia-600 hover:to-cyan-600 transition-all duration-300"
              >
                Crea la Tua Prima Notifica
              </button>
            )}
          </div>
        ) : (
          filteredQueries.map((query) => {
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
                            <span className="text-xs text-gray-300 capitalize">{channel}</span>
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
                        <span>Creata: {formatDate(query.createdAt)}</span>
                      </div>
                      {query.nextExecution && (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Prossima: {formatDate(query.nextExecution)}</span>
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
                      <span className="text-sm">Dettagli</span>
                    </button>
                    
                    {!query.closed && query.isValid && (
                      <button
                        onClick={() => handleCloseQuery(query.id)}
                        disabled={loading}
                        className="flex items-center space-x-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all duration-300 text-red-400 disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        <span className="text-sm">Chiudi</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Notification Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateForm(false)} />
          
          <div className="relative bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Crea Nuova Notifica</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNotification} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descrivi la tua notifica
                </label>
                <textarea
                  value={createForm.prompt}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, prompt: e.target.value }))}
                  placeholder="Es: Notificami ogni giorno alle 9 sulle notizie di tecnologia..."
                  className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 resize-none focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fuso Orario
                </label>
                <input
                  type="text"
                  value={createForm.timezone}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, timezone: e.target.value }))}
                  placeholder="Europe/Rome"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 bg-gray-500/20 hover:bg-gray-500/30 rounded-xl font-semibold text-gray-300 transition-all duration-300"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-xl font-semibold text-white hover:from-fuchsia-600 hover:to-cyan-600 transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Creazione...' : 'Crea Notifica'}
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
              <h3 className="text-xl font-semibold">Dettagli Notifica</h3>
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
                      <span className="text-sm capitalize">{channel}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Creata</label>
                  <p className="text-white">{formatDate(selectedQuery.createdAt)}</p>
                </div>
                {selectedQuery.nextExecution && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Prossima Esecuzione</label>
                    <p className="text-white">{formatDate(selectedQuery.nextExecution)}</p>
                  </div>
                )}
              </div>

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