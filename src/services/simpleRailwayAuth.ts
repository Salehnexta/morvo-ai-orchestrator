
import { supabase } from "@/integrations/supabase/client";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface SimpleRailwayResponse {
  message: string;
  conversation_id?: string;
  processing_time_ms?: number;
  tokens_used?: number;
  success: boolean;
  error?: string;
}

export class SimpleRailwayAuth {
  private static readonly API_URL = 'https://morvo-production.up.railway.app';
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

  static async sendMessage(message: string, context?: any): Promise<SimpleRailwayResponse> {
    const token = await this.getAuthToken();
    
    if (!token) {
      return {
        success: false,
        message: '',
        error: 'Authentication required'
      };
    }

    try {
      console.log('🚀 Sending authenticated message to Railway...');
      
      // Fixed request body format to prevent 422 error
      const requestBody = {
        message: message.trim(),
        conversation_id: this.conversationId || `auth-conv-${Date.now()}`,
        language: 'ar',
        stream: false,
        // Remove problematic 'func' parameter that was causing 422
        metadata: {
          client_id: this.getClientId(),
          timestamp: new Date().toISOString(),
          user_context: context || {}
        }
      };

      const response = await fetch(`${this.API_URL}/v1/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Railway API error:', response.status, errorText);
        return {
          success: false,
          message: '',
          error: `Server error: ${response.status}`
        };
      }

      const data = await response.json();
      
      // Save conversation ID for next messages
      if (data.conversation_id) {
        this.conversationId = data.conversation_id;
        sessionStorage.setItem('morvo_conversation_id', data.conversation_id);
      }

      console.log('✅ Railway response received successfully');
      
      return {
        success: true,
        message: data.message || data.response || 'تم استلام رسالتك بنجاح',
        conversation_id: data.conversation_id,
        processing_time_ms: data.processing_time_ms,
        tokens_used: data.tokens_used || 0
      };

    } catch (error) {
      console.error('❌ Railway connection error:', error);
      return {
        success: false,
        message: '',
        error: error instanceof Error ? error.message : 'Connection failed'
      };
    }
  }

  static resetConversation(): void {
    this.conversationId = null;
    sessionStorage.removeItem('morvo_conversation_id');
    console.log('🔄 Conversation reset');
  }

  static getConversationId(): string | null {
    return this.conversationId;
  }
}
