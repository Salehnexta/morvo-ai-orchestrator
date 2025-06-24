
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RailwayBackendService } from "@/services/railwayBackendService";
import { CheckCircle, XCircle, Loader2, Wifi, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const RailwayConnectivityTest = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<{
    health: boolean | null;
    chat: boolean | null;
    details: any;
  }>({
    health: null,
    chat: null,
    details: null
  });
  const { toast } = useToast();

  const runConnectivityTest = async () => {
    setIsTesting(true);
    setTestResults({ health: null, chat: null, details: null });

    try {
      console.log('🧪 Running Railway connectivity test...');
      
      const result = await RailwayBackendService.testConnectivity();
      
      if (result.success) {
        setTestResults({
          health: true,
          chat: true,
          details: result.data
        });
        
        toast({
          title: "✅ Railway متصل بنجاح!",
          description: "تم الاتصال بخادم Railway وتم اختبار جميع الوظائف",
          duration: 5000,
        });
      } else {
        setTestResults({
          health: false,
          chat: false,
          details: { error: result.error }
        });
        
        toast({
          title: "❌ فشل الاتصال بـ Railway",
          description: result.error,
          variant: "destructive",
          duration: 7000,
        });
      }

    } catch (error) {
      console.error('❌ Connectivity test failed:', error);
      
      setTestResults({
        health: false,
        chat: false,
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
      
      toast({
        title: "❌ خطأ في اختبار الاتصال",
        description: "فشل في تشغيل اختبار الاتصال",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const getStatusIcon = (status: boolean | null) => {
    if (status === null) return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
    if (status === true) return <CheckCircle className="w-4 h-4 text-green-600" />;
    return <XCircle className="w-4 h-4 text-red-600" />;
  };

  const serverStatus = RailwayBackendService.getServerStatus();

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-600" />
          اختبار الاتصال بـ Railway Backend
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Badge variant="outline" className="text-xs">
            {serverStatus.baseUrl}
          </Badge>
          {serverStatus.isHealthy ? (
            <Badge variant="outline" className="text-green-600 border-green-200">
              صحي
            </Badge>
          ) : (
            <Badge variant="outline" className="text-red-600 border-red-200">
              غير متاح
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Wifi className="w-4 h-4" />
              اختبار الصحة (Health Check)
            </span>
            {getStatusIcon(testResults.health)}
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              اختبار المحادثة (Chat Test)
            </span>
            {getStatusIcon(testResults.chat)}
          </div>
        </div>

        <Button 
          onClick={runConnectivityTest} 
          disabled={isTesting}
          className="w-full"
        >
          {isTesting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              جاري الاختبار...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              اختبار الاتصال مع Railway
            </>
          )}
        </Button>

        {testResults.details && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
            <div className="font-medium mb-2">تفاصيل الاختبار:</div>
            {testResults.details.error ? (
              <div className="text-red-600">{testResults.details.error}</div>
            ) : (
              <div className="space-y-1">
                <div>✅ Health: {testResults.details.health?.status}</div>
                <div>✅ Chat: {testResults.details.chat}</div>
                <div>🕒 الوقت: {testResults.details.timestamp}</div>
                <div>🔗 URL: {testResults.details.baseUrl}</div>
              </div>
            )}
          </div>
        )}

        <div className="mt-3 text-xs text-gray-500">
          <p>آخر فحص صحة: {new Date(serverStatus.lastCheck).toLocaleString('ar-SA')}</p>
          <p>Domain: d91bae1e-ac01-4697-8921-bf9fd4aecaf6.lovableproject.com</p>
        </div>
      </CardContent>
    </Card>
  );
};
