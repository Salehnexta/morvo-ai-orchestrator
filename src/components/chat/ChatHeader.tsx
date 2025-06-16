
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
          {/* Token Balance Display */}
          {clientId && tokenBalance !== undefined && (
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
              theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'
            }`}>
              <Coins className={`w-4 h-4 ${getTokenColor()}`} />
              <div className="flex flex-col">
                <span className={`text-xs font-medium ${getTokenColor()}`}>
                  {tokenBalance.toLocaleString()} طلب
                </span>
                {tokenBalance < 1000 && tokenBalance > 0 && (
                  <span className="text-xs text-orange-500">
                    رصيد منخفض
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Upgrade Button for Low Tokens */}
          {tokenBalance !== undefined && tokenBalance < 1000 && onUpgrade && (
            <Button
              size="sm"
              onClick={onUpgrade}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs px-3 py-1"
            >
              ترقية
            </Button>
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
