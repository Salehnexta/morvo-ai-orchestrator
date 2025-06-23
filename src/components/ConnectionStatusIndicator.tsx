
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
  isChecking?: boolean;
  lastChecked?: Date;
  error?: string;
  latency?: number;
  onRetry?: () => void;
}

export const ConnectionStatusIndicator: React.FC<ConnectionStatusProps> = ({
  isConnected,
  isChecking = false,
  lastChecked,
  error,
  latency,
  onRetry
}) => {
  const getStatusIcon = () => {
    if (isChecking) {
      return <Clock className="w-3 h-3 animate-spin" />;
    }
    
    if (isConnected) {
      return <CheckCircle className="w-3 h-3" />;
    }
    
    if (error) {
      return <AlertTriangle className="w-3 h-3" />;
    }
    
    return <WifiOff className="w-3 h-3" />;
  };

  const getStatusText = () => {
    if (isChecking) {
      return 'جاري التحقق...';
    }
    
    if (isConnected) {
      return latency ? `متصل (${latency}ms)` : 'متصل';
    }
    
    if (error) {
      return 'خطأ في الاتصال';
    }
    
    return 'غير متصل';
  };

  const getStatusVariant = () => {
    if (isChecking) return 'outline';
    if (isConnected) return 'default';
    return 'destructive';
  };

  const getStatusColor = () => {
    if (isChecking) return 'text-yellow-600';
    if (isConnected) return 'text-green-600';
    return 'text-red-600';
  };

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant={getStatusVariant()} 
        className={`flex items-center gap-1 ${getStatusColor()}`}
      >
        {getStatusIcon()}
        <span className="text-xs">{getStatusText()}</span>
      </Badge>
      
      {error && onRetry && (
        <button
          onClick={onRetry}
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          إعادة المحاولة
        </button>
      )}
      
      {lastChecked && (
        <span className="text-xs text-gray-500">
          آخر فحص: {lastChecked.toLocaleTimeString('ar-SA')}
        </span>
      )}
    </div>
  );
};
