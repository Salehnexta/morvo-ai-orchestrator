import React, { useState, useRef, useEffect } from 'react';
import { MessageList } from './chat/MessageList';
import { ChatInput } from './chat/ChatInput';
import { ChatHeader } from './chat/ChatHeader';
import { ActionButtons } from './chat/ActionButtons';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useJourney } from '@/contexts/JourneyContext';
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
  journeyPhase?: string;
}

interface ChatInterfaceProps {
  onContentTypeChange?: (type: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  onContentTypeChange
}) => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionChecked, setConnectionChecked] = useState(false);
  const [chatInitialized, setChatInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const { toast } = useToast();
  const { 
    journey, 
    journeyStatus, 
    isOnboardingComplete, 
    currentPhase,
    setGreeting,
    analyzeWebsite,
    saveAnswer,
    generateStrategy,
    loading: journeyLoading,
    updateJourneyPhase,
    greetingPreference
  } = useJourney();
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

  // Initialize chat with journey-aware welcome message
  useEffect(() => {
    const initializeChat = async () => {
      if (chatInitialized || journeyLoading || !user) {
        return;
      }

      try {
        console.log('🚀 Initializing journey-aware chat...');
        const isHealthy = await MorvoAIService.testConnection();
        setIsConnected(isHealthy);
        
        if (messages.length === 0) {
          let welcomeContent: string;
          
          if (isOnboardingComplete) {
            const greeting = greetingPreference || journeyStatus?.greeting_preference || 'أستاذ';
            welcomeContent = `مرحباً بك مرة أخرى ${greeting}! 🎯 أنا مورفو، مساعدك الذكي للتسويق الرقمي. كيف يمكنني مساعدتك اليوم؟`;
          } else {
            // Journey-based welcome messages
            switch (currentPhase) {
              case 'welcome':
                welcomeContent = 'مرحباً بك في مورفو! 🚀 أنا مساعدك الذكي للتسويق الرقمي. دعني أتعرف عليك أولاً - كيف تفضل أن أناديك؟ (مثال: أستاذ أحمد، دكتور سارة)';
                break;
              case 'greeting_preference':
                welcomeContent = 'أهلاً وسهلاً! كيف تحب أن أناديك؟ يمكنك أن تقول لي مثلاً: أستاذ أحمد، دكتور سارة، مهندس محمد، أو أي طريقة تفضلها.';
                break;
              case 'website_analysis':
                const savedGreeting = greetingPreference || 'أستاذ';
                welcomeContent = `مرحباً بك ${savedGreeting}! الآن أحتاج لتحليل موقعك الإلكتروني لأفهم نشاطك التجاري بشكل أفضل. يرجى مشاركة رابط موقعك معي.`;
                break;
              case 'profile_completion':
                welcomeContent = 'رائع! بناءً على تحليل موقعك، لدي فهم أولي عن نشاطك. الآن دعني أجمع بعض المعلومات الإضافية لأبني لك استراتيجية تسويقية مخصصة.';
                break;
              default:
                welcomeContent = 'مرحباً بك مرة أخرى! دعنا نكمل رحلتك التسويقية من حيث توقفنا.';
            }
          }

          const welcomeMessage: MessageData = {
            id: Date.now().toString(),
            content: welcomeContent,
            sender: 'agent',
            timestamp: new Date(),
            isOnboarding: !isOnboardingComplete,
            journeyPhase: currentPhase,
            emotionalContext: emotionalContext
          };
          
          setMessages([welcomeMessage]);
          console.log('✅ Journey-aware chat initialized - Phase:', currentPhase);
        }
      } catch (error) {
        console.error('❌ Journey chat initialization failed:', error);
        setIsConnected(false);
        
        // Fallback welcome message
        if (messages.length === 0) {
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
        setChatInitialized(true);
      }
    };

    initializeChat();
  }, [user, isOnboardingComplete, currentPhase, journeyStatus, messages.length, emotionalContext, chatInitialized, journeyLoading, greetingPreference]);

  // Enhanced content type change handler for sidebar integration
  const handleSidebarContentChange = (message: string) => {
    if (onContentTypeChange) {
      // Detect intent from message and trigger appropriate sidebar content
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('تحليل') || lowerMessage.includes('analytics') || lowerMessage.includes('إحصائي')) {
        onContentTypeChange('analytics');
      } else if (lowerMessage.includes('محتوى') || lowerMessage.includes('content') || lowerMessage.includes('منشور')) {
        onContentTypeChange('content-creator');
      } else if (lowerMessage.includes('حملة') || lowerMessage.includes('campaign') || lowerMessage.includes('إعلان')) {
        onContentTypeChange('campaign');
      } else if (lowerMessage.includes('جدولة') || lowerMessage.includes('calendar') || lowerMessage.includes('موعد')) {
        onContentTypeChange('calendar');
      } else if (lowerMessage.includes('رسم') || lowerMessage.includes('chart') || lowerMessage.includes('بياني')) {
        onContentTypeChange('chart');
      } else if (lowerMessage.includes('خطة') || lowerMessage.includes('plan') || lowerMessage.includes('استراتيجية')) {
        onContentTypeChange('plan');
      }
    }
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
      journeyPhase: currentPhase
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = input;
    setInput('');
    setIsLoading(true);

    // Update sidebar content based on user message
    handleSidebarContentChange(messageText);

    try {
      console.log('🤖 Processing journey-aware message - Phase:', currentPhase);
      
      // Handle journey-specific logic
      let journeyResponse = await handleJourneySpecificMessage(messageText);
      
      if (!journeyResponse) {
        // Prepare context for backend with journey information
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

        // Try Railway backend first
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

        // Fallback to local processing
        if (!backendResponse) {
          console.log('🔄 Using local journey-aware response generation...');
          backendResponse = generateJourneyAwareResponse(messageText);
        }

        journeyResponse = backendResponse;
      }

      // Enhance with conversational intelligence
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

      // Handle content type changes based on message content
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

  // Handle journey-specific message processing
  const handleJourneySpecificMessage = async (message: string): Promise<string | null> => {
    if (isOnboardingComplete) return null;

    const cleanMessage = message.trim();

    switch (currentPhase) {
      case 'welcome':
      case 'greeting_preference':
        if (cleanMessage) {
          console.log('🔄 Saving greeting preference:', cleanMessage);
          const success = await setGreeting(cleanMessage);
          if (success) {
            console.log('✅ Greeting saved successfully, transitioning to website analysis');
            // Update local phase immediately to prevent re-prompting
            updateJourneyPhase('website_analysis');
            return `شكراً لك! سأناديك ${cleanMessage} من الآن فصاعداً.

الآن، لأتمكن من تقديم أفضل استراتيجية تسويقية لك، أحتاج لتحليل موقعك الإلكتروني أو نشاطك التجاري.

يرجى مشاركة رابط موقعك الإلكتروني معي.`;
          } else {
            return `حدث خطأ في حفظ تفضيلاتك. دعني أحاول مرة أخرى. كيف تفضل أن أناديك؟`;
          }
        }
        break;

      case 'website_analysis':
        if (cleanMessage.includes('http') || cleanMessage.includes('www') || cleanMessage.includes('.com') || cleanMessage.includes('.sa')) {
          const url = extractUrlFromMessage(cleanMessage);
          if (url) {
            console.log('🔄 Starting website analysis for:', url);
            const success = await analyzeWebsite(url);
            if (success) {
              updateJourneyPhase('analysis_review');
              return `ممتاز! بدأت في تحليل موقعك ${url} باستخدام الذكاء الاصطناعي المتقدم. 

سأقوم بتحليل:
• هيكل الموقع والمحتوى
• الكلمات المفتاحية المستخدمة  
• نقاط القوة والضعف
• الفرص التسويقية المتاحة

سيستغرق التحليل بضع دقائق. في غضون ذلك، دعني أسألك بعض الأسئلة الإضافية لأبني لك استراتيجية شاملة.

ما هو هدفك الأساسي من التسويق الرقمي؟
أ) زيادة الوعي بالعلامة التجارية
ب) توليد عملاء محتملين جدد
ج) زيادة المبيعات المباشرة
د) تحسين خدمة العملاء`;
            }
          }
        }
        return `يرجى مشاركة رابط موقعك الإلكتروني معي لأتمكن من تحليله. مثال: https://example.com`;

      case 'analysis_review':
      case 'profile_completion':
        // Handle profile questions
        if (cleanMessage) {
          console.log('🔄 Saving profile answer:', cleanMessage);
          const success = await saveAnswer('primary_goal', cleanMessage);
          if (success) {
            updateJourneyPhase('professional_analysis');
            return `شكراً لك على هذه المعلومة المهمة!

سؤال آخر: ما هي الميزانية الشهرية المخصصة للتسويق الرقمي؟
أ) أقل من 5,000 ريال
ب) 5,000 - 15,000 ريال  
ج) 15,000 - 50,000 ريال
د) أكثر من 50,000 ريال`;
          }
        }
        break;

      case 'professional_analysis':
        if (cleanMessage) {
          const success = await saveAnswer('marketing_budget', cleanMessage);
          if (success) {
            updateJourneyPhase('strategy_generation');
            return `ممتاز! الآن لدي فهم شامل عن نشاطك التجاري وأهدافك.

سأبدأ في إنشاء استراتيجية تسويقية مخصصة لك تتضمن:
• خطة المحتوى الشهرية
• استراتيجية السيو المحلي
• حملات التسويق المدفوعة
• جدولة المنشورات

هل تريد أن أبدأ في إنشاء الاستراتيجية الآن؟`;
          }
        }
        break;

      case 'strategy_generation':
        if (cleanMessage.includes('نعم') || cleanMessage.includes('ابدأ') || cleanMessage.includes('موافق')) {
          const strategy = await generateStrategy();
          if (strategy) {
            updateJourneyPhase('commitment_activation');
            return `🎯 تم إنشاء استراتيجيتك التسويقية المخصصة بنجاح!

استراتيجيتك تتضمن:
✅ خطة محتوى شهرية مدروسة
✅ كلمات مفتاحية محلية مستهدفة  
✅ جدولة منشورات أسبوعية
✅ حملات إعلانية محسنة
✅ تقارير أداء شهرية

هل أنت مستعد للالتزام بتنفيذ هذه الاستراتيجية؟`;
          }
        }
        break;
    }

    return null;
  };

  const generateJourneyAwareResponse = (message: string): string => {
    // Journey-aware local response generation
    if (!isOnboardingComplete) {
      switch (currentPhase) {
        case 'welcome':
        case 'greeting_preference':
          return 'أهلاً بك! كيف تفضل أن أناديك؟ يمكنك أن تقول لي اسمك أو كيف تحب أن أخاطبك.';
        case 'website_analysis':
          return 'لأتمكن من مساعدتك بشكل أفضل، أحتاج لرابط موقعك الإلكتروني لتحليله.';
        default:
          return 'دعنا نكمل رحلة الإعداد الخاصة بك لأتمكن من تقديم أفضل خدمة لك.';
      }
    }

    return SmartResponseGenerator.generateContextualResponse(message, [], journeyStatus);
  };

  const extractUrlFromMessage = (message: string): string | null => {
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/g;
    const matches = message.match(urlRegex);
    if (matches && matches.length > 0) {
      let url = matches[0];
      if (!url.startsWith('http')) {
        url = 'https://' + url;
      }
      return url;
    }
    return null;
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
