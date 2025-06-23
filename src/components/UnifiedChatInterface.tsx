
// 🎯 مكون الشات الموحد - يجمع كل شيء في مكان واحد
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Send, Loader2, Bug, RefreshCw, Bot, User, Wifi, CheckCircle, AlertTriangle, Server } from 'lucide-react';
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

  // === معالجة الإرسال ===
  const handleSendClick = async () => {
    if (!input.trim() || !user || isLoading) return;
    
    const messageText = input;
    setInput('');
    onMessageSent?.(messageText);
    await handleSendMessage(messageText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendClick();
    }
  };

  // === شارة الاتصال ===
  const getConnectionBadge = () => {
    if (!connectionChecked) {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
          <Wifi className="w-3 h-3" />
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
      <Badge variant="outline" className="flex items-center gap-1">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        {isConnected ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
        <span className="text-xs">{isConnected ? t.connected : t.serverDown}</span>
      </Badge>
    );
  };

  // === شارة المعالجة ===
  const getProcessingBadge = () => {
    if (processingStatus === 'sending') {
      return (
        <Badge variant="secondary" className="text-xs animate-pulse">
          جاري الإرسال...
        </Badge>
      );
    }
    
    if (processingStatus === 'diagnosing') {
      return (
        <Badge variant="outline" className="text-xs animate-pulse">
          جاري التشخيص...
        </Badge>
      );
    }
    
    return null;
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* === رأس الصفحة الموحد === */}
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2 border-b">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold flex items-center gap-2">
            <Bot className="w-5 h-5" />
            {t.masterAgent}
          </h1>
          {getConnectionBadge()}
          {getProcessingBadge()}
        </div>
        
        <div className="flex items-center gap-2">
          {/* مقاييس الأداء */}
          {performanceMetrics.totalMessages > 0 && (
            <Badge variant="outline" className="text-xs">
              {performanceMetrics.totalMessages} رسالة
            </Badge>
          )}
          
          {/* أزرار التحكم */}
          <Button
            size="sm"
            variant="outline"
            onClick={runDiagnostics}
            disabled={processingStatus === 'diagnosing'}
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

      {/* === تحذير المشاكل التقنية === */}
      {serverIssues && (
        <Alert className="m-3 border-orange-200 bg-orange-50 dark:bg-orange-950/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>مشكلة تقنية:</strong> {serverIssues} - النظام يعمل في النمط المحلي
            <Button
              size="sm"
              variant="outline"
              onClick={runDiagnostics}
              className="ml-2 h-6 text-xs"
              disabled={processingStatus === 'diagnosing'}
            >
              إعادة محاولة الاتصال
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* === لوحة التشخيص === */}
      {showDiagnostics && diagnosticResults.length > 0 && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800 border-b">
          <div className="text-sm font-medium mb-2">نتائج التشخيص الموحد:</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {diagnosticResults.map((result, i) => (
              <div key={i} className={`p-2 rounded ${
                result.success ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
              }`}>
                <div className="font-medium">{result.format}</div>
                <div className={result.success ? 'text-green-600' : 'text-red-600'}>
                  {result.success ? '✅ نجح' : '❌ فشل'}
                </div>
                {result.latency && <div className="text-gray-500">{result.latency}ms</div>}
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
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* الصورة الرمزية */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : message.metadata?.serverIssue
                    ? 'bg-orange-500 text-white'
                    : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                }`}>
                  {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>

                {/* محتوى الرسالة */}
                <div className={`flex-1 max-w-[80%] ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : message.metadata?.serverIssue
                      ? 'bg-orange-50 dark:bg-orange-950/20 border border-orange-200 text-gray-900 dark:text-gray-100'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    
                    {/* معلومات إضافية */}
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
                          {message.metadata.endpointUsed}
                        </Badge>
                      )}

                      {message.metadata?.serverIssue && (
                        <Badge variant="destructive" className="text-xs px-1 py-0">
                          محلي
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* رسالة التحميل */}
            {isLoading && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div className="flex-1">
                  <div className="inline-block p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>
                        {processingStatus === 'sending' ? 'جاري الإرسال...' : 
                         processingStatus === 'diagnosing' ? 'جاري التشخيص...' : 
                         t.thinking}
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
      
      {/* === منطقة الإدخال === */}
      <div className="border-t p-4">
        <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={serverIssues ? `${t.placeholder} (النمط المحلي)` : t.placeholder}
            className={`flex-1 ${isRTL ? 'text-right' : 'text-left'} ${
              serverIssues ? 'border-orange-300 focus:border-orange-500' : ''
            }`}
            disabled={isLoading || processingStatus !== 'idle'}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
          <Button
            onClick={handleSendClick}
            disabled={!input.trim() || isLoading || processingStatus !== 'idle'}
            className="shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnifiedChatInterface;
