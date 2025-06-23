
import React, { useState } from 'react';
import { MessageList } from './chat/MessageList';
import { ChatInput } from './chat/ChatInput';
import { ChatHeader } from './chat/ChatHeader';
import { ActionButtons } from './chat/ActionButtons';
import { ChatInitializer } from './chat/ChatInitializer';
import { useChatInterface } from '@/hooks/useChatInterface';
import { SimpleRailwayAuth } from '@/services/simpleRailwayAuth';
import { UserProfileService } from '@/services/userProfileService';
import { SERankingService } from '@/services/seRankingService';
import { AgentResponse } from '@/services/agent';
import { CheckCircle, AlertCircle, Wifi } from 'lucide-react';
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
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'sending'>('idle');
  
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
    setProcessingStatus('sending');

    onMessageSent?.(messageText);
    handleSidebarContentChange(messageText);

    try {
      // Handle website URL analysis if provided
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

      // Send message using simplified Railway service
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

      const railwayResponse = await SimpleRailwayAuth.sendMessage(messageText, context);
      
      let botResponse: string;
      let processingTime: number = 0;
      let tokensUsed: number = 0;

      if (railwayResponse.success) {
        botResponse = railwayResponse.message;
        processingTime = railwayResponse.processing_time_ms || 0;
        tokensUsed = railwayResponse.tokens_used || 0;
        setIsConnected(true);
        
        console.log('✅ Railway authenticated response received', {
          processingTime,
          tokensUsed,
          conversationId: railwayResponse.conversation_id
        });
        
      } else {
        console.warn('⚠️ Railway service failed, using local response:', railwayResponse.error);
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
          isAuthenticated: railwayResponse.success,
          endpointUsed: railwayResponse.success ? 'railway_auth' : 'local_fallback',
          processingSteps: ['sent', 'processed', 'enhanced']
        }
      };

      setMessages(prev => [...prev, botMessage]);

      // Handle sidebar content changes
      if (onContentTypeChange) {
        const lowerMessage = messageText.toLowerCase();
        if (lowerMessage.includes('تحليل') || lowerMessage.includes('افحص') || lowerMessage.includes('موقع')) {
          onContentTypeChange('analytics');
        } else if (lowerMessage.includes('محتوى') || lowerMessage.includes('منشور') || lowerMessage.includes('كتابة')) {
          onContentTypeChange('content-creator');
        } else if (lowerMessage.includes('حملة') || lowerMessage.includes('إعلان') || lowerMessage.includes('تسويق')) {
          onContentTypeChange('campaign');
        } else if (lowerMessage.includes('جدولة') || lowerMessage.includes('تاريخ') || lowerMessage.includes('موعد')) {
          onContentTypeChange('calendar');
        }
      }

      // Success notification
      if (railwayResponse.success && processingTime > 0) {
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
          ? 'أعتذر، حدث خطأ مؤقت. يرجى المحاولة مرة أخرى.' 
          : 'Sorry, a temporary error occurred. Please try again.',
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
          ? 'يرجى المحاولة مرة أخرى'
          : 'Please try again',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProcessingStatus('idle');
      setConnectionChecked(true);
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

  const getConnectionBadge = () => {
    if (!connectionChecked) {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
          <Wifi className="w-3 h-3" />
          <span className="text-xs">جاري الاتصال...</span>
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
        {isConnected ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
        <span className="text-xs">{isConnected ? 'متصل' : 'غير متصل'}</span>
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

      {/* Simplified Header */}
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
            {getConnectionBadge()}
            {processingStatus === 'sending' && (
              <Badge variant="secondary" className="text-xs animate-pulse">
                جاري الإرسال...
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <MessageList 
          messages={messages}
          isLoading={isLoading}
          theme={theme}
          isRTL={isRTL}
          thinkingText={processingStatus === 'sending' ? 'جاري الإرسال...' : t.thinking}
          onCommandResponse={handleCommandResponse}
          language={language}
          onActionClick={handleActionClick}
        />
      </div>
      
      {/* Input Area */}
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
            placeholder={processingStatus === 'sending' ? 'جاري الإرسال...' : t.placeholder}
            onInputChange={setInput}
            onSend={handleSendMessage}
            onKeyPress={handleKeyPress}
            hasTokens={true}
          />
        </div>
      </div>
      
      <div ref={messagesEndRef} />
    </div>
  );
};
