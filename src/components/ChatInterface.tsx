import React, { useState, useRef, useEffect } from 'react';
import { MessageList } from './chat/MessageList';
import { ChatInput } from './chat/ChatInput';
import { ChatHeader } from './chat/ChatHeader';
import { ConnectionStatus } from './chat/ConnectionStatus';
import { TokenCounter } from './chat/TokenCounter';
import { ActionButtons } from './chat/ActionButtons';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AgentResponse } from '@/services/agent';

interface MessageData {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  processing_time?: number;
  cost?: number;
  agents_involved?: string[];
}

interface ChatInterfaceProps {
  onContentTypeChange?: (type: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onContentTypeChange }) => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionChecked, setConnectionChecked] = useState(false);
  const [clientId, setClientId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, session } = useAuth();
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const { toast } = useToast();

  const content = {
    ar: {
      masterAgent: 'مورفو الذكي',
      clientAgent: 'مساعد خدمة العملاء',
      connecting: 'جاري الاتصال...',
      connected: 'متصل',
      thinking: 'مورفو يفكر...',
      placeholder: 'اكتب رسالتك هنا...'
    },
    en: {
      masterAgent: 'Morvo AI',
      clientAgent: 'Customer Service Agent',
      connecting: 'Connecting...',
      connected: 'Connected',
      thinking: 'Morvo is thinking...',
      placeholder: 'Type your message here...'
    }
  };

  const t = content[language];

  useEffect(() => {
    if (user?.id) {
      setClientId(user.id);
    }
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (!session?.access_token) {
        setIsConnected(false);
        setConnectionChecked(true);
        return;
      }

      try {
        const response = await fetch('https://morvo-ai-orchestrator-production.up.railway.app/health', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        });

        const isHealthy = response.ok;
        setIsConnected(isHealthy);
        
        if (!isHealthy) {
          console.error('Backend connection failed:', response.status);
        }
      } catch (error) {
        console.error('Connection check failed:', error);
        setIsConnected(false);
      } finally {
        setConnectionChecked(true);
      }
    };

    checkConnection();
  }, [session]);

  const handleSendMessage = async () => {
    if (!input.trim() || !session?.access_token) {
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

    try {
      const response = await fetch('https://morvo-ai-orchestrator-production.up.railway.app/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          user_id: user?.id,
          client_id: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const botMessage: MessageData = {
        id: (Date.now() + 1).toString(),
        content: data.response || 'Sorry, I could not process your request.',
        sender: 'agent',
        timestamp: new Date(),
        processing_time: data.processing_time,
        cost: data.cost,
        agents_involved: data.agents_involved,
      };

      setMessages(prev => [...prev, botMessage]);

      // Update content panel based on response
      if (onContentTypeChange && data.content_type) {
        onContentTypeChange(data.content_type);
      }

    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage: MessageData = {
        id: (Date.now() + 1).toString(),
        content: language === 'ar' 
          ? 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.'
          : 'Sorry, there was a connection error. Please try again.',
        sender: 'agent',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);

      // Only show critical errors to user
      toast({
        title: language === 'ar' ? 'خطأ في الاتصال' : 'Connection Error',
        description: language === 'ar' 
          ? 'تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.'
          : 'Unable to connect to server. Please check your internet connection.',
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

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800" dir={isRTL ? 'rtl' : 'ltr'}>
      <ChatHeader 
        theme={theme}
        isRTL={isRTL}
        content={{
          masterAgent: t.masterAgent,
          clientAgent: t.clientAgent,
          connecting: connectionChecked ? (isConnected ? t.connected : 'Connection Failed') : t.connecting,
          connected: t.connected
        }}
        isConnecting={!connectionChecked || !isConnected}
        clientId={clientId}
        onToggleTheme={() => {}}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
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
        
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <ConnectionStatus 
                isConnecting={!connectionChecked || !isConnected}
                theme={theme}
                content={{
                  connecting: t.connecting,
                  connected: t.connected
                }}
              />
              {clientId && (
                <TokenCounter 
                  theme={theme}
                  clientId={clientId}
                />
              )}
            </div>
            
            {messages.length > 0 && (
              <ActionButtons 
                messageContent={messages[messages.length - 1]?.content || ''}
                language={language}
                theme={theme}
                isRTL={isRTL}
                onActionClick={handleActionClick}
              />
            )}
            
            <ChatInput
              input={input}
              isLoading={isLoading}
              theme={theme}
              isRTL={isRTL}
              placeholder={
                !isConnected
                  ? t.connecting
                  : t.placeholder
              }
              onInputChange={setInput}
              onSend={handleSendMessage}
              onKeyPress={handleKeyPress}
              hasTokens={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
