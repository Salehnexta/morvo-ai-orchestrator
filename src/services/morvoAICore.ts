
import { supabase } from "@/integrations/supabase/client";

interface ChatResponse {
  response: string;
  personality_traits?: any;
  tokens_used: number;
  emotion_detected?: string;
  suggested_actions?: Array<any>;
  processing_time?: number;
  confidence_score?: number;
}

interface ConnectionHealth {
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  lastChecked: Date;
}

export class MorvoAICore {
  private static readonly API_URL = 'https://morvo-production.up.railway.app';
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

      // Use test endpoint as fallback
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
}
