
import React from 'react';
import { Bot, Sun, Moon, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectionStatus } from './ConnectionStatus';

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
  tokenBalance?: number;
  onToggleTheme: () => void;
  onUpgrade?: () => void;
}

export const ChatHeader = ({ 
  theme, 
  isRTL, 
  content, 
  isConnecting, 
  clientId,
  tokenBalance,
  onToggleTheme,
  onUpgrade
}: ChatHeaderProps) => {
  const getTokenColor = () => {
    if (!tokenBalance) return 'text-gray-500';
    if (tokenBalance < 1000) return 'text-red-500';
    if (tokenBalance < 5000) return 'text-orange-500';
    return 'text-green-500';
  };

  return (
    <div className={`backdrop-blur-md border-b p-3 ${
      theme === 'dark' 
        ? 'bg-black/20 border-white/10' 
        : 'bg-white/20 border-white/30'
    }`}>
      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {/* Bot Avatar and Info */}
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h1 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {content.masterAgent}
            </h1>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {content.clientAgent}
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className={`${isRTL ? 'mr-auto' : 'ml-auto'} flex items-center gap-2`}>
          {/* Token Balance Display - Compact */}
          {clientId && tokenBalance !== undefined && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
              theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'
            }`}>
              <Coins className={`w-3 h-3 ${getTokenColor()}`} />
              <span className={`font-medium ${getTokenColor()}`}>
                {tokenBalance.toLocaleString()}
              </span>
            </div>
          )}

          {/* Upgrade Button for Low Tokens - Compact */}
          {tokenBalance !== undefined && tokenBalance < 1000 && onUpgrade && (
            <Button
              size="sm"
              onClick={onUpgrade}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs px-2 py-1 h-7"
            >
              ترقية
            </Button>
          )}

          {/* Theme Toggle - Compact */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleTheme}
            className={`h-7 w-7 p-0 ${
              theme === 'dark' 
                ? 'text-white hover:bg-gray-800' 
                : 'text-gray-900 hover:bg-white/50'
            }`}
          >
            {theme === 'dark' ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
          </Button>
          
          {/* Connection Status - Compact */}
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
