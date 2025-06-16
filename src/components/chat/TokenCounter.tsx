
import React, { useState, useEffect } from 'react';
import { Coins, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TokenCounterProps {
  theme: 'light' | 'dark';
  clientId: string;
  onTokensUpdated?: (remaining: number, limit: number) => void;
}

export const TokenCounter = ({ theme, clientId, onTokensUpdated }: TokenCounterProps) => {
  const [tokenData, setTokenData] = useState<{
    used: number;
    limit: number;
    remaining: number;
    percentage: number;
  }>({
    used: 0,
    limit: 0,
    remaining: 0,
    percentage: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (clientId) {
      fetchTokenUsage();
    }
  }, [clientId]);

  const fetchTokenUsage = async () => {
    try {
      setIsLoading(true);

      // Get user's active subscription and limits
      const { data: subscriptionData, error: subError } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans!inner(*)
        `)
        .eq('client_id', clientId)
        .in('status', ['active', 'trial'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (subError || !subscriptionData) {
        console.error('Error fetching subscription:', subError);
        return;
      }

      const monthlyLimit = subscriptionData.subscription_plans.limits?.monthly_ai_requests || 0;

      // Get current month's token usage
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: usageData, error: usageError } = await supabase
        .from('feature_usage')
        .select('usage_count')
        .eq('client_id', clientId)
        .eq('feature_name', 'ai_requests')
        .gte('usage_date', startOfMonth.toISOString().split('T')[0]);

      if (usageError) {
        console.error('Error fetching usage:', usageError);
        return;
      }

      const totalUsed = usageData?.reduce((sum, record) => sum + (record.usage_count || 0), 0) || 0;
      const remaining = Math.max(0, monthlyLimit - totalUsed);
      const percentage = monthlyLimit > 0 ? (totalUsed / monthlyLimit) * 100 : 0;

      const newTokenData = {
        used: totalUsed,
        limit: monthlyLimit,
        remaining,
        percentage
      };

      setTokenData(newTokenData);
      
      if (onTokensUpdated) {
        onTokensUpdated(remaining, monthlyLimit);
      }

      // Show warnings at different thresholds
      if (percentage >= 95 && percentage < 100) {
        toast({
          title: "⚠️ انتباه: الرصيد شبه منتهي",
          description: `باقي لديك ${remaining} طلب فقط من أصل ${monthlyLimit}`,
          variant: "destructive",
          duration: 5000,
        });
      } else if (percentage >= 90 && percentage < 95) {
        toast({
          title: "🔔 تنبيه: الرصيد يقترب من النهاية",
          description: `استخدمت ${Math.round(percentage)}% من رصيدك الشهري`,
          duration: 4000,
        });
      }

    } catch (error) {
      console.error('Error in fetchTokenUsage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = () => {
    if (tokenData.percentage >= 95) return 'text-red-500';
    if (tokenData.percentage >= 90) return 'text-orange-500';
    if (tokenData.percentage >= 75) return 'text-yellow-500';
    return theme === 'dark' ? 'text-green-400' : 'text-green-600';
  };

  const getBackgroundColor = () => {
    if (tokenData.percentage >= 95) return 'bg-red-500/10';
    if (tokenData.percentage >= 90) return 'bg-orange-500/10';
    if (tokenData.percentage >= 75) return 'bg-yellow-500/10';
    return 'bg-green-500/10';
  };

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        <Coins className="w-4 h-4 animate-pulse" />
        <span className="text-sm">...</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${getBackgroundColor()}`}>
      {tokenData.percentage >= 90 ? (
        <AlertTriangle className={`w-4 h-4 ${getStatusColor()}`} />
      ) : (
        <Coins className={`w-4 h-4 ${getStatusColor()}`} />
      )}
      
      <div className="flex flex-col">
        <span className={`text-xs font-medium ${getStatusColor()}`}>
          {tokenData.remaining.toLocaleString()} / {tokenData.limit.toLocaleString()}
        </span>
        <div className="w-16 h-1 bg-gray-300 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${
              tokenData.percentage >= 95 ? 'bg-red-500' :
              tokenData.percentage >= 90 ? 'bg-orange-500' :
              tokenData.percentage >= 75 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(tokenData.percentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
