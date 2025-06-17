
import React from 'react';
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  theme: 'light' | 'dark';
  isRTL: boolean;
  placeholder: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  hasTokens?: boolean;
}

export const ChatInput = ({ 
  input, 
  isLoading, 
  theme, 
  isRTL, 
  placeholder,
  onInputChange,
  onSend,
  onKeyPress,
  hasTokens = true
}: ChatInputProps) => {
  const isDisabled = isLoading || !hasTokens;
  
  return (
    <div className={`backdrop-blur-md border-t p-4 ${
      theme === 'dark' 
        ? 'bg-black/20 border-white/10' 
        : 'bg-white/20 border-white/30'
    }`}>
      <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyPress}
          placeholder={hasTokens ? placeholder : 'لا يوجد رصيد كافٍ من الطلبات'}
          className={`flex-1 transition-colors ${
            theme === 'dark' 
              ? 'bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500' 
              : 'bg-black/5 border-black/20 text-black placeholder:text-gray-700 focus:border-blue-500'
          } ${isRTL ? 'text-right' : 'text-left'} ${
            !hasTokens ? 'opacity-50' : ''
          }`}
          disabled={isDisabled}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        <Button
          onClick={onSend}
          disabled={!input.trim() || isDisabled}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
      
      {!hasTokens && (
        <div className="mt-2 text-center">
          <span className="text-xs text-red-400">
            نفد رصيد الطلبات - يرجى ترقية باقتك
          </span>
        </div>
      )}
    </div>
  );
};
