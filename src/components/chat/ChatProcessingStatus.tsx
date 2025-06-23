
import React from 'react';
import { CheckCircle, AlertTriangle, Wifi } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ChatProcessingStatusProps {
  connectionChecked: boolean;
  isConnected: boolean;
  processingStatus: 'idle' | 'sending' | 'diagnosing';
}

export const ChatProcessingStatus: React.FC<ChatProcessingStatusProps> = ({
  connectionChecked,
  isConnected,
  processingStatus
}) => {
  const getConnectionBadge = () => {
    if (!connectionChecked) {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
          <Wifi className="w-3 h-3" />
          <span className="text-xs">جاري الاتصال...</span>
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
        {isConnected ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
        <span className="text-xs">{isConnected ? 'متصل' : 'غير متصل'}</span>
      </Badge>
    );
  };

  const getProcessingBadge = () => {
    if (processingStatus === 'sending') {
      return (
        <Badge variant="secondary" className="text-xs animate-pulse">
          جاري الإرسال...
        </Badge>
      );
    }
    
    if (processingStatus === 'diagnosing') {
      return (
        <Badge variant="outline" className="text-xs animate-pulse">
          جاري التشخيص...
        </Badge>
      );
    }
    
    return null;
  };

  return (
    <>
      {getConnectionBadge()}
      {getProcessingBadge()}
    </>
  );
};
