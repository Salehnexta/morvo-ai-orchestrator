
import React, { useState, useEffect } from 'react';
import { Bug, X, RefreshCw } from 'lucide-react';
import { MorvoAIService } from '@/services/morvoAIService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DebugLog {
  time: string;
  action: string;
  data: any;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface DebugPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ isVisible, onClose }) => {
  const [debugLogs, setDebugLogs] = useState<DebugLog[]>([]);
  const [connectionStats, setConnectionStats] = useState<any>(null);

  useEffect(() => {
    if (isVisible) {
      checkConnectionStats();
      const interval = setInterval(checkConnectionStats, 5000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const checkConnectionStats = async () => {
    try {
      const healthStatus = MorvoAIService.getHealthStatus();
      const conversationId = MorvoAIService.getConversationId();
      
      setConnectionStats({
        health: healthStatus,
        conversationId,
        lastUpdate: new Date().toLocaleTimeString()
      });
      
      addDebugLog('Health Check', { 
        status: healthStatus?.status, 
        latency: healthStatus?.latency 
      }, 'info');
    } catch (error) {
      addDebugLog('Health Check Failed', { error: error.message }, 'error');
    }
  };

  const addDebugLog = (action: string, data: any, type: DebugLog['type'] = 'info') => {
    setDebugLogs(prev => [...prev, {
      time: new Date().toLocaleTimeString(),
      action,
      data,
      type
    }].slice(-20)); // Keep last 20 logs
  };

  const testConnection = async () => {
    addDebugLog('Manual Connection Test', { initiated: true }, 'info');
    
    try {
      const result = await MorvoAIService.testConnection();
      addDebugLog('Connection Test Result', { success: result }, result ? 'success' : 'error');
      
      // Test a simple message
      const testMessage = await MorvoAIService.processMessage('مرحبا، هذا اختبار');
      addDebugLog('Test Message', { 
        response: testMessage.response.substring(0, 50) + '...',
        processingTime: testMessage.processing_time,
        confidence: testMessage.confidence_score
      }, 'success');
    } catch (error) {
      addDebugLog('Connection Test Failed', { error: error.message }, 'error');
    }
  };

  const resetConversation = () => {
    MorvoAIService.resetConversation();
    addDebugLog('Conversation Reset', { newId: 'Will be generated on next message' }, 'info');
    checkConnectionStats();
  };

  const clearLogs = () => {
    setDebugLogs([]);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 right-4 w-96 h-96 z-50">
      <Card className="h-full bg-gray-900 text-white border-gray-700">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bug className="w-4 h-4" />
              Chat Debug Console
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3 h-full overflow-hidden flex flex-col">
          {/* Connection Stats */}
          <div className="bg-gray-800 p-2 rounded mb-2 text-xs">
            <div><strong>Status:</strong> {connectionStats?.health?.status || 'Unknown'}</div>
            <div><strong>Latency:</strong> {connectionStats?.health?.latency || 'N/A'}ms</div>
            <div><strong>Conversation:</strong> {connectionStats?.conversationId || 'None'}</div>
            <div><strong>Updated:</strong> {connectionStats?.lastUpdate || 'Never'}</div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mb-2">
            <Button size="sm" variant="outline" onClick={testConnection}>
              <RefreshCw className="w-3 h-3 mr-1" />
              Test
            </Button>
            <Button size="sm" variant="outline" onClick={resetConversation}>
              Reset Chat
            </Button>
            <Button size="sm" variant="outline" onClick={clearLogs}>
              Clear
            </Button>
          </div>

          {/* Debug Logs */}
          <div className="flex-1 overflow-y-auto bg-gray-800 p-2 rounded text-xs">
            {debugLogs.map((log, i) => (
              <div key={i} className={`mb-2 p-1 rounded ${
                log.type === 'error' ? 'bg-red-900/50' :
                log.type === 'success' ? 'bg-green-900/50' :
                log.type === 'warning' ? 'bg-yellow-900/50' :
                'bg-gray-700/50'
              }`}>
                <div className="font-mono text-green-400">
                  {log.time} - {log.action}
                </div>
                <pre className="text-gray-300 whitespace-pre-wrap">
                  {JSON.stringify(log.data, null, 1)}
                </pre>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
