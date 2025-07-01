
import { supabase } from "@/integrations/supabase/client";

export interface DirectGPT4Response {
  success: boolean;
  response: string;
  tokens_used: number;
  model: string;
  processing_time_ms: number;
  conversation_id: string;
  confidence_score: number;
  error?: string;
  fallback_response?: string;
}

export class DirectGPT4Service {
  private static readonly SUPABASE_URL = 'https://teniefzxdikestahdnur.supabase.co';
  private static readonly SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlbmllZnp4ZGlrZXN0YWhkbnVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMDczMjcsImV4cCI6MjA2NDg4MzMyN30.9-WD35_UTe4_nBLMxZaSNS-VWfZit5ORUI6jahEYQUM';
  
  static async sendMessage(
    message: string, 
    context?: any, 
    conversationHistory?: Array<{role: string, content: string}>
  ): Promise<DirectGPT4Response> {
    try {
      console.log('🚀 DirectGPT4Service: Sending message to GPT-4:', {
        messagePreview: message.substring(0, 50),
        hasContext: !!context,
        historyLength: conversationHistory?.length || 0
      });

      // Get current user session for authentication
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${this.SUPABASE_URL}/functions/v1/chat-with-gpt4`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
          'apikey': this.SUPABASE_ANON_KEY
        },
        body: JSON.stringify({
          message: message.trim(),
          context: {
            ...context,
            user_metadata: session?.user?.user_metadata || {},
            session_id: session?.user?.id,
            frontend_origin: window.location.origin
          },
          conversation_history: conversationHistory || []
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ DirectGPT4Service error:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ DirectGPT4Service success:', {
        tokensUsed: data.tokens_used,
        responseLength: data.response?.length
      });

      return data;
      
    } catch (error) {
      console.error('❌ DirectGPT4Service error:', error);
      
      return {
        success: false,
        response: '',
        tokens_used: 0,
        model: 'gpt-4o',
        processing_time_ms: 0,
        conversation_id: `error-${Date.now()}`,
        confidence_score: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        fallback_response: this.generateFallbackResponse(message, context)
      };
    }
  }

  private static generateFallbackResponse(message: string, context?: any): string {
    const userGreeting = context?.user_profile?.greeting_preference || 'أستاذ';
    const userName = context?.user_profile?.full_name || 'صديقي';
    
    return `${userGreeting} ${userName}، أعتذر عن المشكلة التقنية المؤقتة! 🤖

أنا مورفو - مساعدك الذكي للتسويق الرقمي، وأنا هنا لمساعدتك:

**خدماتي المتاحة:**
• تحليل وتحسين المواقع 🌐
• استراتيجيات التسويق الرقمي 📈
• إنشاء محتوى احترافي ✨
• تحليل المنافسين والسوق 🔍
• حملات إعلانية مدروسة 📱

**بخصوص استفسارك:** "${message.substring(0, 100)}${message.length > 100 ? '...' : ''}"

يرجى إعادة المحاولة خلال لحظات، أو وضح لي كيف يمكنني مساعدتك أكثر! 💡`;
  }

  static async testConnection(): Promise<boolean> {
    try {
      console.log('🔗 Testing direct GPT-4 connection...');
      
      const result = await this.sendMessage('مرحبا، هذا اختبار اتصال');
      return result.success;
      
    } catch (error) {
      console.error('❌ DirectGPT4Service connection test failed:', error);
      return false;
    }
  }

  static async getHealthStatus(): Promise<any> {
    try {
      const testResult = await this.testConnection();
      
      return {
        status: testResult ? 'healthy' : 'failed',
        service: 'direct-gpt4',
        model: 'gpt-4o',
        endpoint: 'supabase-edge-function',
        timestamp: new Date().toISOString(),
        success: testResult
      };
      
    } catch (error) {
      return {
        status: 'failed',
        service: 'direct-gpt4',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        success: false
      };
    }
  }
}
