
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
    if (!tokenBalance) return 'text-white/60';
    if (tokenBalance < 1000) return 'text-red-300';
    if (tokenBalance < 5000) return 'text-orange-300';
    return 'text-green-300';
  };

  return (
    <div className="bg-black/20 backdrop-blur-sm border-b border-white/20 p-4">
      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {/* Bot Avatar and Info */}
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h1 className="text-sm font-semibold text-white">
              {content.masterAgent}
            </h1>
            <p className="text-xs text-white/70">
              {content.clientAgent}
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className={`${isRTL ? 'mr-auto' : 'ml-auto'} flex items-center gap-2`}>
          {/* Token Balance Display */}
          {clientId && tokenBalance !== undefined && (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-xs border border-white/20">
              <Coins className={`w-3 h-3 ${getTokenColor()}`} />
              <span className={`font-medium ${getTokenColor()}`}>
                {tokenBalance.toLocaleString()}
              </span>
            </div>
          )}

          {/* Upgrade Button for Low Tokens */}
          {tokenBalance !== undefined && tokenBalance < 1000 && onUpgrade && (
            <Button
              size="sm"
              onClick={onUpgrade}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-xs px-3 py-1 h-8 shadow-lg"
            >
              ترقية
            </Button>
          )}

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleTheme}
            className="h-8 w-8 p-0 text-white/80 hover:text-white hover:bg-white/10"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          
          {/* Connection Status */}
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
