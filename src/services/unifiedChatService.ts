
import { MorvoAICore } from './morvoAICore';
import { supabase } from "@/integrations/supabase/client";

export type ChatResponse = {
  response: string;
  personality_traits?: any;
  tokens_used: number;
  emotion_detected?: string;
  suggested_actions?: Array<any>;
  processing_time?: number;
  confidence_score?: number;
};

interface DiagnosticResult {
  format: string;
  success: boolean;
  latency: number;
  error?: string;
  timestamp: string;
}

interface ConnectionStatus {
  status: 'healthy' | 'degraded' | 'failed';
  isConnected: boolean;
  lastChecked: string;
  diagnostics: DiagnosticResult[];
}

export class UnifiedChatService {
  private static diagnosticResults: DiagnosticResult[] = [];
  private static connectionStatus: ConnectionStatus = {
    status: 'failed',
    isConnected: false,
    lastChecked: '',
    diagnostics: []
  };

  static async processMessage(message: string, context?: any): Promise<ChatResponse> {
    return MorvoAICore.processMessage(message, context);
  }

  static async testConnection(): Promise<boolean> {
    try {
      console.log('🧪 Running unified diagnostics...');
      
      const startTime = Date.now();
      const result = await MorvoAICore.testConnection();
      const latency = Date.now() - startTime;
      
      const diagnosticResult: DiagnosticResult = {
        format: 'unified',
        success: result,
        latency,
        timestamp: new Date().toISOString()
      };
      
      this.diagnosticResults.unshift(diagnosticResult);
      if (this.diagnosticResults.length > 10) {
        this.diagnosticResults = this.diagnosticResults.slice(0, 10);
      }
      
      this.connectionStatus = {
        status: result ? 'healthy' : 'failed',
        isConnected: result,
        lastChecked: new Date().toISOString(),
        diagnostics: this.diagnosticResults
      };
      
      return result;
    } catch (error) {
      console.error('❌ Unified diagnostics failed:', error);
      
      const diagnosticResult: DiagnosticResult = {
        format: 'unified',
        success: false,
        latency: 0,
        error: error.message,
        timestamp: new Date().toISOString()
      };
      
      this.diagnosticResults.unshift(diagnosticResult);
      return false;
    }
  }

  static getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  static getDiagnosticResults(): DiagnosticResult[] {
    return this.diagnosticResults;
  }

  static clearDiagnosticCache(): void {
    this.diagnosticResults = [];
    this.connectionStatus = {
      status: 'failed',
      isConnected: false,
      lastChecked: '',
      diagnostics: []
    };
    console.log('🧹 Diagnostic cache cleared');
  }

  static getHealthStatus() {
    return MorvoAICore.getHealthStatus();
  }

  static getConversationId() {
    return MorvoAICore.getConversationId();
  }

  static resetConversation() {
    return MorvoAICore.resetConversation();
  }
}
