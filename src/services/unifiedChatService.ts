import { RailwayBackendService } from './railwayBackendService';
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

export class UnifiedChatService {
  private static connectionStatus: ChatConnectionStatus = {
    isConnected: false,
    connectionType: 'offline',
    lastCheck: new Date()
  };
  
  private static diagnosticCache: DiagnosticInfo[] = [];
  private static readonly MAX_DIAGNOSTIC_ENTRIES = 50;
  private static fallbackMode = false;
  private static consecutiveFailures = 0;
  private static readonly MAX_FAILURES_BEFORE_FALLBACK = 3;

  static async sendMessage(message: string, context?: any): Promise<UnifiedChatMessage> {
    const startTime = Date.now();
    
    try {
      console.log('🚀 UnifiedChatService: Sending message to Railway backend:', message);
      
      // Check if we should skip Railway due to consecutive failures
      if (this.fallbackMode && this.consecutiveFailures >= this.MAX_FAILURES_BEFORE_FALLBACK) {
        console.warn('⚠️ In fallback mode due to consecutive Railway failures');
        throw new Error('Railway backend in fallback mode');
      }
      
      // Get current user session for authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No authentication token available');
      }

      // Send message via Railway backend
      const response = await RailwayBackendService.processMessage(message, {
        ...context,
        user_metadata: session.user?.user_metadata || {},
        session_id: session.user?.id
      });
      
      const processingTime = Date.now() - startTime;
      
      if (response.success && response.data) {
        // Reset failure count on success
        this.consecutiveFailures = 0;
        this.fallbackMode = false;
        
        // Update connection status
        this.updateConnectionStatus(true, 'authenticated', processingTime);
        
        // Add diagnostic info
        this.addDiagnosticInfo({
          format: 'railway-backend',
          success: true,
          timestamp: new Date().toISOString(),
          endpoint: 'railway-backend',
          status: 'success',
          latency: processingTime,
          tokens_used: response.data.tokens_used
        });
        
        return {
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          content: response.data.response,
          role: 'assistant',
          timestamp: new Date(),
          tokens_used: response.data.tokens_used,
          processing_time: processingTime,
          processing_time_ms: processingTime,
          success: true,
          message: response.data.response,
          conversation_id: `conv-${session.user?.id}-${Date.now()}`,
          confidence_score: 0.95,
          metadata: {
            agents_involved: response.data.suggested_actions || [],
            emotion_detected: response.data.emotion_detected,
            processing_time: response.data.processing_time,
            endpoint: 'railway-backend'
          }
        };
      } else {
        throw new Error(response.error || 'Railway backend request failed');
      }
      
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error('❌ UnifiedChatService: Railway backend error:', error);
      
      // Increment failure count
      this.consecutiveFailures++;
      
      // Enable fallback mode if too many consecutive failures
      if (this.consecutiveFailures >= this.MAX_FAILURES_BEFORE_FALLBACK) {
        this.fallbackMode = true;
        console.warn('⚠️ Enabling fallback mode due to consecutive Railway failures');
      }
      
      // Update connection status
      this.updateConnectionStatus(false, 'offline', processingTime, error instanceof Error ? error.message : 'Unknown error');
      
      // Add diagnostic info
      this.addDiagnosticInfo({
        format: 'railway-backend',
        success: false,
        timestamp: new Date().toISOString(),
        endpoint: 'railway-backend',
        status: 'error',
        latency: processingTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      // Return enhanced fallback response
      return {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: this.generateEnhancedFallbackResponse(message, context, error),
        role: 'assistant',
        timestamp: new Date(),
        processing_time: processingTime,
        processing_time_ms: processingTime,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          isError: true,
          fallbackUsed: true,
          originalError: error instanceof Error ? error.message : 'Unknown error',
          consecutiveFailures: this.consecutiveFailures,
          fallbackMode: this.fallbackMode
        }
      };
    }
  }

  static async testConnection(): Promise<boolean> {
    try {
      console.log('🔗 UnifiedChatService: Testing Railway backend connection...');
      
      const healthResult = await RailwayBackendService.checkServerHealth();
      const isConnected = healthResult.success;
      
      if (isConnected) {
        this.consecutiveFailures = 0;
        this.fallbackMode = false;
      }
      
      this.updateConnectionStatus(
        isConnected, 
        isConnected ? 'authenticated' : 'offline',
        0,
        isConnected ? undefined : healthResult.error
      );
      
      return isConnected;
    } catch (error) {
      console.error('❌ UnifiedChatService: Railway backend connection test failed:', error);
      this.consecutiveFailures++;
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
    this.consecutiveFailures = 0;
    this.fallbackMode = false;
    console.log('🧹 Diagnostic cache cleared and fallback mode reset');
  }

  static async getHealthStatus(): Promise<any> {
    try {
      const result = await RailwayBackendService.checkServerHealth();
      return {
        ...result.data,
        consecutiveFailures: this.consecutiveFailures,
        fallbackMode: this.fallbackMode
      };
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return { 
        status: 'failed', 
        error: error instanceof Error ? error.message : 'Unknown error',
        consecutiveFailures: this.consecutiveFailures,
        fallbackMode: this.fallbackMode
      };
    }
  }

  static async runComprehensiveDiagnostics(): Promise<DiagnosticInfo[]> {
    const diagnostics: DiagnosticInfo[] = [];
    
    try {
      console.log('🔍 Running comprehensive Railway backend diagnostics...');
      
      const startTime = Date.now();
      const healthResult = await RailwayBackendService.checkServerHealth();
      const latency = Date.now() - startTime;
      
      const diagnostic: DiagnosticInfo = {
        format: 'Railway Backend Health',
        success: healthResult.success,
        timestamp: new Date().toISOString(),
        endpoint: 'railway-backend-health',
        status: healthResult.success ? 'success' : 'error',
        latency,
        error: healthResult.success ? undefined : healthResult.error
      };
      
      diagnostics.push(diagnostic);
      this.addDiagnosticInfo(diagnostic);
      
      // Only test message processing if health check passes
      if (healthResult.success) {
        try {
          const testStartTime = Date.now();
          const testResult = await RailwayBackendService.processMessage('مرحبا، هذه رسالة تجريبية');
          const testLatency = Date.now() - testStartTime;
          
          const testDiagnostic: DiagnosticInfo = {
            format: 'Railway Backend Chat',
            success: testResult.success,
            timestamp: new Date().toISOString(),
            endpoint: 'railway-backend-chat',
            status: testResult.success ? 'success' : 'error',
            latency: testLatency,
            tokens_used: testResult.data?.tokens_used,
            error: testResult.success ? undefined : testResult.error
          };
          
          diagnostics.push(testDiagnostic);
          this.addDiagnosticInfo(testDiagnostic);
          
        } catch (testError) {
          const testDiagnostic: DiagnosticInfo = {
            format: 'Railway Backend Chat',
            success: false,
            timestamp: new Date().toISOString(),
            endpoint: 'railway-backend-chat',
            status: 'error',
            latency: 0,
            error: testError instanceof Error ? testError.message : 'Chat test failed'
          };
          
          diagnostics.push(testDiagnostic);
          this.addDiagnosticInfo(testDiagnostic);
        }
      } else {
        // Add skipped test info
        const skippedDiagnostic: DiagnosticInfo = {
          format: 'Railway Backend Chat',
          success: false,
          timestamp: new Date().toISOString(),
          endpoint: 'railway-backend-chat',
          status: 'error',
          latency: 0,
          error: 'Skipped due to failed health check'
        };
        
        diagnostics.push(skippedDiagnostic);
        this.addDiagnosticInfo(skippedDiagnostic);
      }
      
    } catch (error) {
      const diagnostic: DiagnosticInfo = {
        format: 'Railway Backend Diagnostics',
        success: false,
        timestamp: new Date().toISOString(),
        endpoint: 'railway-backend-diagnostics',
        status: 'error',
        latency: 0,
        error: error instanceof Error ? error.message : 'Diagnostics failed'
      };
      
      diagnostics.push(diagnostic);
      this.addDiagnosticInfo(diagnostic);
    }
    
    return diagnostics;
  }

  static generateEnhancedFallbackResponse(message: string, context?: any, error?: any): string {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Determine error type for better user messaging
    let errorType = 'مشكلة تقنية مؤقتة';
    let suggestion = 'يرجى المحاولة مرة أخرى خلال دقائق قليلة.';
    
    if (errorMessage.includes('timeout')) {
      errorType = 'انتهت مهلة الاتصال مع الخادم';
      suggestion = 'الخادم يستغرق وقتاً أطول من المعتاد. يرجى المحاولة مرة أخرى.';
    } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Network')) {
      errorType = 'مشكلة في الاتصال بالشبكة';
      suggestion = 'يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.';
    } else if (errorMessage.includes('CORS')) {
      errorType = 'مشكلة في إعدادات الخادم';
      suggestion = 'يتم العمل على حل هذه المشكلة. النظام يعمل في النمط المحلي حالياً.';
    }

    const baseResponses = [
      `أعتذر، يبدو أن هناك ${errorType} مع خادم Railway الرئيسي.`,
      `نواجه حالياً ${errorType} مع الخادم المركزي.`,
      `هناك ${errorType} مؤقتة مع نظام Railway.`
    ];
    
    const baseResponse = baseResponses[Math.floor(Math.random() * baseResponses.length)];
    const messagePreview = message.substring(0, 50) + (message.length > 50 ? '...' : '');
    
    let response = `${baseResponse}\n\n${suggestion}\n\nبخصوص استفسارك: "${messagePreview}"`;
    
    // Add consecutive failure warning if applicable
    if (this.consecutiveFailures >= this.MAX_FAILURES_BEFORE_FALLBACK) {
      response += `\n\n⚠️ تم تفعيل النمط الاحتياطي بعد ${this.consecutiveFailures} محاولات فاشلة متتالية.`;
    }
    
    // Add helpful context-based suggestions
    if (message.toLowerCase().includes('مرحبا') || message.toLowerCase().includes('hello')) {
      response += '\n\n💡 يمكنني مساعدتك في:\n• تقديم معلومات عامة عن التسويق الرقمي\n• شرح المفاهيم الأساسية\n• تقديم نصائح عملية';
    }
    
    response += '\n\n🔧 إذا استمرت المشكلة، يرجى التواصل مع الدعم الفني.';
    
    return response;
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
    
    if (this.diagnosticCache.length > this.MAX_DIAGNOSTIC_ENTRIES) {
      this.diagnosticCache = this.diagnosticCache.slice(0, this.MAX_DIAGNOSTIC_ENTRIES);
    }
  }

  static resetConversation(): void {
    console.log('🔄 Conversation reset via UnifiedChatService');
  }

  static getConversationId(): string | null {
    return `conv-${Date.now()}`;
  }

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

  static shouldRetryRailway(): boolean {
    return this.consecutiveFailures < this.MAX_FAILURES_BEFORE_FALLBACK && !this.fallbackMode;
  }

  static resetRailwayConnection(): void {
    this.consecutiveFailures = 0;
    this.fallbackMode = false;
    console.log('🔄 Railway connection attempts reset');
  }
}
