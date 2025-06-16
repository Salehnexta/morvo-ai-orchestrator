
import { GuestTokenData } from './types';
import { TOKEN_LIMITS, GUEST_TOKEN_STORAGE_KEY } from './constants';

export class GuestTokenService {
  static getGuestTokenData(clientId: string): GuestTokenData {
    try {
      const stored = localStorage.getItem(GUEST_TOKEN_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.clientId === clientId) {
          return {
            clientId: data.clientId,
            usedTokens: data.usedTokens || 0,
            createdAt: new Date(data.createdAt)
          };
        }
      }
    } catch (error) {
      console.error('Error reading guest token data:', error);
    }

    // Return default data for new guest
    return {
      clientId,
      usedTokens: 0,
      createdAt: new Date()
    };
  }

  static updateGuestTokenUsage(clientId: string, tokensUsed: number): void {
    try {
      const currentData = this.getGuestTokenData(clientId);
      const updatedData = {
        ...currentData,
        usedTokens: currentData.usedTokens + tokensUsed
      };

      localStorage.setItem(GUEST_TOKEN_STORAGE_KEY, JSON.stringify(updatedData));
      console.log(`Guest tokens updated: ${updatedData.usedTokens}/${TOKEN_LIMITS.guest}`);
    } catch (error) {
      console.error('Error updating guest token usage:', error);
    }
  }

  static clearGuestTokenData(): void {
    try {
      localStorage.removeItem(GUEST_TOKEN_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing guest token data:', error);
    }
  }

  static isGuestLimitReached(clientId: string): boolean {
    const data = this.getGuestTokenData(clientId);
    return data.usedTokens >= TOKEN_LIMITS.guest;
  }

  static getGuestRemainingTokens(clientId: string): number {
    const data = this.getGuestTokenData(clientId);
    return Math.max(0, TOKEN_LIMITS.guest - data.usedTokens);
  }
}
