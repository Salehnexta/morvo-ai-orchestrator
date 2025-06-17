
import React, { useRef, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from './Message';
import { LoadingMessage } from './LoadingMessage';
import { AgentCommand, AgentResponse } from "@/services/agent";

interface MessageData {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  processing_time?: number;
  cost?: number;
  agents_involved?: string[];
  commands?: AgentCommand[];
}

interface MessageListProps {
  messages: MessageData[];
  isLoading: boolean;
  theme: 'light' | 'dark';
  isRTL: boolean;
  thinkingText: string;
  onCommandResponse: (response: AgentResponse) => void;
  language?: string;
  onActionClick?: (action: string, prompt: string) => void;
}

export const MessageList = ({ 
  messages, 
  isLoading, 
  theme, 
  isRTL, 
  thinkingText, 
  onCommandResponse,
  language = 'en',
  onActionClick
}: MessageListProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex-1 p-4">
      <ScrollArea className="h-[calc(100vh-200px)]" ref={scrollAreaRef}>
        <div className="space-y-4 pb-4">
          {messages.map((message) => (
            <Message
              key={message.id}
              {...message}
              theme={theme}
              isRTL={isRTL}
              onCommandResponse={onCommandResponse}
              language={language}
              onActionClick={onActionClick}
            />
          ))}
          
          {isLoading && (
            <LoadingMessage 
              theme={theme}
              isRTL={isRTL}
              thinkingText={thinkingText}
            />
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
