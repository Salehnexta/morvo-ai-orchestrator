
import { supabase } from "@/integrations/supabase/client";

export interface TokenUsage {
  tokensUsed: number;
  remainingTokens: number;
  isLimitReached: boolean;
  accountType: 'free' | 'paid' | 'guest';
}

export class TokenService {
  private static readonly FREE_ACCOUNT_LIMIT = 20000; // 20,000 tokens for free accounts
  private static readonly GUEST_LIMIT = 100;

  // Track token usage
  static async trackTokenUsage(clientId: string, tokensUsed: number): Promise<void> {
    try {
      // For guest accounts, we only track locally
      if (clientId.startsWith('public-')) {
        this.updateGuestTokenUsage(clientId, tokensUsed);
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      
      // Get client's subscription
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select(`
          id,
          user_subscriptions!inner(
            id,
            subscription_plans!inner(
              plan_code,
              limits
            )
          )
        `)
        .eq('id', clientId)
        .single();

      if (clientError) {
        console.error('Error fetching client subscription:', clientError);
        return;
      }

      const subscription = client.user_subscriptions[0];
      
      // Track usage in feature_usage table
      const { error } = await supabase
        .from('feature_usage')
        .upsert({
          client_id: clientId,
          subscription_id: subscription.id,
          feature_name: 'chat_tokens',
          usage_count: tokensUsed,
          usage_date: today,
          metadata: {
            tracked_at: new Date().toISOString()
          }
        }, {
          onConflict: 'client_id,feature_name,usage_date',
          ignoreDuplicates: false
        });

      if (error) {
        console.error('Error tracking tokens:', error);
      }
    } catch (error) {
      console.error('Error in token service:', error);
    }
  }

  // Check token limit
  static async checkTokenLimit(clientId: string): Promise<TokenUsage> {
    try {
      // Determine account type
      const accountType = clientId.startsWith('public-') ? 'guest' : 'free';
      const limit = accountType === 'guest' ? this.GUEST_LIMIT : this.FREE_ACCOUNT_LIMIT;

      if (accountType === 'guest') {
        // For guests, calculate current session usage only
        const sessionUsage = parseInt(localStorage.getItem(`guest_tokens_${clientId}`) || '0');
        
        return {
          tokensUsed: sessionUsage,
          remainingTokens: Math.max(0, limit - sessionUsage),
          isLimitReached: sessionUsage >= limit,
          accountType
        };
      }

      // For registered accounts, get data from database
      const today = new Date().toISOString().split('T')[0];
      
      // Get client with subscription info
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select(`
          id,
          user_subscriptions!inner(
            id,
            status,
            subscription_plans!inner(
              plan_code,
              limits
            )
          )
        `)
        .eq('id', clientId)
        .single();

      if (clientError) {
        console.error('Error fetching client:', clientError);
        return {
          tokensUsed: 0,
          remainingTokens: 0,
          isLimitReached: true,
          accountType: 'guest'
        };
      }

      const subscription = client.user_subscriptions[0];
      const planLimits = subscription.subscription_plans.limits as any;
      const tokenLimit = planLimits?.chat_tokens || this.FREE_ACCOUNT_LIMIT;

      // Get current usage for today
      const { data: usageData, error: usageError } = await supabase
        .from('feature_usage')
        .select('usage_count')
        .eq('client_id', clientId)
        .eq('feature_name', 'chat_tokens')
        .eq('usage_date', today)
        .single();

      if (usageError && usageError.code !== 'PGRST116') {
        console.error('Error fetching token usage:', usageError);
      }

      const tokensUsed = usageData?.usage_count || 0;

      return {
        tokensUsed,
        remainingTokens: Math.max(0, tokenLimit - tokensUsed),
        isLimitReached: tokensUsed >= tokenLimit,
        accountType: subscription.subscription_plans.plan_code === 'free-plan' ? 'free' : 'paid'
      };
    } catch (error) {
      console.error('Error checking token limit:', error);
      return {
        tokensUsed: 0,
        remainingTokens: 0,
        isLimitReached: true,
        accountType: 'guest'
      };
    }
  }

  // Update guest token usage locally
  static updateGuestTokenUsage(clientId: string, tokensUsed: number): void {
    if (clientId.startsWith('public-')) {
      const currentUsage = parseInt(localStorage.getItem(`guest_tokens_${clientId}`) || '0');
      localStorage.setItem(`guest_tokens_${clientId}`, (currentUsage + tokensUsed).toString());
    }
  }
}
