
import { useEffect } from 'react';
import { MorvoAIService } from '@/services/morvoAIService';
import { UserProfileService } from '@/services/userProfileService';

interface MessageData {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  processing_time?: number;
  tokens_used?: number;
  metadata?: any;
}

interface ChatInitializerProps {
  chatInitialized: boolean;
  setChatInitialized: (value: boolean) => void;
  user: any;
  messages: MessageData[];
  setMessages: (messages: MessageData[]) => void;
  setIsConnected: (connected: boolean) => void;
  setConnectionChecked: (checked: boolean) => void;
  userProfile: any;
}

export const ChatInitializer = ({
  chatInitialized,
  setChatInitialized,
  user,
  messages,
  setMessages,
  setIsConnected,
  setConnectionChecked,
  userProfile
}: ChatInitializerProps) => {
  useEffect(() => {
    const initializeChat = async () => {
      if (chatInitialized || !user) {
        return;
      }

      try {
        console.log('🚀 Initializing enhanced chat system...');
        
        // Test connection with comprehensive diagnostics
        const isHealthy = await MorvoAIService.testConnection();
        setIsConnected(isHealthy);
        
        console.log('🔍 Connection test result:', isHealthy);
        console.log('📊 Health status:', MorvoAIService.getHealthStatus());
        console.log('💬 Conversation ID:', MorvoAIService.getConversationId());
        
        if (messages.length === 0) {
          let welcomeContent: string;
          
          if (userProfile?.onboarding_completed) {
            const greeting = userProfile?.greeting_preference || 'أستاذ';
            welcomeContent = `مرحباً بك مرة أخرى ${greeting}! 🎯 أنا مورفو، مساعدك الذكي للتسويق الرقمي المحدث بـ GPT-4o. كيف يمكنني مساعدتك اليوم؟`;
          } else {
            welcomeContent = 'مرحباً بك في مورفو المحدث! 🚀 أنا مساعدك الذكي للتسويق الرقمي المدعوم بـ GPT-4o. دعني أتعرف عليك أولاً لأقدم لك أفضل خدمة. ما هو اسم شركتك؟';
          }

          const welcomeMessage: MessageData = {
            id: Date.now().toString(),
            content: welcomeContent,
            sender: 'agent',
            timestamp: new Date(),
            metadata: {
              isWelcome: true,
              profileComplete: userProfile?.onboarding_completed || false,
              connectionHealthy: isHealthy,
              conversationId: MorvoAIService.getConversationId()
            }
          };
          
          setMessages([welcomeMessage]);
          console.log('✅ Enhanced chat system initialized successfully');
        }
      } catch (error) {
        console.error('❌ Chat initialization failed:', error);
        setIsConnected(false);
        
        if (messages.length === 0) {
          const fallbackMessage: MessageData = {
            id: Date.now().toString(),
            content: 'مرحباً بك في مورفو! نظام الدردشة يعمل حالياً في وضع الاختبار. قد تكون الاستجابات أبطأ قليلاً، لكنني سأبذل قصارى جهدي لمساعدتك.',
            sender: 'agent',
            timestamp: new Date(),
            metadata: {
              isOfflineMode: true
            }
          };
          setMessages([fallbackMessage]);
        }
      } finally {
        setConnectionChecked(true);
        setChatInitialized(true);
      }
    };

    initializeChat();
  }, [user, userProfile, messages.length, chatInitialized]);

  return null;
};
