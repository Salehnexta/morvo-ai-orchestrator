
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { RailwayBackendService } from '@/services/railwayBackendService';

interface RailwayStatus {
  isConnected: boolean;
  isHealthy: boolean;
  lastChecked: Date | null;
  serverInfo: any | null;
  error: string | null;
}

interface RailwayIntegration {
  status: RailwayStatus;
  checkConnection: () => Promise<boolean>;
  processMessage: (message: string, context?: any) => Promise<any>;
  getOnboardingQuestions: () => Promise<any[]>;
  getTokenPackages: () => Promise<any[]>;
  getUserProfile: () => Promise<any>;
  updateUserProfile: (data: any) => Promise<boolean>;
  runDiagnostics: () => Promise<any>;
}

export const useRailwayIntegration = (): RailwayIntegration => {
  const [status, setStatus] = useState<RailwayStatus>({
    isConnected: false,
    isHealthy: false,
    lastChecked: null,
    serverInfo: null,
    error: null
  });

  const { user } = useAuth();
  const { toast } = useToast();

  const checkConnection = useCallback(async (): Promise<boolean> => {
    try {
      console.log('🔗 Checking Railway backend connection...');
      
      const healthResult = await RailwayBackendService.checkServerHealth();
      
      if (healthResult.success) {
        setStatus({
          isConnected: true,
          isHealthy: true,
          lastChecked: new Date(),
          serverInfo: healthResult.data,
          error: null
        });
        
        console.log('✅ Railway backend connected successfully:', healthResult.data);
        return true;
      } else {
        setStatus(prev => ({
          ...prev,
          isConnected: false,
          isHealthy: false,
          lastChecked: new Date(),
          error: healthResult.error || 'Unknown error'
        }));
        
        console.error('❌ Railway backend connection failed:', healthResult.error);
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection test failed';
      
      setStatus(prev => ({
        ...prev,
        isConnected: false,
        isHealthy: false,
        lastChecked: new Date(),
        error: errorMessage
      }));
      
      console.error('❌ Railway connection check error:', error);
      return false;
    }
  }, []);

  const processMessage = useCallback(async (message: string, context?: any) => {
    if (!status.isConnected) {
      throw new Error('Railway backend not connected');
    }

    try {
      const result = await RailwayBackendService.processMessage(message, context);
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || 'Message processing failed');
      }
    } catch (error) {
      console.error('❌ Railway message processing error:', error);
      toast({
        title: "خطأ في المعالجة",
        description: "تعذر معالجة الرسالة عبر الخادم",
        variant: "destructive",
      });
      throw error;
    }
  }, [status.isConnected, toast]);

  const getOnboardingQuestions = useCallback(async (): Promise<any[]> => {
    try {
      const result = await RailwayBackendService.getOnboardingQuestions('ar');
      
      if (result.success) {
        return result.data || [];
      } else {
        console.warn('⚠️ Failed to get onboarding questions:', result.error);
        return [];
      }
    } catch (error) {
      console.error('❌ Railway onboarding questions error:', error);
      return [];
    }
  }, []);

  const getTokenPackages = useCallback(async (): Promise<any[]> => {
    try {
      const result = await RailwayBackendService.getTokenPackages();
      
      if (result.success) {
        return result.data || [];
      } else {
        console.warn('⚠️ Failed to get token packages:', result.error);
        return [];
      }
    } catch (error) {
      console.error('❌ Railway token packages error:', error);
      return [];
    }
  }, []);

  const getUserProfile = useCallback(async (): Promise<any> => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      const result = await RailwayBackendService.getCustomerProfile(user.id);
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || 'Profile fetch failed');
      }
    } catch (error) {
      console.error('❌ Railway profile fetch error:', error);
      throw error;
    }
  }, [user?.id]);

  const updateUserProfile = useCallback(async (data: any): Promise<boolean> => {
    if (!user?.id) {
      return false;
    }

    try {
      const result = await RailwayBackendService.updateCustomerProfile(user.id, data);
      
      if (result.success) {
        toast({
          title: "تم بنجاح",
          description: "تم تحديث الملف الشخصي",
        });
        return true;
      } else {
        toast({
          title: "خطأ في التحديث",
          description: result.error || "فشل في تحديث الملف الشخصي",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('❌ Railway profile update error:', error);
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تحديث الملف الشخصي",
        variant: "destructive",
      });
      return false;
    }
  }, [user?.id, toast]);

  const runDiagnostics = useCallback(async () => {
    console.log('🧪 Running Railway backend diagnostics...');
    
    const diagnostics = await RailwayBackendService.runComprehensiveTest();
    
    const summary = {
      totalTests: Object.keys(diagnostics).length,
      passedTests: Object.values(diagnostics).filter(result => result.success).length,
      failedTests: Object.values(diagnostics).filter(result => !result.success).length,
      results: diagnostics,
      timestamp: new Date().toISOString()
    };
    
    console.log('🧪 Railway diagnostics summary:', summary);
    
    toast({
      title: "تم اختبار الاتصال",
      description: `نجح ${summary.passedTests} من ${summary.totalTests} اختبارات`,
      variant: summary.failedTests === 0 ? "default" : "destructive"
    });
    
    return summary;
  }, [toast]);

  // Initialize connection on mount
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  // Auto-reconnect on user change
  useEffect(() => {
    if (user) {
      checkConnection();
    }
  }, [user, checkConnection]);

  return {
    status,
    checkConnection,
    processMessage,
    getOnboardingQuestions,
    getTokenPackages,
    getUserProfile,
    updateUserProfile,
    runDiagnostics
  };
};
