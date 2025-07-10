import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { User, Mail, Calendar, Settings, Trash2, Save, Eye, EyeOff, MessageSquare, Hash, Phone } from 'lucide-react';
import { UserProfile, UserStatistics, UpdateProfileRequest, UpdateChannelsRequest } from '../../types/api';
import { DashboardApiService } from '../../services/dashboardApiService';
import { useToast } from '../../hooks/useToast';

interface ProfileSectionProps {
  userProfile: UserProfile;
  userStats: UserStatistics;
  onProfileUpdate: (profile: UserProfile) => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  userProfile,
  userStats,
  onProfileUpdate
}) => {
  const { getAccessTokenSilently, logout } = useAuth0();
  const { success, error } = useToast();
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingChannels, setIsEditingChannels] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showWebhooks, setShowWebhooks] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    display_name: userProfile.display_name || '',
    email: userProfile.email || ''
  });
  
  const [channelsForm, setChannelsForm] = useState({
    discord_webhook: userProfile.notification_channels.discord_webhook || '',
    slack_webhook: userProfile.notification_channels.slack_webhook || '',
    whatsapp_phone: userProfile.notification_channels.whatsapp_phone || ''
  });

  const maskSensitiveData = (data: string, type: 'webhook' | 'phone') => {
    if (!data) return '';
    
    if (type === 'webhook') {
      const parts = data.split('/');
      if (parts.length > 3) {
        return `${parts[0]}//${parts[2]}/***`;
      }
      return '***';
    }
    
    if (type === 'phone') {
      if (data.length > 4) {
        return `${data.slice(0, 3)}***${data.slice(-2)}`;
      }
      return '***';
    }
    
    return data;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await getAccessTokenSilently();
      const updatedProfile = await DashboardApiService.updateUserProfile(token, profileForm);
      
      onProfileUpdate(updatedProfile);
      setIsEditingProfile(false);
      success('Profile Updated', 'Your profile has been successfully updated.');
    } catch (err) {
      error('Update Failed', err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChannelsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await getAccessTokenSilently();
      const cleanData: UpdateChannelsRequest = {};
      
      if (channelsForm.discord_webhook.trim()) {
        cleanData.discord_webhook = channelsForm.discord_webhook.trim();
      }
      if (channelsForm.slack_webhook.trim()) {
        cleanData.slack_webhook = channelsForm.slack_webhook.trim();
      }
      if (channelsForm.whatsapp_phone.trim()) {
        cleanData.whatsapp_phone = channelsForm.whatsapp_phone.trim();
      }

      const updatedProfile = await DashboardApiService.updateNotificationChannels(token, cleanData);
      
      onProfileUpdate(updatedProfile);
      setIsEditingChannels(false);
      success('Channels Updated', 'Your notification channels have been successfully updated.');
    } catch (err) {
      error('Update Failed', err instanceof Error ? err.message : 'Failed to update channels');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);

    try {
      const token = await getAccessTokenSilently();
      await DashboardApiService.deleteUserAccount(token);
      
      success('Account Deleted', 'Your account has been successfully deleted.');
      
      // Logout after successful deletion
      setTimeout(() => {
        logout({ logoutParams: { returnTo: window.location.origin } });
      }, 2000);
    } catch (err) {
      error('Deletion Failed', err instanceof Error ? err.message : 'Failed to delete account');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      {/* Profile Information */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-fuchsia-500/20 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-fuchsia-400" />
            </div>
            <h3 className="text-xl font-semibold">Profile Information</h3>
          </div>
          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="flex items-center space-x-2 px-4 py-2 bg-fuchsia-500/20 hover:bg-fuchsia-500/30 rounded-lg transition-all duration-300"
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm">{isEditingProfile ? 'Cancel' : 'Edit'}</span>
          </button>
        </div>

        {isEditingProfile ? (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={profileForm.display_name}
                onChange={(e) => setProfileForm(prev => ({ ...prev, display_name: e.target.value }))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20"
                placeholder="Enter your display name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-xl font-semibold text-white hover:from-fuchsia-600 hover:to-cyan-600 transition-all duration-300 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Display Name</label>
                <p className="text-white font-medium">{userProfile.display_name || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <p className="text-white font-medium">{userProfile.email}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Member Since</label>
                <p className="text-white font-medium">{formatDate(userProfile.created_at)}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">User ID</label>
                <p className="text-white font-mono text-sm">{userProfile.id}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center space-x-3">
          <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-cyan-400" />
          </div>
          <span>Account Statistics</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-fuchsia-400 mb-1">{userStats.days_registered}</div>
            <div className="text-sm text-gray-400">Days Registered</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-cyan-400 mb-1">{userStats.channels_configured}</div>
            <div className="text-sm text-gray-400">Channels Configured</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-green-400 mb-1">{userStats.total_queries}</div>
            <div className="text-sm text-gray-400">Total Notifications</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-yellow-400 mb-1">{userStats.active_queries}</div>
            <div className="text-sm text-gray-400">Active Notifications</div>
          </div>
        </div>
      </div>

      {/* Notification Channels */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold">Notification Channels</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowWebhooks(!showWebhooks)}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-500/20 hover:bg-gray-500/30 rounded-lg transition-all duration-300"
            >
              {showWebhooks ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="text-sm">{showWebhooks ? 'Hide' : 'Show'}</span>
            </button>
            <button
              onClick={() => setIsEditingChannels(!isEditingChannels)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-all duration-300"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">{isEditingChannels ? 'Cancel' : 'Edit'}</span>
            </button>
          </div>
        </div>

        {isEditingChannels ? (
          <form onSubmit={handleChannelsSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <div className="flex items-center space-x-2">
                  <Hash className="w-4 h-4 text-indigo-400" />
                  <span>Discord Webhook URL</span>
                </div>
              </label>
              <input
                type="url"
                value={channelsForm.discord_webhook}
                onChange={(e) => setChannelsForm(prev => ({ ...prev, discord_webhook: e.target.value }))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="https://discord.com/api/webhooks/..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  <span>Slack Webhook URL</span>
                </div>
              </label>
              <input
                type="url"
                value={channelsForm.slack_webhook}
                onChange={(e) => setChannelsForm(prev => ({ ...prev, slack_webhook: e.target.value }))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                placeholder="https://hooks.slack.com/services/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-green-400" />
                  <span>WhatsApp Phone Number</span>
                </div>
              </label>
              <input
                type="tel"
                value={channelsForm.whatsapp_phone}
                onChange={(e) => setChannelsForm(prev => ({ ...prev, whatsapp_phone: e.target.value }))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                placeholder="+1234567890"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl font-semibold text-white hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Channels'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center space-x-3">
                <Hash className="w-5 h-5 text-indigo-400" />
                <span className="font-medium">Discord</span>
              </div>
              <span className="text-sm text-gray-400">
                {userProfile.notification_channels.discord_webhook 
                  ? (showWebhooks 
                      ? userProfile.notification_channels.discord_webhook 
                      : maskSensitiveData(userProfile.notification_channels.discord_webhook, 'webhook'))
                  : 'Not configured'
                }
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                <span className="font-medium">Slack</span>
              </div>
              <span className="text-sm text-gray-400">
                {userProfile.notification_channels.slack_webhook 
                  ? (showWebhooks 
                      ? userProfile.notification_channels.slack_webhook 
                      : maskSensitiveData(userProfile.notification_channels.slack_webhook, 'webhook'))
                  : 'Not configured'
                }
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-400" />
                <span className="font-medium">WhatsApp</span>
              </div>
              <span className="text-sm text-gray-400">
                {userProfile.notification_channels.whatsapp_phone 
                  ? (showWebhooks 
                      ? userProfile.notification_channels.whatsapp_phone 
                      : maskSensitiveData(userProfile.notification_channels.whatsapp_phone, 'phone'))
                  : 'Not configured'
                }
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="bg-red-500/10 backdrop-blur-sm rounded-2xl border border-red-500/20 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-red-400">Danger Zone</h3>
            <p className="text-sm text-gray-400">Irreversible actions</p>
          </div>
        </div>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 rounded-xl font-semibold text-red-400 transition-all duration-300"
          >
            Delete Account
          </button>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-red-500/20 rounded-xl border border-red-500/30">
              <h4 className="font-semibold text-red-400 mb-2">Are you absolutely sure?</h4>
              <p className="text-sm text-gray-300 mb-4">
                This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold text-white transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Yes, delete my account'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 rounded-lg font-semibold text-gray-300 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};