
// 🎯 خدمة الشات الموحدة - تدمج جميع الخدمات في مكان واحد
import { supabase } from "@/integrations/supabase/client";
import type { 
  UnifiedDiagnosticResult, 
  UnifiedConnectionStatus, 
  UnifiedChatResponse,
  UnifiedChatContextData,
  UnifiedChatMessage
} from '@/types/unifiedChat';

export class UnifiedChatService {
  private static readonly API_URL = 'https://morvo-production.up.railway.app';
  private static conversationId: string | null = sessionStorage.getItem('morvo_conversation_id');
  private static lastSuccessfulFormat: string | null = localStorage.getItem('morvo_successful_format');
  private static diagnosticHistory: UnifiedDiagnosticResult[] = [];
  private static lastHealthCheck: UnifiedConnectionStatus | null = null;

  // === المصادقة ===
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
      clientId = `unified-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('morvo_client_id', clientId);
    }
    return clientId;
  }

  // === التشخيص الشامل ===
  static async runComprehensiveDiagnostics(): Promise<UnifiedDiagnosticResult[]> {
    console.log('🧪 Starting unified comprehensive diagnostics...');
    const token = await this.getAuthToken();
    const results: UnifiedDiagnosticResult[] = [];

    // اختبار التنسيق البسيط
    const simpleResult = await this.testRequestFormat('simple', {
      message: 'Test message',
      client_id: this.getClientId(),
      conversation_id: this.conversationId || 'test-conv'
    }, token);
    results.push(simpleResult);

    // اختبار مع معاملات أساسية
    const basicResult = await this.testRequestFormat('basic', {
      message: 'Test message',
      client_id: this.getClientId(),
      conversation_id: this.conversationId || 'test-conv',
      language: 'ar',
      stream: false
    }, token);
    results.push(basicResult);

    // اختبار مع func في URL
    const funcResult = await this.testRequestFormat('func-url', {
      message: 'Test message',
      client_id: this.getClientId(),
      conversation_id: this.conversationId || 'test-conv',
      language: 'ar',
      stream: false
    }, token, '?func=chat');
    results.push(funcResult);

    // حفظ التنسيق الناجح
    const successfulTest = results.find(r => r.success);
    if (successfulTest) {
      localStorage.setItem('morvo_successful_format', successfulTest.format);
      this.lastSuccessfulFormat = successfulTest.format;
      console.log('✅ Found working format:', successfulTest.format);
    }

    this.diagnosticHistory = results;
    return results;
  }

  private static async testRequestFormat(
    formatName: string, 
    requestBody: any, 
    token: string | null,
    urlSuffix: string = ''
  ): Promise<UnifiedDiagnosticResult> {
    const startTime = Date.now();
    
    try {
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
      return {
        format: formatName,
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        latency,
        timestamp: new Date()
      };
    }
  }

  // === إرسال الرسائل ===
  static async sendMessage(message: string, context?: UnifiedChatContextData): Promise<UnifiedChatResponse> {
    const token = await this.getAuthToken();
    
    if (!token) {
      return {
        success: false,
        message: '',
        error: 'Authentication required'
      };
    }

    try {
      console.log('🚀 Sending message with unified service...');
      
      let requestBody: any;
      let urlSuffix = '';

      // استخدام التنسيق الناجح المحفوظ
      if (this.lastSuccessfulFormat === 'simple') {
        requestBody = {
          message: message.trim(),
          client_id: this.getClientId(),
          conversation_id: this.conversationId || `unified-conv-${Date.now()}`
        };
      } else if (this.lastSuccessfulFormat === 'func-url') {
        requestBody = {
          message: message.trim(),
          client_id: this.getClientId(),
          conversation_id: this.conversationId || `unified-conv-${Date.now()}`,
          language: 'ar',
          stream: false
        };
        urlSuffix = '?func=chat';
      } else {
        requestBody = {
          message: message.trim(),
          client_id: this.getClientId(),
          conversation_id: this.conversationId || `unified-conv-${Date.now()}`,
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
        console.error('❌ API error:', response.status, errorText);
        
        // إعادة المحاولة مع التشخيص عند خطأ 422
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
      
      // حفظ معرف المحادثة
      if (data.conversation_id) {
        this.conversationId = data.conversation_id;
        sessionStorage.setItem('morvo_conversation_id', data.conversation_id);
      }

      console.log('✅ Unified response received successfully');
      
      return {
        success: true,
        message: data.message || data.response || 'تم استلام رسالتك بنجاح',
        conversation_id: data.conversation_id,
        processing_time_ms: data.processing_time_ms,
        tokens_used: data.tokens_used || 0,
        confidence_score: data.confidence_score
      };

    } catch (error) {
      console.error('❌ Connection error:', error);
      return {
        success: false,
        message: '',
        error: error instanceof Error ? error.message : 'Connection failed'
      };
    }
  }

  // === اختبار الاتصال ===
  static async testConnection(): Promise<boolean> {
    console.log('🔗 Testing connection...');
    
    const diagnosticResults = await this.runComprehensiveDiagnostics();
    const successfulTests = diagnosticResults.filter(r => r.success);
    
    if (successfulTests.length > 0) {
      this.lastHealthCheck = {
        isConnected: true,
        isHealthy: true,
        lastChecked: new Date(),
        status: 'healthy',
        latency: Math.min(...successfulTests.map(t => t.latency))
      };
      return true;
    } else {
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

  // === معلومات الحالة ===
  static getConnectionStatus(): UnifiedConnectionStatus | null {
    return this.lastHealthCheck;
  }

  static getDiagnosticResults(): UnifiedDiagnosticResult[] {
    return this.diagnosticHistory;
  }

  static getConversationId(): string | null {
    return this.conversationId;
  }

  // === إعادة التعيين ===
  static resetConversation(): void {
    this.conversationId = null;
    sessionStorage.removeItem('morvo_conversation_id');
    console.log('🔄 Unified conversation reset');
  }

  static clearDiagnosticCache(): void {
    localStorage.removeItem('morvo_successful_format');
    this.lastSuccessfulFormat = null;
    this.diagnosticHistory = [];
    console.log('🧹 Unified diagnostic cache cleared');
  }

  // === استجابة ذكية محلية ===
  static generateSmartFallbackResponse(message: string, context?: any): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('موقع') || lowerMessage.includes('تحليل')) {
      return `أستاذ ${context?.user_profile?.greeting_preference || 'العزيز'}، 
أعتذر عن التأخير التقني. أنا جاهز لتحليل موقعك بشكل مفصل! 📊
شاركني رابط موقعك وسأبدأ التحليل فوراً! 🚀`;
    }
    
    if (lowerMessage.includes('مرحبا') || lowerMessage.includes('السلام')) {
      return `أهلاً وسهلاً ${context?.user_profile?.greeting_preference || 'أستاذ'}! 🌟
أنا مورفو - مساعدك الذكي الموحد للتسويق الرقمي 🤖
كيف يمكنني مساعدتك اليوم؟ 💪`;
    }

    return `أستاذ ${context?.user_profile?.greeting_preference || 'العزيز'}، 
شكراً لرسالتك. النظام الموحد يعمل بكفاءة عالية! 
وضح لي طلبك أكثر وسأقدم لك حلاً مخصصاً! 💡`;
  }
}
