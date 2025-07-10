import { useAuth0 } from '@auth0/auth0-react';
import { NotifyMeApiService } from '../services/notifyMeApiService';
import { 
  UserProfile, 
  UserStatistics, 
  NotificationQuery, 
  QueryStatistics,
  UpdateProfileRequest,
  UpdateChannelsRequest,
  CreateNotificationRequest
} from '../types/api';

export const useNotifyMeAPI = () => {
  const { getAccessTokenSilently, user } = useAuth0();

  const getToken = async (): Promise<string> => {
    return await getAccessTokenSilently({
      authorizationParams: {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE || 'https://notificamy.com/api',
        scope: 'openid profile email offline_access'
      },
      cacheMode: 'cache-only'
    });
  };

  // User Profile API
  const getUserProfile = async (): Promise<UserProfile> => {
    const token = await getToken();
    return NotifyMeApiService.getUserProfile(token, user?.email);
  };

  const updateUserProfile = async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const token = await getToken();
    return NotifyMeApiService.updateUserProfile(token, user?.email, data);
  };

  const updateNotificationChannels = async (data: UpdateChannelsRequest): Promise<UserProfile> => {
    const token = await getToken();
    return NotifyMeApiService.updateNotificationChannels(token, user?.email, data);
  };

  const getUserStatistics = async (): Promise<UserStatistics> => {
    const token = await getToken();
    return NotifyMeApiService.getUserStatistics(token, user?.email);
  };

  const deleteUserAccount = async (): Promise<void> => {
    const token = await getToken();
    return NotifyMeApiService.deleteUserAccount(token, user?.email);
  };

  // Notification Queries API
  const getAllQueries = async (): Promise<NotificationQuery[]> => {
    const token = await getToken();
    return NotifyMeApiService.getAllQueries(token, user?.email);
  };

  const getActiveQueries = async (): Promise<NotificationQuery[]> => {
    const token = await getToken();
    return NotifyMeApiService.getActiveQueries(token, user?.email);
  };

  const getQueriesByType = async (type: 'cron' | 'specific' | 'check'): Promise<NotificationQuery[]> => {
    const token = await getToken();
    return NotifyMeApiService.getQueriesByType(token, user?.email, type);
  };

  const getQueryById = async (queryId: number): Promise<NotificationQuery> => {
    const token = await getToken();
    return NotifyMeApiService.getQueryById(token, user?.email, queryId);
  };

  const getQueryStatistics = async (): Promise<QueryStatistics> => {
    const token = await getToken();
    return NotifyMeApiService.getQueryStatistics(token, user?.email);
  };

  const closeQuery = async (queryId: number): Promise<void> => {
    const token = await getToken();
    return NotifyMeApiService.closeQuery(token, user?.email, queryId);
  };

  const createNotification = async (data: CreateNotificationRequest): Promise<any> => {
    const token = await getToken();
    return NotifyMeApiService.createNotification(token, user?.email, data);
  };

  return {
    // User Profile
    getUserProfile,
    updateUserProfile,
    updateNotificationChannels,
    getUserStatistics,
    deleteUserAccount,
    
    // Notification Queries
    getAllQueries,
    getActiveQueries,
    getQueriesByType,
    getQueryById,
    getQueryStatistics,
    closeQuery,
    createNotification
  };
};