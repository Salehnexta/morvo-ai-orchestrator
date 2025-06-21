
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface OnboardingStep {
  id: number;
  component: string;
  required: boolean;
}

export const useOnboarding = () => {
  const { user } = useAuth();
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  // Define the onboarding steps
  const steps: OnboardingStep[] = [
    { id: 1, component: 'Welcome', required: true },
    { id: 2, component: 'CompanyInfo', required: true },
    { id: 3, component: 'MarketingGoals', required: true },
    { id: 4, component: 'TargetAudience', required: true },
    { id: 5, component: 'Budget', required: true },
    { id: 6, component: 'Channels', required: true },
    { id: 7, component: 'Experience', required: true },
    { id: 8, component: 'Completion', required: true }
  ];

  const completionPercentage = (currentStep / steps.length) * 100;

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 Checking onboarding status for user:', user.id);
        
        // Check customer_profiles table for completion status
        const { data: profileData, error: profileError } = await supabase
          .from('customer_profiles')
          .select('profile_data, status')
          .eq('customer_id', user.id)
          .maybeSingle();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error checking profile:', profileError);
          setIsComplete(false);
          setLoading(false);
          return;
        }

        // Check if onboarding is marked as completed
        let onboardingCompleted = false;
        if (profileData?.profile_data && typeof profileData.profile_data === 'object') {
          onboardingCompleted = (profileData.profile_data as any)?.onboarding_completed === true;
        }
        
        console.log('📊 Onboarding status:', {
          profileExists: !!profileData,
          onboardingCompleted,
          profileData: profileData?.profile_data
        });

        setIsComplete(onboardingCompleted);
        
      } catch (error) {
        console.error('Error in checkOnboardingStatus:', error);
        setIsComplete(false);
      } finally {
        setLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [user]);

  const updateStep = async (stepId: number, stepData: any) => {
    console.log('📝 Updating step:', stepId, stepData);
    // Here you could save step data to the database if needed
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
    return true;
  };

  const skipStep = async (stepId: number) => {
    console.log('⏭️ Skipping step:', stepId);
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
    return true;
  };

  const markComplete = async () => {
    if (!user) return false;

    try {
      // Get client record
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!clientData) {
        console.error('No client record found');
        return false;
      }

      // Update profile with completion status
      const { error } = await supabase
        .from('customer_profiles')
        .upsert({
          customer_id: user.id,
          client_id: clientData.id,
          profile_data: {
            onboarding_completed: true,
            completed_at: new Date().toISOString()
          },
          status: 'active',
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error marking onboarding complete:', error);
        return false;
      }

      setIsComplete(true);
      return true;
    } catch (error) {
      console.error('Error in markComplete:', error);
      return false;
    }
  };

  return {
    isComplete,
    loading,
    markComplete,
    steps,
    currentStep,
    completionPercentage,
    updateStep,
    skipStep
  };
};
