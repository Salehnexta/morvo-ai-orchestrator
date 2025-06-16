
import { supabase } from '@/integrations/supabase/client';
import { TokenUsage } from './types';
import { TOKEN_LIMITS } from './constants';

export class DatabaseTokenService {
  static async getClientTokenUsage(clientId: string): Promise<TokenUsage | null> {
    try {
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('quota_limit, quota_used')
        .eq('user_id', clientId)
        .single();

      if (clientError) {
        console.error('Error fetching client data:', clientError);
        return null;
      }

      if (!client) {
        console.log('No client data found for user:', clientId);
        return null;
      }

      const { data: subscription, error: subError } = await supabase
        .from('user_subscriptions')
        .select(`
          status,
          subscription_plans (
            plan_code,
            price_monthly
          )
        `)
        .eq('client_id', client.id)
        .eq('status', 'active')
        .single();

      if (subError) {
        console.error('Error fetching subscription:', subError);
      }

      const accountType = this.determineAccountType(subscription);
      const totalTokens = client.quota_limit || TOKEN_LIMITS[accountType];
      const usedTokens = client.quota_used || 0;
      const remainingTokens = Math.max(0, totalTokens - usedTokens);

      return {
        totalTokens,
        usedTokens,
        remainingTokens,
        isLimitReached: usedTokens >= totalTokens,
        accountType
      };
    } catch (error) {
      console.error('Error in getClientTokenUsage:', error);
      return null;
    }
  }

  static async updateClientTokenUsage(clientId: string, tokensUsed: number): Promise<void> {
    try {
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('id, quota_used')
        .eq('user_id', clientId)
        .single();

      if (clientError || !client) {
        console.error('Error fetching client for token update:', clientError);
        return;
      }

      const newUsage = (client.quota_used || 0) + tokensUsed;

      const { error: updateError } = await supabase
        .from('clients')
        .update({ quota_used: newUsage })
        .eq('id', client.id);

      if (updateError) {
        console.error('Error updating client token usage:', updateError);
      } else {
        console.log(`Client tokens updated: ${newUsage} tokens used`);
      }
    } catch (error) {
      console.error('Error in updateClientTokenUsage:', error);
    }
  }

  private static determineAccountType(subscription: any): 'free' | 'paid' {
    if (!subscription?.subscription_plans) {
      return 'free';
    }

    const plan = subscription.subscription_plans;
    return plan.price_monthly > 0 ? 'paid' : 'free';
  }
}
