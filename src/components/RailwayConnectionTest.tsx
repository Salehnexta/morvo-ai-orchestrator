
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MorvoAIService } from "@/services/morvoAIService";
import { CheckCircle, XCircle, Loader2, Wifi } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const RailwayConnectionTest = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<{
    health: boolean | null;
    agents: boolean | null;
    chat: boolean | null;
  }>({
    health: null,
    agents: null,
    chat: null
  });
  const { toast } = useToast();

  const runConnectionTest = async () => {
    setIsTesting(true);
    setTestResults({ health: null, agents: null, chat: null });

    try {
      // اختبار Health Check
      console.log('Testing Railway Health...');
      await MorvoAIService.healthCheck();
      setTestResults(prev => ({ ...prev, health: true }));

      // اختبار الوكلاء
      console.log('Testing Railway Agents...');
      await MorvoAIService.getAgents();
      setTestResults(prev => ({ ...prev, agents: true }));

      // اختبار المحادثة
      console.log('Testing Railway Chat...');
      await MorvoAIService.sendMessage("مرحبا، هذا اختبار اتصال");
      setTestResults(prev => ({ ...prev, chat: true }));

      toast({
        title: "✅ نجح الاتصال",
        description: "تم الاتصال بـ Railway بنجاح",
        duration: 3000,
      });

    } catch (error) {
      console.error('Connection test failed:', error);
      
      toast({
        title: "❌ فشل الاتصال",
        description: "فشل في الاتصال بـ Railway",
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

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Wifi className="w-5 h-5" />
          اختبار الاتصال بـ Railway
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span>Health Check</span>
            {getStatusIcon(testResults.health)}
          </div>
          <div className="flex items-center justify-between">
            <span>جلب الوكلاء</span>
            {getStatusIcon(testResults.agents)}
          </div>
          <div className="flex items-center justify-between">
            <span>اختبار المحادثة</span>
            {getStatusIcon(testResults.chat)}
          </div>
        </div>

        <Button 
          onClick={runConnectionTest} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              جاري الاختبار...
            </>
          ) : (
            'اختبار الاتصال'
          )}
        </Button>

        <div className="mt-3 text-sm text-gray-600">
          <p>Railway URL: morvo-production.up.railway.app</p>
          <p>Protocol: HTTPS</p>
        </div>
      </CardContent>
    </Card>
  );
};
