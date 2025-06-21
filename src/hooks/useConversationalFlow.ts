
import { useState, useCallback } from 'react';
import { useSmartOnboarding } from './useSmartOnboarding';
import { useSmartChat } from './useSmartChat';
import { ConversationalOnboarding } from '@/services/conversationalOnboarding';

interface ConversationState {
  phase: 'welcome' | 'onboarding' | 'chat' | 'assistance';
  context: Record<string, any>;
  lastIntent: string | null;
  conversationDepth: number;
}

interface FlowResponse {
  response: string;
  shouldTriggerAction?: string;
  nextPhase?: string;
  confidence: number;
}

export const useConversationalFlow = () => {
  const { status: onboardingStatus } = useSmartOnboarding();
  const { processOnboardingMessage, isOnboardingMessage } = useSmartChat();
  
  const [conversationState, setConversationState] = useState<ConversationState>({
    phase: 'welcome',
    context: {},
    lastIntent: null,
    conversationDepth: 0
  });

  const detectUserIntent = useCallback((message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    // Onboarding related intents
    if (isOnboardingMessage(message)) return 'onboarding';
    
    // Business assistance intents
    if (lowerMessage.includes('تحليل') || lowerMessage.includes('analytics')) return 'analytics';
    if (lowerMessage.includes('محتوى') || lowerMessage.includes('content')) return 'content';
    if (lowerMessage.includes('حملة') || lowerMessage.includes('campaign')) return 'campaign';
    if (lowerMessage.includes('جدولة') || lowerMessage.includes('schedule')) return 'scheduling';
    
    // General assistance
    if (lowerMessage.includes('مساعدة') || lowerMessage.includes('help')) return 'help';
    if (lowerMessage.includes('شكرا') || lowerMessage.includes('thanks')) return 'appreciation';
    
    return 'general';
  }, [isOnboardingMessage]);

  const generateContextualResponse = useCallback(async (
    message: string, 
    intent: string
  ): Promise<FlowResponse> => {
    const currentPhase = conversationState.phase;
    
    // Handle onboarding phase
    if (!onboardingStatus?.onboarding_completed && intent === 'onboarding') {
      const onboardingResult = await processOnboardingMessage(message);
      
      if (onboardingResult) {
        return {
          response: onboardingResult.response,
          nextPhase: onboardingResult.isComplete ? 'chat' : 'onboarding',
          confidence: 0.9
        };
      }
    }

    // Handle different intents based on current phase
    switch (intent) {
      case 'analytics':
        return {
          response: 'ممتاز! يمكنني مساعدتك في تحليل أداء حملاتك التسويقية. دعني أعرض لك لوحة التحليلات.',
          shouldTriggerAction: 'analytics',
          confidence: 0.8
        };
        
      case 'content':
        return {
          response: 'رائع! سأساعدك في إنشاء محتوى تسويقي مميز. دعني أفتح أدوات إنشاء المحتوى.',
          shouldTriggerAction: 'content-creator',
          confidence: 0.8
        };
        
      case 'campaign':
        return {
          response: 'بالطبع! يمكنني مساعدتك في إنشاء حملة تسويقية فعالة. دعني أعرض عليك خيارات الحملات.',
          shouldTriggerAction: 'campaign',
          confidence: 0.8
        };
        
      case 'scheduling':
        return {
          response: 'ممتاز! التخطيط المسبق مهم جداً للنجاح. دعني أفتح التقويم التسويقي.',
          shouldTriggerAction: 'calendar',
          confidence: 0.8
        };
        
      case 'help':
        return {
          response: 'أنا هنا لمساعدتك! يمكنني مساعدتك في:\n• تحليل الأداء التسويقي\n• إنشاء المحتوى\n• إدارة الحملات\n• جدولة المنشورات\n\nما الذي تود العمل عليه؟',
          confidence: 0.7
        };
        
      case 'appreciation':
        return {
          response: 'العفو! يسعدني مساعدتك. هل تحتاج لأي شيء آخر؟',
          confidence: 0.9
        };
        
      default:
        return {
          response: currentPhase === 'welcome' && !onboardingStatus?.onboarding_completed
            ? ConversationalOnboarding.getWelcomeMessage()
            : 'أفهم طلبك. كيف يمكنني مساعدتك بشكل أفضل؟',
          confidence: 0.5
        };
    }
  }, [conversationState, onboardingStatus, processOnboardingMessage]);

  const processMessage = useCallback(async (message: string) => {
    const intent = detectUserIntent(message);
    const response = await generateContextualResponse(message, intent);
    
    // Update conversation state
    setConversationState(prev => ({
      ...prev,
      lastIntent: intent,
      conversationDepth: prev.conversationDepth + 1,
      context: {
        ...prev.context,
        lastMessage: message,
        lastResponse: response.response
      }
    }));
    
    return response;
  }, [detectUserIntent, generateContextualResponse]);

  const updatePhase = useCallback((newPhase: ConversationState['phase']) => {
    setConversationState(prev => ({
      ...prev,
      phase: newPhase
    }));
  }, []);

  return {
    conversationState,
    processMessage,
    updatePhase,
    isOnboardingActive: !onboardingStatus?.onboarding_completed
  };
};
