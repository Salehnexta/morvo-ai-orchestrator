
import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { MorvoAIService } from '@/services/morvoAIService';

interface ConnectionStatusProps {
  isConnecting: boolean;
  theme: 'light' | 'dark';
  content: {
    connecting: string;
    connected: string;
  };
}

export const ConnectionStatus = ({ isConnecting, theme, content }: ConnectionStatusProps) => {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [isHealthy, setIsHealthy] = useState(false);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const isConnected = await MorvoAIService.testConnection();
        const status = MorvoAIService.getHealthStatus();
        setHealthStatus(status);
        setIsHealthy(isConnected);
      } catch (error) {
        console.error('Health check failed:', error);
        setIsHealthy(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (isConnecting) return 'bg-yellow-500';
    if (!isHealthy) return 'bg-red-500';
    if (healthStatus?.status === 'degraded') return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getStatusIcon = () => {
    if (!isHealthy) return <WifiOff className="w-4 h-4" />;
    return <Wifi className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (isConnecting) return content.connecting;
    if (!isHealthy) return 'غير متصل';
    if (healthStatus?.status === 'degraded') return 'اتصال بطيء';
    return content.connected;
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full animate-pulse ${getStatusColor()}`}></div>
      <div className="flex items-center gap-1">
        {getStatusIcon()}
        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {getStatusText()}
        </span>
      </div>
      {healthStatus?.latency && (
        <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          ({healthStatus.latency}ms)
        </span>
      )}
    </div>
  );
};
