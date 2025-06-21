
import React, { useState, useRef, useEffect } from 'react';
import { MessageList } from './chat/MessageList';
import { ChatInput } from './chat/ChatInput';
import { ChatHeader } from './chat/ChatHeader';
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
      connecting: 'جاري الاتصال...',
      connected: 'متصل',
      thinking: 'مورفو يفكر...',
      placeholder: 'اكتب رسالتك هنا...'
    },
    en: {
      masterAgent: 'Morvo AI',
      connecting: 'Connecting...',
      connected: 'Connected',
      thinking: 'Morvo is thinking...',
      placeholder: 'Type your message here...'
    }
  };

  const t = content[language];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat with Railway backend connection
  useEffect(() => {
    const initializeChat = async () => {
      try {
        console.log('🚀 Initializing Railway backend connection...');
        const isHealthy = await MorvoAIService.testConnection();
        setIsConnected(isHealthy);
        
        if (isHealthy && user && messages.length === 0) {
          const welcomeContent = onboardingStatus?.onboarding_completed 
            ? 'مرحباً بك مرة أخرى! كيف يمكنني مساعدتك اليوم في تطوير استراتيجيات التسويق الرقمي؟'
            : 'مرحباً بك في مورفو! 🚀 أنا مساعدك الذكي للتسويق الرقمي. دعني أتعرف عليك أولاً - ما هو اسم شركتك أو مشروعك؟';

          const welcomeMessage: MessageData = {
            id: Date.now().toString(),
            content: welcomeContent,
            sender: 'agent',
            timestamp: new Date(),
            isOnboarding: !onboardingStatus?.onboarding_completed,
            emotionalContext: emotionalContext
          };
          
          setMessages([welcomeMessage]);
          console.log('✅ Chat initialized with Railway backend');
        }
      } catch (error) {
        console.error('❌ Railway connection failed:', error);
        setIsConnected(false);
        
        // Fallback welcome message
        if (user && messages.length === 0) {
          const fallbackMessage: MessageData = {
            id: Date.now().toString(),
            content: 'مرحباً بك في مورفو! أعمل حالياً في وضع محدود. سأحاول مساعدتك قدر الإمكان.',
            sender: 'agent',
            timestamp: new Date(),
          };
          setMessages([fallbackMessage]);
        }
      } finally {
        setConnectionChecked(true);
      }
    };

    if (user) {
      initializeChat();
    }
  }, [user, onboardingStatus, messages.length, emotionalContext]);

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
      console.log('🤖 Processing message with Railway backend...');
      
      // Prepare context for Railway backend
      const context = {
        conversation_history: messages.slice(-3).map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.content
        })),
        onboarding_status: onboardingStatus,
        emotional_context: emotionalContext,
        conversation_state: conversationState,
        user_id: user.id
      };

      let backendResponse;
      let tokensUsed = 0;

      // Try Railway backend first
      if (isConnected) {
        try {
          const aiResponse = await MorvoAIService.processMessage(messageText, context);
          backendResponse = aiResponse.response;
          tokensUsed = aiResponse.tokens_used || 0;
          console.log('✅ Railway backend response received');
        } catch (backendError) {
          console.warn('⚠️ Railway backend failed, using local enhancement:', backendError);
          backendResponse = null;
        }
      }

      // Fallback to local processing if backend unavailable
      if (!backendResponse) {
        console.log('🔄 Using local smart response generation...');
        backendResponse = SmartResponseGenerator.generateContextualResponse(
          messageText, 
          context.conversation_history, 
          onboardingStatus
        );
      }

      // Enhance with conversational intelligence
      const enhancement = await enhanceConversation(messageText, backendResponse);
      
      const botMessage: MessageData = {
        id: (Date.now() + 1).toString(),
        content: enhancement.personalizedResponse,
        sender: 'agent',
        timestamp: new Date(),
        tokens_used: tokensUsed,
        processing_time: Date.now() - userMessage.timestamp.getTime(),
        isOnboarding: conversationState.phase === 'onboarding',
        contextualInsights: enhancement.contextualInsights,
        emotionalContext: emotionalContext
      };

      setMessages(prev => [...prev, botMessage]);

      // Check for insights and handle actions
      const insights = getConversationInsights();
      if (insights.length > 0) {
        console.log('💡 Conversation insights:', insights);
      }

      // Trigger content type changes based on message content
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
      console.error('❌ Chat error:', error);
      
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
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
};
