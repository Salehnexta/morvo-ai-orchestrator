
import React, { useState, useEffect } from 'react';
import { Bug, X, RefreshCw, Activity, Wifi, AlertTriangle } from 'lucide-react';
import { UnifiedDiagnostics } from '@/services/unifiedDiagnostics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EnhancedDebugPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

export const EnhancedDebugPanel: React.FC<EnhancedDebugPanelProps> = ({ isVisible, onClose }) => {
  const [diagnosticData, setDiagnosticData] = useState<any>(null);
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);
  const [diagnosticHistory, setDiagnosticHistory] = useState<any[]>([]);

  useEffect(() => {
    if (isVisible) {
      loadDiagnosticData();
      const interval = setInterval(loadDiagnosticData, 10000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const loadDiagnosticData = async () => {
    const connectionStatus = UnifiedDiagnostics.getConnectionStatus();
    const history = UnifiedDiagnostics.getDiagnosticResults();
    
    setDiagnosticData(connectionStatus);
    setDiagnosticHistory(history);
  };

  const runFullDiagnostic = async () => {
    setIsRunningDiagnostic(true);
    try {
      const isConnected = await UnifiedDiagnostics.testConnection();
      const results = UnifiedDiagnostics.getDiagnosticResults();
      setDiagnosticHistory(results);
      
      console.log('✅ Full diagnostic test completed:', { isConnected, results });
    } catch (error) {
      console.error('❌ Full diagnostic failed:', error);
    } finally {
      setIsRunningDiagnostic(false);
      loadDiagnosticData();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <Wifi className="w-4 h-4 text-green-500" />;
      case 'degraded': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'failed': return <X className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      healthy: 'default',
      degraded: 'secondary',
      failed: 'destructive'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 right-4 w-[450px] h-[500px] z-50">
      <Card className="h-full bg-gray-900 text-white border-gray-700">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bug className="w-4 h-4" />
              Enhanced Chat Diagnostics
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3 h-full overflow-hidden flex flex-col">
          
          {/* Overall Status */}
          {diagnosticData && (
            <div className="bg-gray-800 p-3 rounded mb-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">System Status</h3>
                {getStatusBadge(diagnosticData.status || 'unknown')}
              </div>
              <div className="text-xs space-y-1">
                <div>Connected: <span className="text-blue-400">{diagnosticData.isConnected ? 'Yes' : 'No'}</span></div>
                <div>Last Check: {diagnosticData.lastChecked ? new Date(diagnosticData.lastChecked).toLocaleTimeString() : 'Never'}</div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 mb-3">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={runFullDiagnostic}
              disabled={isRunningDiagnostic}
            >
              <RefreshCw className={`w-3 h-3 mr-1 ${isRunningDiagnostic ? 'animate-spin' : ''}`} />
              {isRunningDiagnostic ? 'Testing...' : 'Full Test'}
            </Button>
            <Button size="sm" variant="outline" onClick={() => UnifiedDiagnostics.resetConversation()}>
              Reset Chat
            </Button>
            <Button size="sm" variant="outline" onClick={() => UnifiedDiagnostics.clearDiagnosticCache()}>
              Clear
            </Button>
          </div>

          {/* Diagnostic History */}
          <div className="flex-1 overflow-y-auto bg-gray-800 p-2 rounded text-xs">
            <div className="font-semibold mb-2">Recent Diagnostic History</div>
            {diagnosticHistory.map((entry, i) => (
              <div key={i} className={`mb-2 p-2 rounded ${
                entry.success ? 'bg-green-900/30' : 'bg-red-900/30'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-blue-400">{entry.format}</span>
                  <span className="text-gray-400">{entry.latency}ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{getStatusBadge(entry.success ? 'healthy' : 'failed')}</span>
                  <span className="text-gray-400">{entry.timestamp ? new Date(entry.timestamp).toLocaleTimeString() : ''}</span>
                </div>
                {entry.error && (
                  <div className="text-red-400 text-xs mt-1">{entry.error}</div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
