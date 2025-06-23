
import React, { useState } from 'react';
import { MessageList } from './chat/MessageList';
import { ChatInput } from './chat/ChatInput';
import { ActionButtons } from './chat/ActionButtons';
import { ChatInitializer } from './chat/ChatInitializer';
import { ChatConnectionStatus } from './chat/ChatConnectionStatus';
import { ChatDiagnosticPanel } from './chat/ChatDiagnosticPanel';
import { useChatInterface } from '@/hooks/useChatInterface';
import { useChatDiagnostics } from '@/hooks/useChatDiagnostics';
import { useChatMessageHandler } from '@/hooks/useChatMessageHandler';
import { AgentResponse } from '@/services/agent';

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
  const {
    messages,
    setMessages,
    input,
    setInput,
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

  const {
    processingStatus,
    setProcessingStatus,
    diagnosticResults,
    showDiagnostics,
    setShowDiagnostics,
    runDiagnostics
  } = useChatDiagnostics(language, setIsConnected, setConnectionChecked);

  const { isLoading, handleSendMessage } = useChatMessageHandler(
    user,
    userProfile,
    messages,
    setMessages,
    setIsConnected,
    emotionalContext,
    conversationState,
    enhanceConversation,
    generateContextualResponse,
    extractUrlFromMessage,
    toast,
    language,
    runDiagnostics
  );

  const handleSendMessageWrapper = async () => {
    if (!input.trim() || !user || isLoading) {
      return;
    }

    const messageText = input;
    setInput('');

    await handleSendMessage(
      messageText,
      onMessageSent,
      handleSidebarContentChange,
      onContentTypeChange,
      setProcessingStatus
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessageWrapper();
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

      {/* Enhanced Header with Diagnostics */}
      <ChatConnectionStatus
        theme={theme}
        isRTL={isRTL}
        t={t}
        connectionChecked={connectionChecked}
        clientId={user?.id || ''}
        isConnected={isConnected}
        processingStatus={processingStatus}
        runDiagnostics={runDiagnostics}
        showDiagnostics={showDiagnostics}
        setShowDiagnostics={setShowDiagnostics}
      />
      
      {/* Diagnostic Results Panel */}
      <ChatDiagnosticPanel
        showDiagnostics={showDiagnostics}
        diagnosticResults={diagnosticResults}
      />
      
      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <MessageList 
          messages={messages}
          isLoading={isLoading}
          theme={theme}
          isRTL={isRTL}
          thinkingText={processingStatus === 'sending' ? 'جاري الإرسال...' : processingStatus === 'diagnosing' ? 'جاري التشخيص...' : t.thinking}
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
            isLoading={isLoading || processingStatus !== 'idle'}
            theme={theme}
            isRTL={isRTL}
            placeholder={
              processingStatus === 'sending' ? 'جاري الإرسال...' : 
              processingStatus === 'diagnosing' ? 'جاري التشخيص...' : 
              t.placeholder
            }
            onInputChange={setInput}
            onSend={handleSendMessageWrapper}
            onKeyPress={handleKeyPress}
            hasTokens={true}
          />
        </div>
      </div>
      
      <div ref={messagesEndRef} />
    </div>
  );
};
