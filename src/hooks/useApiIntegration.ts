
import { useState, useEffect, useCallback } from 'react';
import { ApiIntegrationService } from '@/services/apiIntegrationService';
import { useToast } from '@/hooks/use-toast';

interface ApiIntegrationState {
  isHealthy: boolean;
  services: Array<{
    name: string;
    status: 'healthy' | 'degraded' | 'down';
    lastChecked: Date;
    responseTime?: number;
  }>;
  lastHealthCheck: Date | null;
}

export const useApiIntegration = () => {
  const [state, setState] = useState<ApiIntegrationState>({
    isHealthy: false,
    services: [],
    lastHealthCheck: null
  });
  
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const checkHealth = useCallback(async () => {
    setLoading(true);
    try {
      const results = await ApiIntegrationService.testAllConnections();
      
      const healthyServices = results.filter(r => r.status === 'healthy').length;
      const isHealthy = healthyServices > 0;
      
      setState({
        isHealthy,
        services: results.map(r => ({
          name: r.service,
          status: r.status,
          lastChecked: r.lastChecked,
          responseTime: r.responseTime
        })),
        lastHealthCheck: new Date()
      });

      if (!isHealthy) {
        toast({
          title: "Connection Issues",
          description: "Some services are experiencing connectivity problems",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Health check failed:', error);
      toast({
        title: "Health Check Failed",
        description: "Unable to verify service connectivity",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const processMessage = useCallback(async (message: string, context?: any) => {
    try {
      return await ApiIntegrationService.processMessageWithFallback(message, context);
    } catch (error) {
      toast({
        title: "Message Processing Failed",
        description: "Unable to process your message. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  useEffect(() => {
    checkHealth();
    
    // Check health every 5 minutes
    const interval = setInterval(checkHealth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  return {
    ...state,
    loading,
    checkHealth,
    processMessage
  };
};
