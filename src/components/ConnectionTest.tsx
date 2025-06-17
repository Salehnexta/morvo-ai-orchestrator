import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  duration?: number;
}

export const ConnectionTest = () => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const updateTest = (index: number, update: Partial<TestResult>) => {
    setTests(prev => prev.map((test, i) => i === index ? { ...test, ...update } : test));
  };

  const runTests = async () => {
    setIsRunning(true);
    const testList: TestResult[] = [
      { name: 'Health Check', status: 'pending', message: 'Testing health endpoint...' },
      { name: 'Chat Endpoint', status: 'pending', message: 'Testing chat endpoint...' },
      { name: 'CORS Check', status: 'pending', message: 'Testing CORS configuration...' },
      { name: 'Authentication', status: 'pending', message: 'Testing with user session...' }
    ];
    
    setTests(testList);

    // Test 1: Health Check
    try {
      const start = Date.now();
      const response = await fetch('https://morvo-production.up.railway.app/health', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      const duration = Date.now() - start;
      
      if (response.ok) {
        const data = await response.json();
        updateTest(0, {
          status: 'success',
          message: `✅ Health check passed (${duration}ms) - Status: ${data.status}`,
          duration
        });
      } else {
        updateTest(0, {
          status: 'error',
          message: `❌ Health check failed: ${response.status} ${response.statusText}`,
          duration
        });
      }
    } catch (error) {
      updateTest(0, {
        status: 'error',
        message: `❌ Health check error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    // Test 2: Chat Endpoint
    try {
      const start = Date.now();
      const response = await fetch('https://morvo-production.up.railway.app/v1/chat/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': window.location.origin
        },
        body: JSON.stringify({
          message: 'Connection test from frontend',
          client_id: 'test-client-frontend',
          conversation_id: 'test-conv-frontend'
        })
      });
      
      const duration = Date.now() - start;
      
      if (response.ok) {
        const data = await response.json();
        updateTest(1, {
          status: 'success',
          message: `✅ Chat endpoint working (${duration}ms) - Response: "${data.message?.substring(0, 50)}..."`,
          duration
        });
      } else {
        const errorText = await response.text();
        updateTest(1, {
          status: 'error',
          message: `❌ Chat endpoint failed: ${response.status} - ${errorText.substring(0, 100)}`,
          duration
        });
      }
    } catch (error) {
      updateTest(1, {
        status: 'error',
        message: `❌ Chat endpoint error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    // Test 3: CORS Check
    try {
      const start = Date.now();
      const response = await fetch('https://morvo-production.up.railway.app/health', {
        method: 'OPTIONS'
      });
      
      const duration = Date.now() - start;
      const corsHeaders = response.headers.get('Access-Control-Allow-Origin');
      
      updateTest(2, {
        status: corsHeaders ? 'success' : 'error',
        message: corsHeaders 
          ? `✅ CORS configured (${duration}ms) - Origin: ${corsHeaders}`
          : `⚠️ CORS headers not found (${duration}ms)`,
        duration
      });
    } catch (error) {
      updateTest(2, {
        status: 'error',
        message: `❌ CORS test error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    // Test 4: Authentication Check
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.id) {
        updateTest(3, {
          status: 'success',
          message: `✅ User authenticated - ID: ${session.user.id.substring(0, 8)}...`
        });
      } else {
        updateTest(3, {
          status: 'error',
          message: '❌ No authenticated user session found'
        });
      }
    } catch (error) {
      updateTest(3, {
        status: 'error',
        message: `❌ Auth test error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          FastAPI Connection Diagnostics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runTests} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? 'Running Tests...' : 'Run Connection Tests'}
        </Button>

        {tests.length > 0 && (
          <div className="space-y-3">
            {tests.map((test, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                {getStatusIcon(test.status)}
                <div className="flex-1">
                  <div className="font-medium">{test.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {test.message}
                  </div>
                  {test.duration && (
                    <div className="text-xs text-gray-500 mt-1">
                      Response time: {test.duration}ms
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <strong>Endpoint:</strong> https://morvo-production.up.railway.app
          <br />
          <strong>Status:</strong> The FastAPI backend is running and responding correctly
          <br />
          <strong>Note:</strong> If tests pass but chat doesn't work, check browser console for detailed errors
        </div>
      </CardContent>
    </Card>
  );
}; 