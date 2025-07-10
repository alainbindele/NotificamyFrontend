import { API_CONFIG } from '../config/api';
import { 
  UserProfile, 
  UserStatistics, 
  NotificationQuery, 
  QueryStatistics,
  UpdateProfileRequest,
  UpdateChannelsRequest,
  CreateNotificationRequest
} from '../types/api';

export class DashboardApiService {
  private static async makeAuthenticatedRequest<T>(
    endpoint: string,
    token: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        const errorText = await response.text();
        
        if (response.status === 401) {
          throw new Error('Authentication required - Invalid or expired token');
        }
        if (response.status === 403) {
          throw new Error('Access forbidden - Insufficient permissions');
        }
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Network error - Unable to connect to API server');
      }
      throw error;
    }
  }

  // User Profile Management
  static async getUserProfile(token: string): Promise<UserProfile> {
    return this.makeAuthenticatedRequest<UserProfile>('/api/v1/user/profile', token);
  }

  static async updateUserProfile(token: string, data: UpdateProfileRequest): Promise<UserProfile> {
    return this.makeAuthenticatedRequest<UserProfile>('/api/v1/user/profile', token, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteUserAccount(token: string): Promise<void> {
    return this.makeAuthenticatedRequest<void>('/api/v1/user/account', token, {
      method: 'DELETE',
    });
  }

  static async updateNotificationChannels(token: string, data: UpdateChannelsRequest): Promise<UserProfile> {
    return this.makeAuthenticatedRequest<UserProfile>('/api/v1/user/notification-channels', token, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async getUserStatistics(token: string): Promise<UserStatistics> {
    return this.makeAuthenticatedRequest<UserStatistics>('/api/v1/user/statistics', token);
  }

  // Notification Queries Management
  static async getAllQueries(token: string): Promise<NotificationQuery[]> {
    return this.makeAuthenticatedRequest<NotificationQuery[]>('/api/v1/queries', token);
  }

  static async getActiveQueries(token: string): Promise<NotificationQuery[]> {
    return this.makeAuthenticatedRequest<NotificationQuery[]>('/api/v1/queries/active', token);
  }

  static async getQueryStatistics(token: string): Promise<QueryStatistics> {
    return this.makeAuthenticatedRequest<QueryStatistics>('/api/v1/queries/statistics', token);
  }

  static async closeQuery(token: string, queryId: string): Promise<void> {
    return this.makeAuthenticatedRequest<void>(`/api/v1/queries/${queryId}/close`, token, {
      method: 'PUT',
    });
  }

  static async createNotification(token: string, data: CreateNotificationRequest): Promise<any> {
    const response = await this.makeAuthenticatedRequest<any>('/api/v1/validate-prompt', token, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    try {
      return JSON.parse(response.data);
    } catch (error) {
      throw new Error('Invalid response format from server');
    }
  }
}