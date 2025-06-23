
import { useState } from 'react';
import { SimpleRailwayAuth } from '@/services/simpleRailwayAuth';
import { useToast } from '@/hooks/use-toast';

export const useChatDiagnostics = (
  language: string,
  setIsConnected: (connected: boolean) => void,
  setConnectionChecked: (checked: boolean) => void
) => {
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'sending' | 'diagnosing'>('idle');
  const [diagnosticResults, setDiagnosticResults] = useState<any[]>([]);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const { toast } = useToast();

  const runDiagnostics = async () => {
    setProcessingStatus('diagnosing');
    try {
      console.log('🧪 Running comprehensive diagnostic tests...');
      const results = await SimpleRailwayAuth.runDiagnosticTests();
      setDiagnosticResults(results);
      setShowDiagnostics(true);
      
      const successfulTest = results.find(r => r.success);
      if (successfulTest) {
        setIsConnected(true);
        toast({
          title: language === 'ar' ? 'تم إيجاد تنسيق عمل!' : 'Working Format Found!',
          description: language === 'ar' 
            ? `تنسيق "${successfulTest.format}" يعمل بنجاح` 
            : `Format "${successfulTest.format}" is working`,
          variant: "default",
        });
      } else {
        setIsConnected(false);
        toast({
          title: language === 'ar' ? 'فشل جميع الاختبارات' : 'All Tests Failed',
          description: language === 'ar' 
            ? 'يرجى التحقق من إعدادات الخادم'
            : 'Please check server configuration',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Diagnostic tests failed:', error);
    } finally {
      setProcessingStatus('idle');
      setConnectionChecked(true);
    }
  };

  return {
    processingStatus,
    setProcessingStatus,
    diagnosticResults,
    showDiagnostics,
    setShowDiagnostics,
    runDiagnostics
  };
};
