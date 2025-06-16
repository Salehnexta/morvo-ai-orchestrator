
import React from 'react';
import { Bot, User } from "lucide-react";
import AgentCommands from "../AgentCommands";
import { AgentCommand, AgentResponse } from "@/services/agent";

interface MessageProps {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  processing_time?: number;
  cost?: number;
  agents_involved?: string[];
  commands?: AgentCommand[];
  theme: 'light' | 'dark';
  isRTL: boolean;
  onCommandResponse?: (response: AgentResponse) => void;
}

export const Message = ({ 
  id,
  content, 
  sender, 
  timestamp, 
  processing_time, 
  cost, 
  commands,
  theme, 
  isRTL,
  onCommandResponse 
}: MessageProps) => {
  return (
    <div key={id} className="space-y-2">
      <div
        className={`flex gap-3 ${
          sender === 'user' 
            ? isRTL ? 'justify-start' : 'justify-end'
            : isRTL ? 'justify-end' : 'justify-start'
        }`}
      >
        {sender === 'agent' && !isRTL && (
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <Bot className="w-4 h-4 text-white" />
          </div>
        )}
        
        <div
          className={`max-w-[80%] p-4 rounded-2xl shadow-md ${
            sender === 'user'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
              : theme === 'dark'
              ? 'bg-black/40 border border-white/20 text-white'
              : 'bg-white/50 border border-gray-200 text-gray-900'
          }`}
          style={{ direction: isRTL ? 'rtl' : 'ltr' }}
        >
          <div className="whitespace-pre-wrap leading-relaxed">
            {content}
          </div>
          
          <div className={`flex items-center justify-between mt-2 pt-2 border-t text-xs ${
            sender === 'user'
              ? 'border-white/20 text-white/70'
              : theme === 'dark'
              ? 'border-gray-600 text-gray-400'
              : 'border-gray-200 text-gray-500'
          } ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span>{timestamp.toLocaleTimeString()}</span>
            {processing_time && (
              <span>{processing_time}s</span>
            )}
            {cost && (
              <span>${cost.toFixed(4)}</span>
            )}
          </div>
        </div>

        {sender === 'user' && isRTL && (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <User className={`w-4 h-4 ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`} />
          </div>
        )}

        {sender === 'agent' && isRTL && (
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <Bot className="w-4 h-4 text-white" />
          </div>
        )}

        {sender === 'user' && !isRTL && (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <User className={`w-4 h-4 ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`} />
          </div>
        )}
      </div>

      {commands && commands.length > 0 && onCommandResponse && (
        <div className={`${
          isRTL ? 'mr-11' : 'ml-11'
        }`}>
          {commands.map((command) => (
            <AgentCommands
              key={command.id}
              command={command}
              onResponse={onCommandResponse}
              theme={theme}
            />
          ))}
        </div>
      )}
    </div>
  );
};
