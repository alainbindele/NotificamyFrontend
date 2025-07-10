import { UserProfile, UserStatistics, NotificationQuery, QueryStatistics } from '../types/api';

// Mock data for when backend is unavailable
const mockUserProfile: UserProfile = {
  id: 'mock-user-123',
  email: 'user@example.com',
  display_name: 'Test User',
  created_at: '2024-01-01T00:00:00Z',
  notification_channels: {
    discord_webhook: 'https://discord.com/api/webhooks/123/abc',
    slack_webhook: 'https://hooks.slack.com/services/T00/B00/XXX',
    whatsapp_phone: '+1234567890'
  }
};

const mockUserStats: UserStatistics = {
  days_registered: 30,
  channels_configured: 3,
  total_queries: 15,
  active_queries: 8
};

const mockQueries: NotificationQuery[] = [
  {
    id: 'query-1',
    prompt: 'Remind me to water the plants every morning at 8 AM',
    type: 'cron',
    status: 'active',
    next_execution: '2024-12-20T08:00:00Z',
    created_at: '2024-12-01T10:00:00Z',
    updated_at: '2024-12-01T10:00:00Z',
    cron_expression: '0 8 * * *',
    channels: ['email', 'discord'],
    channel_configs: {
      email: 'user@example.com',
      discord: 'https://discord.com/api/webhooks/123/abc'
    }
  },
  {
    id: 'query-2',
    prompt: 'Notify me about the meeting tomorrow at 2 PM',
    type: 'specific',
    status: 'active',
    next_execution: '2024-12-21T14:00:00Z',
    created_at: '2024-12-19T09:00:00Z',
    updated_at: '2024-12-19T09:00:00Z',
    specific_datetime: '2024-12-21T14:00:00Z',
    channels: ['email'],
    channel_configs: {
      email: 'user@example.com'
    }
  },
  {
    id: 'query-3',
    prompt: 'Check if the website is down every 5 minutes',
    type: 'check',
    status: 'active',
    next_execution: '2024-12-20T10:05:00Z',
    created_at: '2024-12-15T15:30:00Z',
    updated_at: '2024-12-15T15:30:00Z',
    cron_expression: '*/5 * * * *',
    channels: ['email', 'slack'],
    channel_configs: {
      email: 'user@example.com',
      slack: 'https://hooks.slack.com/services/T00/B00/XXX'
    }
  }
];

const mockQueryStats: QueryStatistics = {
  total_queries: 15,
  active_queries: 8,
  inactive_queries: 7,
  queries_by_type: {
    cron: 5,
    specific: 6,
    check: 4
  }
};

export class MockApiService {
  // Simulate network delay
  private static delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async getUserProfile(): Promise<UserProfile> {
    await this.delay();
    return { ...mockUserProfile };
  }

  static async updateUserProfile(data: any): Promise<UserProfile> {
    await this.delay();
    return {
      ...mockUserProfile,
      ...data
    };
  }

  static async deleteUserAccount(): Promise<void> {
    await this.delay();
    // Mock deletion - in real app this would delete the account
  }

  static async updateNotificationChannels(data: any): Promise<UserProfile> {
    await this.delay();
    return {
      ...mockUserProfile,
      notification_channels: {
        ...mockUserProfile.notification_channels,
        ...data
      }
    };
  }

  static async getUserStatistics(): Promise<UserStatistics> {
    await this.delay();
    return { ...mockUserStats };
  }

  static async getAllQueries(): Promise<NotificationQuery[]> {
    await this.delay();
    return [...mockQueries];
  }

  static async getActiveQueries(): Promise<NotificationQuery[]> {
    await this.delay();
    return mockQueries.filter(q => q.status === 'active');
  }

  static async getQueryStatistics(): Promise<QueryStatistics> {
    await this.delay();
    return { ...mockQueryStats };
  }

  static async closeQuery(queryId: string): Promise<void> {
    await this.delay();
    // Mock closing query - in real app this would update the query status
    console.log(`Mock: Closing query ${queryId}`);
  }

  static async createNotification(data: any): Promise<any> {
    await this.delay();
    // Mock creation - return a success response
    return {
      success: true,
      message: 'Notification created successfully (mock)',
      data: JSON.stringify({
        response_type: 'validation_success',
        timestamp: new Date().toISOString(),
        generated_by: 'mock_ai',
        validity: {
          valid_prompt: true,
          invalid_reason: null,
          out_of_bounds_prompt_length: false,
          offensive_language_detected: false,
          nasty_instruction_detected: false,
          purpose_valid: true,
          reasonable_usage: true,
          self_enforcing: true
        },
        summary: {
          text: 'Mock notification created successfully',
          language: 'en',
          category: 'reminder',
          channels: data.channels || ['email']
        }
      })
    };
  }
}