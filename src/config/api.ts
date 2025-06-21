export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://notificamy.com:8080',
  ENDPOINTS: {
    VALIDATE_PROMPT: '/api/v1/validate-prompt'
  }
};

export interface ValidatePromptRequest {
  prompt: string;
  email: string;
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
  when_notify: {
    detected: string;
    cron_expression: string | null;
    date_time: string;
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
  };
  metadata: {
    model_version: string;
    confidence_score: number;
    policy_enforced: boolean;
    tags: string[];
  };
}