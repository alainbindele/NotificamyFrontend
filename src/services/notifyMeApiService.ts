import { API_CONFIG } from '../config/api';
import { MockApiService } from './mockApiService';
import { 
  ApiResponse,
  UserProfile, 
  UserStatistics, 
  NotificationQuery, 
  QueryStatistics,
  UpdateProfileRequest,
  UpdateChannelsRequest,
  CreateNotificationRequest
} from '../types/api';

export class NotifyMeApiService {
  private static async makeAuthenticatedRequest<T>(
    endpoint: string,
    token: string,
    userEmail?: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    // Add email in header if available
    if (userEmail) {
      headers['X-User-Email'] = userEmail;
    }

    const defaultOptions: RequestInit = {
      headers,
      ...options,
    };

    try {
      console.log(`Making API request to: ${endpoint} with email: ${userEmail}`);
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error ${response.status}:`, errorText);
        
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
        
        // Try to parse error as JSON
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        } catch {
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
      }
      
      const data = await response.json();
      console.log(`API Response from ${endpoint}:`, data);
      return data;
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
    userEmail: string | undefined,
    mockMethod: () => Promise<T>,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await this.makeAuthenticatedRequest<T>(endpoint, token, userEmail, options);
      return response.data;
    } catch (error) {
      if (error instanceof Error && error.message === 'BACKEND_UNAVAILABLE') {
        console.warn(`Backend unavailable, using mock data for ${endpoint}`);
        return await mockMethod();
      }
      throw error;
    }
  }

  // User Profile Management
  static async getUserProfile(token: string, userEmail?: string): Promise<UserProfile> {
    return this.makeRequestWithFallback(
      '/api/v1/user/profile',
      token,
      userEmail,
      () => MockApiService.getUserProfile()
    );
  }

  static async updateUserProfile(token: string, userEmail: string | undefined, data: UpdateProfileRequest): Promise<UserProfile> {
    return this.makeRequestWithFallback(
      '/api/v1/user/profile',
      token,
      userEmail,
      () => MockApiService.updateUserProfile(data),
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  }

  static async updateNotificationChannels(token: string, userEmail: string | undefined, data: UpdateChannelsRequest): Promise<UserProfile> {
    return this.makeRequestWithFallback(
      '/api/v1/user/notification-channels',
      token,
      userEmail,
      () => MockApiService.updateNotificationChannels(data),
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  }

  static async getUserStatistics(token: string, userEmail?: string): Promise<UserStatistics> {
    return this.makeRequestWithFallback(
      '/api/v1/user/statistics',
      token,
      userEmail,
      () => MockApiService.getUserStatistics()
    );
  }

  static async deleteUserAccount(token: string, userEmail?: string): Promise<void> {
    return this.makeRequestWithFallback(
      '/api/v1/user/account',
      token,
      userEmail,
      () => MockApiService.deleteUserAccount(),
      {
        method: 'DELETE',
      }
    );
  }

  // Notification Queries Management
  static async getAllQueries(token: string, userEmail?: string): Promise<NotificationQuery[]> {
    return this.makeRequestWithFallback(
      '/api/v1/queries',
      token,
      userEmail,
      () => MockApiService.getAllQueries()
    );
  }

  static async getActiveQueries(token: string, userEmail?: string): Promise<NotificationQuery[]> {
    return this.makeRequestWithFallback(
      '/api/v1/queries/active',
      token,
      userEmail,
      () => MockApiService.getActiveQueries()
    );
  }

  static async getQueriesByType(token: string, userEmail: string | undefined, type: 'cron' | 'specific' | 'check'): Promise<NotificationQuery[]> {
    return this.makeRequestWithFallback(
      `/api/v1/queries/type/${type}`,
      token,
      userEmail,
      () => MockApiService.getQueriesByType(type)
    );
  }

  static async getQueryById(token: string, userEmail: string | undefined, queryId: number): Promise<NotificationQuery> {
    return this.makeRequestWithFallback(
      `/api/v1/queries/${queryId}`,
      token,
      userEmail,
      () => MockApiService.getQueryById(queryId)
    );
  }

  static async getQueryStatistics(token: string, userEmail?: string): Promise<QueryStatistics> {
    return this.makeRequestWithFallback(
      '/api/v1/queries/statistics',
      token,
      userEmail,
      () => MockApiService.getQueryStatistics()
    );
  }

  static async closeQuery(token: string, userEmail: string | undefined, queryId: number): Promise<void> {
    return this.makeRequestWithFallback(
      `/api/v1/queries/${queryId}/close`,
      token,
      userEmail,
      () => MockApiService.closeQuery(queryId),
      {
        method: 'PUT',
      }
    );
  }

  static async createNotification(token: string, userEmail: string | undefined, data: CreateNotificationRequest): Promise<any> {
    try {
      console.log('NotifyMeApiService sending data:', JSON.stringify(data, null, 2));
      
      const response = await this.makeRequestWithFallback(
        '/api/v1/validate-prompt',
        token,
        userEmail,
        () => MockApiService.createNotification(data),
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );

      // Handle both direct response and wrapped response
      if (response && typeof response === 'object' && 'data' in response) {
        // Backend response format: { success: true, message: "...", data: "JSON string" }
        return JSON.parse(response.data);
      } else if (typeof response === 'string') {
        // Direct JSON string
        return JSON.parse(response);
      }
      // Direct object
      return response;
    } catch (error) {
      console.error('Failed to create notification:', error);
      throw error;
    }
  }
}