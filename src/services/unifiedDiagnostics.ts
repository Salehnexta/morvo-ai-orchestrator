
import { supabase } from "@/integrations/supabase/client";
import { DiagnosticResult, ConnectionStatus, ChatResponse, ChatContextData } from '@/types/chat';

export class UnifiedDiagnostics {
  private static readonly API_URL = 'https://morvo-production.up.railway.app';
  private static conversationId: string | null = sessionStorage.getItem('morvo_conversation_id');
  private static lastSuccessfulFormat: string | null = localStorage.getItem('morvo_successful_format');
  private static diagnosticHistory: DiagnosticResult[] = [];
  private static lastHealthCheck: ConnectionStatus | null = null;

  // Authentication
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

  // Comprehensive diagnostic testing
  static async runComprehensiveDiagnostics(): Promise<DiagnosticResult[]> {
    console.log('🧪 Starting unified comprehensive diagnostics...');
    const token = await this.getAuthToken();
    const results: DiagnosticResult[] = [];

    // Test Format 1: Ultra-simplified
    const format1Result = await this.testRequestFormat('ultra-simple', {
      message: 'Test message',
      client_id: this.getClientId(),
      conversation_id: this.conversationId || 'test-conv'
    }, token);
    results.push(format1Result);

    // Test Format 2: With basic parameters
    const format2Result = await this.testRequestFormat('basic-params', {
      message: 'Test message',
      client_id: this.getClientId(),
      conversation_id: this.conversationId || 'test-conv',
      language: 'ar',
      stream: false
    }, token);
    results.push(format2Result);

    // Test Format 3: With func parameter in URL
    const format3Result = await this.testRequestFormat('with-func-url', {
      message: 'Test message',
      client_id: this.getClientId(),
      conversation_id: this.conversationId || 'test-conv',
      language: 'ar',
      stream: false
    }, token, '?func=chat');
    results.push(format3Result);

    // Test Format 4: Simplified metadata
    const format4Result = await this.testRequestFormat('simplified-metadata', {
      message: 'Test message',
      conversation_id: this.conversationId || 'test-conv',
      language: 'ar',
      stream: false,
      metadata: {
        client_id: this.getClientId(),
        timestamp: new Date().toISOString()
      }
    }, token);
    results.push(format4Result);

    // Save successful format
    const successfulTest = results.find(r => r.success);
    if (successfulTest) {
      localStorage.setItem('morvo_successful_format', successfulTest.format);
      this.lastSuccessfulFormat = successfulTest.format;
      console.log('✅ Found working format:', successfulTest.format);
    }

    // Update diagnostic history
    this.diagnosticHistory = results;
    
    return results;
  }

  private static async testRequestFormat(
    formatName: string, 
    requestBody: any, 
    token: string | null,
    urlSuffix: string = ''
  ): Promise<DiagnosticResult> {
    const startTime = Date.now();
    
    try {
      console.log(`🧪 Testing format "${formatName}":`, requestBody);
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.API_URL}/v1/chat/test${urlSuffix}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(8000)
      });

      const latency = Date.now() - startTime;
      
      if (response.ok) {
        const responseData = await response.json();
        console.log(`✅ Format "${formatName}" succeeded:`, responseData);
        
        return {
          format: formatName,
          success: true,
          status: response.status,
          response: responseData,
          latency,
          timestamp: new Date()
        };
      } else {
        const errorText = await response.text();
        console.error(`❌ Format "${formatName}" failed (${response.status}):`, errorText);
        
        return {
          format: formatName,
          success: false,
          status: response.status,
          error: errorText,
          latency,
          timestamp: new Date()
        };
      }
    } catch (error) {
      const latency = Date.now() - startTime;
      console.error(`❌ Format "${formatName}" error:`, error);
      
      return {
        format: formatName,
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        latency,
        timestamp: new Date()
      };
    }
  }

  // Unified message sending
  static async sendMessage(message: string, context?: ChatContextData): Promise<ChatResponse> {
    const token = await this.getAuthToken();
    
    if (!token) {
      return {
        success: false,
        message: '',
        error: 'Authentication required'
      };
    }

    try {
      console.log('🚀 Sending message with unified approach...');
      
      let requestBody: any;
      let urlSuffix = '';

      // Use successful format if known
      if (this.lastSuccessfulFormat === 'ultra-simple') {
        requestBody = {
          message: message.trim(),
          client_id: this.getClientId(),
          conversation_id: this.conversationId || `auth-conv-${Date.now()}`
        };
      } else if (this.lastSuccessfulFormat === 'with-func-url') {
        requestBody = {
          message: message.trim(),
          client_id: this.getClientId(),
          conversation_id: this.conversationId || `auth-conv-${Date.now()}`,
          language: 'ar',
          stream: false
        };
        urlSuffix = '?func=chat';
      } else if (this.lastSuccessfulFormat === 'simplified-metadata') {
        requestBody = {
          message: message.trim(),
          conversation_id: this.conversationId || `auth-conv-${Date.now()}`,
          language: 'ar',
          stream: false,
          metadata: {
            client_id: this.getClientId(),
            timestamp: new Date().toISOString(),
            user_context: context?.user_profile || {}
          }
        };
      } else {
        requestBody = {
          message: message.trim(),
          client_id: this.getClientId(),
          conversation_id: this.conversationId || `auth-conv-${Date.now()}`,
          language: 'ar',
          stream: false
        };
      }

      const response = await fetch(`${this.API_URL}/v1/chat/message${urlSuffix}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Origin': window.location.origin
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Railway API error:', response.status, errorText);
        
        // Auto-retry with diagnostics on 422 errors
        if (response.status === 422) {
          console.log('🔍 422 error detected, running diagnostics...');
          const diagnosticResults = await this.runComprehensiveDiagnostics();
          const workingFormat = diagnosticResults.find(r => r.success);
          
          if (workingFormat) {
            console.log('🔄 Retrying with working format...');
            return this.sendMessage(message, context);
          }
        }
        
        return {
          success: false,
          message: '',
          error: `Server error: ${response.status}`
        };
      }

      const data = await response.json();
      
      // Save conversation ID
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
        tokens_used: data.tokens_used || 0,
        confidence_score: data.confidence_score
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

  // Connection testing
  static async testConnection(): Promise<boolean> {
    console.log('🔗 Testing connection with unified diagnostics...');
    
    const diagnosticResults = await this.runComprehensiveDiagnostics();
    const successfulTests = diagnosticResults.filter(r => r.success);
    
    if (successfulTests.length > 0) {
      console.log(`✅ Connection successful with ${successfulTests.length} working formats`);
      
      // Update connection status
      this.lastHealthCheck = {
        isConnected: true,
        isHealthy: true,
        lastChecked: new Date(),
        status: 'healthy',
        latency: Math.min(...successfulTests.map(t => t.latency))
      };
      
      return true;
    } else {
      console.error('❌ All connection tests failed:', diagnosticResults);
      
      this.lastHealthCheck = {
        isConnected: false,
        isHealthy: false,
        lastChecked: new Date(),
        status: 'failed',
        error: 'All diagnostic tests failed'
      };
      
      return false;
    }
  }

  // Getters and utilities
  static getConnectionStatus(): ConnectionStatus | null {
    return this.lastHealthCheck;
  }

  static getDiagnosticResults(): DiagnosticResult[] {
    return this.diagnosticHistory;
  }

  static getConversationId(): string | null {
    return this.conversationId;
  }

  static resetConversation(): void {
    this.conversationId = null;
    sessionStorage.removeItem('morvo_conversation_id');
    console.log('🔄 Conversation reset');
  }

  static clearDiagnosticCache(): void {
    localStorage.removeItem('morvo_successful_format');
    this.lastSuccessfulFormat = null;
    this.diagnosticHistory = [];
    console.log('🧹 Diagnostic cache cleared');
  }
}
