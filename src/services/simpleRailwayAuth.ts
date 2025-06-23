
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

interface TestResult {
  format: string;
  success: boolean;
  status?: number;
  error?: string;
  response?: any;
  latency: number;
}

export class SimpleRailwayAuth {
  private static readonly API_URL = 'https://morvo-production.up.railway.app';
  private static conversationId: string | null = sessionStorage.getItem('morvo_conversation_id');
  private static lastSuccessfulFormat: string | null = localStorage.getItem('morvo_successful_format');

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

  // Phase 1: Test different request formats systematically
  static async runDiagnosticTests(): Promise<TestResult[]> {
    console.log('🧪 Starting comprehensive diagnostic tests...');
    const token = await this.getAuthToken();
    const results: TestResult[] = [];

    // Test Format 1: Ultra-simplified (third-party suggestion)
    const format1Result = await this.testRequestFormat('ultra-simple', {
      message: 'Test message',
      client_id: this.getClientId(),
      conversation_id: this.conversationId || 'test-conv'
    }, token);
    results.push(format1Result);

    // Test Format 2: Add language and stream params
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

    // Test Format 4: Current format but simplified metadata
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

    console.log('🧪 Diagnostic test results:', results);
    
    // Save successful format for future use
    const successfulTest = results.find(r => r.success);
    if (successfulTest) {
      localStorage.setItem('morvo_successful_format', successfulTest.format);
      this.lastSuccessfulFormat = successfulTest.format;
      console.log('✅ Found working format:', successfulTest.format);
    }

    return results;
  }

  private static async testRequestFormat(
    formatName: string, 
    requestBody: any, 
    token: string | null,
    urlSuffix: string = ''
  ): Promise<TestResult> {
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
          latency
        };
      } else {
        const errorText = await response.text();
        console.error(`❌ Format "${formatName}" failed (${response.status}):`, errorText);
        
        return {
          format: formatName,
          success: false,
          status: response.status,
          error: errorText,
          latency
        };
      }
    } catch (error) {
      const latency = Date.now() - startTime;
      console.error(`❌ Format "${formatName}" error:`, error);
      
      return {
        format: formatName,
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        latency
      };
    }
  }

  // Phase 2: Hybrid solution using successful format
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
      console.log('🚀 Sending message with hybrid approach...');
      
      // Use successful format if known, otherwise try auto-detection
      let requestBody: any;
      let urlSuffix = '';

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
        // Default to basic format
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
        
        // If this format failed, try running diagnostics again
        if (response.status === 422) {
          console.log('🔍 422 error detected, running diagnostics...');
          const diagnosticResults = await this.runDiagnosticTests();
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

  // Enhanced connection test
  static async testConnection(): Promise<boolean> {
    console.log('🔗 Testing connection with multiple formats...');
    
    const diagnosticResults = await this.runDiagnosticTests();
    const successfulTests = diagnosticResults.filter(r => r.success);
    
    if (successfulTests.length > 0) {
      console.log(`✅ Connection successful with ${successfulTests.length} working formats`);
      return true;
    } else {
      console.error('❌ All connection tests failed:', diagnosticResults);
      return false;
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

  static getLastDiagnosticResults(): TestResult[] | null {
    const stored = localStorage.getItem('morvo_last_diagnostic');
    return stored ? JSON.parse(stored) : null;
  }

  static clearDiagnosticCache(): void {
    localStorage.removeItem('morvo_successful_format');
    localStorage.removeItem('morvo_last_diagnostic');
    this.lastSuccessfulFormat = null;
    console.log('🧹 Diagnostic cache cleared');
  }
}
