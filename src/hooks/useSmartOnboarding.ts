
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface OnboardingStatus {
  exists: boolean;
  onboarding_completed: boolean;
  onboarding_started: boolean;
  client_id?: string;
  needs_setup: boolean;
  profile_exists: boolean;
}

export const useSmartOnboarding = () => {
  const [status, setStatus] = useState<OnboardingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const checkOnboardingStatus = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return null;
    }

    try {
      setLoading(true);
      
      // Use the database function for consistent status checking
      const { data, error } = await supabase.rpc('get_user_onboarding_status', {
        p_user_id: user.id
      });

      if (error) {
        console.error('Error checking onboarding status:', error);
        // Fallback to manual check if function fails
        return await fallbackStatusCheck();
      }

      const onboardingStatus = data as OnboardingStatus;
      setStatus(onboardingStatus);
      return onboardingStatus;
    } catch (error) {
      console.error('Error in checkOnboardingStatus:', error);
      return await fallbackStatusCheck();
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const fallbackStatusCheck = async (): Promise<OnboardingStatus | null> => {
    try {
      // Get client record
      const { data: clientData } = await supabase
        .from('clients')
        .select('id, name, email')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (!clientData) {
        const fallbackStatus = {
          exists: false,
          onboarding_completed: false,
          onboarding_started: false,
          needs_setup: true,
          profile_exists: false
        };
        setStatus(fallbackStatus);
        return fallbackStatus;
      }

      // Get profile record
      const { data: profileData } = await supabase
        .from('customer_profiles')
        .select('profile_data, status')
        .eq('customer_id', user!.id)
        .eq('client_id', clientData.id)
        .maybeSingle();

      const fallbackStatus = {
        exists: true,
        client_id: clientData.id,
        profile_exists: !!profileData,
        onboarding_completed: profileData?.profile_data?.onboarding_completed || false,
        onboarding_started: profileData?.profile_data?.onboarding_started || false,
        needs_setup: false
      };

      setStatus(fallbackStatus);
      return fallbackStatus;
    } catch (error) {
      console.error('Fallback status check failed:', error);
      return null;
    }
  };

  const markOnboardingStarted = useCallback(async () => {
    if (!user?.id || !status?.client_id) return false;

    try {
      const { error } = await supabase
        .from('customer_profiles')
        .upsert({
          customer_id: user.id,
          client_id: status.client_id,
          profile_data: {
            onboarding_completed: false,
            onboarding_started: true,
            started_at: new Date().toISOString()
          },
          status: 'active',
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update local status
      setStatus(prev => prev ? { ...prev, onboarding_started: true } : null);
      return true;
    } catch (error) {
      console.error('Error marking onboarding started:', error);
      return false;
    }
  }, [user?.id, status?.client_id]);

  const markOnboardingCompleted = useCallback(async (profileData: any = {}) => {
    if (!user?.id || !status?.client_id) return false;

    try {
      const { error } = await supabase
        .from('customer_profiles')
        .upsert({
          customer_id: user.id,
          client_id: status.client_id,
          profile_data: {
            ...profileData,
            onboarding_completed: true,
            onboarding_started: true,
            completed_at: new Date().toISOString()
          },
          status: 'active',
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update local status
      setStatus(prev => prev ? { 
        ...prev, 
        onboarding_completed: true, 
        onboarding_started: true 
      } : null);

      toast({
        title: "مبروك!",
        description: "تم إكمال عملية الإعداد بنجاح",
      });

      return true;
    } catch (error) {
      console.error('Error marking onboarding completed:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في حفظ البيانات",
        variant: "destructive",
      });
      return false;
    }
  }, [user?.id, status?.client_id, toast]);

  useEffect(() => {
    checkOnboardingStatus();
  }, [checkOnboardingStatus]);

  return {
    status,
    loading,
    checkOnboardingStatus,
    markOnboardingStarted,
    markOnboardingCompleted,
    isComplete: status?.onboarding_completed || false,
    needsOnboarding: status?.exists && !status?.onboarding_completed,
    needsSetup: status?.needs_setup || false
  };
};
