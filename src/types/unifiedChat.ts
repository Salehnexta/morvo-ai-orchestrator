
// 🎯 ملف الأنواع المركزي الموحد للشات
// يحل تكرار MessageData وجميع الأنواع الأخرى

// === رسائل الشات ===
export interface UnifiedMessageData {
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

// === تشخيص النظام ===
export interface UnifiedDiagnosticResult {
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

export interface UnifiedConnectionStatus {
  isConnected: boolean;
  isHealthy: boolean;
  lastChecked: Date | null;
  serverInfo?: any;
  error?: string | null;
  latency?: number;
  status?: 'healthy' | 'degraded' | 'failed';
}

// === استجابة الشات ===
export interface UnifiedChatResponse {
  message: string;
  conversation_id?: string;
  processing_time_ms?: number;
  tokens_used?: number;
  success: boolean;
  error?: string;
  confidence_score?: number;
}

// === حالة المعالجة ===
export type UnifiedProcessingStatus = 'idle' | 'sending' | 'diagnosing';

// === سياق الشات ===
export interface UnifiedChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface UnifiedChatContextData {
  conversation_history?: UnifiedChatMessage[];
  user_profile?: any;
  emotional_context?: any;
  conversation_state?: any;
  user_id?: string;
}

// === إعدادات الواجهة ===
export interface UnifiedChatSettings {
  theme: 'light' | 'dark';
  language: 'ar' | 'en';
  isRTL: boolean;
  showDiagnostics: boolean;
  autoConnect: boolean;
}

// === مقاييس الأداء ===
export interface UnifiedPerformanceMetrics {
  averageResponseTime: number;
  totalMessages: number;
  successRate: number;
  errorRate: number;
  lastUpdated: Date;
}
