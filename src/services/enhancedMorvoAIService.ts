
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
  private static readonly TIMEOUT = 45000;
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
    
    // Perform diagnostic check
    const token = await this.getAuthToken();
    const diagnostic = await ChatDiagnostics.performComprehensiveDiagnostic(token);
    this.lastDiagnostic = diagnostic;
    
    console.log('📊 Diagnostic result:', diagnostic);

    // Choose optimal endpoint based on diagnostic
    let response: EnhancedChatResponse;
    
    try {
      if (diagnostic.recommendation === 'use_auth' && token) {
        response = await this.sendAuthenticatedMessage(message, token, context);
        response.endpoint_used = 'authenticated';
      } else if (diagnostic.recommendation === 'use_test' || diagnostic.testEndpoint.status === 'healthy') {
        response = await this.sendTestMessage(message, context);
        response.endpoint_used = 'test';
      } else {
        throw new Error('All endpoints unavailable');
      }
      
      response.diagnostic_info = {
        overall_status: diagnostic.overallStatus,
        recommendation: diagnostic.recommendation,
        test_endpoint_latency: diagnostic.testEndpoint.latency,
        auth_endpoint_latency: diagnostic.authEndpoint?.latency || null
      };
      
      console.log('✅ Enhanced response generated:', {
        endpoint: response.endpoint_used,
        processingTime: response.processing_time,
        confidence: response.confidence_score
      });
      
      return response;
      
    } catch (error) {
      console.error('❌ Enhanced processing failed:', error);
      
      // Fallback to offline response
      return {
        response: this.generateOfflineResponse(message, context),
        tokens_used: 0,
        processing_time: 100,
        confidence_score: 0.3,
        endpoint_used: 'offline_fallback',
        diagnostic_info: diagnostic
      };
    }
  }

  private static async sendTestMessage(message: string, context?: any): Promise<EnhancedChatResponse> {
    const response = await fetch(`${this.API_URL}/v1/chat/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        message: message.trim(),
        client_id: this.getClientId(),
        conversation_id: this.conversationId || `conv-${Date.now()}`,
        context: context || {}
      }),
      signal: AbortSignal.timeout(this.TIMEOUT)
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
      response: data.message || data.response || 'No response received',
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
    // Add the required func parameter to the URL
    const url = `${this.API_URL}/v1/chat/message?func=chat`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Client-Info': 'morvo-ai-frontend'
      },
      body: JSON.stringify({
        message: message.trim(),
        conversation_id: this.conversationId,
        project_context: context?.project_context || {},
        metadata: context?.metadata || {},
        stream: false
      }),
      signal: AbortSignal.timeout(this.TIMEOUT)
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
      response: data.message || data.response || 'No response received',
      personality_traits: data.personality_traits,
      tokens_used: data.tokens_used || 0,
      emotion_detected: data.emotion_detected,
      suggested_actions: data.suggested_actions || [],
      processing_time: data.processing_time_ms,
      confidence_score: data.confidence_score || 0.9,
      endpoint_used: 'authenticated'
    };
  }

  private static generateOfflineResponse(message: string, context?: any): string {
    const lowerMessage = message.toLowerCase();
    
    // Enhanced contextual Arabic responses for offline mode
    if (lowerMessage.includes('موقع') || lowerMessage.includes('حللت') || lowerMessage.includes('تحليل')) {
      return `أعتذر، النظام يعمل حالياً في الوضع المحلي 🔄

لكن يمكنني مساعدتك في:
• تقديم نصائح عامة لتحليل المواقع 📊
• اقتراح أدوات مفيدة للتحليل 🛠️
• خطة عمل لتحسين موقعك 📈

ما هو التحدي الأساسي الذي تواجهه مع موقعك؟`;
    }
    
    if (lowerMessage.includes('مرحبا') || lowerMessage.includes('السلام') || lowerMessage.includes('اهلا')) {
      return `مرحباً بك! 👋 النظام يعمل حالياً في الوضع المحلي، لكنني متاح لمساعدتك في:

• استراتيجيات التسويق الرقمي 📈
• نصائح تحسين المواقع 🌐
• أفكار للمحتوى والحملات ✨
• تخطيط مشاريعك التسويقية 📋

كيف يمكنني مساعدتك اليوم؟`;
    }
    
    const responses = [
      'عذراً، أواجه صعوبة في الاتصال بالخوادم حالياً. تم تفعيل الوضع المحلي. كيف يمكنني مساعدتك؟',
      'نظام الاتصال يواجه تحديات تقنية. سأحاول مساعدتك بأفضل ما يمكنني محلياً.',
      'يبدو أن هناك مشكلة في الاتصال. دعني أحاول المساعدة بالموارد المحلية المتاحة.'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
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
