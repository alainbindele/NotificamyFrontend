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
  Phone
} from 'lucide-react';
import { NotificationQuery, QueryStatistics, CreateNotificationRequest } from '../../types/api';
import { DashboardApiService } from '../../services/dashboardApiService';
import { useToast } from '../../hooks/useToast';

interface NotificationsSectionProps {
  queries: NotificationQuery[];
  queryStats: QueryStatistics;
  onQueriesUpdate: (queries: NotificationQuery[]) => void;
}

type FilterType = 'all' | 'active' | 'cron' | 'specific' | 'check';

export const NotificationsSection: React.FC<NotificationsSectionProps> = ({
  queries,
  queryStats,
  onQueriesUpdate
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const { success, error } = useToast();
  
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<NotificationQuery | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [createForm, setCreateForm] = useState({
    prompt: '',
    email: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    channels: ['email'] as string[],
    channelConfigs: {} as Record<string, any>
  });

  const filteredQueries = queries.filter(query => {
    const matchesFilter = filter === 'all' || 
      (filter === 'active' && query.status === 'active') ||
      query.type === filter;
    
    const matchesSearch = query.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20';
      case 'inactive': return 'text-gray-400 bg-gray-500/20';
      case 'completed': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cron': return 'text-purple-400 bg-purple-500/20';
      case 'specific': return 'text-cyan-400 bg-cyan-500/20';
      case 'check': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCloseQuery = async (queryId: string) => {
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      await DashboardApiService.closeQuery(token, queryId);
      
      const updatedQueries = queries.map(q => 
        q.id === queryId ? { ...q, status: 'inactive' as const } : q
      );
      onQueriesUpdate(updatedQueries);
      
      success('Query Closed', 'The notification has been successfully closed.');
    } catch (err) {
      error('Close Failed', err instanceof Error ? err.message : 'Failed to close query');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await getAccessTokenSilently();
      await DashboardApiService.createNotification(token, createForm);
      
      // Refresh queries list
      const updatedQueries = await DashboardApiService.getAllQueries(token);
      onQueriesUpdate(updatedQueries);
      
      setShowCreateForm(false);
      setCreateForm({
        prompt: '',
        email: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        channels: ['email'],
        channelConfigs: {}
      });
      
      success('Notification Created', 'Your notification has been successfully created.');
    } catch (err) {
      error('Creation Failed', err instanceof Error ? err.message : 'Failed to create notification');
    } finally {
      setLoading(false);
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'whatsapp': return <Phone className="w-4 h-4" />;
      case 'slack': return <MessageSquare className="w-4 h-4" />;
      case 'discord': return <Hash className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
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
          <span>Notification Statistics</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-blue-400 mb-1">{queryStats.total_queries}</div>
            <div className="text-sm text-gray-400">Total</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-green-400 mb-1">{queryStats.active_queries}</div>
            <div className="text-sm text-gray-400">Active</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-purple-400 mb-1">{queryStats.queries_by_type.cron}</div>
            <div className="text-sm text-gray-400">Recurring</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-cyan-400 mb-1">{queryStats.queries_by_type.specific}</div>
            <div className="text-sm text-gray-400">Scheduled</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-yellow-400 mb-1">{queryStats.queries_by_type.check}</div>
            <div className="text-sm text-gray-400">Checks</div>
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
              <h3 className="text-xl font-semibold">My Notifications</h3>
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
                placeholder="Search notifications..."
                className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20"
              />
            </div>

            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20"
            >
              <option value="all">All Notifications</option>
              <option value="active">Active Only</option>
              <option value="cron">Recurring</option>
              <option value="specific">Scheduled</option>
              <option value="check">Checks</option>
            </select>

            {/* Create Button */}
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-lg font-semibold text-white hover:from-fuchsia-600 hover:to-cyan-600 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              <span>Create New</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredQueries.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-12 text-center">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No notifications found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Create your first notification to get started.'
              }
            </p>
            {!searchTerm && filter === 'all' && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-xl font-semibold text-white hover:from-fuchsia-600 hover:to-cyan-600 transition-all duration-300"
              >
                Create Your First Notification
              </button>
            )}
          </div>
        ) : (
          filteredQueries.map((query) => (
            <div key={query.id} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex-1">
                      <p className="text-white font-medium leading-relaxed">{query.prompt}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(query.status)}`}>
                      {query.status.charAt(0).toUpperCase() + query.status.slice(1)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(query.type)}`}>
                      {query.type.charAt(0).toUpperCase() + query.type.slice(1)}
                    </span>
                    
                    {/* Channels */}
                    <div className="flex items-center space-x-1">
                      {query.channels.map((channel, index) => (
                        <div key={index} className="flex items-center space-x-1 px-2 py-1 bg-white/10 rounded-md">
                          {getChannelIcon(channel)}
                          <span className="text-xs text-gray-300">{channel}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Created: {formatDate(query.created_at)}</span>
                    </div>
                    {query.next_execution && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>Next: {formatDate(query.next_execution)}</span>
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
                    <span className="text-sm">Details</span>
                  </button>
                  
                  {query.status === 'active' && (
                    <button
                      onClick={() => handleCloseQuery(query.id)}
                      disabled={loading}
                      className="flex items-center space-x-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all duration-300 text-red-400 disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      <span className="text-sm">Close</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Notification Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateForm(false)} />
          
          <div className="relative bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Create New Notification</h3>
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
                  Notification Prompt
                </label>
                <textarea
                  value={createForm.prompt}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, prompt: e.target.value }))}
                  placeholder="Describe what you want to be notified about..."
                  className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 resize-none focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
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
                  Timezone
                </label>
                <input
                  type="text"
                  value={createForm.timezone}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, timezone: e.target.value }))}
                  placeholder="UTC"
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
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-xl font-semibold text-white hover:from-fuchsia-600 hover:to-cyan-600 transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Notification'}
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
              <h3 className="text-xl font-semibold">Notification Details</h3>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Type</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(selectedQuery.type)}`}>
                    {selectedQuery.type.charAt(0).toUpperCase() + selectedQuery.type.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedQuery.status)}`}>
                    {selectedQuery.status.charAt(0).toUpperCase() + selectedQuery.status.slice(1)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Channels</label>
                <div className="flex flex-wrap gap-2">
                  {selectedQuery.channels.map((channel, index) => (
                    <div key={index} className="flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-lg">
                      {getChannelIcon(channel)}
                      <span className="text-sm">{channel}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Created</label>
                  <p className="text-white">{formatDate(selectedQuery.created_at)}</p>
                </div>
                {selectedQuery.next_execution && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Next Execution</label>
                    <p className="text-white">{formatDate(selectedQuery.next_execution)}</p>
                  </div>
                )}
              </div>

              {selectedQuery.cron_expression && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Cron Expression</label>
                  <p className="text-white font-mono bg-white/5 p-3 rounded-lg">{selectedQuery.cron_expression}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Query ID</label>
                <p className="text-white font-mono text-sm bg-white/5 p-3 rounded-lg">{selectedQuery.id}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};