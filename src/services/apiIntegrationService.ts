
import { MorvoAIService } from './morvoAIService';
import { JourneyManager } from './journeyManager';
import { SmartContentDetector } from './smartContentDetector';

interface ApiHealth {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  lastChecked: Date;
  responseTime?: number;
  error?: string;
}

export class ApiIntegrationService {
  private static healthStatus: Map<string, ApiHealth> = new Map();

  static async testAllConnections(): Promise<ApiHealth[]> {
    const services = [
      { name: 'MorvoAI', test: () => MorvoAIService.testConnection() },
      { name: 'Railway', test: () => this.testRailwayConnection() }
    ];

    const results = await Promise.allSettled(
      services.map(async (service) => {
        const startTime = Date.now();
        try {
          const isHealthy = await service.test();
          const responseTime = Date.now() - startTime;
          
          const health: ApiHealth = {
            service: service.name,
            status: isHealthy ? 'healthy' : 'degraded',
            lastChecked: new Date(),
            responseTime
          };
          
          this.healthStatus.set(service.name, health);
          return health;
        } catch (error) {
          const health: ApiHealth = {
            service: service.name,
            status: 'down',
            lastChecked: new Date(),
            error: error instanceof Error ? error.message : 'Unknown error'
          };
          
          this.healthStatus.set(service.name, health);
          return health;
        }
      })
    );

    return results.map(result => 
      result.status === 'fulfilled' ? result.value : {
        service: 'Unknown',
        status: 'down' as const,
        lastChecked: new Date(),
        error: 'Test failed'
      }
    );
  }

  private static async testRailwayConnection(): Promise<boolean> {
    try {
      const response = await fetch('https://morvo-production.up.railway.app/health', {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  static getServiceHealth(serviceName: string): ApiHealth | null {
    return this.healthStatus.get(serviceName) || null;
  }

  static async processMessageWithFallback(message: string, context?: any): Promise<any> {
    // Try MorvoAI first
    try {
      return await MorvoAIService.processMessage(message, context);
    } catch (error) {
      console.warn('MorvoAI failed, using fallback:', error);
      
      // Fallback to local processing
      return {
        response: "I'm currently having connection issues. Please try again in a moment.",
        tokens_used: 0,
        suggested_actions: [],
        confidence_score: 0.5
      };
    }
  }
}
