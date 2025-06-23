
// 🎯 مكون الشات الموحد - محدث للاتصال مع Railway Backend
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Send, Loader2, Bug, RefreshCw, Bot, User, Wifi, CheckCircle, AlertTriangle, Server, Zap } from 'lucide-react';
import { useUnifiedChat } from '@/hooks/useUnifiedChat';

interface UnifiedChatInterfaceProps {
  onContentTypeChange?: (type: string) => void;
  onMessageSent?: (message: string) => void;
}

export const UnifiedChatInterface: React.FC<UnifiedChatInterfaceProps> = ({ 
  onContentTypeChange,
  onMessageSent
}) => {
  const {
    // الحالة
    messages,
    input,
    setInput,
    isLoading,
    processingStatus,
    isConnected,
    connectionChecked,
    diagnosticResults,
    showDiagnostics,
    setShowDiagnostics,
    performanceMetrics,
    serverIssues,
    
    // المراجع
    messagesEndRef,
    
    // السياقات
    user,
    language,
    isRTL,
    theme,
    t,
    
    // الوظائف
    handleSendMessage,
    runDiagnostics,
    resetChat,
  } = useUnifiedChat();

  console.log('🔧 UnifiedChatInterface Railway Integration:', {
    messagesCount: messages.length,
    isLoading,
    processingStatus,
    isConnected,
    connectionChecked,
    userExists: !!user,
    serverIssues,
    inputValue: input,
    railwayBackend: true
  });

  // === معالجة الإرسال مع Railway Backend ===
  const handleSendClick = async () => {
    console.log('🚀 Send button clicked (Railway):', {
      input: input.trim(),
      userExists: !!user,
      isLoading,
      processingStatus
    });

    if (!input.trim()) {
      console.warn('⚠️ Empty input, not sending');
      return;
    }
    
    if (!user) {
      console.error('❌ No user found, cannot send message to Railway');
      return;
    }
    
    if (isLoading || processingStatus !== 'idle') {
      console.warn('⚠️ Already processing, not sending');
      return;
    }
    
    const messageText = input.trim();
    console.log('📤 Sending message to Railway backend:', messageText);
    
    setInput('');
    onMessageSent?.(messageText);
    
    try {
      await handleSendMessage(messageText);
      console.log('✅ Message sent successfully to Railway');
    } catch (error) {
      console.error('❌ Error sending message to Railway:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendClick();
    }
  };

  // === شارات الحالة مع Railway ===
  const getConnectionBadge = () => {
    if (!connectionChecked) {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
          <Zap className="w-3 h-3" />
          <span className="text-xs">{t.connecting}</span>
        </Badge>
      );
    }

    if (serverIssues) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <Server className="w-3 h-3" />
          <span className="text-xs">{t.localMode}</span>
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="flex items-center gap-1 border-green-200 text-green-700 bg-green-50">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        {isConnected ? <Zap className="w-3 h-3 text-green-600" /> : <AlertTriangle className="w-3 h-3" />}
        <span className="text-xs font-medium">{isConnected ? t.connected : t.serverDown}</span>
      </Badge>
    );
  };

  const getProcessingBadge = () => {
    if (processingStatus === 'sending') {
      return (
        <Badge variant="secondary" className="text-xs animate-pulse">
          جاري الإرسال إلى Railway...
        </Badge>
      );
    }
    
    if (processingStatus === 'diagnosing') {
      return (
        <Badge variant="outline" className="text-xs animate-pulse">
          جاري تشخيص Railway...
        </Badge>
      );
    }
    
    return null;
  };

  // إضافة رسالة ترحيب محدثة مع Railway
  const displayMessages = messages.length === 0 ? [{
    id: 'welcome',
    content: `مرحباً بك أستاذ ${user?.user_metadata?.first_name || 'العزيز'}! 🌟\n\nأنا مورفو - مساعدك الذكي للتسويق الرقمي المحدث والمتصل بخادم Railway.\n\n${isConnected ? '🚀 النظام متصل بنجاح مع خادم Railway وجاهز لخدمتك!' : '⚠️ يتم الآن محاولة الاتصال بخادم Railway...'}\n\nكيف يمكنني مساعدتك اليوم؟`,
    sender: 'agent' as const,
    timestamp: new Date(),
    metadata: {
      isWelcome: true,
      railwayConnected: isConnected
    }
  }] : messages;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* === رأس الصفحة مع Railway ===  */}
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600" />
            {t.masterAgent}
            <Zap className="w-4 h-4 text-yellow-500" />
          </h1>
          {getConnectionBadge()}
          {getProcessingBadge()}
        </div>
        
        <div className="flex items-center gap-2">
          {performanceMetrics.totalMessages > 0 && (
            <Badge variant="outline" className="text-xs">
              {performanceMetrics.totalMessages} رسالة
            </Badge>
          )}
          
          {isConnected && performanceMetrics.averageResponseTime > 0 && (
            <Badge variant="outline" className="text-xs text-green-600">
              {performanceMetrics.averageResponseTime.toFixed(0)}ms متوسط
            </Badge>
          )}
          
          <Button
            size="sm"
            variant="outline"
            onClick={runDiagnostics}
            disabled={processingStatus === 'diagnosing'}
            className="bg-blue-50 hover:bg-blue-100"
          >
            <RefreshCw className={`w-3 h-3 mr-1 ${processingStatus === 'diagnosing' ? 'animate-spin' : ''}`} />
            {t.diagnostics}
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={resetChat}
          >
            {t.reset}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowDiagnostics(!showDiagnostics)}
          >
            <Bug className="w-3 h-3" />
          </Button>
        </div>
      </CardHeader>

      {/* === تحذير مشاكل Railway === */}
      {serverIssues && (
        <Alert className="m-3 border-orange-200 bg-orange-50 dark:bg-orange-950/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>مشكلة Railway:</strong> {serverIssues} - النظام يعمل في النمط المحلي
            <Button
              size="sm"
              variant="outline"
              onClick={runDiagnostics}
              className="ml-2 h-6 text-xs"
              disabled={processingStatus === 'diagnosing'}
            >
              إعادة محاولة الاتصال بـ Railway
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* === لوحة تشخيص Railway === */}
      {showDiagnostics && diagnosticResults.length > 0 && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800 border-b">
          <div className="text-sm font-medium mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            نتائج تشخيص Railway Backend:
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {diagnosticResults.map((result, i) => (
              <div key={i} className={`p-2 rounded ${
                result.success ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
              }`}>
                <div className="font-medium flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {result.format}
                </div>
                <div className={result.success ? 'text-green-600' : 'text-red-600'}>
                  {result.success ? '✅ Railway متصل' : '❌ Railway فشل'}
                </div>
                {result.latency && <div className="text-gray-500">{result.latency}ms</div>}
                {result.tokens_used && <div className="text-blue-500">{result.tokens_used} tokens</div>}
                {!result.success && result.error && (
                  <div className="text-xs text-red-500 mt-1 truncate" title={result.error}>
                    {result.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* === منطقة الرسائل === */}
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full">
          <div className="space-y-4 p-4">
            {displayMessages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* الصورة الرمزية */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : message.metadata?.serverIssue
                    ? 'bg-orange-500 text-white'
                    : isConnected
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                }`}>
                  {message.sender === 'user' ? <User size={16} /> : 
                   isConnected ? <Zap size={16} /> : <Bot size={16} />}
                </div>

                {/* محتوى الرسالة */}
                <div className={`flex-1 max-w-[80%] ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : message.metadata?.serverIssue
                      ? 'bg-orange-50 dark:bg-orange-950/20 border border-orange-200 text-gray-900 dark:text-gray-100'
                      : isConnected
                      ? 'bg-blue-50 dark:bg-blue-950/20 border border-blue-200 text-gray-900 dark:text-gray-100'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    
                    {/* معلومات إضافية مع Railway */}
                    <div className={`text-xs mt-1 flex items-center gap-2 flex-wrap ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      <span>{message.timestamp.toLocaleTimeString('ar-SA', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}</span>
                      
                      {message.processing_time && (
                        <span>• {message.processing_time}ms</span>
                      )}
                      
                      {message.tokens_used && (
                        <span>• {message.tokens_used} tokens</span>
                      )}
                      
                      {message.metadata?.endpointUsed && (
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          {message.metadata.endpointUsed === 'railway_backend' ? (
                            <span className="flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              Railway
                            </span>
                          ) : (
                            message.metadata.endpointUsed
                          )}
                        </Badge>
                      )}

                      {message.metadata?.serverIssue && (
                        <Badge variant="destructive" className="text-xs px-1 py-0">
                          محلي
                        </Badge>
                      )}

                      {message.metadata?.confidence_score && (
                        <Badge variant="outline" className="text-xs px-1 py-0 text-green-600">
                          {(message.metadata.confidence_score * 100).toFixed(0)}%
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* رسالة التحميل مع Railway */}
            {isLoading && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center">
                  <Zap size={16} className="animate-pulse" />
                </div>
                <div className="flex-1">
                  <div className="inline-block p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <span>
                        {processingStatus === 'sending' ? 'جاري الإرسال إلى Railway...' : 
                         processingStatus === 'diagnosing' ? 'جاري تشخيص Railway...' : 
                         'مورفو يعالج طلبك عبر Railway...'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>
      
      {/* === منطقة الإدخال مع Railway === */}
      <div className="border-t p-4 bg-white dark:bg-gray-800">
        <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Input
            value={input}
            onChange={(e) => {
              console.log('📝 Input changed (Railway):', e.target.value);
              setInput(e.target.value);
            }}
            onKeyDown={handleKeyPress}
            placeholder={
              !user ? 'يرجى تسجيل الدخول أولاً...' :
              serverIssues ? `${t.placeholder} (Railway متقطع)` : 
              isConnected ? `${t.placeholder} (متصل بـ Railway)` :
              t.placeholder
            }
            className={`flex-1 ${isRTL ? 'text-right' : 'text-left'} ${
              serverIssues ? 'border-orange-300 focus:border-orange-500' : 
              isConnected ? 'border-blue-300 focus:border-blue-500' : ''
            }`}
            disabled={!user || isLoading || processingStatus !== 'idle'}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
          <Button
            onClick={handleSendClick}
            disabled={!user || !input.trim() || isLoading || processingStatus !== 'idle'}
            className={isConnected ? "bg-blue-600 hover:bg-blue-700" : "shrink-0"}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <div className="flex items-center gap-1">
                <Send className="w-4 h-4" />
                {isConnected && <Zap className="w-3 h-3" />}
              </div>
            )}
          </Button>
        </div>
        
        {/* معلومات الحالة مع Railway */}
        {!user && (
          <div className="mt-2 text-center text-sm text-red-500">
            يرجى تسجيل الدخول لاستخدام الشات مع Railway
          </div>
        )}
        
        {user && isConnected && (
          <div className="mt-2 text-center text-sm text-green-600 flex items-center justify-center gap-1">
            <Zap className="w-3 h-3" />
            متصل بنجاح مع خادم Railway
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedChatInterface;
