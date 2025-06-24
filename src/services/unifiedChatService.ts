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

  // Circuit Breaker Implementation
  private static circuitBreaker = {
    isOpen: false,
    failureCount: 0,
    lastFailureTime: 0,
    readonly timeout: 30000, // 30 seconds
    readonly threshold: 5
  };

  // Performance Metrics
  private static performanceMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    lastResponseTime: 0
  };

  private static async checkCircuitBreaker(): Promise<boolean> {
    if (!this.circuitBreaker.isOpen) return true;
    
    // Check if timeout has passed
    if (Date.now() - this.circuitBreaker.lastFailureTime > this.circuitBreaker.timeout) {
      console.log('🔄 Circuit breaker timeout passed, attempting to close...');
      this.circuitBreaker.isOpen = false;
      this.circuitBreaker.failureCount = 0;
      return true;
    }
    
    console.log('🔐 Circuit breaker is open, skipping Railway request');
    return false;
  }

  private static recordFailure(): void {
    this.circuitBreaker.failureCount++;
    this.circuitBreaker.lastFailureTime = Date.now();
    
    if (this.circuitBreaker.failureCount >= this.circuitBreaker.threshold) {
      this.circuitBreaker.isOpen = true;
      console.warn('🚫 Circuit breaker opened due to repeated failures');
    }
  }

  private static recordSuccess(): void {
    this.circuitBreaker.failureCount = 0;
    this.circuitBreaker.isOpen = false;
  }

  static getPerformanceMetrics() {
    return {
      ...this.performanceMetrics,
      successRate: this.performanceMetrics.totalRequests > 0 
        ? (this.performanceMetrics.successfulRequests / this.performanceMetrics.totalRequests) * 100 
        : 0,
      circuitBreakerStatus: this.circuitBreaker.isOpen ? 'open' : 'closed',
      circuitBreakerFailures: this.circuitBreaker.failureCount
    };
  }

  private static updateMetrics(success: boolean, responseTime: number): void {
    this.performanceMetrics.totalRequests++;
    this.performanceMetrics.lastResponseTime = responseTime;
    
    if (success) {
      this.performanceMetrics.successfulRequests++;
    } else {
      this.performanceMetrics.failedRequests++;
    }
    
    // Update average response time
    const total = this.performanceMetrics.successfulRequests + this.performanceMetrics.failedRequests;
    this.performanceMetrics.averageResponseTime = 
      (this.performanceMetrics.averageResponseTime * (total - 1) + responseTime) / total;
  }

  static async sendMessage(message: string, context?: any): Promise<UnifiedChatMessage> {
    const startTime = Date.now();
    
    try {
      console.log('🚀 UnifiedChatService: Sending message to Railway backend:', {
        messagePreview: message.substring(0, 50),
        hasContext: !!context,
        baseUrl: 'https://morvo-production.up.railway.app'
      });
      
      // Check circuit breaker before making request
      const canProceed = await this.checkCircuitBreaker();
      if (!canProceed) {
        console.warn('⚠️ Circuit breaker is open - using fallback mode');
        throw new Error('Circuit breaker is open - service temporarily unavailable');
      }
      
      // Check if we should skip Railway due to consecutive failures
      if (this.fallbackMode && this.consecutiveFailures >= this.MAX_FAILURES_BEFORE_FALLBACK) {
        console.warn('⚠️ In fallback mode due to consecutive Railway failures');
        throw new Error('Railway backend in fallback mode - too many consecutive failures');
      }
      
      // Get current user session for authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No authentication token available');
      }

      // Send message via Railway backend with enhanced context
      const enhancedContext = {
        ...context,
        user_metadata: session.user?.user_metadata || {},
        session_id: session.user?.id,
        frontend_origin: window.location.origin,
        lovable_domain: 'https://d91bae1e-ac01-4697-8921-bf9fd4aecaf6.lovableproject.com'
      };

      console.log('📋 Enhanced context for Railway:', {
        hasUserMetadata: !!enhancedContext.user_metadata,
        sessionId: enhancedContext.session_id,
        frontendOrigin: enhancedContext.frontend_origin
      });

      const response = await RailwayBackendService.processMessage(message, enhancedContext);
      
      const processingTime = Date.now() - startTime;
      
      if (response.success && response.data) {
        // Record success for circuit breaker and metrics
        this.recordSuccess();
        this.consecutiveFailures = 0;
        this.fallbackMode = false;
        this.updateMetrics(true, processingTime);
        
        // Update connection status
        this.updateConnectionStatus(true, 'authenticated', processingTime);
        
        // Add diagnostic info
        this.addDiagnosticInfo({
          format: 'Railway Backend - Success',
          success: true,
          timestamp: new Date().toISOString(),
          endpoint: 'https://morvo-production.up.railway.app/v1/chat/message',
          status: 'success',
          latency: processingTime,
          tokens_used: response.data.tokens_used,
          response_size: JSON.stringify(response.data).length
        });
        
        console.log('✅ Railway backend success:', {
          processingTime,
          tokensUsed: response.data.tokens_used,
          responseLength: response.data.response?.length
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
          conversation_id: response.data.conversation_id || `conv-${session.user?.id}-${Date.now()}`,
          confidence_score: 0.95,
          metadata: {
            agents_involved: response.data.agents_involved || [],
            emotion_detected: response.data.emotion_detected,
            processing_time: response.data.processing_time,
            endpoint: 'railway-backend',
            railway_success: true
          }
        };
      } else {
        throw new Error(response.error || 'Railway backend request failed');
      }
      
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error('❌ UnifiedChatService: Railway backend error:', error);
      
      // Record failure for circuit breaker and metrics
      this.recordFailure();
      this.consecutiveFailures++;
      this.updateMetrics(false, processingTime);
      
      // Enable fallback mode if too many consecutive failures
      if (this.consecutiveFailures >= this.MAX_FAILURES_BEFORE_FALLBACK) {
        this.fallbackMode = true;
        console.warn(`⚠️ Enabling fallback mode due to ${this.consecutiveFailures} consecutive Railway failures`);
      }
      
      // Categorize error for better user messaging
      let errorCategory = 'unknown';
      let userFriendlyMessage = 'مشكلة تقنية مع خادم Railway';
      
      if (error instanceof Error) {
        if (error.message.includes('Circuit breaker is open')) {
          errorCategory = 'circuit_breaker';
          userFriendlyMessage = 'الخدمة متوقفة مؤقتاً للصيانة - سيتم استئنافها قريباً';
        } else if (error.message.includes('timeout')) {
          errorCategory = 'timeout';
          userFriendlyMessage = 'انتهت مهلة الاتصال مع خادم Railway';
        } else if (error.message.includes('Network error') || error.message.includes('Failed to fetch')) {
          errorCategory = 'network';
          userFriendlyMessage = 'مشكلة في الاتصال بالشبكة مع Railway';
        } else if (error.message.includes('CORS')) {
          errorCategory = 'cors';
          userFriendlyMessage = 'مشكلة في إعدادات CORS مع Railway';
        } else if (error.message.includes('authentication')) {
          errorCategory = 'auth';
          userFriendlyMessage = 'مشكلة في المصادقة مع Railway';
        }
      }
      
      // Update connection status
      this.updateConnectionStatus(false, 'offline', processingTime, error instanceof Error ? error.message : 'Unknown error');
      
      // Add diagnostic info
      this.addDiagnosticInfo({
        format: 'Railway Backend - Error',
        success: false,
        timestamp: new Date().toISOString(),
        endpoint: 'https://morvo-production.up.railway.app/v1/chat/message',
        status: 'error',
        latency: processingTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      // Return enhanced fallback response
      return {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: this.generateEnhancedFallbackResponse(message, context, error, errorCategory),
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
          errorCategory,
          consecutiveFailures: this.consecutiveFailures,
          fallbackMode: this.fallbackMode,
          railway_failed: true,
          circuitBreakerOpen: this.circuitBreaker.isOpen
        }
      };
    }
  }

  static async performHealthCheck(): Promise<{
    railway: boolean;
    supabase: boolean;
    overall: boolean;
    details: any;
  }> {
    const results = {
      railway: false,
      supabase: false,
      overall: false,
      details: {} as any
    };

    try {
      // Check Railway health
      const railwayHealth = await RailwayBackendService.checkServerHealth();
      results.railway = railwayHealth.success;
      results.details.railway = railwayHealth;

      // Check Supabase connection
      const { data, error } = await supabase.auth.getSession();
      results.supabase = !error && !!data.session;
      results.details.supabase = { hasSession: !!data.session, error };

      // Check circuit breaker status
      results.details.circuitBreaker = {
        isOpen: this.circuitBreaker.isOpen,
        failureCount: this.circuitBreaker.failureCount,
        lastFailureTime: this.circuitBreaker.lastFailureTime
      };

      results.overall = results.railway && results.supabase && !this.circuitBreaker.isOpen;
      
      console.log('🏥 Health check results:', results);
      return results;
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return results;
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
        this.recordSuccess();
      } else {
        this.recordFailure();
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
      this.recordFailure();
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
    // Reset circuit breaker
    this.circuitBreaker.isOpen = false;
    this.circuitBreaker.failureCount = 0;
    this.circuitBreaker.lastFailureTime = 0;
    console.log('🧹 Diagnostic cache cleared, fallback mode reset, and circuit breaker reset');
  }

  static async getHealthStatus(): Promise<any> {
    try {
      const result = await RailwayBackendService.checkServerHealth();
      return {
        ...result.data,
        consecutiveFailures: this.consecutiveFailures,
        fallbackMode: this.fallbackMode,
        circuitBreaker: {
          isOpen: this.circuitBreaker.isOpen,
          failureCount: this.circuitBreaker.failureCount,
          lastFailureTime: this.circuitBreaker.lastFailureTime
        },
        performance: this.getPerformanceMetrics()
      };
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return { 
        status: 'failed', 
        error: error instanceof Error ? error.message : 'Unknown error',
        consecutiveFailures: this.consecutiveFailures,
        fallbackMode: this.fallbackMode,
        circuitBreaker: {
          isOpen: this.circuitBreaker.isOpen,
          failureCount: this.circuitBreaker.failureCount,
          lastFailureTime: this.circuitBreaker.lastFailureTime
        },
        performance: this.getPerformanceMetrics()
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
      
      // Only test message processing if health check passes and circuit breaker is closed
      if (healthResult.success && !this.circuitBreaker.isOpen) {
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
        const skippedReason = this.circuitBreaker.isOpen ? 'Circuit breaker is open' : 'Health check failed';
        const skippedDiagnostic: DiagnosticInfo = {
          format: 'Railway Backend Chat',
          success: false,
          timestamp: new Date().toISOString(),
          endpoint: 'railway-backend-chat',
          status: 'error',
          latency: 0,
          error: `Skipped due to: ${skippedReason}`
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

  static generateEnhancedFallbackResponse(message: string, context?: any, error?: any, errorCategory: string = 'unknown'): string {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    let errorType = 'مشكلة تقنية مؤقتة';
    let suggestion = 'يرجى المحاولة مرة أخرى خلال دقائق قليلة.';
    let technicalNote = '';
    
    switch (errorCategory) {
      case 'circuit_breaker':
        errorType = 'الخدمة متوقفة مؤقتاً للصيانة';
        suggestion = 'سيتم استئناف الخدمة خلال 30 ثانية. يرجى الانتظار قليلاً.';
        technicalNote = 'تم تفعيل آلية الحماية من الأخطاء المتكررة.';
        break;
      case 'timeout':
        errorType = 'انتهت مهلة الاتصال مع خادم Railway';
        suggestion = 'الخادم يستغرق وقتاً أطول من المعتاد. يرجى المحاولة مرة أخرى.';
        technicalNote = 'الطلب استغرق أكثر من 15 ثانية.';
        break;
      case 'network':
        errorType = 'مشكلة في الاتصال بالشبكة';
        suggestion = 'يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.';
        technicalNote = 'لا يمكن الوصول إلى خادم Railway.';
        break;
      case 'cors':
        errorType = 'مشكلة في إعدادات الخادم (CORS)';
        suggestion = 'يتم العمل على حل هذه المشكلة. النظام يعمل في النمط المحلي حالياً.';
        technicalNote = 'إعدادات CORS تحتاج تحديث على الخادم.';
        break;
      case 'auth':
        errorType = 'مشكلة في المصادقة';
        suggestion = 'يرجى إعادة تسجيل الدخول أو تحديث الصفحة.';
        technicalNote = 'رمز المصادقة غير صالح أو منتهي الصلاحية.';
        break;
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

    // Add context-aware suggestions
    if (context?.business_type) {
      response += `\n\n💡 بما أنك في مجال ${context.business_type}، يمكنني مساعدتك في:`;
      
      switch (context.business_type.toLowerCase()) {
        case 'ecommerce':
          response += '\n• تحسين مبيعات المتجر الإلكتروني\n• استراتيجيات التسويق الرقمي\n• تحسين تجربة المستخدم';
          break;
        case 'restaurant':
          response += '\n• تسويق المطاعم عبر وسائل التواصل\n• إدارة السمعة الرقمية\n• استراتيجيات الولاء';
          break;
        case 'consulting':
          response += '\n• بناء العلامة التجارية\n• استراتيجيات المحتوى\n• التسويق عبر الشبكات المهنية';
          break;
        case 'technology':
          response += '\n• تسويق المنتجات التقنية\n• استراتيجيات B2B\n• بناء المجتمعات التقنية';
          break;
        default:
          response += '\n• استراتيجيات التسويق الرقمي\n• تحسين العلامة التجارية\n• إدارة وسائل التواصل الاجتماعي';
      }
    }

    // Add time-based suggestions
    const hour = new Date().getHours();
    if (hour < 12) {
      response += '\n\n🌅 صباح الخير! يمكنني مساعدتك في بدء يومك بخطط تسويقية فعالة.';
    } else if (hour < 18) {
      response += '\n\n☀️ وقت مثالي لتحليل أداء حملاتك التسويقية وتحسينها.';
    } else {
      response += '\n\n🌙 مساء الخير! يمكنني مساعدتك في تخطيط استراتيجيات الغد.';
    }
    
    // Add helpful context-based suggestions
    if (message.toLowerCase().includes('مرحبا') || message.toLowerCase().includes('hello')) {
      response += '\n\n💡 يمكنني مساعدتك في:\n• تقديم معلومات عامة عن التسويق الرقمي\n• شرح المفاهيم الأساسية\n• تقديم نصائح عملية';
    }
    
    // Add technical note for debugging
    if (technicalNote) {
      response += `\n\n🔧 ملاحظة تقنية: ${technicalNote}`;
    }
    
    response += '\n\n📧 إذا استمرت المشكلة، يرجى التواصل مع الدعم الفني.';
    
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
    return this.consecutiveFailures < this.MAX_FAILURES_BEFORE_FALLBACK && !this.fallbackMode && !this.circuitBreaker.isOpen;
  }

  static resetRailwayConnection(): void {
    this.consecutiveFailures = 0;
    this.fallbackMode = false;
    this.circuitBreaker.isOpen = false;
    this.circuitBreaker.failureCount = 0;
    this.circuitBreaker.lastFailureTime = 0;
    console.log('🔄 Railway connection attempts reset and circuit breaker reset');
  }
}
