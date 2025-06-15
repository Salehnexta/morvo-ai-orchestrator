
interface AgentsBeloResponse {
  message: string;
  conversation_id: string;
  agents_involved: string[];
  intent_analysis: {
    intent: string;
    language: string;
    confidence: number;
  };
  processing_time_ms: number;
  cost_tracking: {
    total_cost: number;
    tokens_used: number;
  };
}

interface AgentsBeloRequest {
  message: string;
  client_id: string;
  conversation_id: string;
}

export class AgentsBeloService {
  private static readonly API_URL = 'https://morvo-production.up.railway.app/v1/agents/master_agent/chat';
  private static clientId: string = '';
  private static conversationId: string = '';

  private static generateId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}_${random}`;
  }

  private static getClientId(): string {
    if (!this.clientId) {
      this.clientId = `client_${this.generateId()}`;
      console.log('Generated client ID:', this.clientId);
    }
    return this.clientId;
  }

  private static getConversationId(): string {
    if (!this.conversationId) {
      this.conversationId = `conv_${this.generateId()}`;
      console.log('Generated conversation ID:', this.conversationId);
    }
    return this.conversationId;
  }

  static async sendMessage(message: string): Promise<AgentsBeloResponse> {
    const requestBody: AgentsBeloRequest = {
      message: message.trim(),
      client_id: this.getClientId(),
      conversation_id: this.getConversationId()
    };

    console.log('AgentsBelo API request:', {
      url: this.API_URL,
      body: requestBody
    });

    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('AgentsBelo API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AgentsBelo API error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data: AgentsBeloResponse = await response.json();
      console.log('AgentsBelo API success response:', data);

      // Update conversation ID if provided in response
      if (data.conversation_id && data.conversation_id !== this.conversationId) {
        this.conversationId = data.conversation_id;
        console.log('Updated conversation ID:', this.conversationId);
      }

      return data;
    } catch (error) {
      console.error('AgentsBelo service error:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network connection failed. Please check your internet connection.');
      }
      
      throw error;
    }
  }

  static resetConversation(): void {
    this.conversationId = '';
    console.log('Conversation reset - new conversation will be created');
  }

  static getConversationInfo() {
    return {
      clientId: this.clientId,
      conversationId: this.conversationId
    };
  }
}
