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
  // Updated to use the correct Railway production URL
  private static readonly BASE_URL = 'https://morvo-production.up.railway.app';
  private static readonly TIMEOUT = 15000; // Increased timeout for Railway
  private static isServerHealthy = false;
  private static lastHealthCheck = 0;
  private static readonly HEALTH_CHECK_INTERVAL = 60000; // 1 minute

  private static async getAuthHeaders(): Promise<Record<string, string>> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      return {
        'Content-Type': 'application/json',
        'Authorization': session?.access_token ? `Bearer ${session.access_token}` : '',
        'X-Client-Info': 'morvo-ai-frontend-v2',
        'Accept': 'application/json'
      };
    } catch (error) {
      console.warn('Failed to get auth headers:', error);
      return {
        'Content-Type': 'application/json',
        'X-Client-Info': 'morvo-ai-frontend-v2',
        'Accept': 'application/json'
      };
    }
  }

  private static async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const headers = await this.getAuthHeaders();
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);
    
    try {
      console.log(`🔗 Making Railway request to: ${this.BASE_URL}${endpoint}`);
      
      const response = await fetch(`${this.BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...headers,
          ...options.headers
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log(`✅ Railway response status: ${response.status}`);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      console.error(`❌ Railway request failed for ${endpoint}:`, error);
      
      if (error.name === 'AbortError') {
        throw new Error(`Railway server timeout - ${endpoint} not responding after ${this.TIMEOUT}ms`);
      }
      
      // Handle specific CORS and network errors
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Network error - Unable to connect to Railway backend');
      }
      
      throw error;
    }
  }

  // Enhanced Health Check with better error handling
  static async checkServerHealth(): Promise<RailwayResponse> {
    const now = Date.now();
    
    // Return cached result if recent
    if (now - this.lastHealthCheck < this.HEALTH_CHECK_INTERVAL && this.isServerHealthy) {
      return { success: true, data: { status: 'healthy', cached: true } };
    }
    
    try {
      console.log('🔍 Checking Railway server health...');
      
      const response = await this.makeRequest('/health');
      this.lastHealthCheck = now;
      
      if (!response.ok) {
        this.isServerHealthy = false;
        const errorText = await response.text().catch(() => 'Unknown error');
        return { 
          success: false, 
          error: `Railway server error ${response.status}: ${errorText}` 
        };
      }
      
      const data = await response.json();
      this.isServerHealthy = true;
      
      console.log('✅ Railway server is healthy:', data);
      return { success: true, data };
      
    } catch (error) {
      this.lastHealthCheck = now;
      this.isServerHealthy = false;
      
      console.error('❌ Railway health check failed:', error);
      
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Railway server connection failed' 
      };
    }
  }

  // Chat Processing with improved CORS handling
  static async processMessage(message: string, context: any = {}): Promise<RailwayResponse> {
    try {
      // Quick health check first if server was previously unhealthy
      if (!this.isServerHealthy) {
        console.log('🔍 Server was unhealthy, checking health first...');
        const healthCheck = await this.checkServerHealth();
        if (!healthCheck.success) {
          return { 
            success: false, 
            error: `Railway server unavailable: ${healthCheck.error}` 
          };
        }
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      console.log('📤 Sending message to Railway backend...');
      
      const requestBody = {
        message: message.trim(),
        conversation_id: context.conversation_id || null,
        project_context: {
          business_type: context.business_type || user.user_metadata?.business_type || 'unknown',
          industry: context.industry || user.user_metadata?.industry || 'unknown',
          ...context
        },
        metadata: {
          source: 'lovable-frontend',
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          session_id: user.id,
          frontend_url: window.location.origin,
          ...context.metadata
        },
        stream: false
      };

      console.log('📋 Request payload:', { 
        endpoint: '/v1/chat/message',
        messageLength: message.length,
        hasContext: !!context.conversation_id 
      });

      const response = await this.makeRequest('/v1/chat/message', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        this.isServerHealthy = false; // Mark as unhealthy
        
        console.error(`❌ Railway HTTP ${response.status}:`, errorText);
        
        return { 
          success: false, 
          error: `Railway HTTP ${response.status}: ${errorText}` 
        };
      }

      const data = await response.json();
      this.isServerHealthy = true; // Mark as healthy
      
      console.log('✅ Railway backend response received:', {
        hasMessage: !!data.message,
        hasResponse: !!data.response,
        tokensUsed: data.metadata?.tokens_used
      });
      
      return { 
        success: true, 
        data: {
          response: data.message || data.response,
          tokens_used: data.metadata?.tokens_used || 0,
          processing_time: data.processing_time_ms,
          suggested_actions: data.suggested_actions || [],
          emotion_detected: data.intent_analysis?.primary_intent,
          conversation_id: data.conversation_id,
          agents_involved: data.agents_involved || []
        }
      };
      
    } catch (error) {
      this.isServerHealthy = false; // Mark as unhealthy
      
      console.error('❌ Railway message processing failed:', error);
      
      // Enhanced error categorization
      if (error.message.includes('timeout')) {
        return { 
          success: false, 
          error: 'Railway server timeout - Request took too long' 
        };
      }
      
      if (error.message.includes('Network error') || error.message.includes('Failed to fetch')) {
        return { 
          success: false, 
          error: 'Network connection error - Railway server may be down' 
        };
      }
      
      if (error.message.includes('CORS')) {
        return { 
          success: false, 
          error: 'CORS error - Backend configuration issue' 
        };
      }
      
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Railway processing failed' 
      };
    }
  }

  // Get conversation history
  static async getConversations(): Promise<RailwayResponse> {
    try {
      const response = await this.makeRequest('/v1/chat/conversations');
      
      if (!response.ok) {
        return { success: false, error: `Failed to get conversations: ${response.status}` };
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Railway conversations fetch failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Conversations fetch failed' };
    }
  }

  // Get specific conversation
  static async getConversation(conversationId: string): Promise<RailwayResponse> {
    try {
      const response = await this.makeRequest(`/v1/chat/conversations/${conversationId}`);
      
      if (!response.ok) {
        return { success: false, error: `Failed to get conversation: ${response.status}` };
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Railway conversation fetch failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Conversation fetch failed' };
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
        return { success: false, error: `Failed to get completeness: ${response.status}` };
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Railway completeness check failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Completeness check failed' };
    }
  }

  // Business Intelligence
  static async getBusinessInsights(clientId: string): Promise<RailwayResponse> {
    try {
      const response = await this.makeRequest(`/v1/business-intelligence/analyze`);
      
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

  // Agent-specific calls
  static async callAgent(agentName: string, payload: any): Promise<RailwayResponse> {
    try {
      const response = await this.makeRequest(`/v1/agents/${agentName}`, {
        method: 'POST',
        body: JSON.stringify({ payload })
      });
      
      if (!response.ok) {
        return { success: false, error: `Failed to call agent: ${response.status}` };
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Railway agent call failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Agent call failed' };
    }
  }

  // Keep existing methods for backward compatibility
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
    
    // Test health first
    results.health = await this.checkServerHealth();
    
    // Only proceed with other tests if health check passes
    if (results.health.success) {
      try {
        results.messageProcessing = await this.processMessage('مرحبا، كيف يمكنني البدء؟');
        results.conversations = await this.getConversations();
        results.tokenPackages = await this.getTokenPackages();
        results.onboardingQuestions = await this.getOnboardingQuestions();
      } catch (error) {
        console.error('❌ Comprehensive test failed:', error);
        results.testError = { 
          success: false, 
          error: error instanceof Error ? error.message : 'Test suite failed' 
        };
      }
    } else {
      console.warn('⚠️ Skipping additional tests - health check failed');
      results.skipped = { 
        success: false, 
        error: 'Health check failed - skipped remaining tests' 
      };
    }
    
    console.log('🧪 Railway backend test results:', results);
    return results;
  }

  // Server status helper with better diagnostics
  static getServerStatus(): { isHealthy: boolean; lastCheck: number; baseUrl: string } {
    return {
      isHealthy: this.isServerHealthy,
      lastCheck: this.lastHealthCheck,
      baseUrl: this.BASE_URL
    };
  }

  // Test connectivity to Railway backend
  static async testConnectivity(): Promise<RailwayResponse> {
    try {
      console.log('🧪 Testing Railway backend connectivity...');
      
      // Test simple health endpoint first
      const healthResult = await this.checkServerHealth();
      
      if (!healthResult.success) {
        return {
          success: false,
          error: `Health check failed: ${healthResult.error}`
        };
      }

      // Test chat endpoint with a simple message
      const chatResult = await this.processMessage('مرحبا، هذا اختبار اتصال من Lovable');
      
      return {
        success: chatResult.success,
        data: {
          health: healthResult.data,
          chat: chatResult.success ? 'Chat test successful' : chatResult.error,
          baseUrl: this.BASE_URL,
          timestamp: new Date().toISOString()
        },
        error: chatResult.success ? undefined : chatResult.error
      };
      
    } catch (error) {
      console.error('❌ Railway connectivity test failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connectivity test failed'
      };
    }
  }
}
