import React, { useState } from 'react';
import { MessageList } from './chat/MessageList';
import { ChatInput } from './chat/ChatInput';
import { ChatHeader } from './chat/ChatHeader';
import { ActionButtons } from './chat/ActionButtons';
import { ChatInitializer } from './chat/ChatInitializer';
import { EnhancedDebugPanel } from './chat/EnhancedDebugPanel';
import { useChatInterface } from '@/hooks/useChatInterface';
import { EnhancedMorvoAIService } from '@/services/enhancedMorvoAIService';
import { UserProfileService } from '@/services/userProfileService';
import { SERankingService } from '@/services/seRankingService';
import { AgentResponse } from '@/services/agent';
import { Bug, Wifi, WifiOff, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MessageData {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  processing_time?: number;
  tokens_used?: number;
  metadata?: any;
}

interface ChatInterfaceProps {
  onContentTypeChange?: (type: string) => void;
  onMessageSent?: (message: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  onContentTypeChange,
  onMessageSent
}) => {
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  
  const {
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
    handleSidebarContentChange,
    extractUrlFromMessage,
    generateContextualResponse
  } = useChatInterface(onContentTypeChange, onMessageSent);

  const handleSendMessage = async () => {
    if (!input.trim() || !user) {
      return;
    }

    const userMessage: MessageData = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = input;
    setInput('');
    setIsLoading(true);

    onMessageSent?.(messageText);
    handleSidebarContentChange(messageText);

    try {
      console.log('🤖 Processing message with enhanced diagnostic system');
      
      // Check for website URL and analyze if provided
      const websiteUrl = extractUrlFromMessage(messageText);
      if (websiteUrl && (!userProfile?.website_url || userProfile.website_url !== websiteUrl)) {
        console.log('🔍 New website detected, analyzing...');
        await UserProfileService.saveUserProfile(user.id, { website_url: websiteUrl });
        await SERankingService.updateUserSeoData(user.id, websiteUrl);
      }

      // Handle profile updates based on message content
      if (!userProfile?.onboarding_completed) {
        if (!userProfile?.company_name && messageText.trim()) {
          await UserProfileService.saveUserProfile(user.id, { 
            company_name: messageText.trim() 
          });
        }
      }

      let botResponse: string;
      let processingTime: number = 0;
      let endpointUsed: string = 'unknown';
      let diagnosticInfo: any = null;

      try {
        // Use the enhanced service with full diagnostics
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

        const enhancedResponse = await EnhancedMorvoAIService.processMessageWithDiagnostics(messageText, context);
        botResponse = enhancedResponse.response;
        processingTime = enhancedResponse.processing_time || 0;
        endpointUsed = enhancedResponse.endpoint_used;
        diagnosticInfo = enhancedResponse.diagnostic_info;
        
        console.log('✅ Enhanced AI response received', {
          processingTime,
          confidence: enhancedResponse.confidence_score,
          tokensUsed: enhancedResponse.tokens_used,
          endpointUsed,
          diagnosticInfo
        });

        // Update connection status based on diagnostic
        if (diagnosticInfo?.overall_status === 'healthy' || diagnosticInfo?.overall_status === 'degraded') {
          setIsConnected(true);
        }
        
      } catch (backendError) {
        console.warn('⚠️ Enhanced backend failed, using local response:', backendError);
        // Fix: Await the async function call
        botResponse = await generateContextualResponse(messageText);
        processingTime = 100;
        endpointUsed = 'local_fallback';
        setIsConnected(false);
      }

      const enhancement = await enhanceConversation(messageText, botResponse);
      
      const botMessage: MessageData = {
        id: (Date.now() + 1).toString(),
        content: enhancement.personalizedResponse,
        sender: 'agent',
        timestamp: new Date(),
        processing_time: processingTime,
        metadata: {
          contextualInsights: enhancement.contextualInsights,
          emotionalContext: emotionalContext,
          endpointUsed,
          diagnosticInfo,
          isEnhanced: true,
          connectionHealth: diagnosticInfo?.overall_status || 'unknown'
        }
      };

      setMessages(prev => [...prev, botMessage]);

      // Update sidebar based on message content
      if (onContentTypeChange) {
        if (messageText.includes('تحليل') || messageText.includes('analytics')) {
          onContentTypeChange('analytics');
        } else if (messageText.includes('محتوى') || messageText.includes('content')) {
          onContentTypeChange('content-creator');
        } else if (messageText.includes('حملة') || messageText.includes('campaign')) {
          onContentTypeChange('campaign');
        } else if (messageText.includes('جدولة') || messageText.includes('calendar')) {
          onContentTypeChange('calendar');
        }
      }

    } catch (error) {
      console.error('❌ Enhanced chat error:', error);
      
      const errorMessage: MessageData = {
        id: (Date.now() + 1).toString(),
        content: language === 'ar' 
          ? 'عذراً، حدث خطأ في معالجة رسالتك. تم تشغيل التشخيص المتقدم - يرجى المحاولة مرة أخرى.'
          : 'Sorry, there was an error processing your message. Advanced diagnostics activated - please try again.',
        sender: 'agent',
        timestamp: new Date(),
        metadata: {
          isError: true,
          errorMode: true,
          advancedDiagnostics: true
        }
      };

      setMessages(prev => [...prev, errorMessage]);

      toast({
        title: language === 'ar' ? 'خطأ في المعالجة المحسنة' : 'Enhanced Processing Error',
        description: language === 'ar' 
          ? 'تعذر معالجة الرسالة. تم تفعيل التشخيص المتقدم.'
          : 'Unable to process message. Advanced diagnostics activated.',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleActionClick = (action: string, prompt: string) => {
    setInput(prompt);
    if (onContentTypeChange) {
      onContentTypeChange(action);
    }
  };

  const handleCommandResponse = (response: AgentResponse) => {
    console.log('Agent command response:', response);
  };

  const getConnectionStatusBadge = () => {
    const statusConfig = {
      excellent: { color: 'bg-green-500', text: t.connectionStatus.excellent, icon: <Wifi className="w-3 h-3" /> },
      slow: { color: 'bg-yellow-500', text: t.connectionStatus.slow, icon: <Activity className="w-3 h-3" /> },
      down: { color: 'bg-red-500', text: t.connectionStatus.down, icon: <WifiOff className="w-3 h-3" /> }
    };

    const config = statusConfig[connectionStatus];
    
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <div className={`w-2 h-2 rounded-full ${config.color} animate-pulse`}></div>
        {config.icon}
        <span className="text-xs">{config.text}</span>
      </Badge>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800" dir={isRTL ? 'rtl' : 'ltr'}>
      <ChatInitializer
        chatInitialized={chatInitialized}
        setChatInitialized={setChatInitialized}
        user={user}
        messages={messages}
        setMessages={setMessages}
        setIsConnected={setIsConnected}
        setConnectionChecked={setConnectionChecked}
        userProfile={userProfile}
      />

      {/* Enhanced Header with Connection Status */}
      <div className="flex-shrink-0">
        <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <ChatHeader 
              theme={theme}
              isRTL={isRTL}
              content={{
                masterAgent: t.masterAgent,
                clientAgent: '',
                connecting: t.connecting,
                connected: t.connected
              }}
              isConnecting={!connectionChecked}
              clientId={user?.id || ''}
              onToggleTheme={() => {}}
            />
            {getConnectionStatusBadge()}
          </div>
          <div className="flex items-center gap-2">
            {diagnosticInfo && (
              <div className="text-xs text-gray-500">
                {diagnosticInfo.test_endpoint_latency}ms
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDebugPanel(!showDebugPanel)}
              className="opacity-50 hover:opacity-100"
            >
              <Bug className="w-4 h-4" />
              <span className="ml-1 text-xs">Enhanced</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Scrollable Messages Area */}
      <div className="flex-1 overflow-hidden">
        <MessageList 
          messages={messages}
          isLoading={isLoading}
          theme={theme}
          isRTL={isRTL}
          thinkingText={t.thinking}
          onCommandResponse={handleCommandResponse}
          language={language}
          onActionClick={handleActionClick}
        />
      </div>
      
      {/* Fixed Input Area */}
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="p-4">
          {messages.length > 0 && messages[messages.length - 1]?.metadata?.suggested_actions && (
            <div className="mb-3">
              <ActionButtons 
                messageContent={messages[messages.length - 1]?.content || ''}
                language={language}
                theme={theme}
                isRTL={isRTL}
                onActionClick={handleActionClick}
              />
            </div>
          )}
          
          <ChatInput
            input={input}
            isLoading={isLoading}
            theme={theme}
            isRTL={isRTL}
            placeholder={t.placeholder}
            onInputChange={setInput}
            onSend={handleSendMessage}
            onKeyPress={handleKeyPress}
            hasTokens={true}
          />
        </div>
      </div>
      
      <div ref={messagesEndRef} />
      
      {/* Enhanced Debug Panel */}
      <EnhancedDebugPanel 
        isVisible={showDebugPanel}
        onClose={() => setShowDebugPanel(false)}
      />
    </div>
  );
};
