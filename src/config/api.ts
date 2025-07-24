export const API_CONFIG = {
  BASE_URL: 'https://notificamy.com',
  ENDPOINTS: {
    VALIDATE_PROMPT: '/api/v1/validate-prompt',
    USER_PROFILE: '/api/v1/user/profile',
    USER_STATISTICS: '/api/v1/user/statistics',
    USER_CHANNELS: '/api/v1/user/notification-channels',
    USER_ACCOUNT: '/api/v1/user/account',
    QUERIES: '/api/v1/queries',
    QUERIES_ACTIVE: '/api/v1/queries/active',
    QUERIES_STATISTICS: '/api/v1/queries/statistics',
    HEALTH: '/api/health'
  }
};

// Debug: Log the actual API base URL being used
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:', {
    BASE_URL: API_CONFIG.BASE_URL,
    ENV_VAR: import.meta.env.VITE_API_BASE_URL || 'NOT SET - using default',
    ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT
  });
}

export interface ValidatePromptRequest {
  prompt: string;
  email: string;
  timezone?: string;
  channels?: string[];
  channelConfigs?: Record<string, any>;
}

export interface ValidatePromptResponse {
  success: boolean;
  message: string;
  data: string;
}

export interface ParsedValidationData {
  response_type: string;
  timestamp: string;
  generated_by: string;
  user_timezone?: string;
  when_notify: {
    detected: string;
    cron_expression: string | null;
    date_time: string;
    timezone?: string;
  };
  validity: {
    out_of_bounds_prompt_length: boolean;
    offensive_language_detected: boolean;
    nasty_instruction_detected: boolean;
    purpose_valid: boolean;
    reasonable_usage: boolean;
    self_enforcing: boolean;
    valid_prompt: boolean;
    invalid_reason: string | null;
  };
  summary: {
    text: string;
    language: string;
    category: string;
    channels?: string[];
  };
  metadata: {
    model_version: string;
    confidence_score: number;
    policy_enforced: boolean;
    tags: string[];
  };
}