
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { useAdvancedConversation } from '@/hooks/useAdvancedConversation';
import { SmartResponseGenerator } from '@/services/smartResponseGenerator';
import { EnhancedMorvoAIService } from '@/services/enhancedMorvoAIService';
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
  const [connectionStatus, setConnectionStatus] = useState<'excellent' | 'slow' | 'down'>('down');
  const [diagnosticInfo, setDiagnosticInfo] = useState<any>(null);
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
      placeholder: 'اكتب رسالتك هنا...',
      connectionStatus: {
        excellent: 'ممتاز',
        slow: 'بطيء', 
        down: 'معطل'
      }
    },
    en: {
      masterAgent: 'Morvo AI',
      connecting: 'Connecting...',
      connected: 'Connected',
      thinking: 'Morvo is thinking...',
      placeholder: 'Type your message here...',
      connectionStatus: {
        excellent: 'Excellent',
        slow: 'Slow',
        down: 'Down'
      }
    }
  };

  const t = content[language];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load user profile and perform initial diagnostics
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        const profile = await UserProfileService.getUserProfile(user.id);
        setUserProfile(profile);
        
        // Perform initial health check
        try {
          const healthCheck = await EnhancedMorvoAIService.performHealthCheck();
          setDiagnosticInfo(healthCheck);
          updateConnectionStatus(healthCheck);
        } catch (error) {
          console.warn('Initial health check failed:', error);
          setConnectionStatus('down');
        }
      }
    };
    loadUserProfile();
  }, [user]);

  // Periodic health checks
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const healthCheck = await EnhancedMorvoAIService.performHealthCheck();
        setDiagnosticInfo(healthCheck);
        updateConnectionStatus(healthCheck);
      } catch (error) {
        console.warn('Periodic health check failed:', error);
        setConnectionStatus('down');
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const updateConnectionStatus = (diagnostic: any) => {
    if (!diagnostic) {
      setConnectionStatus('down');
      setIsConnected(false);
      return;
    }

    if (diagnostic.overallStatus === 'healthy') {
      const avgLatency = (diagnostic.testEndpoint?.latency + (diagnostic.authEndpoint?.latency || 0)) / 2;
      if (avgLatency < 2000) {
        setConnectionStatus('excellent');
      } else {
        setConnectionStatus('slow');
      }
      setIsConnected(true);
    } else if (diagnostic.overallStatus === 'degraded') {
      setConnectionStatus('slow');
      setIsConnected(true);
    } else {
      setConnectionStatus('down');
      setIsConnected(false);
    }
    setConnectionChecked(true);
  };

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
    const lowerMessage = message.toLowerCase();
    
    // Enhanced contextual responses in Arabic
    if (lowerMessage.includes('موقع') || lowerMessage.includes('حللت') || lowerMessage.includes('تحليل')) {
      if (userProfile?.website_url) {
        return `أستاذ ${userProfile.company_name ? userProfile.company_name : 'صديقي'}، 
        
لقد قمت بتحليل موقعك ${userProfile.website_url} مسبقاً! 🔍

**ملخص التحليل:**
• الموقع مُسجّل في نظامي ✅
• البيانات محفوظة ومحدثة 📊
• جاري العمل على تحسينات إضافية 🚀

هل تريد تحديث التحليل أم لديك استفسار محدد حول الموقع؟

*ملاحظة: النظام يعمل حالياً في الوضع المحلي - جميع البيانات محفوظة وآمنة* 🔒`;
      } else {
        return `مرحباً أستاذ ${user?.user_metadata?.first_name || 'صديقي'}! 👋

لم أحلل موقعك بعد. لكي أقوم بتحليل شامل، أحتاج رابط موقعك الإلكتروني.

**ما سأقوم بتحليله:**
• سرعة الموقع وأداءه ⚡
• تحسين محركات البحث (SEO) 🔍  
• تجربة المستخدم (UX) 👥
• المحتوى والكلمات المفتاحية 📝
• المنافسين والفرص 📈

شاركني رابط موقعك وسأبدأ التحليل فوراً! 🚀`;
      }
    }
    
    if (lowerMessage.includes('مرحبا') || lowerMessage.includes('السلام') || lowerMessage.includes('اهلا')) {
      return `أهلاً وسهلاً أستاذ ${user?.user_metadata?.first_name || 'صديقي'}! 🌟

أنا مورفو - مساعدك الذكي للتسويق الرقمي المحدث بـ GPT-4o 🤖

**كيف يمكنني مساعدتك اليوم؟**
• تحليل موقعك الإلكتروني 🌐
• تحسين محركات البحث 🔍
• استراتيجيات التسويق 📈
• إنشاء محتوى جذاب ✨

اكتب لي ما تريد وسأساعدك خطوة بخطوة! 💪`;
    }

    if (!isOnboardingComplete) {
      return `مرحباً بك في مورفو! 🚀

دعني أساعدك في إعداد ملفك التجاري أولاً لأقدم لك خدمة مخصصة.

**ما أحتاجه منك:**
• اسم شركتك أو مشروعك 🏢
• نوع نشاطك التجاري 💼
• رابط موقعك (إن وُجد) 🌐

ابدأ بمشاركة اسم شركتك، وسأتولى الباقي! ✨`;
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
    connectionStatus,
    diagnosticInfo,
    scrollToBottom,
    handleSidebarContentChange,
    extractUrlFromMessage,
    generateContextualResponse
  };
};
