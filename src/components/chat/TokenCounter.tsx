
import React, { useEffect, useState } from 'react';
import { Coins, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MorvoAIService } from '@/services/morvoAIService';

interface TokenCounterProps {
  theme: 'light' | 'dark';
  clientId: string;
  onTokensUpdated?: (remaining: number, limit: number) => void;
}

export const TokenCounter = ({ theme, onTokensUpdated }: TokenCounterProps) => {
  const [tokenData, setTokenData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTokenBalance = async () => {
    try {
      setLoading(true);
      setError(null);
      const balance = await MorvoAIService.getTokenBalance();
      setTokenData(balance);
      
      if (onTokensUpdated) {
        onTokensUpdated(balance.balance, balance.package.token_amount);
      }
    } catch (error) {
      console.error('Error fetching token balance:', error);
      setError('فشل في تحميل رصيد الطلبات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenBalance();
  }, []);

  if (loading) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        <Coins className="w-4 h-4 animate-pulse" />
        <span className="text-sm">...</span>
      </div>
    );
  }

  if (error || !tokenData) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        <Button
          size="sm"
          variant="ghost"
          onClick={fetchTokenBalance}
          className="h-6 w-6 p-0"
        >
          <RefreshCw className="w-3 h-3" />
        </Button>
        <span className="text-xs">إعادة تحميل</span>
      </div>
    );
  }

  const remaining = tokenData.balance;
  const total = tokenData.package.token_amount;
  const percentage = (remaining / total) * 100;

  const getStatusColor = () => {
    if (percentage < 5) return 'text-red-500';
    if (percentage < 10) return 'text-orange-500';
    if (percentage < 25) return 'text-yellow-500';
    return theme === 'dark' ? 'text-green-400' : 'text-green-600';
  };

  const getBackgroundColor = () => {
    if (percentage < 5) return 'bg-red-500/10';
    if (percentage < 10) return 'bg-orange-500/10';
    if (percentage < 25) return 'bg-yellow-500/10';
    return 'bg-green-500/10';
  };

  const isLowTokens = percentage < 10;

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${getBackgroundColor()}`}>
      {isLowTokens ? (
        <AlertTriangle className={`w-4 h-4 ${getStatusColor()}`} />
      ) : (
        <Coins className={`w-4 h-4 ${getStatusColor()}`} />
      )}
      
      <div className="flex flex-col">
        <span className={`text-xs font-medium ${getStatusColor()}`}>
          {remaining.toLocaleString()} / {total.toLocaleString()}
        </span>
        <div className="w-16 h-1 bg-gray-300 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${
              percentage < 5 ? 'bg-red-500' :
              percentage < 10 ? 'bg-orange-500' :
              percentage < 25 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
