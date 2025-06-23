
import { MorvoAICore } from './morvoAICore';
import { supabase } from "@/integrations/supabase/client";

// Re-export types and main functionality from core
export type { ChatResponse } from './morvoAICore';

export class MorvoAIService {
  // Primary method - delegates to core
  static async processMessage(message: string, context?: any) {
    return MorvoAICore.processMessage(message, context);
  }

  // Health and connection methods
  static async healthCheck() {
    return MorvoAICore.healthCheck();
  }

  static async testConnection() {
    return MorvoAICore.testConnection();
  }

  static getHealthStatus() {
    return MorvoAICore.getHealthStatus();
  }

  static getConversationId() {
    return MorvoAICore.getConversationId();
  }

  static resetConversation() {
    return MorvoAICore.resetConversation();
  }

  // Legacy methods for backward compatibility
  static async sendMessage(message: string, context?: any) {
    return this.processMessage(message, context);
  }

  static async sendMessageWithRetry(message: string, context?: any, maxRetries = 2) {
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

  // Token Management - Fallback to local client data
  static async getTokenBalance(): Promise<any> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: clientData } = await supabase
        .from('clients')
        .select('quota_limit, quota_used')
        .eq('user_id', user.id)
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

  // Generic request method for other components
  static async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = endpoint.startsWith('http') ? endpoint : `https://morvo-production.up.railway.app${endpoint}`;
    
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };

    return fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      },
      signal: AbortSignal.timeout(45000)
    });
  }

  // Onboarding and Journey methods for backward compatibility
  static async checkJourneyStatus(userId: string): Promise<any> {
    try {
      const response = await this.makeRequest(`/onboarding/journey/${userId}`);
      if (response.ok) {
        return await response.json();
      }
      throw new Error(`Journey status check failed: ${response.status}`);
    } catch (error) {
      console.warn('Journey status check failed, returning mock data:', error);
      return {
        id: 'mock-journey',
        client_id: userId,
        current_phase: 1,
        completed_phases: [],
        profile_data: {},
        phase_times: {},
        started_at: new Date().toISOString(),
        last_updated: new Date().toISOString()
      };
    }
  }

  static async setGreetingPreference(journeyId: string, greeting: string): Promise<any> {
    try {
      const response = await this.makeRequest(`/onboarding/greeting`, {
        method: 'POST',
        body: JSON.stringify({
          journey_id: journeyId,
          greeting_preference: greeting
        })
      });
      
      if (response.ok) {
        return await response.json();
      }
      throw new Error(`Greeting preference failed: ${response.status}`);
    } catch (error) {
      console.warn('Setting greeting preference failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async startWebsiteAnalysis(journeyId: string, websiteUrl: string): Promise<any> {
    try {
      const response = await this.makeRequest('/onboarding/website-analysis', {
        method: 'POST',
        body: JSON.stringify({
          journey_id: journeyId,
          website_url: websiteUrl
        })
      });

      if (response.ok) {
        return await response.json();
      }
      throw new Error(`Website analysis failed: ${response.status}`);
    } catch (error) {
      console.warn('Website analysis failed:', error);
      return { 
        success: false, 
        error: error.message,
        analysis_results: {
          company_overview: 'Mock analysis results',
          core_offerings: 'Mock offerings',
          business_focus: 'Mock focus'
        }
      };
    }
  }
}
