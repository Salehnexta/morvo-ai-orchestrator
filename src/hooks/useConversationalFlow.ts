
import { useState, useCallback } from 'react';
import { useSmartOnboarding } from './useSmartOnboarding';
import { useSmartChat } from './useSmartChat';
import { ConversationalOnboarding } from '@/services/conversationalOnboarding';

interface ConversationState {
  phase: 'welcome' | 'onboarding' | 'chat' | 'assistance';
  context: Record<string, any>;
  lastIntent: string | null;
  conversationDepth: number;
  userSatisfaction: number;
  engagementLevel: 'low' | 'medium' | 'high';
}

interface FlowResponse {
  response: string;
  shouldTriggerAction?: string;
  nextPhase?: string;
  confidence: number;
  enhancementData?: any;
}

export const useConversationalFlow = () => {
  const { status: onboardingStatus } = useSmartOnboarding();
  const { processOnboardingMessage, isOnboardingMessage } = useSmartChat();
  
  const [conversationState, setConversationState] = useState<ConversationState>({
    phase: 'welcome',
    context: {},
    lastIntent: null,
    conversationDepth: 0,
    userSatisfaction: 0.8,
    engagementLevel: 'medium'
  });

  const detectUserIntent = useCallback((message: string): {
    intent: string;
    confidence: number;
    entities: string[];
  } => {
    const lowerMessage = message.toLowerCase();
    const entities: string[] = [];
    
    // Enhanced intent detection with confidence scoring
    let intent = 'general';
    let confidence = 0.5;

    // Onboarding related intents
    if (isOnboardingMessage(message)) {
      intent = 'onboarding';
      confidence = 0.9;
    }
    
    // Business assistance intents with entity extraction
    else if (lowerMessage.includes('تحليل') || lowerMessage.includes('analytics')) {
      intent = 'analytics';
      confidence = 0.8;
      if (lowerMessage.includes('مبيعات')) entities.push('sales');
      if (lowerMessage.includes('حملة')) entities.push('campaign');
    }
    else if (lowerMessage.includes('محتوى') || lowerMessage.includes('content')) {
      intent = 'content';
      confidence = 0.8;
      if (lowerMessage.includes('سوشيال')) entities.push('social');
      if (lowerMessage.includes('مدونة')) entities.push('blog');
    }
    else if (lowerMessage.includes('حملة') || lowerMessage.includes('campaign')) {
      intent = 'campaign';
      confidence = 0.8;
      if (lowerMessage.includes('فيسبوك')) entities.push('facebook');
      if (lowerMessage.includes('انستغرام')) entities.push('instagram');
    }
    else if (lowerMessage.includes('جدولة') || lowerMessage.includes('schedule')) {
      intent = 'scheduling';
      confidence = 0.7;
    }
    
    // Emotional/Support intents
    else if (lowerMessage.includes('مساعدة') || lowerMessage.includes('help')) {
      intent = 'help';
      confidence = 0.9;
    }
    else if (lowerMessage.includes('شكرا') || lowerMessage.includes('thanks')) {
      intent = 'appreciation';
      confidence = 0.9;
    }
    else if (lowerMessage.includes('مشكلة') || lowerMessage.includes('خطأ')) {
      intent = 'problem';
      confidence = 0.8;
    }

    return { intent, confidence, entities };
  }, [isOnboardingMessage]);

  const generateContextualResponse = useCallback(async (
    message: string, 
    intentData: { intent: string; confidence: number; entities: string[] }
  ): Promise<FlowResponse> => {
    const { intent, confidence, entities } = intentData;
    const currentPhase = conversationState.phase;
    
    // Handle onboarding phase with enhanced responses
    if (!onboardingStatus?.onboarding_completed && intent === 'onboarding') {
      const onboardingResult = await processOnboardingMessage(message);
      
      if (onboardingResult) {
        return {
          response: onboardingResult.response,
          nextPhase: onboardingResult.isComplete ? 'chat' : 'onboarding',
          confidence: 0.9,
          enhancementData: { isOnboarding: true }
        };
      }
    }

    // Enhanced responses with entity awareness
    switch (intent) {
      case 'analytics':
        let analyticsResponse = 'ممتاز! يمكنني مساعدتك في تحليل أداء حملاتك التسويقية.';
        if (entities.includes('sales')) {
          analyticsResponse += ' سأركز على تحليل بيانات المبيعات.';
        }
        if (entities.includes('campaign')) {
          analyticsResponse += ' سأعرض تحليلاً مفصلاً لحملاتك.';
        }
        analyticsResponse += ' دعني أعرض لك لوحة التحليلات.';
        
        return {
          response: analyticsResponse,
          shouldTriggerAction: 'analytics',
          confidence: 0.8,
          enhancementData: { entities, focus: 'analytics' }
        };
        
      case 'content':
        let contentResponse = 'رائع! سأساعدك في إنشاء محتوى تسويقي مميز.';
        if (entities.includes('social')) {
          contentResponse += ' سأركز على محتوى وسائل التواصل الاجتماعي.';
        }
        if (entities.includes('blog')) {
          contentResponse += ' سأساعدك في كتابة مقالات المدونة.';
        }
        contentResponse += ' دعني أفتح أدوات إنشاء المحتوى.';
        
        return {
          response: contentResponse,
          shouldTriggerAction: 'content-creator',
          confidence: 0.8,
          enhancementData: { entities, focus: 'content' }
        };
        
      case 'campaign':
        let campaignResponse = 'بالطبع! يمكنني مساعدتك في إنشاء حملة تسويقية فعالة.';
        if (entities.includes('facebook') || entities.includes('instagram')) {
          campaignResponse += ` سأركز على منصة ${entities.join(' و ')}.`;
        }
        campaignResponse += ' دعني أعرض عليك خيارات الحملات.';
        
        return {
          response: campaignResponse,
          shouldTriggerAction: 'campaign',
          confidence: 0.8,
          enhancementData: { entities, focus: 'campaign' }
        };
        
      case 'scheduling':
        return {
          response: 'ممتاز! التخطيط المسبق مهم جداً للنجاح. دعني أفتح التقويم التسويقي.',
          shouldTriggerAction: 'calendar',
          confidence: 0.8,
          enhancementData: { focus: 'scheduling' }
        };
        
      case 'help':
        return {
          response: 'أنا هنا لمساعدتك! يمكنني مساعدتك في:\n• تحليل الأداء التسويقي\n• إنشاء المحتوى\n• إدارة الحملات\n• جدولة المنشورات\n\nما الذي تود العمل عليه؟',
          confidence: 0.7,
          enhancementData: { type: 'help_menu' }
        };
        
      case 'problem':
        return {
          response: 'أفهم أن هناك مشكلة. دعني أساعدك في حلها. يمكنك وصف المشكلة بالتفصيل وسأقدم لك الحل المناسب.',
          confidence: 0.8,
          enhancementData: { type: 'problem_solving', priority: 'high' }
        };
        
      case 'appreciation':
        return {
          response: 'العفو! يسعدني مساعدتك. هل تحتاج لأي شيء آخر؟',
          confidence: 0.9,
          enhancementData: { type: 'positive_feedback' }
        };
        
      default:
        const defaultResponse = currentPhase === 'welcome' && !onboardingStatus?.onboarding_completed
          ? ConversationalOnboarding.getWelcomeMessage()
          : 'أفهم طلبك. كيف يمكنني مساعدتك بشكل أفضل؟';
          
        return {
          response: defaultResponse,
          confidence: 0.5,
          enhancementData: { type: 'general', needsClarity: true }
        };
    }
  }, [conversationState, onboardingStatus, processOnboardingMessage]);

  const processMessage = useCallback(async (message: string) => {
    const intentData = detectUserIntent(message);
    const response = await generateContextualResponse(message, intentData);
    
    // Enhanced conversation state tracking
    setConversationState(prev => {
      const newDepth = prev.conversationDepth + 1;
      let newSatisfaction = prev.userSatisfaction;
      let newEngagement = prev.engagementLevel;
      
      // Adjust satisfaction based on response confidence
      if (response.confidence > 0.8) {
        newSatisfaction = Math.min(1.0, newSatisfaction + 0.05);
      } else if (response.confidence < 0.5) {
        newSatisfaction = Math.max(0.0, newSatisfaction - 0.1);
      }
      
      // Adjust engagement based on conversation depth and intent
      if (newDepth > 10 && intentData.confidence > 0.7) {
        newEngagement = 'high';
      } else if (newDepth < 3 || intentData.confidence < 0.5) {
        newEngagement = 'low';
      } else {
        newEngagement = 'medium';
      }
      
      return {
        ...prev,
        lastIntent: intentData.intent,
        conversationDepth: newDepth,
        userSatisfaction: newSatisfaction,
        engagementLevel: newEngagement,
        context: {
          ...prev.context,
          lastMessage: message,
          lastResponse: response.response,
          lastEntities: intentData.entities,
          timestamp: new Date().toISOString()
        }
      };
    });
    
    return response;
  }, [detectUserIntent, generateContextualResponse]);

  const updatePhase = useCallback((newPhase: ConversationState['phase']) => {
    setConversationState(prev => ({
      ...prev,
      phase: newPhase
    }));
  }, []);

  const getConversationMetrics = useCallback(() => {
    return {
      depth: conversationState.conversationDepth,
      satisfaction: conversationState.userSatisfaction,
      engagement: conversationState.engagementLevel,
      phase: conversationState.phase,
      lastIntent: conversationState.lastIntent
    };
  }, [conversationState]);

  return {
    conversationState,
    processMessage,
    updatePhase,
    getConversationMetrics,
    isOnboardingActive: !onboardingStatus?.onboarding_completed
  };
};
