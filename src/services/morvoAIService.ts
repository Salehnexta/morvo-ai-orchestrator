
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

  // Make this method public so JourneyManager can access it
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

  // Process Message - New integrated endpoint
  static async processMessage(message: string, context?: any): Promise<ChatResponse> {
    const clientId = await this.getClientId();
    
    try {
      console.log('🚀 Sending message to Railway backend:', message);
      
      const response = await this.makeRequest('/chat/process-message', {
        method: 'POST',
        body: JSON.stringify({
          message: message.trim(),
          client_id: clientId,
          context: context || {},
          language: 'ar'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Backend error:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Backend response:', data);
      
      return {
        response: data.response || data.message || 'No response',
        personality_traits: data.personality_traits,
        tokens_used: data.tokens_used || 0,
        emotion_detected: data.emotion_detected,
        suggested_actions: data.suggested_actions || [],
        processing_time: data.processing_time,
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

  // Add missing methods for Enhanced Onboarding
  static async getJourneyStatus(): Promise<any> {
    try {
      const clientId = await this.getClientId();
      const { data } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('customer_id', clientId)
        .single();

      return {
        journey: data || null
      };
    } catch (error) {
      console.error('Error getting journey status:', error);
      return { journey: null };
    }
  }

  static async saveGreetingPreference(greeting: string): Promise<boolean> {
    try {
      const clientId = await this.getClientId();
      const { error } = await supabase
        .from('customer_profiles')
        .upsert({
          customer_id: clientId,
          profile_data: { greeting_preference: greeting },
          updated_at: new Date().toISOString()
        });

      return !error;
    } catch (error) {
      console.error('Error saving greeting preference:', error);
      return false;
    }
  }

  static async updateJourneyPhase(phase: string, completed: boolean, duration: number = 0): Promise<any> {
    try {
      const clientId = await this.getClientId();
      const { data, error } = await supabase
        .from('customer_profiles')
        .upsert({
          customer_id: clientId,
          profile_data: { 
            current_phase: phase,
            phase_completed: completed,
            phase_duration: duration
          },
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      return error ? null : data;
    } catch (error) {
      console.error('Error updating journey phase:', error);
      return null;
    }
  }

  static async saveProfileData(profileData: any): Promise<any> {
    try {
      const clientId = await this.getClientId();
      const { data, error } = await supabase
        .from('customer_profiles')
        .upsert({
          customer_id: clientId,
          profile_data: profileData,
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      return error ? null : data;
    } catch (error) {
      console.error('Error saving profile data:', error);
      return null;
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

  // Get Profile Completeness
  static async getProfileCompleteness(clientId: string): Promise<any> {
    try {
      const response = await this.makeRequest(`/chat/profile-completeness/${clientId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to get profile completeness: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error getting profile completeness:', error);
      throw error;
    }
  }

  // Get Onboarding Questions
  static async getOnboardingQuestions(language: string = 'ar'): Promise<any> {
    try {
      const response = await this.makeRequest(`/onboarding/questions?language=${language}`);
      
      if (!response.ok) {
        throw new Error(`Failed to get onboarding questions: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error getting onboarding questions:', error);
      throw error;
    }
  }

  // Get Token Packages
  static async getTokenPackages(): Promise<any> {
    try {
      const response = await this.makeRequest('/tokens/packages');
      
      if (!response.ok) {
        throw new Error(`Failed to get token packages: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error getting token packages:', error);
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
      
      try {
        const packagesResponse = await this.getTokenPackages();
        console.log('✅ Token packages test passed:', packagesResponse);
      } catch (error) {
        console.warn('⚠️ Token packages test failed (non-critical):', error);
      }
      
      return true;
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return false;
    }
  }

  // Token Management - Fallback to local client data
  static async getTokenBalance(): Promise<TokenBalance> {
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

  // Business Intelligence - Placeholder for future implementation
  static async analyzeWebsite(websiteUrl: string, analysisType: string = 'comprehensive'): Promise<BusinessAnalysis> {
    throw new Error('Website analysis not yet implemented in Railway backend');
  }
}
