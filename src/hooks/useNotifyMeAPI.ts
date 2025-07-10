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
  const { getAccessTokenSilently } = useAuth0();

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
    return NotifyMeApiService.getUserProfile(token);
  };

  const updateUserProfile = async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const token = await getToken();
    return NotifyMeApiService.updateUserProfile(token, data);
  };

  const updateNotificationChannels = async (data: UpdateChannelsRequest): Promise<UserProfile> => {
    const token = await getToken();
    return NotifyMeApiService.updateNotificationChannels(token, data);
  };

  const getUserStatistics = async (): Promise<UserStatistics> => {
    const token = await getToken();
    return NotifyMeApiService.getUserStatistics(token);
  };

  const deleteUserAccount = async (): Promise<void> => {
    const token = await getToken();
    return NotifyMeApiService.deleteUserAccount(token);
  };

  // Notification Queries API
  const getAllQueries = async (): Promise<NotificationQuery[]> => {
    const token = await getToken();
    return NotifyMeApiService.getAllQueries(token);
  };

  const getActiveQueries = async (): Promise<NotificationQuery[]> => {
    const token = await getToken();
    return NotifyMeApiService.getActiveQueries(token);
  };

  const getQueriesByType = async (type: 'cron' | 'specific' | 'check'): Promise<NotificationQuery[]> => {
    const token = await getToken();
    return NotifyMeApiService.getQueriesByType(token, type);
  };

  const getQueryById = async (queryId: number): Promise<NotificationQuery> => {
    const token = await getToken();
    return NotifyMeApiService.getQueryById(token, queryId);
  };

  const getQueryStatistics = async (): Promise<QueryStatistics> => {
    const token = await getToken();
    return NotifyMeApiService.getQueryStatistics(token);
  };

  const closeQuery = async (queryId: number): Promise<void> => {
    const token = await getToken();
    return NotifyMeApiService.closeQuery(token, queryId);
  };

  const createNotification = async (data: CreateNotificationRequest): Promise<any> => {
    const token = await getToken();
    return NotifyMeApiService.createNotification(token, data);
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