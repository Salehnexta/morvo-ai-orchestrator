
import { useEffect } from 'react';
import { MorvoAIService } from '@/services/morvoAIService';

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

interface ChatInitializerProps {
  chatInitialized: boolean;
  setChatInitialized: (value: boolean) => void;
  journeyLoading: boolean;
  user: any;
  messages: MessageData[];
  setMessages: (messages: MessageData[]) => void;
  setIsConnected: (connected: boolean) => void;
  setConnectionChecked: (checked: boolean) => void;
  isOnboardingComplete: boolean;
  currentPhase: string;
  greetingPreference: string;
  journeyStatus: any;
  emotionalContext: any;
}

export const ChatInitializer = ({
  chatInitialized,
  setChatInitialized,
  journeyLoading,
  user,
  messages,
  setMessages,
  setIsConnected,
  setConnectionChecked,
  isOnboardingComplete,
  currentPhase,
  greetingPreference,
  journeyStatus,
  emotionalContext
}: ChatInitializerProps) => {
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

  return null;
};
