import { useUser, useAuth } from '@clerk/clerk-react';
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
  const { user } = useUser();
  const { getToken } = useAuth();

  const getToken = async (): Promise<string> => {
    const token = await getToken();
    
    if (!token) {
      throw new Error('No token available');
    }
    
    return token;
  };

  // User Profile API
  const getUserProfile = async (): Promise<UserProfile> => {
    const token = await getToken();
    return NotifyMeApiService.getUserProfile(token, user?.emailAddresses?.[0]?.emailAddress);
  };

  const updateUserProfile = async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const token = await getToken();
    return NotifyMeApiService.updateUserProfile(token, user?.emailAddresses?.[0]?.emailAddress, data);
  };

  const updateNotificationChannels = async (data: UpdateChannelsRequest): Promise<UserProfile> => {
    const token = await getToken();
    return NotifyMeApiService.updateNotificationChannels(token, user?.emailAddresses?.[0]?.emailAddress, data);
  };

  const getUserStatistics = async (): Promise<UserStatistics> => {
    const token = await getToken();
    return NotifyMeApiService.getUserStatistics(token, user?.emailAddresses?.[0]?.emailAddress);
  };

  const deleteUserAccount = async (): Promise<void> => {
    const token = await getToken();
    return NotifyMeApiService.deleteUserAccount(token, user?.emailAddresses?.[0]?.emailAddress);
  };

  // Notification Queries API
  const getAllQueries = async (): Promise<NotificationQuery[]> => {
    const token = await getToken();
    return NotifyMeApiService.getAllQueries(token, user?.emailAddresses?.[0]?.emailAddress);
  };

  const getActiveQueries = async (): Promise<NotificationQuery[]> => {
    const token = await getToken();
    return NotifyMeApiService.getActiveQueries(token, user?.emailAddresses?.[0]?.emailAddress);
  };

  const getQueriesByType = async (type: 'cron' | 'specific' | 'check'): Promise<NotificationQuery[]> => {
    const token = await getToken();
    return NotifyMeApiService.getQueriesByType(token, user?.emailAddresses?.[0]?.emailAddress, type);
  };

  const getQueryById = async (queryId: number): Promise<NotificationQuery> => {
    const token = await getToken();
    return NotifyMeApiService.getQueryById(token, user?.emailAddresses?.[0]?.emailAddress, queryId);
  };

  const getQueryStatistics = async (): Promise<QueryStatistics> => {
    const token = await getToken();
    return NotifyMeApiService.getQueryStatistics(token, user?.emailAddresses?.[0]?.emailAddress);
  };

  const closeQuery = async (queryId: number): Promise<void> => {
    const token = await getToken();
    return NotifyMeApiService.closeQuery(token, user?.emailAddresses?.[0]?.emailAddress, queryId);
  };

  const createNotification = async (data: CreateNotificationRequest): Promise<any> => {
    const token = await getToken();
    return NotifyMeApiService.createNotification(token, user?.emailAddresses?.[0]?.emailAddress, data);
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