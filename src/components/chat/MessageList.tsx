
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
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full px-4 pb-4" ref={scrollAreaRef}>
        <div className="space-y-4 pt-4">
          {messages.map((message) => (
            <Message
              key={message.id}
              content={message.content}
              role={message.sender === 'user' ? 'user' : 'assistant'}
              sender={message.sender}
              timestamp={message.timestamp}
              theme={theme}
              isRTL={isRTL}
              onCommandResponse={onCommandResponse}
              language={language}
              onActionClick={onActionClick}
              processing_time={message.processing_time}
              cost={message.cost}
              agents_involved={message.agents_involved}
              commands={message.commands}
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
