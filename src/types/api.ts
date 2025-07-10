export interface UserProfile {
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

export interface UserStatistics {
  days_registered: number;
  channels_configured: number;
  total_queries: number;
  active_queries: number;
}

export interface NotificationQuery {
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

export interface QueryStatistics {
  total_queries: number;
  active_queries: number;
  inactive_queries: number;
  queries_by_type: {
    cron: number;
    specific: number;
    check: number;
  };
}

export interface UpdateProfileRequest {
  display_name?: string;
  email?: string;
}

export interface UpdateChannelsRequest {
  discord_webhook?: string;
  slack_webhook?: string;
  whatsapp_phone?: string;
}

export interface CreateNotificationRequest {
  prompt: string;
  email: string;
  timezone: string;
  channels: string[];
  channelConfigs: Record<string, any>;
}