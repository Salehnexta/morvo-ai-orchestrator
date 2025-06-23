interface DiagnosticResult {
  endpoint: string;
  status: 'healthy' | 'degraded' | 'failed';
  latency: number;
  error?: string;
  timestamp: Date;
  httpStatus?: number;
  requestFormat?: string;
}

interface APIHealthStatus {
  testEndpoint: DiagnosticResult;
  authEndpoint: DiagnosticResult;
  healthEndpoint: DiagnosticResult;
  overallStatus: 'healthy' | 'degraded' | 'failed';
  recommendation: 'use_test' | 'use_auth' | 'offline_mode';
  workingFormats: string[];
  corsStatus: 'working' | 'blocked' | 'unknown';
}

export class ChatDiagnostics {
  private static readonly API_URL = 'https://morvo-production.up.railway.app';
  private static diagnosticHistory: DiagnosticResult[] = [];
  private static lastHealthCheck: APIHealthStatus | null = null;

  static async performComprehensiveDiagnostic(token?: string): Promise<APIHealthStatus> {
    console.log('🔍 Starting comprehensive chat diagnostics...');
    
    const results: Partial<APIHealthStatus> = {
      overallStatus: 'failed',
      recommendation: 'offline_mode',
      workingFormats: [],
      corsStatus: 'unknown'
    };

    // Phase 3: Test CORS configuration
    const corsTest = await this.testCORSConfiguration();
    results.corsStatus = corsTest;

    // Test endpoints with multiple formats
    const diagnosticPromises = [
      this.testEndpointWithFormats('/health', 'GET'),
      this.testEndpointWithFormats('/v1/chat/test', 'POST', [
        { format: 'basic', body: { message: 'Diagnostic test', client_id: `diag-${Date.now()}` }},
        { format: 'with-func', body: { message: 'Diagnostic test', client_id: `diag-${Date.now()}` }, urlSuffix: '?func=chat' }
      ]),
    ];

    // Add auth endpoint test if token is available
    if (token) {
      diagnosticPromises.push(
        this.testEndpointWithFormats('/v1/chat/message', 'POST', [
          { format: 'auth-simple', body: { message: 'Auth test', conversation_id: 'diagnostic-auth' }},
          { format: 'auth-with-func', body: { message: 'Auth test', conversation_id: 'diagnostic-auth' }, urlSuffix: '?func=chat' }
        ], { 'Authorization': `Bearer ${token}` })
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

    // Collect working formats
    this.diagnosticHistory.forEach(result => {
      if (result.status === 'healthy' && result.requestFormat) {
        results.workingFormats!.push(result.requestFormat);
      }
    });

    // Enhanced decision logic
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

    // CORS-specific recommendations
    if (results.corsStatus === 'blocked') {
      results.recommendation = 'offline_mode';
      console.warn('⚠️ CORS blocked - backend configuration needed');
    }

    this.lastHealthCheck = results as APIHealthStatus;
    console.log('📊 Enhanced diagnostic complete:', results);
    
    return results as APIHealthStatus;
  }

  private static async testCORSConfiguration(): Promise<'working' | 'blocked' | 'unknown'> {
    try {
      const response = await fetch(`${this.API_URL}/health`, {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type, Authorization'
        }
      });

      const corsHeaders = response.headers.get('Access-Control-Allow-Origin');
      
      if (corsHeaders && (corsHeaders === '*' || corsHeaders === window.location.origin)) {
        console.log('✅ CORS configuration working');
        return 'working';
      } else {
        console.warn('⚠️ CORS headers present but restrictive:', corsHeaders);
        return 'blocked';
      }
    } catch (error) {
      console.error('❌ CORS test failed:', error);
      return 'unknown';
    }
  }

  private static async testEndpointWithFormats(
    endpoint: string, 
    method: string, 
    formats?: Array<{format: string, body?: any, urlSuffix?: string}>,
    extraHeaders?: Record<string, string>
  ): Promise<DiagnosticResult> {
    const baseHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': window.location.origin,
      ...extraHeaders
    };

    // Test simple endpoint first
    if (!formats) {
      return this.testSingleEndpoint(endpoint, method, undefined, baseHeaders);
    }

    // Test multiple formats
    for (const formatTest of formats) {
      const result = await this.testSingleEndpoint(
        `${endpoint}${formatTest.urlSuffix || ''}`, 
        method, 
        formatTest.body, 
        baseHeaders,
        formatTest.format
      );
      
      if (result.status === 'healthy') {
        return result; // Return first successful format
      }
    }

    // If all formats failed, return the last result
    return this.createFailedResult(endpoint, 'All formats failed');
  }

  private static async testSingleEndpoint(
    fullEndpoint: string,
    method: string,
    body?: any,
    headers?: Record<string, string>,
    formatName?: string
  ): Promise<DiagnosticResult> {
    const startTime = Date.now();
    const fullUrl = `${this.API_URL}${fullEndpoint}`;
    
    try {
      const response = await fetch(fullUrl, {
        method,
        headers,
        ...(body && { body: JSON.stringify(body) }),
        signal: AbortSignal.timeout(5000)
      });

      const latency = Date.now() - startTime;
      
      if (response.ok) {
        const result: DiagnosticResult = {
          endpoint: fullEndpoint,
          status: latency > 3000 ? 'degraded' : 'healthy',
          latency,
          httpStatus: response.status,
          requestFormat: formatName,
          timestamp: new Date()
        };
        
        this.diagnosticHistory.push(result);
        return result;
      } else {
        const errorText = await response.text().catch(() => 'Unknown error');
        const result: DiagnosticResult = {
          endpoint: fullEndpoint,
          status: response.status >= 500 ? 'failed' : 'degraded',
          latency,
          httpStatus: response.status,
          requestFormat: formatName,
          error: `HTTP ${response.status}: ${errorText}`,
          timestamp: new Date()
        };
        
        this.diagnosticHistory.push(result);
        return result;
      }
    } catch (error) {
      const latency = Date.now() - startTime;
      const result: DiagnosticResult = {
        endpoint: fullEndpoint,
        status: 'failed',
        latency,
        requestFormat: formatName,
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
    return this.diagnosticHistory.slice(-10);
  }

  static clearHistory(): void {
    this.diagnosticHistory = [];
  }

  static getConnectionSummary(): {
    totalTests: number;
    successRate: number;
    averageLatency: number;
    lastTestTime: Date | null;
    workingFormats: string[];
    corsStatus: string;
  } {
    const recentHistory = this.diagnosticHistory.slice(-5);
    const successfulTests = recentHistory.filter(test => test.status === 'healthy').length;
    const totalLatency = recentHistory.reduce((sum, test) => sum + test.latency, 0);
    const workingFormats = [...new Set(recentHistory
      .filter(test => test.status === 'healthy' && test.requestFormat)
      .map(test => test.requestFormat!))];
    
    return {
      totalTests: recentHistory.length,
      successRate: recentHistory.length > 0 ? (successfulTests / recentHistory.length) * 100 : 0,
      averageLatency: recentHistory.length > 0 ? totalLatency / recentHistory.length : 0,
      lastTestTime: recentHistory.length > 0 ? recentHistory[recentHistory.length - 1].timestamp : null,
      workingFormats,
      corsStatus: this.lastHealthCheck?.corsStatus || 'unknown'
    };
  }
}
