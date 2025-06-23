
// 🎯 Hook الشات الموحد - محدث للاتصال بـ Railway Backend
import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { UnifiedChatService, type DiagnosticInfo } from '@/services/unifiedChatService';
import type { 
  UnifiedMessageData, 
  UnifiedProcessingStatus, 
  UnifiedConnectionStatus,
  UnifiedChatSettings,
  UnifiedPerformanceMetrics 
} from '@/types/unifiedChat';

export const useUnifiedChat = () => {
  // === الحالة الأساسية ===
  const [messages, setMessages] = useState<UnifiedMessageData[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<UnifiedProcessingStatus>('idle');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionChecked, setConnectionChecked] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticInfo[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<UnifiedConnectionStatus | null>(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [serverIssues, setServerIssues] = useState<string | null>(null);
  
  // === المراجع ===
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // === السياقات ===
  const { user } = useAuth();
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const { toast } = useToast();

  // === إعدادات الواجهة ===
  const [settings, setSettings] = useState<UnifiedChatSettings>({
    theme,
    language,
    isRTL,
    showDiagnostics: false,
    autoConnect: true
  });

  // مزامنة الإعدادات مع تغيّر السياقات
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      theme,
      language,
      isRTL,
    }));
  }, [theme, language, isRTL]);

  // === مقاييس الأداء ===
  const [performanceMetrics, setPerformanceMetrics] = useState<UnifiedPerformanceMetrics>({
    averageResponseTime: 0,
    totalMessages: 0,
    successRate: 0,
    errorRate: 0,
    lastUpdated: new Date()
  });

  // دالة آمنة لحساب معدلات الأداء
  const updatePerformanceMetrics = useCallback((isSuccess: boolean, processingTime: number) => {
    setPerformanceMetrics(prev => {
      const newTotalMessages = prev.totalMessages + 1;
      const newAverageResponseTime = prev.totalMessages === 0 
        ? processingTime 
        : (prev.averageResponseTime * prev.totalMessages + processingTime) / newTotalMessages;
      
      if (isSuccess) {
        const newSuccessRate = prev.totalMessages === 0 
          ? 100 
          : ((prev.successRate * prev.totalMessages) + 100) / newTotalMessages;
        
        return {
          ...prev,
          averageResponseTime: newAverageResponseTime,
          totalMessages: newTotalMessages,
          successRate: newSuccessRate,
          lastUpdated: new Date()
        };
      } else {
        const newErrorRate = prev.totalMessages === 0 
          ? 100 
          : ((prev.errorRate * prev.totalMessages) + 100) / newTotalMessages;
        
        return {
          ...prev,
          averageResponseTime: newAverageResponseTime,
          totalMessages: newTotalMessages,
          errorRate: newErrorRate,
          lastUpdated: new Date()
        };
      }
    });
  }, []);

  // === المحتوى المترجم ===
  const content = {
    ar: {
      masterAgent: 'مورفو الموحد',
      connecting: 'جاري الاتصال...',
      connected: 'متصل بـ Railway',
      thinking: 'مورفو يفكر...',
      placeholder: 'اكتب رسالتك هنا...',
      diagnostics: 'تشخيص',
      reset: 'إعادة تعيين',
      serverDown: 'خادم Railway غير متاح',
      localMode: 'النمط المحلي'
    },
    en: {
      masterAgent: 'Unified Morvo',
      connecting: 'Connecting to Railway...',
      connected: 'Connected to Railway',
      thinking: 'Morvo is thinking...',
      placeholder: 'Type your message here...',
      diagnostics: 'Diagnostics',
      reset: 'Reset',
      serverDown: 'Railway Server Down',
      localMode: 'Local Mode'
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

  // دالة محسّنة لكشف أخطاء CORS والاتصال
  const detectErrorType = useCallback((error: string) => {
    if (error.includes('CORS') || 
        error.includes('Failed to fetch') ||
        error === 'Network error' ||
        error.includes('Access to fetch')) {
      return 'مشكلة CORS - إعدادات خادم Railway';
    }
    
    if (error.includes('502') || error.includes('Bad Gateway')) {
      return 'خادم Railway غير متاح (502)';
    }
    
    if (error.includes('timeout') || error.includes('AbortError')) {
      return 'انتهت مهلة الاتصال مع Railway';
    }
    
    if (error.includes('Authentication') || error.includes('401')) {
      return 'مشكلة في المصادقة';
    }
    
    return 'مشكلة اتصال مع خادم Railway';
  }, []);

  // === تشغيل التشخيص ===
  const runDiagnostics = useCallback(async () => {
    setProcessingStatus('diagnosing');
    setServerIssues(null);
    
    try {
      console.log('🧪 Running Railway backend diagnostics...');
      const results = await UnifiedChatService.runComprehensiveDiagnostics();
      setDiagnosticResults(results);
      setShowDiagnostics(true);
      
      const successfulTest = results.find(r => r.success);
      if (successfulTest) {
        setIsConnected(true);
        setServerIssues(null);
        setConnectionStatus({
          isConnected: true,
          isHealthy: true,
          lastChecked: new Date(),
          status: 'healthy'
        });
        
        toast({
          title: language === 'ar' ? '✅ خادم Railway متصل!' : '✅ Railway Backend Connected!',
          description: language === 'ar' 
            ? `النظام متصل بنجاح مع خادم Railway` 
            : `Successfully connected to Railway backend`,
          variant: "default",
        });
      } else {
        setIsConnected(false);
        
        // تحليل محسّن لنوع المشكلة
        const corsErrors = results.filter(r => r.error && detectErrorType(r.error).includes('CORS'));
        const timeoutErrors = results.filter(r => r.error && detectErrorType(r.error).includes('مهلة'));
        const serverErrors = results.filter(r => r.error && detectErrorType(r.error).includes('502'));
        const authErrors = results.filter(r => r.error && detectErrorType(r.error).includes('مصادقة'));
        
        let issueType = 'مشكلة اتصال مع خادم Railway';
        if (authErrors.length > 0) {
          issueType = 'مشكلة في المصادقة';
        } else if (corsErrors.length > 0) {
          issueType = 'مشكلة CORS - إعدادات خادم Railway';
        } else if (serverErrors.length > 0) {
          issueType = 'خادم Railway غير متاح (502)';
        } else if (timeoutErrors.length > 0) {
          issueType = 'انتهت مهلة الاتصال مع Railway';
        }
        
        setServerIssues(issueType);
        setConnectionStatus({
          isConnected: false,
          isHealthy: false,
          lastChecked: new Date(),
          status: 'failed',
          error: issueType
        });

        toast({
          title: language === 'ar' ? '⚠️ مشكلة في خادم Railway' : '⚠️ Railway Backend Issue',
          description: language === 'ar' 
            ? `${issueType} - سيتم العمل في النمط المحلي` 
            : `${issueType} - Working in local mode`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Railway backend diagnostic failed:', error);
      const errorType = error instanceof Error ? detectErrorType(error.message) : 'فشل في تشخيص خادم Railway';
      setServerIssues(errorType);
    } finally {
      setProcessingStatus('idle');
      setConnectionChecked(true);
    }
  }, [language, toast, detectErrorType]);

  // === إرسال الرسائل عبر Railway Backend ===
  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || !user || isLoading) {
      return;
    }

    const userMessage: UnifiedMessageData = {
      id: Date.now().toString(),
      content: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setProcessingStatus('sending');

    const startTime = Date.now();
    let currentIssueType: string | null = null;

    try {
      const context = {
        conversation_history: messages.slice(-3).map(m => ({
          role: m.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: m.content
        })),
        user_id: user.id,
        user_metadata: user.user_metadata || {},
        business_type: user.user_metadata?.business_type || 'unknown',
        industry: user.user_metadata?.industry || 'unknown'
      };

      console.log('📤 Sending message to Railway backend...');
      const response = await UnifiedChatService.sendMessage(messageText, context);
      const processingTime = Date.now() - startTime;
      
      let botResponse: string;
      let tokensUsed: number = 0;

      if (response.success) {
        botResponse = response.message || response.content;
        tokensUsed = response.tokens_used || 0;
        setIsConnected(true);
        setServerIssues(null);
        currentIssueType = null;
        
        // تحديث مقاييس الأداء للنجاح
        updatePerformanceMetrics(true, processingTime);
        
        console.log('✅ Railway backend response received', {
          processingTime,
          tokensUsed,
          conversationId: response.conversation_id
        });
        
      } else {
        console.warn('⚠️ Railway backend failed:', response.error);
        
        // تحديد نوع المشكلة باستخدام الدالة المحسّنة
        currentIssueType = response.error ? detectErrorType(response.error) : 'مشكلة اتصال مع Railway';
        setServerIssues(currentIssueType);
        setIsConnected(false);
        
        botResponse = response.content || UnifiedChatService.generateSmartFallbackResponse(messageText, context);
        
        // تحديث مقاييس الأداء للخطأ
        updatePerformanceMetrics(false, processingTime);

        toast({
          title: language === 'ar' ? '⚠️ مشكلة تقنية مع Railway' : '⚠️ Railway Backend Issue',
          description: language === 'ar' 
            ? `${currentIssueType} - تم التبديل للنمط المحلي` 
            : `${currentIssueType} - Switched to local mode`,
          variant: "destructive",
        });
      }

      const botMessage: UnifiedMessageData = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'agent',
        timestamp: new Date(),
        processing_time: processingTime,
        tokens_used: tokensUsed,
        metadata: {
          isAuthenticated: response.success,
          endpointUsed: response.success ? 'railway_backend' : 'local_fallback',
          processingSteps: ['sent', 'processed', 'delivered'],
          serverIssue: currentIssueType,
          agents_involved: response.metadata?.agents_involved || [],
          confidence_score: response.confidence_score
        }
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('❌ Railway backend error:', error);
      const processingTime = Date.now() - startTime;
      
      currentIssueType = error instanceof Error ? detectErrorType(error.message) : 'خطأ غير متوقع مع Railway';
      
      const errorMessage: UnifiedMessageData = {
        id: (Date.now() + 1).toString(),
        content: language === 'ar' 
          ? '⚠️ حدث خطأ في الاتصال مع خادم Railway. النظام يعمل الآن في النمط المحلي. يرجى المحاولة مرة أخرى.' 
          : '⚠️ Railway backend connection error. System is now in local mode. Please try again.',
        sender: 'agent',
        timestamp: new Date(),
        metadata: {
          isError: true,
          errorHandled: true,
          serverIssue: currentIssueType
        }
      };

      setMessages(prev => [...prev, errorMessage]);
      setIsConnected(false);
      setServerIssues(currentIssueType);
      
      // تحديث مقاييس الأداء للخطأ
      updatePerformanceMetrics(false, processingTime);
    } finally {
      setIsLoading(false);
      setProcessingStatus('idle');
    }
  }, [messages, user, isLoading, language, toast, detectErrorType, updatePerformanceMetrics]);

  // === إعادة التعيين ===
  const resetChat = useCallback(() => {
    setMessages([]);
    setServerIssues(null);
    UnifiedChatService.resetConversation();
    UnifiedChatService.clearDiagnosticCache();
    setDiagnosticResults([]);
    setShowDiagnostics(false);
    setIsConnected(false);
    
    toast({
      title: language === 'ar' ? 'تم إعادة التعيين' : 'Chat Reset',
      description: language === 'ar' ? 'تم مسح المحادثة وإعادة تعيين النظام' : 'Chat cleared and system reset',
      variant: "default",
    });
  }, [language, toast]);

  // === اختبار الاتصال التلقائي مع Railway ===
  useEffect(() => {
    if (settings.autoConnect && user && !connectionChecked) {
      runDiagnostics();
    }
  }, [settings.autoConnect, user, connectionChecked, runDiagnostics]);

  return {
    // === الحالة ===
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
    diagnosticResults,
    showDiagnostics,
    setShowDiagnostics,
    connectionStatus,
    settings,
    setSettings,
    performanceMetrics,
    serverIssues,
    
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
    runDiagnostics,
    resetChat,
    scrollToBottom
  };
};
