
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
        console.log('🚀 Initializing clean chat system...');
        const isHealthy = await MorvoAIService.testConnection();
        setIsConnected(isHealthy);
        
        if (messages.length === 0) {
          let welcomeContent: string;
          
          if (userProfile?.onboarding_completed) {
            const greeting = userProfile?.greeting_preference || 'أستاذ';
            welcomeContent = `مرحباً بك مرة أخرى ${greeting}! 🎯 أنا مورفو، مساعدك الذكي للتسويق الرقمي. كيف يمكنني مساعدتك اليوم؟`;
          } else {
            welcomeContent = 'مرحباً بك في مورفو! 🚀 أنا مساعدك الذكي للتسويق الرقمي. دعني أتعرف عليك أولاً لأقدم لك أفضل خدمة. ما هو اسم شركتك؟';
          }

          const welcomeMessage: MessageData = {
            id: Date.now().toString(),
            content: welcomeContent,
            sender: 'agent',
            timestamp: new Date(),
            metadata: {
              isWelcome: true,
              profileComplete: userProfile?.onboarding_completed || false
            }
          };
          
          setMessages([welcomeMessage]);
          console.log('✅ Clean chat system initialized');
        }
      } catch (error) {
        console.error('❌ Chat initialization failed:', error);
        setIsConnected(false);
        
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
  }, [user, userProfile, messages.length, chatInitialized]);

  return null;
};
