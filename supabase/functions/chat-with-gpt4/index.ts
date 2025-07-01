
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const { message, context, conversation_history } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    // Build conversation messages
    const messages = [
      {
        role: 'system',
        content: `أنت مورفو - مساعد ذكي متخصص في التسويق الرقمي والأعمال. تتحدث بالعربية وتقدم نصائح احترافية ومفيدة.

خصائصك:
- خبير في التسويق الرقمي والسوشيال ميديا
- تقدم نصائح عملية وقابلة للتطبيق
- تستخدم الرموز التعبيرية بشكل مناسب
- تعطي إجابات مفصلة ومنظمة
- تراعي السوق السعودي والعربي

${context?.user_profile ? `
معلومات المستخدم:
- الاسم: ${context.user_profile.full_name || 'غير محدد'}
- اللقب المفضل: ${context.user_profile.greeting_preference || 'أستاذ'}
- المنصب: ${context.user_profile.job_title || 'غير محدد'}
- الشركة: ${context.user_profile.company_name || 'غير محدد'}
- المجال: ${context.user_profile.industry || 'غير محدد'}
- الموقع الإلكتروني: ${context.user_profile.website_url || 'غير محدد'}
` : ''}

قدم إجابات مخصصة بناءً على هذه المعلومات.`
      }
    ];

    // Add conversation history
    if (conversation_history && Array.isArray(conversation_history)) {
      conversation_history.slice(-6).forEach(msg => {
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        });
      });
    }

    // Add current message
    messages.push({
      role: 'user',
      content: message
    });

    console.log('🚀 Sending request to GPT-4 with', messages.length, 'messages');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        max_tokens: 2000,
        temperature: 0.7,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API Error:', response.status, errorText);
      throw new Error(`OpenAI API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from OpenAI API');
    }

    const assistantMessage = data.choices[0].message.content;
    const tokensUsed = data.usage?.total_tokens || 0;

    console.log('✅ GPT-4 response received:', {
      tokensUsed,
      messageLength: assistantMessage.length
    });

    return new Response(JSON.stringify({
      success: true,
      response: assistantMessage,
      tokens_used: tokensUsed,
      model: 'gpt-4o',
      processing_time_ms: Date.now() - Date.now(),
      conversation_id: `gpt4-${Date.now()}`,
      confidence_score: 0.95
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Chat function error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      fallback_response: `أعتذر، حدث خطأ تقني مؤقت. أنا مورفو - مساعدك الذكي للتسويق الرقمي، وأنا هنا لمساعدتك! 🚀

يمكنني مساعدتك في:
• استراتيجيات التسويق الرقمي 📈
• تحليل وتحسين المواقع 🌐  
• إنشاء محتوى جذاب ✨
• تحليل السوق والمنافسين 🔍

يرجى إعادة المحاولة خلال لحظات، أو وضح لي كيف يمكنني مساعدتك! 💡`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
