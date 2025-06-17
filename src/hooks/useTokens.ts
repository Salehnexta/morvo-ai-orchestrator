import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface TokenData {
  quota_limit: number;
  quota_used: number;
  active: boolean;
}

export const useTokens = () => {
  const { session } = useAuth();
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTokenData = async () => {
    if (!session?.user?.id) {
      setTokenData(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('clients')
        .select('quota_limit, quota_used, active')
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching token data:', error);
        setTokenData(null);
        return;
      }

      setTokenData(data);
    } catch (error) {
      console.error('Failed to fetch token data:', error);
      setTokenData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenData();
  }, [session]);

  const deductTokens = async (amount: number = 1): Promise<boolean> => {
    if (!session?.user?.id || !tokenData) {
      console.error('No session or token data available');
      return false;
    }

    // For negative amounts (refunds), allow the operation
    if (amount < 0) {
      const newUsed = Math.max(0, tokenData.quota_used + amount);
      
      try {
        const { error } = await supabase
          .from('clients')
          .update({ quota_used: newUsed })
          .eq('user_id', session.user.id);

        if (error) {
          console.error('Error refunding tokens:', error);
          return false;
        }

        setTokenData(prev => prev ? { ...prev, quota_used: newUsed } : null);
        console.log(`✅ Refunded ${Math.abs(amount)} token(s)`);
        return true;
      } catch (error) {
        console.error('Failed to refund tokens:', error);
        return false;
      }
    }

    // Check if user has enough tokens
    const remainingTokens = tokenData.quota_limit - tokenData.quota_used;
    if (remainingTokens < amount) {
      console.warn('Insufficient tokens');
      // REMOVED: Annoying toast notification
      return false;
    }

    const newUsed = tokenData.quota_used + amount;

    try {
      const { error } = await supabase
        .from('clients')
        .update({ quota_used: newUsed })
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error deducting tokens:', error);
        return false;
      }

      setTokenData(prev => prev ? { ...prev, quota_used: newUsed } : null);
      console.log(`✅ Deducted ${amount} token(s). Remaining: ${tokenData.quota_limit - newUsed}`);
      return true;
    } catch (error) {
      console.error('Failed to deduct tokens:', error);
      return false;
    }
  };

  const getRemainingTokens = (): number => {
    if (!tokenData) return 0;
    return Math.max(0, tokenData.quota_limit - tokenData.quota_used);
  };

  const isLowTokens = (): boolean => {
    const remaining = getRemainingTokens();
    return remaining <= 10 && remaining > 0;
  };

  const getTokenPercentage = (): number => {
    if (!tokenData || tokenData.quota_limit === 0) return 0;
    return Math.max(0, Math.min(100, (getRemainingTokens() / tokenData.quota_limit) * 100));
  };

  return {
    tokenData,
    loading,
    deductTokens,
    getRemainingTokens,
    isLowTokens,
    getTokenPercentage,
    refreshTokens: fetchTokenData
  };
};
