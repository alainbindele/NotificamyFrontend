import { useLogto } from '@logto/react';
import { NotifyMeApiService } from '../services/notifyMeApiService';
import { useState, useEffect } from 'react';
import { API_RESOURCE } from '../config/logto';
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
  const { getAccessToken, fetchUserInfo } = useLogto();
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    fetchUserInfo().then(setUserInfo).catch(console.error);
  }, [fetchUserInfo]);

  const getAuthToken = async (): Promise<string> => {
    const token = await getAccessToken(API_RESOURCE);

    if (!token) {
      throw new Error('No token available');
    }

    return token;
  };

  // User Profile API
  const getUserProfile = async (): Promise<UserProfile> => {
    const token = await getAuthToken();
    return NotifyMeApiService.getUserProfile(token, userInfo?.email);
  };

  const updateUserProfile = async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const token = await getAuthToken();
    return NotifyMeApiService.updateUserProfile(token, userInfo?.email, data);
  };

  const updateNotificationChannels = async (data: UpdateChannelsRequest): Promise<UserProfile> => {
    const token = await getAuthToken();
    return NotifyMeApiService.updateNotificationChannels(token, userInfo?.email, data);
  };

  const getUserStatistics = async (): Promise<UserStatistics> => {
    const token = await getAuthToken();
    return NotifyMeApiService.getUserStatistics(token, userInfo?.email);
  };

  const deleteUserAccount = async (): Promise<void> => {
    const token = await getAuthToken();
    return NotifyMeApiService.deleteUserAccount(token, userInfo?.email);
  };

  // Notification Queries API
  const getAllQueries = async (): Promise<NotificationQuery[]> => {
    const token = await getAuthToken();
    return NotifyMeApiService.getAllQueries(token, userInfo?.email);
  };

  const getActiveQueries = async (): Promise<NotificationQuery[]> => {
    const token = await getAuthToken();
    return NotifyMeApiService.getActiveQueries(token, userInfo?.email);
  };

  const getQueriesByType = async (type: 'cron' | 'specific' | 'check'): Promise<NotificationQuery[]> => {
    const token = await getAuthToken();
    return NotifyMeApiService.getQueriesByType(token, userInfo?.email, type);
  };

  const getQueryById = async (queryId: number): Promise<NotificationQuery> => {
    const token = await getAuthToken();
    return NotifyMeApiService.getQueryById(token, userInfo?.email, queryId);
  };

  const getQueryStatistics = async (): Promise<QueryStatistics> => {
    const token = await getAuthToken();
    return NotifyMeApiService.getQueryStatistics(token, userInfo?.email);
  };

  const closeQuery = async (queryId: number): Promise<void> => {
    const token = await getAuthToken();
    return NotifyMeApiService.closeQuery(token, userInfo?.email, queryId);
  };

  const createNotification = async (data: CreateNotificationRequest): Promise<any> => {
    const token = await getAuthToken();
    return NotifyMeApiService.createNotification(token, userInfo?.email, data);
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