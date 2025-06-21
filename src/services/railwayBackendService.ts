
import { supabase } from "@/integrations/supabase/client";

interface RailwayResponse {
  success: boolean;
  data?: any;
  error?: string;
  tokens_used?: number;
  processing_time?: number;
}

interface OnboardingQuestion {
  id: string;
  question: string;
  type: string;
  options?: Array<{ value: string; label: string }>;
  required: boolean;
}

interface TokenPackage {
  id: string;
  name: string;
  token_amount: number;
  price_sar: number;
  features: string[];
  popular: boolean;
}

export class RailwayBackendService {
  private static readonly BASE_URL = 'https://morvo-production.up.railway.app';
  private static readonly TIMEOUT = 30000;

  private static async getAuthHeaders(): Promise<Record<string, string>> {
    const { data: { session } } = await supabase.auth.getSession();
    
    return {
      'Content-Type': 'application/json',
      'Authorization': session?.access_token ? `Bearer ${session.access_token}` : '',
      'X-Client-Info': 'morvo-ai-frontend-v2',
      'Accept': 'application/json'
    };
  }

  private static async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${this.BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers
      },
      signal: AbortSignal.timeout(this.TIMEOUT)
    });

    return response;
  }

  // Health Check
  static async checkServerHealth(): Promise<RailwayResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/health`, {
        signal: AbortSignal.timeout(5000)
      });
      
      if (!response.ok) {
        return { success: false, error: `Server responded with ${response.status}` };
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Railway health check failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Chat Processing
  static async processMessage(message: string, context: any = {}): Promise<RailwayResponse> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const response = await this.makeRequest('/v1/chat/process-message', {
        method: 'POST',
        body: JSON.stringify({
          message: message.trim(),
          client_id: user.id,
          context: {
            ...context,
            timestamp: new Date().toISOString(),
            session_id: user.id
          },
          language: 'ar'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: `HTTP ${response.status}: ${errorText}` };
      }

      const data = await response.json();
      return { 
        success: true, 
        data: {
          response: data.response || data.message,
          tokens_used: data.tokens_used || 0,
          processing_time: data.processing_time,
          suggested_actions: data.suggested_actions || [],
          emotion_detected: data.emotion_detected
        }
      };
    } catch (error) {
      console.error('Railway message processing failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Processing failed' };
    }
  }

  // Customer Profile Management
  static async getCustomerProfile(userId: string): Promise<RailwayResponse> {
    try {
      const response = await this.makeRequest(`/v1/customer/profile/${userId}`);
      
      if (!response.ok) {
        return { success: false, error: `Failed to get profile: ${response.status}` };
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Railway profile fetch failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Profile fetch failed' };
    }
  }

  static async updateCustomerProfile(userId: string, profileData: any): Promise<RailwayResponse> {
    try {
      const response = await this.makeRequest(`/v1/customer/profile/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });
      
      if (!response.ok) {
        return { success: false, error: `Failed to update profile: ${response.status}` };
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Railway profile update failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Profile update failed' };
    }
  }

  static async getProfileCompleteness(clientId: string): Promise<RailwayResponse> {
    try {
      const response = await this.makeRequest(`/v1/chat/profile-completeness/${clientId}`);
      
      if (!response.ok) {
        return { success: false, error: `Faile
d to get completeness: ${response.status}` };
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Railway completeness check failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Completeness check failed' };
    }
  }

  // Onboarding Management
  static async getOnboardingQuestions(language: string = 'ar'): Promise<RailwayResponse> {
    try {
      const response = await this.makeRequest(`/v1/onboarding/questions?language=${language}`);
      
      if (!response.ok) {
        return { success: false, error: `Failed to get questions: ${response.status}` };
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Railway questions fetch failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Questions fetch failed' };
    }
  }

  static async submitOnboardingAnswer(questionId: string, answer: string, userId: string): Promise<RailwayResponse> {
    try {
      const response = await this.makeRequest('/v1/onboarding/answer', {
        method: 'POST',
        body: JSON.stringify({
          question_id: questionId,
          answer: answer,
          user_id: userId
        })
      });
      
      if (!response.ok) {
        return { success: false, error: `Failed to submit answer: ${response.status}` };
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Railway answer submission failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Answer submission failed' };
    }
  }

  // Token Management
  static async getTokenPackages(): Promise<RailwayResponse> {
    try {
      const response = await this.makeRequest('/v1/tokens/packages');
      
      if (!response.ok) {
        return { success: false, error: `Failed to get packages: ${response.status}` };
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Railway packages fetch failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'packages fetch failed' };
    }
  }

  static async getUserTokenBalance(userId: string): Promise<RailwayResponse> {
    try {
      const response = await this.makeRequest(`/v1/tokens/balance/${userId}`);
      
      if (!response.ok) {
        return { success: false, error: `Failed to get balance: ${response.status}` };
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Railway balance fetch failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Balance fetch failed' };
    }
  }

  // Analytics and Insights
  static async getBusinessInsights(clientId: string): Promise<RailwayResponse> {
    try {
      const response = await this.makeRequest(`/v1/analytics/insights/${clientId}`);
      
      if (!response.ok) {
        return { success: false, error: `Failed to get insights: ${response.status}` };
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Railway insights fetch failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Insights fetch failed' };
    }
  }

  // Content Generation
  static async generateContent(prompt: string, contentType: string, userId: string): Promise<RailwayResponse> {
    try {
      const response = await this.makeRequest('/v1/content/generate', {
        method: 'POST',
        body: JSON.stringify({
          prompt,
          content_type: contentType,
          user_id: userId,
          language: 'ar'
        })
      });
      
      if (!response.ok) {
        return { success: false, error: `Failed to generate content: ${response.status}` };
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Railway content generation failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Content generation failed' };
    }
  }

  // Test all endpoints
  static async runComprehensiveTest(): Promise<{ [key: string]: RailwayResponse }> {
    const results: { [key: string]: RailwayResponse } = {};
    
    console.log('🧪 Running comprehensive Railway backend test...');
    
    // Test health
    results.health = await this.checkServerHealth();
    
    // Test token packages
    results.tokenPackages = await this.getTokenPackages();
    
    // Test onboarding questions
    results.onboardingQuestions = await this.getOnboardingQuestions();
    
    // Test message processing
    results.messageProcessing = await this.processMessage('مرحبا، كيف يمكنني البدء؟');
    
    console.log('🧪 Railway backend test results:', results);
    return results;
  }
}
