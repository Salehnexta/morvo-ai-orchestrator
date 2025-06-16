
import { TokenUsage } from './token/types';
import { GuestTokenService } from './token/guestTokenService';
import { DatabaseTokenService } from './token/databaseTokenService';
import { TOKEN_LIMITS } from './token/constants';
import { supabase } from '@/integrations/supabase/client';

export class TokenService {
  static async checkTokenLimit(clientId: string): Promise<TokenUsage> {
    // Handle guest users
    if (clientId.startsWith('public-')) {
      const guestData = GuestTokenService.getGuestTokenData(clientId);
      const remainingTokens = GuestTokenService.getGuestRemainingTokens(clientId);
      
      return {
        totalTokens: TOKEN_LIMITS.guest,
        usedTokens: guestData.usedTokens,
        remainingTokens,
        isLimitReached: GuestTokenService.isGuestLimitReached(clientId),
        accountType: 'guest'
      };
    }

    // Handle registered users
    const dbUsage = await DatabaseTokenService.getClientTokenUsage(clientId);
    if (dbUsage) {
      return dbUsage;
    }

    // Fallback for users without client record
    return {
      totalTokens: TOKEN_LIMITS.free,
      usedTokens: 0,
      remainingTokens: TOKEN_LIMITS.free,
      isLimitReached: false,
      accountType: 'free'
    };
  }

  static async trackTokenUsage(clientId: string, tokensUsed: number): Promise<void> {
    if (clientId.startsWith('public-')) {
      // Guest users are handled separately
      return;
    }

    await DatabaseTokenService.updateClientTokenUsage(clientId, tokensUsed);
  }

  static updateGuestTokenUsage(clientId: string, tokensUsed: number): void {
    if (clientId.startsWith('public-')) {
      GuestTokenService.updateGuestTokenUsage(clientId, tokensUsed);
    }
  }

  static clearGuestData(): void {
    GuestTokenService.clearGuestTokenData();
  }

  static async createFreeAccount(email: string, profileData: any): Promise<{ success: boolean; clientId?: string; error?: string }> {
    try {
      // Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: Math.random().toString(36).slice(-12), // Generate random password
        options: {
          data: {
            full_name: profileData.name,
          }
        }
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        return { success: false, error: 'Failed to create user account' };
      }

      // The trigger will automatically create the client record and subscription
      // Wait a moment for the trigger to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get the created client record
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', authData.user.id)
        .single();

      if (clientError || !client) {
        console.error('Client lookup error:', clientError);
        return { success: false, error: 'Failed to set up account' };
      }

      // Update customer profile with additional data
      const { error: profileError } = await supabase
        .from('customer_profiles')
        .update({
          company_name: profileData.company_name,
          industry: profileData.industry,
          target_audience: profileData.target_audience,
          marketing_experience_level: profileData.experience_level,
          budget_range: profileData.budget_range,
          marketing_goals: profileData.marketing_goals
        })
        .eq('customer_id', authData.user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        // Don't fail the account creation for profile update errors
      }

      return { success: true, clientId: authData.user.id };
    } catch (error) {
      console.error('Account creation error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }
}

// Re-export types for backward compatibility
export type { TokenUsage } from './token/types';
