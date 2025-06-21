
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { JourneyManager, JourneyStatus, OnboardingJourney } from '@/services/journeyManager';

interface JourneyContextType {
  journey: OnboardingJourney | null;
  journeyStatus: JourneyStatus | null;
  loading: boolean;
  error: string | null;
  startJourney: () => Promise<void>;
  updateJourneyPhase: (phase: string) => void;
  setGreeting: (greeting: string) => Promise<boolean>;
  analyzeWebsite: (url: string) => Promise<boolean>;
  saveAnswer: (questionId: string, answer: string) => Promise<boolean>;
  generateStrategy: () => Promise<any>;
  activateCommitment: () => Promise<boolean>;
  isOnboardingComplete: boolean;
  currentPhase: string;
  progress: number;
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export const useJourney = () => {
  const context = useContext(JourneyContext);
  if (!context) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
};

interface JourneyProviderProps {
  children: ReactNode;
}

export const JourneyProvider: React.FC<JourneyProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [journey, setJourney] = useState<OnboardingJourney | null>(null);
  const [journeyStatus, setJourneyStatus] = useState<JourneyStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load existing journey on mount
  useEffect(() => {
    const loadJourney = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        // Check if user has an existing journey ID stored locally
        const storedJourneyId = localStorage.getItem(`journey_${user.id}`);
        
        if (storedJourneyId) {
          const status = await JourneyManager.getJourneyStatus(storedJourneyId);
          if (status) {
            setJourneyStatus(status);
            setJourney({
              journey_id: status.journey_id,
              client_id: user.id,
              current_phase: status.current_phase,
              profile_progress: status.profile_progress,
              is_completed: status.completed,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
            console.log('✅ Loaded existing journey:', status);
          }
        }
      } catch (err) {
        console.error('❌ Error loading journey:', err);
        setError('Failed to load journey');
      } finally {
        setLoading(false);
      }
    };

    loadJourney();
  }, [user?.id]);

  const startJourney = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const newJourney = await JourneyManager.startJourney(user.id);
      if (newJourney) {
        setJourney(newJourney);
        
        // Store journey ID locally
        localStorage.setItem(`journey_${user.id}`, newJourney.journey_id);
        
        // Get initial status
        const status = await JourneyManager.getJourneyStatus(newJourney.journey_id);
        setJourneyStatus(status);
        
        console.log('✅ Journey started successfully');
      }
    } catch (err) {
      console.error('❌ Error starting journey:', err);
      setError('Failed to start journey');
    } finally {
      setLoading(false);
    }
  };

  const updateJourneyPhase = (phase: string) => {
    if (journey) {
      setJourney(prev => prev ? { ...prev, current_phase: phase } : null);
    }
    if (journeyStatus) {
      setJourneyStatus(prev => prev ? { ...prev, current_phase: phase } : null);
    }
  };

  const setGreeting = async (greeting: string): Promise<boolean> => {
    if (!journey) return false;
    
    const success = await JourneyManager.setGreetingPreference(journey.journey_id, greeting);
    if (success) {
      setJourneyStatus(prev => prev ? { ...prev, greeting_preference: greeting } : null);
    }
    return success;
  };

  const analyzeWebsite = async (url: string): Promise<boolean> => {
    if (!journey) return false;
    
    const success = await JourneyManager.startWebsiteAnalysis(journey.journey_id, url);
    if (success) {
      setJourneyStatus(prev => prev ? { ...prev, website_url: url } : null);
    }
    return success;
  };

  const saveAnswer = async (questionId: string, answer: string): Promise<boolean> => {
    if (!journey) return false;
    
    return await JourneyManager.saveProfileAnswer(journey.journey_id, questionId, answer);
  };

  const generateStrategy = async (): Promise<any> => {
    if (!journey) return null;
    
    const strategy = await JourneyManager.generateStrategy(journey.journey_id);
    if (strategy) {
      setJourneyStatus(prev => prev ? { ...prev, strategy_generated: true } : null);
    }
    return strategy;
  };

  const activateCommitment = async (): Promise<boolean> => {
    if (!journey) return false;
    
    const success = await JourneyManager.activateCommitment(journey.journey_id);
    if (success) {
      setJourneyStatus(prev => prev ? { ...prev, completed: true } : null);
      setJourney(prev => prev ? { ...prev, is_completed: true } : null);
    }
    return success;
  };

  const isOnboardingComplete = journeyStatus?.completed || journey?.is_completed || false;
  const currentPhase = journeyStatus?.current_phase || journey?.current_phase || 'welcome';
  const progress = journeyStatus?.profile_progress || JourneyManager.calculateProgress(currentPhase);

  return (
    <JourneyContext.Provider value={{
      journey,
      journeyStatus,
      loading,
      error,
      startJourney,
      updateJourneyPhase,
      setGreeting,
      analyzeWebsite,
      saveAnswer,
      generateStrategy,
      activateCommitment,
      isOnboardingComplete,
      currentPhase,
      progress
    }}>
      {children}
    </JourneyContext.Provider>
  );
};
