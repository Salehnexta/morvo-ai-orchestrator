
import { useState, useEffect } from 'react';
import { MorvoAIService } from '@/services/morvoAIService';
import { useAuth } from '@/contexts/AuthContext';

export interface EnhancedOnboardingData {
  journey?: {
    id: string;
    client_id: string;
    current_phase: number;
    completed_phases: string[];
    greeting_preference?: string;
    profile_data: any;
    phase_times: Record<string, number>;
    started_at: string;
    last_updated: string;
  };
  questions?: Array<{
    id: string;
    question: string;
    type: string;
    options?: Array<{ value: string; label: string; }>;
    required: boolean;
  }>;
}

export const useEnhancedOnboarding = () => {
  const { user } = useAuth();
  const [onboardingData, setOnboardingData] = useState<EnhancedOnboardingData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJourneyStatus = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const [journeyResponse, questionsResponse] = await Promise.all([
        MorvoAIService.getJourneyStatus(),
        MorvoAIService.getOnboardingQuestions('ar')
      ]);

      setOnboardingData({
        journey: journeyResponse.journey,
        questions: questionsResponse.questions
      });
    } catch (error) {
      console.error('Error fetching onboarding data:', error);
      setError('Failed to load onboarding data');
    } finally {
      setLoading(false);
    }
  };

  const saveGreeting = async (greeting: string) => {
    try {
      await MorvoAIService.saveGreetingPreference(greeting);
      // Refresh journey status
      await fetchJourneyStatus();
      return true;
    } catch (error) {
      console.error('Error saving greeting:', error);
      return false;
    }
  };

  const updatePhase = async (phase: string, completed: boolean, duration: number = 0) => {
    try {
      const response = await MorvoAIService.updateJourneyPhase(phase, completed, duration);
      // Refresh journey status
      await fetchJourneyStatus();
      return response;
    } catch (error) {
      console.error('Error updating phase:', error);
      return null;
    }
  };

  const saveProfile = async (profileData: any) => {
    try {
      const response = await MorvoAIService.saveProfileData(profileData);
      // Refresh journey status
      await fetchJourneyStatus();
      return response;
    } catch (error) {
      console.error('Error saving profile:', error);
      return null;
    }
  };

  const analyzeWebsite = async (websiteUrl: string) => {
    try {
      const analysis = await MorvoAIService.analyzeWebsite(websiteUrl);
      return analysis;
    } catch (error) {
      console.error('Error analyzing website:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchJourneyStatus();
  }, [user]);

  return {
    onboardingData,
    loading,
    error,
    saveGreeting,
    updatePhase,
    saveProfile,
    analyzeWebsite,
    refetch: fetchJourneyStatus
  };
};
