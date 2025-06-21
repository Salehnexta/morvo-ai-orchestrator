
import { supabase } from "@/integrations/supabase/client";

interface ChatResponse {
  response: string;
  personality_traits?: {
    role: string;
    communication_style: string;
    cultural_awareness: string;
    commitment_level: string;
  };
  tokens_used: number;
  emotion_detected?: string;
  suggested_actions?: Array<{
    action: string;
    urgency: string;
    estimated_impact: string;
  }>;
  processing_time?: number;
  confidence_score?: number;
}

interface TokenBalance {
  balance: number;
  package: {
    name: string;
    token_amount: number;
    price_sar: number;
    bonus_tokens: number;
  };
}

interface BusinessAnalysis {
  analysis: {
    business_overview: {
      business_type: string;
      main_products: string[];
      target_audience: string;
      unique_value: string;
    };
    digital_presence: {
      website_health: {
        seo_score: number;
        speed_score: number;
        mobile_friendly: boolean;
        ssl_secure: boolean;
      };
      social_media: Record<string, any>;
    };
    competitors: Array<{
      name: string;
      market_share: number;
      strengths: string[];
      weaknesses: string[];
    }>;
    opportunities: {
      quick_wins: string[];
      strategic: string[];
    };
    roi_prediction: Record<string, any>;
  };
  tokens_used: number;
  analysis_time: number;
  confidence_score: number;
}

export class MorvoAIService {
  private static readonly API_URL = 'https://morvo-production.up.railway.app';
  private static readonly API_VERSION = 'v1';
  private static readonly TIMEOUT = 30000;

  private static async getAuthToken(): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('User not authenticated');
    }
    return session.access_token;
  }

  private static async getClientId(): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.id) {
      return session.user.id;
    }
    throw new Error('User not authenticated');
  }

  static async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const token = await this.getAuthToken();
    
    return fetch(`${this.API_URL}/${this.API_VERSION}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Client-Info': 'morvo-ai-frontend',
        ...options.headers
      },
      signal: AbortSignal.timeout(this.TIMEOUT)
    });
  }

  // Health Check
  static async healthCheck(): Promise<any> {
    try {
      const response = await fetch(`${this.API_URL}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(this.TIMEOUT)
      });
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }

  // Process Message - Fixed endpoint and payload
  static async processMessage(message: string, context?: any): Promise<ChatResponse> {
    try {
      console.log('🚀 Sending message to Railway backend:', message);
      
      const response = await this.makeRequest('/chat/message', {
        method: 'POST',
        body: JSON.stringify({
          message: message.trim(),
          conversation_id: context?.conversation_id,
          project_context: context?.project_context || {},
          metadata: context?.metadata || {},
          stream: false
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Backend error:', response.status, errorText);
        
        if (response.status === 422) {
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { detail: errorText };
          }
          
          const validationError = errorData.errors?.[0]?.msg || errorData.detail || 'Validation error';
          throw new Error(`Validation error: ${validationError}`);
        }
        
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Backend response:', data);
      
      return {
        response: data.message || data.response || 'No response',
        personality_traits: data.personality_traits,
        tokens_used: data.tokens_used || 0,
        emotion_detected: data.emotion_detected,
        suggested_actions: data.suggested_actions || [],
        processing_time: data.processing_time_ms,
        confidence_score: data.confidence_score || 0.9
      };
    } catch (error) {
      console.error('❌ Chat service error:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('فشل الاتصال بالشبكة. يرجى التحقق من اتصال الإنترنت.');
      }
      
      throw error;
    }
  }

  // Check Journey Status - New method
  static async checkJourneyStatus(clientId: string): Promise<any> {
    try {
      const response = await this.makeRequest(`/onboarding/journey-status/${clientId}`);
      
      if (response.status === 404) {
        return null; // No journey found
      }
      
      if (!response.ok) {
        throw new Error(`Failed to check journey status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error checking journey status:', error);
      return null;
    }
  }

  // Start Journey - Fixed payload
  static async startJourneyWithWebsite(websiteUrl: string): Promise<any> {
    try {
      console.log('🚀 Starting journey with website:', websiteUrl);
      
      const response = await this.makeRequest('/onboarding/start', {
        method: 'POST',
        body: JSON.stringify({
          website_url: websiteUrl
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Journey start error:', response.status, errorText);
        
        if (response.status === 422) {
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { detail: errorText };
          }
          
          const validationError = errorData.errors?.[0]?.msg || errorData.detail || 'Validation error';
          throw new Error(`Validation error: ${validationError}`);
        }
        
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Journey started:', data);
      return data;
    } catch (error) {
      console.error('❌ Start journey error:', error);
      throw error;
    }
  }

  // Set Greeting Preference - Fixed endpoint
  static async setGreetingPreference(journeyId: string, greeting: string): Promise<boolean> {
    try {
      console.log('💾 Setting greeting preference:', greeting);
      
      const response = await this.makeRequest('/onboarding/greeting-preference', {
        method: 'POST',
        body: JSON.stringify({
          journey_id: journeyId,
          greeting_preference: greeting
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Greeting preference error:', response.status, errorText);
        return false;
      }

      const data = await response.json();
      console.log('✅ Greeting preference set:', data);
      return true;
    } catch (error) {
      console.error('❌ Set greeting preference error:', error);
      return false;
    }
  }

  // Website Analysis - Fixed endpoint
  static async startWebsiteAnalysis(journeyId: string, websiteUrl: string): Promise<boolean> {
    try {
      console.log('🔍 Starting website analysis:', websiteUrl);
      
      const response = await this.makeRequest('/onboarding/website-analysis', {
        method: 'POST',
        body: JSON.stringify({
          journey_id: journeyId,
          website_url: websiteUrl
        })
      });

      return response.ok;
    } catch (error) {
      console.error('❌ Website analysis error:', error);
      return false;
    }
  }

  // Get Customer Profile
  static async getCustomerProfile(userId: string): Promise<any> {
    try {
      const response = await this.makeRequest(`/customer/profile/${userId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to get customer profile: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error getting customer profile:', error);
      throw error;
    }
  }

  // Legacy methods for backward compatibility
  static async sendMessage(message: string, context?: any): Promise<ChatResponse> {
    return this.processMessage(message, context);
  }

  static async sendMessageWithRetry(message: string, context?: any, maxRetries = 3): Promise<ChatResponse> {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.processMessage(message, context);
      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${attempt} failed:`, error);
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
    
    throw lastError;
  }

  // Test connection
  static async testConnection(): Promise<boolean> {
    try {
      console.log('🔗 Testing Morvo AI Railway connection...');
      
      const healthResponse = await this.healthCheck();
      console.log('✅ Health Check passed:', healthResponse);
      
      return true;
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return false;
    }
  }

  // Token Management - Fallback to local client data
  static async getTokenBalance(): Promise<any> {
    try {
      const clientId = await this.getClientId();
      const { data: clientData } = await supabase
        .from('clients')
        .select('quota_limit, quota_used')
        .eq('user_id', clientId)
        .single();

      if (!clientData) {
        throw new Error('Client not found');
      }

      return {
        balance: clientData.quota_limit - clientData.quota_used,
        package: {
          name: 'Free Plan',
          token_amount: clientData.quota_limit,
          price_sar: 0,
          bonus_tokens: 0
        }
      };
    } catch (error) {
      console.error('Error getting token balance:', error);
      throw error;
    }
  }
}
