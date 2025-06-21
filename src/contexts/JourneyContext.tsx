
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
  hasExistingJourney: boolean;
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
  const [hasExistingJourney, setHasExistingJourney] = useState(false);
  const [journeyInitialized, setJourneyInitialized] = useState(false);

  // Load existing journey on mount
  useEffect(() => {
    const loadJourney = async () => {
      if (!user?.id || journeyInitialized) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('🔍 Loading journey for user:', user.id);

        // Check for existing journey
        const existingJourney = await JourneyManager.checkExistingJourney(user.id);
        
        if (existingJourney) {
          setJourney(existingJourney);
          setHasExistingJourney(true);
          
          // Get journey status
          const status = await JourneyManager.getJourneyStatus(existingJourney.journey_id);
          setJourneyStatus(status);
          
          // Store journey ID locally for quick access
          localStorage.setItem(`journey_${user.id}`, existingJourney.journey_id);
          
          console.log('✅ Loaded existing journey:', existingJourney);
        } else {
          console.log('ℹ️ No existing journey found for user');
          setHasExistingJourney(false);
        }

        setJourneyInitialized(true);
      } catch (err) {
        console.error('❌ Error loading journey:', err);
        setError('Failed to load journey');
        setHasExistingJourney(false);
      } finally {
        setLoading(false);
      }
    };

    loadJourney();
  }, [user?.id, journeyInitialized]);

  const startJourney = async () => {
    if (!user?.id || hasExistingJourney) {
      console.log('ℹ️ Skipping journey start - user exists or has journey');
      return;
    }

    setLoading(true);
    try {
      console.log('🚀 Starting new journey for user:', user.id);
      const newJourney = await JourneyManager.startJourney(user.id);
      
      if (newJourney) {
        setJourney(newJourney);
        setHasExistingJourney(true);
        
        // Store journey ID locally
        localStorage.setItem(`journey_${user.id}`, newJourney.journey_id);
        
        // Get initial status
        const status = await JourneyManager.getJourneyStatus(newJourney.journey_id);
        setJourneyStatus(status);
        
        console.log('✅ Journey started successfully:', newJourney);
      }
    } catch (err) {
      console.error('❌ Error starting journey:', err);
      setError('Failed to start journey');
    } finally {
      setLoading(false);
    }
  };

  const updateJourneyPhase = (phase: string) => {
    console.log('🔄 Updating journey phase to:', phase);
    if (journey) {
      const updatedJourney = { ...journey, current_phase: phase };
      setJourney(updatedJourney);
    }
    if (journeyStatus) {
      const updatedStatus = { ...journeyStatus, current_phase: phase };
      setJourneyStatus(updatedStatus);
    }
  };

  const setGreeting = async (greeting: string): Promise<boolean> => {
    if (!journey) {
      console.warn('⚠️ No journey found, cannot save greeting');
      return false;
    }
    
    console.log('💾 Saving greeting preference:', greeting);
    const success = await JourneyManager.setGreetingPreference(journey.journey_id, greeting);
    if (success) {
      setJourneyStatus(prev => prev ? { ...prev, greeting_preference: greeting } : null);
      console.log('✅ Greeting preference saved successfully');
      return true;
    } else {
      console.error('❌ Failed to save greeting preference');
      return false;
    }
  };

  const analyzeWebsite = async (url: string): Promise<boolean> => {
    if (!journey) return false;
    
    console.log('🔍 Analyzing website:', url);
    try {
      const success = await JourneyManager.startWebsiteAnalysis(journey.journey_id, url);
      if (success) {
        setJourneyStatus(prev => prev ? { ...prev, website_url: url } : null);
        console.log('✅ Website analysis started successfully');
      }
      return success;
    } catch (error) {
      console.error('❌ Website analysis failed:', error);
      return false;
    }
  };

  const saveAnswer = async (questionId: string, answer: string): Promise<boolean> => {
    if (!journey) return false;
    
    console.log('💾 Saving answer:', questionId, answer);
    try {
      const success = await JourneyManager.saveProfileAnswer(journey.journey_id, questionId, answer);
      console.log(success ? '✅ Answer saved successfully' : '❌ Failed to save answer');
      return success;
    } catch (error) {
      console.error('❌ Save answer failed:', error);
      return false;
    }
  };

  const generateStrategy = async (): Promise<any> => {
    if (!journey) return null;
    
    console.log('🎯 Generating strategy');
    try {
      const strategy = await JourneyManager.generateStrategy(journey.journey_id);
      if (strategy) {
        setJourneyStatus(prev => prev ? { ...prev, strategy_generated: true } : null);
        console.log('✅ Strategy generated successfully');
      }
      return strategy;
    } catch (error) {
      console.error('❌ Strategy generation failed:', error);
      return null;
    }
  };

  const activateCommitment = async (): Promise<boolean> => {
    if (!journey) return false;
    
    console.log('🎯 Activating commitment');
    try {
      const success = await JourneyManager.activateCommitment(journey.journey_id);
      if (success) {
        setJourney(prev => prev ? { ...prev, is_completed: true } : null);
        setJourneyStatus(prev => prev ? { ...prev, completed: true } : null);
        console.log('✅ Commitment activated successfully');
      }
      return success;
    } catch (error) {
      console.error('❌ Commitment activation failed:', error);
      return false;
    }
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
      progress,
      hasExistingJourney
    }}>
      {children}
    </JourneyContext.Provider>
  );
};
