
import React from 'react';
import { Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatHeader } from './ChatHeader';
import { ChatProcessingStatus } from './ChatProcessingStatus';

interface ChatConnectionStatusProps {
  theme: 'light' | 'dark';
  isRTL: boolean;
  t: any;
  connectionChecked: boolean;
  clientId: string;
  isConnected: boolean;
  processingStatus: 'idle' | 'sending' | 'diagnosing';
  runDiagnostics: () => Promise<void>;
  showDiagnostics: boolean;
  setShowDiagnostics: (show: boolean) => void;
}

export const ChatConnectionStatus: React.FC<ChatConnectionStatusProps> = ({
  theme,
  isRTL,
  t,
  connectionChecked,
  clientId,
  isConnected,
  processingStatus,
  runDiagnostics,
  showDiagnostics,
  setShowDiagnostics
}) => {
  return (
    <div className="flex-shrink-0">
      <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <ChatHeader 
            theme={theme}
            isRTL={isRTL}
            content={{
              masterAgent: t.masterAgent,
              clientAgent: '',
              connecting: t.connecting,
              connected: t.connected
            }}
            isConnecting={!connectionChecked}
            clientId={clientId}
            onToggleTheme={() => {}}
          />
          <ChatProcessingStatus
            connectionChecked={connectionChecked}
            isConnected={isConnected}
            processingStatus={processingStatus}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={runDiagnostics}
            disabled={processingStatus === 'diagnosing'}
            className="text-xs"
          >
            <Bug className="w-3 h-3 mr-1" />
            تشخيص
          </Button>
          
          {showDiagnostics && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowDiagnostics(false)}
              className="text-xs"
            >
              إخفاء
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
