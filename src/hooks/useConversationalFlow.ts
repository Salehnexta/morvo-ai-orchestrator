
import { useState, useCallback } from 'react';
import { useSmartChat } from './useSmartChat';

interface ConversationalFlowState {
  currentTopic: string;
  conversationDepth: number;
  userIntents: string[];
  lastInteraction: Date;
}

export const useConversationalFlow = () => {
  const [flowState, setFlowState] = useState<ConversationalFlowState>({
    currentTopic: '',
    conversationDepth: 0,
    userIntents: [],
    lastInteraction: new Date()
  });

  const smartChat = useSmartChat();

  const processMessage = useCallback(async (message: string) => {
    // Update flow state
    setFlowState(prev => ({
      ...prev,
      conversationDepth: prev.conversationDepth + 1,
      lastInteraction: new Date()
    }));

    // Process with smart chat
    const contextualPrompt = smartChat.getContextualPrompt(message);
    
    return {
      processedMessage: contextualPrompt,
      flowState,
      suggestions: smartChat.suggestions
    };
  }, [smartChat, flowState]);

  const resetFlow = useCallback(() => {
    setFlowState({
      currentTopic: '',
      conversationDepth: 0,
      userIntents: [],
      lastInteraction: new Date()
    });
  }, []);

  return {
    flowState,
    processMessage,
    resetFlow,
    isSmartModeActive: smartChat.isSmartModeActive
  };
};
