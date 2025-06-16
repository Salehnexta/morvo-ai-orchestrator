
import { TokenUsage } from './token/types';
import { GuestTokenService } from './token/guestTokenService';
import { DatabaseTokenService } from './token/databaseTokenService';
import { TOKEN_LIMITS } from './token/constants';

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
}

// Re-export types for backward compatibility
export type { TokenUsage } from './token/types';
