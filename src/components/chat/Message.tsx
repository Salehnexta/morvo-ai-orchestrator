
import React from 'react';
import { Bot, User } from 'lucide-react';
import { useUserGreeting } from '@/hooks/useUserGreeting';

interface MessageProps {
  content: string;
  role: 'user' | 'assistant';
  sender?: 'user' | 'agent';
  isRTL?: boolean;
  timestamp?: string | Date;
  theme?: 'light' | 'dark';
  onCommandResponse?: any;
  language?: string;
  onActionClick?: (action: string, prompt: string) => void;
  processing_time?: number;
  cost?: number;
  agents_involved?: string[];
  commands?: any[];
}

export const Message: React.FC<MessageProps> = ({
  content,
  role,
  sender,
  isRTL = true,
  timestamp,
  theme,
  onCommandResponse,
  language,
  onActionClick,
  processing_time,
  cost,
  agents_involved,
  commands
}) => {
  const { fullGreeting, loading: greetingLoading } = useUserGreeting();
  
  const isUser = role === 'user' || sender === 'user';
  
  // Replace greeting placeholders in assistant messages
  const processedContent = !isUser && !greetingLoading ? 
    content.replace(/مرحباً[^،]*،?/g, fullGreeting + '،') : 
    content;

  // Format timestamp properly
  const formatTimestamp = (ts?: string | Date) => {
    if (!ts) return '';
    try {
      const date = typeof ts === 'string' ? new Date(ts) : ts;
      return date.toLocaleTimeString('ar-SA', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return '';
    }
  };

  const formattedTimestamp = formatTimestamp(timestamp);

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-blue-500 text-white' 
          : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
      }`}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      {/* Message content */}
      <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block p-3 rounded-lg ${
          isUser
            ? 'bg-blue-500 text-white'
            : 'bg-white/10 text-white border border-white/20'
        }`}>
          <div className="whitespace-pre-wrap">{processedContent}</div>
          {formattedTimestamp && (
            <div className={`text-xs opacity-70 mt-1 ${
              isUser ? 'text-blue-100' : 'text-gray-300'
            }`}>
              {formattedTimestamp}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
