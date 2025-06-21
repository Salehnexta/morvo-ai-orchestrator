
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
      
      // Get client record
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id, name, email')
        .eq('user_id', user.id)
        .maybeSingle();

      if (clientError) {
        console.error('Error getting client:', clientError);
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
      const { data: profileData, error: profileError } = await supabase
        .from('customer_profiles')
        .select('profile_data, status')
        .eq('customer_id', user.id)
        .eq('client_id', clientData.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error getting profile:', profileError);
      }

      // Safely extract profile data
      const profileJson = profileData?.profile_data as any;
      const onboardingCompleted = profileJson?.onboarding_completed === true;
      const onboardingStarted = profileJson?.onboarding_started === true;

      const onboardingStatus: OnboardingStatus = {
        exists: true,
        client_id: clientData.id,
        profile_exists: !!profileData,
        onboarding_completed: onboardingCompleted,
        onboarding_started: onboardingStarted,
        needs_setup: false
      };

      setStatus(onboardingStatus);
      return onboardingStatus;
    } catch (error) {
      console.error('Error in checkOnboardingStatus:', error);
      const fallbackStatus = {
        exists: false,
        onboarding_completed: false,
        onboarding_started: false,
        needs_setup: true,
        profile_exists: false
      };
      setStatus(fallbackStatus);
      return fallbackStatus;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

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
