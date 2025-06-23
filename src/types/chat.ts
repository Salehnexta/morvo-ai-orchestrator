
export interface MessageData {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  processing_time?: number;
  tokens_used?: number;
  metadata?: {
    contextualInsights?: string[];
    emotionalContext?: any;
    isAuthenticated?: boolean;
    endpointUsed?: string;
    processingSteps?: string[];
    suggested_actions?: any[];
    isError?: boolean;
    errorHandled?: boolean;
    [key: string]: any;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface DiagnosticResult {
  format: string;
  success: boolean;
  status?: number;
  error?: string;
  response?: any;
  latency: number;
  endpoint?: string;
  timestamp?: Date;
  httpStatus?: number;
  requestFormat?: string;
}

export interface ConnectionStatus {
  isConnected: boolean;
  isHealthy: boolean;
  lastChecked: Date | null;
  serverInfo?: any;
  error?: string | null;
  latency?: number;
  status?: 'healthy' | 'degraded' | 'failed';
}

export interface ChatResponse {
  message: string;
  conversation_id?: string;
  processing_time_ms?: number;
  tokens_used?: number;
  success: boolean;
  error?: string;
  confidence_score?: number;
}

export type ProcessingStatus = 'idle' | 'sending' | 'diagnosing';

export interface ChatContextData {
  conversation_history?: ChatMessage[];
  user_profile?: any;
  emotional_context?: any;
  conversation_state?: any;
  user_id?: string;
}
