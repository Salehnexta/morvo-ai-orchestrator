
import { ConversationalOnboarding } from './conversationalOnboarding';

interface ResponseContext {
  userMessage: string;
  conversationHistory: Array<{ role: string; content: string }>;
  onboardingStatus: any;
  userProfile?: any;
  currentPhase: string;
}

interface SmartResponse {
  response: string;
  suggestedActions?: Array<{
    action: string;
    label: string;
    priority: number;
  }>;
  shouldUpdateUI?: boolean;
  uiComponent?: string;
}

export class SmartResponseGenerator {
  
  static async generateResponse(context: ResponseContext): Promise<SmartResponse> {
    const { userMessage, onboardingStatus, currentPhase } = context;
    
    // Handle onboarding phase
    if (currentPhase === 'onboarding' || !onboardingStatus?.onboarding_completed) {
      return this.generateOnboardingResponse(context);
    }
    
    // Handle business assistance
    return this.generateBusinessResponse(context);
  }
  
  private static generateOnboardingResponse(context: ResponseContext): SmartResponse {
    const { userMessage, onboardingStatus } = context;
    
    // If no onboarding data exists, start fresh
    if (!onboardingStatus?.onboarding_started) {
      return {
        response: ConversationalOnboarding.getWelcomeMessage(),
        suggestedActions: [
          { action: 'start_onboarding', label: 'ابدأ الآن', priority: 1 }
        ]
      };
    }
    
    // Continue with next question
    const nextQuestion = ConversationalOnboarding.getNextQuestion({});
    if (nextQuestion) {
      return {
        response: nextQuestion.question,
        suggestedActions: nextQuestion.type === 'choice' && nextQuestion.options ? 
          nextQuestion.options.map((option, index) => ({
            action: 'select_option',
            label: option,
            priority: index + 1
          })) : []
      };
    }
    
    return {
      response: 'دعنا نكمل إعداد ملفك الشخصي...'
    };
  }
  
  private static generateBusinessResponse(context: ResponseContext): SmartResponse {
    const { userMessage } = context;
    const lowerMessage = userMessage.toLowerCase();
    
    // Analytics requests
    if (lowerMessage.includes('تحليل') || lowerMessage.includes('analytics')) {
      return {
        response: 'ممتاز! سأعرض لك تحليلاً شاملاً لأداء حملاتك التسويقية.',
        suggestedActions: [
          { action: 'view_analytics', label: 'عرض التحليلات', priority: 1 },
          { action: 'generate_report', label: 'إنشاء تقرير', priority: 2 }
        ],
        shouldUpdateUI: true,
        uiComponent: 'analytics'
      };
    }
    
    // Content creation requests
    if (lowerMessage.includes('محتوى') || lowerMessage.includes('content')) {
      return {
        response: 'رائع! سأساعدك في إنشاء محتوى تسويقي جذاب ومتميز.',
        suggestedActions: [
          { action: 'create_content', label: 'إنشاء محتوى', priority: 1 },
          { action: 'content_ideas', label: 'أفكار المحتوى', priority: 2 }
        ],
        shouldUpdateUI: true,
        uiComponent: 'content-creator'
      };
    }
    
    // Campaign requests
    if (lowerMessage.includes('حملة') || lowerMessage.includes('campaign')) {
      return {
        response: 'ممتاز! دعني أساعدك في إنشاء حملة تسويقية ناجحة.',
        suggestedActions: [
          { action: 'create_campaign', label: 'إنشاء حملة', priority: 1 },
          { action: 'campaign_templates', label: 'قوالب الحملات', priority: 2 }
        ],
        shouldUpdateUI: true,
        uiComponent: 'campaign'
      };
    }
    
    // Default helpful response
    return {
      response: 'أفهم طلبك. كيف يمكنني مساعدتك بشكل أفضل في تطوير استراتيجيتك التسويقية؟',
      suggestedActions: [
        { action: 'view_analytics', label: 'عرض التحليلات', priority: 1 },
        { action: 'create_content', label: 'إنشاء محتوى', priority: 2 },
        { action: 'create_campaign', label: 'إنشاء حملة', priority: 3 }
      ]
    };
  }
  
  static generateWelcomeMessage(onboardingStatus: any): string {
    if (!onboardingStatus?.onboarding_completed) {
      return ConversationalOnboarding.getWelcomeMessage();
    }
    
    const greeting = onboardingStatus.profile_data?.greeting_preference || 'أستاذ';
    const companyName = onboardingStatus.profile_data?.company_name;
    
    if (companyName) {
      return `مرحباً بك ${greeting}! سعيد برؤيتك مرة أخرى. كيف يمكنني مساعدة ${companyName} اليوم؟`;
    }
    
    return `مرحباً بك ${greeting}! أنا مورفو، مساعدك الذكي للتسويق الرقمي. كيف يمكنني مساعدتك اليوم؟`;
  }
}
