
import { useCallback } from 'react';
import { useConversationalMemory } from './useConversationalMemory';
import { useConversationalFlow } from './useConversationalFlow';

interface ConversationEnhancement {
  personalizedResponse: string;
  contextualInsights: string[];
  suggestedFollowUps: string[];
  memoryUpdates: Array<{
    type: string;
    content: any;
    importance: number;
  }>;
}

export const useAdvancedConversation = () => {
  const {
    memories,
    emotionalContext,
    saveMemory,
    updateEmotionalContext,
    getRelevantMemories,
    analyzeMessageEmotion,
    getPersonalizedResponse
  } = useConversationalMemory();

  const { conversationState, processMessage } = useConversationalFlow();

  const enhanceConversation = useCallback(async (
    userMessage: string,
    baseResponse: string
  ): Promise<ConversationEnhancement> => {
    // Analyze user's emotional state
    const emotionAnalysis = analyzeMessageEmotion(userMessage);
    
    // Update emotional context if confidence is high enough
    if (emotionAnalysis.confidence > 0.6) {
      await updateEmotionalContext(
        emotionAnalysis.emotion,
        emotionAnalysis.confidence,
        emotionAnalysis.triggers,
        userMessage
      );
    }

    // Get relevant memories for context
    const relevantMemories = getRelevantMemories(userMessage, 3);
    
    // Generate contextual insights
    const contextualInsights: string[] = [];
    
    if (relevantMemories.length > 0) {
      relevantMemories.forEach(memory => {
        if (memory.type === 'preference') {
          contextualInsights.push(`تذكرت أنك تفضل: ${JSON.stringify(memory.content)}`);
        } else if (memory.type === 'goal') {
          contextualInsights.push(`هدفك المحدد سابقاً: ${memory.content}`);
        }
      });
    }

    // Personalize the response based on emotional context
    const personalizedResponse = getPersonalizedResponse(baseResponse);

    // Generate suggested follow-ups based on conversation state
    const suggestedFollowUps: string[] = [];
    
    switch (conversationState.phase) {
      case 'onboarding':
        suggestedFollowUps.push(
          'هل تحتاج مساعدة في شيء محدد؟',
          'دعني أعرف المزيد عن أهدافك'
        );
        break;
      case 'chat':
        suggestedFollowUps.push(
          'كيف يمكنني مساعدتك أكثر؟',
          'هل تريد تحليل بياناتك؟',
          'ما رأيك في إنشاء محتوى جديد؟'
        );
        break;
    }

    // Determine what memories to save
    const memoryUpdates: Array<{
      type: string;
      content: any;
      importance: number;
    }> = [];

    // Save user preferences if detected
    if (userMessage.includes('أفضل') || userMessage.includes('أحب')) {
      memoryUpdates.push({
        type: 'preference',
        content: { preference: userMessage, timestamp: new Date() },
        importance: 7
      });
    }

    // Save goals if mentioned
    if (userMessage.includes('هدف') || userMessage.includes('أريد')) {
      memoryUpdates.push({
        type: 'goal',
        content: userMessage,
        importance: 8
      });
    }

    // Save important context
    if (conversationState.conversationDepth > 5) {
      memoryUpdates.push({
        type: 'context',
        content: {
          message: userMessage,
          response: personalizedResponse,
          phase: conversationState.phase,
          emotion: emotionAnalysis.emotion
        },
        importance: 6
      });
    }

    // Execute memory updates
    memoryUpdates.forEach(async (update) => {
      await saveMemory(update.type as any, update.content, update.importance);
    });

    return {
      personalizedResponse,
      contextualInsights,
      suggestedFollowUps,
      memoryUpdates
    };
  }, [
    analyzeMessageEmotion,
    updateEmotionalContext,
    getRelevantMemories,
    getPersonalizedResponse,
    conversationState,
    saveMemory
  ]);

  const getConversationInsights = useCallback(() => {
    const insights = [];
    
    // Emotional insights
    if (emotionalContext.satisfactionLevel < 0.6) {
      insights.push({
        type: 'emotional',
        message: 'يبدو أن المستخدم يحتاج المزيد من المساعدة',
        priority: 'high'
      });
    }

    // Memory insights
    const recentMemories = memories.filter(m => 
      new Date().getTime() - m.lastAccessed.getTime() < 24 * 60 * 60 * 1000
    );
    
    if (recentMemories.length > 0) {
      insights.push({
        type: 'memory',
        message: `تم تذكر ${recentMemories.length} معلومة مهمة من المحادثات السابقة`,
        priority: 'medium'
      });
    }

    return insights;
  }, [emotionalContext, memories]);

  return {
    enhanceConversation,
    getConversationInsights,
    emotionalContext,
    memories: memories.slice(0, 10), // Limit for performance
    conversationState
  };
};
