// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

// User Profile Types
export interface UserProfile {
  id: number;
  email: string;
  displayName: string;
  createdAt: string;
  discordWebhook?: string;
  slackWebhook?: string;
  phone?: string;
}

export interface UserStatistics {
  userId: number;
  email: string;
  displayName: string;
  memberSince: string;
  daysSinceRegistration: number;
  configuredChannels: number;
  totalQueries: number;
  activeQueries: number;
  cronQueries: number;
  specificQueries: number;
  checkQueries: number;
}

// Notification Query Types
export interface NotificationQuery {
  id: number;
  prompt: string;
  isValid: boolean;
  closed: boolean;
  cron: boolean;
  dateSpecific: boolean;
  toCheck: boolean;
  cronParams?: string;
  nextExecution?: string;
  validFrom?: string;
  validTo?: string;
  summaryText?: string;
  language?: string;
  category?: string;
  confidenceScore?: number;
  createdAt: string;
  timezone?: string;
  enabledChannels?: string;
}

export interface QueryStatistics {
  totalQueries: number;
  cronQueries: number;
  specificQueries: number;
  checkQueries: number;
}

// Request Types
export interface UpdateProfileRequest {
  displayName?: string;
  email?: string;
}

export interface UpdateChannelsRequest {
  discord?: string;
  slack?: string;
  whatsapp?: string;
}

export interface CreateNotificationRequest {
  prompt: string;
  email: string;
  channels: string[];
  channelConfigs: Record<string, string>;
  timezone: string;
}

// Legacy types for backward compatibility
export interface UserProfile_Legacy {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
  notification_channels: {
    discord_webhook?: string;
    slack_webhook?: string;
    whatsapp_phone?: string;
  };
}

export interface UserStatistics_Legacy {
  days_registered: number;
  channels_configured: number;
  total_queries: number;
  active_queries: number;
}

export interface NotificationQuery_Legacy {
  id: string;
  prompt: string;
  type: 'cron' | 'specific' | 'check';
  status: 'active' | 'inactive' | 'completed';
  next_execution?: string;
  created_at: string;
  updated_at: string;
  cron_expression?: string;
  specific_datetime?: string;
  channels: string[];
  channel_configs: Record<string, any>;
}

export interface QueryStatistics_Legacy {
  total_queries: number;
  active_queries: number;
  inactive_queries: number;
  queries_by_type: {
    cron: number;
    specific: number;
    check: number;
  };
}