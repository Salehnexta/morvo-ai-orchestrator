
import { TokenLimits } from './types';

export const TOKEN_LIMITS: TokenLimits = {
  guest: 500,    // 500 tokens for guest users
  free: 20000,   // 20,000 tokens for free accounts
  paid: 100000   // 100,000 tokens for paid accounts
};

export const GUEST_TOKEN_STORAGE_KEY = 'morvo_guest_tokens';
