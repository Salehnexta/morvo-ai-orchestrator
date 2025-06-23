
// 🎯 ملف الأنواع الموحد الكامل - يدمج جميع أنواع الشات

// === رسائل الشات الموحدة ===
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

// === رسائل المحادثة ===
export interface UnifiedChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// === نتائج التشخيص الموحدة ===
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

// === حالة الاتصال الموحدة ===
export interface UnifiedConnectionStatus {
  isConnected: boolean;
  isHealthy: boolean;
  lastChecked: Date;
  serverInfo?: any;
  error?: string;
  latency?: number;
  status?: 'healthy' | 'degraded' | 'failed';
}

// === استجابة الشات الموحدة ===
export interface UnifiedChatResponse {
  message: string;
  conversation_id?: string;
  processing_time_ms?: number;
  tokens_used?: number;
  success: boolean;
  error?: string;
  confidence_score?: number;
}

// === حالة المعالجة الموحدة ===
export type UnifiedProcessingStatus = 'idle' | 'sending' | 'diagnosing';

// === بيانات السياق الموحدة ===
export interface UnifiedChatContextData {
  conversation_history?: UnifiedChatMessage[];
  user_profile?: any;
  emotional_context?: any;
  conversation_state?: any;
  user_id?: string;
}

// === إعدادات الشات الموحدة ===
export interface UnifiedChatSettings {
  theme: 'light' | 'dark';
  language: 'ar' | 'en';
  isRTL: boolean;
  showDiagnostics: boolean;
  autoConnect: boolean;
}

// === مقاييس الأداء الموحدة ===
export interface UnifiedPerformanceMetrics {
  averageResponseTime: number;
  totalMessages: number;
  successRate: number;
  errorRate: number;
  lastUpdated: Date;
}

// === التشخيص الشامل الموحد ===
export interface UnifiedComprehensiveDiagnostic {
  id: string;
  timestamp: Date;
  results: UnifiedDiagnosticResult[];
  overallStatus: 'healthy' | 'degraded' | 'failed';
  recommendations: string[];
}

// === استجابة الخدمة الموحدة ===
export interface UnifiedServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    processingTime?: number;
    tokensUsed?: number;
    endpoint?: string;
    timestamp: Date;
  };
}
