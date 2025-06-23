import { MorvoAICore } from './morvoAICore';
import { supabase } from '@/integrations/supabase/client';

export interface UnifiedChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  tokens_used?: number;
  processing_time?: number;
  processing_time_ms?: number;
  metadata?: any;
  success?: boolean;
  message?: string;
  error?: string;
  conversation_id?: string;
  confidence_score?: number;
}

export interface ChatConnectionStatus {
  isConnected: boolean;
  connectionType: 'authenticated' | 'test' | 'offline';
  lastCheck: Date;
  latency?: number;
  error?: string;
  status?: 'healthy' | 'degraded' | 'failed';
}

export interface DiagnosticInfo {
  format: string;
  success: boolean;
  timestamp: string;
  endpoint: string;
  status: 'success' | 'error' | 'timeout';
  latency?: number;
  error?: string;
  response_size?: number;
  tokens_used?: number;
}

export interface ConnectionTestResult {
  name: string;
  endpoint: string;
  body: any;
  timeout: number;
}

export class UnifiedChatService {
  private static connectionStatus: ChatConnectionStatus = {
    isConnected: false,
    connectionType: 'offline',
    lastCheck: new Date()
  };
  
  private static diagnosticCache: DiagnosticInfo[] = [];
  private static readonly MAX_DIAGNOSTIC_ENTRIES = 50;

  static async sendMessage(message: string, context?: any): Promise<UnifiedChatMessage> {
    const startTime = Date.now();
    
    try {
      console.log('🚀 UnifiedChatService: Sending message:', message);
      
      const response = await MorvoAICore.processMessage(message, context);
      const processingTime = Date.now() - startTime;
      
      // Update connection status
      this.updateConnectionStatus(true, 'test', processingTime);
      
      // Add diagnostic info
      this.addDiagnosticInfo({
        format: 'morvo-ai-core',
        success: true,
        timestamp: new Date().toISOString(),
        endpoint: 'morvo-ai-core',
        status: 'success',
        latency: processingTime,
        tokens_used: response.tokens_used
      });
      
      return {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: response.response,
        role: 'assistant',
        timestamp: new Date(),
        tokens_used: response.tokens_used,
        processing_time: processingTime,
        processing_time_ms: processingTime,
        success: true,
        message: response.response,
        conversation_id: MorvoAICore.getConversationId(),
        confidence_score: response.confidence_score,
        metadata: {
          personality_traits: response.personality_traits,
          emotion_detected: response.emotion_detected,
          suggested_actions: response.suggested_actions,
          confidence_score: response.confidence_score
        }
      };
      
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error('❌ UnifiedChatService: Error sending message:', error);
      
      // Update connection status
      this.updateConnectionStatus(false, 'offline', processingTime, error instanceof Error ? error.message : 'Unknown error');
      
      // Add diagnostic info
      this.addDiagnosticInfo({
        format: 'morvo-ai-core',
        success: false,
        timestamp: new Date().toISOString(),
        endpoint: 'morvo-ai-core',
        status: 'error',
        latency: processingTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      return {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: 'حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.',
        role: 'assistant',
        timestamp: new Date(),
        processing_time: processingTime,
        processing_time_ms: processingTime,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          isError: true
        }
      };
    }
  }

  static async testConnection(): Promise<boolean> {
    try {
      console.log('🔗 UnifiedChatService: Testing connection...');
      
      const isConnected = await MorvoAICore.testConnection();
      
      this.updateConnectionStatus(
        isConnected, 
        isConnected ? 'test' : 'offline',
        0,
        isConnected ? undefined : 'Connection test failed'
      );
      
      return isConnected;
    } catch (error) {
      console.error('❌ UnifiedChatService: Connection test failed:', error);
      this.updateConnectionStatus(false, 'offline', 0, error instanceof Error ? error.message : 'Connection test failed');
      return false;
    }
  }

  static getConnectionStatus(): ChatConnectionStatus {
    return { ...this.connectionStatus };
  }

  static getDiagnosticInfo(): DiagnosticInfo[] {
    return [...this.diagnosticCache];
  }

  static getDiagnosticResults(): DiagnosticInfo[] {
    return [...this.diagnosticCache];
  }

  static clearDiagnosticCache(): void {
    this.diagnosticCache = [];
    console.log('🧹 Diagnostic cache cleared');
  }

  static async getHealthStatus(): Promise<any> {
    try {
      return await MorvoAICore.healthCheck();
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return { status: 'failed', error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  static async runComprehensiveDiagnostics(): Promise<DiagnosticInfo[]> {
    const diagnostics: DiagnosticInfo[] = [];
    const testConfigs = this.getTestConfigurations();

    for (const config of testConfigs) {
      const startTime = Date.now();
      
      try {
        console.log(`🔍 Testing ${config.name}...`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.timeout);
        
        const response = await fetch(config.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(config.body),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        const latency = Date.now() - startTime;
        
        const diagnostic: DiagnosticInfo = {
          format: config.name,
          success: response.ok,
          timestamp: new Date().toISOString(),
          endpoint: config.name,
          status: response.ok ? 'success' : 'error',
          latency,
          response_size: parseInt(response.headers.get('content-length') || '0')
        };
        
        if (!response.ok) {
          diagnostic.error = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        diagnostics.push(diagnostic);
        this.addDiagnosticInfo(diagnostic);
        
      } catch (error) {
        const latency = Date.now() - startTime;
        
        const diagnostic: DiagnosticInfo = {
          format: config.name,
          success: false,
          timestamp: new Date().toISOString(),
          endpoint: config.name,
          status: error instanceof Error && error.name === 'AbortError' ? 'timeout' : 'error',
          latency,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
        
        diagnostics.push(diagnostic);
        this.addDiagnosticInfo(diagnostic);
      }
    }
    
    return diagnostics;
  }

  static generateSmartFallbackResponse(message: string, context?: any): string {
    // Simple fallback response generation
    const responses = [
      'أعتذر، يبدو أن هناك مشكلة تقنية مؤقتة. يمكنني مساعدتك بطريقة أخرى.',
      'نظراً للمشكلة التقنية الحالية، دعني أقدم لك بعض الاقتراحات العامة حول استفسارك.',
      'أواجه صعوبة في الاتصال بالخادم حالياً، لكنني سأحاول مساعدتك بناءً على خبرتي.'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)] + 
           ` بخصوص "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`;
  }

  private static updateConnectionStatus(
    isConnected: boolean, 
    connectionType: 'authenticated' | 'test' | 'offline',
    latency?: number,
    error?: string
  ): void {
    this.connectionStatus = {
      isConnected,
      connectionType,
      lastCheck: new Date(),
      latency,
      error,
      status: isConnected ? 'healthy' : 'failed'
    };
    
    console.log('📊 Connection status updated:', this.connectionStatus);
  }

  private static addDiagnosticInfo(info: DiagnosticInfo): void {
    this.diagnosticCache.unshift(info);
    
    // Keep only the latest entries
    if (this.diagnosticCache.length > this.MAX_DIAGNOSTIC_ENTRIES) {
      this.diagnosticCache = this.diagnosticCache.slice(0, this.MAX_DIAGNOSTIC_ENTRIES);
    }
  }

  // Conversation management
  static resetConversation(): void {
    MorvoAICore.resetConversation();
    console.log('🔄 Conversation reset via UnifiedChatService');
  }

  static getConversationId(): string | null {
    return MorvoAICore.getConversationId();
  }

  // Test configurations for diagnostic purposes
  static getTestConfigurations(): ConnectionTestResult[] {
    return [
      {
        name: 'Morvo AI Test Endpoint',
        endpoint: 'https://morvo-production.up.railway.app/v1/chat/test',
        body: {
          message: 'Connection test',
          client_id: `test-${Date.now()}`,
          conversation_id: 'test-connection'
        },
        timeout: 30000
      },
      {
        name: 'Morvo AI Health Check',
        endpoint: 'https://morvo-production.up.railway.app/health',
        body: {},
        timeout: 10000
      }
    ];
  }

  // User authentication check
  static async getCurrentUser(): Promise<any> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('❌ Error getting current user:', error);
        return null;
      }
      return user;
    } catch (error) {
      console.error('❌ Unexpected error getting user:', error);
      return null;
    }
  }

  // Session management
  static async getSession(): Promise<any> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('❌ Error getting session:', error);
        return null;
      }
      return session;
    } catch (error) {
      console.error('❌ Unexpected error getting session:', error);
      return null;
    }
  }
}
