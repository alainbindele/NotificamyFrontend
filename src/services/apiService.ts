import { API_CONFIG, ValidatePromptRequest, ValidatePromptResponse, ParsedValidationData } from '../config/api';

export class ApiService {
  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  static async validatePrompt(request: ValidatePromptRequest): Promise<ParsedValidationData> {
    const response = await this.makeRequest<ValidatePromptResponse>(
      API_CONFIG.ENDPOINTS.VALIDATE_PROMPT,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );

    // Parse the data field which contains a JSON string
    try {
      const parsedData: ParsedValidationData = JSON.parse(response.data);
      return parsedData;
    } catch (error) {
      console.error('Failed to parse response data:', error);
      throw new Error('Invalid response format from server');
    }
  }
}