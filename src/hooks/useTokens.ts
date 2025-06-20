
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface TokenData {
  client: {
    id: string;
    quota_limit: number;
    quota_used: number;
  };
  plan: {
    plan_name: string;
    limits: Record<string, any>;
  };
}

export const useTokens = () => {
  const { user } = useAuth();
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTokenData = async () => {
    if (!user) {
      setTokenData(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // First get client data
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id, quota_limit, quota_used')
        .eq('user_id', user.id)
        .single();

      if (clientError) {
        console.error('Error fetching client data:', clientError);
        setTokenData(null);
        return;
      }

      // Then get subscription and plan data
      const { data: subscriptionData, error: subError } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans (
            plan_name,
            limits
          )
        `)
        .eq('client_id', clientData.id)
        .eq('status', 'active')
        .single();

      if (subError) {
        console.error('Error fetching subscription data:', subError);
        // Create default plan data if no subscription found
        setTokenData({
          client: clientData,
          plan: {
            plan_name: 'Free',
            limits: {}
          }
        });
        return;
      }

      setTokenData({
        client: clientData,
        plan: {
          plan_name: subscriptionData.subscription_plans?.plan_name || 'Free',
          limits: subscriptionData.subscription_plans?.limits || {}
        }
      });

    } catch (error) {
      console.error('Error in fetchTokenData:', error);
      setTokenData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenData();
  }, [user]);

  const deductTokens = async (amount: number = 1): Promise<boolean> => {
    if (!tokenData || !user) return false;

    try {
      const { error } = await supabase
        .from('clients')
        .update({ 
          quota_used: tokenData.client.quota_used + amount 
        })
        .eq('id', tokenData.client.id);

      if (error) {
        console.error('Error deducting tokens:', error);
        return false;
      }

      // Update local state
      setTokenData(prev => prev ? {
        ...prev,
        client: {
          ...prev.client,
          quota_used: prev.client.quota_used + amount
        }
      } : null);

      return true;
    } catch (error) {
      console.error('Error in deductTokens:', error);
      return false;
    }
  };

  const getRemainingTokens = (): number => {
    if (!tokenData) return 0;
    return Math.max(0, tokenData.client.quota_limit - tokenData.client.quota_used);
  };

  const getTokenPercentage = (): number => {
    if (!tokenData) return 0;
    return (getRemainingTokens() / tokenData.client.quota_limit) * 100;
  };

  const isLowTokens = (): boolean => {
    return getTokenPercentage() < 10;
  };

  const refreshTokens = async (): Promise<void> => {
    await fetchTokenData();
  };

  // Add refetch alias for compatibility
  const refetch = refreshTokens;

  return {
    tokenData,
    loading,
    deductTokens,
    getRemainingTokens,
    getTokenPercentage,
    isLowTokens,
    refreshTokens,
    refetch
  };
};
