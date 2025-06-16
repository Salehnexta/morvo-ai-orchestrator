
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TokenData {
  client: {
    id: string;
    quota_limit: number;
    quota_used: number;
  };
  plan: {
    plan_name: string;
    limits: any;
  };
  subscription: {
    status: string;
  };
}

export const useTokens = () => {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTokenData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      const { data: subscription, error } = await supabase
        .from('user_subscriptions')
        .select(`
          status,
          clients!inner(id, quota_limit, quota_used),
          subscription_plans!inner(plan_name, limits)
        `)
        .eq('client_id', session.user.id)
        .eq('status', 'active')
        .single();

      if (error) {
        console.error('Error fetching token data:', error);
        setLoading(false);
        return;
      }

      if (subscription) {
        setTokenData({
          client: subscription.clients,
          plan: subscription.subscription_plans,
          subscription: { status: subscription.status }
        });
      }
    } catch (error) {
      console.error('Token fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const deductTokens = async (amount: number = 1): Promise<boolean> => {
    if (!tokenData?.client) return false;

    const newUsed = tokenData.client.quota_used + amount;
    
    if (newUsed > tokenData.client.quota_limit) {
      toast({
        title: "🚫 نفد رصيد الطلبات",
        description: "يرجى ترقية باقتك للمتابعة",
        variant: "destructive",
        duration: 5000,
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('clients')
        .update({ quota_used: newUsed })
        .eq('id', tokenData.client.id);

      if (error) {
        console.error('Error deducting tokens:', error);
        return false;
      }

      setTokenData(prev => prev ? {
        ...prev,
        client: { ...prev.client, quota_used: newUsed }
      } : null);

      return true;
    } catch (error) {
      console.error('Token deduction error:', error);
      return false;
    }
  };

  const getRemainingTokens = (): number => {
    if (!tokenData?.client) return 0;
    return tokenData.client.quota_limit - tokenData.client.quota_used;
  };

  const getTokenPercentage = (): number => {
    if (!tokenData?.client) return 0;
    const remaining = getRemainingTokens();
    return (remaining / tokenData.client.quota_limit) * 100;
  };

  const isLowTokens = (): boolean => {
    return getTokenPercentage() < 10;
  };

  useEffect(() => {
    fetchTokenData();
  }, []);

  return {
    tokenData,
    loading,
    deductTokens,
    getRemainingTokens,
    getTokenPercentage,
    isLowTokens,
    refetch: fetchTokenData
  };
};
