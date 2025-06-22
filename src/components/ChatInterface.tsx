
import React from 'react';
import { MessageList } from './chat/MessageList';
import { ChatInput } from './chat/ChatInput';
import { ChatHeader } from './chat/ChatHeader';
import { ActionButtons } from './chat/ActionButtons';
import { ChatInitializer } from './chat/ChatInitializer';
import { useChatInterface } from '@/hooks/useChatInterface';
import { useJourneyMessageHandler } from '@/hooks/useJourneyMessageHandler';
import { MorvoAIService } from '@/services/morvoAIService';
import { AgentResponse } from '@/services/agent';

interface MessageData {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  processing_time?: number;
  tokens_used?: number;
  suggested_actions?: Array<{
    action: string;
    label: string;
    priority: number;
  }>;
  personality_traits?: any;
  isOnboarding?: boolean;
  contextualInsights?: string[];
  emotionalContext?: any;
  journeyPhase?: string;
}

interface ChatInterfaceProps {
  onContentTypeChange?: (type: string) => void;
  onMessageSent?: (message: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  onContentTypeChange,
  onMessageSent
}) => {
  const {
    messages,
    setMessages,
    input,
    setInput,
    isLoading,
    setIsLoading,
    isConnected,
    setIsConnected,
    connectionChecked,
    setConnectionChecked,
    chatInitialized,
    setChatInitialized,
    messagesEndRef,
    user,
    language,
    isRTL,
    theme,
    toast,
    journey,
    journeyStatus,
    isOnboardingComplete,
    currentPhase,
    journeyLoading,
    greetingPreference,
    enhanceConversation,
    emotionalContext,
    conversationState,
    t,
    handleSidebarContentChange,
    generateJourneyAwareResponse
  } = useChatInterface(onContentTypeChange, onMessageSent);

  const { handleJourneySpecificMessage } = useJourneyMessageHandler();

  const handleSendMessage = async () => {
    if (!input.trim() || !user) {
      return;
    }

    const userMessage: MessageData = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
      journeyPhase: currentPhase
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = input;
    setInput('');
    setIsLoading(true);

    onMessageSent?.(messageText);
    handleSidebarContentChange(messageText);

    try {
      console.log('🤖 Processing journey-aware message - Phase:', currentPhase);
      
      let journeyResponse = await handleJourneySpecificMessage(messageText);
      
      if (!journeyResponse) {
        const context = {
          conversation_history: messages.slice(-3).map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.content
          })),
          journey_context: {
            journey_id: journey?.journey_id,
            current_phase: currentPhase,
            is_onboarding_complete: isOnboardingComplete,
            profile_progress: journeyStatus?.profile_progress || 0,
            greeting_preference: greetingPreference
          },
          emotional_context: emotionalContext,
          conversation_state: conversationState,
          user_id: user.id
        };

        let backendResponse;

        if (isConnected) {
          try {
            const aiResponse = await MorvoAIService.processMessage(messageText, context);
            backendResponse = aiResponse.response;
            console.log('✅ Journey-aware backend response received');
          } catch (backendError) {
            console.warn('⚠️ Backend failed, using local processing:', backendError);
            backendResponse = null;
          }
        }

        if (!backendResponse) {
          console.log('🔄 Using local journey-aware response generation...');
          backendResponse = generateJourneyAwareResponse(messageText);
        }

        journeyResponse = backendResponse;
      }

      const enhancement = await enhanceConversation(messageText, journeyResponse);
      
      const botMessage: MessageData = {
        id: (Date.now() + 1).toString(),
        content: enhancement.personalizedResponse,
        sender: 'agent',
        timestamp: new Date(),
        processing_time: Date.now() - userMessage.timestamp.getTime(),
        isOnboarding: !isOnboardingComplete,
        journeyPhase: currentPhase,
        contextualInsights: enhancement.contextualInsights,
        emotionalContext: emotionalContext
      };

      setMessages(prev => [...prev, botMessage]);

      if (onContentTypeChange) {
        if (messageText.includes('تحليل') || messageText.includes('analytics')) {
          onContentTypeChange('analytics');
        } else if (messageText.includes('محتوى') || messageText.includes('content')) {
          onContentTypeChange('content-creator');
        } else if (messageText.includes('حملة') || messageText.includes('campaign')) {
          onContentTypeChange('campaign');
        } else if (messageText.includes('جدولة') || messageText.includes('calendar')) {
          onContentTypeChange('calendar');
        }
      }

    } catch (error) {
      console.error('❌ Journey chat error:', error);
      
      const errorMessage: MessageData = {
        id: (Date.now() + 1).toString(),
        content: language === 'ar' 
          ? 'عذراً، حدث خطأ في معالجة رسالتك. يرجى المحاولة مرة أخرى.'
          : 'Sorry, there was an error processing your message. Please try again.',
        sender: 'agent',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);

      toast({
        title: language === 'ar' ? 'خطأ في المعالجة' : 'Processing Error',
        description: language === 'ar' 
          ? 'تعذر معالجة الرسالة. يرجى المحاولة مرة أخرى.'
          : 'Unable to process message. Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleActionClick = (action: string, prompt: string) => {
    setInput(prompt);
    if (onContentTypeChange) {
      onContentTypeChange(action);
    }
  };

  const handleCommandResponse = (response: AgentResponse) => {
    console.log('Agent command response:', response);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800" dir={isRTL ? 'rtl' : 'ltr'}>
      <ChatInitializer
        chatInitialized={chatInitialized}
        setChatInitialized={setChatInitialized}
        journeyLoading={journeyLoading}
        user={user}
        messages={messages}
        setMessages={setMessages}
        setIsConnected={setIsConnected}
        setConnectionChecked={setConnectionChecked}
        isOnboardingComplete={isOnboardingComplete}
        currentPhase={currentPhase}
        greetingPreference={greetingPreference}
        journeyStatus={journeyStatus}
        emotionalContext={emotionalContext}
      />

      {/* Fixed Header */}
      <div className="flex-shrink-0">
        <ChatHeader 
          theme={theme}
          isRTL={isRTL}
          content={{
            masterAgent: t.masterAgent,
            clientAgent: '',
            connecting: t.connecting,
            connected: t.connected
          }}
          isConnecting={!connectionChecked}
          clientId={user?.id || ''}
          onToggleTheme={() => {}}
        />
      </div>
      
      {/* Scrollable Messages Area */}
      <div className="flex-1 overflow-hidden">
        <MessageList 
          messages={messages}
          isLoading={isLoading}
          theme={theme}
          isRTL={isRTL}
          thinkingText={t.thinking}
          onCommandResponse={handleCommandResponse}
          language={language}
          onActionClick={handleActionClick}
        />
      </div>
      
      {/* Fixed Input Area */}
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="p-4">
          {messages.length > 0 && messages[messages.length - 1]?.suggested_actions && (
            <div className="mb-3">
              <ActionButtons 
                messageContent={messages[messages.length - 1]?.content || ''}
                language={language}
                theme={theme}
                isRTL={isRTL}
                onActionClick={handleActionClick}
              />
            </div>
          )}
          
          <ChatInput
            input={input}
            isLoading={isLoading}
            theme={theme}
            isRTL={isRTL}
            placeholder={t.placeholder}
            onInputChange={setInput}
            onSend={handleSendMessage}
            onKeyPress={handleKeyPress}
            hasTokens={true}
          />
        </div>
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
};
