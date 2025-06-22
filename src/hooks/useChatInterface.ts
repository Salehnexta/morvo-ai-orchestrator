
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { useAdvancedConversation } from '@/hooks/useAdvancedConversation';
import { SmartResponseGenerator } from '@/services/smartResponseGenerator';
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

export const useChatInterface = (
  onContentTypeChange?: (type: string) => void,
  onMessageSent?: (message: string) => void
) => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionChecked, setConnectionChecked] = useState(false);
  const [chatInitialized, setChatInitialized] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const { toast } = useToast();
  const { 
    enhanceConversation, 
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

  // Load user profile
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        const profile = await UserProfileService.getUserProfile(user.id);
        setUserProfile(profile);
      }
    };
    loadUserProfile();
  }, [user]);

  const handleSidebarContentChange = (message: string) => {
    if (onContentTypeChange) {
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

  const generateContextualResponse = (message: string): string => {
    const isOnboardingComplete = userProfile?.onboarding_completed || false;
    
    if (!isOnboardingComplete) {
      return 'مرحباً بك في مورفو! دعني أساعدك في إعداد ملفك التجاري أولاً. ما هو اسم شركتك؟';
    }

    return SmartResponseGenerator.generateContextualResponse(message, [], userProfile);
  };

  return {
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
    userProfile,
    enhanceConversation,
    emotionalContext,
    conversationState,
    t,
    scrollToBottom,
    handleSidebarContentChange,
    extractUrlFromMessage,
    generateContextualResponse
  };
};
