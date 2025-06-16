
import { supabase } from "@/integrations/supabase/client";

interface ChatResponse {
  message: string;
  agents_involved: string[];
  conversation_id: string;
  message_id: string;
  processing_time: number;
  confidence_score: number;
  cost_tracking: {
    total_cost: number;
  };
}

interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'busy' | 'offline';
  capabilities?: string[];
  avatar?: string;
  specialization?: string;
}

interface ChatRequest {
  message: string;
  client_id: string;
  conversation_id?: string;
  profile_context?: any;
}

export class MorvoAIService {
  private static readonly API_URL = 'https://morvo-production.up.railway.app';
  private static conversationId: string = '';

  private static generateId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}_${random}`;
  }

  private static async getClientId(): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.id) {
      return session.user.id;
    }
    throw new Error('User not authenticated');
  }

  private static getConversationId(): string {
    if (!this.conversationId) {
      this.conversationId = `conv_${this.generateId()}`;
      console.log('Generated conversation ID:', this.conversationId);
    }
    return this.conversationId;
  }

  static async healthCheck(): Promise<any> {
    try {
      console.log('Checking Railway health at:', `${this.API_URL}/health`);
      const response = await fetch(`${this.API_URL}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Railway health check response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Railway health check successful:', data);
      return data;
    } catch (error) {
      console.error('Railway health check error:', error);
      throw error;
    }
  }

  static async getAgents(): Promise<Agent[]> {
    try {
      console.log('Fetching agents from Railway:', `${this.API_URL}/v1/agents`);
      const response = await fetch(`${this.API_URL}/v1/agents`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Railway agents response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch agents: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Railway agents data:', data);
      return data.agents || [];
    } catch (error) {
      console.error('Get agents error:', error);
      return [];
    }
  }

  static async sendMessage(message: string, profileContext?: any): Promise<ChatResponse> {
    const clientId = await this.getClientId();
    
    // Get user profile if not provided
    if (!profileContext) {
      try {
        const { data: profile } = await supabase
          .from('customer_profiles')
          .select('*')
          .eq('customer_id', clientId)
          .single();
        profileContext = profile;
      } catch (error) {
        console.log('No profile found, continuing without profile context');
      }
    }

    const requestBody: ChatRequest = {
      message: message.trim(),
      client_id: clientId,
      conversation_id: this.getConversationId(),
      profile_context: profileContext
    };

    console.log('Sending message to Railway:', {
      url: `${this.API_URL}/v1/chat`,
      body: requestBody
    });

    try {
      const response = await fetch(`${this.API_URL}/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Railway chat response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Railway chat error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data: ChatResponse = await response.json();
      console.log('Railway chat success response:', data);

      // Update conversation ID if provided in response
      if (data.conversation_id && data.conversation_id !== this.conversationId) {
        this.conversationId = data.conversation_id;
        console.log('Updated conversation ID from Railway:', this.conversationId);
      }

      return data;
    } catch (error) {
      console.error('Railway service error:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('فشل الاتصال بالشبكة. يرجى التحقق من اتصال الإنترنت.');
      }
      
      throw error;
    }
  }

  static async chatWithAgent(agentId: string, message: string): Promise<ChatResponse> {
    const clientId = await this.getClientId();

    const requestBody: ChatRequest = {
      message: message.trim(),
      client_id: clientId,
      conversation_id: this.getConversationId()
    };

    console.log('Direct agent chat request to Railway:', {
      url: `${this.API_URL}/v1/agents/${agentId}/chat`,
      body: requestBody
    });

    try {
      const response = await fetch(`${this.API_URL}/v1/agents/${agentId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Railway agent chat response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Railway agent chat error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data: ChatResponse = await response.json();
      console.log('Railway agent chat success response:', data);

      return data;
    } catch (error) {
      console.error('Railway agent chat service error:', error);
      throw error;
    }
  }

  static resetConversation(): void {
    this.conversationId = '';
    console.log('Conversation reset - new conversation will be created');
  }

  static getConversationInfo() {
    return {
      clientId: this.getClientId(),
      conversationId: this.conversationId
    };
  }

  static async testRailwayConnection(): Promise<boolean> {
    try {
      console.log('Testing Railway connection...');
      
      const healthResponse = await this.healthCheck();
      console.log('✅ Railway Health Check passed:', healthResponse);
      
      const agents = await this.getAgents();
      console.log('✅ Railway Agents fetched:', agents.length, 'agents');
      
      const testMessage = "مرحبا، هذا اختبار اتصال";
      const chatResponse = await this.sendMessage(testMessage);
      console.log('✅ Railway Chat test passed:', chatResponse);
      
      return true;
    } catch (error) {
      console.error('❌ Railway connection test failed:', error);
      return false;
    }
  }
}
