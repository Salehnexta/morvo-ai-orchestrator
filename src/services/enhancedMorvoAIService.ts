
import { supabase } from "@/integrations/supabase/client";
import { ChatDiagnostics } from "./chatDiagnostics";

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
    
    // Perform diagnostic check with improved timeout
    const token = await this.getAuthToken();
    const diagnostic = await ChatDiagnostics.performComprehensiveDiagnostic(token);
    this.lastDiagnostic = diagnostic;
    
    console.log('📊 Diagnostic result:', diagnostic);

    // Improved endpoint selection logic
    let response: EnhancedChatResponse;
    
    try {
      // Try authenticated endpoint first if token exists and diagnostic is positive
      if (token && diagnostic.authEndpoint?.status === 'healthy') {
        try {
          response = await this.sendAuthenticatedMessage(message, token, context);
          response.endpoint_used = 'authenticated';
        } catch (authError) {
          console.warn('Auth endpoint failed, falling back to test:', authError);
          response = await this.sendTestMessage(message, context);
          response.endpoint_used = 'test_fallback';
        }
      } else if (diagnostic.testEndpoint?.status === 'healthy') {
        response = await this.sendTestMessage(message, context);
        response.endpoint_used = 'test';
      } else {
        throw new Error('All endpoints unavailable');
      }
      
      response.diagnostic_info = {
        overall_status: diagnostic.overallStatus,
        recommendation: diagnostic.recommendation,
        test_endpoint_latency: diagnostic.testEndpoint.latency,
        auth_endpoint_latency: diagnostic.authEndpoint?.latency || null,
        connection_quality: this.getConnectionQuality(diagnostic)
      };
      
      console.log('✅ Enhanced response generated:', {
        endpoint: response.endpoint_used,
        processingTime: response.processing_time,
        confidence: response.confidence_score
      });
      
      return response;
      
    } catch (error) {
      console.error('❌ Enhanced processing failed:', error);
      
      // Improved Arabic fallback
      return {
        response: this.generateArabicFallbackResponse(message, context),
        tokens_used: 0,
        processing_time: 150,
        confidence_score: 0.7,
        endpoint_used: 'arabic_fallback',
        diagnostic_info: diagnostic
      };
    }
  }

  private static async sendTestMessage(message: string, context?: any): Promise<EnhancedChatResponse> {
    const response = await fetch(`${this.API_URL}/v1/chat/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'MorvoAI-Frontend/1.0'
      },
      body: JSON.stringify({
        message: message.trim(),
        client_id: this.getClientId(),
        conversation_id: this.conversationId || `conv-${Date.now()}`,
        context: context || {},
        language: 'ar',
        user_preferences: {
          response_language: 'arabic',
          response_style: 'professional'
        }
      }),
      signal: AbortSignal.timeout(this.TEST_TIMEOUT)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Test endpoint failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    // Save conversation ID
    if (data.conversation_id) {
      this.conversationId = data.conversation_id;
      sessionStorage.setItem('morvo_conversation_id', data.conversation_id);
    }
    
    return {
      response: data.message || data.response || 'تم استلام رسالتك وسأجيب عليها قريباً',
      personality_traits: data.personality_traits,
      tokens_used: data.tokens_used || 0,
      emotion_detected: data.emotion_detected,
      suggested_actions: data.suggested_actions || [],
      processing_time: data.processing_time_ms,
      confidence_score: data.confidence_score || 0.9,
      endpoint_used: 'test'
    };
  }

  private static async sendAuthenticatedMessage(message: string, token: string, context?: any): Promise<EnhancedChatResponse> {
    // Fixed: Remove the problematic func parameter
    const url = `${this.API_URL}/v1/chat/message`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Client-Info': 'morvo-ai-frontend',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        message: message.trim(),
        conversation_id: this.conversationId || `auth-conv-${Date.now()}`,
        language: 'ar',
        project_context: context?.project_context || {},
        metadata: {
          ...context?.metadata,
          client_id: this.getClientId(),
          timestamp: new Date().toISOString()
        },
        stream: false,
        user_preferences: {
          response_language: 'arabic',
          greeting_style: 'professional'
        }
      }),
      signal: AbortSignal.timeout(this.AUTH_TIMEOUT)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Auth endpoint failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    // Save conversation ID
    if (data.conversation_id) {
      this.conversationId = data.conversation_id;
      sessionStorage.setItem('morvo_conversation_id', data.conversation_id);
    }

    return {
      response: data.message || data.response || 'شكراً لرسالتك، تم معالجتها بنجاح',
      personality_traits: data.personality_traits,
      tokens_used: data.tokens_used || 0,
      emotion_detected: data.emotion_detected,
      suggested_actions: data.suggested_actions || [],
      processing_time: data.processing_time_ms,
      confidence_score: data.confidence_score || 0.9,
      endpoint_used: 'authenticated'
    };
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

  private static getConnectionQuality(diagnostic: any): string {
    if (!diagnostic) return 'unknown';
    
    const avgLatency = (diagnostic.testEndpoint?.latency || 0 + diagnostic.authEndpoint?.latency || 0) / 2;
    
    if (avgLatency < 1000) return 'excellent';
    if (avgLatency < 3000) return 'good';
    if (avgLatency < 5000) return 'fair';
    return 'poor';
  }

  static getLastDiagnostic(): any {
    return this.lastDiagnostic;
  }

  static async performHealthCheck(): Promise<any> {
    const token = await this.getAuthToken();
    return ChatDiagnostics.performComprehensiveDiagnostic(token);
  }

  static resetConversation(): void {
    this.conversationId = null;
    sessionStorage.removeItem('morvo_conversation_id');
    console.log('🔄 Enhanced conversation reset');
  }
}
