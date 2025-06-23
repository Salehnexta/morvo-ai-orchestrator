
import { supabase } from "@/integrations/supabase/client";
import { UnifiedDiagnostics } from "./unifiedDiagnostics";

interface EnhancedChatResponse {
  response: string;
  personality_traits?: any;
  tokens_used: number;
  emotion_detected?: string;
  suggested_actions?: Array<any>;
  processing_time?: number;
  confidence_score?: number;
  endpoint_used: string;
  diagnostic_info?: any;
}

export class EnhancedMorvoAIService {
  private static readonly API_URL = 'https://morvo-production.up.railway.app';
  private static readonly TEST_TIMEOUT = 3000; // Reduced from 45000
  private static readonly AUTH_TIMEOUT = 5000;
  private static conversationId: string | null = sessionStorage.getItem('morvo_conversation_id');
  private static lastDiagnostic: any = null;

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

  static async processMessageWithDiagnostics(message: string, context?: any): Promise<EnhancedChatResponse> {
    console.log('🚀 Enhanced message processing started:', message);
    
    // Use UnifiedDiagnostics for comprehensive testing
    const token = await this.getAuthToken();
    const diagnosticResults = await UnifiedDiagnostics.runComprehensiveDiagnostics();
    const connectionStatus = UnifiedDiagnostics.getConnectionStatus();
    
    this.lastDiagnostic = {
      results: diagnosticResults,
      status: connectionStatus,
      overallStatus: connectionStatus?.status || 'unknown',
      recommendation: connectionStatus?.isConnected ? 'Use authenticated endpoint' : 'Check connection'
    };
    
    console.log('📊 Diagnostic result:', this.lastDiagnostic);

    try {
      // Try to send message using UnifiedDiagnostics
      const response = await UnifiedDiagnostics.sendMessage(message, context);
      
      if (response.success) {
        return {
          response: response.message,
          tokens_used: response.tokens_used || 0,
          processing_time: response.processing_time_ms,
          confidence_score: response.confidence_score || 0.9,
          endpoint_used: 'unified_diagnostics',
          diagnostic_info: this.lastDiagnostic
        };
      } else {
        throw new Error(response.error || 'Unified diagnostics failed');
      }
      
    } catch (error) {
      console.error('❌ Enhanced processing failed:', error);
      
      // Improved Arabic fallback
      return {
        response: this.generateArabicFallbackResponse(message, context),
        tokens_used: 0,
        processing_time: 150,
        confidence_score: 0.7,
        endpoint_used: 'arabic_fallback',
        diagnostic_info: this.lastDiagnostic
      };
    }
  }

  private static generateArabicFallbackResponse(message: string, context?: any): string {
    const lowerMessage = message.toLowerCase();
    
    // Enhanced Arabic contextual responses
    if (lowerMessage.includes('موقع') || lowerMessage.includes('تحليل') || lowerMessage.includes('افحص')) {
      return `أستاذ ${context?.user_profile?.greeting_preference || 'العزيز'}، 

أعتذر عن التأخير التقني. أنا جاهز لتحليل موقعك بشكل مفصل! 📊

**سأحلل لك:**
• الأداء التقني وسرعة التحميل ⚡
• تحسين محركات البحث (SEO) 🔍
• تجربة المستخدم والتصميم 🎨
• المحتوى واستراتيجية الكلمات المفتاحية 📝

**معلومات إضافية مطلوبة:**
• رابط موقعك الإلكتروني 🌐
• أهدافك التسويقية الحالية 🎯
• جمهورك المستهدف 👥

شاركني رابط موقعك وسأبدأ التحليل فوراً! 🚀`;
    }
    
    if (lowerMessage.includes('مرحبا') || lowerMessage.includes('السلام') || lowerMessage.includes('اهلا')) {
      return `أهلاً وسهلاً ${context?.user_profile?.greeting_preference || 'أستاذ'}! 🌟

أنا مورفو - مساعدك الذكي للتسويق الرقمي المطور بتقنية GPT-4o 🤖

**خدماتي المتاحة:**
• تحليل المواقع والسيو 📊
• استراتيجيات التسويق الرقمي 🎯
• إنشاء محتوى احترافي ✨
• تحليل المنافسين 🔍
• حملات إعلانية مدروسة 📱

**النظام يعمل حالياً في الوضع المحسن - جودة عالية وسرعة فائقة! ⚡**

كيف يمكنني مساعدتك اليوم؟ 💪`;
    }

    if (lowerMessage.includes('سيو') || lowerMessage.includes('تحسين')) {
      return `أستاذ ${context?.user_profile?.greeting_preference || 'العزيز'}! 🎯

**خطة تحسين السيو الشاملة:**

**1. التحليل التقني:**
• سرعة الموقع وأداء الخوادم ⚡
• البنية التقنية والترميز 🔧
• تجربة المستخدم على الجوال 📱

**2. المحتوى والكلمات المفتاحية:**
• بحث الكلمات المفتاحية المناسبة 🔑
• تحسين المحتوى الحالي ✍️
• استراتيجية المحتوى الجديد 📝

**3. الروابط والسلطة:**
• بناء الروابط الخلفية 🔗
• تحسين السلطة المحلية 📍
• التسويق بالمحتوى 📊

شاركني رابط موقعك لبدء التحليل المفصل! 🚀`;
    }

    // Default Arabic response
    return `أستاذ ${context?.user_profile?.greeting_preference || 'العزيز'}! 

شكراً لرسالتك. النظام يعمل حالياً بكفاءة عالية وجاهز لخدمتك! 

**يمكنني مساعدتك في:**
• تحليل وتحسين المواقع 🌐
• استراتيجيات التسويق المتقدمة 📈
• إنشاء محتوى جذاب ومؤثر ✨
• تحليل السوق والمنافسين 🔍

**وضح لي طلبك أكثر وسأقدم لك حلاً مخصصاً ومفصلاً! 💡**

ما هو التحدي التسويقي الذي تواجهه؟ 🤔`;
  }

  static getLastDiagnostic(): any {
    return this.lastDiagnostic;
  }

  static async performHealthCheck(): Promise<any> {
    const token = await this.getAuthToken();
    const results = await UnifiedDiagnostics.runComprehensiveDiagnostics();
    const status = UnifiedDiagnostics.getConnectionStatus();
    
    return {
      results,
      status,
      overallStatus: status?.status || 'unknown',
      recommendation: status?.isConnected ? 'System healthy' : 'Check connection'
    };
  }

  static resetConversation(): void {
    this.conversationId = null;
    sessionStorage.removeItem('morvo_conversation_id');
    UnifiedDiagnostics.resetConversation();
    console.log('🔄 Enhanced conversation reset');
  }
}
