import { API_CONFIG } from '../config/api';
import { MockApiService } from './mockApiService';
import { 
  UserProfile, 
  UserStatistics, 
  NotificationQuery, 
  QueryStatistics,
  UpdateProfileRequest,
  UpdateChannelsRequest,
  CreateNotificationRequest
} from '../types/api';

// Check if backend is available
const isBackendAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
      method: 'GET',
      timeout: 5000
    });
    return response.ok;
  } catch {
    return false;
  }
};

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
        
        // If it's a 503 or 502, the backend is unavailable
        if (response.status === 503 || response.status === 502) {
          throw new Error('BACKEND_UNAVAILABLE');
        }
        
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
        throw new Error('BACKEND_UNAVAILABLE');
      }
      throw error;
    }
  }

  private static async makeRequestWithFallback<T>(
    endpoint: string,
    token: string,
    mockMethod: () => Promise<T>,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      return await this.makeAuthenticatedRequest<T>(endpoint, token, options);
    } catch (error) {
      if (error instanceof Error && error.message === 'BACKEND_UNAVAILABLE') {
        console.warn(`Backend unavailable, using mock data for ${endpoint}`);
        return await mockMethod();
      }
      throw error;
    }
  }
  // User Profile Management
  static async getUserProfile(token: string): Promise<UserProfile> {
    return this.makeRequestWithFallback(
      '/api/v1/user/profile',
      token,
      () => MockApiService.getUserProfile()
    );
  }

  static async updateUserProfile(token: string, data: UpdateProfileRequest): Promise<UserProfile> {
    return this.makeRequestWithFallback(
      '/api/v1/user/profile',
      token,
      () => MockApiService.updateUserProfile(data),
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  }

  static async deleteUserAccount(token: string): Promise<void> {
    return this.makeRequestWithFallback(
      '/api/v1/user/account',
      token,
      () => MockApiService.deleteUserAccount(),
      {
        method: 'DELETE',
      }
    );
  }

  static async updateNotificationChannels(token: string, data: UpdateChannelsRequest): Promise<UserProfile> {
    return this.makeRequestWithFallback(
      '/api/v1/user/notification-channels',
      token,
      () => MockApiService.updateNotificationChannels(data),
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  }

  static async getUserStatistics(token: string): Promise<UserStatistics> {
    return this.makeRequestWithFallback(
      '/api/v1/user/statistics',
      token,
      () => MockApiService.getUserStatistics()
    );
  }

  // Notification Queries Management
  static async getAllQueries(token: string): Promise<NotificationQuery[]> {
    return this.makeRequestWithFallback(
      '/api/v1/queries',
      token,
      () => MockApiService.getAllQueries()
    );
  }

  static async getActiveQueries(token: string): Promise<NotificationQuery[]> {
    return this.makeRequestWithFallback(
      '/api/v1/queries/active',
      token,
      () => MockApiService.getActiveQueries()
    );
  }

  static async getQueryStatistics(token: string): Promise<QueryStatistics> {
    return this.makeRequestWithFallback(
      '/api/v1/queries/statistics',
      token,
      () => MockApiService.getQueryStatistics()
    );
  }

  static async closeQuery(token: string, queryId: string): Promise<void> {
    return this.makeRequestWithFallback(
      `/api/v1/queries/${queryId}/close`,
      token,
      () => MockApiService.closeQuery(queryId),
      {
        method: 'PUT',
      }
    );
  }

  static async createNotification(token: string, data: CreateNotificationRequest): Promise<any> {
    try {
      const response = await this.makeRequestWithFallback(
        '/api/v1/validate-prompt',
        token,
        () => MockApiService.createNotification(data),
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );

      return JSON.parse(response.data);
    } catch (error) {
      throw new Error('Invalid response format from server');
    }
  }
}