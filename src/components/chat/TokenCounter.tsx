
import React from 'react';
import { Coins, AlertTriangle } from 'lucide-react';
import { useTokens } from '@/hooks/useTokens';

interface TokenCounterProps {
  theme: 'light' | 'dark';
  clientId: string;
  onTokensUpdated?: (remaining: number, limit: number) => void;
}

export const TokenCounter = ({ theme }: TokenCounterProps) => {
  const { tokenData, getRemainingTokens, getTokenPercentage, isLowTokens, loading } = useTokens();

  if (loading || !tokenData) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        <Coins className="w-4 h-4 animate-pulse" />
        <span className="text-sm">...</span>
      </div>
    );
  }

  const remaining = getRemainingTokens();
  const percentage = getTokenPercentage();

  const getStatusColor = () => {
    if (percentage >= 95) return 'text-red-500';
    if (percentage >= 90) return 'text-orange-500';
    if (percentage >= 75) return 'text-yellow-500';
    return theme === 'dark' ? 'text-green-400' : 'text-green-600';
  };

  const getBackgroundColor = () => {
    if (percentage >= 95) return 'bg-red-500/10';
    if (percentage >= 90) return 'bg-orange-500/10';
    if (percentage >= 75) return 'bg-yellow-500/10';
    return 'bg-green-500/10';
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${getBackgroundColor()}`}>
      {isLowTokens() ? (
        <AlertTriangle className={`w-4 h-4 ${getStatusColor()}`} />
      ) : (
        <Coins className={`w-4 h-4 ${getStatusColor()}`} />
      )}
      
      <div className="flex flex-col">
        <span className={`text-xs font-medium ${getStatusColor()}`}>
          {remaining.toLocaleString()} / {tokenData.client.quota_limit.toLocaleString()}
        </span>
        <div className="w-16 h-1 bg-gray-300 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${
              percentage >= 95 ? 'bg-red-500' :
              percentage >= 90 ? 'bg-orange-500' :
              percentage >= 75 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(100 - percentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
