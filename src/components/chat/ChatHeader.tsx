
import React from 'react';
import { Bot, Sun, Moon, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectionStatus } from './ConnectionStatus';
import { useUserGreeting } from '@/hooks/useUserGreeting';

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
  const { fullGreeting, loading: greetingLoading } = useUserGreeting();
  
  const getTokenColor = () => {
    if (!tokenBalance) return 'text-white/60';
    if (tokenBalance < 1000) return 'text-red-300';
    if (tokenBalance < 5000) return 'text-orange-300';
    return 'text-green-300';
  };

  return (
    <div className="p-6 border-b border-white/10">
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        {/* Personalized greeting */}
        <div className="flex flex-col">
          <h1 className="text-lg font-medium text-white">
            {greetingLoading ? 'مرحباً' : fullGreeting}
          </h1>
          <p className="text-sm text-blue-200 opacity-80">
            {content.masterAgent}
          </p>
        </div>

        {/* Minimal controls */}
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Token Balance - minimal */}
          {clientId && tokenBalance !== undefined && (
            <span className={`text-sm ${getTokenColor()}`}>
              {tokenBalance.toLocaleString()}
            </span>
          )}

          {/* Connection dot */}
          <div className={`w-2 h-2 rounded-full ${
            isConnecting ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'
          }`} />
        </div>
      </div>
    </div>
  );
};
