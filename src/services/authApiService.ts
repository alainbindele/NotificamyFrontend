import { API_CONFIG, ValidatePromptRequest, ValidatePromptResponse, ParsedValidationData } from '../config/api';

export class AuthApiService {
  private static async makeAuthenticatedRequest<T>(
    endpoint: string,
    token: string,
    options: RequestInit = {}
  ): Promise<T> {
    console.log('Making authenticated request to:', endpoint);
    console.log('Token present:', !!token);
    console.log('API Base URL:', API_CONFIG.BASE_URL);
    
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
      console.log('Sending request to:', url);
      console.log('Request body:', options.body);
      
      const response = await fetch(url, defaultOptions);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        if (response.status === 401) {
          throw new Error('Authentication required - Invalid or expired token');
        }
        if (response.status === 403) {
          throw new Error('Access forbidden - Insufficient permissions');
        }
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const responseData = await response.json();
      console.log('Response data:', responseData);
      return responseData;
    } catch (error) {
      console.error('Authenticated API request failed:', error);
      
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Network error - Unable to connect to API server');
      }
      
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