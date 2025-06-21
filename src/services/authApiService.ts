import { API_CONFIG, ValidatePromptRequest, ValidatePromptResponse, ParsedValidationData } from '../config/api';

export class AuthApiService {
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
        if (response.status === 401) {
          throw new Error('Authentication required');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Authenticated API request failed:', error);
      throw error;
    }
  }

  static async validatePromptAuthenticated(
    request: ValidatePromptRequest, 
    token: string
  ): Promise<ParsedValidationData> {
    const response = await this.makeAuthenticatedRequest<ValidatePromptResponse>(
      API_CONFIG.ENDPOINTS.VALIDATE_PROMPT,
      token,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );

    try {
      const parsedData: ParsedValidationData = JSON.parse(response.data);
      return parsedData;
    } catch (error) {
      console.error('Failed to parse response data:', error);
      throw new Error('Invalid response format from server');
    }
  }
}