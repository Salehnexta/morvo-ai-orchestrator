
import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { DirectGPT4Service } from '@/services/directGPT4Service';
import { UserProfileService } from '@/services/userProfileService';

interface GPT4MessageData {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  processing_time?: number;
  tokens_used?: number;
  metadata?: any;
}

export const useDirectGPT4Chat = () => {
  // === الحالة الأساسية ===
  const [messages, setMessages] = useState<GPT4MessageData[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionChecked, setConnectionChecked] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  
  // === المراجع ===
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // === السياقات ===
  const { user } = useAuth();
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const { toast } = useToast();

  // === المحتوى المترجم ===
  const content = {
    ar: {
      masterAgent: 'مورفو GPT-4',
      connecting: 'جاري الاتصال بـ GPT-4...',
      connected: 'متصل بـ GPT-4',
      thinking: 'مورفو يفكر...',
      placeholder: 'اكتب رسالتك هنا...'
    },
    en: {
      masterAgent: 'Morvo GPT-4',
      connecting: 'Connecting to GPT-4...',
      connected: 'Connected to GPT-4',
      thinking: 'Morvo is thinking...',
      placeholder: 'Type your message here...'
    }
  };

  const t = content[language];

  // === التمرير التلقائي ===
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // تحميل ملف المستخدم
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        try {
          const profile = await UserProfileService.getUserProfile(user.id);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      }
    };
    loadUserProfile();
  }, [user]);

  // === اختبار الاتصال ===
  const testConnection = useCallback(async () => {
    try {
      setIsConnected(false);
      console.log('🔗 Testing GPT-4 connection...');
      
      const isWorking = await DirectGPT4Service.testConnection();
      setIsConnected(isWorking);
      setConnectionChecked(true);
      
      toast({
        title: isWorking 
          ? (language === 'ar' ? '✅ GPT-4 متصل!' : '✅ GPT-4 Connected!') 
          : (language === 'ar' ? '⚠️ فشل الاتصال بـ GPT-4' : '⚠️ GPT-4 Connection Failed'),
        description: isWorking 
          ? (language === 'ar' ? 'تم الاتصال بنجاح مع GPT-4' : 'Successfully connected to GPT-4')
          : (language === 'ar' ? 'لا يمكن الاتصال بـ GPT-4' : 'Cannot connect to GPT-4'),
        variant: isWorking ? "default" : "destructive",
      });
      
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      setIsConnected(false);
      setConnectionChecked(true);
    }
  }, [language, toast]);

  // === إرسال الرسائل ===
  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || !user || isLoading) {
      return;
    }

    const userMessage: GPT4MessageData = {
      id: Date.now().toString(),
      content: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const startTime = Date.now();

    try {
      const context = {
        user_profile: userProfile,
        user_id: user.id,
        user_metadata: user.user_metadata || {},
        business_type: userProfile?.business_type || 'unknown',
        industry: userProfile?.industry || 'unknown'
      };

      // تحضير تاريخ المحادثة
      const conversationHistory = messages.slice(-6).map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.content
      }));

      console.log('📤 Sending message to GPT-4...');
      const response = await DirectGPT4Service.sendMessage(messageText, context, conversationHistory);
      const processingTime = Date.now() - startTime;
      
      let botResponse: string;
      let tokensUsed: number = 0;

      if (response.success) {
        botResponse = response.response;
        tokensUsed = response.tokens_used || 0;
        setIsConnected(true);
        
        console.log('✅ GPT-4 response received', {
          processingTime,
          tokensUsed,
          conversationId: response.conversation_id
        });
        
      } else {
        console.warn('⚠️ GPT-4 failed:', response.error);
        botResponse = response.fallback_response || 'أعتذر، حدث خطأ مؤقت. يرجى المحاولة مرة أخرى.';
        setIsConnected(false);

        toast({
          title: language === 'ar' ? '⚠️ مشكلة مع GPT-4' : '⚠️ GPT-4 Issue',
          description: language === 'ar' 
            ? 'تم استخدام الرد الاحتياطي' 
            : 'Using fallback response',
          variant: "destructive",
        });
      }

      const botMessage: GPT4MessageData = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'agent',
        timestamp: new Date(),
        processing_time: processingTime,
        tokens_used: tokensUsed,
        metadata: {
          isGPT4: true,
          success: response.success,
          model: response.model || 'gpt-4o',
          confidence_score: response.confidence_score || 0.9
        }
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('❌ GPT-4 error:', error);
      
      const errorMessage: GPT4MessageData = {
        id: (Date.now() + 1).toString(),
        content: language === 'ar' 
          ? '⚠️ حدث خطأ في الاتصال مع GPT-4. يرجى المحاولة مرة أخرى خلال لحظات.' 
          : '⚠️ GPT-4 connection error. Please try again in a moment.',
        sender: 'agent',
        timestamp: new Date(),
        metadata: {
          isError: true,
          errorHandled: true
        }
      };

      setMessages(prev => [...prev, errorMessage]);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, [messages, user, isLoading, language, toast, userProfile]);

  // === إعادة التعيين ===
  const resetChat = useCallback(() => {
    setMessages([]);
    
    toast({
      title: language === 'ar' ? 'تم إعادة التعيين' : 'Chat Reset',
      description: language === 'ar' ? 'تم مسح المحادثة' : 'Chat cleared',
      variant: "default",
    });
  }, [language, toast]);

  // === اختبار الاتصال التلقائي ===
  useEffect(() => {
    if (user && !connectionChecked) {
      testConnection();
    }
  }, [user, connectionChecked, testConnection]);

  return {
    // === الحالة ===
    messages,
    setMessages,
    input,
    setInput,
    isLoading,
    isConnected,
    connectionChecked,
    userProfile,
    
    // === المراجع ===
    messagesEndRef,
    
    // === السياقات ===
    user,
    language,
    isRTL,
    theme,
    toast,
    t,
    
    // === الوظائف ===
    handleSendMessage,
    testConnection,
    resetChat,
    scrollToBottom
  };
};
