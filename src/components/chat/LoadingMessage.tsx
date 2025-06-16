
import React from 'react';
import { Bot, Loader2 } from "lucide-react";

interface LoadingMessageProps {
  theme: 'light' | 'dark';
  isRTL: boolean;
  thinkingText: string;
}

export const LoadingMessage = ({ theme, isRTL, thinkingText }: LoadingMessageProps) => {
  return (
    <div className={`flex gap-3 ${isRTL ? 'justify-end' : 'justify-start'}`}>
      {!isRTL && (
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      <div className={`p-4 rounded-2xl shadow-md ${
        theme === 'dark' 
          ? 'bg-black/40 border border-white/20' 
          : 'bg-white/50 border border-gray-200'
      }`}>
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''} ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{thinkingText}</span>
        </div>
      </div>
      {isRTL && (
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
};
