
import { useState, useEffect, useCallback } from 'react';
import { useJourney } from '@/contexts/JourneyContext';
import { useAuth } from '@/contexts/AuthContext';

interface OnboardingStatus {
  exists: boolean;
  onboarding_completed: boolean;
  onboarding_started: boolean;
  client_id?: string;
  needs_setup: boolean;
  profile_exists: boolean;
  journey_id?: string;
  current_phase?: string;
  profile_progress?: number;
}

export const useSmartOnboarding = () => {
  const [status, setStatus] = useState<OnboardingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { 
    journey, 
    journeyStatus, 
    loading: journeyLoading, 
    isOnboardingComplete,
    currentPhase,
    progress 
  } = useJourney();

  const checkOnboardingStatus = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return null;
    }

    // Use journey context data instead of direct database queries
    const onboardingStatus: OnboardingStatus = {
      exists: !!journey,
      onboarding_completed: isOnboardingComplete,
      onboarding_started: !!journey,
      client_id: user.id,
      needs_setup: !isOnboardingComplete,
      profile_exists: !!journeyStatus,
      journey_id: journey?.journey_id,
      current_phase: currentPhase,
      profile_progress: progress
    };

    setStatus(onboardingStatus);
    return onboardingStatus;
  }, [user?.id, journey, journeyStatus, isOnboardingComplete, currentPhase, progress]);

  const markOnboardingStarted = useCallback(async () => {
    // This is now handled by the Journey context
    if (journey) {
      setStatus(prev => prev ? { ...prev, onboarding_started: true } : null);
      return true;
    }
    return false;
  }, [journey]);

  const markOnboardingCompleted = useCallback(async (profileData: any = {}) => {
    // This is now handled by the Journey context
    if (isOnboardingComplete) {
      setStatus(prev => prev ? { 
        ...prev, 
        onboarding_completed: true, 
        onboarding_started: true 
      } : null);
      return true;
    }
    return false;
  }, [isOnboardingComplete]);

  useEffect(() => {
    if (!journeyLoading) {
      checkOnboardingStatus();
      setLoading(false);
    }
  }, [checkOnboardingStatus, journeyLoading]);

  return {
    status,
    loading: loading || journeyLoading,
    checkOnboardingStatus,
    markOnboardingStarted,
    markOnboardingCompleted,
    isComplete: isOnboardingComplete,
    needsOnboarding: !isOnboardingComplete && !!journey,
    needsSetup: !isOnboardingComplete
  };
};
