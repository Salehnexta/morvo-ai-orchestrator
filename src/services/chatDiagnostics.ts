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

    // Test health endpoint
    results.healthEndpoint = await this.testEndpoint('/health', 'GET');
    
    // Test the working test endpoint
    results.testEndpoint = await this.testEndpoint('/v1/chat/test', 'POST', {
      message: 'Diagnostic test',
      client_id: `diag-${Date.now()}`,
      conversation_id: 'diagnostic'
    });

    // Test auth endpoint if token is available - with required func parameter
    if (token) {
      results.authEndpoint = await this.testEndpoint('/v1/chat/message?func=chat', 'POST', {
        message: 'Auth diagnostic test',
        conversation_id: 'diagnostic-auth',
        stream: false
      }, { 'Authorization': `Bearer ${token}` });
    } else {
      results.authEndpoint = {
        endpoint: '/v1/chat/message',
        status: 'failed',
        latency: 0,
        error: 'No auth token available',
        timestamp: new Date()
      };
    }

    // Determine overall status and recommendation
    const healthyEndpoints = [
      results.testEndpoint?.status === 'healthy',
      results.authEndpoint?.status === 'healthy',
      results.healthEndpoint?.status === 'healthy'
    ].filter(Boolean).length;

    if (results.testEndpoint?.status === 'healthy') {
      results.overallStatus = 'healthy';
      results.recommendation = results.authEndpoint?.status === 'healthy' ? 'use_auth' : 'use_test';
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
    extraHeaders?: Record<string, string>
  ): Promise<DiagnosticResult> {
    const startTime = Date.now();
    const fullUrl = `${this.API_URL}${endpoint}`;
    
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...extraHeaders
      };

      const response = await fetch(fullUrl, {
        method,
        headers,
        ...(body && { body: JSON.stringify(body) }),
        signal: AbortSignal.timeout(10000)
      });

      const latency = Date.now() - startTime;
      
      if (response.ok) {
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
          status: 'failed',
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

  static getLastHealthCheck(): APIHealthStatus | null {
    return this.lastHealthCheck;
  }

  static getDiagnosticHistory(): DiagnosticResult[] {
    return this.diagnosticHistory.slice(-10); // Last 10 results
  }

  static clearHistory(): void {
    this.diagnosticHistory = [];
  }
}
