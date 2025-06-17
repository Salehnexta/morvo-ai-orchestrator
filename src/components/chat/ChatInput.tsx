
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
    <div className="p-6 border-t border-white/10">
      <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyPress}
          placeholder={hasTokens ? placeholder : 'لا يوجد رصيد كافٍ من الطلبات'}
          className={`flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:bg-white/15 rounded-xl px-4 py-3 ${isRTL ? 'text-right' : 'text-left'} ${
            !hasTokens ? 'opacity-50' : ''
          }`}
          disabled={isDisabled}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        <Button
          onClick={onSend}
          disabled={!input.trim() || isDisabled}
          className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 rounded-xl px-4 py-3 h-auto"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
      
      {!hasTokens && (
        <div className="mt-3 text-center">
          <span className="text-xs text-red-300">
            نفد رصيد الطلبات - يرجى ترقية باقتك
          </span>
        </div>
      )}
    </div>
  );
};
