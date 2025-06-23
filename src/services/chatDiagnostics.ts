
interface DiagnosticResult {
  endpoint: string;
  status: 'healthy' | 'degraded' | 'failed';
  latency: number;
  error?: string;
  timestamp: Date;
}

interface APIHealthStatus {
  testEndpoint: DiagnosticResult;
  authEndpoint: DiagnosticResult;
  healthEndpoint: DiagnosticResult;
  overallStatus: 'healthy' | 'degraded' | 'failed';
  recommendation: 'use_test' | 'use_auth' | 'offline_mode';
}

export class ChatDiagnostics {
  private static readonly API_URL = 'https://morvo-production.up.railway.app';
  private static diagnosticHistory: DiagnosticResult[] = [];
  private static lastHealthCheck: APIHealthStatus | null = null;

  static async performComprehensiveDiagnostic(token?: string): Promise<APIHealthStatus> {
    console.log('🔍 Starting comprehensive chat diagnostics...');
    
    const results: Partial<APIHealthStatus> = {
      overallStatus: 'failed',
      recommendation: 'offline_mode'
    };

    // Test endpoints in parallel for better performance
    const diagnosticPromises = [
      this.testEndpoint('/health', 'GET', undefined, {}, 2000),
      this.testEndpoint('/v1/chat/test', 'POST', {
        message: 'Diagnostic test',
        client_id: `diag-${Date.now()}`,
        conversation_id: 'diagnostic',
        language: 'ar'
      }, {}, 3000)
    ];

    // Add auth endpoint test if token is available
    if (token) {
      diagnosticPromises.push(
        this.testEndpoint('/v1/chat/message', 'POST', {
          message: 'Auth diagnostic test',
          conversation_id: 'diagnostic-auth',
          stream: false,
          language: 'ar'
        }, { 'Authorization': `Bearer ${token}` }, 5000)
      );
    }

    try {
      const diagnosticResults = await Promise.allSettled(diagnosticPromises);
      
      results.healthEndpoint = diagnosticResults[0].status === 'fulfilled' 
        ? diagnosticResults[0].value 
        : this.createFailedResult('/health', 'Promise rejected');
        
      results.testEndpoint = diagnosticResults[1].status === 'fulfilled' 
        ? diagnosticResults[1].value 
        : this.createFailedResult('/v1/chat/test', 'Promise rejected');

      if (token && diagnosticResults[2]) {
        results.authEndpoint = diagnosticResults[2].status === 'fulfilled' 
          ? diagnosticResults[2].value 
          : this.createFailedResult('/v1/chat/message', 'Promise rejected');
      } else {
        results.authEndpoint = this.createFailedResult('/v1/chat/message', 'No auth token available');
      }

    } catch (error) {
      console.error('Diagnostic promises failed:', error);
      results.healthEndpoint = this.createFailedResult('/health', 'Network error');
      results.testEndpoint = this.createFailedResult('/v1/chat/test', 'Network error');
      results.authEndpoint = this.createFailedResult('/v1/chat/message', 'Network error');
    }

    // Improved decision logic
    const healthyEndpoints = [
      results.testEndpoint?.status === 'healthy',
      results.authEndpoint?.status === 'healthy',
      results.healthEndpoint?.status === 'healthy'
    ].filter(Boolean).length;

    if (results.testEndpoint?.status === 'healthy' && results.authEndpoint?.status === 'healthy') {
      results.overallStatus = 'healthy';
      results.recommendation = 'use_auth';
    } else if (results.testEndpoint?.status === 'healthy') {
      results.overallStatus = results.testEndpoint.latency > 3000 ? 'degraded' : 'healthy';
      results.recommendation = 'use_test';
    } else if (healthyEndpoints > 0) {
      results.overallStatus = 'degraded';
      results.recommendation = results.authEndpoint?.status === 'healthy' ? 'use_auth' : 'use_test';
    }

    this.lastHealthCheck = results as APIHealthStatus;
    console.log('📊 Diagnostic complete:', results);
    
    return results as APIHealthStatus;
  }

  private static async testEndpoint(
    endpoint: string, 
    method: string, 
    body?: any, 
    extraHeaders?: Record<string, string>,
    timeout: number = 5000
  ): Promise<DiagnosticResult> {
    const startTime = Date.now();
    const fullUrl = `${this.API_URL}${endpoint}`;
    
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'MorvoAI-Diagnostic/1.0',
        ...extraHeaders
      };

      const response = await fetch(fullUrl, {
        method,
        headers,
        ...(body && { body: JSON.stringify(body) }),
        signal: AbortSignal.timeout(timeout)
      });

      const latency = Date.now() - startTime;
      
      if (response.ok) {
        // Try to parse response to ensure it's valid
        const responseText = await response.text();
        let responseData = null;
        
        try {
          responseData = JSON.parse(responseText);
        } catch (parseError) {
          // If it's not JSON, that's still okay for health endpoint
          if (endpoint !== '/health') {
            console.warn('Non-JSON response from', endpoint);
          }
        }
        
        const result: DiagnosticResult = {
          endpoint,
          status: latency > 3000 ? 'degraded' : 'healthy',
          latency,
          timestamp: new Date()
        };
        
        this.diagnosticHistory.push(result);
        return result;
      } else {
        const errorText = await response.text().catch(() => 'Unknown error');
        const result: DiagnosticResult = {
          endpoint,
          status: response.status >= 500 ? 'failed' : 'degraded',
          latency,
          error: `HTTP ${response.status}: ${errorText}`,
          timestamp: new Date()
        };
        
        this.diagnosticHistory.push(result);
        return result;
      }
    } catch (error) {
      const latency = Date.now() - startTime;
      const result: DiagnosticResult = {
        endpoint,
        status: 'failed',
        latency,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };
      
      this.diagnosticHistory.push(result);
      return result;
    }
  }

  private static createFailedResult(endpoint: string, error: string): DiagnosticResult {
    return {
      endpoint,
      status: 'failed',
      latency: 0,
      error,
      timestamp: new Date()
    };
  }

  static getLastHealthCheck(): APIHealthStatus | null {
    return this.lastHealthCheck;
  }

  static getDiagnosticHistory(): DiagnosticResult[] {
    return this.diagnosticHistory.slice(-10); // Last 10 results
  }

  static clearHistory(): void {
    this.diagnosticHistory = [];
  }

  static getConnectionSummary(): {
    totalTests: number;
    successRate: number;
    averageLatency: number;
    lastTestTime: Date | null;
  } {
    const recentHistory = this.diagnosticHistory.slice(-5);
    const successfulTests = recentHistory.filter(test => test.status === 'healthy').length;
    const totalLatency = recentHistory.reduce((sum, test) => sum + test.latency, 0);
    
    return {
      totalTests: recentHistory.length,
      successRate: recentHistory.length > 0 ? (successfulTests / recentHistory.length) * 100 : 0,
      averageLatency: recentHistory.length > 0 ? totalLatency / recentHistory.length : 0,
      lastTestTime: recentHistory.length > 0 ? recentHistory[recentHistory.length - 1].timestamp : null
    };
  }
}
