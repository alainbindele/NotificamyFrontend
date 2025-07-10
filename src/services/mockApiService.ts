import { 
  UserProfile, 
  UserStatistics, 
  NotificationQuery, 
  QueryStatistics,
  UpdateProfileRequest,
  UpdateChannelsRequest,
  CreateNotificationRequest
} from '../types/api';

// Mock data for when backend is unavailable
const mockUserProfile: UserProfile = {
  id: 1,
  email: 'user@example.com',
  displayName: 'Demo User',
  createdAt: '2024-01-01T00:00:00Z',
  discordWebhook: 'https://discord.com/api/webhooks/123456789/abcdefghijklmnop',
  slackWebhook: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXX',
  phone: '+393123456789'
};

const mockUserStats: UserStatistics = {
  userId: 1,
  email: 'user@example.com',
  displayName: 'Demo User',
  memberSince: '2024-01-01T00:00:00Z',
  daysSinceRegistration: 30,
  configuredChannels: 3,
  totalQueries: 15,
  activeQueries: 8,
  cronQueries: 5,
  specificQueries: 6,
  checkQueries: 4
};

const mockQueries: NotificationQuery[] = [
  {
    id: 1,
    prompt: 'Notificami ogni giorno alle 9 sulle notizie di tecnologia',
    isValid: true,
    closed: false,
    cron: true,
    dateSpecific: false,
    toCheck: false,
    cronParams: '0 9 * * *',
    nextExecution: '2024-12-21T09:00:00Z',
    summaryText: 'Notifica giornaliera alle 9:00 per notizie di tecnologia',
    language: 'it',
    category: 'news',
    confidenceScore: 0.95,
    createdAt: '2024-12-01T10:00:00Z',
    timezone: 'Europe/Rome',
    enabledChannels: '["email", "discord"]'
  },
  {
    id: 2,
    prompt: 'Ricordami di chiamare il dottore il 25 gennaio alle 14:00',
    isValid: true,
    closed: false,
    cron: false,
    dateSpecific: true,
    toCheck: false,
    nextExecution: '2025-01-25T14:00:00Z',
    summaryText: 'Promemoria chiamata dottore',
    language: 'it',
    category: 'reminder',
    confidenceScore: 0.98,
    createdAt: '2024-12-19T09:00:00Z',
    timezone: 'Europe/Rome',
    enabledChannels: '["email"]'
  },
  {
    id: 3,
    prompt: 'Controlla se il sito web è online ogni 5 minuti',
    isValid: true,
    closed: false,
    cron: false,
    dateSpecific: false,
    toCheck: true,
    cronParams: '*/5 * * * *',
    nextExecution: '2024-12-20T10:05:00Z',
    summaryText: 'Controllo disponibilità sito web',
    language: 'it',
    category: 'monitoring',
    confidenceScore: 0.92,
    createdAt: '2024-12-15T15:30:00Z',
    timezone: 'Europe/Rome',
    enabledChannels: '["email", "slack"]'
  },
  {
    id: 4,
    prompt: 'Notifica settimanale ogni lunedì alle 8 per il report vendite',
    isValid: true,
    closed: false,
    cron: true,
    dateSpecific: false,
    toCheck: false,
    cronParams: '0 8 * * 1',
    nextExecution: '2024-12-23T08:00:00Z',
    summaryText: 'Report vendite settimanale',
    language: 'it',
    category: 'business',
    confidenceScore: 0.97,
    createdAt: '2024-12-10T12:00:00Z',
    timezone: 'Europe/Rome',
    enabledChannels: '["email", "slack"]'
  },
  {
    id: 5,
    prompt: 'Promemoria compleanno Maria il 15 febbraio',
    isValid: true,
    closed: true,
    cron: false,
    dateSpecific: true,
    toCheck: false,
    nextExecution: '2025-02-15T10:00:00Z',
    summaryText: 'Compleanno Maria',
    language: 'it',
    category: 'personal',
    confidenceScore: 0.99,
    createdAt: '2024-12-05T16:20:00Z',
    timezone: 'Europe/Rome',
    enabledChannels: '["email"]'
  }
];

const mockQueryStats: QueryStatistics = {
  totalQueries: 15,
  cronQueries: 5,
  specificQueries: 6,
  checkQueries: 4
};

export class MockApiService {
  // Simulate network delay
  private static delay(ms: number = 800): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async getUserProfile(): Promise<UserProfile> {
    await this.delay();
    return { ...mockUserProfile };
  }

  static async updateUserProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    await this.delay();
    return {
      ...mockUserProfile,
      displayName: data.displayName || mockUserProfile.displayName,
      email: data.email || mockUserProfile.email
    };
  }

  static async updateNotificationChannels(data: UpdateChannelsRequest): Promise<UserProfile> {
    await this.delay();
    return {
      ...mockUserProfile,
      discordWebhook: data.discord || mockUserProfile.discordWebhook,
      slackWebhook: data.slack || mockUserProfile.slackWebhook,
      phone: data.whatsapp || mockUserProfile.phone
    };
  }

  static async getUserStatistics(): Promise<UserStatistics> {
    await this.delay();
    return { ...mockUserStats };
  }

  static async deleteUserAccount(): Promise<void> {
    await this.delay();
    console.log('Mock: User account deleted');
  }

  static async getAllQueries(): Promise<NotificationQuery[]> {
    await this.delay();
    return [...mockQueries];
  }

  static async getActiveQueries(): Promise<NotificationQuery[]> {
    await this.delay();
    return mockQueries.filter(q => q.isValid && !q.closed);
  }

  static async getQueriesByType(type: 'cron' | 'specific' | 'check'): Promise<NotificationQuery[]> {
    await this.delay();
    return mockQueries.filter(q => {
      if (type === 'cron') return q.cron && !q.dateSpecific && !q.toCheck;
      if (type === 'specific') return !q.cron && q.dateSpecific && !q.toCheck;
      if (type === 'check') return q.toCheck;
      return false;
    });
  }

  static async getQueryById(queryId: number): Promise<NotificationQuery> {
    await this.delay();
    const query = mockQueries.find(q => q.id === queryId);
    if (!query) {
      throw new Error('Query not found');
    }
    return { ...query };
  }

  static async getQueryStatistics(): Promise<QueryStatistics> {
    await this.delay();
    return { ...mockQueryStats };
  }

  static async closeQuery(queryId: number): Promise<void> {
    await this.delay();
    console.log(`Mock: Chiusura notifica ${queryId}`);
  }

  static async createNotification(data: CreateNotificationRequest): Promise<any> {
    await this.delay();
    return {
      success: true,
      message: 'Notifica creata con successo (modalità demo)',
      data: JSON.stringify({
        response_type: 'validation_success',
        timestamp: new Date().toISOString(),
        generated_by: 'demo_ai',
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
          text: `Demo: Notifica creata per "${data.prompt}"`,
          language: 'it',
          category: 'demo',
          channels: data.channels || ['email']
        }
      })
    };
  }
}