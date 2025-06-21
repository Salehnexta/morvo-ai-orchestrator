
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

interface TokenConsumption {
  success: boolean;
  balance: number;
  transaction_id: string;
  timestamp: string;
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

interface OnboardingProfile {
  company_name?: string;
  website_url?: string;
  business_type?: string;
  marketing_experience?: string;
  monthly_budget?: string;
  main_goal?: string;
  team_size?: string;
  marketing_priority?: string;
  target_region?: string;
  monthly_sales?: string;
  customer_sources?: string[];
  main_challenges?: string[];
  most_profitable_product?: string;
  sales_season?: string;
  competitive_advantage?: string;
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

  private static async makeAuthenticatedRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const token = await this.getAuthToken();
    
    return fetch(`${this.API_URL}/${this.API_VERSION}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
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

  // Token Management
  static async getTokenBalance(): Promise<TokenBalance> {
    try {
      const response = await this.makeAuthenticatedRequest('/tokens/balance');
      
      if (!response.ok) {
        throw new Error(`Failed to get token balance: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error getting token balance:', error);
      throw error;
    }
  }

  static async consumeTokens(operationType: string, amount: number, description: string): Promise<TokenConsumption> {
    try {
      const response = await this.makeAuthenticatedRequest('/tokens/consume', {
        method: 'POST',
        body: JSON.stringify({
          operation_type: operationType,
          amount: amount,
          description: description
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to consume tokens: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error consuming tokens:', error);
      throw error;
    }
  }

  static async getTokenHistory(limit: number = 10, offset: number = 0): Promise<any> {
    try {
      const response = await this.makeAuthenticatedRequest(`/tokens/history?limit=${limit}&offset=${offset}`);
      
      if (!response.ok) {
        throw new Error(`Failed to get token history: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error getting token history:', error);
      throw error;
    }
  }

  // Enhanced Chat
  static async sendMessage(message: string, context?: any): Promise<ChatResponse> {
    const clientId = await this.getClientId();
    
    try {
      const response = await this.makeAuthenticatedRequest('/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: message.trim(),
          client_id: clientId,
          context: context || {}
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      return {
        response: data.response || 'No response',
        personality_traits: data.personality_traits,
        tokens_used: data.tokens_used || 0,
        emotion_detected: data.emotion_detected,
        suggested_actions: data.suggested_actions || [],
        processing_time: data.processing_time,
        confidence_score: data.confidence_score || 0.9
      };
    } catch (error) {
      console.error('Chat service error:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('فشل الاتصال بالشبكة. يرجى التحقق من اتصال الإنترنت.');
      }
      
      throw error;
    }
  }

  // Business Intelligence
  static async analyzeWebsite(websiteUrl: string, analysisType: string = 'comprehensive'): Promise<BusinessAnalysis> {
    try {
      const response = await this.makeAuthenticatedRequest('/business-intelligence/analyze', {
        method: 'POST',
        body: JSON.stringify({
          website_url: websiteUrl,
          analysis_type: analysisType,
          include_competitors: true,
          market: 'saudi_arabia'
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to analyze website: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Website analysis error:', error);
      throw error;
    }
  }

  // Onboarding APIs
  static async saveGreetingPreference(greeting: string): Promise<any> {
    const clientId = await this.getClientId();
    
    try {
      const response = await this.makeAuthenticatedRequest('/onboarding/greeting', {
        method: 'POST',
        body: JSON.stringify({
          greeting_preference: greeting,
          client_id: clientId
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to save greeting: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error saving greeting preference:', error);
      throw error;
    }
  }

  static async getJourneyStatus(): Promise<any> {
    const clientId = await this.getClientId();
    
    try {
      const response = await this.makeAuthenticatedRequest(`/onboarding/journey/${clientId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to get journey status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error getting journey status:', error);
      throw error;
    }
  }

  static async updateJourneyPhase(phase: string, completed: boolean, duration: number): Promise<any> {
    const clientId = await this.getClientId();
    
    try {
      const response = await this.makeAuthenticatedRequest('/onboarding/journey/phase', {
        method: 'POST',
        body: JSON.stringify({
          client_id: clientId,
          phase: phase,
          completed: completed,
          duration_seconds: duration
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to update journey phase: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error updating journey phase:', error);
      throw error;
    }
  }

  static async saveProfileData(profileData: OnboardingProfile): Promise<any> {
    const clientId = await this.getClientId();
    
    try {
      const response = await this.makeAuthenticatedRequest('/onboarding/profile', {
        method: 'POST',
        body: JSON.stringify({
          client_id: clientId,
          profile_data: profileData
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to save profile data: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error saving profile data:', error);
      throw error;
    }
  }

  static async getOnboardingQuestions(language: string = 'ar'): Promise<any> {
    try {
      const response = await this.makeAuthenticatedRequest(`/onboarding/questions?language=${language}`);
      
      if (!response.ok) {
        throw new Error(`Failed to get onboarding questions: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error getting onboarding questions:', error);
      throw error;
    }
  }

  // Retry mechanism
  static async sendMessageWithRetry(message: string, context?: any, maxRetries = 3): Promise<ChatResponse> {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.sendMessage(message, context);
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
      console.log('Testing Morvo AI V2 connection...');
      
      const healthResponse = await this.healthCheck();
      console.log('✅ Health Check passed:', healthResponse);
      
      const balanceResponse = await this.getTokenBalance();
      console.log('✅ Token balance test passed:', balanceResponse);
      
      return true;
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return false;
    }
  }
}
