
import React from 'react';
import { Bot, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectionStatus } from './ConnectionStatus';
import { TokenCounter } from './TokenCounter';

interface ChatHeaderProps {
  theme: 'light' | 'dark';
  isRTL: boolean;
  content: {
    masterAgent: string;
    clientAgent: string;
    connecting: string;
    connected: string;
  };
  isConnecting: boolean;
  clientId?: string;
  onToggleTheme: () => void;
  onTokensUpdated?: (remaining: number, limit: number) => void;
}

export const ChatHeader = ({ 
  theme, 
  isRTL, 
  content, 
  isConnecting, 
  clientId,
  onToggleTheme,
  onTokensUpdated
}: ChatHeaderProps) => {
  return (
    <div className={`backdrop-blur-md border-b p-4 ${
      theme === 'dark' 
        ? 'bg-black/20 border-white/10' 
        : 'bg-white/20 border-white/30'
    }`}>
      <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h1 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {content.masterAgent}
            </h1>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {content.clientAgent}
            </p>
          </div>
        </div>

        <div className={`${isRTL ? 'mr-auto' : 'ml-auto'} flex items-center gap-3`}>
          {/* Token Counter */}
          {clientId && (
            <TokenCounter 
              theme={theme}
              clientId={clientId}
              onTokensUpdated={onTokensUpdated}
            />
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleTheme}
            className={`${
              theme === 'dark' 
                ? 'text-white hover:bg-gray-800' 
                : 'text-gray-900 hover:bg-white/50'
            }`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          
          <ConnectionStatus 
            isConnecting={isConnecting}
            theme={theme}
            content={{
              connecting: content.connecting,
              connected: content.connected
            }}
          />
        </div>
      </div>
    </div>
  );
};
