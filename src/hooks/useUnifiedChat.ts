
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

  // === مقاييس الأداء ===
  const [performanceMetrics, setPerformanceMetrics] = useState<UnifiedPerformanceMetrics>({
    averageResponseTime: 0,
    totalMessages: 0,
    successRate: 0,
    errorRate: 0,
    lastUpdated: new Date()
  });

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
        
        // تحليل نوع المشكلة
        const corsErrors = results.filter(r => r.error?.includes('CORS'));
        const timeoutErrors = results.filter(r => r.error?.includes('timeout'));
        const serverErrors = results.filter(r => r.error?.includes('502'));
        
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
      setServerIssues('فشل في التشخيص');
    } finally {
      setProcessingStatus('idle');
      setConnectionChecked(true);
    }
  }, [language, toast]);

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

    try {
      const context = {
        conversation_history: messages.slice(-3).map(m => ({
          role: m.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: m.content
        })),
        user_id: user.id,
        user_profile: {
          greeting_preference: 'أستاذ' // يمكن تحسينه لاحقاً
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
        
        // تحديث مقاييس الأداء
        setPerformanceMetrics(prev => ({
          averageResponseTime: (prev.averageResponseTime * prev.totalMessages + processingTime) / (prev.totalMessages + 1),
          totalMessages: prev.totalMessages + 1,
          successRate: ((prev.successRate * prev.totalMessages) + 100) / (prev.totalMessages + 1),
          errorRate: (prev.errorRate * prev.totalMessages) / (prev.totalMessages + 1),
          lastUpdated: new Date()
        }));
        
        console.log('✅ Unified response received', {
          processingTime,
          tokensUsed,
          conversationId: response.conversation_id
        });
        
      } else {
        console.warn('⚠️ Unified service failed:', response.error);
        
        // تحديد نوع المشكلة
        let issueDescription = 'مشكلة اتصال';
        if (response.error?.includes('CORS')) {
          issueDescription = 'مشكلة CORS';
          setServerIssues('مشكلة CORS - إعدادات الخادم');
        } else if (response.error?.includes('502')) {
          issueDescription = 'الخادم غير متاح';
          setServerIssues('الخادم غير متاح (502)');
        } else if (response.error?.includes('timeout')) {
          issueDescription = 'انتهت مهلة الاتصال';
          setServerIssues('انتهت مهلة الاتصال');
        }
        
        botResponse = UnifiedChatService.generateSmartFallbackResponse(messageText, context);
        setIsConnected(false);
        
        // تحديث معدل الأخطاء
        setPerformanceMetrics(prev => ({
          ...prev,
          errorRate: ((prev.errorRate * prev.totalMessages) + 100) / (prev.totalMessages + 1),
          totalMessages: prev.totalMessages + 1,
          lastUpdated: new Date()
        }));

        toast({
          title: language === 'ar' ? '⚠️ مشكلة تقنية' : '⚠️ Technical Issue',
          description: language === 'ar' 
            ? `${issueDescription} - تم التبديل للنمط المحلي` 
            : `${issueDescription} - Switched to local mode`,
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
          serverIssue: serverIssues
        }
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('❌ Unified chat error:', error);
      
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
          serverIssue: 'خطأ غير متوقع'
        }
      };

      setMessages(prev => [...prev, errorMessage]);
      setIsConnected(false);
      setServerIssues('خطأ غير متوقع');
    } finally {
      setIsLoading(false);
      setProcessingStatus('idle');
    }
  }, [messages, user, isLoading, language, toast, serverIssues]);

  // === إعادة التعيين ===
  const resetChat = useCallback(() => {
    setMessages([]);
    setServerIssues(null);
    UnifiedChatService.resetConversation();
    UnifiedChatService.clearDiagnosticCache();
    setDiagnosticResults([]);
    setShowDiagnostics(false);
    setConnection(false);
    
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
