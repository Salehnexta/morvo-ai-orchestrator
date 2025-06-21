
import React, { useState, useRef, useEffect } from 'react';
import { MessageList } from './chat/MessageList';
import { ChatInput } from './chat/ChatInput';
import { ChatHeader } from './chat/ChatHeader';
import { ConnectionStatus } from './chat/ConnectionStatus';
import { TokenCounter } from './chat/TokenCounter';
import { ActionButtons } from './chat/ActionButtons';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { useAdvancedConversation } from '@/hooks/useAdvancedConversation';
import { SmartResponseGenerator } from '@/services/smartResponseGenerator';
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
}

interface ChatInterfaceProps {
  onContentTypeChange?: (type: string) => void;
  onboardingStatus?: any;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  onContentTypeChange, 
  onboardingStatus 
}) => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionChecked, setConnectionChecked] = useState(false);
  const [clientId, setClientId] = useState<string>('');
  const [hasTokens, setHasTokens] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const { toast } = useToast();
  const { 
    enhanceConversation, 
    getConversationInsights, 
    emotionalContext,
    conversationState 
  } = useAdvancedConversation();

  const content = {
    ar: {
      masterAgent: 'مورفو الذكي',
      clientAgent: 'مساعد خدمة العملاء',
      connecting: 'جاري الاتصال...',
      connected: 'متصل',
      thinking: 'مورفو يفكر...',
      placeholder: 'اكتب رسالتك هنا...'
    },
    en: {
      masterAgent: 'Morvo AI',
      clientAgent: 'Customer Service Agent',
      connecting: 'Connecting...',
      connected: 'Connected',
      thinking: 'Morvo is thinking...',
      placeholder: 'Type your message here...'
    }
  };

  const t = content[language];

  useEffect(() => {
    if (user?.id) {
      setClientId(user.id);
    }
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat with smart welcome message
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const isHealthy = await MorvoAIService.testConnection();
        setIsConnected(isHealthy);
        
        if (isHealthy && user && messages.length === 0) {
          const welcomeContent = SmartResponseGenerator.generateWelcomeMessage(onboardingStatus);

          const welcomeMessage: MessageData = {
            id: Date.now().toString(),
            content: welcomeContent,
            sender: 'agent',
            timestamp: new Date(),
            isOnboarding: !onboardingStatus?.onboarding_completed,
            emotionalContext: emotionalContext
          };
          
          setMessages([welcomeMessage]);
        }
      } catch (error) {
        console.error('Connection check failed:', error);
        setIsConnected(false);
      } finally {
        setConnectionChecked(true);
      }
    };

    if (user) {
      initializeChat();
    }
  }, [user, onboardingStatus, messages.length, emotionalContext]);

  const handleTokensUpdated = (remaining: number, limit: number) => {
    setHasTokens(remaining > 0);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !user) {
      return;
    }

    const userMessage: MessageData = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = input;
    setInput('');
    setIsLoading(true);

    try {
      console.log('🤖 Processing message with advanced conversation system...');
      
      // Get base response first
      let baseResponse = '';
      let suggestedActions: Array<{action: string; label: string; priority: number}> = [];
      
      // Try to get AI response for complex queries
      if (messageText.length > 20 || conversationState.conversationDepth > 3) {
        try {
          const context = {
            current_phase: conversationState.phase,
            conversation_history: messages.slice(-3).map(m => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.content
            })),
            user_profile: onboardingStatus,
            emotional_context: emotionalContext
          };

          const aiResponse = await MorvoAIService.sendMessageWithRetry(messageText, context);
          baseResponse = aiResponse.response;
        } catch (aiError) {
          console.log('AI service unavailable, using smart responses');
          baseResponse = 'أفهم طلبك وأعمل على مساعدتك. كيف يمكنني تقديم المساعدة بشكل أفضل؟';
        }
      } else {
        baseResponse = 'أفهم طلبك. كيف يمكنني مساعدتك؟';
      }

      // Enhance the conversation with memory and emotional intelligence
      const enhancement = await enhanceConversation(messageText, baseResponse);
      
      const botMessage: MessageData = {
        id: (Date.now() + 1).toString(),
        content: enhancement.personalizedResponse,
        sender: 'agent',
        timestamp: new Date(),
        suggested_actions: suggestedActions,
        isOnboarding: conversationState.phase === 'onboarding',
        contextualInsights: enhancement.contextualInsights,
        emotionalContext: emotionalContext
      };

      setMessages(prev => [...prev, botMessage]);

      // Check for conversation insights
      const insights = getConversationInsights();
      if (insights.length > 0) {
        console.log('💡 Conversation insights:', insights);
      }

    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage: MessageData = {
        id: (Date.now() + 1).toString(),
        content: language === 'ar' 
          ? 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.'
          : 'Sorry, there was a connection error. Please try again.',
        sender: 'agent',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);

      toast({
        title: language === 'ar' ? 'خطأ في الاتصال' : 'Connection Error',
        description: language === 'ar' 
          ? 'تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.'
          : 'Unable to connect to server. Please check your internet connection.',
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
      <ChatHeader 
        theme={theme}
        isRTL={isRTL}
        content={{
          masterAgent: t.masterAgent,
          clientAgent: t.clientAgent,
          connecting: connectionChecked ? (isConnected ? t.connected : 'Connection Failed') : t.connecting,
          connected: t.connected
        }}
        isConnecting={!connectionChecked || !isConnected}
        clientId={clientId}
        onToggleTheme={() => {}}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
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
        
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <ConnectionStatus 
                isConnecting={!connectionChecked || !isConnected}
                theme={theme}
                content={{
                  connecting: t.connecting,
                  connected: t.connected
                }}
              />
              {clientId && (
                <TokenCounter 
                  theme={theme}
                  clientId={clientId}
                  onTokensUpdated={handleTokensUpdated}
                />
              )}
            </div>
            
            {/* Show emotional context indicator */}
            {emotionalContext.currentEmotion !== 'neutral' && (
              <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-2 py-1">
                😊 {emotionalContext.currentEmotion} - {emotionalContext.adaptationStrategy}
              </div>
            )}
            
            {messages.length > 0 && messages[messages.length - 1]?.suggested_actions && (
              <ActionButtons 
                messageContent={messages[messages.length - 1]?.content || ''}
                language={language}
                theme={theme}
                isRTL={isRTL}
                onActionClick={handleActionClick}
              />
            )}
            
            <ChatInput
              input={input}
              isLoading={isLoading}
              theme={theme}
              isRTL={isRTL}
              placeholder={
                !isConnected
                  ? t.connecting
                  : !hasTokens
                  ? 'لا يوجد رصيد كافٍ من الطلبات'
                  : t.placeholder
              }
              onInputChange={setInput}
              onSend={handleSendMessage}
              onKeyPress={handleKeyPress}
              hasTokens={hasTokens}
            />
          </div>
        </div>
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
};
