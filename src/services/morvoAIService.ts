
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
}

export class MorvoAIService {
  private static readonly API_URL = 'https://morvo-production.up.railway.app';
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

  static async healthCheck(): Promise<any> {
    try {
      const response = await fetch(`${this.API_URL}/health`);
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }

  static async getAgents(): Promise<Agent[]> {
    try {
      const response = await fetch(`${this.API_URL}/v1/agents`);
      if (!response.ok) {
        throw new Error(`Failed to fetch agents: ${response.status}`);
      }
      const data = await response.json();
      return data.agents || [];
    } catch (error) {
      console.error('Get agents error:', error);
      return [];
    }
  }

  static async sendMessage(message: string): Promise<ChatResponse> {
    const requestBody: ChatRequest = {
      message: message.trim(),
      client_id: this.getClientId(),
      conversation_id: this.getConversationId()
    };

    console.log('Morvo AI request:', {
      url: `${this.API_URL}/v1/chat/test`,
      body: requestBody
    });

    try {
      const response = await fetch(`${this.API_URL}/v1/chat/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Morvo AI response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Morvo AI error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data: ChatResponse = await response.json();
      console.log('Morvo AI success response:', data);

      // Update conversation ID if provided in response
      if (data.conversation_id && data.conversation_id !== this.conversationId) {
        this.conversationId = data.conversation_id;
        console.log('Updated conversation ID:', this.conversationId);
      }

      return data;
    } catch (error) {
      console.error('Morvo AI service error:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network connection failed. Please check your internet connection.');
      }
      
      throw error;
    }
  }

  static async chatWithAgent(agentId: string, message: string): Promise<ChatResponse> {
    const requestBody: ChatRequest = {
      message: message.trim(),
      client_id: this.getClientId(),
      conversation_id: this.getConversationId()
    };

    console.log('Direct agent chat request:', {
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

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Agent chat error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data: ChatResponse = await response.json();
      console.log('Agent chat success response:', data);

      return data;
    } catch (error) {
      console.error('Agent chat service error:', error);
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
