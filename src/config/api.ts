export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://notificamy.com',
  ENDPOINTS: {
    VALIDATE_PROMPT: '/api/v1/validate-prompt'
  }
};

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