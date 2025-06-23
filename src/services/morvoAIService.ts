
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

interface ConnectionHealth {
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  lastChecked: Date;
}

export class MorvoAIService {
  private static readonly API_URL = 'https://morvo-production.up.railway.app';
  private static readonly API_VERSION = 'v1';
  private static readonly TIMEOUT = 45000;
  private static healthStatus: ConnectionHealth | null = null;
  private static conversationId: string | null = sessionStorage.getItem('morvo_conversation_id');

  private static async getAuthToken(): Promise<string | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token || null;
    } catch (error) {
      console.warn('Could not get auth token:', error);
      return null;
    }
  }

  private static getClientId(): string {
    let clientId = localStorage.getItem('morvo_client_id');
    if (!clientId) {
      clientId = `lovable-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('morvo_client_id', clientId);
    }
    return clientId;
  }

  private static async checkHealth(): Promise<ConnectionHealth> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${this.API_URL}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(5000)
      });
      
      const latency = Date.now() - startTime;
      
      if (response.ok) {
        this.healthStatus = {
          status: latency > 2000 ? 'degraded' : 'healthy',
          latency,
          lastChecked: new Date()
        };
      } else {
        this.healthStatus = {
          status: 'down',
          latency,
          lastChecked: new Date()
        };
      }
      
      return this.healthStatus;
    } catch (error) {
      const latency = Date.now() - startTime;
      this.healthStatus = {
        status: 'down',
        latency,
        lastChecked: new Date()
      };
      return this.healthStatus;
    }
  }

  // Primary method - Use the working test endpoint that doesn't require authentication
  static async processMessage(message: string, context?: any): Promise<ChatResponse> {
    try {
      console.log('🚀 Sending message to Railway test endpoint:', message);
      
      // Try authenticated endpoint first if we have a token
      const token = await this.getAuthToken();
      if (token) {
        try {
          const authResponse = await this.sendAuthenticatedMessage(message, token, context);
          return authResponse;
        } catch (authError) {
          console.warn('⚠️ Auth endpoint failed, falling back to test endpoint:', authError);
        }
      }

      // Use test endpoint as primary method
      const response = await fetch(`${this.API_URL}/v1/chat/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          message: message.trim(),
          client_id: this.getClientId(),
          conversation_id: this.conversationId || `conv-${Date.now()}`
        }),
        signal: AbortSignal.timeout(this.TIMEOUT)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Test endpoint error:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Test endpoint response:', data);
      
      // Save conversation ID for context
      if (data.conversation_id) {
        this.conversationId = data.conversation_id;
        sessionStorage.setItem('morvo_conversation_id', data.conversation_id);
      }
      
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

  // Try authenticated endpoint with proper format
  private static async sendAuthenticatedMessage(message: string, token: string, context?: any): Promise<ChatResponse> {
    const response = await fetch(`${this.API_URL}/v1/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Client-Info': 'morvo-ai-frontend'
      },
      body: JSON.stringify({
        message: message.trim(),
        conversation_id: this.conversationId,
        project_context: context?.project_context || {},
        metadata: context?.metadata || {},
        stream: false
      }),
      signal: AbortSignal.timeout(this.TIMEOUT)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Auth endpoint failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    // Save conversation ID
    if (data.conversation_id) {
      this.conversationId = data.conversation_id;
      sessionStorage.setItem('morvo_conversation_id', data.conversation_id);
    }

    return {
      response: data.message || data.response || 'No response',
      personality_traits: data.personality_traits,
      tokens_used: data.tokens_used || 0,
      emotion_detected: data.emotion_detected,
      suggested_actions: data.suggested_actions || [],
      processing_time: data.processing_time_ms,
      confidence_score: data.confidence_score || 0.9
    };
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

  // Test connection with detailed diagnostics
  static async testConnection(): Promise<boolean> {
    try {
      console.log('🔗 Testing Morvo AI Railway connection...');
      
      const health = await this.checkHealth();
      console.log('✅ Health Check result:', health);
      
      // Test the working endpoint
      const testResponse = await fetch(`${this.API_URL}/v1/chat/test`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          message: 'Connection test',
          client_id: this.getClientId(),
          conversation_id: 'test-connection'
        })
      });
      
      const testWorking = testResponse.ok;
      console.log('🧪 Test endpoint result:', testWorking);
      
      return health.status === 'healthy' || health.status === 'degraded';
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return false;
    }
  }

  static getHealthStatus(): ConnectionHealth | null {
    return this.healthStatus;
  }

  static getConversationId(): string | null {
    return this.conversationId;
  }

  static resetConversation(): void {
    this.conversationId = null;
    sessionStorage.removeItem('morvo_conversation_id');
    console.log('🔄 Conversation reset');
  }

  // Legacy methods for backward compatibility
  static async sendMessage(message: string, context?: any): Promise<ChatResponse> {
    return this.processMessage(message, context);
  }

  static async sendMessageWithRetry(message: string, context?: any, maxRetries = 2): Promise<ChatResponse> {
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

  // Generic request method for other components
  static async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.API_URL}${endpoint}`;
    
    const token = await this.getAuthToken();
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
      signal: AbortSignal.timeout(this.TIMEOUT)
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
      // Return mock data for development
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
}
