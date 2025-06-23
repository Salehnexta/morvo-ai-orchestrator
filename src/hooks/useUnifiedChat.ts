
// 🎯 Hook الشات الموحد - يدمج جميع الوظائف في مكان واحد
import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { UnifiedChatService } from '@/services/unifiedChatService';
import type { 
  UnifiedMessageData, 
  UnifiedProcessingStatus, 
  UnifiedDiagnosticResult, 
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
  const [diagnosticResults, setDiagnosticResults] = useState<UnifiedDiagnosticResult[]>([]);
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

  // 🆕 إصلاح #1: مزامنة الإعدادات مع تغيّر السياقات
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

  // 🆕 إصلاح #3: دالة آمنة لحساب معدلات الأداء
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
      connected: 'متصل',
      thinking: 'مورفو يفكر...',
      placeholder: 'اكتب رسالتك هنا...',
      diagnostics: 'تشخيص',
      reset: 'إعادة تعيين',
      serverDown: 'الخادم غير متاح',
      localMode: 'النمط المحلي'
    },
    en: {
      masterAgent: 'Unified Morvo',
      connecting: 'Connecting...',
      connected: 'Connected',
      thinking: 'Morvo is thinking...',
      placeholder: 'Type your message here...',
      diagnostics: 'Diagnostics',
      reset: 'Reset',
      serverDown: 'Server Down',
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

  // 🆕 إصلاح #4: دالة محسّنة لكشف أخطاء CORS
  const detectErrorType = useCallback((error: string) => {
    // تحسين كشف CORS - المتصفحات تختلف في رسائل الخطأ
    if (error.includes('CORS') || 
        error.includes('Failed to fetch') ||
        error === 'Network error' ||
        error.includes('Access to fetch')) {
      return 'مشكلة CORS - إعدادات الخادم';
    }
    
    if (error.includes('502') || error.includes('Bad Gateway')) {
      return 'الخادم غير متاح (502)';
    }
    
    if (error.includes('timeout') || error.includes('AbortError')) {
      return 'انتهت مهلة الاتصال';
    }
    
    return 'مشكلة اتصال عامة';
  }, []);

  // === تشغيل التشخيص ===
  const runDiagnostics = useCallback(async () => {
    setProcessingStatus('diagnosing');
    setServerIssues(null);
    
    try {
      console.log('🧪 Running unified diagnostics...');
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
          title: language === 'ar' ? '✅ تم إيجاد تنسيق عمل!' : '✅ Working Format Found!',
          description: language === 'ar' 
            ? `تنسيق "${successfulTest.format}" يعمل بنجاح` 
            : `Format "${successfulTest.format}" is working`,
          variant: "default",
        });
      } else {
        setIsConnected(false);
        
        // تحليل محسّن لنوع المشكلة
        const corsErrors = results.filter(r => r.error && detectErrorType(r.error).includes('CORS'));
        const timeoutErrors = results.filter(r => r.error && detectErrorType(r.error).includes('مهلة'));
        const serverErrors = results.filter(r => r.error && detectErrorType(r.error).includes('502'));
        
        let issueType = 'مشكلة اتصال عامة';
        if (corsErrors.length > 0) {
          issueType = 'مشكلة CORS - إعدادات الخادم';
        } else if (serverErrors.length > 0) {
          issueType = 'الخادم غير متاح (502)';
        } else if (timeoutErrors.length > 0) {
          issueType = 'انتهت مهلة الاتصال';
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
          title: language === 'ar' ? '⚠️ مشكلة في الخادم' : '⚠️ Server Issue',
          description: language === 'ar' 
            ? `${issueType} - سيتم العمل في النمط المحلي` 
            : `${issueType} - Working in local mode`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Unified diagnostic failed:', error);
      const errorType = error instanceof Error ? detectErrorType(error.message) : 'فشل في التشخيص';
      setServerIssues(errorType);
    } finally {
      setProcessingStatus('idle');
      setConnectionChecked(true);
    }
  }, [language, toast, detectErrorType]);

  // === إرسال الرسائل ===
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
    // 🆕 إصلاح #2: متغيّر لحفظ نوع المشكلة خارج الـ closure
    let currentIssueType: string | null = null;

    try {
      const context = {
        conversation_history: messages.slice(-3).map(m => ({
          role: m.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: m.content
        })),
        user_id: user.id,
        user_profile: {
          greeting_preference: 'أستاذ'
        }
      };

      const response = await UnifiedChatService.sendMessage(messageText, context);
      const processingTime = Date.now() - startTime;
      
      let botResponse: string;
      let tokensUsed: number = 0;

      if (response.success) {
        botResponse = response.message;
        tokensUsed = response.tokens_used || 0;
        setIsConnected(true);
        setServerIssues(null);
        currentIssueType = null;
        
        // تحديث مقاييس الأداء للنجاح
        updatePerformanceMetrics(true, processingTime);
        
        console.log('✅ Unified response received', {
          processingTime,
          tokensUsed,
          conversationId: response.conversation_id
        });
        
      } else {
        console.warn('⚠️ Unified service failed:', response.error);
        
        // تحديد نوع المشكلة باستخدام الدالة المحسّنة
        currentIssueType = response.error ? detectErrorType(response.error) : 'مشكلة اتصال';
        setServerIssues(currentIssueType);
        setIsConnected(false);
        
        botResponse = UnifiedChatService.generateSmartFallbackResponse(messageText, context);
        
        // تحديث مقاييس الأداء للخطأ
        updatePerformanceMetrics(false, processingTime);

        toast({
          title: language === 'ar' ? '⚠️ مشكلة تقنية' : '⚠️ Technical Issue',
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
          endpointUsed: response.success ? 'unified_service' : 'local_fallback',
          processingSteps: ['sent', 'processed', 'delivered'],
          serverIssue: currentIssueType
        }
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('❌ Unified chat error:', error);
      const processingTime = Date.now() - startTime;
      
      currentIssueType = error instanceof Error ? detectErrorType(error.message) : 'خطأ غير متوقع';
      
      const errorMessage: UnifiedMessageData = {
        id: (Date.now() + 1).toString(),
        content: language === 'ar' 
          ? '⚠️ حدث خطأ غير متوقع. النظام يعمل الآن في النمط المحلي. يرجى المحاولة مرة أخرى.' 
          : '⚠️ An unexpected error occurred. System is now in local mode. Please try again.',
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

  // === اختبار الاتصال التلقائي ===
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
