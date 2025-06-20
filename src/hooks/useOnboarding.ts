
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface OnboardingProgress {
  id: string;
  user_id: string;
  client_id: string;
  current_step: number;
  total_steps: number;
  completed_steps: number[];
  step_data: Record<string, any>;
  completion_percentage: number;
  is_completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  component: string;
  required: boolean;
  completed: boolean;
}

export const useOnboarding = () => {
  const { user } = useAuth();
  const [onboardingData, setOnboardingData] = useState<OnboardingProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(false);

  const steps: OnboardingStep[] = [
    { id: 1, title: 'مرحباً بك', description: 'التعرف على مورفو AI', component: 'Welcome', required: true, completed: false },
    { id: 2, title: 'معلومات الشركة', description: 'أخبرنا عن شركتك', component: 'CompanyInfo', required: true, completed: false },
    { id: 3, title: 'الأهداف التسويقية', description: 'ما هي أهدافك؟', component: 'MarketingGoals', required: true, completed: false },
    { id: 4, title: 'الجمهور المستهدف', description: 'من هم عملاؤك؟', component: 'TargetAudience', required: true, completed: false },
    { id: 5, title: 'الميزانية', description: 'ما هي ميزانيتك التسويقية؟', component: 'Budget', required: true, completed: false },
    { id: 6, title: 'القنوات المفضلة', description: 'أين تريد التسويق؟', component: 'Channels', required: false, completed: false },
    { id: 7, title: 'الخبرة السابقة', description: 'خبرتك في التسويق الرقمي', component: 'Experience', required: false, completed: false },
    { id: 8, title: 'الإعداد النهائي', description: 'جاهز للبدء!', component: 'Completion', required: true, completed: false }
  ];

  const fetchOnboardingData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching onboarding data:', error);
        return;
      }

      if (data) {
        setOnboardingData(data);
        setIsFirstTime(false);
      } else {
        // First time user - create onboarding record
        await createOnboardingRecord();
        setIsFirstTime(true);
      }
    } catch (error) {
      console.error('Error in fetchOnboardingData:', error);
    } finally {
      setLoading(false);
    }
  };

  const createOnboardingRecord = async () => {
    if (!user) return;

    try {
      // Get client ID
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!clientData) return;

      const { data, error } = await supabase
        .from('onboarding_progress')
        .insert([{
          user_id: user.id,
          client_id: clientData.id,
          current_step: 1,
          total_steps: 8,
          completed_steps: [],
          step_data: {},
          completion_percentage: 0,
          is_completed: false
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating onboarding record:', error);
        return;
      }

      setOnboardingData(data);
    } catch (error) {
      console.error('Error in createOnboardingRecord:', error);
    }
  };

  const updateStep = async (stepNumber: number, stepData: Record<string, any>) => {
    if (!onboardingData || !user) return;

    try {
      const completedSteps = [...(onboardingData.completed_steps || [])];
      if (!completedSteps.includes(stepNumber)) {
        completedSteps.push(stepNumber);
      }

      const newStepData = { ...onboardingData.step_data, [stepNumber]: stepData };
      const completionPercentage = Math.round((completedSteps.length / onboardingData.total_steps) * 100);
      const isCompleted = completedSteps.length >= onboardingData.total_steps;

      const updateData = {
        current_step: Math.max(stepNumber + 1, onboardingData.current_step),
        completed_steps: completedSteps,
        step_data: newStepData,
        completion_percentage: completionPercentage,
        is_completed: isCompleted,
        ...(isCompleted && { completed_at: new Date().toISOString() })
      };

      const { data, error } = await supabase
        .from('onboarding_progress')
        .update(updateData)
        .eq('id', onboardingData.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating onboarding step:', error);
        return false;
      }

      setOnboardingData(data);

      // Log interaction
      await logInteraction('onboarding_step_completed', {
        step: stepNumber,
        step_data: stepData,
        completion_percentage: completionPercentage
      });

      return true;
    } catch (error) {
      console.error('Error in updateStep:', error);
      return false;
    }
  };

  const logInteraction = async (interactionType: string, interactionData: Record<string, any>) => {
    if (!user) return;

    try {
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!clientData) return;

      await supabase
        .from('user_interactions')
        .insert([{
          user_id: user.id,
          client_id: clientData.id,
          interaction_type: interactionType,
          interaction_data: interactionData,
          page_url: window.location.pathname,
          session_id: sessionStorage.getItem('session_id') || 'unknown'
        }]);
    } catch (error) {
      console.error('Error logging interaction:', error);
    }
  };

  const getStepsWithProgress = () => {
    if (!onboardingData) return steps;

    return steps.map(step => ({
      ...step,
      completed: onboardingData.completed_steps?.includes(step.id) || false
    }));
  };

  const getCurrentStep = () => {
    return onboardingData?.current_step || 1;
  };

  const getCompletionPercentage = () => {
    return onboardingData?.completion_percentage || 0;
  };

  const isOnboardingComplete = () => {
    return onboardingData?.is_completed || false;
  };

  const skipStep = async (stepNumber: number) => {
    return await updateStep(stepNumber, { skipped: true });
  };

  useEffect(() => {
    fetchOnboardingData();
  }, [user]);

  return {
    onboardingData,
    loading,
    isFirstTime,
    steps: getStepsWithProgress(),
    currentStep: getCurrentStep(),
    completionPercentage: getCompletionPercentage(),
    isComplete: isOnboardingComplete(),
    updateStep,
    skipStep,
    logInteraction,
    refetch: fetchOnboardingData
  };
};
