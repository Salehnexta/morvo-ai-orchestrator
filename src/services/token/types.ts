
export interface TokenUsage {
  totalTokens: number;
  usedTokens: number;
  remainingTokens: number;
  isLimitReached: boolean;
  accountType: 'guest' | 'free' | 'paid';
  resetDate?: Date;
}

export interface TokenLimits {
  guest: number;
  free: number;
  paid: number;
}

export interface GuestTokenData {
  clientId: string;
  usedTokens: number;
  createdAt: Date;
}
