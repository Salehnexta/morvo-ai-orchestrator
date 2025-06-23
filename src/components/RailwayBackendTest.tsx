
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Activity } from 'lucide-react';
import { RailwayBackendService } from '@/services/railwayBackendService';
import { UnifiedChatService } from '@/services/unifiedChatService';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  latency?: number;
}

export const RailwayBackendTest: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);

    const tests = [
      {
        name: 'Railway Health Check',
        test: async () => {
          const start = Date.now();
          const result = await RailwayBackendService.checkServerHealth();
          const latency = Date.now() - start;
          return { success: result.success, message: result.error || 'Healthy', latency };
        }
      },
      {
        name: 'Railway Chat Processing',
        test: async () => {
          const start = Date.now();
          const result = await RailwayBackendService.processMessage('مرحبا، هذا اختبار');
          const latency = Date.now() - start;
          return { success: result.success, message: result.error || 'Message processed', latency };
        }
      },
      {
        name: 'Unified Chat Service',
        test: async () => {
          const start = Date.now();
          const result = await UnifiedChatService.sendMessage('اختبار الخدمة الموحدة');
          const latency = Date.now() - start;
          return { success: result.success !== false, message: result.error || 'Service working', latency };
        }
      },
      {
        name: 'Railway Connection Test',
        test: async () => {
          const start = Date.now();
          const result = await UnifiedChatService.testConnection();
          const latency = Date.now() - start;
          return { success: result, message: result ? 'Connected' : 'Connection failed', latency };
        }
      }
    ];

    for (const { name, test } of tests) {
      setResults(prev => [...prev, { name, status: 'pending', message: 'Running...' }]);
      
      try {
        const { success, message, latency } = await test();
        setResults(prev => prev.map(r => 
          r.name === name 
            ? { name, status: success ? 'success' : 'error', message, latency }
            : r
        ));
      } catch (error) {
        setResults(prev => prev.map(r => 
          r.name === name 
            ? { name, status: 'error', message: error instanceof Error ? error.message : 'Unknown error' }
            : r
        ));
      }

      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success': return <Badge className="bg-green-100 text-green-800">نجح</Badge>;
      case 'error': return <Badge variant="destructive">فشل</Badge>;
      case 'pending': return <Badge variant="outline">جاري التشغيل</Badge>;
      default: return <Badge variant="outline">في الانتظار</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          اختبار الاتصال مع خادم Railway
        </CardTitle>
        <CardDescription>
          تحقق من حالة الاتصال مع خادم Railway Backend والخدمات المختلفة
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Button 
          onClick={runTests} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? 'جاري تشغيل الاختبارات...' : 'تشغيل اختبارات الاتصال'}
        </Button>

        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">نتائج الاختبار:</h3>
            {results.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <div className="font-medium">{result.name}</div>
                    <div className="text-sm text-gray-600">{result.message}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {result.latency && (
                    <span className="text-xs text-gray-500">{result.latency}ms</span>
                  )}
                  {getStatusBadge(result.status)}
                </div>
              </div>
            ))}
          </div>
        )}

        {results.length > 0 && !isRunning && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm">
              <strong>ملخص النتائج:</strong>
              <div className="mt-1">
                ✅ نجح: {results.filter(r => r.status === 'success').length} |
                ❌ فشل: {results.filter(r => r.status === 'error').length} |
                ⏳ متوسط زمن الاستجابة: {
                  results.filter(r => r.latency).length > 0 
                    ? Math.round(results.filter(r => r.latency).reduce((acc, r) => acc + (r.latency || 0), 0) / results.filter(r => r.latency).length)
                    : 0
                }ms
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
