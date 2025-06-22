
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfileService } from '@/services/userProfileService';

export interface OnboardingStep {
  id: string;
  title: string;
  completed: boolean;
  data?: any;
}

export const useOnboarding = () => {
  const { user } = useAuth();
  const [steps, setSteps] = useState<OnboardingStep[]>([
    { id: 'welcome', title: 'مرحباً بك', completed: false },
    { id: 'company-info', title: 'معلومات الشركة', completed: false },
    { id: 'website-analysis', title: 'تحليل الموقع', completed: false },
    { id: 'marketing-goals', title: 'أهداف التسويق', completed: false },
    { id: 'target-audience', title: 'الجمهور المستهدف', completed: false },
    { id: 'budget', title: 'الميزانية', completed: false },
    { id: 'completion', title: 'اكتمال الإعداد', completed: false }
  ]);
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOnboardingData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Use user_profiles table instead of customer_profiles
        const userProfile = await UserProfileService.getUserProfile(user.id);
        
        if (userProfile) {
          // Update steps based on user profile completeness
          const updatedSteps = steps.map(step => {
            switch (step.id) {
              case 'welcome':
                return { ...step, completed: !!userProfile.greeting_preference };
              case 'company-info':
                return { ...step, completed: !!userProfile.company_name };
              case 'website-analysis':
                return { ...step, completed: !!userProfile.website_url };
              case 'marketing-goals':
                return { ...step, completed: !!userProfile.primary_marketing_goals && userProfile.primary_marketing_goals.length > 0 };
              case 'target-audience':
                return { ...step, completed: !!userProfile.target_audience };
              case 'budget':
                return { ...step, completed: !!userProfile.monthly_marketing_budget };
              case 'completion':
                return { ...step, completed: !!userProfile.onboarding_completed };
              default:
                return step;
            }
          });

          setSteps(updatedSteps);
          
          // Find current step
          const nextIncompleteIndex = updatedSteps.findIndex(step => !step.completed);
          setCurrentStepIndex(nextIncompleteIndex === -1 ? updatedSteps.length - 1 : nextIncompleteIndex);
        }
      } catch (error) {
        console.error('Error loading onboarding data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOnboardingData();
  }, [user]);

  const saveStepData = async (stepId: string, data: any) => {
    if (!user) return false;

    try {
      // Save to user_profiles table
      await UserProfileService.saveUserProfile(user.id, data);
      
      // Update local state
      setSteps(prev => prev.map(step => 
        step.id === stepId 
          ? { ...step, completed: true, data }
          : step
      ));

      return true;
    } catch (error) {
      console.error('Error saving step data:', error);
      return false;
    }
  };

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const previousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStepIndex(stepIndex);
    }
  };

  const completeOnboarding = async () => {
    if (!user) return false;

    try {
      await UserProfileService.saveUserProfile(user.id, {
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString()
      });

      setSteps(prev => prev.map(step => 
        step.id === 'completion' 
          ? { ...step, completed: true }
          : step
      ));

      return true;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return false;
    }
  };

  const progress = Math.round((steps.filter(step => step.completed).length / steps.length) * 100);

  return {
    steps,
    currentStep: steps[currentStepIndex],
    currentStepIndex,
    progress,
    loading,
    nextStep,
    previousStep,
    goToStep,
    saveStepData,
    completeOnboarding
  };
};
