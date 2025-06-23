
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { useAdvancedConversation } from '@/hooks/useAdvancedConversation';
import { UserProfileService } from '@/services/userProfileService';
import { SERankingService } from '@/services/seRankingService';
import { IntelligentAgentService } from '@/services/intelligentAgentService';
import { SmartResponseGenerator } from '@/services/smartResponseGenerator';
import { UnifiedDiagnostics } from '@/services/unifiedDiagnostics';
import { MessageData, ProcessingStatus, DiagnosticResult, ConnectionStatus } from '@/types/chat';

export const useChatSystem = (
  onContentTypeChange?: (type: string) => void,
  onMessageSent?: (message: string) => void
) => {
  // State management
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>('idle');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionChecked, setConnectionChecked] = useState(false);
  const [chatInitialized, setChatInitialized] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticResult[]>([]);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Contexts
  const { user } = useAuth();
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const { toast } = useToast();
  const { 
    enhanceConversation, 
    emotionalContext,
    conversationState 
  } = useAdvancedConversation();

  // Content translations
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

  // Auto-scroll to bottom
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

  // Run diagnostics
  const runDiagnostics = async () => {
    setProcessingStatus('diagnosing');
    try {
      console.log('🧪 Running unified diagnostic tests...');
      const results = await UnifiedDiagnostics.runComprehensiveDiagnostics();
      setDiagnosticResults(results);
      setShowDiagnostics(true);
      
      const successfulTest = results.find(r => r.success);
      if (successfulTest) {
        setIsConnected(true);
        setConnectionStatus({
          isConnected: true,
          isHealthy: true,
          lastChecked: new Date(),
          status: 'healthy'
        });
        
        toast({
          title: language === 'ar' ? 'تم إيجاد تنسيق عمل!' : 'Working Format Found!',
          description: language === 'ar' 
            ? `تنسيق "${successfulTest.format}" يعمل بنجاح` 
            : `Format "${successfulTest.format}" is working`,
          variant: "default",
        });
      } else {
        setIsConnected(false);
        setConnectionStatus({
          isConnected: false,
          isHealthy: false,
          lastChecked: new Date(),
          status: 'failed',
          error: 'All diagnostic tests failed'
        });
        
        toast({
          title: language === 'ar' ? 'فشل جميع الاختبارات' : 'All Tests Failed',
          description: language === 'ar' 
            ? 'يرجى التحقق من إعدادات الخادم'
            : 'Please check server configuration',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Unified diagnostic tests failed:', error);
    } finally {
      setProcessingStatus('idle');
      setConnectionChecked(true);
    }
  };

  // URL extraction from messages
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

  // Contextual response generation
  const generateContextualResponse = async (message: string): Promise<string> => {
    if (!user) {
      return SmartResponseGenerator.generateContextualResponse(message, [], null);
    }

    try {
      return await IntelligentAgentService.generateContextualResponse(
        user.id, 
        message, 
        messages.slice(-3)
      );
    } catch (error) {
      console.error('❌ Error generating intelligent response:', error);
      return SmartResponseGenerator.generateContextualResponse(message, [], userProfile);
    }
  };

  // Sidebar content change handler
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

  // Send message handler
  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || !user || isLoading) {
      return;
    }

    const userMessage: MessageData = {
      id: Date.now().toString(),
      content: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setProcessingStatus('sending');

    onMessageSent?.(messageText);
    handleSidebarContentChange(messageText);

    try {
      // Handle website URL analysis
      const websiteUrl = extractUrlFromMessage(messageText);
      if (websiteUrl && (!userProfile?.website_url || userProfile.website_url !== websiteUrl)) {
        console.log('🔍 New website detected, analyzing...');
        await UserProfileService.saveUserProfile(user.id, { website_url: websiteUrl });
        await SERankingService.updateUserSeoData(user.id, websiteUrl);
      }

      // Handle profile updates for onboarding
      if (!userProfile?.onboarding_completed) {
        if (!userProfile?.company_name && messageText.trim()) {
          await UserProfileService.saveUserProfile(user.id, { 
            company_name: messageText.trim() 
          });
        }
      }

      // Send message with unified service
      const context = {
        conversation_history: messages.slice(-3).map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.content
        })),
        user_profile: userProfile,
        emotional_context: emotionalContext,
        conversation_state: conversationState,
        user_id: user.id
      };

      const response = await UnifiedDiagnostics.sendMessage(messageText, context);
      
      let botResponse: string;
      let processingTime: number = 0;
      let tokensUsed: number = 0;

      if (response.success) {
        botResponse = response.message;
        processingTime = response.processing_time_ms || 0;
        tokensUsed = response.tokens_used || 0;
        setIsConnected(true);
        
        console.log('✅ Unified service response received', {
          processingTime,
          tokensUsed,
          conversationId: response.conversation_id
        });
        
      } else {
        console.warn('⚠️ Unified service failed, using local response:', response.error);
        
        // Auto-run diagnostics on 422 errors
        if (response.error?.includes('422') || response.error?.includes('Unprocessable')) {
          toast({
            title: language === 'ar' ? 'خطأ في التنسيق' : 'Format Error',
            description: language === 'ar' 
              ? 'تشغيل التشخيص التلقائي...'
              : 'Running automatic diagnostics...',
            variant: "destructive",
          });
          
          setTimeout(() => runDiagnostics(), 1000);
        }
        
        botResponse = await generateContextualResponse(messageText);
        processingTime = 150;
        setIsConnected(false);
      }

      // Enhance the conversation
      const enhancement = await enhanceConversation(messageText, botResponse);
      
      const botMessage: MessageData = {
        id: (Date.now() + 1).toString(),
        content: enhancement.personalizedResponse,
        sender: 'agent',
        timestamp: new Date(),
        processing_time: processingTime,
        tokens_used: tokensUsed,
        metadata: {
          contextualInsights: enhancement.contextualInsights,
          emotionalContext: emotionalContext,
          isAuthenticated: response.success,
          endpointUsed: response.success ? 'unified_service' : 'local_fallback',
          processingSteps: ['sent', 'processed', 'enhanced']
        }
      };

      setMessages(prev => [...prev, botMessage]);

      // Success notification
      if (response.success && processingTime > 0) {
        toast({
          title: language === 'ar' ? 'تم بنجاح!' : 'Success!',
          description: language === 'ar' 
            ? `تمت المعالجة في ${processingTime}ms` 
            : `Processed in ${processingTime}ms`,
          variant: "default",
        });
      }

    } catch (error) {
      console.error('❌ Chat error:', error);
      
      const errorMessage: MessageData = {
        id: (Date.now() + 1).toString(),
        content: language === 'ar' 
          ? 'أعتذر، حدث خطأ مؤقت. يرجى المحاولة مرة أخرى أو تشغيل التشخيص.' 
          : 'Sorry, a temporary error occurred. Please try again or run diagnostics.',
        sender: 'agent',
        timestamp: new Date(),
        metadata: {
          isError: true,
          errorHandled: true
        }
      };

      setMessages(prev => [...prev, errorMessage]);
      setIsConnected(false);

      toast({
        title: language === 'ar' ? 'خطأ مؤقت' : 'Temporary Error',
        description: language === 'ar' 
          ? 'يرجى المحاولة مرة أخرى أو تشغيل التشخيص'
          : 'Please try again or run diagnostics',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProcessingStatus('idle');
    }
  };

  return {
    // State
    messages,
    setMessages,
    input,
    setInput,
    isLoading,
    processingStatus,
    isConnected,
    setIsConnected,
    connectionChecked,
    setConnectionChecked,
    chatInitialized,
    setChatInitialized,
    userProfile,
    diagnosticResults,
    showDiagnostics,
    setShowDiagnostics,
    connectionStatus,
    
    // Refs
    messagesEndRef,
    
    // Context data
    user,
    language,
    isRTL,
    theme,
    toast,
    enhanceConversation,
    emotionalContext,
    conversationState,
    t,
    
    // Methods
    handleSendMessage,
    runDiagnostics,
    scrollToBottom,
    handleSidebarContentChange,
    extractUrlFromMessage,
    generateContextualResponse
  };
};
